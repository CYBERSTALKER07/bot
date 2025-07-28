import React, { useState } from 'react';
import { Bot, Loader2, FileText, Cpu, Zap, Target } from 'lucide-react';
import { ResumeData } from './types';
import { useTheme } from '../../context/ThemeContext';
import { cn } from '../../lib/cva';

interface AIResumeBuilderProps {
  onGenerate: (generatedData: Partial<ResumeData>) => void;
  isLoading?: boolean;
}

export function AIResumeBuilder({ onGenerate, isLoading = false }: AIResumeBuilderProps) {
  const { isDark } = useTheme();
  const [prompt, setPrompt] = useState('');
  const [selectedPromptType, setSelectedPromptType] = useState('full');

  const promptTemplates = {
    full: "I am a [job title] with [years] years of experience in [industry/field]. I have worked at [companies] and my key skills include [skills]. I have a [degree] in [field] from [university]. Please generate a complete resume.",
    experience: "I worked as a [job title] at [company] from [start date] to [end date]. My main responsibilities included [responsibilities] and I achieved [achievements].",
    education: "I have a [degree type] in [field of study] from [university name]. I graduated in [year] with a GPA of [GPA].",
    skills: "My technical skills include [technical skills]. My soft skills are [soft skills]. I am proficient in [tools/software].",
    summary: "I am a [job title] passionate about [interests]. I excel at [strengths] and am looking for opportunities in [target role/industry]."
  };

  const handleGenerate = async () => {
    if (!prompt.trim()) return;

    try {
      // Simulate AI generation - In a real app, this would call an AI API
      const generatedData = await simulateAIGeneration(prompt);
      onGenerate(generatedData);
    } catch (error) {
      console.error('Error generating resume:', error);
    }
  };

  // Simulate AI resume generation
  const simulateAIGeneration = async (userPrompt: string): Promise<Partial<ResumeData>> => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Parse basic information from prompt
    const data: Partial<ResumeData> = {
      personalInfo: {
        fullName: extractInfo(userPrompt, ['name', 'I am']) || 'Generated Name',
        email: 'generated@email.com',
        phone: '+1 (555) 123-4567',
        location: 'Generated City, State',
        summary: generateSummary(userPrompt)
      },
      experience: generateExperience(userPrompt),
      education: generateEducation(userPrompt),
      skills: generateSkills(userPrompt)
    };

    return data;
  };

  const extractInfo = (text: string, keywords: string[]): string | null => {
    for (const keyword of keywords) {
      const regex = new RegExp(`${keyword}\\s+([^.,]+)`, 'i');
      const match = text.match(regex);
      if (match) return match[1].trim();
    }
    return null;
  };

  const generateSummary = (prompt: string): string => {
    const jobTitle = extractInfo(prompt, ['job title', 'work as', 'I am a']) || 'Professional';
    const experience = extractInfo(prompt, ['years', 'experience']) || '5+ years';
    
    return `Experienced ${jobTitle} with ${experience} of experience. Passionate about delivering high-quality results and contributing to team success. Skilled in various technologies and committed to continuous learning and professional development.`;
  };

  const generateExperience = (prompt: string): any[] => {
    const company = extractInfo(prompt, ['company', 'worked at', 'at']) || 'Technology Company';
    const position = extractInfo(prompt, ['job title', 'as a', 'position']) || 'Software Developer';
    
    return [{
      id: '1',
      company: company,
      position: position,
      startDate: '2020',
      endDate: '2024',
      current: false,
      description: 'Developed and maintained software applications, collaborated with cross-functional teams, and contributed to project success through innovative solutions and technical expertise.'
    }];
  };

  const generateEducation = (prompt: string): any[] => {
    const degree = extractInfo(prompt, ['degree', 'graduated with', 'studied']) || 'Bachelor\'s Degree';
    const field = extractInfo(prompt, ['in', 'field', 'major']) || 'Computer Science';
    const university = extractInfo(prompt, ['university', 'college', 'from']) || 'University';
    
    return [{
      id: '1',
      institution: university,
      degree: degree,
      field: field,
      startDate: '2016',
      endDate: '2020',
      gpa: '3.8'
    }];
  };

  const generateSkills = (prompt: string): any[] => {
    return [
      {
        id: '1',
        category: 'Technical Skills',
        items: ['JavaScript', 'React', 'Node.js', 'Python', 'SQL', 'Git']
      },
      {
        id: '2',
        category: 'Soft Skills',
        items: ['Problem Solving', 'Team Collaboration', 'Communication', 'Leadership']
      }
    ];
  };

  return (
    <div className={cn(
      "rounded-lg shadow-lg p-6 border",
      isDark ? 'bg-gray-900 border-gray-700' : 'bg-white border-gray-200'
    )}>
      <div className="flex items-center gap-3 mb-6">
        <div className={cn(
          "p-2 rounded-lg",
          isDark ? 'bg-red-900/20' : 'bg-red-50'
        )}>
          <Bot className={cn(
            "w-6 h-6",
            isDark ? 'text-red-400' : 'text-red-700'
          )} />
        </div>
        <div>
          <h2 className={cn(
            "text-xl font-bold",
            isDark ? 'text-white' : 'text-gray-900'
          )}>AI Resume Builder</h2>
          <p className={cn(
            "text-sm",
            isDark ? 'text-gray-400' : 'text-gray-600'
          )}>Generate your resume with AI assistance</p>
        </div>
      </div>

      <div className="space-y-6">
        {/* Prompt Type Selection */}
        <div>
          <label className={cn(
            "block text-sm font-medium mb-3",
            isDark ? 'text-gray-300' : 'text-gray-700'
          )}>
            What would you like to generate?
          </label>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {Object.entries({
              full: 'Complete Resume',
              experience: 'Work Experience',
              education: 'Education',
              skills: 'Skills',
              summary: 'Professional Summary'
            }).map(([key, label]) => (
              <button
                key={key}
                onClick={() => setSelectedPromptType(key)}
                className={cn(
                  "p-3 text-sm font-medium rounded-lg border transition-colors",
                  selectedPromptType === key
                    ? isDark 
                      ? 'bg-red-900/20 border-red-700 text-red-400'
                      : 'bg-red-50 border-red-200 text-red-700'
                    : isDark
                      ? 'bg-gray-800 border-gray-600 text-gray-300 hover:bg-gray-700'
                      : 'bg-white border-gray-200 text-gray-700 hover:bg-gray-50'
                )}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        {/* Template Prompt */}
        <div>
          <label className={cn(
            "block text-sm font-medium mb-2",
            isDark ? 'text-gray-300' : 'text-gray-700'
          )}>
            Template Prompt
          </label>
          <div className={cn(
            "p-3 rounded-lg text-sm mb-3",
            isDark ? 'bg-gray-800 text-gray-400' : 'bg-gray-50 text-gray-600'
          )}>
            {promptTemplates[selectedPromptType as keyof typeof promptTemplates]}
          </div>
        </div>

        {/* Custom Prompt Input */}
        <div>
          <label className={cn(
            "block text-sm font-medium mb-2",
            isDark ? 'text-gray-300' : 'text-gray-700'
          )}>
            Describe your background and experience
          </label>
          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="Example: I am a Software Engineer with 5 years of experience at Google and Microsoft. I specialize in React, Node.js, and cloud technologies. I have a Computer Science degree from Stanford..."
            className={cn(
              "w-full h-32 p-3 border rounded-lg resize-none focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-colors",
              isDark 
                ? 'bg-gray-800 border-gray-600 text-white placeholder-gray-400'
                : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
            )}
          />
          <p className={cn(
            "mt-2 text-xs",
            isDark ? 'text-gray-500' : 'text-gray-500'
          )}>
            Include your job title, experience, companies, skills, education, and achievements for best results.
          </p>
        </div>

        {/* Generate Button */}
        <button
          onClick={handleGenerate}
          disabled={!prompt.trim() || isLoading}
          className={cn(
            "w-full py-3 px-4 rounded-lg font-medium transition-colors flex items-center justify-center gap-2",
            "bg-red-700 text-white hover:bg-red-800 disabled:opacity-50 disabled:cursor-not-allowed",
            isDark && "bg-red-800 hover:bg-red-900"
          )}
        >
          {isLoading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Generating Resume...
            </>
          ) : (
            <>
              <Bot className="w-4 h-4" />
              Generate with AI
            </>
          )}
        </button>

        {/* Feature Highlights */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 border-t border-gray-200 dark:border-gray-700">
          <div className={cn(
            "flex items-center gap-2 text-sm",
            isDark ? 'text-gray-400' : 'text-gray-600'
          )}>
            <FileText className={cn(
              "w-4 h-4",
              isDark ? 'text-red-400' : 'text-red-600'
            )} />
            <span>ATS-Friendly Format</span>
          </div>
          <div className={cn(
            "flex items-center gap-2 text-sm",
            isDark ? 'text-gray-400' : 'text-gray-600'
          )}>
            <Cpu className={cn(
              "w-4 h-4",
              isDark ? 'text-red-400' : 'text-red-600'
            )} />
            <span>AI-Powered Content</span>
          </div>
          <div className={cn(
            "flex items-center gap-2 text-sm",
            isDark ? 'text-gray-400' : 'text-gray-600'
          )}>
            <Target className={cn(
              "w-4 h-4",
              isDark ? 'text-red-400' : 'text-red-600'
            )} />
            <span>Smart Formatting</span>
          </div>
        </div>
      </div>
    </div>
  );
}