import { supabase } from './supabase';

// Get the Supabase URL from environment
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;

export interface ProfileData {
  id?: string;
  username?: string;
  full_name?: string;
  bio?: string;
  avatar_url?: string;
  cover_image_url?: string;
  website?: string;
  location?: string;
  // Role and company info
  role?: 'student' | 'employer' | 'admin';
  company_name?: string;
  title?: string;
  // Student-specific fields
  school?: string;
  major?: string;
  graduation_year?: number;
  gpa?: number;
  skills?: string[];
  interests?: string[];
  // Visibility and verification
  verified?: boolean;
  is_verified?: boolean;
  is_private?: boolean;
  // Counts
  follower_count?: number;
  following_count?: number;
  post_count?: number;
  // Timestamps
  created_at?: string;
  updated_at?: string;
  // Legacy fields for backward compatibility (these won't be saved to DB unless they exist in schema)
  phone?: string;
  linkedin_url?: string;
  github_url?: string;
  portfolio_url?: string;
  industry?: string;
  company_size?: string;
  company_description?: string;
}

export class ProfileService {
  /**
   * Upload avatar image to Supabase storage
   */
  static async uploadAvatar(file: File, userId: string): Promise<string> {
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${userId}/avatar-${Date.now()}.${fileExt}`;

      // Use 'avatars' bucket
      const { error } = await supabase.storage
        .from('avatars')
        .upload(fileName, file, {
          cacheControl: '3600',
          upsert: true
        });

      if (error) {
        console.error('Storage upload error:', error);
        throw error;
      }

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('avatars')
        .getPublicUrl(fileName);

      return publicUrl;
    } catch (error) {
      console.error('Error uploading avatar:', error);
      throw new Error('Failed to upload avatar image');
    }
  }

  /**
   * Upload cover image to Supabase storage
   */
  static async uploadCoverImage(file: File, userId: string): Promise<string> {
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${userId}/cover-${Date.now()}.${fileExt}`;

      // Use 'covers' bucket
      const { error } = await supabase.storage
        .from('covers')
        .upload(fileName, file, {
          cacheControl: '3600',
          upsert: true
        });

      if (error) {
        console.error('Storage upload error:', error);
        throw error;
      }

      const { data: { publicUrl } } = supabase.storage
        .from('covers')
        .getPublicUrl(fileName);

      return publicUrl;
    } catch (error) {
      console.error('Error uploading cover image:', error);
      throw new Error('Failed to upload cover image');
    }
  }

  /**
   * Upload post image to Supabase storage
   */
  static async uploadPostImage(file: File, userId: string): Promise<string> {
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${userId}/post-${Date.now()}.${fileExt}`;

      // Use 'post-images' bucket
      const { error } = await supabase.storage
        .from('post-images')
        .upload(fileName, file, {
          cacheControl: '3600',
          upsert: false
        });

      if (error) {
        console.error('Storage upload error:', error);
        throw error;
      }

      const { data: { publicUrl } } = supabase.storage
        .from('post-images')
        .getPublicUrl(fileName);

      return publicUrl;
    } catch (error) {
      console.error('Error uploading post image:', error);
      throw new Error('Failed to upload post image');
    }
  }

  /**
   * Upload video to Supabase storage
   */
  static async uploadVideo(file: File, userId: string): Promise<string> {
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${userId}/video-${Date.now()}.${fileExt}`;

      // Use 'videos' bucket
      const { error } = await supabase.storage
        .from('videos')
        .upload(fileName, file, {
          cacheControl: '3600',
          upsert: false
        });

      if (error) {
        console.error('Storage upload error:', error);
        throw error;
      }

      const { data: { publicUrl } } = supabase.storage
        .from('videos')
        .getPublicUrl(fileName);

      return publicUrl;
    } catch (error) {
      console.error('Error uploading video:', error);
      throw new Error('Failed to upload video');
    }
  }

  /**
   * Upload document to Supabase storage (private bucket)
   */
  static async uploadDocument(file: File, userId: string): Promise<string> {
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${userId}/document-${Date.now()}.${fileExt}`;

      // Use 'documents' bucket (private)
      const { error } = await supabase.storage
        .from('documents')
        .upload(fileName, file, {
          cacheControl: '3600',
          upsert: false
        });

      if (error) {
        console.error('Storage upload error:', error);
        throw error;
      }

      const { data: { publicUrl } } = supabase.storage
        .from('documents')
        .getPublicUrl(fileName);

      return publicUrl;
    } catch (error) {
      console.error('Error uploading document:', error);
      throw new Error('Failed to upload document');
    }
  }

  /**
   * Upload company asset to Supabase storage
   */
  static async uploadCompanyAsset(file: File, userId: string): Promise<string> {
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${userId}/company-${Date.now()}.${fileExt}`;

      // Use 'company-assets' bucket
      const { error } = await supabase.storage
        .from('company-assets')
        .upload(fileName, file, {
          cacheControl: '3600',
          upsert: false
        });

      if (error) {
        console.error('Storage upload error:', error);
        throw error;
      }

      const { data: { publicUrl } } = supabase.storage
        .from('company-assets')
        .getPublicUrl(fileName);

      return publicUrl;
    } catch (error) {
      console.error('Error uploading company asset:', error);
      throw new Error('Failed to upload company asset');
    }
  }

  /**
   * Get user profile by ID
   */
  static async getProfile(userId: string): Promise<ProfileData | null> {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (error && error.code !== 'PGRST116') {
        throw error;
      }

      return data;
    } catch (error) {
      console.error('Error fetching profile:', error);
      throw new Error('Failed to fetch profile');
    }
  }

  /**
   * Get current user's profile
   */
  static async getCurrentProfile(): Promise<ProfileData | null> {
    try {
      const { data: { user } } = await supabase.auth.getUser();

      if (!user) {
        throw new Error('No authenticated user');
      }

      return await this.getProfile(user.id);
    } catch (error) {
      console.error('Error fetching current profile:', error);
      throw new Error('Failed to fetch current profile');
    }
  }

  /**
   * Update user profile
   */
  static async updateProfile(userId: string, updates: Partial<ProfileData>): Promise<ProfileData> {
    try {
      // Extract only the fields that exist in the database
      const {
        id,
        created_at,
        updated_at,
        ...validUpdates
      } = updates;

      // If username is being updated, validate and normalize it
      if (validUpdates.username) {
        validUpdates.username = validUpdates.username.toLowerCase().replace(/[^a-z0-9_]/g, '');

        if (validUpdates.username.length < 3) {
          throw new Error('Username must be at least 3 characters long');
        }
      }

      // Ensure GPA is within valid range
      if (validUpdates.gpa !== undefined && validUpdates.gpa !== null) {
        if (validUpdates.gpa < 0 || validUpdates.gpa > 4.0) {
          throw new Error('GPA must be between 0.0 and 4.0');
        }
      }

      // Only update if there are valid fields to update
      if (Object.keys(validUpdates).length === 0) {
        // If no valid fields to update, just return current profile
        return await this.getProfile(userId) || {} as ProfileData;
      }

      const { data, error } = await supabase
        .from('profiles')
        .update(validUpdates)
        .eq('id', userId)
        .select()
        .single();

      if (error) {
        console.error('Supabase update error:', error);

        // Check for specific error types
        if (error.code === '23505' || error.message?.includes('duplicate')) {
          throw new Error('Username is already taken. Please choose a different username.');
        }

        if (error.code === '42501' || error.message?.includes('permission')) {
          throw new Error('You do not have permission to edit this profile.');
        }

        if (error.code === 'PGRST116') {
          throw new Error('Profile not found. Please refresh and try again.');
        }

        if (error.message?.includes('violates')) {
          throw new Error('Invalid data format. Please check your entries.');
        }

        throw new Error(`Failed to update profile: ${error.message}`);
      }

      if (!data) {
        throw new Error('No profile data returned from server');
      }

      return data;
    } catch (error) {
      console.error('Error updating profile:', error);
      throw error;
    }
  }

  /**
   * Create or update profile
   */
  static async upsertProfile(userId: string, profileData: Partial<ProfileData>): Promise<ProfileData> {
    try {
      // Extract only the fields that exist in the database
      const {
        id,
        // Remove fields that don't exist in the database
        phone,
        linkedin_url,
        github_url,
        portfolio_url,
        industry,
        company_size,
        company_description,
        ...validData
      } = profileData;

      // Generate username if not provided
      if (!validData.username && validData.full_name) {
        validData.username = validData.full_name
          .toLowerCase()
          .replace(/[^a-z0-9]/g, '')
          .substring(0, 20);
      }

      // Fallback username if still not set
      if (!validData.username) {
        validData.username = `user_${userId.substring(0, 8)}`;
      }

      const { data, error } = await supabase
        .from('profiles')
        .upsert({
          id: userId,
          ...validData,
          updated_at: new Date().toISOString()
        })
        .select()
        .single();

      if (error) {
        console.error('Supabase upsert error:', error);
        throw error;
      }

      return data;
    } catch (error) {
      console.error('Error upserting profile:', error);
      throw new Error('Failed to save profile');
    }
  }

  /**
   * Update profile avatar
   */
  static async updateAvatar(file: File, userId: string): Promise<ProfileData> {
    try {
      const avatarUrl = await this.uploadAvatar(file, userId);
      return await this.updateProfile(userId, { avatar_url: avatarUrl });
    } catch (error) {
      console.error('Error updating avatar:', error);
      throw new Error('Failed to update avatar');
    }
  }

  /**
   * Update profile cover image
   */
  static async updateCoverImage(file: File, userId: string): Promise<ProfileData> {
    try {
      const coverUrl = await this.uploadCoverImage(file, userId);
      return await this.updateProfile(userId, { cover_image_url: coverUrl });
    } catch (error) {
      console.error('Error updating cover image:', error);
      throw new Error('Failed to update cover image');
    }
  }

  /**
   * Search profiles by name or username
   */
  static async searchProfiles(query: string, limit: number = 10): Promise<ProfileData[]> {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('id, username, full_name, avatar_url, role, verified, title, company_name')
        .or(`full_name.ilike.%${query}%,username.ilike.%${query}%`)
        .limit(limit);

      if (error) throw error;

      return data || [];
    } catch (error) {
      console.error('Error searching profiles:', error);
      throw new Error('Failed to search profiles');
    }
  }

  /**
   * Get profiles by role
   */
  static async getProfilesByRole(role: 'student' | 'employer' | 'admin', limit: number = 50): Promise<ProfileData[]> {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('role', role)
        .order('created_at', { ascending: false })
        .limit(limit);

      if (error) throw error;

      return data || [];
    } catch (error) {
      console.error('Error fetching profiles by role:', error);
      throw new Error('Failed to fetch profiles');
    }
  }

  /**
   * Delete profile image from storage
   */
  static async deleteImage(bucket: string, filePath: string): Promise<void> {
    try {
      const { error } = await supabase.storage
        .from(bucket)
        .remove([filePath]);

      if (error) throw error;
    } catch (error) {
      console.error('Error deleting image:', error);
      throw new Error('Failed to delete image');
    }
  }

  /**
   * Validate image file
   */
  static validateImageFile(file: File): { valid: boolean; error?: string } {
    const maxSize = 5 * 1024 * 1024; // 5MB
    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];

    if (!allowedTypes.includes(file.type)) {
      return {
        valid: false,
        error: 'Please upload a valid image file (JPEG, PNG, GIF, or WebP)'
      };
    }

    if (file.size > maxSize) {
      return {
        valid: false,
        error: 'Image size must be less than 5MB'
      };
    }

    return { valid: true };
  }

  /**
   * Resize image before upload (optional, using canvas)
   */
  static async resizeImage(file: File, maxWidth: number = 800, maxHeight: number = 800, quality: number = 0.8): Promise<File> {
    return new Promise((resolve) => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      const img = new Image();

      img.onload = () => {
        // Calculate new dimensions
        let { width, height } = img;

        if (width > height) {
          if (width > maxWidth) {
            height = (height * maxWidth) / width;
            width = maxWidth;
          }
        } else {
          if (height > maxHeight) {
            width = (width * maxHeight) / height;
            height = maxHeight;
          }
        }

        // Set canvas dimensions
        canvas.width = width;
        canvas.height = height;

        // Draw resized image
        ctx?.drawImage(img, 0, 0, width, height);

        // Convert to blob
        canvas.toBlob(
          (blob) => {
            if (blob) {
              const resizedFile = new File([blob], file.name, {
                type: file.type,
                lastModified: Date.now()
              });
              resolve(resizedFile);
            } else {
              resolve(file);
            }
          },
          file.type,
          quality
        );
      };

      img.src = URL.createObjectURL(file);
    });
  }
}