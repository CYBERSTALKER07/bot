import React, { useState, useRef, useCallback, useMemo } from 'react';
import { Camera, Upload, Loader2 } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import Button from './Button';
import { cn } from '../../lib/cva';

interface ImageUploadProps {
  type: 'avatar' | 'cover';
  onUploadSuccess?: (imageUrl: string) => void;
  onFileSelected?: (file: File) => void;
  onUploadError: (error: string) => void;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
}

export default function ImageUpload({
  type,
  onUploadSuccess,
  onFileSelected,
  onUploadError,
  className = '',
  size = 'md',
  disabled = false
}: ImageUploadProps) {
  const { user } = useAuth();
  const { isDark } = useTheme();
  const [isUploading, setIsUploading] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Debug log when component mounts
  console.log('🎬 ImageUpload component mounted:', { 
    type, 
    hasOnFileSelected: !!onFileSelected, 
    hasOnUploadSuccess: !!onUploadSuccess,
    disabled,
    user: !!user
  });

  const maxFileSize = type === 'avatar' ? 5 * 1024 * 1024 : 10 * 1024 * 1024; // 5MB for avatar, 10MB for cover
  const acceptedTypes = useMemo(() => ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'], []);

  const validateFile = useCallback((file: File): string | null => {
    if (!acceptedTypes.includes(file.type)) {
      return 'Please upload a valid image file (JPEG, PNG, or WebP)';
    }
    if (file.size > maxFileSize) {
      const maxSizeMB = maxFileSize / (1024 * 1024);
      return `File size must be less than ${maxSizeMB}MB`;
    }
    return null;
  }, [maxFileSize, acceptedTypes]);

  const uploadToSupabase = useCallback(async (file: File): Promise<string> => {
    if (!user) throw new Error('User not authenticated');

    const fileExt = file.name.split('.').pop();
    const fileName = `${user.id}/${type}-${Date.now()}.${fileExt}`;
    
    console.log(`📤 Uploading ${type} image:`, fileName);
    
    // Try specific bucket first, fallback to general bucket
    let bucketName = type === 'avatar' ? 'avatars' : 'cover-images';
    
    // First attempt with specific bucket
    let { data, error } = await supabase.storage
      .from(bucketName)
      .upload(fileName, file, {
        cacheControl: '3600',
        upsert: true
      });

    console.log(`🪣 First attempt with bucket '${bucketName}':`, { data, error });

    // If specific bucket fails, try a general 'images' bucket
    if (error && error.message.includes('Bucket not found')) {
      console.log(`Bucket '${bucketName}' not found, trying 'images' bucket...`);
      bucketName = 'images';
      
      const result = await supabase.storage
        .from(bucketName)
        .upload(fileName, file, {
          cacheControl: '3600',
          upsert: true
        });
      
      data = result.data;
      error = result.error;
      console.log(`🪣 Second attempt with bucket '${bucketName}':`, { data, error });
    }

    // If still fails, try creating a simple bucket approach
    if (error && error.message.includes('Bucket not found')) {
      console.log(`Bucket '${bucketName}' not found, trying default bucket...`);
      
      // Try with a simple file name in the root
      const simpleFileName = `${type}_${user.id}_${Date.now()}.${fileExt}`;
      bucketName = 'public';
      
      const result = await supabase.storage
        .from(bucketName)
        .upload(simpleFileName, file, {
          cacheControl: '3600',
          upsert: true
        });
      
      data = result.data;
      error = result.error;
      console.log(`🪣 Third attempt with bucket '${bucketName}':`, { data, error });
    }

    if (error) {
      console.error('❌ Supabase storage error:', error);
      throw new Error(`Upload failed: ${error.message}. Please ensure storage is properly configured.`);
    }

    if (!data) {
      throw new Error('Upload failed: No data returned from storage');
    }

    // Get public URL
    const { data: { publicUrl } } = supabase.storage
      .from(bucketName)
      .getPublicUrl(data.path);

    console.log(`✅ Upload successful! Public URL:`, publicUrl);
    return publicUrl;
  }, [user, type]);

  const handleFileUpload = useCallback(async (file: File) => {
    const validationError = validateFile(file);
    if (validationError) {
      onUploadError(validationError);
      return;
    }

    setIsUploading(true);
    
    try {
      // Upload to Supabase
      const imageUrl = await uploadToSupabase(file);
      onUploadSuccess?.(imageUrl);
    } catch (error) {
      console.error('Upload error:', error);
      onUploadError(error instanceof Error ? error.message : 'Upload failed');
    } finally {
      setIsUploading(false);
    }
  }, [validateFile, uploadToSupabase, onUploadSuccess, onUploadError]);

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (disabled || isUploading) return;

    const files = Array.from(e.dataTransfer.files);
    if (files && files[0]) {
      onFileSelected?.(files[0]);
      handleFileUpload(files[0]);
    }
  }, [disabled, isUploading, handleFileUpload, onFileSelected]);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    console.log('📂 File selected:', e.target.files?.length, 'files');
    const files = Array.from(e.target.files || []);
    if (files && files[0]) {
      console.log('📎 Processing file:', files[0].name, files[0].type, files[0].size);
      // If we have onFileSelected callback, use it (for cover uploads)
      if (onFileSelected) {
        console.log('🎯 Using onFileSelected callback for file:', files[0].name);
        onFileSelected(files[0]);
      } else {
        // Otherwise, handle the upload directly (for avatar uploads)
        console.log('🎯 Using handleFileUpload for file:', files[0].name);
        handleFileUpload(files[0]);
      }
    }
  };

  const openFileDialog = () => {
    console.log('🔘 Upload button clicked!', { 
      type, 
      disabled, 
      isUploading, 
      user: !!user,
      hasOnFileSelected: !!onFileSelected,
      hasOnUploadSuccess: !!onUploadSuccess
    });
    if (!disabled && !isUploading) {
      console.log('📁 Opening file dialog...');
      fileInputRef.current?.click();
    } else {
      console.log('❌ Upload blocked:', { disabled, isUploading, hasUser: !!user });
    }
  };

  const sizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-10 h-10',
    lg: 'w-12 h-12'
  };

  const iconSizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6'
  };

  if (type === 'avatar') {
    return (
      <div 
        className={cn(
          'relative group cursor-pointer',
          sizeClasses[size],
          className
        )}
        onClick={openFileDialog}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        {/* Upload overlay */}
        <div className={cn(
          'absolute inset-0 rounded-full flex items-center justify-center transition-all duration-200',
          isUploading 
            ? 'bg-black/60 opacity-100' 
            : 'bg-black/50 opacity-0 group-hover:opacity-100',
          dragActive && 'opacity-100 bg-blue-500/50'
        )}>
          {isUploading ? (
            <Loader2 className={cn(iconSizeClasses[size], 'text-white animate-spin')} />
          ) : (
            <Camera className={cn(iconSizeClasses[size], 'text-white')} />
          )}
        </div>

        {/* Hidden file input */}
        <input
          ref={fileInputRef}
          type="file"
          accept={acceptedTypes.join(',')}
          onChange={handleFileSelect}
          className="hidden"
          disabled={disabled || isUploading}
        />
      </div>
    );
  }

  // Cover image upload
  return (
    <div 
      className={cn('relative', className)}
      onDragEnter={handleDrag}
      onDragLeave={handleDrag}
      onDragOver={handleDrag}
      onDrop={handleDrop}
    >
      {/* Test with basic button first */}
      <button
        onClick={openFileDialog}
        disabled={disabled || isUploading}
        className={cn(
          'p-2 rounded-full backdrop-blur-sm border transition-colors',
          isDark ? 'bg-black/50 hover:bg-black/70 border-white/20' : 'bg-white/50 hover:bg-white/70 border-gray-300',
          disabled || isUploading ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'
        )}
        style={{ zIndex: 1000 }} // Force high z-index
      >
        {isUploading ? (
          <Loader2 className="w-4 h-4 animate-spin text-gray-700" />
        ) : (
          <Camera className="w-4 h-4 text-gray-700" />
        )}
      </button>

      {/* Drag overlay for cover */}
      {dragActive && (
        <div className="absolute inset-0 bg-blue-500/20 border-2 border-blue-500 border-dashed rounded-lg flex items-center justify-center pointer-events-none">
          <div className="text-center">
            <Upload className="w-8 h-8 text-blue-500 mx-auto mb-2" />
            <p className="text-sm font-medium text-blue-500">Drop image here</p>
          </div>
        </div>
      )}

      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        accept={acceptedTypes.join(',')}
        onChange={handleFileSelect}
        className="hidden"
        disabled={disabled || isUploading}
      />
    </div>
  );
}