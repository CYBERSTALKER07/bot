import React, { useState, useEffect, useRef } from 'react';
import { useTheme } from '../../context/ThemeContext';
import { 
  GraduationCap, 
  Search, 
  Bell, 
  MessageSquare, 
  User, 
  Briefcase, 
  Calendar, 
  Settings,
  ArrowRight,
  CheckCircle,
  Download,
  Smartphone,
  MousePointer2,
  X,
  Star,
  MapPin,
  Clock,
  Building2,
  Users,
  TrendingUp,
  Filter,
  BookOpen,
  Award,
  ChevronRight
} from 'lucide-react';

interface InteractiveDashboardDemoProps {
  onClose?: () => void;
}

type DemoPage = 'dashboard' | 'jobs' | 'applications' | 'messages' | 'profile' | 'events' | 'download';

interface TourStep {
  page: DemoPage;
  target: string;
  message: string;
  delay: number;
}

export default function InteractiveDashboardDemo({ onClose }: InteractiveDashboardDemoProps) {
  const { isDark } = useTheme();
  const [currentPage, setCurrentPage] = useState<DemoPage>('dashboard');
  const [pointerPosition, setPointerPosition] = useState({ x: 0, y: 0 });
  const [showPointer, setShowPointer] = useState(false);
  const [tourStep, setTourStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [waitingForClick, setWaitingForClick] = useState(false);
  const [currentTargetElement, setCurrentTargetElement] = useState<string>('');
  const [pageTransitioning, setPageTransitioning] = useState(false);
  const demoRef = useRef<HTMLDivElement>(null);

  const tourSteps: TourStep[] = [
    { 
      page: 'dashboard', 
      target: '.dashboard-jobs', 
      message: 'Click here to explore job recommendations',
      delay: 2000 
    },
    { 
      page: 'dashboard', 
      target: '.profile-completion', 
      message: 'Click to complete your profile for better visibility',
      delay: 2500 
    },
    { 
      page: 'dashboard', 
      target: '.nav-jobs', 
      message: 'Click Jobs in the sidebar to explore more opportunities',
      delay: 2000
    },
    { 
      page: 'jobs', 
      target: '.job-filters', 
      message: 'Click here to filter jobs by your preferences',
      delay: 2500 
    },
    { 
      page: 'jobs', 
      target: '.job-card-featured', 
      message: 'Click on featured jobs for one-click application',
      delay: 3000 
    },
    { 
      page: 'jobs', 
      target: '.nav-applications', 
      message: 'Click Applications to track your progress',
      delay: 2000
    },
    { 
      page: 'applications', 
      target: '.application-status', 
      message: 'Click any application to see detailed progress',
      delay: 2500 
    },
    { 
      page: 'applications', 
      target: '.nav-messages', 
      message: 'Click Messages to connect with recruiters',
      delay: 2000
    },
    { 
      page: 'messages', 
      target: '.message-thread', 
      message: 'Click on conversations to chat directly',
      delay: 2500 
    },
    { 
      page: 'messages', 
      target: '.nav-events', 
      message: 'Click Events to join career fairs',
      delay: 2000
    },
    { 
      page: 'events', 
      target: '.upcoming-events', 
      message: 'Click events to register and network',
      delay: 2500 
    },
    { 
      page: 'events', 
      target: '.nav-profile', 
      message: 'Click Profile to showcase your skills',
      delay: 2000
    },
    { 
      page: 'profile', 
      target: '.skills-section', 
      message: 'Click here to add and showcase skills',
      delay: 2500 
    },
    { 
      page: 'profile', 
      target: '.download-button', 
      message: 'Click to get the mobile app for job alerts on the go',
      delay: 2000
    }
  ];

  const handlePageTransition = (newPage: DemoPage) => {
    setPageTransitioning(true);
    setTimeout(() => {
      setCurrentPage(newPage);
      setPageTransitioning(false);
    }, 300);
  };

  const movePointerToElement = (selector: string) => {
    setTimeout(() => {
      const element = document.querySelector(selector);
      if (element && demoRef.current) {
        const rect = element.getBoundingClientRect();
        const demoRect = demoRef.current.getBoundingClientRect();
        const newPosition = {
          x: rect.left + rect.width / 2 - demoRect.left,
          y: rect.top + rect.height / 2 - demoRect.top
        };
        
        // Show pointer immediately if it's hidden
        if (!showPointer) {
          setShowPointer(true);
        }
        
        // Smooth transition to new position
        setPointerPosition(newPosition);
        setCurrentTargetElement(selector);
        setWaitingForClick(true);
      } else {
        console.log(`Element not found: ${selector}`);
        // Fallback to center of screen if element not found
        setPointerPosition({ x: 400, y: 300 });
        setShowPointer(true);
        setCurrentTargetElement(selector);
        setWaitingForClick(true);
      }
    }, 500);
  };

  const handleTargetClick = () => {
    if (!waitingForClick || !isPlaying) return;
    
    const currentStep = tourSteps[tourStep];
    setWaitingForClick(false);
    
    // Keep pointer visible during transition to next step
    setTimeout(() => {
      setTourStep(prev => prev + 1);
      playNextStep();
    }, currentStep.delay);
  };

  const startTour = () => {
    setIsPlaying(true);
    setTourStep(0);
    setCurrentPage('dashboard');
    playNextStep();
  };

  const playNextStep = () => {
    if (tourStep >= tourSteps.length) {
      setIsPlaying(false);
      setShowPointer(false);
      setWaitingForClick(false);
      setTourStep(0);
      return;
    }

    const step = tourSteps[tourStep];
    
    // Ensure we're on the correct page
    if (currentPage !== step.page) {
      handlePageTransition(step.page);
      setTimeout(() => {
        movePointerToElement(step.target);
      }, 600);
    } else {
      movePointerToElement(step.target);
    }
  };

  const navigationItems = [
    { id: 'dashboard', icon: User, label: 'Dashboard', active: currentPage === 'dashboard', className: 'nav-dashboard' },
    { id: 'jobs', icon: Briefcase, label: 'Jobs', active: currentPage === 'jobs', className: 'nav-jobs' },
    { id: 'applications', icon: CheckCircle, label: 'Applications', active: currentPage === 'applications', className: 'nav-applications' },
    { id: 'messages', icon: MessageSquare, label: 'Messages', active: currentPage === 'messages', className: 'nav-messages' },
    { id: 'events', icon: Calendar, label: 'Events', active: currentPage === 'events', className: 'nav-events' },
    { id: 'profile', icon: GraduationCap, label: 'Profile', active: currentPage === 'profile', className: 'nav-profile' }
  ];

  // Handle clicks on target elements during tour
  useEffect(() => {
    const handleDocumentClick = (e: MouseEvent) => {
      if (!waitingForClick || !currentTargetElement) return;
      
      const target = e.target as HTMLElement;
      
      // For sidebar navigation items, only accept clicks on the actual button
      if (currentTargetElement.startsWith('.nav-')) {
        const sidebarButton = document.querySelector(currentTargetElement);
        
        // Check if the click is directly on the sidebar button or its immediate children
        if (sidebarButton && (sidebarButton === target || sidebarButton.contains(target))) {
          // Ensure it's not clicking on the highlight overlay
          if (!target.classList.contains('pointer-events-none')) {
            e.preventDefault();
            e.stopPropagation();
            handleTargetClick();
          }
        }
      } else {
        // For other elements, use the existing logic
        const targetElement = document.querySelector(currentTargetElement);
        
        if (targetElement && (targetElement.contains(target) || targetElement === target)) {
          e.preventDefault();
          e.stopPropagation();
          handleTargetClick();
        }
      }
    };

    document.addEventListener('click', handleDocumentClick, true);
    return () => document.removeEventListener('click', handleDocumentClick, true);
  }, [waitingForClick, currentTargetElement, tourStep, isPlaying]);

  const renderDashboardPage = () => (
    <div className={`space-y-6 transition-all duration-300 ${pageTransitioning ? 'opacity-0 translate-x-4' : 'opacity-100 translate-x-0'}`}>
      <div className="flex items-center justify-between">
        <div>
          <h1 className={`text-3xl font-bold ${isDark ? 'text-dark-text' : 'text-gray-900'}`}>
            Welcome back, Sarah!
          </h1>
          <p className={`${isDark ? 'text-dark-muted' : 'text-gray-600'}`}>
            You have 3 new job matches and 2 interview invitations
          </p>
        </div>
        <button className={`px-4 py-2 rounded-lg text-white transition-all duration-200 hover:scale-105 ${isDark ? 'bg-lime hover:bg-lime/90' : 'bg-asu-maroon hover:bg-asu-maroon/90'}`}>
          Start Job Search
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 dashboard-jobs cursor-pointer transition-all duration-200 hover:scale-[1.02]" onClick={waitingForClick && currentTargetElement === '.dashboard-jobs' ? handleTargetClick : undefined}>
          <h2 className={`text-xl font-bold mb-4 ${isDark ? 'text-dark-text' : 'text-gray-900'}`}>
            Recommended Jobs
          </h2>
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className={`p-6 rounded-xl border transition-all duration-300 hover:shadow-lg cursor-pointer hover:scale-[1.01] ${
                isDark ? 'bg-dark-bg border-lime/20 hover:border-lime/40' : 'bg-white border-gray-200 hover:border-asu-maroon/40'
              }`}>
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h3 className={`font-bold ${isDark ? 'text-dark-text' : 'text-gray-900'}`}>
                      Software Engineer Intern
                    </h3>
                    <p className={`text-sm ${isDark ? 'text-lime' : 'text-asu-maroon'}`}>Google</p>
                    <p className={`text-sm ${isDark ? 'text-dark-muted' : 'text-gray-600'}`}>
                      <MapPin className="inline w-4 h-4 mr-1" />
                      Mountain View, CA
                    </p>
                  </div>
                  <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs">
                    98% Match
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex gap-2">
                    <span className="bg-info-100 text-info-800 px-2 py-1 rounded text-xs">React</span>
                    <span className="bg-info-100 text-info-800 px-2 py-1 rounded text-xs">Python</span>
                  </div>
                  <button className={`px-4 py-2 rounded-lg text-white text-sm transition-all duration-200 hover:scale-105 ${isDark ? 'bg-lime hover:bg-lime/90' : 'bg-asu-maroon hover:bg-asu-maroon/90'}`}>
                    Quick Apply
                  </button>
                </div>
              </div>
            ))}
          </div>
          {waitingForClick && currentTargetElement === '.dashboard-jobs' && (
            <div className="absolute inset-0 bg-info-500/10 border-2 border-info-500 rounded-xl animate-pulse pointer-events-none" />
          )}
        </div>

        <div className="space-y-6">
          <div className={`profile-completion p-6 rounded-xl text-white cursor-pointer transition-all duration-200 hover:scale-[1.02] ${
            isDark ? 'bg-gradient-to-br from-lime to-dark-accent' : 'bg-gradient-to-br from-asu-maroon to-asu-maroon-dark'
          }`} onClick={waitingForClick && currentTargetElement === '.profile-completion' ? handleTargetClick : undefined}>
            <h3 className="font-bold mb-3">Profile Strength</h3>
            <div className="w-full bg-white/20 rounded-full h-2 mb-3">
              <div className="bg-white h-2 rounded-full transition-all duration-1000" style={{ width: '85%' }}></div>
            </div>
            <p className="text-sm mb-4 opacity-90">85% Complete</p>
            <button className="bg-white text-gray-900 px-4 py-2 rounded-lg text-sm font-medium w-full transition-all duration-200 hover:scale-105">
              Complete Profile
            </button>
            {waitingForClick && currentTargetElement === '.profile-completion' && (
              <div className="absolute inset-0 bg-info-500/10 border-2 border-info-500 rounded-xl animate-pulse pointer-events-none" />
            )}
          </div>

          <div className={`p-6 rounded-xl ${isDark ? 'bg-dark-bg' : 'bg-gray-50'}`}>
            <h3 className={`font-bold mb-4 ${isDark ? 'text-dark-text' : 'text-gray-900'}`}>Activity</h3>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className={isDark ? 'text-dark-muted' : 'text-gray-600'}>Applications</span>
                <span className={`font-bold ${isDark ? 'text-lime' : 'text-asu-maroon'}`}>12</span>
              </div>
              <div className="flex justify-between">
                <span className={isDark ? 'text-dark-muted' : 'text-gray-600'}>Profile Views</span>
                <span className={`font-bold ${isDark ? 'text-lime' : 'text-asu-maroon'}`}>47</span>
              </div>
              <div className="flex justify-between">
                <span className={isDark ? 'text-dark-muted' : 'text-gray-600'}>Interviews</span>
                <span className={`font-bold ${isDark ? 'text-lime' : 'text-asu-maroon'}`}>3</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderJobsPage = () => (
    <div className={`space-y-6 transition-all duration-300 ${pageTransitioning ? 'opacity-0 translate-x-4' : 'opacity-100 translate-x-0'}`}>
      <div className="flex items-center justify-between">
        <h1 className={`text-3xl font-bold ${isDark ? 'text-dark-text' : 'text-gray-900'}`}>
          Job Search
        </h1>
        <div className="flex gap-2">
          <button className={`job-filters px-4 py-2 border rounded-lg ${
            isDark ? 'border-lime text-lime hover:bg-lime hover:text-dark-surface' : 'border-asu-maroon text-asu-maroon hover:bg-asu-maroon hover:text-white'
          }`}>
            <Filter className="w-4 h-4 mr-2 inline" />
            Filters
          </button>
          <button className={`px-4 py-2 rounded-lg text-white ${isDark ? 'bg-lime' : 'bg-asu-maroon'}`}>
            Save Search
          </button>
        </div>
      </div>

      <div className="flex gap-4 mb-6">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
          <input 
            type="text" 
            placeholder="Search jobs, companies, or keywords..."
            className={`w-full pl-10 pr-4 py-3 border rounded-lg ${
              isDark ? 'bg-dark-bg border-lime/20 text-dark-text' : 'bg-white border-gray-300'
            }`}
          />
        </div>
        <select className={`px-4 py-3 border rounded-lg ${
          isDark ? 'bg-dark-bg border-lime/20 text-dark-text' : 'bg-white border-gray-300'
        }`}>
          <option>All Locations</option>
          <option>Remote</option>
          <option>New York</option>
          <option>San Francisco</option>
        </select>
      </div>

      <div className="grid gap-4">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className={`job-card-featured p-6 rounded-xl border transition-all duration-300 hover:shadow-lg ${
            isDark ? 'bg-dark-bg border-lime/20 hover:border-lime/40' : 'bg-white border-gray-200 hover:border-asu-maroon/40'
          } ${i === 1 ? 'ring-2 ring-yellow-400' : ''}`}>
            {i === 1 && (
              <div className="flex items-center gap-2 mb-3">
                <Star className="w-4 h-4 text-yellow-400 fill-current" />
                <span className="text-yellow-600 text-sm font-medium">Featured Job</span>
              </div>
            )}
            <div className="flex justify-between items-start mb-4">
              <div className="flex items-start gap-4">
                <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${
                  isDark ? 'bg-lime/20' : 'bg-asu-maroon/20'
                }`}>
                  <Building2 className={`w-6 h-6 ${isDark ? 'text-lime' : 'text-asu-maroon'}`} />
                </div>
                <div>
                  <h3 className={`font-bold text-lg ${isDark ? 'text-dark-text' : 'text-gray-900'}`}>
                    {i === 1 ? 'Senior Software Engineer' : `Software Engineer ${i}`}
                  </h3>
                  <p className={`font-medium ${isDark ? 'text-lime' : 'text-asu-maroon'}`}>
                    {i === 1 ? 'Apple' : `Company ${i}`}
                  </p>
                  <div className="flex items-center gap-4 mt-1">
                    <span className={`text-sm ${isDark ? 'text-dark-muted' : 'text-gray-600'}`}>
                      <MapPin className="inline w-4 h-4 mr-1" />
                      {i === 1 ? 'Cupertino, CA' : 'Remote'}
                    </span>
                    <span className={`text-sm ${isDark ? 'text-dark-muted' : 'text-gray-600'}`}>
                      <Clock className="inline w-4 h-4 mr-1" />
                      {i === 1 ? '2 days ago' : `${i} week ago`}
                    </span>
                  </div>
                </div>
              </div>
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                i === 1 ? 'bg-green-100 text-green-800' : 'bg-info-100 text-info-800'
              }`}>
                {i === 1 ? '96% Match' : `${95 - i}% Match`}
              </span>
            </div>
            
            <p className={`text-sm mb-4 ${isDark ? 'text-dark-muted' : 'text-gray-600'}`}>
              {i === 1 
                ? 'Join our team to build the next generation of iOS applications...' 
                : 'Exciting opportunity to work with cutting-edge technology...'
              }
            </p>
            
            <div className="flex flex-wrap gap-2 mb-4">
              <span className="bg-info-100 text-info-800 px-2 py-1 rounded text-xs">Swift</span>
              <span className="bg-info-100 text-info-800 px-2 py-1 rounded text-xs">iOS</span>
              <span className="bg-info-100 text-info-800 px-2 py-1 rounded text-xs">React Native</span>
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <span className={`text-sm ${isDark ? 'text-dark-muted' : 'text-gray-600'}`}>
                  $120,000 - $160,000
                </span>
                <span className={`text-sm ${isDark ? 'text-dark-muted' : 'text-gray-600'}`}>
                  Full-time
                </span>
              </div>
              <div className="flex gap-2">
                <button className={`px-4 py-2 border rounded-lg text-sm ${
                  isDark ? 'border-lime/40 text-lime hover:bg-lime hover:text-dark-surface' : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                }`}>
                  Save
                </button>
                <button className={`px-4 py-2 rounded-lg text-white text-sm ${isDark ? 'bg-lime' : 'bg-asu-maroon'}`}>
                  Quick Apply
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderApplicationsPage = () => (
    <div className={`space-y-6 transition-all duration-300 ${pageTransitioning ? 'opacity-0 translate-x-4' : 'opacity-100 translate-x-0'}`}>
      <h1 className={`text-3xl font-bold ${isDark ? 'text-dark-text' : 'text-gray-900'}`}>
        My Applications
      </h1>

      <div className="grid gap-4">
        {[
          { company: 'Google', role: 'Software Engineer Intern', status: 'Interview Scheduled', color: 'green' },
          { company: 'Microsoft', role: 'Data Science Intern', status: 'Under Review', color: 'yellow' },
          { company: 'Apple', role: 'iOS Developer', status: 'Application Submitted', color: 'blue' },
          { company: 'Meta', role: 'Frontend Engineer', status: 'Rejected', color: 'red' }
        ].map((app, i) => (
          <div key={i} className={`application-status p-6 rounded-xl border ${
            isDark ? 'bg-dark-bg border-lime/20' : 'bg-white border-gray-200'
          }`}>
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className={`font-bold text-lg ${isDark ? 'text-dark-text' : 'text-gray-900'}`}>
                  {app.role}
                </h3>
                <p className={`text-lime`}>{app.company}</p>
                <p className={`text-sm ${isDark ? 'text-dark-muted' : 'text-gray-600'}`}>
                  Applied 3 days ago
                </p>
              </div>
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                app.color === 'green' ? 'bg-green-100 text-green-800' :
                app.color === 'yellow' ? 'bg-yellow-100 text-yellow-800' :
                app.color === 'blue' ? 'bg-info-100 text-info-800' :
                'bg-red-100 text-red-800'
              }`}>
                {app.status}
              </span>
            </div>
            
            <div className="flex items-center gap-4">
              <div className="flex-1 bg-gray-200 rounded-full h-2">
                <div className={`h-2 rounded-full ${
                  app.color === 'green' ? 'bg-green-500' :
                  app.color === 'yellow' ? 'bg-yellow-500' :
                  app.color === 'blue' ? 'bg-info-500' :
                  'bg-red-500'
                }`} style={{ 
                  width: app.color === 'green' ? '75%' : 
                         app.color === 'yellow' ? '50%' : 
                         app.color === 'blue' ? '25%' : '100%' 
                }}></div>
              </div>
              <button className={`text-sm ${isDark ? 'text-lime' : 'text-asu-maroon'}`}>
                View Details
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderMessagesPage = () => (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className={`p-6 rounded-xl ${isDark ? 'bg-dark-bg' : 'bg-gray-50'}`}>
        <h2 className={`font-bold mb-4 ${isDark ? 'text-dark-text' : 'text-gray-900'}`}>Conversations</h2>
        <div className="space-y-3">
          {[
            { name: 'Sarah Johnson', company: 'Google', preview: 'Thanks for your interest...', time: '2m ago', unread: true },
            { name: 'Mike Chen', company: 'Microsoft', preview: 'Your interview is scheduled...', time: '1h ago', unread: false },
            { name: 'Emily Davis', company: 'Apple', preview: 'We would like to move forward...', time: '3h ago', unread: true }
          ].map((msg, i) => (
            <div key={i} className={`message-thread p-4 rounded-lg cursor-pointer transition-colors ${
              isDark ? 'hover:bg-dark-surface' : 'hover:bg-white'
            } ${msg.unread ? 'border-l-4 border-lime' : ''}`}>
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                  isDark ? 'bg-lime/20' : 'bg-asu-maroon/20'
                }`}>
                  <User className="w-5 h-5" />
                </div>
                <div className="flex-1">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className={`font-medium ${isDark ? 'text-dark-text' : 'text-gray-900'}`}>
                        {msg.name}
                      </p>
                      <p className={`text-xs ${isDark ? 'text-lime' : 'text-asu-maroon'}`}>
                        {msg.company}
                      </p>
                    </div>
                    <span className={`text-xs ${isDark ? 'text-dark-muted' : 'text-gray-500'}`}>
                      {msg.time}
                    </span>
                  </div>
                  <p className={`text-sm mt-1 ${isDark ? 'text-dark-muted' : 'text-gray-600'}`}>
                    {msg.preview}
                  </p>
                </div>
                {msg.unread && (
                  <div className="w-2 h-2 bg-lime rounded-full"></div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className={`lg:col-span-2 p-6 rounded-xl ${isDark ? 'bg-dark-bg' : 'bg-white'}`}>
        <div className="flex items-center gap-3 mb-6 pb-4 border-b">
          <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
            isDark ? 'bg-lime/20' : 'bg-asu-maroon/20'
          }`}>
            <User className="w-5 h-5" />
          </div>
          <div>
            <p className={`font-medium ${isDark ? 'text-dark-text' : 'text-gray-900'}`}>
              Sarah Johnson
            </p>
            <p className={`text-sm ${isDark ? 'text-lime' : 'text-asu-maroon'}`}>
              Recruiter at Google
            </p>
          </div>
        </div>

        <div className="space-y-4 mb-6">
          <div className="flex gap-3">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
              isDark ? 'bg-lime/20' : 'bg-asu-maroon/20'
            }`}>
              <User className="w-4 h-4" />
            </div>
            <div className={`max-w-xs p-3 rounded-lg ${
              isDark ? 'bg-dark-surface text-dark-text' : 'bg-gray-100 text-gray-900'
            }`}>
              <p className="text-sm">
                Hi! Thanks for applying to our Software Engineer Intern position. I'd love to schedule a quick call to discuss your background.
              </p>
              <span className={`text-xs ${isDark ? 'text-dark-muted' : 'text-gray-500'}`}>
                2 minutes ago
              </span>
            </div>
          </div>

          <div className="flex gap-3 justify-end">
            <div className={`max-w-xs p-3 rounded-lg ${
              isDark ? 'bg-lime text-dark-surface' : 'bg-asu-maroon text-white'
            }`}>
              <p className="text-sm">
                Hi Sarah! Thank you for reaching out. I'm very interested in the position and would be happy to schedule a call. What times work best for you this week?
              </p>
              <span className={`text-xs opacity-75`}>
                Just now
              </span>
            </div>
            <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
              isDark ? 'bg-dark-accent/20' : 'bg-gray-200'
            }`}>
              <User className="w-4 h-4" />
            </div>
          </div>
        </div>

        <div className="flex gap-2">
          <input 
            type="text" 
            placeholder="Type your message..."
            className={`flex-1 p-3 border rounded-lg ${
              isDark ? 'bg-dark-surface border-lime/20 text-dark-text' : 'bg-white border-gray-300'
            }`}
          />
          <button className={`px-4 py-3 rounded-lg text-white ${isDark ? 'bg-lime' : 'bg-asu-maroon'}`}>
            Send
          </button>
        </div>
      </div>
    </div>
  );

  const renderEventsPage = () => (
    <div className={`space-y-6 transition-all duration-300 ${pageTransitioning ? 'opacity-0 translate-x-4' : 'opacity-100 translate-x-0'}`}>
      <div className="flex items-center justify-between">
        <h1 className={`text-3xl font-bold ${isDark ? 'text-dark-text' : 'text-gray-900'}`}>
          Career Events
        </h1>
        <button className={`px-4 py-2 rounded-lg text-white ${isDark ? 'bg-lime' : 'bg-asu-maroon'}`}>
          Create Event
        </button>
      </div>

      <div className="upcoming-events grid gap-6">
        {[
          { 
            title: 'Tech Career Fair 2025', 
            date: 'Tomorrow, 10:00 AM', 
            location: 'Virtual Event', 
            attendees: 234,
            type: 'Career Fair'
          },
          { 
            title: 'Resume Building Workshop', 
            date: 'Friday, 2:00 PM', 
            location: 'Student Center', 
            attendees: 45,
            type: 'Workshop'
          },
          { 
            title: 'Google Info Session', 
            date: 'Next Monday, 6:00 PM', 
            location: 'Auditorium B', 
            attendees: 156,
            type: 'Info Session'
          }
        ].map((event, i) => (
          <div key={i} className={`p-6 rounded-xl border ${
            isDark ? 'bg-dark-bg border-lime/20' : 'bg-white border-gray-200'
          }`}>
            <div className="flex justify-between items-start mb-4">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <span className={`px-2 py-1 rounded text-xs font-medium ${
                    event.type === 'Career Fair' ? 'bg-green-100 text-green-800' :
                    event.type === 'Workshop' ? 'bg-info-100 text-info-800' :
                    'bg-purple-100 text-purple-800'
                  }`}>
                    {event.type}
                  </span>
                </div>
                <h3 className={`font-bold text-lg ${isDark ? 'text-dark-text' : 'text-gray-900'}`}>
                  {event.title}
                </h3>
                <div className="flex items-center gap-4 mt-2">
                  <span className={`text-sm ${isDark ? 'text-dark-muted' : 'text-gray-600'}`}>
                    <Clock className="inline w-4 h-4 mr-1" />
                    {event.date}
                  </span>
                  <span className={`text-sm ${isDark ? 'text-dark-muted' : 'text-gray-600'}`}>
                    <MapPin className="inline w-4 h-4 mr-1" />
                    {event.location}
                  </span>
                  <span className={`text-sm ${isDark ? 'text-dark-muted' : 'text-gray-600'}`}>
                    <Users className="inline w-4 h-4 mr-1" />
                    {event.attendees} attending
                  </span>
                </div>
              </div>
              <button className={`px-4 py-2 rounded-lg text-white ${isDark ? 'bg-lime' : 'bg-asu-maroon'}`}>
                Register
              </button>
            </div>
            <p className={`text-sm ${isDark ? 'text-dark-muted' : 'text-gray-600'}`}>
              {event.type === 'Career Fair' 
                ? 'Connect with top tech companies and explore internship opportunities...'
                : event.type === 'Workshop'
                ? 'Learn how to craft the perfect resume that gets noticed by recruiters...'
                : 'Learn about Google\'s culture, opportunities, and application process...'
              }
            </p>
          </div>
        ))}
      </div>
    </div>
  );

  const renderProfilePage = () => (
    <div className={`space-y-6 transition-all duration-300 ${pageTransitioning ? 'opacity-0 translate-x-4' : 'opacity-100 translate-x-0'}`}>
      <div className="flex items-center justify-between">
        <h1 className={`text-3xl font-bold ${isDark ? 'text-dark-text' : 'text-gray-900'}`}>
          My Profile
        </h1>
        <button className={`px-4 py-2 rounded-lg text-white ${isDark ? 'bg-lime' : 'bg-asu-maroon'}`}>
          Edit Profile
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className={`p-6 rounded-xl ${isDark ? 'bg-dark-bg' : 'bg-white'}`}>
          <div className="text-center mb-6">
            <div className={`w-24 h-24 rounded-full mx-auto mb-4 flex items-center justify-center ${
              isDark ? 'bg-lime/20' : 'bg-asu-maroon/20'
            }`}>
              <User className={`w-12 h-12 ${isDark ? 'text-lime' : 'text-asu-maroon'}`} />
            </div>
            <h2 className={`font-bold text-xl ${isDark ? 'text-dark-text' : 'text-gray-900'}`}>
              Sarah Johnson
            </h2>
            <p className={`${isDark ? 'text-dark-muted' : 'text-gray-600'}`}>
              Computer Science Student
            </p>
            <p className={`text-sm ${isDark ? 'text-dark-muted' : 'text-gray-600'}`}>
              American University of Technology
            </p>
          </div>

          <div className="space-y-4">
            <div>
              <label className={`text-sm font-medium ${isDark ? 'text-dark-text' : 'text-gray-700'}`}>
                Contact
              </label>
              <p className={`text-sm ${isDark ? 'text-dark-muted' : 'text-gray-600'}`}>
                sarah.johnson@aut.edu
              </p>
              <p className={`text-sm ${isDark ? 'text-dark-muted' : 'text-gray-600'}`}>
                +1 (555) 123-4567
              </p>
            </div>
            <div>
              <label className={`text-sm font-medium ${isDark ? 'text-dark-text' : 'text-gray-700'}`}>
                Location
              </label>
              <p className={`text-sm ${isDark ? 'text-dark-muted' : 'text-gray-600'}`}>
                Tashkent, Uzbekistan
              </p>
            </div>
          </div>
        </div>

        <div className="lg:col-span-2 space-y-6">
          <div className={`skills-section p-6 rounded-xl ${isDark ? 'bg-dark-bg' : 'bg-white'}`}>
            <h3 className={`font-bold text-lg mb-4 ${isDark ? 'text-dark-text' : 'text-gray-900'}`}>
              Skills
            </h3>
            <div className="grid grid-cols-2 gap-4">
              {[
                { skill: 'JavaScript', level: 90 },
                { skill: 'React', level: 85 },
                { skill: 'Python', level: 80 },
                { skill: 'Node.js', level: 75 },
                { skill: 'SQL', level: 70 },
                { skill: 'Git', level: 85 }
              ].map((item, i) => (
                <div key={i}>
                  <div className="flex justify-between mb-1">
                    <span className={`text-sm font-medium ${isDark ? 'text-dark-text' : 'text-gray-700'}`}>
                      {item.skill}
                    </span>
                    <span className={`text-sm ${isDark ? 'text-dark-muted' : 'text-gray-600'}`}>
                      {item.level}%
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className={`h-2 rounded-full ${isDark ? 'bg-lime' : 'bg-asu-maroon'}`}
                      style={{ width: `${item.level}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className={`p-6 rounded-xl ${isDark ? 'bg-dark-bg' : 'bg-white'}`}>
            <h3 className={`font-bold text-lg mb-4 ${isDark ? 'text-dark-text' : 'text-gray-900'}`}>
              Experience
            </h3>
            <div className="space-y-4">
              <div className="border-l-2 border-lime pl-4">
                <h4 className={`font-medium ${isDark ? 'text-dark-text' : 'text-gray-900'}`}>
                  Frontend Developer Intern
                </h4>
                <p className={`text-sm ${isDark ? 'text-lime' : 'text-asu-maroon'}`}>
                  TechStart Inc.
                </p>
                <p className={`text-sm ${isDark ? 'text-dark-muted' : 'text-gray-600'}`}>
                  Summer 2024 • 3 months
                </p>
                <p className={`text-sm mt-2 ${isDark ? 'text-dark-muted' : 'text-gray-600'}`}>
                  Developed responsive web applications using React and TypeScript...
                </p>
              </div>
            </div>
          </div>

          <div className={`p-6 rounded-xl ${isDark ? 'bg-dark-bg' : 'bg-white'}`}>
            <h3 className={`font-bold text-lg mb-4 ${isDark ? 'text-dark-text' : 'text-gray-900'}`}>
              Education
            </h3>
            <div className="border-l-2 border-lime pl-4">
              <h4 className={`font-medium ${isDark ? 'text-dark-text' : 'text-gray-900'}`}>
                Bachelor of Computer Science
              </h4>
              <p className={`text-sm ${isDark ? 'text-lime' : 'text-asu-maroon'}`}>
                American University of Technology
              </p>
              <p className={`text-sm ${isDark ? 'text-dark-muted' : 'text-gray-600'}`}>
                2022 - 2026 • GPA: 3.8/4.0
              </p>
            </div>
          </div>

          {/* Download App CTA */}
          <div className={`download-button p-6 rounded-xl border-2 border-dashed cursor-pointer transition-all duration-200 hover:scale-[1.02] ${
            isDark ? 'border-lime/40 bg-lime/5 hover:bg-lime/10' : 'border-asu-maroon/40 bg-asu-maroon/5 hover:bg-asu-maroon/10'
          }`} onClick={waitingForClick && currentTargetElement === '.download-button' ? handleTargetClick : undefined}>
            <div className="text-center">
              <Smartphone className={`w-12 h-12 mx-auto mb-3 ${isDark ? 'text-lime' : 'text-asu-maroon'}`} />
              <h4 className={`font-bold mb-2 ${isDark ? 'text-dark-text' : 'text-gray-900'}`}>
                Get Mobile App
              </h4>
              <p className={`text-sm mb-4 ${isDark ? 'text-dark-muted' : 'text-gray-600'}`}>
                Take your job search anywhere with instant notifications
              </p>
              <button className={`px-4 py-2 rounded-lg text-white transition-all duration-200 hover:scale-105 ${isDark ? 'bg-lime hover:bg-lime/90' : 'bg-asu-maroon hover:bg-asu-maroon/90'}`}>
                Download Now
              </button>
            </div>
            {waitingForClick && currentTargetElement === '.download-button' && (
              <div className="absolute inset-0 bg-info-500/10 border-2 border-info-500 rounded-xl animate-pulse pointer-events-none" />
            )}
          </div>
        </div>
      </div>
    </div>
  );

  const renderDownloadPage = () => (
    <div className="text-center space-y-8">
      <div className="max-w-2xl mx-auto">
        <h1 className={`text-4xl font-bold mb-4 ${isDark ? 'text-dark-text' : 'text-gray-900'}`}>
          Take AUT Handshake Everywhere
        </h1>
        <p className={`text-xl ${isDark ? 'text-dark-muted' : 'text-gray-600'}`}>
          Get instant job alerts, apply on the go, and stay connected with your professional network
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
        <div className={`download-cta p-8 rounded-2xl text-center ${
          isDark ? 'bg-gradient-to-br from-lime to-dark-accent' : 'bg-gradient-to-br from-asu-maroon to-asu-maroon-dark'
        }`}>
          <Smartphone className="w-16 h-16 text-white mx-auto mb-4" />
          <h3 className="text-2xl font-bold text-white mb-4">Mobile App</h3>
          <p className="text-white/90 mb-6">
            Never miss an opportunity with instant push notifications and seamless mobile experience
          </p>
          <div className="space-y-3">
            <button className="w-full bg-white text-gray-900 py-3 px-6 rounded-lg font-medium flex items-center justify-center gap-2">
              <Download className="w-5 h-5" />
              Download for iOS
            </button>
            <button className="w-full bg-white text-gray-900 py-3 px-6 rounded-lg font-medium flex items-center justify-center gap-2">
              <Download className="w-5 h-5" />
              Download for Android
            </button>
          </div>
        </div>

        <div className={`p-8 rounded-2xl text-center border ${
          isDark ? 'bg-dark-bg border-lime/20' : 'bg-white border-gray-200'
        }`}>
          <BookOpen className={`w-16 h-16 mx-auto mb-4 ${isDark ? 'text-lime' : 'text-asu-maroon'}`} />
          <h3 className={`text-2xl font-bold mb-4 ${isDark ? 'text-dark-text' : 'text-gray-900'}`}>
            Try for Free
          </h3>
          <p className={`mb-6 ${isDark ? 'text-dark-muted' : 'text-gray-600'}`}>
            Start exploring opportunities right now with our web platform - no download required
          </p>
          <button className={`w-full py-3 px-6 rounded-lg font-medium text-white ${isDark ? 'bg-lime' : 'bg-asu-maroon'}`}>
            Create Free Account
          </button>
          <p className={`text-sm mt-3 ${isDark ? 'text-dark-muted' : 'text-gray-500'}`}>
            No credit card required
          </p>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-3xl mx-auto mt-12">
        {[
          { icon: Bell, label: 'Push Notifications', desc: 'Real-time job alerts' },
          { icon: MessageSquare, label: 'Direct Messaging', desc: 'Chat with recruiters' },
          { icon: TrendingUp, label: 'Application Tracking', desc: 'Monitor your progress' },
          { icon: Award, label: 'Skill Assessments', desc: 'Showcase your abilities' }
        ].map((feature, i) => (
          <div key={i} className="text-center">
            <div className={`w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3 ${
              isDark ? 'bg-lime/20' : 'bg-asu-maroon/20'
            }`}>
              <feature.icon className={`w-6 h-6 ${isDark ? 'text-lime' : 'text-asu-maroon'}`} />
            </div>
            <h4 className={`font-medium mb-1 ${isDark ? 'text-dark-text' : 'text-gray-900'}`}>
              {feature.label}
            </h4>
            <p className={`text-sm ${isDark ? 'text-dark-muted' : 'text-gray-600'}`}>
              {feature.desc}
            </p>
          </div>
        ))}
      </div>

      <div className={`max-w-md mx-auto p-6 rounded-xl ${isDark ? 'bg-dark-bg' : 'bg-gray-50'}`}>
        <h4 className={`font-bold mb-3 ${isDark ? 'text-dark-text' : 'text-gray-900'}`}>
          Join 10,000+ AUT Students
        </h4>
        <div className="flex items-center justify-center gap-2 mb-3">
          {[1, 2, 3, 4, 5].map((star) => (
            <Star key={star} className="w-5 h-5 text-yellow-400 fill-current" />
          ))}
        </div>
        <p className={`text-sm ${isDark ? 'text-dark-muted' : 'text-gray-600'}`}>
          "AUT Handshake helped me land my dream internship at Google. The platform is intuitive and the job matching is incredibly accurate!"
        </p>
        <p className={`text-sm font-medium mt-2 ${isDark ? 'text-lime' : 'text-asu-maroon'}`}>
          - Ahmed Karimov, CS '24
        </p>
      </div>
    </div>
  );

  const renderCurrentPage = () => {
    switch (currentPage) {
      case 'dashboard':
        return renderDashboardPage();
      case 'jobs':
        return renderJobsPage();
      case 'applications':
        return renderApplicationsPage();
      case 'messages':
        return renderMessagesPage();
      case 'events':
        return renderEventsPage();
      case 'profile':
        return renderProfilePage();
      case 'download':
        return renderDownloadPage();
      default:
        return renderDashboardPage();
    }
  };

  return (
    <div ref={demoRef} className={`fixed inset-0 z-50 ${isDark ? 'bg-dark-bg' : 'bg-white'}`}>
      {/* Header */}
      <div className={`border-b px-6 py-4 flex items-center justify-between ${
        isDark ? 'border-lime/20 bg-dark-surface' : 'border-gray-200 bg-white'
      }`}>
        <div className="flex items-center gap-3">
          <GraduationCap className={`w-8 h-8 ${isDark ? 'text-lime' : 'text-asu-maroon'}`} />
          <span className={`font-bold text-xl ${isDark ? 'text-dark-text' : 'text-gray-900'}`}>
            AUT Handshake
          </span>
          <span className="bg-info-100 text-info-800 px-2 py-1 rounded text-xs font-medium">
            DEMO
          </span>
        </div>
        
        <div className="flex items-center gap-4">
          {!isPlaying && currentPage !== 'download' && (
            <button 
              onClick={startTour}
              className={`px-4 py-2 rounded-lg text-white ${isDark ? 'bg-lime' : 'bg-asu-maroon'}`}
            >
              Start Demo Tour
            </button>
          )}
          {currentPage !== 'download' && (
            <button 
              onClick={() => setCurrentPage('download')}
              className={`px-4 py-2 border rounded-lg ${
                isDark ? 'border-lime text-lime hover:bg-lime hover:text-dark-surface' : 'border-asu-maroon text-asu-maroon hover:bg-asu-maroon hover:text-white'
              }`}
            >
              Get App
            </button>
          )}
          {onClose && (
            <button 
              onClick={onClose}
              className={`p-2 rounded-lg ${isDark ? 'hover:bg-dark-bg' : 'hover:bg-gray-100'}`}
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>
      </div>

      <div className="flex h-[calc(100vh-73px)]">
        {/* Sidebar Navigation */}
        {currentPage !== 'download' && (
          <div className={`w-64 border-r ${isDark ? 'border-lime/20 bg-dark-surface' : 'border-gray-200 bg-gray-50'}`}>
            <div className="p-4">
              <div className="space-y-2">
                {navigationItems.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => handlePageTransition(item.id as DemoPage)}
                    className={`${item.className} w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-all duration-300 relative ${
                      item.active
                        ? isDark 
                          ? 'bg-lime text-dark-surface shadow-lg scale-105' 
                          : 'bg-asu-maroon text-white shadow-lg scale-105'
                        : isDark
                          ? 'text-dark-text hover:bg-dark-bg hover:scale-102'
                          : 'text-gray-700 hover:bg-white hover:scale-102'
                    }`}
                  >
                    <item.icon className="w-5 h-5" />
                    {item.label}
                    {item.id === 'messages' && (
                      <span className="ml-auto bg-red-500 text-white text-xs px-2 py-0.5 rounded-full animate-pulse">
                        2
                      </span>
                    )}
                    {item.active && (
                      <ChevronRight className="ml-auto w-4 h-4" />
                    )}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Main Content */}
        <div className="flex-1 overflow-auto">
          <div className="p-6">
            {renderCurrentPage()}
          </div>
        </div>
      </div>

      {/* Animated Pointer */}
      {showPointer && (
        <div 
          className="fixed pointer-events-none z-50 transition-all duration-1000 ease-in-out"
          style={{
            left: `${pointerPosition.x}px`,
            top: `${pointerPosition.y}px`,
            transform: 'translate(-50%, -50%)'
          }}
        >
          <div className="relative">
            <MousePointer2 className="w-8 h-8 text-red-500 animate-pulse" />
            <div className="absolute -top-12 left-8 bg-gray-900 text-white px-3 py-2 rounded-lg text-sm whitespace-nowrap">
              {tourSteps[tourStep - 1]?.message}
              <div className="absolute bottom-0 left-4 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-900 transform translate-y-full"></div>
            </div>
            <div className="absolute inset-0 w-8 h-8 border-2 border-red-500 rounded-full animate-ping"></div>
          </div>
        </div>
      )}

      {/* Tour Progress */}
      {isPlaying && (
        <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 z-50">
          <div className={`px-4 py-2 rounded-full ${isDark ? 'bg-dark-surface border border-lime/20' : 'bg-white border border-gray-200'} shadow-lg`}>
            <div className="flex items-center gap-2">
              <span className={`text-sm ${isDark ? 'text-dark-text' : 'text-gray-700'}`}>
                Demo Tour: {tourStep} / {tourSteps.length} {waitingForClick && '- Click the highlighted area'}
              </span>
              <div className="w-32 bg-gray-200 rounded-full h-2">
                <div 
                  className={`h-2 rounded-full transition-all duration-300 ${isDark ? 'bg-lime' : 'bg-asu-maroon'}`}
                  style={{ width: `${(tourStep / tourSteps.length) * 100}%` }}
                ></div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}