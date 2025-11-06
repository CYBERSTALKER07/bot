import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  X,
  Image as ImageIcon,
  Video,
  Smile,
  MapPin,
  Calendar,
  Users,
  Globe,
  Lock,
  Users2,
  Camera,
  ArrowLeft,
  Send,
  Plus,
  AlertCircle,
  CheckCircle,
  Crop
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { supabase } from '../lib/supabase';
import Button from './ui/Button';
import Avatar from './ui/Avatar';
import PageLayout from './ui/PageLayout';
import { cn } from '../lib/cva';

interface NewPost {
  content: string;
  media_type: 'text' | 'image' | 'video';
  visibility: 'public' | 'connections' | 'private';
  location?: string;
  tags?: string[];
  image_url?: string;
  video_url?: string;
}

interface ImageValidation {
  isValid: boolean;
  size: number;
  dimensions: { width: number; height: number };
  aspectRatio: string;
  warnings: string[];
  suggestions: string[];
}

// X/Twitter image optimization constants
const X_IMAGE_SPECS = {
  RECOMMENDED_16_9: { width: 1200, height: 675 },
  RECOMMENDED_SQUARE: { width: 1080, height: 1080 },
  MAX_FILE_SIZE: 5 * 1024 * 1024, // 5MB
  SUPPORTED_FORMATS: ['image/jpeg', 'image/jpg', 'image/png', 'image/gif'],
  ASPECT_RATIOS: {
    '16:9': 16/9,
    '1:1': 1,
    '4:5': 4/5,
    '2:1': 2
  }
};

export default function CreatePost() {
  const { user } = useAuth();
  const { isDark } = useTheme();
  const navigate = useNavigate();
  
  const [newPost, setNewPost] = useState<NewPost>({
    content: '',
    media_type: 'text',
    visibility: 'public',
    tags: []
  });
  const [isPosting, setIsPosting] = useState(false);
  const [selectedMedia, setSelectedMedia] = useState<File | null>(null);
  const [mediaPreview, setMediaPreview] = useState<string | null>(null);
  const [characterCount, setCharacterCount] = useState(0);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [imageValidation, setImageValidation] = useState<ImageValidation | null>(null);
  const [optimizedImage, setOptimizedImage] = useState<File | null>(null);
  const [showImageOptimizer, setShowImageOptimizer] = useState(false);
  const [selectedImages, setSelectedImages] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const videoInputRef = useRef<HTMLInputElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  
  const MAX_CHARACTERS = 280;

  // X/Twitter Image Validation and Optimization Functions
  const validateImage = async (file: File): Promise<ImageValidation> => {
    return new Promise((resolve) => {
      const img = new Image();
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      
      img.onload = () => {
        const { width, height } = img;
        const aspectRatio = width / height;
        const size = file.size;
        
        const warnings: string[] = [];
        const suggestions: string[] = [];
        
        // Check file size
        if (size > X_IMAGE_SPECS.MAX_FILE_SIZE) {
          warnings.push(`File size (${(size / 1024 / 1024).toFixed(1)}MB) exceeds 5MB limit`);
          suggestions.push('Compress your image to reduce file size');
        }
        
        // Check format
        if (!X_IMAGE_SPECS.SUPPORTED_FORMATS.includes(file.type)) {
          warnings.push('Unsupported format. Use JPG, PNG, or GIF');
        }
        
        // Check dimensions and aspect ratio
        const ratio16_9 = Math.abs(aspectRatio - X_IMAGE_SPECS.ASPECT_RATIOS['16:9']);
        const ratio1_1 = Math.abs(aspectRatio - X_IMAGE_SPECS.ASPECT_RATIOS['1:1']);
        
        let recommendedRatio = '16:9';
        if (ratio1_1 < ratio16_9) {
          recommendedRatio = '1:1';
        }
        
        // Check if dimensions match recommendations
        const isOptimal16_9 = width === X_IMAGE_SPECS.RECOMMENDED_16_9.width && 
                             height === X_IMAGE_SPECS.RECOMMENDED_16_9.height;
        const isOptimalSquare = width === X_IMAGE_SPECS.RECOMMENDED_SQUARE.width && 
                               height === X_IMAGE_SPECS.RECOMMENDED_SQUARE.height;
        
        if (!isOptimal16_9 && !isOptimalSquare) {
          if (recommendedRatio === '16:9') {
            suggestions.push(`Optimize for 16:9 ratio (1200×675px) for best mobile display`);
          } else {
            suggestions.push(`Optimize for square format (1080×1080px) for consistent display`);
          }
        }
        
        // Check if image is too small
        if (width < 600 || height < 315) {
          warnings.push('Image may appear pixelated on high-resolution displays');
          suggestions.push('Use higher resolution images (minimum 600×315px)');
        }
        
        resolve({
          isValid: warnings.length === 0,
          size,
          dimensions: { width, height },
          aspectRatio: `${Math.round(aspectRatio * 100) / 100}:1`,
          warnings,
          suggestions
        });
      };
      
      img.src = URL.createObjectURL(file);
    });
  };

  const optimizeImageForX = async (file: File, targetRatio: '16:9' | '1:1' = '16:9'): Promise<File> => {
    return new Promise((resolve) => {
      const img = new Image();
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d')!;
      
      img.onload = () => {
        const { width: originalWidth, height: originalHeight } = img;
        
        // Set target dimensions based on ratio
        const targetDimensions = targetRatio === '16:9' 
          ? X_IMAGE_SPECS.RECOMMENDED_16_9 
          : X_IMAGE_SPECS.RECOMMENDED_SQUARE;
        
        canvas.width = targetDimensions.width;
        canvas.height = targetDimensions.height;
        
        // Calculate crop/resize to maintain aspect ratio and center content
        const sourceAspect = originalWidth / originalHeight;
        const targetAspect = targetDimensions.width / targetDimensions.height;
        
        let sourceX = 0, sourceY = 0, sourceWidth = originalWidth, sourceHeight = originalHeight;
        
        if (sourceAspect > targetAspect) {
          // Source is wider, crop width
          sourceWidth = originalHeight * targetAspect;
          sourceX = (originalWidth - sourceWidth) / 2;
        } else {
          // Source is taller, crop height
          sourceHeight = originalWidth / targetAspect;
          sourceY = (originalHeight - sourceHeight) / 2;
        }
        
        // Draw the optimized image
        ctx.drawImage(
          img,
          sourceX, sourceY, sourceWidth, sourceHeight,
          0, 0, targetDimensions.width, targetDimensions.height
        );
        
        // Convert to blob with quality optimization
        canvas.toBlob((blob) => {
          if (blob) {
            const optimizedFile = new File([blob], `optimized_${file.name}`, {
              type: 'image/jpeg',
              lastModified: Date.now()
            });
            resolve(optimizedFile);
          }
        }, 'image/jpeg', 0.9); // 90% quality for good balance
      };
      
      img.src = URL.createObjectURL(file);
    });
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
  };

  const uploadMedia = async (file: File): Promise<string> => {
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random()}.${fileExt}`;
      const userId = user?.id;
      
      const isVideo = file.type.startsWith('video/');
      const bucketName = isVideo ? 'videos' : 'post-images';
      const filePath = `${userId}/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from(bucketName)
        .upload(filePath, file);

      if (uploadError) {
        throw uploadError;
      }

      const { data } = supabase.storage
        .from(bucketName)
        .getPublicUrl(filePath);

      return data.publicUrl;
    } catch (error) {
      console.error('Error uploading media:', error);
      throw new Error('Failed to upload media');
    }
  };

  const createPost = async () => {
    if (!user) {
      console.error('No user logged in');
      return;
    }

    if (!newPost.content.trim() && !selectedMedia) {
      return;
    }

    setIsPosting(true);
    try {
      let mediaUrl = '';
      let mediaType = newPost.media_type;

      if (selectedMedia) {
        mediaUrl = await uploadMedia(selectedMedia);
        mediaType = selectedMedia.type.startsWith('video/') ? 'video' : 'image';
      }

      // Extract hashtags from content
      const hashtags = newPost.content.match(/#[\w]+/g)?.map(tag => tag.slice(1)) || [];

      const postData = {
        user_id: user.id,
        content: newPost.content.trim(),
        media_type: mediaType,
        visibility: newPost.visibility,
        location: newPost.location || null,
        tags: hashtags.length > 0 ? hashtags : null,
        image_url: mediaType === 'image' ? mediaUrl : null,
        video_url: mediaType === 'video' ? mediaUrl : null,
        likes_count: 0,
        comments_count: 0,
        shares_count: 0
      };

      const { error } = await supabase
        .from('posts')
        .insert([postData]);

      if (error) {
        throw error;
      }

      // Navigate back to feed
      navigate('/feed');

    } catch (error) {
      console.error('Error creating post:', error);
      alert('Failed to create post. Please try again.');
    } finally {
      setIsPosting(false);
    }
  };

  const handleContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const content = e.target.value;
    if (content.length <= MAX_CHARACTERS) {
      setNewPost(prev => ({ ...prev, content }));
      setCharacterCount(content.length);
      
      // Auto-resize textarea
      if (textareaRef.current) {
        textareaRef.current.style.height = 'auto';
        textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
      }
    }
  };

  const handleMediaSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Validate image if it's an image file
      if (file.type.startsWith('image/')) {
        const validation = await validateImage(file);
        setImageValidation(validation);
        
        // Show optimizer if image needs optimization
        if (!validation.isValid || validation.suggestions.length > 0) {
          setShowImageOptimizer(true);
        }
      }
      
      setSelectedMedia(file);
      const previewUrl = URL.createObjectURL(file);
      setMediaPreview(previewUrl);
      
      setNewPost(prev => ({
        ...prev,
        media_type: file.type.startsWith('video/') ? 'video' : 'image'
      }));
    }
  };

  const handleOptimizeImage = async (targetRatio: '16:9' | '1:1') => {
    if (selectedMedia && selectedMedia.type.startsWith('image/')) {
      try {
        const optimized = await optimizeImageForX(selectedMedia, targetRatio);
        setOptimizedImage(optimized);
        
        // Update preview with optimized image
        const newPreviewUrl = URL.createObjectURL(optimized);
        if (mediaPreview) {
          URL.revokeObjectURL(mediaPreview);
        }
        setMediaPreview(newPreviewUrl);
        setSelectedMedia(optimized);
        
        // Re-validate optimized image
        const newValidation = await validateImage(optimized);
        setImageValidation(newValidation);
        
        setShowImageOptimizer(false);
      } catch (error) {
        console.error('Error optimizing image:', error);
        alert('Failed to optimize image. Please try again.');
      }
    }
  };

  const removeMedia = () => {
    setSelectedMedia(null);
    if (mediaPreview) {
      URL.revokeObjectURL(mediaPreview);
    }
    setMediaPreview(null);
    setNewPost(prev => ({ ...prev, media_type: 'text' }));
    
    if (fileInputRef.current) fileInputRef.current.value = '';
    if (videoInputRef.current) fileInputRef.current.value = '';
  };

  const getVisibilityIcon = () => {
    switch (newPost.visibility) {
      case 'public': return <Globe className="w-4 h-4" />;
      case 'connections': return <Users2 className="w-4 h-4" />;
      case 'private': return <Lock className="w-4 h-4" />;
      default: return <Globe className="w-4 h-4" />;
    }
  };

  const canPost = (newPost.content.trim().length > 0 || selectedMedia) && !isPosting;

  return (
    <PageLayout 
      className={cn(
        'min-h-screen',
        isDark ? 'bg-black text-white' : 'bg-white text-black'
      )}
      maxWidth="2xl"
      padding="none"
    >
      {/* X-Style Header */}
      <div className={cn(
        'sticky top-0 z-10 backdrop-blur-xl border-b',
        isDark ? 'bg-black/80 border-gray-800' : 'bg-white/80 border-gray-200'
      )}>
        <div className="flex items-center justify-between px-4 py-3">
          <div className="flex items-center space-x-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate(-1)}
              className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-900"
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <h1 className="text-xl font-bold">Create Post</h1>
          </div>
          
          <Button
            onClick={createPost}
            disabled={!canPost}
            className={cn(
              'rounded-full px-6 py-2 font-bold transition-all',
              canPost 
                ? 'bg-[#BCE953] text-black hover:bg-[#BCE953]/90' 
                : 'bg-gray-300 text-gray-500 cursor-not-allowed dark:bg-gray-700 dark:text-gray-400'
            )}
          >
            {isPosting ? 'Posting...' : 'Post'}
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-2xl mx-auto">
        <div className={cn(
          'border-x min-h-screen',
          isDark ? 'border-gray-800' : 'border-gray-200'
        )}>
          
          {/* Post Composer */}
          <div className="p-4">
            <div className="flex space-x-4">
              {/* User Avatar */}
              <Avatar 
                src={user?.profile.avatar_url} 
                alt={user?.profile.full_name} 
                size="lg"
                className="flex-shrink-0"
              />
              
              {/* Composer Content */}
              <div className="flex-1 min-w-0">
              
                {/* Text Input */}
                <div className="mb-4">
                  <textarea
                    ref={textareaRef}
                    value={newPost.content}
                    onChange={handleContentChange}
                    placeholder="What's happening?"
                    className={cn(
                      'w-full text-xl placeholder-gray-500 bg-transparent border-none resize-none',
                      'focus:outline-none min-h-[120px]',
                      isDark ? 'text-white' : 'text-black'
                    )}
                    style={{ height: 'auto' }}
                  />
                  
                  {/* Character Count */}
                  <div className="flex justify-end mt-2">
                    <span className={cn(
                      'text-sm',
                      characterCount > MAX_CHARACTERS * 0.9 
                        ? 'text-red-500' 
                        : characterCount > MAX_CHARACTERS * 0.8 
                          ? 'text-yellow-500' 
                          : 'text-gray-500'
                    )}>
                      {characterCount}/{MAX_CHARACTERS}
                    </span>
                  </div>
                </div>

                {/* Media Preview */}
                {mediaPreview && (
                  <div className="mb-4 relative">
                    <div className="relative rounded-2xl overflow-hidden border border-gray-200 dark:border-gray-700">
                      {newPost.media_type === 'image' ? (
                        <img 
                          src={mediaPreview} 
                          alt="Preview" 
                          className="w-full h-auto max-h-96 object-cover"
                        />
                      ) : (
                        <video 
                          src={mediaPreview} 
                          controls 
                          className="w-full h-auto max-h-96"
                        />
                      )}
                      <button
                        onClick={removeMedia}
                        className="absolute top-2 right-2 bg-black bg-opacity-60 text-white rounded-full p-2 hover:bg-opacity-80 transition-colors"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                    
                    {/* Image Validation Feedback */}
                
                  </div>
                )}

                {/* Action Bar */}
                <div className={cn(
                  'flex items-center justify-between pt-4 border-t',
                  isDark ? 'border-gray-800' : 'border-gray-200'
                )}>
                  <div className="flex items-center space-x-4">
                    
                    {/* Media Buttons */}
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => fileInputRef.current?.click()}
                      className="p-2 text-blbg-black hover:bg-black/10 rounded-full"
                    >
                      <ImageIcon className="w-5 h-5" />
                    </Button>
                    
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => videoInputRef.current?.click()}
                      className="p-2 text-blbg-black hover:bg-black/10 rounded-full"
                    >
                      <Video className="w-5 h-5" />
                    </Button>
                    
                    {/* Emoji Button */}
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                      className="p-2 text-blbg-black hover:bg-black/10 rounded-full"
                    >
                      <Smile className="w-5 h-5" />
                    </Button>
                    
                    {/* Location Button */}
                    <Button
                      variant="ghost"
                      size="sm"
                      className="p-2 text-blbg-black hover:bg-black/10 rounded-full"
                    >
                      <MapPin className="w-5 h-5" />
                    </Button>
                  </div>

                  {/* Visibility Indicator */}
                  <div className="flex items-center space-x-2 text-blbg-black">
                    {getVisibilityIcon()}
                    <span className="text-sm font-medium capitalize">
                      {newPost.visibility}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Writing Tips */}
        
        </div>
      </div>

      {/* Hidden File Inputs */}
      <input
        type="file"
        accept="image/*"
        ref={fileInputRef}
        className="hidden"
        onChange={handleMediaSelect}
      />
      <input
        type="file"
        accept="video/*"
        ref={videoInputRef}
        className="hidden"
        onChange={handleMediaSelect}
      />

      {/* X/Twitter Image Optimization Modal */}
      {showImageOptimizer && selectedMedia && imageValidation && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
          <div className={cn(
            'rounded-2xl shadow-2xl w-full max-w-lg mx-4 overflow-hidden',
            'animate-in zoom-in-95 fade-in duration-200',
            isDark ? 'bg-black border border-gray-800' : 'bg-white border border-gray-200'
          )}>
            {/* Modal Header */}
            <div className={cn(
              'px-6 py-4 border-b flex items-center justify-between',
              isDark ? 'border-gray-800' : 'border-gray-200'
            )}>
              <div>
                <h2 className="text-xl font-bold">Optimize for X/Twitter</h2>
                <p className={cn(
                  "text-sm",
                  isDark ? 'text-gray-400' : 'text-gray-500'
                )}>
                  Choose the best format for your post
                </p>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowImageOptimizer(false)}
                className={cn(
                  "p-2 rounded-full",
                  isDark ? 'hover:bg-gray-900' : 'hover:bg-gray-100'
                )}
              >
                <X className="w-5 h-5" />
              </Button>
            </div>

            {/* Current Image Info */}
            <div className="p-6 space-y-4">
              <div className={cn(
                'p-4 rounded-lg border',
                isDark ? 'bg-gray-900 border-gray-800' : 'bg-gray-50 border-gray-200'
              )}>
                <h3 className="font-medium mb-2">Current Image</h3>
                <div className={cn(
                  "text-sm space-y-1",
                  isDark ? 'text-gray-400' : 'text-gray-600'
                )}>
                  <div>📐 {imageValidation.dimensions.width}×{imageValidation.dimensions.height}px</div>
                  <div>📏 Aspect Ratio: {imageValidation.aspectRatio}</div>
                  <div>📁 File Size: {formatFileSize(imageValidation.size)}</div>
                </div>
              </div>

              {/* Optimization Options */}
              <div className="space-y-3">
                <h3 className="font-medium">Choose Optimization</h3>
                
                {/* 16:9 Option */}
                <button
                  onClick={() => handleOptimizeImage('16:9')}
                  className={cn(
                    'w-full p-4 rounded-lg border-2 text-left transition-all',
                    isDark 
                      ? 'border-gray-800 hover:border-gray-600 hover:bg-gray-900' 
                      : 'border-gray-200 hover:border-gray-400 hover:bg-gray-50'
                  )}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-medium">📱 Mobile Optimized (16:9)</div>
                      <div className={cn(
                        "text-sm",
                        isDark ? 'text-gray-400' : 'text-gray-500'
                      )}>
                        1200×675px • Best for mobile feeds
                      </div>
                    </div>
                    <div className={cn(
                      "w-12 h-7 rounded",
                      isDark ? 'bg-gray-700' : 'bg-gray-300'
                    )}></div>
                  </div>
                </button>

                {/* 1:1 Option */}
                <button
                  onClick={() => handleOptimizeImage('1:1')}
                  className={cn(
                    'w-full p-4 rounded-lg border-2 text-left transition-all',
                    isDark 
                      ? 'border-gray-800 hover:border-gray-600 hover:bg-gray-900' 
                      : 'border-gray-200 hover:border-gray-400 hover:bg-gray-50'
                  )}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-medium">⬜ Square Format (1:1)</div>
                      <div className={cn(
                        "text-sm",
                        isDark ? 'text-gray-400' : 'text-gray-500'
                      )}>
                        1080×1080px • Consistent across all devices
                      </div>
                    </div>
                    <div className={cn(
                      "w-7 h-7 rounded",
                      isDark ? 'bg-gray-700' : 'bg-gray-300'
                    )}></div>
                  </div>
                </button>
              </div>

              {/* Optimization Benefits */}
              <div className={cn(
                'p-4 rounded-lg border',
                isDark ? 'bg-gray-900 border-gray-800' : 'bg-gray-50 border-gray-200'
              )}>
                <h4 className="font-medium mb-2">
                  ✨ What optimization does:
                </h4>
                <ul className={cn(
                  "text-sm space-y-1",
                  isDark ? 'text-gray-400' : 'text-gray-600'
                )}>
                  <li>• Resizes to X/Twitter recommended dimensions</li>
                  <li>• Centers important content to prevent cropping</li>
                  <li>• Optimizes file size for faster loading</li>
                  <li>• Ensures consistent display across devices</li>
                </ul>
              </div>

              {/* Skip Option */}
              <Button
                variant="outline"
                onClick={() => setShowImageOptimizer(false)}
                className="w-full"
              >
                Skip optimization and use original
              </Button>
            </div>
          </div>
        </div>
      )}
    </PageLayout>
  );
}