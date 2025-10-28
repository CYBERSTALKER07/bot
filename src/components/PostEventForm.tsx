import React, { useState, useRef } from 'react';
import {
  X,
  Calendar,
  MapPin,
  Users,
  Link as LinkIcon,
  Image as ImageIcon,
  Tag,
  Clock,
  AlertCircle,
  Loader
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { cn } from '../lib/cva';
import Button from './ui/Button';
import { useCreateEmployerEvent } from '../hooks/useOptimizedQuery';
import { supabase } from '../lib/supabase';

interface PostEventFormProps {
  onClose?: () => void;
  onSuccess?: () => void;
}

interface EventFormData {
  title: string;
  description: string;
  event_date: string;
  event_time: string;
  event_end_date?: string;
  event_end_time?: string;
  location: string;
  virtual_link?: string;
  event_type: 'recruiting' | 'webinar' | 'networking' | 'workshop' | 'conference';
  capacity?: number;
  tags: string[];
  banner_image_url?: string;
  is_featured: boolean;
}

export default function PostEventForm({ onClose, onSuccess }: PostEventFormProps) {
  const { user } = useAuth();
  const { isDark } = useTheme();
  const createEventMutation = useCreateEmployerEvent();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [formData, setFormData] = useState<EventFormData>({
    title: '',
    description: '',
    event_date: '',
    event_time: '09:00',
    location: '',
    event_type: 'recruiting',
    capacity: undefined,
    tags: [],
    is_featured: false
  });

  const [isVirtual, setIsVirtual] = useState(false);
  const [currentTag, setCurrentTag] = useState('');
  const [bannerPreview, setBannerPreview] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;
    
    if (type === 'checkbox') {
      setFormData(prev => ({
        ...prev,
        [name]: (e.target as HTMLInputElement).checked
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleAddTag = () => {
    if (currentTag.trim() && formData.tags.length < 5) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, currentTag.trim()]
      }));
      setCurrentTag('');
    }
  };

  const handleRemoveTag = (index: number) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter((_, i) => i !== index)
    }));
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !user?.id) return;

    if (file.size > 5 * 1024 * 1024) {
      setError('Image size must be less than 5MB');
      return;
    }

    try {
      setUploading(true);
      setError(null);

      // Preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setBannerPreview(reader.result as string);
      };
      reader.readAsDataURL(file);

      // Upload to Supabase Storage
      // User ID must be the first folder to comply with RLS policies
      const fileName = `${user.id}/events/${Date.now()}-${file.name}`;
      const { data, error: uploadError } = await supabase.storage
        .from('event-banners')
        .upload(fileName, file);

      if (uploadError) throw uploadError;

      // Get public URL
      const { data: publicData } = supabase.storage
        .from('event-banners')
        .getPublicUrl(data.path);

      setFormData(prev => ({
        ...prev,
        banner_image_url: publicData.publicUrl
      }));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to upload image');
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user?.id) {
      setError('You must be logged in to create an event');
      return;
    }

    // Validation
    if (!formData.title.trim()) {
      setError('Event title is required');
      return;
    }

    if (!formData.description.trim()) {
      setError('Event description is required');
      return;
    }

    if (!formData.event_date) {
      setError('Event date is required');
      return;
    }

    if (!isVirtual && !formData.location.trim()) {
      setError('Event location is required');
      return;
    }

    if (isVirtual && !formData.virtual_link?.trim()) {
      setError('Virtual link is required');
      return;
    }

    try {
      setIsSubmitting(true);
      setError(null);

      // Combine date and time
      const eventDateTime = new Date(`${formData.event_date}T${formData.event_time}`);
      const endDateTime = formData.event_end_date 
        ? new Date(`${formData.event_end_date}T${formData.event_end_time || '17:00'}`)
        : undefined;

      const eventPayload = {
        employer_id: user.id,
        title: formData.title.trim(),
        description: formData.description.trim(),
        event_date: eventDateTime.toISOString(),
        event_end_date: endDateTime?.toISOString() || null,
        location: formData.location.trim() || null,
        virtual_link: formData.virtual_link?.trim() || null,
        event_type: formData.event_type,
        capacity: formData.capacity || null,
        banner_image_url: formData.banner_image_url || null,
        tags: formData.tags,
        is_featured: formData.is_featured,
        status: 'upcoming',
        attendees_count: 0
      };

      await createEventMutation.mutateAsync(eventPayload);

      // Reset form
      setFormData({
        title: '',
        description: '',
        event_date: '',
        event_time: '09:00',
        location: '',
        event_type: 'recruiting',
        capacity: undefined,
        tags: [],
        is_featured: false
      });
      setBannerPreview(null);

      onSuccess?.();
      onClose?.();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create event');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className={cn(
      'rounded-2xl shadow-2xl max-h-[90vh] overflow-y-auto',
      isDark
        ? 'bg-black text-white'
        : 'bg-gradient-to-br from-white to-slate-50 text-slate-900'
    )}>
      {/* Header */}
      <div className={cn(
        'sticky top-0 z-10 flex items-center justify-between p-6 border-b backdrop-blur-xl',
        isDark ? 'border-blbg-black bg-black' : 'border-slate-200 bg-white/50'
      )}>
        <h2 className="text-xl font-bold">Post an Event</h2>
        {onClose && (
          <button
            onClick={onClose}
            className={cn(
              'p-2 rounded-lg transition-colors',
              isDark
                ? 'hover:bg-black text-slate-400'
                : 'hover:bg-slate-200 text-slate-600'
            )}
          >
            <X className="h-5 w-5" />
          </button>
        )}
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="p-6 space-y-6">
        {/* Error Alert */}
        {error && (
          <div className="flex items-start space-x-3 p-4 rounded-lg bg-red-500/10 border border-red-500/20">
            <AlertCircle className="h-5 w-5 text-red-500 flex-shrink-0 mt-0.5" />
            <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
          </div>
        )}

        {/* Event Type Selection */}
        <div>
          <label className="block text-sm font-semibold mb-3">Event Type</label>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-2">
            {(['recruiting', 'webinar', 'networking', 'workshop', 'conference'] as const).map(type => (
              <button
                key={type}
                type="button"
                onClick={() => setFormData(prev => ({ ...prev, event_type: type }))}
                className={cn(
                  'px-3 py-2 rounded-lg font-medium text-sm transition-colors capitalize',
                  formData.event_type === type
                    ? 'bg-black border  text-white'
                    : isDark
                      ? 'bg-black text-slate-300 hover:bg-slate-600'
                      : 'bg-slate-200 text-blbg-black hover:bg-slate-300'
                )}
              >
                {type}
              </button>
            ))}
          </div>
        </div>

        {/* Title */}
        <div>
          <label htmlFor="title" className="block text-sm font-semibold mb-2">
            Event Title *
          </label>
          <input
            id="title"
            type="text"
            name="title"
            value={formData.title}
            onChange={handleInputChange}
            placeholder="e.g., Tech Careers Fair 2024"
            maxLength={255}
            className={cn(
              'w-full px-4 py-3 rounded-lg border-[0.7px] rounded-2xl transition-colors',
              isDark
                ? 'bg-black border-slate-600 text-white placeholder-slate-400 focus:border-blue-500'
                : 'bg-white border-slate-200 text-slate-900 placeholder-slate-500 focus:border-blue-500'
            )}
          />
          <p className="text-xs mt-1 text-gray-500">{formData.title.length}/255</p>
        </div>

        {/* Description */}
        <div>
          <label htmlFor="description" className="block text-sm font-semibold mb-2">
            Description *
          </label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleInputChange}
            placeholder="Describe your event, what attendees can expect, and how to register..."
            maxLength={2000}
            rows={5}
            className={cn(
              'w-full px-4 py-3 rounded-lg border-[0.7px] rounded-2xl transition-colors resize-none',
              isDark
                ? 'bg-black border-slate-600 text-white placeholder-slate-400 focus:border-blue-500'
                : 'bg-white border-slate-200 text-slate-900 placeholder-slate-500 focus:border-blue-500'
            )}
          />
          <p className="text-xs mt-1 text-gray-500">{formData.description.length}/2000</p>
        </div>

        {/* Banner Image */}
        <div>
          <label className="block text-sm font-semibold mb-2">Event Banner</label>
          <div
            onClick={() => fileInputRef.current?.click()}
            className={cn(
              'border-[0.7px] rounded-2xl border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors',
              isDark
                ? 'border-slate-600 hover:border-blue-500 hover:bg-black/50'
                : 'border-slate-300 hover:border-blue-500 hover:bg-blue-50'
            )}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              disabled={uploading}
              className="hidden"
            />
            {bannerPreview ? (
              <div className="space-y-3">
                <img src={bannerPreview} alt="Banner preview" className="max-h-48 mx-auto rounded-lg" />
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setBannerPreview(null);
                    setFormData(prev => ({ ...prev, banner_image_url: undefined }));
                  }}
                  className="text-sm text-red-500 hover:text-red-600"
                >
                  Remove image
                </button>
              </div>
            ) : (
              <div className="space-y-2">
                <ImageIcon className={cn(
                  'h-8 w-8 mx-auto',
                  isDark ? 'text-slate-400' : 'text-slate-400'
                )} />
                <p className={isDark ? 'text-slate-300' : 'text-slate-600'}>
                  {uploading ? 'Uploading...' : 'Click to upload or drag and drop'}
                </p>
                <p className="text-xs text-gray-500">PNG, JPG up to 5MB</p>
              </div>
            )}
          </div>
        </div>

        {/* Date & Time */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="event_date" className="block text-sm font-semibold mb-2">
              Start Date *
            </label>
            <input
              id="event_date"
              type="date"
              name="event_date"
              value={formData.event_date}
              onChange={handleInputChange}
              className={cn(
                'w-full px-4 py-3 rounded-lg border-[0.7px] rounded-2xl transition-colors',
                isDark
                  ? 'bg-black border-slate-600 text-white focus:border-blue-500'
                  : 'bg-white border-slate-200 text-slate-900 focus:border-blue-500'
              )}
            />
          </div>
          <div>
            <label htmlFor="event_time" className="block text-sm font-semibold mb-2">
              Start Time
            </label>
            <input
              id="event_time"
              type="time"
              name="event_time"
              value={formData.event_time}
              onChange={handleInputChange}
              className={cn(
                'w-full px-4 py-3 rounded-lg border-[0.7px] rounded-2xl transition-colors',
                isDark
                  ? 'bg-black border-slate-600 text-white focus:border-blue-500'
                  : 'bg-white border-slate-200 text-slate-900 focus:border-blue-500'
              )}
            />
          </div>
        </div>

        {/* End Date (Optional) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="event_end_date" className="block text-sm font-semibold mb-2">
              End Date (Optional)
            </label>
            <input
              id="event_end_date"
              type="date"
              name="event_end_date"
              value={formData.event_end_date || ''}
              onChange={handleInputChange}
              className={cn(
                'w-full px-4 py-3 rounded-lg border-[0.7px] rounded-2xl transition-colors',
                isDark
                  ? 'bg-black border-slate-600 text-white focus:border-blue-500'
                  : 'bg-white border-slate-200 text-slate-900 focus:border-blue-500'
              )}
            />
          </div>
          <div>
            <label htmlFor="event_end_time" className="block text-sm font-semibold mb-2">
              End Time
            </label>
            <input
              id="event_end_time"
              type="time"
              name="event_end_time"
              value={formData.event_end_time || '17:00'}
              onChange={handleInputChange}
              className={cn(
                'w-full px-4 py-3 rounded-lg border-[0.7px] rounded-2xl transition-colors',
                isDark
                  ? 'bg-black border-slate-600 text-white focus:border-blue-500'
                  : 'bg-white border-slate-200 text-slate-900 focus:border-blue-500'
              )}
            />
          </div>
        </div>

        {/* Location / Virtual Toggle */}
        <div>
          <div className="flex items-center space-x-2 mb-3">
            <input
              id="is_virtual"
              type="checkbox"
              checked={isVirtual}
              onChange={(e) => setIsVirtual(e.target.checked)}
              className="rounded"
            />
            <label htmlFor="is_virtual" className="text-sm font-medium">
              Virtual Event
            </label>
          </div>

          {isVirtual ? (
            <div>
              <label htmlFor="virtual_link" className="block text-sm font-semibold mb-2">
                Virtual Link (Zoom, Teams, etc.) *
              </label>
              <input
                id="virtual_link"
                type="url"
                name="virtual_link"
                value={formData.virtual_link || ''}
                onChange={handleInputChange}
                placeholder="https://zoom.us/j/..."
                className={cn(
                  'w-full px-4 py-3 rounded-lg border-[0.7px] rounded-2xl transition-colors',
                  isDark
                    ? 'bg-black border-slate-600 text-white placeholder-slate-400 focus:border-blue-500'
                    : 'bg-white border-slate-200 text-slate-900 placeholder-slate-500 focus:border-blue-500'
                )}
              />
            </div>
          ) : (
            <div>
              <label htmlFor="location" className="block text-sm font-semibold mb-2">
                Location *
              </label>
              <input
                id="location"
                type="text"
                name="location"
                value={formData.location}
                onChange={handleInputChange}
                placeholder="e.g., Convention Center, Room 101"
                className={cn(
                  'w-full px-4 py-3 rounded-lg border-[0.7px] rounded-2xl transition-colors',
                  isDark
                    ? 'bg-black border-slate-600 text-white placeholder-slate-400 focus:border-blue-500'
                    : 'bg-white border-slate-200 text-slate-900 placeholder-slate-500 focus:border-blue-500'
                )}
              />
            </div>
          )}
        </div>

        {/* Capacity */}
        <div>
          <label htmlFor="capacity" className="block text-sm font-semibold mb-2">
            Capacity (Optional)
          </label>
          <input
            id="capacity"
            type="number"
            name="capacity"
            value={formData.capacity || ''}
            onChange={handleInputChange}
            placeholder="e.g., 100"
            min="1"
            className={cn(
              'w-full px-4 py-3 rounded-lg border-[0.7px] rounded-2xl transition-colors',
              isDark
                ? 'bg-black border-slate-600 text-white placeholder-slate-400 focus:border-blue-500'
                : 'bg-white border-slate-200 text-slate-900 placeholder-slate-500 focus:border-blue-500'
            )}
          />
        </div>

        {/* Tags */}
        <div>
          <label className="block text-sm font-semibold mb-2">
            Tags (max 5)
          </label>
          <div className="flex gap-2 mb-3">
            <input
              type="text"
              value={currentTag}
              onChange={(e) => setCurrentTag(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddTag())}
              placeholder="Add a tag..."
              className={cn(
                'flex-1 px-4 py-3 rounded-lg border-[0.7px] rounded-2xl transition-colors',
                isDark
                  ? 'bg-black border-slate-600 text-white placeholder-slate-400 focus:border-blue-500'
                  : 'bg-white border-slate-200 text-slate-900 placeholder-slate-500 focus:border-blue-500'
              )}
            />
            <button
              type="button"
              onClick={handleAddTag}
              className={cn(
                'px-4 py-3 rounded-lg font-medium transition-colors',
                isDark
                  ? 'bg-blue-600 hover:bg-blue-700 text-white'
                  : 'bg-blue-500 hover:bg-blue-600 text-white'
              )}
            >
              Add
            </button>
          </div>
          <div className="flex flex-wrap gap-2">
            {formData.tags.map((tag, index) => (
              <span
                key={index}
                className={cn(
                  'px-3 py-1 rounded-full text-sm font-medium flex items-center gap-2',
                  isDark
                    ? 'bg-black text-slate-200'
                    : 'bg-slate-200 text-blbg-black'
                )}
              >
                #{tag}
                <button
                  type="button"
                  onClick={() => handleRemoveTag(index)}
                  className="hover:opacity-60"
                >
                  <X className="h-3 w-3" />
                </button>
              </span>
            ))}
          </div>
        </div>

        {/* Featured Checkbox */}
        <div className="flex items-center space-x-2 p-3 rounded-lg bg-blue-500/10 border border-blue-500/20">
          <input
            id="is_featured"
            type="checkbox"
            name="is_featured"
            checked={formData.is_featured}
            onChange={handleInputChange}
            className="rounded"
          />
          <label htmlFor="is_featured" className="text-sm font-medium">
            Feature this event (increases visibility)
          </label>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-end gap-3 pt-6 border-t border-blbg-black">
          {onClose && (
            <Button
              type="button"
              variant="ghost"
              onClick={onClose}
              disabled={isSubmitting}
              className="rounded-lg"
            >
              Cancel
            </Button>
          )}
          <Button
            type="submit"
            disabled={isSubmitting || uploading}
            className={cn(
              'rounded-lg font-semibold flex items-center gap-2',
              isDark
                ? 'bg-white hover:bg-blue-700 text-black disabled:bg-black'
                : 'bg-black hover:bg-blue-600 text-white disabled:bg-slate-300'
            )}
          > 
            {isSubmitting && <Loader className="h-4 w-4 animate-spin" />}
            {isSubmitting ? 'Publishing...' : 'Publish Event'}
          </Button>
        </div>
      </form>
    </div>
  );
}
