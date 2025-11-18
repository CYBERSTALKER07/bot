import React, { useState, useEffect, useRef } from 'react';
import { Camera, Edit3, Check, X, MapPin, Link, Calendar, Briefcase, GraduationCap, User } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import ImageUpload from '../ui/ImageUpload';
import Button from '../ui/Button';
import Avatar from '../ui/Avatar';
import { cn } from '../../lib/cva';

interface ProfileData {
  id: string;
  username: string;
  display_name?: string;
  full_name?: string;
  bio?: string;
  avatar_url?: string;
  cover_image_url?: string;
  website?: string;
  location?: string;
  phone?: string;
  linkedin_url?: string;
  github_url?: string;
  portfolio_url?: string;
  title?: string;
  company_name?: string;
  major?: string;
  graduation_year?: number;
  skills?: string[];
  interests?: string[];
  pronouns?: string;
  birth_date?: string;
  is_private: boolean;
  banner_color: string;
  theme_preference: string;
  role: string;
  verified: boolean;
  follower_count: number;
  following_count: number;
  post_count: number;
}

interface EditableFieldProps {
  value: string;
  onSave: (value: string) => Promise<void>;
  placeholder?: string;
  maxLength?: number;
  multiline?: boolean;
  className?: string;
  icon?: React.ReactNode;
}

function EditableField({ 
  value, 
  onSave, 
  placeholder = "Add...", 
  maxLength = 160, 
  multiline = false,
  className = "",
  icon
}: EditableFieldProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [tempValue, setTempValue] = useState(value);
  const [isSaving, setIsSaving] = useState(false);
  const inputRef = useRef<HTMLInputElement | HTMLTextAreaElement>(null);
  const { isDark } = useTheme();

  useEffect(() => {
    setTempValue(value);
  }, [value]);

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
      if (inputRef.current instanceof HTMLTextAreaElement) {
        inputRef.current.setSelectionRange(tempValue.length, tempValue.length);
      }
    }
  }, [isEditing, tempValue.length]);

  const handleSave = async () => {
    if (tempValue === value) {
      setIsEditing(false);
      return;
    }

    setIsSaving(true);
    try {
      await onSave(tempValue);
      setIsEditing(false);
    } catch (error) {
      console.error('Error saving field:', error);
      setTempValue(value); // Reset on error
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    setTempValue(value);
    setIsEditing(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !multiline) {
      e.preventDefault();
      handleSave();
    } else if (e.key === 'Escape') {
      handleCancel();
    }
  };

  if (isEditing) {
    const InputComponent = multiline ? 'textarea' : 'input';
    return (
      <div className="flex items-start gap-2">
        {icon && <div className="mt-1 text-gray-500">{icon}</div>}
        <div className="flex-1">
          <InputComponent
            ref={inputRef as any}
            value={tempValue}
            onChange={(e) => setTempValue(e.target.value)}
            onKeyDown={handleKeyDown}
            maxLength={maxLength}
            placeholder={placeholder}
            className={cn(
              "w-full px-3 py-2 border rounded-lg resize-none",
              isDark 
                ? "bg-gray-800 border-gray-600 text-white placeholder-gray-400" 
                : "bg-white border-gray-300 text-gray-900 placeholder-gray-500",
              multiline && "min-h-[80px]"
            )}
            rows={multiline ? 3 : undefined}
          />
          <div className="flex items-center justify-between mt-2">
            <span className={cn(
              "text-xs",
              tempValue.length > maxLength * 0.9 ? "text-red-500" : "text-gray-500"
            )}>
              {tempValue.length}/{maxLength}
            </span>
            <div className="flex gap-2">
              <Button
                size="sm"
                variant="secondary"
                onClick={handleCancel}
                disabled={isSaving}
              >
                <X className="w-4 h-4" />
              </Button>
              <Button
                size="sm"
                onClick={handleSave}
                disabled={isSaving || tempValue.length > maxLength}
                loading={isSaving}
              >
                <Check className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div 
      className={cn(
        "group cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800 rounded-lg p-2 -m-2 transition-colors",
        className
      )}
      onClick={() => setIsEditing(true)}
    >
      <div className="flex items-start gap-2">
        {icon && <div className="mt-1 text-gray-500">{icon}</div>}
        <div className="flex-1">
          {value ? (
            <span className={multiline ? "whitespace-pre-wrap" : ""}>{value}</span>
          ) : (
            <span className="text-gray-500 italic">{placeholder}</span>
          )}
          <Edit3 className="w-4 h-4 text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity ml-2 inline" />
        </div>
      </div>
    </div>
  );
}

export default function EditableProfile() {
  const { user } = useAuth();
  const { isDark } = useTheme();
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadProfile();
  }, [user]);

  const loadProfile = async () => {
    if (!user) return;

    try {
      setLoading(true);
      const { data, error } = await supabase.rpc('get_profile_for_editing');
      
      if (error) throw error;
      if (!data.success) throw new Error(data.error);
      
      setProfile(data.profile);
    } catch (err) {
      console.error('Error loading profile:', err);
      setError(err instanceof Error ? err.message : 'Failed to load profile');
    } finally {
      setLoading(false);
    }
  };

  const updateField = async (fieldName: string, value: string) => {
    const { data, error } = await supabase.rpc('update_profile_field', {
      field_name: fieldName,
      field_value: value
    });

    if (error) throw error;
    if (!data.success) throw new Error(data.error);

    // Update local state
    setProfile(prev => prev ? { ...prev, [fieldName]: value } : null);
  };

  const updateArrayField = async (fieldName: string, values: string[]) => {
    const { data, error } = await supabase.rpc('update_profile_array', {
      field_name: fieldName,
      field_values: values
    });

    if (error) throw error;
    if (!data.success) throw new Error(data.error);

    setProfile(prev => prev ? { ...prev, [fieldName]: values } : null);
  };

  const handleImageUpload = async (imageType: 'avatar_url' | 'cover_image_url', imageUrl: string) => {
    const { data, error } = await supabase.rpc('update_profile_image', {
      image_type: imageType,
      image_url: imageUrl
    });

    if (error) throw error;
    if (!data.success) throw new Error(data.error);

    setProfile(prev => prev ? { ...prev, [imageType]: imageUrl } : null);
  };

  if (loading) {
    return (
      <div className="animate-pulse">
        <div className="h-48 bg-gray-200 dark:bg-gray-700 rounded-t-lg"></div>
        <div className="p-6">
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/4 mb-4"></div>
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2 mb-2"></div>
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
        </div>
      </div>
    );
  }

  if (error || !profile) {
    return (
      <div className="text-center py-8">
        <p className="text-red-500">{error || 'Profile not found'}</p>
        <Button onClick={loadProfile} className="mt-4">
          Try Again
        </Button>
      </div>
    );
  }

  return (
    <div className={cn(
      "rounded-lg overflow-hidden shadow-lg",
      isDark ? "bg-gray-900 border border-gray-700" : "bg-white border border-gray-200"
    )}>
      {/* Cover Image */}
      <div 
        className="relative h-48 bg-gradient-to-r from-info-500 to-purple-600"
        style={{ backgroundColor: profile.banner_color }}
      >
        {profile.cover_image_url && (
          <img 
            src={profile.cover_image_url} 
            alt="Cover" 
            className="w-full h-full object-cover"
          />
        )}
        <div className="absolute top-4 right-4">
          <ImageUpload
            type="cover"
            currentImageUrl={profile.cover_image_url}
            onUploadSuccess={(url) => handleImageUpload('cover_image_url', url)}
            onUploadError={(error) => setError(error)}
            className="bg-black/50 hover:bg-black/70 text-white rounded-full p-2"
          />
        </div>
      </div>

      {/* Profile Info */}
      <div className="p-6">
        {/* Avatar */}
        <div className="relative -mt-16 mb-4">
          <div className="relative inline-block">
            <Avatar
              src={profile.avatar_url}
              alt={profile.display_name || profile.full_name || profile.username}
              size="xl"
              className="border-4 border-white dark:border-gray-900"
            />
            <div className="absolute bottom-2 right-2">
              <ImageUpload
                type="avatar"
                currentImageUrl={profile.avatar_url}
                onUploadSuccess={(url) => handleImageUpload('avatar_url', url)}
                onUploadError={(error) => setError(error)}
                size="sm"
                className="bg-info-500 hover:bg-info-600 text-white rounded-full p-1"
              />
            </div>
          </div>
        </div>

        {/* Basic Info */}
        <div className="space-y-4">
          {/* Display Name */}
          <EditableField
            value={profile.display_name || ''}
            onSave={(value) => updateField('display_name', value)}
            placeholder="Add display name"
            maxLength={50}
            className="text-xl font-bold"
          />

          {/* Username */}
          <EditableField
            value={`@${profile.username}`}
            onSave={(value) => updateField('username', value.replace('@', ''))}
            placeholder="@username"
            maxLength={30}
            className="text-gray-500"
          />

          {/* Bio */}
          <EditableField
            value={profile.bio || ''}
            onSave={(value) => updateField('bio', value)}
            placeholder="Add a bio"
            maxLength={160}
            multiline={true}
            className="text-gray-700 dark:text-gray-300"
          />

          {/* Metadata */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4">
            {/* Location */}
            <EditableField
              value={profile.location || ''}
              onSave={(value) => updateField('location', value)}
              placeholder="Add location"
              icon={<MapPin className="w-4 h-4" />}
            />

            {/* Website */}
            <EditableField
              value={profile.website || ''}
              onSave={(value) => updateField('website', value)}
              placeholder="Add website"
              icon={<Link className="w-4 h-4" />}
            />

            {/* Title/Company */}
            <EditableField
              value={profile.title || ''}
              onSave={(value) => updateField('title', value)}
              placeholder="Add job title"
              icon={<Briefcase className="w-4 h-4" />}
            />

            {/* Education */}
            <EditableField
              value={profile.major || ''}
              onSave={(value) => updateField('major', value)}
              placeholder="Add education"
              icon={<GraduationCap className="w-4 h-4" />}
            />

            {/* Pronouns */}
            <EditableField
              value={profile.pronouns || ''}
              onSave={(value) => updateField('pronouns', value)}
              placeholder="Add pronouns"
              icon={<User className="w-4 h-4" />}
            />
          </div>

          {/* Stats */}
          <div className="flex gap-6 pt-4 border-t border-gray-200 dark:border-gray-700">
            <div className="text-center">
              <div className="font-bold text-lg">{profile.following_count}</div>
              <div className="text-sm text-gray-500">Following</div>
            </div>
            <div className="text-center">
              <div className="font-bold text-lg">{profile.follower_count}</div>
              <div className="text-sm text-gray-500">Followers</div>
            </div>
            <div className="text-center">
              <div className="font-bold text-lg">{profile.post_count}</div>
              <div className="text-sm text-gray-500">Posts</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}