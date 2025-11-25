import React, { useState } from 'react';
import { Wand2, Loader2, Sparkles, User, Briefcase, GraduationCap } from 'lucide-react';
import Button from '../ui/Button';
import { useTheme } from '../../context/ThemeContext';
import { cn } from '../../lib/cva';
import { ResumeData } from './types';

interface AIResumeFormProps {
  onGenerateResume: (resumeData: ResumeData) => void;
}

export function AIResumeForm({ onGenerateResume }: AIResumeFormProps) {
  const { isDark } = useTheme();
  const [isGenerating, setIsGenerating] = useState(false);
  const [formData, setFormData] = useState({
    jobTitle: '',
    industry: '',
    experience: '',
    skills: '',
    education: '',
    achievements: '',
    targetJob: '',
    tone: 'professional'
  });

  const generateResumeWithAI = async () => {
    setIsGenerating(true);
    
    try {
      // Simulate AI generation (in real app, this would call an AI service)
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      // Generate mock resume data based on the form inputs
      const generatedResume: ResumeData = {
        personalInfo: {
          fullName: 'John Doe', // This would come from user profile
          email: 'john.doe@email.com',
          phone: '+1 (555) 123-4567',
          location: 'New York, NY',
          website: 'linkedin.com/in/johndoe',
          linkedin: 'linkedin.com/in/johndoe',
          summary: generateSummary(),
        },
        experience: generateExperience(),
        education: generateEducation(),
        skills: generateSkills(),
        projects: [],
        certifications: [],
      };

      onGenerateResume(generatedResume);
    } catch (error) {
      console.error('Error generating resume:', error);
      alert('Error generating resume. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  const generateSummary = () => {
    const summaries = {
      professional: `Results-driven ${formData.jobTitle} with ${formData.experience} years of experience in ${formData.industry}. Proven track record of delivering high-quality solutions and driving business growth. Skilled in ${formData.skills} with a passion for innovation and continuous learning.`,
      creative: `Innovative and creative ${formData.jobTitle} bringing ${formData.experience} years of dynamic experience to the ${formData.industry} industry. Known for thinking outside the box and delivering unique solutions that exceed expectations.`,
      technical: `Highly skilled ${formData.jobTitle} with ${formData.experience} years of technical expertise in ${formData.industry}. Proficient in ${formData.skills} with a strong foundation in problem-solving and system optimization.`
    };
    return summaries[formData.tone as keyof typeof summaries] || summaries.professional;
  };

  const generateExperience = () => {
    const experienceYears = parseInt(formData.experience) || 3;
    const experiences = [];
    
    for (let i = 0; i < Math.min(experienceYears / 2, 3); i++) {
      const currentYear = new Date().getFullYear();
      const startYear = currentYear - (i * 2 + 2);
      const endYear = i === 0 ? currentYear : startYear + 2;
      
      experiences.push({
        id: `exp-${i}`,
        company: `${formData.industry} Solutions Inc.`,
        position: i === 0 ? `Senior ${formData.jobTitle}` : formData.jobTitle,
        startDate: `${startYear}`,
        endDate: `${endYear}`,
        current: i === 0,
        description: `• Led ${formData.industry.toLowerCase()} initiatives resulting in improved efficiency and performance\n• Collaborated with cross-functional teams to deliver high-quality solutions\n• ${formData.achievements || 'Achieved significant milestones and exceeded performance targets'}\n• Utilized ${formData.skills} to drive innovation and business growth`
      });
    }
    
    return experiences;
  };

  const generateEducation = () => {
    return [{
      id: 'edu-1',
      institution: 'State University',
      degree: "Bachelor's Degree",
      field: formData.education || formData.industry,
      startDate: '2016',
      endDate: '2020',
      gpa: '3.8'
    }];
  };

  const generateSkills = () => {
    const skillsArray = formData.skills.split(',').map(s => s.trim()).filter(s => s);
    const categories = [
      'Technical Skills',
      'Soft Skills',
      'Industry Knowledge'
    ];
    
    return categories.map((category, index) => ({
      id: `skill-${index}`,
      category,
      items: skillsArray.slice(index * 3, (index + 1) * 3)
    })).filter(skill => skill.items.length > 0);
  };

  const presetPrompts = [
    {
      title: "Software Developer",
      data: {
        jobTitle: "Software Developer",
        industry: "Technology",
        experience: "3",
        skills: "JavaScript, React, Node.js, Python, SQL, Git",
        education: "Computer Science",
        achievements: "Built scalable web applications serving 10k+ users",
        targetJob: "Senior Software Developer",
        tone: "technical"
      }
    },
    {
      title: "Marketing Manager",
      data: {
        jobTitle: "Marketing Manager",
        industry: "Digital Marketing",
        experience: "5",
        skills: "Digital Marketing, SEO, Analytics, Campaign Management, Brand Strategy",
        education: "Marketing",
        achievements: "Increased brand awareness by 150% and generated $2M in revenue",
        targetJob: "Senior Marketing Manager",
        tone: "professional"
      }
    },
    {
      title: "UX Designer",
      data: {
        jobTitle: "UX Designer",
        industry: "Design",
        experience: "4",
        skills: "Figma, Sketch, User Research, Prototyping, Wireframing, Adobe Creative Suite",
        education: "Design",
        achievements: "Redesigned user interface resulting in 40% increase in user engagement",
        targetJob: "Senior UX Designer",
        tone: "creative"
      }
    }
  ];

  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <div className="flex items-center justify-center gap-2 mb-4">
          <Sparkles className="h-6 w-6 text-purple-500" />
          <h2 className="text-2xl font-bold">AI Resume Builder</h2>
          <Sparkles className="h-6 w-6 text-purple-500" />
        </div>
        <p className="text-gray-600 dark:text-gray-400">
          Let AI create your professional resume based on your career details
        </p>
      </div>

      {/* Preset Prompts */}
      <div className="mb-6">
        <h3 className="font-semibold mb-3 flex items-center gap-2">
          <Wand2 className="h-4 w-4" />
          Quick Start Templates
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {presetPrompts.map((preset, index) => (
            <button
              key={index}
              onClick={() => setFormData(preset.data)}
              className={cn(
                "p-3 text-left rounded-lg border transition-all duration-200",
                isDark 
                  ? 'border-gray-600 hover:border-purple-400 bg-gray-800' 
                  : 'border-gray-200 hover:border-purple-400 bg-white'
              )}
            >
              <div className="font-medium text-sm">{preset.title}</div>
              <div className="text-xs text-gray-500 mt-1">Click to use template</div>
            </button>
          ))}
        </div>
      </div>

      {/* AI Form */}
      <div className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-2">
              <User className="inline h-4 w-4 mr-1" />
              Current Job Title
            </label>
            <input
              type="text"
              value={formData.jobTitle}
              onChange={(e) => setFormData({...formData, jobTitle: e.target.value})}
              placeholder="e.g., Software Developer"
              className={cn(
                "w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent",
                isDark 
                  ? 'bg-gray-800 border-gray-600 text-white' 
                  : 'bg-white border-gray-300'
              )}
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">
              <Briefcase className="inline h-4 w-4 mr-1" />
              Industry
            </label>
            <input
              type="text"
              value={formData.industry}
              onChange={(e) => setFormData({...formData, industry: e.target.value})}
              placeholder="e.g., Technology, Healthcare"
              className={cn(
                "w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent",
                isDark 
                  ? 'bg-gray-800 border-gray-600 text-white' 
                  : 'bg-white border-gray-300'
              )}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-2">
              Years of Experience
            </label>
            <select
              value={formData.experience}
              onChange={(e) => setFormData({...formData, experience: e.target.value})}
              className={cn(
                "w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent",
                isDark 
                  ? 'bg-gray-800 border-gray-600 text-white' 
                  : 'bg-white border-gray-300'
              )}
            >
              <option value="">Select experience</option>
              <option value="1">1 year</option>
              <option value="2">2 years</option>
              <option value="3">3 years</option>
              <option value="5">5 years</option>
              <option value="7">7+ years</option>
              <option value="10">10+ years</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">
              <GraduationCap className="inline h-4 w-4 mr-1" />
              Education Field
            </label>
            <input
              type="text"
              value={formData.education}
              onChange={(e) => setFormData({...formData, education: e.target.value})}
              placeholder="e.g., Computer Science, Business"
              className={cn(
                "w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent",
                isDark 
                  ? 'bg-gray-800 border-gray-600 text-white' 
                  : 'bg-white border-gray-300'
              )}
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">
            Key Skills (comma-separated)
          </label>
          <textarea
            value={formData.skills}
            onChange={(e) => setFormData({...formData, skills: e.target.value})}
            placeholder="e.g., JavaScript, React, Node.js, Team Leadership, Project Management"
            rows={3}
            className={cn(
              "w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent",
              isDark 
                ? 'bg-gray-800 border-gray-600 text-white' 
                : 'bg-white border-gray-300'
            )}
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">
            Key Achievements
          </label>
          <textarea
            value={formData.achievements}
            onChange={(e) => setFormData({...formData, achievements: e.target.value})}
            placeholder="e.g., Increased sales by 25%, Led a team of 10 developers, Launched 3 successful products"
            rows={3}
            className={cn(
              "w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent",
              isDark 
                ? 'bg-gray-800 border-gray-600 text-white' 
                : 'bg-white border-gray-300'
            )}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-2">
              Target Job Title
            </label>
            <input
              type="text"
              value={formData.targetJob}
              onChange={(e) => setFormData({...formData, targetJob: e.target.value})}
              placeholder="e.g., Senior Software Developer"
              className={cn(
                "w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent",
                isDark 
                  ? 'bg-gray-800 border-gray-600 text-white' 
                  : 'bg-white border-gray-300'
              )}
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">
              Resume Tone
            </label>
            <select
              value={formData.tone}
              onChange={(e) => setFormData({...formData, tone: e.target.value})}
              className={cn(
                "w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent",
                isDark 
                  ? 'bg-gray-800 border-gray-600 text-white' 
                  : 'bg-white border-gray-300'
              )}
            >
              <option value="professional">Professional</option>
              <option value="creative">Creative</option>
              <option value="technical">Technical</option>
            </select>
          </div>
        </div>
      </div>

      {/* Generate Button */}
      <div className="pt-4">
        <Button
          onClick={generateResumeWithAI}
          disabled={isGenerating || !formData.jobTitle || !formData.industry}
          className="w-full bg-linear-to-r from-purple-500 to-info-500 hover:from-purple-600 hover:to-info-600 text-white py-3 flex items-center justify-center gap-2"
        >
          {isGenerating ? (
            <>
              <Loader2 className="h-5 w-5 animate-spin" />
              Generating Your Resume...
            </>
          ) : (
            <>
              <Sparkles className="h-5 w-5" />
              Generate Resume with AI
            </>
          )}
        </Button>
      </div>

      {isGenerating && (
        <div className="text-center text-sm text-gray-600 dark:text-gray-400">
          <div className="flex items-center justify-center gap-2 mb-2">
            <Loader2 className="h-4 w-4 animate-spin" />
            AI is crafting your professional resume...
          </div>
          <p>This may take a few moments</p>
        </div>
      )}
    </div>
  );
}