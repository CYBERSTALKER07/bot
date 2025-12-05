import { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowLeft,
  MapPin,
  Calendar,
  DollarSign,
  Users,
  Briefcase,
  Share2,
  Bookmark,
  CheckCircle,
  Building2,
  Clock,
  X,
  Heart,
  Globe,
  Zap
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { useJobDetail } from '../hooks/useOptimizedQuery';
import Button from './ui/Button';
import { cn } from '../lib/cva';

// --- Sub-Components ---

const StatCard = ({ icon: Icon, label, value, colorClass, isDark }: any) => (
  <div className={cn(
    "p-4 rounded-2xl border flex flex-col justify-center transition-all hover:scale-[1.02]",
    isDark ? "bg-[#1C1C1E] border-white/5" : "bg-white border-gray-100 shadow-sm"
  )}>
    <div className={cn("p-2 w-fit rounded-xl mb-3", colorClass)}>
      <Icon className="w-5 h-5" />
    </div>
    <p className={cn("text-xs font-medium uppercase tracking-wider mb-1", isDark ? "text-gray-500" : "text-gray-400")}>
      {label}
    </p>
    <p className={cn("font-bold text-lg truncate", isDark ? "text-white" : "text-gray-900")}>
      {value}
    </p>
  </div>
);

const SectionHeading = ({ children, isDark }: { children: React.ReactNode, isDark: boolean }) => (
  <h2 className={cn("text-xl font-bold mb-6 flex items-center gap-2", isDark ? "text-white" : "text-gray-900")}>
    {children}
  </h2>
);

export default function JobDetails() {
  const { jobId } = useParams<{ jobId: string }>();
  const { user } = useAuth();
  const { isDark } = useTheme();
  const navigate = useNavigate();

  // Data Fetching
  const { data: job, isLoading: loading, error: jobError } = useJobDetail(jobId);

  // State
  const [showApplyModal, setShowApplyModal] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [coverLetter, setCoverLetter] = useState('');

  // --- Loading / Error States ---
  if (loading) return <div className={cn("min-h-screen flex items-center justify-center", isDark ? "bg-black" : "bg-gray-50")}><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-current text-gray-500" /></div>;
  if (!job || jobError) return <div className="min-h-screen flex items-center justify-center">Job not found</div>;

  // --- Handlers ---
  const handleApply = () => {
    if (!user?.id) return navigate('/login');
    setShowApplyModal(true);
  };

  const handleSubmitApplication = () => {
    // Logic here
    setShowApplyModal(false);
  };

  const formatDate = (date: string) => new Date(date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });

  return (
    <div className={cn("min-h-screen pb-20 font-sans", isDark ? "bg-black text-white" : "bg-[#FAFAFA] text-gray-900")}>

      {/* --- 1. Immersive Header --- */}
      <div className="relative">
        {/* Abstract Gradient Background */}
        <div className={cn(
          "absolute inset-0 h-[400px] overflow-hidden",
          isDark
            ? "bg-gradient-to-b from-indigo-900/40 via-black/80 to-black"
            : "bg-gradient-to-b from-indigo-50 via-white/80 to-[#FAFAFA]"
        )}>
          <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-indigo-500/30 to-transparent" />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 pb-8">
          {/* Nav */}
          <Link to="/jobs" className={cn("inline-flex items-center gap-2 text-sm font-medium mb-8 transition-colors w-fit px-3 py-1.5 rounded-full backdrop-blur-md border", isDark ? "text-gray-300 hover:text-white border-white/10 bg-white/5" : "text-gray-600 hover:text-black border-black/5 bg-white/40")}>
            <ArrowLeft className="w-4 h-4" /> Back to Jobs
          </Link>

          {/* Job Header Content */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-4">
                <div className={cn("w-16 h-16 rounded-2xl flex items-center justify-center text-2xl font-bold shadow-lg", isDark ? "bg-zinc-800 text-white" : "bg-white text-indigo-600")}>
                  {job.company.charAt(0)}
                </div>
                <div>
                  <h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-1">{job.title}</h1>
                  <div className={cn("flex items-center gap-2 text-sm font-medium", isDark ? "text-gray-400" : "text-gray-500")}>
                    <Building2 className="w-4 h-4" /> {job.company}
                    <span className="w-1 h-1 rounded-full bg-current opacity-50" />
                    <span className="text-indigo-500">Active recruiting</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Desktop Actions */}
            <div className="hidden md:flex gap-3">
              <button onClick={() => setIsBookmarked(!isBookmarked)} className={cn("p-3 rounded-xl border transition-all", isDark ? "border-white/10 hover:bg-white/5" : "border-gray-200 hover:bg-white bg-white/50")}>
                <Bookmark className={cn("w-5 h-5", isBookmarked && "fill-current text-indigo-500")} />
              </button>
              <button className={cn("p-3 rounded-xl border transition-all", isDark ? "border-white/10 hover:bg-white/5" : "border-gray-200 hover:bg-white bg-white/50")}>
                <Share2 className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

          {/* --- LEFT COLUMN: CONTENT (8 cols) --- */}
          <div className="lg:col-span-8 space-y-8">

            {/* 2. Bento Stats Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              <StatCard
                icon={DollarSign} label="Salary" value={job.salary_range || 'Competitive'}
                colorClass={isDark ? "bg-green-500/10 text-green-400" : "bg-green-50 text-green-600"} isDark={isDark}
              />
              <StatCard
                icon={MapPin} label="Location" value={job.location}
                colorClass={isDark ? "bg-blue-500/10 text-blue-400" : "bg-blue-50 text-blue-600"} isDark={isDark}
              />
              <StatCard
                icon={Briefcase} label="Type" value={job.type}
                colorClass={isDark ? "bg-purple-500/10 text-purple-400" : "bg-purple-50 text-purple-600"} isDark={isDark}
              />
              <StatCard
                icon={Clock} label="Posted" value={formatDate(job.posted_at)}
                colorClass={isDark ? "bg-orange-500/10 text-orange-400" : "bg-orange-50 text-orange-600"} isDark={isDark}
              />
            </div>

            {/* 3. Description */}
            <div className={cn("p-8 rounded-[32px] border", isDark ? "bg-[#121212] border-white/5" : "bg-white border-black/5")}>
              <SectionHeading isDark={isDark}>About the Role</SectionHeading>
              <div className={cn("prose prose-lg max-w-none leading-relaxed whitespace-pre-line", isDark ? "prose-invert text-gray-300" : "text-gray-600")}>
                {job.description}
              </div>
            </div>

            {/* 4. Requirements & Skills */}
            <div className={cn("p-8 rounded-[32px] border", isDark ? "bg-[#121212] border-white/5" : "bg-white border-black/5")}>
              <SectionHeading isDark={isDark}>Requirements</SectionHeading>
              {job.requirements && (
                <ul className="space-y-4 mb-8">
                  {job.requirements.map((req: string, i: number) => (
                    <li key={i} className="flex items-start gap-3">
                      <div className={cn("mt-1 p-1 rounded-full", isDark ? "bg-indigo-500/20 text-indigo-400" : "bg-indigo-50 text-indigo-600")}>
                        <CheckCircle className="w-4 h-4" />
                      </div>
                      <span className={cn("text-base", isDark ? "text-gray-300" : "text-gray-700")}>{req}</span>
                    </li>
                  ))}
                </ul>
              )}

              <div className="pt-6 border-t border-dashed border-gray-700/20">
                <h3 className={cn("text-sm font-bold uppercase tracking-wider mb-4", isDark ? "text-gray-500" : "text-gray-400")}>Tech Stack & Skills</h3>
                <div className="flex flex-wrap gap-2">
                  {job.skills?.map((skill: string, i: number) => (
                    <span key={i} className={cn("px-4 py-2 rounded-full text-sm font-medium border", isDark ? "bg-zinc-900 border-zinc-800 text-gray-300" : "bg-gray-50 border-gray-200 text-gray-700")}>
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* 5. Benefits */}
            {job.benefits && (
              <div className={cn("p-8 rounded-[32px] border", isDark ? "bg-[#121212] border-white/5" : "bg-white border-black/5")}>
                <SectionHeading isDark={isDark}>Perks & Benefits</SectionHeading>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {(Array.isArray(job.benefits) ? job.benefits : [job.benefits]).map((benefit: string, i: number) => (
                    <div key={i} className={cn("flex items-center gap-3 p-4 rounded-2xl border", isDark ? "bg-zinc-900/50 border-white/5" : "bg-gray-50 border-gray-100")}>
                      <Heart className={cn("w-5 h-5", isDark ? "text-pink-400" : "text-pink-500")} />
                      <span className={cn("font-medium", isDark ? "text-gray-200" : "text-gray-700")}>{benefit}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* --- RIGHT COLUMN: STICKY SIDEBAR (4 cols) --- */}
          <div className="lg:col-span-4 relative">
            <div className="sticky top-24 space-y-6">

              {/* 6. Apply Card */}
              <div className={cn(
                "p-6 rounded-[32px] border shadow-xl relative overflow-hidden",
                isDark ? "bg-zinc-900 border-white/10" : "bg-white border-gray-100 shadow-gray-200/50"
              )}>
                {/* Gradient glow effect */}
                <div className="absolute -top-12 -right-12 w-40 h-40 bg-indigo-500/20 rounded-full blur-3xl pointer-events-none" />

                <h3 className={cn("text-xl font-bold mb-2", isDark ? "text-white" : "text-gray-900")}>Interested?</h3>
                <p className={cn("text-sm mb-6", isDark ? "text-gray-400" : "text-gray-500")}>Don't wait. Applications close soon.</p>

                <button
                  onClick={handleApply}
                  className={cn(
                    "w-full py-4 rounded-2xl font-bold text-lg shadow-lg transition-transform active:scale-95 flex items-center justify-center gap-2",
                    isDark ? "bg-black text-white hover:bg-indigo-600" : "bg-black text-white hover:bg-indigo-700"
                  )}
                >
                  Apply Now <Zap className="w-5 h-5 fill-current" />
                </button>

                <div className="mt-4 flex items-center justify-center gap-2 text-xs text-gray-500">
                  <Clock className="w-3 h-3" /> Usually responds in 2 days
                </div>
              </div>

              {/* 7. Company Card */}
              <div className={cn("p-6 rounded-[32px] border", isDark ? "bg-[#121212] border-white/5" : "bg-white border-black/5")}>
                <h3 className={cn("text-sm font-bold uppercase tracking-wider mb-4 opacity-50", isDark ? "text-white" : "text-black")}>About the company</h3>

                <div className="flex items-center gap-4 mb-4">
                  <div className={cn("w-14 h-14 rounded-2xl flex items-center justify-center text-xl font-bold shadow-sm", isDark ? "bg-zinc-800 text-white" : "bg-gray-100 text-indigo-600")}>
                    {job.company.charAt(0)}
                  </div>
                  <div>
                    <h4 className={cn("font-bold text-lg", isDark ? "text-white" : "text-gray-900")}>{job.company}</h4>
                    <a href="#" className="text-xs text-indigo-500 hover:underline flex items-center gap-1">
                      Visit Website <Globe className="w-3 h-3" />
                    </a>
                  </div>
                </div>

                <p className={cn("text-sm mb-6 line-clamp-3", isDark ? "text-gray-400" : "text-gray-600")}>
                  Leading the industry in innovation and design. We are looking for passionate individuals to join our growing team.
                </p>

                <button className={cn("w-full py-3 rounded-xl text-sm font-bold border transition-colors", isDark ? "border-zinc-700 text-white hover:bg-zinc-800" : "border-gray-200 text-gray-900 hover:bg-gray-50")}>
                  View Company Profile
                </button>
              </div>

            </div>
          </div>

        </div>
      </div>

      {/* Mobile Sticky Action Bar */}
      <div className={cn(
        "lg:hidden fixed bottom-0 left-0 right-0 p-4 border-t backdrop-blur-xl z-50",
        isDark ? "bg-black/80 border-white/10" : "bg-white/80 border-gray-200"
      )}>
        <button
          onClick={handleApply}
          className={cn(
            "w-full py-4 rounded-2xl font-bold text-lg shadow-lg",
            isDark ? "bg-indigo-500 text-white" : "bg-indigo-600 text-white"
          )}
        >
          Apply Now
        </button>
      </div>

      {/* --- Application Modal --- */}
      <AnimatePresence>
        {showApplyModal && (
          <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setShowApplyModal(false)} className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
            <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }} className={cn("relative w-full max-w-lg rounded-[32px] overflow-hidden shadow-2xl", isDark ? "bg-[#1C1C1E] border border-white/10" : "bg-white")}>
              <div className="p-8">
                <div className="flex justify-between items-center mb-6">
                  <h2 className={cn("text-2xl font-bold", isDark ? "text-white" : "text-black")}>Apply for {job.title}</h2>
                  <button onClick={() => setShowApplyModal(false)} className="p-2 rounded-full hover:bg-gray-500/10"><X className="w-5 h-5" /></button>
                </div>
                <form onSubmit={(e) => { e.preventDefault(); handleSubmitApplication(); }} className="space-y-6">
                  <div>
                    <label className="text-sm font-bold mb-2 block">Cover Letter</label>
                    <textarea
                      className={cn("w-full p-4 rounded-2xl border outline-none focus:ring-2 focus:ring-indigo-500/50 resize-none", isDark ? "bg-black border-zinc-800" : "bg-gray-50 border-gray-200")}
                      rows={6}
                      placeholder="Why are you a good fit?"
                      value={coverLetter}
                      onChange={e => setCoverLetter(e.target.value)}
                    />
                  </div>
                  <div className="flex gap-3">
                    <button type="button" onClick={() => setShowApplyModal(false)} className={cn("flex-1 py-4 rounded-2xl font-bold border transition-colors", isDark ? "border-zinc-700 hover:bg-zinc-800" : "border-gray-200 hover:bg-gray-50")}>Cancel</button>
                    <button type="submit" className="flex-1 py-4 rounded-2xl font-bold bg-indigo-500 text-white hover:bg-indigo-600 shadow-lg shadow-indigo-500/20">Submit Application</button>
                  </div>
                </form>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}