import React, { useState, useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { 
  BookOpen, 
  Award, 
  Target, 
  TrendingUp,
  Users,
  Briefcase,
  Heart,
  Star,
  Calendar,
  FileText,
  CheckCircle,
  Clock,
  BarChart3,
  Medal,
  Zap,
  Globe,
  Handshake,
  Lightbulb,
  Plus,
  Eye,
  Download,
  Share2,
  Filter,
  Search,
  Trophy
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { Card } from './ui/Card';
import Typography from './ui/Typography';
import Button from './ui/Button';
import { 
  DigitalPassport, 
  SkillsAudit, 
  AcademicAchievement,
  CoCurricularActivity,
  InternshipExperience,
  VolunteerWork,
  MicroCredential,
  CareerMilestone,
  DigitalBadge,
  PassportReflection,
  StudentGoal,
  PortfolioItem
} from '../types';

interface PassportStats {
  totalAchievements: number;
  skillsAssessed: number;
  hoursLogged: number;
  badgesEarned: number;
  portfolioItems: number;
  overallProgress: number;
}

export default function DigitalLearningPassport() {
  const { user } = useAuth();
  const { isDark } = useTheme();
  const containerRef = useRef<HTMLDivElement>(null);
  const [activeTab, setActiveTab] = useState('overview');
  const [passport, setPassport] = useState<DigitalPassport | null>(null);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  // Mock data for demonstration
  const mockPassport: DigitalPassport = {
    id: '1',
    student_id: user?.id || '',
    created_at: '2024-01-15',
    updated_at: '2024-12-10',
    academic_achievements: [
      {
        id: '1',
        type: 'course',
        title: 'Advanced Data Structures & Algorithms',
        description: 'Comprehensive course covering advanced algorithmic concepts and data structure implementations',
        course_code: 'CSE 310',
        grade: 'A',
        gpa_impact: 4.0,
        skills_demonstrated: ['Problem Solving', 'Algorithm Design', 'Python Programming', 'Optimization'],
        date_completed: '2024-05-15',
        instructor: 'Dr. Sarah Johnson',
        verification_status: 'verified',
        evidence_files: ['project_report.pdf', 'code_repository.zip']
      },
      {
        id: '2',
        type: 'project',
        title: 'Machine Learning Portfolio Optimizer',
        description: 'Capstone project developing an AI-driven investment portfolio optimization tool',
        skills_demonstrated: ['Machine Learning', 'Python', 'Data Analysis', 'Financial Modeling'],
        date_completed: '2024-11-20',
        instructor: 'Prof. Michael Chen',
        verification_status: 'verified',
        evidence_files: ['demo_video.mp4', 'research_paper.pdf']
      }
    ],
    co_curricular_activities: [
      {
        id: '1',
        type: 'leadership',
        title: 'Computer Science Student Association President',
        organization: 'AUT CSSA',
        role: 'President',
        description: 'Led a team of 15 officers, organized tech talks, hackathons, and networking events',
        skills_developed: ['Leadership', 'Event Management', 'Public Speaking', 'Team Coordination'],
        start_date: '2024-01-01',
        end_date: '2024-12-31',
        hours_committed: 120,
        achievements: ['Increased membership by 40%', 'Organized 3 major tech events', 'Secured $5K in sponsorships'],
        reflection: 'This role taught me valuable leadership skills and how to manage diverse teams effectively.',
        evidence_files: ['event_photos.zip', 'impact_report.pdf']
      }
    ],
    internships: [
      {
        id: '1',
        company: 'TechCorp Solutions',
        position: 'Software Engineering Intern',
        department: 'Backend Development',
        description: 'Developed microservices for e-commerce platform, improved API performance by 35%',
        skills_applied: ['Node.js', 'MongoDB', 'API Design', 'Agile Development'],
        skills_learned: ['Docker', 'Kubernetes', 'CI/CD', 'System Architecture'],
        start_date: '2024-06-01',
        end_date: '2024-08-15',
        hours_completed: 480,
        supervisor_name: 'Jane Smith',
        projects_completed: ['Payment Gateway Integration', 'Performance Optimization Module'],
        reflection: 'Gained real-world experience in scalable backend development and DevOps practices.',
        evidence_files: ['internship_certificate.pdf', 'project_demos.mp4']
      }
    ],
    volunteer_work: [
      {
        id: '1',
        organization: 'Code for Good',
        role: 'Volunteer Developer',
        cause_area: 'Education Technology',
        description: 'Developed educational apps for underprivileged students',
        skills_utilized: ['React', 'Firebase', 'UI/UX Design'],
        impact_metrics: ['Reached 500+ students', 'Improved test scores by 20%'],
        start_date: '2024-02-01',
        hours_contributed: 80,
        reflection: 'Meaningful experience using technology to create positive social impact.',
        evidence_files: ['app_screenshots.png', 'impact_report.pdf']
      }
    ],
    micro_credentials: [
      {
        id: '1',
        title: 'AWS Cloud Practitioner',
        issuer: 'Amazon Web Services',
        type: 'certification',
        platform: 'AWS Training',
        skills_covered: ['Cloud Computing', 'AWS Services', 'Security', 'Cost Optimization'],
        completion_date: '2024-09-15',
        expiry_date: '2027-09-15',
        credential_url: 'https://aws.amazon.com/verification/123456',
        verification_code: 'AWS-CCP-2024-123456',
        hours_invested: 40,
        grade_achieved: 'Pass'
      }
    ],
    career_milestones: [
      {
        id: '1',
        type: 'resume_workshop',
        title: 'Professional Resume Writing Workshop',
        description: 'Comprehensive workshop on crafting ATS-friendly technical resumes',
        facilitator: 'Career Services',
        date_completed: '2024-03-10',
        skills_practiced: ['Resume Writing', 'Professional Communication', 'Self-Marketing'],
        feedback_received: 'Excellent improvement in technical skills presentation and quantifying achievements',
        action_items: ['Update LinkedIn profile', 'Create portfolio website', 'Practice elevator pitch'],
        follow_up_completed: true
      }
    ],
    skills_audit: {
      id: '1',
      student_id: user?.id || '',
      foundational_skills: {
        category: 'Foundational Skills',
        skills: [
          {
            name: 'Communication',
            level: 'proficient',
            score: 4.2,
            evidence: ['Presentation awards', 'Peer feedback'],
            last_updated: '2024-11-01',
            validation_source: 'instructor'
          },
          {
            name: 'Teamwork',
            level: 'advanced',
            score: 4.5,
            evidence: ['Group project leadership', 'Team sports participation'],
            last_updated: '2024-10-15',
            validation_source: 'peer'
          }
        ],
        category_score: 4.35,
        self_assessment_score: 4.0,
        instructor_score: 4.5,
        peer_score: 4.6,
        improvement_areas: ['Public speaking confidence'],
        strengths: ['Active listening', 'Collaborative problem-solving']
      },
      digital_tech_skills: {
        category: 'Digital & Technical Skills',
        skills: [
          {
            name: 'Programming',
            level: 'advanced',
            score: 4.7,
            evidence: ['GitHub repositories', 'Technical projects'],
            last_updated: '2024-11-20',
            validation_source: 'project'
          }
        ],
        category_score: 4.7,
        self_assessment_score: 4.5,
        instructor_score: 4.8,
        improvement_areas: ['System design patterns'],
        strengths: ['Algorithm implementation', 'Code quality']
      },
      professionalism_ethics: {
        category: 'Professionalism & Work Ethics',
        skills: [],
        category_score: 4.1,
        self_assessment_score: 4.0,
        improvement_areas: ['Time management'],
        strengths: ['Reliability', 'Initiative']
      },
      entrepreneurship_innovation: {
        category: 'Entrepreneurship & Innovation',
        skills: [],
        category_score: 3.8,
        self_assessment_score: 3.5,
        improvement_areas: ['Business acumen'],
        strengths: ['Creative thinking', 'Problem identification']
      },
      global_intercultural: {
        category: 'Global & Intercultural Competence',
        skills: [],
        category_score: 4.0,
        self_assessment_score: 4.2,
        improvement_areas: ['Cultural sensitivity'],
        strengths: ['Language skills', 'Global perspective']
      },
      overall_score: 4.2,
      last_assessment_date: '2024-11-01',
      next_assessment_due: '2025-02-01',
      assessments_history: []
    },
    reflections: [
      {
        id: '1',
        semester: 'Fall',
        year: 2024,
        key_learnings: 'Advanced my technical skills significantly through internship and capstone project',
        challenges_overcome: 'Learned to balance leadership responsibilities with academic workload',
        skills_developed: 'Leadership, system architecture, and professional communication',
        goals_achieved: ['Complete internship successfully', 'Lead student organization'],
        goals_missed: ['Obtain second certification'],
        areas_for_improvement: 'Time management and delegation skills',
        career_insights: 'Discovered passion for backend architecture and team leadership',
        next_semester_goals: ['Launch startup idea', 'Secure full-time offer'],
        date_created: '2024-12-01'
      }
    ],
    goals: [
      {
        id: '1',
        title: 'Secure Full-Time Software Engineering Role',
        description: 'Land a full-time position at a top tech company focusing on backend development',
        category: 'career',
        target_date: '2025-05-01',
        status: 'in_progress',
        progress_percentage: 65,
        milestones: [
          {
            id: '1',
            title: 'Complete technical interview prep',
            description: 'Practice 200 LeetCode problems and system design',
            due_date: '2025-01-15',
            completed: true,
            completion_date: '2025-01-10',
            evidence: ['leetcode_progress.png']
          }
        ],
        skills_to_develop: ['System Design', 'Advanced Algorithms'],
        resources_needed: ['Interview prep books', 'Mock interview sessions'],
        reflection_notes: 'Making good progress on technical skills'
      }
    ],
    badges: [
      {
        id: '1',
        name: 'Leadership Excellence',
        description: 'Demonstrated exceptional leadership in student organizations',
        criteria: ['Lead organization for 6+ months', 'Achieve measurable impact', 'Peer recognition'],
        issuer: 'AUT Career Services',
        issue_date: '2024-11-01',
        badge_image_url: '/badges/leadership.png',
        verification_url: 'https://aut.edu/verify/badge/123',
        skills_represented: ['Leadership', 'Communication', 'Project Management'],
        category: 'leadership',
        rarity: 'uncommon'
      },
      {
        id: '2',
        name: 'Technical Excellence',
        description: 'Outstanding performance in technical coursework and projects',
        criteria: ['GPA 3.8+ in technical courses', 'Complete advanced project'],
        issuer: 'AUT Computer Science Department',
        issue_date: '2024-10-15',
        badge_image_url: '/badges/technical.png',
        verification_url: 'https://aut.edu/verify/badge/124',
        skills_represented: ['Programming', 'Problem Solving', 'Innovation'],
        category: 'academic',
        rarity: 'rare'
      }
    ],
    portfolio_items: [
      {
        id: '1',
        type: 'project',
        title: 'AI-Powered Study Assistant',
        description: 'Mobile app that uses machine learning to create personalized study plans',
        tags: ['React Native', 'Python', 'Machine Learning', 'Mobile Development'],
        skills_demonstrated: ['Full-Stack Development', 'AI/ML', 'User Experience Design'],
        file_urls: ['demo_video.mp4', 'source_code.zip'],
        thumbnail_url: 'project_thumbnail.jpg',
        visibility: 'public',
        featured: true,
        created_date: '2024-08-01',
        last_updated: '2024-11-15'
      }
    ]
  };

  const passportStats: PassportStats = {
    totalAchievements: mockPassport.academic_achievements.length + 
                      mockPassport.co_curricular_activities.length + 
                      mockPassport.internships.length + 
                      mockPassport.volunteer_work.length,
    skillsAssessed: 15,
    hoursLogged: 680,
    badgesEarned: mockPassport.badges.length,
    portfolioItems: mockPassport.portfolio_items.length,
    overallProgress: 78
  };

  useEffect(() => {
    setPassport(mockPassport);
    setLoading(false);
  }, []);

  useEffect(() => {
    if (!containerRef.current) return;

    const ctx = gsap.context(() => {
      // Entrance animations
      gsap.fromTo('.passport-header', {
        opacity: 0,
        y: -50
      }, {
        opacity: 1,
        y: 0,
        duration: 1,
        ease: 'power3.out'
      });

      gsap.fromTo('.stats-card', {
        opacity: 0,
        y: 30,
        scale: 0.9
      }, {
        opacity: 1,
        y: 0,
        scale: 1,
        duration: 0.8,
        stagger: 0.1,
        ease: 'back.out(1.7)',
        delay: 0.3
      });

      gsap.fromTo('.passport-tab', {
        opacity: 0,
        x: -20
      }, {
        opacity: 1,
        x: 0,
        duration: 0.6,
        stagger: 0.05,
        ease: 'power2.out',
        delay: 0.6
      });

      gsap.fromTo('.content-card', {
        opacity: 0,
        y: 20
      }, {
        opacity: 1,
        y: 0,
        duration: 0.8,
        stagger: 0.1,
        ease: 'power2.out',
        delay: 0.8
      });
    }, containerRef);

    return () => ctx.revert();
  }, []);

  const tabs = [
    { id: 'overview', label: 'Overview', icon: BookOpen, emoji: '📊' },
    { id: 'skills', label: 'Skills Audit', icon: BarChart3, emoji: '📈' },
    { id: 'academic', label: 'Academic', icon: Award, emoji: '🎓' },
    { id: 'experience', label: 'Experience', icon: Briefcase, emoji: '💼' },
    { id: 'portfolio', label: 'Portfolio', icon: FileText, emoji: '📁' },
    { id: 'badges', label: 'Badges', icon: Medal, emoji: '🏆' },
    { id: 'goals', label: 'Goals', icon: Target, emoji: '🎯' },
    { id: 'reflections', label: 'Reflections', icon: Heart, emoji: '💭' }
  ];

  const renderOverview = () => (
    <div className="space-y-8">
      {/* Progress Overview */}
      <div className="content-card">
        <Card className="p-8" elevation={2}>
          <div className="flex items-center justify-between mb-6">
            <Typography variant="h5" className="font-bold">
              Learning Journey Progress
            </Typography>
            <div className={`px-4 py-2 rounded-full text-sm font-medium ${
              isDark ? 'bg-lime/10 text-lime' : 'bg-asu-maroon/10 text-asu-maroon'
            }`}>
              {passportStats.overallProgress}% Complete
            </div>
          </div>
          
          <div className={`w-full bg-gray-200 rounded-full h-3 mb-6 ${
            isDark ? 'bg-gray-700' : 'bg-gray-200'
          }`}>
            <div 
              className={`h-3 rounded-full transition-all duration-1000 ${
                isDark ? 'bg-gradient-to-r from-lime to-green-400' : 'bg-gradient-to-r from-asu-maroon to-red-600'
              }`}
              style={{ width: `${passportStats.overallProgress}%` }}
            ></div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-5 gap-6">
            <div className="text-center">
              <div className={`text-3xl font-bold mb-1 ${
                isDark ? 'text-lime' : 'text-asu-maroon'
              }`}>
                {passportStats.totalAchievements}
              </div>
              <div className={`text-sm ${
                isDark ? 'text-dark-muted' : 'text-gray-600'
              }`}>
                Achievements
              </div>
            </div>
            <div className="text-center">
              <div className={`text-3xl font-bold mb-1 ${
                isDark ? 'text-lime' : 'text-asu-maroon'
              }`}>
                {passportStats.skillsAssessed}
              </div>
              <div className={`text-sm ${
                isDark ? 'text-dark-muted' : 'text-gray-600'
              }`}>
                Skills Assessed
              </div>
            </div>
            <div className="text-center">
              <div className={`text-3xl font-bold mb-1 ${
                isDark ? 'text-lime' : 'text-asu-maroon'
              }`}>
                {passportStats.hoursLogged}
              </div>
              <div className={`text-sm ${
                isDark ? 'text-dark-muted' : 'text-gray-600'
              }`}>
                Hours Logged
              </div>
            </div>
            <div className="text-center">
              <div className={`text-3xl font-bold mb-1 ${
                isDark ? 'text-lime' : 'text-asu-maroon'
              }`}>
                {passportStats.badgesEarned}
              </div>
              <div className={`text-sm ${
                isDark ? 'text-dark-muted' : 'text-gray-600'
              }`}>
                Badges Earned
              </div>
            </div>
            <div className="text-center">
              <div className={`text-3xl font-bold mb-1 ${
                isDark ? 'text-lime' : 'text-asu-maroon'
              }`}>
                {passportStats.portfolioItems}
              </div>
              <div className={`text-sm ${
                isDark ? 'text-dark-muted' : 'text-gray-600'
              }`}>
                Portfolio Items
              </div>
            </div>
          </div>
        </Card>
      </div>

      {/* Recent Activity */}
      <div className="content-card">
        <Card className="p-8" elevation={2}>
          <Typography variant="h5" className="font-bold mb-6">
            Recent Activity
          </Typography>
          
          <div className="space-y-4">
            <div className="flex items-center space-x-4 p-4 rounded-lg bg-green-50 dark:bg-green-900/20">
              <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center">
                <CheckCircle className="h-5 w-5 text-white" />
              </div>
              <div className="flex-1">
                <div className="font-medium">Completed AWS Cloud Practitioner Certification</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">2 days ago</div>
              </div>
            </div>
            
            <div className="flex items-center space-x-4 p-4 rounded-lg bg-blue-50 dark:bg-blue-900/20">
              <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center">
                <Award className="h-5 w-5 text-white" />
              </div>
              <div className="flex-1">
                <div className="font-medium">Earned Leadership Excellence Badge</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">1 week ago</div>
              </div>
            </div>
            
            <div className="flex items-center space-x-4 p-4 rounded-lg bg-purple-50 dark:bg-purple-900/20">
              <div className="w-10 h-10 bg-purple-500 rounded-full flex items-center justify-center">
                <FileText className="h-5 w-5 text-white" />
              </div>
              <div className="flex-1">
                <div className="font-medium">Added AI Study Assistant to Portfolio</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">2 weeks ago</div>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className={`min-h-screen flex items-center justify-center ${
        isDark ? 'bg-dark-bg' : 'bg-gray-50'
      }`}>
        <div className="text-center">
          <div className={`animate-spin rounded-full h-8 w-8 border-b-2 mx-auto mb-4 ${
            isDark ? 'border-lime' : 'border-asu-maroon'
          }`}></div>
          <Typography variant="body1" color="textSecondary">
            Loading your Digital Learning Passport...
          </Typography>
        </div>
      </div>
    );
  }

  return (
    <div ref={containerRef} className={`min-h-screen transition-colors duration-300 ${
      isDark ? 'bg-dark-bg' : 'bg-gray-50'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Header */}
        <div className="passport-header mb-8">
          <div className="flex items-center justify-between">
            <div>
              <Typography variant="h3" className="font-bold mb-2">
                🎓 Digital Learning Passport
              </Typography>
              <Typography variant="body1" color="textSecondary">
                Your comprehensive journey of growth, skills, and achievements at AUT
              </Typography>
            </div>
            <div className="flex space-x-3">
              <Button variant="outlined" startIcon={<Download />}>
                Export
              </Button>
              <Button variant="outlined" startIcon={<Share2 />}>
                Share
              </Button>
              <Button variant="contained" startIcon={<Plus />}>
                Add Entry
              </Button>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-6 gap-6 mb-8">
          <div className="stats-card">
            <Card className="p-6 text-center" elevation={1}>
              <div className={`w-12 h-12 mx-auto mb-3 rounded-full flex items-center justify-center ${
                isDark ? 'bg-lime/10' : 'bg-asu-maroon/10'
              }`}>
                <Trophy className={`h-6 w-6 ${
                  isDark ? 'text-lime' : 'text-asu-maroon'
                }`} />
              </div>
              <Typography variant="h4" className="font-bold mb-1">
                {passportStats.totalAchievements}
              </Typography>
              <Typography variant="body2" color="textSecondary">
                Achievements
              </Typography>
            </Card>
          </div>

          <div className="stats-card">
            <Card className="p-6 text-center" elevation={1}>
              <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                <BarChart3 className="h-6 w-6 text-blue-600 dark:text-blue-400" />
              </div>
              <Typography variant="h4" className="font-bold mb-1">
                {passportStats.skillsAssessed}
              </Typography>
              <Typography variant="body2" color="textSecondary">
                Skills Assessed
              </Typography>
            </Card>
          </div>

          <div className="stats-card">
            <Card className="p-6 text-center" elevation={1}>
              <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
                <Clock className="h-6 w-6 text-green-600 dark:text-green-400" />
              </div>
              <Typography variant="h4" className="font-bold mb-1">
                {passportStats.hoursLogged}
              </Typography>
              <Typography variant="body2" color="textSecondary">
                Hours Logged
              </Typography>
            </Card>
          </div>

          <div className="stats-card">
            <Card className="p-6 text-center" elevation={1}>
              <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center">
                <Medal className="h-6 w-6 text-purple-600 dark:text-purple-400" />
              </div>
              <Typography variant="h4" className="font-bold mb-1">
                {passportStats.badgesEarned}
              </Typography>
              <Typography variant="body2" color="textSecondary">
                Badges Earned
              </Typography>
            </Card>
          </div>

          <div className="stats-card">
            <Card className="p-6 text-center" elevation={1}>
              <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-orange-100 dark:bg-orange-900/30 flex items-center justify-center">
                <FileText className="h-6 w-6 text-orange-600 dark:text-orange-400" />
              </div>
              <Typography variant="h4" className="font-bold mb-1">
                {passportStats.portfolioItems}
              </Typography>
              <Typography variant="body2" color="textSecondary">
                Portfolio Items
              </Typography>
            </Card>
          </div>

          <div className="stats-card">
            <Card className="p-6 text-center" elevation={1}>
              <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center">
                <TrendingUp className="h-6 w-6 text-indigo-600 dark:text-indigo-400" />
              </div>
              <Typography variant="h4" className="font-bold mb-1">
                {passportStats.overallProgress}%
              </Typography>
              <Typography variant="body2" color="textSecondary">
                Overall Progress
              </Typography>
            </Card>
          </div>
        </div>

        {/* Navigation Tabs */}
        <Card className="mb-8" elevation={1}>
          <div className="flex flex-wrap border-b">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`passport-tab flex items-center space-x-2 px-6 py-4 font-medium transition-all duration-300 ${
                    activeTab === tab.id
                      ? `border-b-2 ${
                          isDark 
                            ? 'border-lime text-lime bg-lime/5' 
                            : 'border-asu-maroon text-asu-maroon bg-asu-maroon/5'
                        }`
                      : `${
                          isDark 
                            ? 'text-dark-muted hover:text-dark-text hover:bg-dark-surface' 
                            : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                        }`
                  }`}
                >
                  <Icon className="h-5 w-5" />
                  <span>{tab.label}</span>
                  <span className="text-lg">{tab.emoji}</span>
                </button>
              );
            })}
          </div>
        </Card>

        {/* Tab Content */}
        <div className="tab-content">
          {activeTab === 'overview' && renderOverview()}
          
          {activeTab !== 'overview' && (
            <Card className="p-8" elevation={2}>
              <div className="text-center py-12">
                <div className={`w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center ${
                  isDark ? 'bg-lime/10' : 'bg-asu-maroon/10'
                }`}>
                  <BookOpen className={`h-8 w-8 ${
                    isDark ? 'text-lime' : 'text-asu-maroon'
                  }`} />
                </div>
                <Typography variant="h5" className="font-bold mb-2">
                  {tabs.find(t => t.id === activeTab)?.label} Section
                </Typography>
                <Typography variant="body1" color="textSecondary" className="mb-6">
                  This comprehensive section is being developed to provide detailed insights into your {tabs.find(t => t.id === activeTab)?.label.toLowerCase()}.
                </Typography>
                <Button variant="contained" startIcon={<Plus />}>
                  Add New {tabs.find(t => t.id === activeTab)?.label}
                </Button>
              </div>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}