import React, { useState, useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { 
  BarChart3, 
  TrendingUp, 
  Award, 
  Users, 
  Zap, 
  Globe, 
  Briefcase,
  Target,
  CheckCircle,
  AlertCircle,
  Calendar,
  Eye,
  Edit,
  Plus,
  Download,
  Share2,
  Filter,
  ArrowRight,
  Star,
  ChevronRight
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { Card } from './ui/Card';
import Typography from './ui/Typography';
import Button from './ui/Button';
import { SkillsAudit, SkillAssessment, IndividualSkill } from '../types';

interface SkillRadarData {
  category: string;
  score: number;
  maxScore: number;
  color: string;
}

export default function SkillsAuditSystem() {
  const { user } = useAuth();
  const { isDark } = useTheme();
  const containerRef = useRef<HTMLDivElement>(null);
  const [activeCategory, setActiveCategory] = useState('overview');
  const [viewMode, setViewMode] = useState<'radar' | 'detailed'>('radar');
  const [loading, setLoading] = useState(true);

  // Mock skills audit data
  const mockSkillsAudit: SkillsAudit = {
    id: '1',
    student_id: user?.id || '',
    foundational_skills: {
      category: 'Foundational Skills',
      skills: [
        {
          name: 'Communication',
          level: 'proficient',
          score: 4.2,
          evidence: ['Presentation at Tech Conference', 'Peer feedback from group projects', 'Leadership role communication'],
          last_updated: '2024-11-01',
          validation_source: 'instructor'
        },
        {
          name: 'Teamwork',
          level: 'advanced',
          score: 4.5,
          evidence: ['Team lead on capstone project', 'Successful internship collaboration', 'Student organization leadership'],
          last_updated: '2024-10-15',
          validation_source: 'peer'
        },
        {
          name: 'Problem Solving',
          level: 'advanced',
          score: 4.6,
          evidence: ['Algorithm competition wins', 'Complex project solutions', 'Creative debugging approaches'],
          last_updated: '2024-11-20',
          validation_source: 'project'
        },
        {
          name: 'Adaptability',
          level: 'proficient',
          score: 4.0,
          evidence: ['Quick learning of new technologies', 'Flexibility in changing project requirements'],
          last_updated: '2024-10-01',
          validation_source: 'employer'
        }
      ],
      category_score: 4.33,
      self_assessment_score: 4.0,
      instructor_score: 4.5,
      peer_score: 4.6,
      employer_score: 4.2,
      improvement_areas: ['Public speaking confidence', 'Conflict resolution'],
      strengths: ['Active listening', 'Collaborative problem-solving', 'Critical thinking']
    },
    digital_tech_skills: {
      category: 'Digital & Technical Skills',
      skills: [
        {
          name: 'Programming',
          level: 'advanced',
          score: 4.7,
          evidence: ['GitHub portfolio with 50+ repositories', 'Open source contributions', 'Technical interview success'],
          last_updated: '2024-11-20',
          validation_source: 'project'
        },
        {
          name: 'Data Analysis',
          level: 'proficient',
          score: 4.3,
          evidence: ['Machine learning projects', 'Data visualization dashboards', 'Statistical analysis coursework'],
          last_updated: '2024-11-15',
          validation_source: 'instructor'
        },
        {
          name: 'AI Literacy',
          level: 'developing',
          score: 3.8,
          evidence: ['AI/ML course completion', 'ChatGPT integration projects', 'Ethics in AI research'],
          last_updated: '2024-11-10',
          validation_source: 'self'
        },
        {
          name: 'Digital Collaboration',
          level: 'proficient',
          score: 4.1,
          evidence: ['Remote team management', 'Digital project coordination', 'Online presentation skills'],
          last_updated: '2024-10-30',
          validation_source: 'peer'
        }
      ],
      category_score: 4.23,
      self_assessment_score: 4.0,
      instructor_score: 4.3,
      peer_score: 4.4,
      improvement_areas: ['Advanced system architecture', 'Cloud computing expertise'],
      strengths: ['Algorithm implementation', 'Code quality', 'Technology adaptation']
    },
    professionalism_ethics: {
      category: 'Professionalism & Work Ethics',
      skills: [
        {
          name: 'Initiative',
          level: 'advanced',
          score: 4.5,
          evidence: ['Self-started projects', 'Proactive problem identification', 'Leadership volunteer roles'],
          last_updated: '2024-11-01',
          validation_source: 'employer'
        },
        {
          name: 'Time Management',
          level: 'proficient',
          score: 4.0,
          evidence: ['Meeting all project deadlines', 'Balancing work and academics', 'Efficient task prioritization'],
          last_updated: '2024-10-20',
          validation_source: 'self'
        },
        {
          name: 'Professional Ethics',
          level: 'advanced',
          score: 4.6,
          evidence: ['Code of conduct adherence', 'Ethical decision-making in projects', 'Integrity in all dealings'],
          last_updated: '2024-11-05',
          validation_source: 'instructor'
        }
      ],
      category_score: 4.37,
      self_assessment_score: 4.2,
      instructor_score: 4.5,
      employer_score: 4.4,
      improvement_areas: ['Stress management', 'Work-life balance'],
      strengths: ['Reliability', 'Integrity', 'Self-motivation']
    },
    entrepreneurship_innovation: {
      category: 'Entrepreneurship & Innovation',
      skills: [
        {
          name: 'Creative Thinking',
          level: 'proficient',
          score: 4.2,
          evidence: ['Innovative project solutions', 'Design thinking workshops', 'Creative problem approaches'],
          last_updated: '2024-11-01',
          validation_source: 'instructor'
        },
        {
          name: 'Opportunity Recognition',
          level: 'developing',
          score: 3.6,
          evidence: ['Market analysis projects', 'Startup idea development', 'Industry trend awareness'],
          last_updated: '2024-10-15',
          validation_source: 'self'
        },
        {
          name: 'Business Acumen',
          level: 'developing',
          score: 3.4,
          evidence: ['Business plan development', 'Financial modeling basics', 'Market research experience'],
          last_updated: '2024-10-01',
          validation_source: 'instructor'
        }
      ],
      category_score: 3.73,
      self_assessment_score: 3.5,
      instructor_score: 3.8,
      improvement_areas: ['Financial literacy', 'Market analysis', 'Business strategy'],
      strengths: ['Innovation mindset', 'Creative solutions', 'Risk assessment']
    },
    global_intercultural: {
      category: 'Global & Intercultural Competence',
      skills: [
        {
          name: 'Cultural Awareness',
          level: 'proficient',
          score: 4.1,
          evidence: ['International student collaboration', 'Cultural exchange participation', 'Diversity workshop completion'],
          last_updated: '2024-11-01',
          validation_source: 'peer'
        },
        {
          name: 'Language Skills',
          level: 'advanced',
          score: 4.4,
          evidence: ['Multilingual communication', 'Translation projects', 'International internship'],
          last_updated: '2024-10-20',
          validation_source: 'self'
        },
        {
          name: 'Global Perspective',
          level: 'proficient',
          score: 4.0,
          evidence: ['International case study analysis', 'Global trends research', 'Cross-cultural project management'],
          last_updated: '2024-10-10',
          validation_source: 'instructor'
        }
      ],
      category_score: 4.17,
      self_assessment_score: 4.2,
      instructor_score: 4.0,
      peer_score: 4.3,
      improvement_areas: ['Regional expertise', 'International business protocols'],
      strengths: ['Cultural sensitivity', 'Language abilities', 'Global mindset']
    },
    overall_score: 4.17,
    last_assessment_date: '2024-11-01',
    next_assessment_due: '2025-02-01',
    assessments_history: [
      {
        id: '1',
        assessment_date: '2024-08-01',
        assessment_type: 'self',
        scores: {
          foundational_skills: 3.8,
          digital_tech_skills: 3.9,
          professionalism_ethics: 4.0,
          entrepreneurship_innovation: 3.2,
          global_intercultural: 3.9
        },
        feedback: 'Strong foundation with room for growth in entrepreneurship',
        improvement_plan: ['Take business courses', 'Join startup incubator', 'Develop financial literacy']
      }
    ]
  };

  const skillCategories = [
    {
      id: 'foundational',
      name: 'Foundational Skills',
      icon: Users,
      color: 'blue',
      data: mockSkillsAudit.foundational_skills,
      description: 'Core interpersonal and cognitive abilities'
    },
    {
      id: 'digital',
      name: 'Digital & Tech Skills',
      icon: Zap,
      color: 'purple',
      data: mockSkillsAudit.digital_tech_skills,
      description: 'Technical competencies and digital literacy'
    },
    {
      id: 'professional',
      name: 'Professionalism & Ethics',
      icon: Briefcase,
      color: 'green',
      data: mockSkillsAudit.professionalism_ethics,
      description: 'Work ethics and professional conduct'
    },
    {
      id: 'entrepreneurship',
      name: 'Entrepreneurship & Innovation',
      icon: Target,
      color: 'orange',
      data: mockSkillsAudit.entrepreneurship_innovation,
      description: 'Innovation and business mindset'
    },
    {
      id: 'global',
      name: 'Global & Intercultural',
      icon: Globe,
      color: 'teal',
      data: mockSkillsAudit.global_intercultural,
      description: 'Cultural competence and global awareness'
    }
  ];

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
      proficient: isDark ? 'text-blue-400 bg-blue-900/20' : 'text-blue-600 bg-blue-50',
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
      <Card className="p-8" elevation={2}>
        <div className="flex items-center justify-between mb-6">
          <Typography variant="h5" className="font-bold">
            Overall Skills Profile
          </Typography>
          <div className={`px-4 py-2 rounded-full text-lg font-bold ${
            isDark ? 'bg-lime/10 text-lime' : 'bg-asu-maroon/10 text-asu-maroon'
          }`}>
            {mockSkillsAudit.overall_score.toFixed(1)}/5.0
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
          {skillCategories.map((category, index) => (
            <div key={category.id} className="category-card text-center">
              <div className={`w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center bg-${category.color}-100 dark:bg-${category.color}-900/30`}>
                <category.icon className={`h-8 w-8 text-${category.color}-600 dark:text-${category.color}-400`} />
              </div>
              <Typography variant="h6" className="font-semibold mb-2">
                {category.name}
              </Typography>
              <div className="text-2xl font-bold mb-2">
                {category.data.category_score.toFixed(1)}
              </div>
              <div className={`w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 mb-2`}>
                <div 
                  className={`h-2 rounded-full bg-${category.color}-500`}
                  style={{ width: `${(category.data.category_score / 5) * 100}%` }}
                ></div>
              </div>
              <Typography variant="body2" color="textSecondary" className="text-sm">
                {category.description}
              </Typography>
            </div>
          ))}
        </div>
      </Card>

      {/* Next Assessment */}
      <Card className="p-6 border-l-4 border-orange-500" elevation={1}>
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
          <Button variant="contained" color="primary">
            Start Assessment
          </Button>
        </div>
      </Card>

      {/* Recent Progress */}
      <Card className="p-8" elevation={2}>
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

          <div className="flex items-center justify-between p-4 rounded-lg bg-blue-50 dark:bg-blue-900/20">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                <Users className="h-4 w-4 text-white" />
              </div>
              <div>
                <div className="font-medium">Teamwork Excellence</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  Peer validation increased to 4.6
                </div>
              </div>
            </div>
            <div className="text-blue-600 dark:text-blue-400 font-semibold">
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
                      className="px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-400 rounded-full text-sm"
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
              <Button variant="contained" startIcon={<Plus />}>
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