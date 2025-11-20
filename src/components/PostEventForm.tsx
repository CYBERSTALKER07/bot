import React, { useState, useRef } from 'react';
import { motion, AnimatePresence, PanInfo } from 'framer-motion';
import {
  X,
  Image as ImageIcon,
  AlertCircle,
  Loader
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { cn } from '../lib/cva';
import Button from './ui/Button';
import { useCreateEmployerEvent } from '../hooks/useOptimizedQuery';
import { supabase } from '../lib/supabase';
import { bottomSheetVariants, modalVariants, backdropVariants } from '../lib/animations';
import { triggerSubtleSuccess } from '../lib/confetti';

interface PostEventFormProps {
  onClose?: () => void;
  onSuccess?: () => void;
  fullPage?: boolean; // New prop for full-page mode
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

export default function PostEventForm({ onClose, onSuccess, fullPage = false }: PostEventFormProps) {
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
  const [isMobile, setIsMobile] = useState(false);

  // Detect mobile on mount
  React.useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Handle swipe to close on mobile
  const handleDragEnd = (_: any, info: PanInfo) => {
    if (info.offset.y > 100) {
      onClose?.();
    }
  };

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

      // Trigger success animation
      triggerSubtleSuccess();

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

  // Full page mode - render without modal wrapper
  if (fullPage) {
    return (
      <div className={cn(
        'w-full max-w-5xl mx-auto',
        'rounded-3xl shadow-2xl overflow-y-auto',
        isDark
          ? 'bg-zinc-900 border border-white/10 text-white'
          : 'bg-white border border-gray-200 text-gray-900'
      )}>
        {/* Mobile Drag Handle */}
        {isMobile && (
          <div className="flex justify-center pt-3 pb-1">
            <div className={cn(
              "w-12 h-1 rounded-full",
              isDark ? "bg-white/20" : "bg-gray-300"
            )} />
          </div>
        )}

        {/* Header */}
        <div className={cn(
          'sticky top-0 z-10 flex items-center justify-between p-6 border-b backdrop-blur-xl',
          isDark ? 'border-white/10 bg-zinc-900/80' : 'border-gray-200 bg-white/80'
        )}>
          <h2 className="text-xl font-bold">Create Event</h2>
          {onClose && (
            <button
              onClick={onClose}
              className={cn(
                'p-2 rounded-full transition-colors',
                isDark
                  ? 'hover:bg-white/10 text-gray-400 hover:text-white'
                  : 'hover:bg-gray-100 text-gray-600 hover:text-gray-900'
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
            <div className={cn(
              "flex items-start space-x-3 p-4 rounded-2xl border",
              isDark
                ? "bg-red-500/10 border-red-500/20"
                : "bg-red-50 border-red-200"
            )}>
              <AlertCircle className="h-5 w-5 text-red-500 flex-shrink-0 mt-0.5" />
              <p className={cn(
                "text-sm font-medium",
                isDark ? "text-red-400" : "text-red-600"
              )}>{error}</p>
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
                    'px-3 py-2 rounded-xl font-medium text-sm transition-all duration-200 capitalize',
                    formData.event_type === type
                      ? isDark
                        ? 'bg-lime-400 text-black shadow-lg shadow-lime-400/20'
                        : 'bg-lime-500 text-white shadow-lg shadow-lime-500/30'
                      : isDark
                        ? 'bg-zinc-800 border border-white/10 text-gray-300 hover:border-lime-400/30'
                        : 'bg-gray-50 border border-gray-200 text-gray-700 hover:border-lime-500/30'
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
                'w-full px-4 py-3 rounded-2xl border transition-all duration-200',
                isDark
                  ? 'bg-zinc-900 border-white/10 text-white placeholder-gray-500 focus:border-lime-400 focus:ring-2 focus:ring-lime-400/20'
                  : 'bg-white border-gray-200 text-gray-900 placeholder-gray-400 focus:border-lime-500 focus:ring-2 focus:ring-lime-500/20 shadow-sm'
              )}
            />
            <p className={cn(
              "text-xs mt-1",
              isDark ? "text-gray-500" : "text-gray-600"
            )}>{formData.title.length}/255</p>
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
                'w-full px-4 py-3 rounded-2xl border transition-all duration-200 resize-none',
                isDark
                  ? 'bg-zinc-900 border-white/10 text-white placeholder-gray-500 focus:border-lime-400 focus:ring-2 focus:ring-lime-400/20'
                  : 'bg-white border-gray-200 text-gray-900 placeholder-gray-400 focus:border-lime-500 focus:ring-2 focus:ring-lime-500/20 shadow-sm'
              )}
            />
            <p className={cn(
              "text-xs mt-1",
              isDark ? "text-gray-500" : "text-gray-600"
            )}>{formData.description.length}/2000</p>
          </div>

          {/* Banner Image */}
          <div>
            <label className="block text-sm font-semibold mb-2">Event Banner</label>
            <div
              onClick={() => fileInputRef.current?.click()}
              className={cn(
                'border-2 border-dashed rounded-2xl p-6 text-center cursor-pointer transition-all duration-200',
                isDark
                  ? 'border-white/10 hover:border-lime-400/30 hover:bg-white/5'
                  : 'border-gray-300 hover:border-lime-500/30 hover:bg-lime-50/50'
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
                  <img src={bannerPreview} alt="Banner preview" className="max-h-48 mx-auto rounded-xl" />
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setBannerPreview(null);
                      setFormData(prev => ({ ...prev, banner_image_url: undefined }));
                    }}
                    className="text-sm text-red-500 hover:text-red-600 font-medium"
                  >
                    Remove image
                  </button>
                </div>
              ) : (
                <div className="space-y-2">
                  <ImageIcon className={cn(
                    'h-8 w-8 mx-auto',
                    isDark ? 'text-gray-400' : 'text-gray-500'
                  )} />
                  <p className={cn(
                    "font-medium",
                    isDark ? 'text-gray-300' : 'text-gray-700'
                  )}>
                    {uploading ? 'Uploading...' : 'Click to upload or drag and drop'}
                  </p>
                  <p className={cn(
                    "text-xs",
                    isDark ? "text-gray-500" : "text-gray-600"
                  )}>PNG, JPG up to 5MB</p>
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
                  'w-full px-4 py-3 rounded-2xl border transition-all duration-200',
                  isDark
                    ? 'bg-zinc-900 border-white/10 text-white focus:border-lime-400 focus:ring-2 focus:ring-lime-400/20'
                    : 'bg-white border-gray-200 text-gray-900 focus:border-lime-500 focus:ring-2 focus:ring-lime-500/20 shadow-sm'
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
                  'w-full px-4 py-3 rounded-2xl border transition-all duration-200',
                  isDark
                    ? 'bg-zinc-900 border-white/10 text-white focus:border-lime-400 focus:ring-2 focus:ring-lime-400/20'
                    : 'bg-white border-gray-200 text-gray-900 focus:border-lime-500 focus:ring-2 focus:ring-lime-500/20 shadow-sm'
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
                  'w-full px-4 py-3 rounded-2xl border transition-all duration-200',
                  isDark
                    ? 'bg-zinc-900 border-white/10 text-white focus:border-lime-400 focus:ring-2 focus:ring-lime-400/20'
                    : 'bg-white border-gray-200 text-gray-900 focus:border-lime-500 focus:ring-2 focus:ring-lime-500/20 shadow-sm'
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
                  'w-full px-4 py-3 rounded-2xl border transition-all duration-200',
                  isDark
                    ? 'bg-zinc-900 border-white/10 text-white focus:border-lime-400 focus:ring-2 focus:ring-lime-400/20'
                    : 'bg-white border-gray-200 text-gray-900 focus:border-lime-500 focus:ring-2 focus:ring-lime-500/20 shadow-sm'
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
                className={cn(
                  "rounded w-4 h-4",
                  isDark
                    ? "bg-zinc-900 border-white/10 text-lime-400 focus:ring-lime-400/20"
                    : "bg-white border-gray-300 text-lime-500 focus:ring-lime-500/20"
                )}
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
                    'w-full px-4 py-3 rounded-2xl border transition-all duration-200',
                    isDark
                      ? 'bg-zinc-900 border-white/10 text-white placeholder-gray-500 focus:border-lime-400 focus:ring-2 focus:ring-lime-400/20'
                      : 'bg-white border-gray-200 text-gray-900 placeholder-gray-400 focus:border-lime-500 focus:ring-2 focus:ring-lime-500/20 shadow-sm'
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
                    'w-full px-4 py-3 rounded-2xl border transition-all duration-200',
                    isDark
                      ? 'bg-zinc-900 border-white/10 text-white placeholder-gray-500 focus:border-lime-400 focus:ring-2 focus:ring-lime-400/20'
                      : 'bg-white border-gray-200 text-gray-900 placeholder-gray-400 focus:border-lime-500 focus:ring-2 focus:ring-lime-500/20 shadow-sm'
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
                'w-full px-4 py-3 rounded-2xl border transition-all duration-200',
                isDark
                  ? 'bg-zinc-900 border-white/10 text-white placeholder-gray-500 focus:border-lime-400 focus:ring-2 focus:ring-lime-400/20'
                  : 'bg-white border-gray-200 text-gray-900 placeholder-gray-400 focus:border-lime-500 focus:ring-2 focus:ring-lime-500/20 shadow-sm'
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
                  'flex-1 px-4 py-3 rounded-2xl border transition-all duration-200',
                  isDark
                    ? 'bg-zinc-900 border-white/10 text-white placeholder-gray-500 focus:border-lime-400 focus:ring-2 focus:ring-lime-400/20'
                    : 'bg-white border-gray-200 text-gray-900 placeholder-gray-400 focus:border-lime-500 focus:ring-2 focus:ring-lime-500/20 shadow-sm'
                )}
              />
              <button
                type="button"
                onClick={handleAddTag}
                className={cn(
                  'px-6 py-3 rounded-2xl font-semibold transition-all duration-200',
                  isDark
                    ? 'bg-lime-400 hover:bg-lime-300 text-black'
                    : 'bg-lime-500 hover:bg-lime-600 text-white shadow-lg shadow-lime-500/30'
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
                    'px-3 py-1.5 rounded-full text-sm font-medium flex items-center gap-2 transition-colors',
                    isDark
                      ? 'bg-zinc-800 border border-white/10 text-gray-200 hover:border-lime-400/30'
                      : 'bg-gray-100 border border-gray-200 text-gray-700 hover:border-lime-500/30'
                  )}
                >
                  #{tag}
                  <button
                    type="button"
                    onClick={() => handleRemoveTag(index)}
                    className="hover:opacity-60 transition-opacity"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </span>
              ))}
            </div>
          </div>

          {/* Featured Checkbox */}
          <div className={cn(
            "flex items-center space-x-2 p-4 rounded-2xl border",
            isDark
              ? "bg-lime-400/10 border-lime-400/20"
              : "bg-lime-50 border-lime-200"
          )}>
            <input
              id="is_featured"
              type="checkbox"
              name="is_featured"
              checked={formData.is_featured}
              onChange={handleInputChange}
              className={cn(
                "rounded w-4 h-4",
                isDark
                  ? "bg-zinc-900 border-lime-400/30 text-lime-400 focus:ring-lime-400/20"
                  : "bg-white border-lime-300 text-lime-500 focus:ring-lime-500/20"
              )}
            />
            <label htmlFor="is_featured" className="text-sm font-medium">
              Feature this event (increases visibility)
            </label>
          </div>

          {/* Action Buttons */}
          <div className={cn(
            "flex items-center justify-end gap-3 pt-6 border-t",
            isDark ? "border-white/10" : "border-gray-200"
          )}>
            {onClose && (
              <Button
                type="button"
                variant="ghost"
                onClick={onClose}
                disabled={isSubmitting}
                className={cn(
                  "rounded-2xl px-6 py-3 font-semibold transition-colors",
                  isDark
                    ? "hover:bg-white/10 text-gray-400 hover:text-white"
                    : "hover:bg-gray-100 text-gray-600 hover:text-gray-900"
                )}
              >
                Cancel
              </Button>
            )}
            <Button
              type="submit"
              disabled={isSubmitting || uploading}
              className={cn(
                'rounded-2xl px-6 py-3 font-bold flex items-center gap-2 transition-all duration-200',
                isDark
                  ? 'bg-lime-400 hover:bg-lime-300 text-black shadow-lg shadow-lime-400/20 disabled:bg-zinc-800 disabled:text-gray-600'
                  : 'bg-lime-500 hover:bg-lime-600 text-white shadow-lg shadow-lime-500/30 disabled:bg-gray-300 disabled:text-gray-500'
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

  // Modal mode
  return (
    <AnimatePresence>
      {/* Backdrop */}
      <motion.div
        variants={backdropVariants}
        initial="hidden"
        animate="visible"
        exit="exit"
        onClick={onClose}
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
      />

      {/* Modal/Bottom Sheet */}
      <div className={cn(
        'fixed inset-0 z-50 flex items-center justify-center p-4',
        isMobile && 'items-end p-0'
      )}>
        <motion.div
          variants={isMobile ? bottomSheetVariants : modalVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
          drag={isMobile ? "y" : false}
          dragConstraints={{ top: 0, bottom: 0 }}
          dragElastic={{ top: 0, bottom: 0.5 }}
          onDragEnd={handleDragEnd}
          className={cn(
            'w-full max-h-[600px]',
            isMobile ? 'max-w-full' : 'max-w-2xl'
          )}
        >
          <div className={cn(
            'overflow-y-auto',
            isMobile ? 'rounded-t-3xl' : 'rounded-3xl',
            'shadow-2xl',
            isDark
              ? 'bg-zinc-900 border border-white/10 text-white'
              : 'bg-white border border-gray-200 text-gray-900'
          )}>
            {/* Mobile Drag Handle */}
            {isMobile && (
              <div className="flex justify-center pt-3 pb-1">
                <div className={cn(
                  "w-12 h-1 rounded-full",
                  isDark ? "bg-white/20" : "bg-gray-300"
                )} />
              </div>
            )}

            {/* Header */}
            <div className={cn(
              'sticky top-0 z-10 flex items-center justify-between p-6 border-b backdrop-blur-xl',
              isDark ? 'border-white/10 bg-zinc-900/80' : 'border-gray-200 bg-white/80'
            )}>
              <h2 className="text-xl font-bold">Create Event</h2>
              {onClose && (
                <button
                  onClick={onClose}
                  className={cn(
                    'p-2 rounded-full transition-colors',
                    isDark
                      ? 'hover:bg-white/10 text-gray-400 hover:text-white'
                      : 'hover:bg-gray-100 text-gray-600 hover:text-gray-900'
                  )}
                >
                  <X className="h-5 w-5" />
                </button>
              )}
            </div>

            {/* Form - same content as fullPage mode */}
            <form onSubmit={handleSubmit} className="p-6 space-y-6">
              {/* All form content here - copy from above */}
            </form>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
