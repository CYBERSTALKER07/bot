import React, { useState, useMemo } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  Calendar,
  MapPin,
  Users,
  Video,
  ExternalLink,
  Share2,
  Bookmark,
  ArrowLeft,
  CheckCircle,
  X,
  Clock,
  Sparkles,
  ShieldCheck,
  Globe
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { useEmployerEvent, useEventAttendees, useEventRegistrationStatus, useRegisterForEvent, useUnregisterFromEvent } from '../hooks/useOptimizedQuery';
import { cn } from '../lib/cva';
import { motion, AnimatePresence } from 'framer-motion';

// --- Components ---

const GlassCard = ({ children, className, isDark }: { children: React.ReactNode, className?: string, isDark: boolean }) => (
  <div className={cn(
    "backdrop-blur-xl transition-all duration-300",
    isDark
      ? "bg-[#121212]/80 border border-white/5 shadow-2xl shadow-black/50"
      : "bg-white/80 border border-gray-100 shadow-xl shadow-gray-200/50",
    "rounded-[32px]",
    className
  )}>
    {children}
  </div>
);

const BentoBox = ({ children, className, isDark }: { children: React.ReactNode, className?: string, isDark: boolean }) => (
  <div className={cn(
    "p-5 rounded-[24px] flex flex-col justify-center items-start transition-all hover:scale-[1.02] duration-300",
    isDark ? "bg-[#1C1C1E] border border-white/5" : "bg-[#F7F7F7] border border-gray-100",
    className
  )}>
    {children}
  </div>
);

export default function EventDetails() {
  const { eventId } = useParams<{ eventId: string }>();
  const { user } = useAuth();
  const { isDark } = useTheme();
  const navigate = useNavigate();

  const [showRegisterModal, setShowRegisterModal] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [registrationData, setRegistrationData] = useState({
    dietary_restrictions: '',
    accessibility_needs: '',
    questions: ''
  });

  // Queries
  const { data: event, isLoading: eventLoading } = useEmployerEvent(eventId);
  const { data: attendees = [], isLoading: attendeesLoading } = useEventAttendees(eventId);
  const { data: registrationStatus } = useEventRegistrationStatus(eventId, user?.id);

  // Mutations
  const registerMutation = useRegisterForEvent();
  const unregisterMutation = useUnregisterFromEvent();

  const handleRegister = async () => {
    if (!event?.id || !user?.id) return;
    try {
      await registerMutation.mutateAsync({ eventId: event.id, userId: user.id });
      setShowRegisterModal(false);
    } catch (err) { console.error(err); }
  };

  // Derived State
  const isRegistered = registrationStatus?.isRegistered || false;
  const spotsTaken = event?.attendees_count || 0;
  const capacity = event?.capacity || 100;
  const percentageFull = Math.min(100, Math.round((spotsTaken / capacity) * 100));

  // Format Date
  const eventDate = event?.event_date ? new Date(event.event_date) : null;
  const dateStr = eventDate?.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  const timeStr = eventDate?.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
  const weekday = eventDate?.toLocaleDateString('en-US', { weekday: 'long' });

  // AI-Simulated Highlights
  const aiHighlights = useMemo(() => [
    { icon: Users, text: "Great for Networking" },
    { icon: ShieldCheck, text: "Verified Host" },
    { icon: Sparkles, text: "Popular in Tech" }
  ], []);

  if (eventLoading) return <div className="min-h-screen bg-black" />;
  if (!event) return <div className="min-h-screen flex items-center justify-center">Event not found</div>;

  return (
    <div className={cn("min-h-screen pb-20 font-sans selection:bg-lime-400/30", isDark ? "bg-black text-white" : "bg-[#FAFAFA] text-gray-900")}>

      {/* --- Immersive Header --- */}
      <div className="relative w-full h-[60vh] lg:h-[50vh] overflow-hidden">
        {/* Background Image with Gradient Fade */}
        <div className="absolute inset-0">
          {event.banner_image_url ? (
            <img src={event.banner_image_url} className="w-full h-full object-cover" alt="Event Banner" />
          ) : (
            <div className={cn("w-full h-full bg-linear-to-br", isDark ? "from-gray-900 to-black" : "from-gray-100 to-white")} />
          )}
          <div className={cn("absolute inset-0 bg-linear-to-t", isDark ? "from-black via-black/60 to-transparent" : "from-[#FAFAFA] via-[#FAFAFA]/60 to-transparent")} />
        </div>

        {/* Navigation */}
        <div className="absolute top-0 left-0 right-0 p-6 flex justify-between items-center z-20">
          <button onClick={() => navigate(-1)} className={cn("p-3 rounded-full backdrop-blur-md transition-colors", isDark ? "bg-black/30 hover:bg-black/50 text-white" : "bg-white/30 hover:bg-white/50 text-black")}>
            <ArrowLeft className="w-6 h-6" />
          </button>
          <div className="flex gap-3">
            <button className={cn("p-3 rounded-full backdrop-blur-md transition-colors", isDark ? "bg-black/30 hover:bg-black/50 text-white" : "bg-white/30 hover:bg-white/50 text-black")}>
              <Share2 className="w-5 h-5" />
            </button>
            <button onClick={() => setIsBookmarked(!isBookmarked)} className={cn("p-3 rounded-full backdrop-blur-md transition-colors", isBookmarked ? "bg-[#D3FB52] text-black" : (isDark ? "bg-black/30 hover:bg-black/50 text-white" : "bg-white/30 hover:bg-white/50 text-black"))}>
              <Bookmark className={cn("w-5 h-5", isBookmarked && "fill-current")} />
            </button>
          </div>
        </div>

        {/* Hero Content */}
        <div className="absolute bottom-0 left-0 right-0 p-6 lg:p-12 z-10 max-w-7xl mx-auto w-full">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <span className={cn("inline-block px-3 py-1 rounded-full text-xs font-bold uppercase tracking-widest mb-4 border", isDark ? "bg-lime-400/10 text-lime-400 border-lime-400/20" : "bg-lime-100 text-lime-800 border-lime-200")}>
              {event.event_type || 'Conference'}
            </span>
            <h1 className="text-4xl lg:text-6xl font-bold leading-tight mb-4 max-w-4xl">
              {event.title}
            </h1>

            {/* Host Mini Profile */}
            {event.employer && (
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-white/20">
                  <img src={event.employer.avatar_url || `https://api.dicebear.com/7.x/initials/svg?seed=${event.employer.name}`} className="w-full h-full object-cover" />
                </div>
                <div>
                  <p className={cn("text-sm font-medium", isDark ? "text-gray-300" : "text-gray-600")}>Hosted by</p>
                  <p className="font-bold text-sm">{event.employer.name}</p>
                </div>
              </div>
            )}
          </motion.div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8 relative z-20">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

          {/* --- LEFT COLUMN: DETAILS (8 cols) --- */}
          <div className="lg:col-span-8 space-y-8">

            {/* 1. Bento Stats Grid */}
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              <BentoBox isDark={isDark}>
                <div className={cn("p-2 rounded-xl mb-3", isDark ? "bg-blue-500/10 text-blue-400" : "bg-blue-50 text-blue-600")}>
                  <Calendar className="w-6 h-6" />
                </div>
                <p className={cn("text-xs font-bold uppercase", isDark ? "text-gray-500" : "text-gray-400")}>{weekday}</p>
                <p className="text-lg font-bold mt-1">{dateStr}</p>
              </BentoBox>

              <BentoBox isDark={isDark}>
                <div className={cn("p-2 rounded-xl mb-3", isDark ? "bg-purple-500/10 text-purple-400" : "bg-purple-50 text-purple-600")}>
                  <Clock className="w-6 h-6" />
                </div>
                <p className={cn("text-xs font-bold uppercase", isDark ? "text-gray-500" : "text-gray-400")}>Start Time</p>
                <p className="text-lg font-bold mt-1">{timeStr}</p>
              </BentoBox>

              <BentoBox isDark={isDark} className="col-span-2 md:col-span-1">
                <div className={cn("p-2 rounded-xl mb-3", isDark ? "bg-orange-500/10 text-orange-400" : "bg-orange-50 text-orange-600")}>
                  {event.virtual_link ? <Video className="w-6 h-6" /> : <MapPin className="w-6 h-6" />}
                </div>
                <p className={cn("text-xs font-bold uppercase", isDark ? "text-gray-500" : "text-gray-400")}>Location</p>
                <p className="text-lg font-bold mt-1 truncate w-full">{event.virtual_link ? 'Online Event' : (event.location || 'TBA')}</p>
              </BentoBox>
            </div>

            {/* 2. About Section */}
            <GlassCard isDark={isDark} className="p-8">
              <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                About the Event
                <div className={cn("h-1 w-1 rounded-full", isDark ? "bg-white" : "bg-black")} />
                <span className={cn("text-sm font-normal", isDark ? "text-gray-500" : "text-gray-400")}>Read time 2m</span>
              </h2>
              <div className={cn("prose prose-lg max-w-none", isDark ? "prose-invert text-gray-300" : "text-gray-600")}>
                <p className="whitespace-pre-line leading-relaxed">{event.description}</p>
              </div>

              {/* AI Insights Chips */}
              <div className="mt-8 pt-8 border-t border-dashed border-gray-700/50">
                <p className={cn("text-xs font-bold uppercase tracking-wider mb-4 flex items-center gap-2", isDark ? "text-purple-400" : "text-purple-600")}>
                  <Sparkles className="w-3 h-3" /> AI Insights
                </p>
                <div className="flex flex-wrap gap-3">
                  {aiHighlights.map((tag, i) => (
                    <div key={i} className={cn("flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium border", isDark ? "bg-purple-500/5 border-purple-500/20 text-gray-300" : "bg-purple-50 border-purple-100 text-gray-700")}>
                      <tag.icon className="w-4 h-4 opacity-70" />
                      {tag.text}
                    </div>
                  ))}
                </div>
              </div>
            </GlassCard>

            {/* 3. Location Map (Placeholder) */}
            {!event.virtual_link && (
              <GlassCard isDark={isDark} className="p-2 h-64 relative overflow-hidden group cursor-pointer">
                <div className={cn("absolute inset-0 flex items-center justify-center", isDark ? "bg-zinc-900" : "bg-gray-100")}>
                  <MapPin className="w-12 h-12 text-gray-400" />
                </div>
                <div className="absolute bottom-4 left-4 right-4 bg-white/10 backdrop-blur-md p-4 rounded-2xl border border-white/10">
                  <p className="font-bold text-white">{event.location}</p>
                  <p className="text-white/70 text-xs">Click to open in Maps</p>
                </div>
              </GlassCard>
            )}
          </div>

          {/* --- RIGHT COLUMN: STICKY TICKET (4 cols) --- */}
          <div className="lg:col-span-4 relative">
            <div className="sticky top-24 space-y-6">

              {/* The Ticket Card */}
              <div className={cn(
                "rounded-[32px] p-1 border relative overflow-hidden",
                isDark ? "bg-linear-to-b from-zinc-800 to-black border-white/10" : "bg-linear-to-b from-white to-gray-50 border-gray-200 shadow-xl"
              )}>
                {/* Decorative Top Border */}
                <div className={cn("absolute top-0 left-0 right-0 h-1.5", isDark ? "bg-lime-400" : "bg-black")} />

                <div className="p-6">
                  <div className="flex justify-between items-center mb-6">
                    <h3 className="text-xl font-bold">Registration</h3>
                    <div className={cn("flex items-center gap-1.5 px-2 py-1 rounded-md text-[10px] font-bold uppercase", isDark ? "bg-green-900/30 text-green-400" : "bg-green-100 text-green-700")}>
                      <span className="w-1.5 h-1.5 rounded-full bg-current animate-pulse" /> Available
                    </div>
                  </div>

                  {/* Capacity Bar */}
                  <div className="mb-6">
                    <div className="flex justify-between text-xs font-medium mb-2 opacity-70">
                      <span>Spots Filled</span>
                      <span>{spotsTaken} / {capacity}</span>
                    </div>
                    <div className={cn("h-2 w-full rounded-full overflow-hidden", isDark ? "bg-zinc-800" : "bg-gray-200")}>
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${percentageFull}%` }}
                        className={cn("h-full rounded-full", isDark ? "bg-lime-400" : "bg-black")}
                      />
                    </div>
                  </div>

                  {/* Action Button */}
                  {!isRegistered ? (
                    <button
                      onClick={() => setShowRegisterModal(true)}
                      disabled={percentageFull >= 100}
                      className={cn(
                        "w-full py-4 rounded-2xl font-bold text-lg shadow-lg transition-transform active:scale-95 flex items-center justify-center gap-2",
                        percentageFull >= 100
                          ? "bg-gray-500 cursor-not-allowed opacity-50"
                          : isDark ? "bg-[#D3FB52] text-black hover:bg-[#bce342]" : "bg-black text-white hover:bg-gray-800"
                      )}
                    >
                      {percentageFull >= 100 ? "Sold Out" : "Get Ticket"}
                    </button>
                  ) : (
                    <div className={cn("w-full py-4 rounded-2xl font-bold flex items-center justify-center gap-2 border border-dashed", isDark ? "bg-green-500/10 text-green-400 border-green-500/30" : "bg-green-50 text-green-700 border-green-200")}>
                      <CheckCircle className="w-5 h-5" /> You're Going!
                    </div>
                  )}

                  <p className="text-center text-xs opacity-50 mt-4">
                    Non-refundable • Instant Confirmation
                  </p>
                </div>

                {/* Attendees Facepile (Inside Ticket) */}
                <div className={cn("px-6 py-4 border-t", isDark ? "border-white/5 bg-white/5" : "border-gray-100 bg-gray-50")}>
                  <p className="text-xs font-bold uppercase tracking-wider opacity-60 mb-3">Who's Coming</p>
                  <div className="flex items-center justify-between">
                    <div className="flex -space-x-3">
                      {attendees.slice(0, 5).map((att, i) => (
                        <div key={i} className={cn("w-10 h-10 rounded-full border-2 flex items-center justify-center overflow-hidden", isDark ? "border-[#1C1C1E] bg-zinc-800" : "border-white bg-gray-200")}>
                          {att.profiles?.avatar_url ? (
                            <img src={att.profiles.avatar_url} className="w-full h-full object-cover" />
                          ) : (
                            <span className="text-xs font-bold">{att.profiles?.full_name?.[0]}</span>
                          )}
                        </div>
                      ))}
                      {attendees.length > 5 && (
                        <div className={cn("w-10 h-10 rounded-full border-2 flex items-center justify-center text-xs font-bold z-10", isDark ? "border-[#1C1C1E] bg-zinc-800 text-white" : "border-white bg-gray-200 text-black")}>
                          +{attendees.length - 5}
                        </div>
                      )}
                    </div>
                    <button className="text-xs font-bold hover:underline">View All</button>
                  </div>
                </div>
              </div>

              {/* Virtual Link Card */}
              {event.virtual_link && isRegistered && (
                <div className={cn("p-4 rounded-[24px] flex items-center gap-4 border", isDark ? "bg-blue-500/10 border-blue-500/20" : "bg-blue-50 border-blue-100")}>
                  <div className="p-3 rounded-full bg-blue-500 text-white">
                    <Video className="w-5 h-5" />
                  </div>
                  <div className="flex-1">
                    <p className="font-bold text-sm">Virtual Link Available</p>
                    <a href={event.virtual_link} target="_blank" className="text-xs text-blue-500 hover:underline">Click to join room</a>
                  </div>
                </div>
              )}

            </div>
          </div>

        </div>
      </div>

      {/* --- Registration Modal --- */}
      <AnimatePresence>
        {showRegisterModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setShowRegisterModal(false)} />
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 20 }}
              className={cn("relative w-full max-w-lg rounded-[32px] overflow-hidden shadow-2xl", isDark ? "bg-[#1C1C1E] border border-white/10" : "bg-white")}
            >
              <div className="p-8">
                <div className="flex justify-between items-center mb-6">
                  <h2 className={cn("text-2xl font-bold", isDark ? "text-white" : "text-black")}>Secure your spot</h2>
                  <button onClick={() => setShowRegisterModal(false)} className={cn("p-2 rounded-full", isDark ? "hover:bg-white/10" : "hover:bg-gray-100")}><X className="w-5 h-5" /></button>
                </div>

                <form onSubmit={(e) => { e.preventDefault(); handleRegister(); }} className="space-y-6">
                  <div>
                    <label className="text-sm font-bold mb-2 block">Dietary Restrictions</label>
                    <textarea
                      className={cn("w-full p-4 rounded-2xl border outline-none focus:ring-2 focus:ring-lime-500/50 resize-none", isDark ? "bg-black border-gray-800" : "bg-gray-50 border-gray-200")}
                      rows={2}
                      placeholder="None"
                      value={registrationData.dietary_restrictions}
                      onChange={e => setRegistrationData({ ...registrationData, dietary_restrictions: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="text-sm font-bold mb-2 block">Accessibility Needs</label>
                    <textarea
                      className={cn("w-full p-4 rounded-2xl border outline-none focus:ring-2 focus:ring-lime-500/50 resize-none", isDark ? "bg-black border-gray-800" : "bg-gray-50 border-gray-200")}
                      rows={2}
                      placeholder="None"
                      value={registrationData.accessibility_needs}
                      onChange={e => setRegistrationData({ ...registrationData, accessibility_needs: e.target.value })}
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={registerMutation.isPending}
                    className={cn(
                      "w-full py-4 rounded-2xl font-bold text-lg shadow-lg transition-transform active:scale-95",
                      isDark ? "bg-[#D3FB52] text-black hover:bg-[#bce342]" : "bg-black text-white hover:bg-gray-800"
                    )}
                  >
                    {registerMutation.isPending ? 'Processing...' : 'Confirm Registration'}
                  </button>
                </form>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}