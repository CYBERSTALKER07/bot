import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { gsap } from 'gsap';
import { 
  ArrowLeft,
  Download,
  Share,
  Bookmark,
  FileText,
  Video,
  Link as LinkIcon,
  Calendar,
  User,
  Eye,
  ThumbsUp,
  MessageCircle,
  X
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { Resource } from '../types';
import { supabase } from '../lib/supabase';
import Typography from './ui/Typography';
import Button from './ui/Button';
import { Card } from './ui/Card';
import Badge from './ui/Badge';
import Modal from './ui/Modal';

export default function ResourceDetails() {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const { isDark } = useTheme();
  const navigate = useNavigate();
  const containerRef = useRef<HTMLDivElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const relatedRef = useRef<HTMLDivElement>(null);
  
  const [resource, setResource] = useState<Resource | null>(null);
  const [relatedResources, setRelatedResources] = useState<Resource[]>([]);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showShareModal, setShowShareModal] = useState(false);

  useEffect(() => {
    if (id) {
      fetchResource();
      fetchRelatedResources();
      checkBookmarkStatus();
    }
  }, [id, user?.id]);

  const fetchResource = async () => {
    if (!id) return;
    
    try {
      setLoading(true);
      setError(null);
      
      const { data, error } = await supabase
        .from('resources')
        .select(`
          *,
          profiles!resources_author_id_fkey(
            full_name,
            avatar_url
          )
        `)
        .eq('id', id)
        .eq('published', true)
        .single();

      if (error) throw error;

      setResource(data);
      
      // Track view
      if (user?.id) {
        await supabase
          .from('resource_views')
          .insert([{
            resource_id: id,
            user_id: user.id,
            viewed_at: new Date().toISOString()
          }]);
      }
    } catch (err) {
      console.error('Error fetching resource:', err);
      setError(err instanceof Error ? err.message : 'Failed to load resource');
    } finally {
      setLoading(false);
    }
  };

  const fetchRelatedResources = async () => {
    if (!id) return;
    
    try {
      // First get the current resource's tags
      const { data: currentResource, error: currentError } = await supabase
        .from('resources')
        .select('tags')
        .eq('id', id)
        .single();

      if (currentError || !currentResource?.tags) return;

      // Find related resources with similar tags
      const { data, error } = await supabase
        .from('resources')
        .select('*')
        .eq('published', true)
        .neq('id', id)
        .overlaps('tags', currentResource.tags)
        .limit(6);

      if (error) throw error;

      setRelatedResources(data || []);
    } catch (err) {
      console.error('Error fetching related resources:', err);
    }
  };

  const checkBookmarkStatus = async () => {
    if (!id || !user?.id) return;
    
    try {
      const { data, error } = await supabase
        .from('bookmarked_resources')
        .select('id')
        .eq('resource_id', id)
        .eq('user_id', user.id)
        .single();

      if (error && error.code !== 'PGRST116') {
        throw error;
      }

      setIsBookmarked(!!data);
    } catch (err) {
      console.error('Error checking bookmark status:', err);
    }
  };

  const handleBookmark = async () => {
    if (!resource?.id || !user?.id) return;

    try {
      if (isBookmarked) {
        await supabase
          .from('bookmarked_resources')
          .delete()
          .eq('resource_id', resource.id)
          .eq('user_id', user.id);
        setIsBookmarked(false);
      } else {
        await supabase
          .from('bookmarked_resources')
          .insert([{
            resource_id: resource.id,
            user_id: user.id,
            bookmarked_at: new Date().toISOString()
          }]);
        setIsBookmarked(true);
      }
    } catch (err) {
      console.error('Error toggling bookmark:', err);
    }
  };

  const handleDownload = async () => {
    if (!resource?.file_url || !user?.id) return;
    
    try {
      // Track download
      await supabase
        .from('resource_downloads')
        .insert([{
          resource_id: resource.id,
          user_id: user.id,
          downloaded_at: new Date().toISOString()
        }]);

      // Open download link
      window.open(resource.file_url, '_blank');
    } catch (err) {
      console.error('Error tracking download:', err);
      // Still allow download even if tracking fails
      window.open(resource.file_url, '_blank');
    }
  };

  useEffect(() => {
    if (!resource) return;

    const ctx = gsap.context(() => {
      // Header animation
      gsap.fromTo(headerRef.current, {
        opacity: 0,
        y: -50,
        scale: 0.9
      }, {
        opacity: 1,
        y: 0,
        scale: 1,
        duration: 1.2,
        ease: 'power3.out'
      });

      // Content animation
      gsap.fromTo(contentRef.current, {
        opacity: 0,
        y: 50
      }, {
        opacity: 1,
        y: 0,
        duration: 1,
        ease: 'power3.out',
        delay: 0.3
      });

      // Related resources animation
      gsap.fromTo(relatedRef.current, {
        opacity: 0,
        y: 30
      }, {
        opacity: 1,
        y: 0,
        duration: 0.8,
        ease: 'power3.out',
        delay: 0.6
      });

      // Floating decorations
      gsap.to('.resource-decoration', {
        y: -15,
        x: 10,
        rotation: 360,
        duration: 20,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut'
      });

    }, containerRef);

    return () => ctx.revert();
  }, [resource]);

  const getResourceTypeIcon = (type: string) => {
    switch (type) {
      case 'article':
        return <FileText className="h-6 w-6" />;
      case 'video':
        return <Video className="h-6 w-6" />;
      case 'template':
        return <LinkIcon className="h-6 w-6" />;
      case 'guide':
        return <FileText className="h-6 w-6" />;
      default:
        return <FileText className="h-6 w-6" />;
    }
  };

  const getResourceTypeColor = (type: string) => {
    switch (type) {
      case 'article':
        return 'bg-info-100 text-info-800';
      case 'video':
        return 'bg-red-100 text-red-800';
      case 'template':
        return 'bg-green-100 text-green-800';
      case 'guide':
        return 'bg-purple-100 text-purple-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const handleShare = () => {
    setShowShareModal(true);
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    // Show toast notification
  };

  if (loading) {
    return (
      <div className={`min-h-screen ${isDark ? 'bg-dark-bg' : 'bg-gray-50'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <div className={`animate-spin rounded-full h-8 w-8 border-b-2 mx-auto mb-4 ${
              isDark ? 'border-lime' : 'border-asu-maroon'
            }`}></div>
            <Typography variant="body1" color="textSecondary">
              Loading resource...
            </Typography>
          </div>
        </div>
      </div>
    );
  }

  if (error || !resource) {
    return (
      <div className={`min-h-screen ${isDark ? 'bg-dark-bg' : 'bg-gray-50'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Card className="p-8 text-center">
            <Typography variant="h6" className="text-red-600 mb-2">
              {error || 'Resource Not Found'}
            </Typography>
            <Typography variant="body1" color="textSecondary" className="mb-4">
              {error || 'The resource you are looking for could not be found.'}
            </Typography>
            <Button onClick={() => navigate('/resources')} variant="outlined">
              Back to Resources
            </Button>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div ref={containerRef} className="min-h-screen bg-gradient-to-br from-gray-50 to-white relative">
      {/* Decorative elements */}
      <div className="resource-decoration absolute top-16 right-24 w-4 h-4 bg-asu-gold/40 rounded-full"></div>
      <div className="resource-decoration absolute top-32 left-16 w-3 h-3 bg-asu-maroon/30 rounded-full"></div>
      <div className="resource-decoration absolute top-24 left-1/4 w-5 h-5 text-asu-gold/60">
        <svg xmlns="http://www.w3.org/2000/svg" className="animate-pulse" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
        </svg>
      </div>
      <div className="resource-decoration absolute bottom-32 right-1/4 w-4 h-4 text-asu-maroon/50">
        <svg xmlns="http://www.w3.org/2000/svg" className="animate-pulse" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
        </svg>
      </div>
      <div className="resource-decoration absolute bottom-20 left-1/3 w-4 h-4 text-asu-gold/70">
        <svg xmlns="http://www.w3.org/2000/svg" className="animate-pulse" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
        </svg>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Back Button */}
        <button 
          onClick={() => navigate('/resources')}
          className="inline-flex items-center space-x-2 text-asu-maroon hover:text-asu-maroon-dark transition-colors mb-8 font-medium"
        >
          <ArrowLeft className="h-5 w-5" />
          <span>Back to Resources</span>
        </button>

        {/* Header */}
        <div ref={headerRef} className="bg-white rounded-3xl shadow-lg border border-gray-100 overflow-hidden mb-8">
          <div className="bg-gradient-to-r from-asu-maroon to-asu-maroon-dark p-8 text-white">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-4">
                <div className={`flex items-center space-x-2 px-4 py-2 rounded-full bg-white/20 backdrop-blur-sm`}>
                  {getResourceTypeIcon(resource.type)}
                  <span className="font-semibold text-white capitalize">{resource.type}</span>
                </div>
                <div className="flex items-center space-x-2 px-4 py-2 rounded-full bg-white/20 backdrop-blur-sm">
                  <LinkIcon className="h-5 w-5" />
                  <span className="font-semibold text-white capitalize">{resource.category.replace('_', ' ')}</span>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <button
                  onClick={handleBookmark}
                  className="p-3 bg-white/20 rounded-full hover:bg-white/30 transition-colors"
                >
                  <Bookmark className={`h-6 w-6 ${isBookmarked ? 'fill-current' : ''}`} />
                </button>
                <button
                  onClick={handleShare}
                  className="p-3 bg-white/20 rounded-full hover:bg-white/30 transition-colors"
                >
                  <Share className="h-6 w-6" />
                </button>
              </div>
            </div>
            
            <h1 className="text-4xl font-bold mb-4">{resource.title}</h1>
            <p className="text-xl text-white/90 mb-6">{resource.description}</p>
            
            <div className="flex flex-wrap items-center gap-4 text-sm">
              <div className="flex items-center space-x-2 bg-white/20 backdrop-blur-sm rounded-full px-4 py-2">
                <User className="h-4 w-4" />
                <span>{resource.profiles?.full_name}</span>
              </div>
              <div className="flex items-center space-x-2 bg-white/20 backdrop-blur-sm rounded-full px-4 py-2">
                <Calendar className="h-4 w-4" />
                <span>Updated {new Date(resource.updated_at).toLocaleDateString()}</span>
              </div>
              <div className="flex items-center space-x-2 bg-white/20 backdrop-blur-sm rounded-full px-4 py-2">
                <Eye className="h-4 w-4" />
                <span>1,234 views</span>
              </div>
            </div>
          </div>
        </div>

        {/* Content */}
        <div ref={contentRef} className="bg-white rounded-3xl shadow-lg border border-gray-100 overflow-hidden mb-8">
          <div className="p-8">
            <div className="prose prose-lg max-w-none">
              <div className="whitespace-pre-line text-gray-700 leading-relaxed">
                {resource.content}
              </div>
            </div>
          </div>
        </div>

        {/* Tags */}
        <div className="bg-white rounded-3xl shadow-lg border border-gray-100 p-6 mb-8">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Tags</h3>
          <div className="flex flex-wrap gap-2">
            {resource.tags?.map((tag, index) => (
              <span
                key={index}
                className="px-3 py-1 bg-asu-maroon/10 text-asu-maroon rounded-full text-sm font-medium hover:bg-asu-maroon/20 transition-colors cursor-pointer"
              >
                #{tag}
              </span>
            ))}
          </div>
        </div>

        {/* Related Resources */}
        <div ref={relatedRef} className="bg-white rounded-3xl shadow-lg border border-gray-100 overflow-hidden">
          <div className="p-8">
            <h3 className="text-2xl font-bold text-gray-900 mb-6">Related Resources</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {relatedResources.map((relatedResource) => (
                <div
                  key={relatedResource.id}
                  className="block p-6 border border-gray-200 rounded-2xl hover:shadow-md transition-shadow"
                >
                  <div className="flex items-start space-x-4">
                    <div className={`p-3 rounded-xl ${getResourceTypeColor(relatedResource.type)}`}>
                      {getResourceTypeIcon(relatedResource.type)}
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold text-gray-900 mb-2">{relatedResource.title}</h4>
                      <p className="text-gray-600 text-sm mb-3">{relatedResource.description}</p>
                      <div className="flex items-center text-xs text-gray-500">
                        <Calendar className="h-3 w-3 mr-1" />
                        <span>{new Date(relatedResource.updated_at).toLocaleDateString()}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Share Modal */}
      {showShareModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl p-8 max-w-md w-full">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-bold text-gray-900">Share Resource</h3>
              <button
                onClick={() => setShowShareModal(false)}
                className="p-2 hover:bg-gray-100 rounded-full"
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Resource URL
                </label>
                <div className="flex items-center space-x-2">
                  <input
                    type="text"
                    value={window.location.href}
                    readOnly
                    className="flex-1 p-3 border border-gray-300 rounded-xl bg-gray-50"
                  />
                  <button
                    onClick={() => copyToClipboard(window.location.href)}
                    className="px-4 py-3 bg-asu-maroon text-white rounded-xl hover:bg-asu-maroon-dark transition-colors"
                  >
                    Copy
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <button className="flex items-center justify-center space-x-2 p-3 border border-gray-300 rounded-xl hover:bg-gray-50 transition-colors">
                  <span>📧</span>
                  <span>Email</span>
                </button>
                <button className="flex items-center justify-center space-x-2 p-3 border border-gray-300 rounded-xl hover:bg-gray-50 transition-colors">
                  <span>📱</span>
                  <span>LinkedIn</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}