import { useState, useEffect, useRef, useCallback } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { 
  Brain,
  Computer,
  Briefcase,
  Target,
  Globe,
  TrendingUp,
  BarChart3,
  Calendar,
  ClipboardList,
  Download,
  Share2,
  Plus,
  Edit,
  CheckCircle,
  AlertCircle,
  Users
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { SkillsAudit, SkillAssessment } from '../types';
import { supabase } from '../lib/supabase';
import Typography from './ui/Typography';
import Button from './ui/Button';
import { Card } from './ui/Card';

gsap.registerPlugin(ScrollTrigger);

export default function SkillsAuditSystem() {
  const { user } = useAuth();
  const { isDark } = useTheme();
  const containerRef = useRef<HTMLDivElement>(null);
  const [activeCategory, setActiveCategory] = useState('overview');
  const [viewMode, setViewMode] = useState<'radar' | 'detailed'>('radar');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [skillsAudit, setSkillsAudit] = useState<SkillsAudit | null>(null);

  const fetchSkillsAudit = useCallback(async () => {
    if (!user?.id) return;
    
    try {
      setLoading(true);
      setError(null);
      
      const { data, error } = await supabase
        .from('skills_audits')
        .select(`
          *,
          skill_assessments(*)
        `)
        .eq('student_id', user.id)
        .order('created_at', { ascending: false })
        .limit(1)
        .single();

      if (error && error.code !== 'PGRST116') {
        throw error;
      }

      if (data) {
        setSkillsAudit(data);
      } else {
        // No audit exists, create a placeholder or prompt to take assessment
        setSkillsAudit(null);
      }
    } catch (err) {
      console.error('Error fetching skills audit:', err);
      setError(err instanceof Error ? err.message : 'Failed to load skills audit');
    } finally {
      setLoading(false);
    }
  }, [user?.id]);

  useEffect(() => {
    if (user?.id) {
      fetchSkillsAudit();
    }
  }, [user?.id, fetchSkillsAudit]);

  const skillCategories = [
    {
      id: 'foundational',
      name: 'Foundational Skills',
      icon: Brain,
      color: 'blue',
      data: skillsAudit?.foundational_skills,
      description: 'Core interpersonal and cognitive abilities'
    },
    {
      id: 'digital',
      name: 'Digital & Tech Skills',
      icon: Computer,
      color: 'purple',
      data: skillsAudit?.digital_tech_skills,
      description: 'Technical competencies and digital literacy'
    },
    {
      id: 'professional',
      name: 'Professionalism & Ethics',
      icon: Briefcase,
      color: 'green',
      data: skillsAudit?.professionalism_ethics,
      description: 'Work ethics and professional conduct'
    },
    {
      id: 'entrepreneurship',
      name: 'Entrepreneurship & Innovation',
      icon: Target,
      color: 'orange',
      data: skillsAudit?.entrepreneurship_innovation,
      description: 'Innovation and business mindset'
    },
    {
      id: 'global',
      name: 'Global & Intercultural',
      icon: Globe,
      color: 'teal',
      data: skillsAudit?.global_intercultural,
      description: 'Cultural awareness and global perspective'
    }
  ];

  if (loading) {
    return (
      <div className={`min-h-screen ${isDark ? 'bg-dark-bg' : 'bg-gray-50'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <div className={`animate-spin rounded-full h-8 w-8 border-b-2 mx-auto mb-4 ${
              isDark ? 'border-lime' : 'border-asu-maroon'
            }`}></div>
            <Typography variant="body1" color="textSecondary">
              Loading your skills audit...
            </Typography>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`min-h-screen ${isDark ? 'bg-dark-bg' : 'bg-gray-50'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Card className="p-8 text-center">
            <Typography variant="h6" className="text-red-600 mb-2">
              Error Loading Skills Audit
            </Typography>
            <Typography variant="body1" color="textSecondary" className="mb-4">
              {error}
            </Typography>
            <Button onClick={fetchSkillsAudit} variant="outlined">
              Try Again
            </Button>
          </Card>
        </div>
      </div>
    );
  }

  if (!skillsAudit) {
    return (
      <div className={`min-h-screen ${isDark ? 'bg-dark-bg' : 'bg-gray-50'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Card className="p-12 text-center">
            <ClipboardList className={`h-16 w-16 mx-auto mb-4 ${
              isDark ? 'text-dark-muted' : 'text-gray-400'
            }`} />
            <Typography variant="h5" className="font-medium mb-2">
              No Skills Audit Available
            </Typography>
            <Typography variant="body1" color="textSecondary" className="mb-6">
              Take a comprehensive skills assessment to track your professional development and identify areas for growth.
            </Typography>
            <Button variant="filled" color="primary" size="large">
              Start Skills Assessment
            </Button>
          </Card>
        </div>
      </div>
    );
  }

  useEffect(() => {
    setLoading(false);
  }, []);

  useEffect(() => {
    if (!containerRef.current) return;

    const ctx = gsap.context(() => {
      gsap.fromTo('.skills-header', {
        opacity: 0,
        y: -30
      }, {
        opacity: 1,
        y: 0,
        duration: 0.8,
        ease: 'power2.out'
      });

      gsap.fromTo('.category-card', {
        opacity: 0,
        y: 20,
        scale: 0.95
      }, {
        opacity: 1,
        y: 0,
        scale: 1,
        duration: 0.6,
        stagger: 0.1,
        ease: 'back.out(1.7)',
        delay: 0.3
      });

      gsap.fromTo('.skill-item', {
        opacity: 0,
        x: -20
      }, {
        opacity: 1,
        x: 0,
        duration: 0.5,
        stagger: 0.05,
        ease: 'power2.out',
        delay: 0.6
      });
    }, containerRef);

    return () => ctx.revert();
  }, [activeCategory]);

  const getSkillLevelColor = (level: string) => {
    const colors = {
      beginner: isDark ? 'text-red-400 bg-red-900/20' : 'text-red-600 bg-red-50',
      developing: isDark ? 'text-yellow-400 bg-yellow-900/20' : 'text-yellow-600 bg-yellow-50',
      proficient: isDark ? 'text-info-400 bg-info-900/20' : 'text-info-600 bg-info-50',
      advanced: isDark ? 'text-green-400 bg-green-900/20' : 'text-green-600 bg-green-50',
      expert: isDark ? 'text-purple-400 bg-purple-900/20' : 'text-purple-600 bg-purple-50'
    };
    return colors[level as keyof typeof colors] || colors.developing;
  };

  const getValidationIcon = (source: string) => {
    const icons = {
      self: '👤',
      instructor: '👨‍🏫',
      peer: '👥',
      employer: '🏢',
      project: '💻'
    };
    return icons[source as keyof typeof icons] || '📋';
  };

  const renderOverview = () => (
    <div className="space-y-8">
      {/* Overall Score */}
      <Card className="p-8">
        <div className="flex items-center justify-between mb-6">
          <Typography variant="h5" className="font-bold">
            Overall Skills Profile
          </Typography>
          <div className={`px-4 py-2 rounded-full text-lg font-bold ${
            isDark ? 'bg-lime/10 text-lime' : 'bg-asu-maroon/10 text-asu-maroon'
          }`}>
            {skillsAudit.overall_score.toFixed(1)}/5.0
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
          {skillCategories.map((category) => (
            category.data && (
              <div key={category.id} className="category-card text-center">
                <div className={`w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center ${
                  isDark ? 'bg-gray-700' : 'bg-gray-100'
                }`}>
                  <category.icon className={`h-8 w-8 ${
                    isDark ? 'text-lime' : 'text-asu-maroon'
                  }`} />
                </div>
                <Typography variant="h6" className="font-semibold mb-2">
                  {category.name}
                </Typography>
                <div className="text-2xl font-bold mb-2">
                  {category.data.category_score.toFixed(1)}
                </div>
                <div className={`w-full rounded-full h-2 mb-2 ${
                  isDark ? 'bg-gray-700' : 'bg-gray-200'
                }`}>
                  <div 
                    className={`h-2 rounded-full ${
                      isDark ? 'bg-lime' : 'bg-asu-maroon'
                    }`}
                    style={{ width: `${(category.data.category_score / 5) * 100}%` }}
                  ></div>
                </div>
                <Typography variant="body2" color="textSecondary" className="text-sm">
                  {category.description}
                </Typography>
              </div>
            )
          ))}
        </div>
      </Card>

      {/* Next Assessment */}
      <Card className="p-6 border-l-4 border-orange-500">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Calendar className="h-5 w-5 text-orange-500" />
            <div>
              <Typography variant="h6" className="font-semibold">
                Next Skills Assessment Due
              </Typography>
              <Typography variant="body2" color="textSecondary">
                February 1, 2025 - Mid-semester evaluation
              </Typography>
            </div>
          </div>
          <Button variant="filled" color="primary">
            Start Assessment
          </Button>
        </div>
      </Card>

      {/* Recent Progress */}
      <Card className="p-8">
        <Typography variant="h5" className="font-bold mb-6">
          Recent Skills Development
        </Typography>
        
        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 rounded-lg bg-green-50 dark:bg-green-900/20">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                <TrendingUp className="h-4 w-4 text-white" />
              </div>
              <div>
                <div className="font-medium">Programming Skills Improved</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  From 4.2 to 4.7 (+0.5 points)
                </div>
              </div>
            </div>
            <div className="text-green-600 dark:text-green-400 font-semibold">
              +12%
            </div>
          </div>

          <div className="flex items-center justify-between p-4 rounded-lg bg-info-50 dark:bg-info-900/20">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-info-500 rounded-full flex items-center justify-center">
                <Users className="h-4 w-4 text-white" />
              </div>
              <div>
                <div className="font-medium">Teamwork Excellence</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  Peer validation increased to 4.6
                </div>
              </div>
            </div>
            <div className="text-info-600 dark:text-info-400 font-semibold">
              +8%
            </div>
          </div>

          <div className="flex items-center justify-between p-4 rounded-lg bg-orange-50 dark:bg-orange-900/20">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center">
                <Target className="h-4 w-4 text-white" />
              </div>
              <div>
                <div className="font-medium">Innovation Focus Area</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  Opportunity recognition needs attention
                </div>
              </div>
            </div>
            <div className="text-orange-600 dark:text-orange-400 font-semibold">
              Focus
            </div>
          </div>
        </div>
      </Card>
    </div>
  );

  const renderCategoryDetails = (categoryData: SkillAssessment) => (
    <div className="space-y-6">
      {/* Category Overview */}
      <Card className="p-8" elevation={2}>
        <div className="flex items-center justify-between mb-6">
          <Typography variant="h5" className="font-bold">
            {categoryData.category}
          </Typography>
          <div className="flex items-center space-x-4">
            <div className={`px-4 py-2 rounded-full text-lg font-bold ${
              isDark ? 'bg-lime/10 text-lime' : 'bg-asu-maroon/10 text-asu-maroon'
            }`}>
              {categoryData.category_score.toFixed(1)}/5.0
            </div>
            <Button variant="outlined" startIcon={<Edit />}>
              Update Assessment
            </Button>
          </div>
        </div>

        {/* Assessment Sources */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {categoryData.self_assessment_score && (
            <div className="text-center p-4 rounded-lg bg-gray-50 dark:bg-gray-800">
              <div className="text-lg font-bold">{categoryData.self_assessment_score.toFixed(1)}</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">👤 Self</div>
            </div>
          )}
          {categoryData.instructor_score && (
            <div className="text-center p-4 rounded-lg bg-gray-50 dark:bg-gray-800">
              <div className="text-lg font-bold">{categoryData.instructor_score.toFixed(1)}</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">👨‍🏫 Instructor</div>
            </div>
          )}
          {categoryData.peer_score && (
            <div className="text-center p-4 rounded-lg bg-gray-50 dark:bg-gray-800">
              <div className="text-lg font-bold">{categoryData.peer_score.toFixed(1)}</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">👥 Peers</div>
            </div>
          )}
          {categoryData.employer_score && (
            <div className="text-center p-4 rounded-lg bg-gray-50 dark:bg-gray-800">
              <div className="text-lg font-bold">{categoryData.employer_score.toFixed(1)}</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">🏢 Employer</div>
            </div>
          )}
        </div>

        {/* Individual Skills */}
        <div className="space-y-4">
          <Typography variant="h6" className="font-semibold">
            Individual Skills Breakdown
          </Typography>
          
          {categoryData.skills.map((skill, index) => (
            <div key={index} className="skill-item p-6 rounded-lg border dark:border-gray-700">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <Typography variant="h6" className="font-semibold">
                    {skill.name}
                  </Typography>
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${getSkillLevelColor(skill.level)}`}>
                    {skill.level}
                  </span>
                  <span className="text-lg">
                    {getValidationIcon(skill.validation_source)}
                  </span>
                </div>
                <div className="text-2xl font-bold">
                  {skill.score.toFixed(1)}
                </div>
              </div>

              <div className={`w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3 mb-4`}>
                <div 
                  className={`h-3 rounded-full bg-gradient-to-r ${
                    isDark ? 'from-lime to-green-400' : 'from-asu-maroon to-red-600'
                  }`}
                  style={{ width: `${(skill.score / 5) * 100}%` }}
                ></div>
              </div>

              <div className="mb-4">
                <Typography variant="body2" className="font-medium mb-2">
                  Evidence:
                </Typography>
                <div className="flex flex-wrap gap-2">
                  {skill.evidence.map((evidence, evidenceIndex) => (
                    <span 
                      key={evidenceIndex}
                      className="px-3 py-1 bg-info-100 dark:bg-info-900/30 text-info-800 dark:text-info-400 rounded-full text-sm"
                    >
                      {evidence}
                    </span>
                  ))}
                </div>
              </div>

              <Typography variant="body2" color="textSecondary">
                Last updated: {new Date(skill.last_updated).toLocaleDateString()} by {skill.validation_source}
              </Typography>
            </div>
          ))}
        </div>

        {/* Strengths and Improvement Areas */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
          <Card className="p-6 border-l-4 border-green-500" elevation={1}>
            <Typography variant="h6" className="font-semibold mb-4 text-green-600 dark:text-green-400">
              ✅ Strengths
            </Typography>
            <ul className="space-y-2">
              {categoryData.strengths.map((strength, index) => (
                <li key={index} className="flex items-center space-x-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <span>{strength}</span>
                </li>
              ))}
            </ul>
          </Card>

          <Card className="p-6 border-l-4 border-orange-500" elevation={1}>
            <Typography variant="h6" className="font-semibold mb-4 text-orange-600 dark:text-orange-400">
              🎯 Areas for Improvement
            </Typography>
            <ul className="space-y-2">
              {categoryData.improvement_areas.map((area, index) => (
                <li key={index} className="flex items-center space-x-2">
                  <AlertCircle className="h-4 w-4 text-orange-500" />
                  <span>{area}</span>
                </li>
              ))}
            </ul>
          </Card>
        </div>
      </Card>
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
            Loading Skills Audit System...
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
        <div className="skills-header mb-8">
          <div className="flex items-center justify-between">
            <div>
              <Typography variant="h3" className="font-bold mb-2">
                📈 Skills Audit System
              </Typography>
              <Typography variant="body1" color="textSecondary">
                Comprehensive assessment and tracking of your professional competencies
              </Typography>
            </div>
            <div className="flex space-x-3">
              <Button variant="outlined" startIcon={<Download />}>
                Export Report
              </Button>
              <Button variant="outlined" startIcon={<Share2 />}>
                Share with Advisor
              </Button>
              <Button variant="filled" startIcon={<Plus />}>
                New Assessment
              </Button>
            </div>
          </div>
        </div>

        {/* Category Navigation */}
        <Card className="mb-8" elevation={1}>
          <div className="flex flex-wrap border-b">
            <button
              onClick={() => setActiveCategory('overview')}
              className={`flex items-center space-x-2 px-6 py-4 font-medium transition-all duration-300 ${
                activeCategory === 'overview'
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
              <BarChart3 className="h-5 w-5" />
              <span>Overview</span>
              <span className="text-lg">📊</span>
            </button>

            {skillCategories.map((category) => {
              const Icon = category.icon;
              return (
                <button
                  key={category.id}
                  onClick={() => setActiveCategory(category.id)}
                  className={`flex items-center space-x-2 px-6 py-4 font-medium transition-all duration-300 ${
                    activeCategory === category.id
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
                  <span className="hidden md:inline">{category.name}</span>
                  <span className="md:hidden">{category.name.split(' ')[0]}</span>
                </button>
              );
            })}
          </div>
        </Card>

        {/* Content */}
        <div className="content-area">
          {activeCategory === 'overview' && renderOverview()}
          
          {activeCategory !== 'overview' && 
            renderCategoryDetails(
              skillCategories.find(cat => cat.id === activeCategory)?.data || skillCategories[0].data
            )
          }
        </div>
      </div>
    </div>
  );
}