import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Bot, Wand2, FileText, Download, ArrowLeft, Loader2, Sparkles, Target, Cpu, Zap, Edit3 } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { cn } from '../lib/cva';
import Button from './ui/Button';
import PageLayout from './ui/PageLayout';

interface ParsedInfo {
  name?: string;
  experience?: number;
  title?: string;
  companies?: string[];
  skills?: string[];
  education?: string;
  university?: string;
  email?: string;
  phone?: string;
  location?: string;
  website?: string;
  linkedin?: string;
}

interface AIResumeData {
  personalInfo: {
    fullName: string;
    email: string;
    phone: string;
    location: string;
    website?: string;
    linkedin?: string;
    summary: string;
  };
  experience: Array<{
    id: string;
    company: string;
    position: string;
    startDate: string;
    endDate: string;
    current: boolean;
    description: string;
  }>;
  education: Array<{
    id: string;
    institution: string;
    degree: string;
    field: string;
    startDate: string;
    endDate: string;
    gpa?: string;
  }>;
  skills: Array<{
    id: string;
    category: string;
    items: string[];
  }>;
  template: 'modern' | 'classic' | 'creative' | 'minimal';
  colorScheme: 'blue' | 'burgundy' | 'green' | 'purple' | 'dark';
}

export default function AIResumeBuilderPage() {
  const { isDark } = useTheme();
  const navigate = useNavigate();
  
  const [step, setStep] = useState<'input' | 'generating' | 'preview'>('input');
  const [prompt, setPrompt] = useState('');
  const [selectedStyle, setSelectedStyle] = useState<'professional' | 'creative' | 'modern' | 'minimal'>('professional');
  const [generatedResume, setGeneratedResume] = useState<AIResumeData | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  const promptTemplates = {
    professional: "I am a [job title] with [X] years of experience in [industry]. I have worked at companies like [company names] where I [key achievements]. My expertise includes [key skills]. I hold a [degree] from [university]. I am looking for opportunities in [target role/industry].",
    creative: "I'm a creative [job title] passionate about [creative field]. I've worked on projects involving [project types] and have experience with [tools/software]. My creative strengths include [creative skills]. I studied [field] and love [creative interests].",
    modern: "As a modern [job title], I specialize in [modern technologies/methods]. I have experience with [tech stack] and have contributed to [types of projects]. I stay current with [industry trends] and am passionate about [professional interests].",
    minimal: "Experienced [job title] with proven track record in [key area]. Skilled in [core competencies]. Seeking [target position] where I can leverage my expertise in [specialty area]."
  };

  const styleDescriptions = {
    professional: "Clean, corporate design perfect for traditional industries",
    creative: "Bold, artistic layout ideal for creative professionals",
    modern: "Contemporary design with modern typography and layouts",
    minimal: "Simple, elegant design focusing on content clarity"
  };

  const handleGenerate = async () => {
    if (!prompt.trim()) return;

    setIsGenerating(true);
    setStep('generating');

    try {
      // Simulate AI generation with more sophisticated parsing
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      const resume = await generateAIResume(prompt, selectedStyle);
      setGeneratedResume(resume);
      setStep('preview');
    } catch (error) {
      console.error('Error generating resume:', error);
      alert('Failed to generate resume. Please try again.');
      setStep('input');
    } finally {
      setIsGenerating(false);
    }
  };

  const generateAIResume = async (userPrompt: string, style: string): Promise<AIResumeData> => {
    // Enhanced AI simulation with better parsing
    const extractedInfo = parsePrompt(userPrompt);
    
    return {
      personalInfo: {
        fullName: extractedInfo.name || 'John Doe',
        email: extractedInfo.email || 'john.doe@email.com',
        phone: extractedInfo.phone || '+1 (555) 123-4567',
        location: extractedInfo.location || 'New York, NY',
        website: extractedInfo.website || 'johndoe.com',
        linkedin: extractedInfo.linkedin || 'linkedin.com/in/johndoe',
        summary: generateSummary(userPrompt, extractedInfo)
      },
      experience: generateExperience(userPrompt, extractedInfo),
      education: generateEducation(userPrompt, extractedInfo),
      skills: generateSkills(userPrompt, extractedInfo),
      template: getTemplateFromStyle(style),
      colorScheme: getColorSchemeFromStyle(style)
    };
  };

  const parsePrompt = (prompt: string): ParsedInfo => {
    // Enhanced parsing logic
    const info: ParsedInfo = {};
    
    // Extract name
    const nameMatch = prompt.match(/(?:I am|My name is|I'm)\s+([A-Z][a-z]+(?:\s+[A-Z][a-z]+)*)/i);
    if (nameMatch) info.name = nameMatch[1];
    
    // Extract experience years
    const expMatch = prompt.match(/(\d+)\s*(?:years?|yrs?)\s*(?:of\s*)?experience/i);
    if (expMatch) info.experience = parseInt(expMatch[1]);
    
    // Extract job title
    const titleMatch = prompt.match(/(?:I am a|work as|working as|I'm a)\s+([^.]+?)(?:\s+with|\s+at|\.)/i);
    if (titleMatch) info.title = titleMatch[1].trim();
    
    // Extract companies
    const companyMatch = prompt.match(/(?:at|worked at|work at)\s+([A-Z][^.]+?)(?:\s+where|\s+and|\.)/i);
    if (companyMatch) info.companies = [companyMatch[1].trim()];
    
    // Extract skills
    const skillsMatch = prompt.match(/(?:skills include|skilled in|experience with|expertise in)\s+([^.]+)/i);
    if (skillsMatch) {
      info.skills = skillsMatch[1].split(/,|\sand\s/).map(s => s.trim());
    }
    
    // Extract education
    const eduMatch = prompt.match(/(?:degree|studied|graduated)\s+(?:in\s+)?([^.]+?)(?:\s+from|\s+at|\.)/i);
    if (eduMatch) info.education = eduMatch[1].trim();
    
    const uniMatch = prompt.match(/(?:from|at)\s+([A-Z][^.]+?)(?:\s+University|\s+College|\.)/i);
    if (uniMatch) info.university = uniMatch[1].trim() + (uniMatch[0].includes('University') ? ' University' : ' College');
    
    return info;
  };

  const generateSummary = (_prompt: string, info: ParsedInfo): string => {
    const title = info.title || 'Professional';
    const experience = info.experience || '5+';
    const skills = info.skills ? info.skills.slice(0, 3).join(', ') : 'various technologies';
    
    return `Experienced ${title} with ${experience} years of expertise in delivering high-quality solutions. Proficient in ${skills} with a proven track record of driving innovation and achieving results. Passionate about continuous learning and contributing to team success.`;
  };

  const generateExperience = (_prompt: string, info: ParsedInfo) => {
    const companies = info.companies || ['Tech Solutions Inc.', 'Innovation Corp'];
    const title = info.title || 'Software Developer';
    
    return companies.map((company: string, index: number) => ({
      id: (index + 1).toString(),
      company: company,
      position: title,
      startDate: `${2020 + index}`,
      endDate: index === 0 ? 'Present' : `${2022 + index}`,
      current: index === 0,
      description: `Led development of innovative solutions using modern technologies. Collaborated with cross-functional teams to deliver high-quality products. Contributed to architectural decisions and mentored junior developers.`
    }));
  };

  const generateEducation = (_prompt: string, info: ParsedInfo) => {
    return [{
      id: '1',
      institution: info.university || 'University of Technology',
      degree: 'Bachelor of Science',
      field: info.education || 'Computer Science',
      startDate: '2016',
      endDate: '2020',
      gpa: '3.8'
    }];
  };

  const generateSkills = (_prompt: string, info: ParsedInfo) => {
    const skills = info.skills || ['JavaScript', 'React', 'Node.js', 'Python', 'SQL'];
    
    return [
      {
        id: '1',
        category: 'Technical Skills',
        items: skills.slice(0, 6)
      },
      {
        id: '2',
        category: 'Soft Skills',
        items: ['Problem Solving', 'Team Leadership', 'Communication', 'Project Management']
      }
    ];
  };

  const getTemplateFromStyle = (style: string): 'modern' | 'classic' | 'creative' | 'minimal' => {
    const mapping: Record<string, 'modern' | 'classic' | 'creative' | 'minimal'> = {
      professional: 'modern',
      creative: 'creative',
      modern: 'modern',
      minimal: 'minimal'
    };
    return mapping[style] || 'modern';
  };

  const getColorSchemeFromStyle = (style: string): 'blue' | 'burgundy' | 'green' | 'purple' | 'dark' => {
    const mapping: Record<string, 'blue' | 'burgundy' | 'green' | 'purple' | 'dark'> = {
      professional: 'blue',
      creative: 'blue',
      modern: 'blue',
      minimal: 'blue'
    };
    return mapping[style] || 'blue';
  };

  const handleDownloadPDF = () => {
    // Implementation for PDF download
    alert('PDF download functionality would be implemented here');
  };

  const renderInputStep = () => (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Header */}
      <div className="text-center">
        <div className="flex items-center justify-center mb-4">
          <div className="p-3 rounded-2xl bg-[#1DA1F2]/10 border border-[#1DA1F2]/20">
            <Bot className="w-8 h-8 text-[#1DA1F2]" />
          </div>
        </div>
        <h1 className="text-4xl font-bold mb-4 text-white">AI Resume Builder</h1>
        <p className="text-xl max-w-2xl mx-auto text-gray-400">
          Describe your professional background and let AI create a complete, professionally designed resume for you
        </p>
      </div>

      {/* Style Selection */}
      <div className="rounded-2xl p-6 border bg-black border-gray-800">
        <h2 className="text-xl font-semibold mb-4 text-white">Choose Your Style</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {Object.entries(styleDescriptions).map(([style, description]) => (
            <button
              key={style}
              onClick={() => setSelectedStyle(style as any)}
              className={cn(
                "p-4 rounded-xl border transition-all duration-200 text-left",
                selectedStyle === style
                  ? 'bg-[#1DA1F2]/10 border-[#1DA1F2] text-[#1DA1F2]'
                  : 'bg-gray-900 border-gray-700 text-gray-300 hover:bg-gray-800 hover:border-gray-600'
              )}
            >
              <h3 className="font-semibold capitalize mb-2">{style}</h3>
              <p className={cn(
                "text-sm",
                selectedStyle === style ? 'text-[#1DA1F2]/80' : 'text-gray-400'
              )}>{description}</p>
            </button>
          ))}
        </div>
      </div>

      {/* Template Prompt */}
      <div className="rounded-2xl p-6 border bg-black border-gray-800">
        <h2 className="text-xl font-semibold mb-4 text-white">Template for {selectedStyle} style</h2>
        <div className="p-4 rounded-lg text-sm bg-gray-900 text-gray-400 border border-gray-700">
          {promptTemplates[selectedStyle]}
        </div>
      </div>

      {/* Prompt Input */}
      <div className="rounded-2xl p-6 border bg-black border-gray-800">
        <h2 className="text-xl font-semibold mb-4 text-white">Describe Your Professional Background</h2>
        <textarea
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="Tell me about your professional experience, skills, education, and career goals..."
          className="w-full h-48 p-4 rounded-xl border resize-none focus:ring-2 focus:ring-[#1DA1F2] focus:border-[#1DA1F2] transition-colors bg-gray-900 border-gray-700 text-white placeholder-gray-500"
        />
        <p className="mt-3 text-sm text-gray-500">
          Include your job title, years of experience, companies you've worked at, key skills, education, and any specific achievements or career goals.
        </p>
      </div>

      {/* Generate Button */}
      <div className="text-center">
        <Button
          onClick={handleGenerate}
          disabled={!prompt.trim() || isGenerating}
          size="large"
          className="px-8 py-4 rounded-xl font-semibold transition-all duration-200 flex items-center gap-3 mx-auto bg-[#1DA1F2] text-white hover:bg-[#1A8CD8] disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Wand2 className="w-5 h-5" />
          Generate AI Resume
        </Button>
      </div>

      {/* Features */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-8 border-t border-gray-800">
        <div className="text-center">
          <div className="w-12 h-12 rounded-xl mx-auto mb-3 flex items-center justify-center bg-[#1DA1F2]/10 border border-[#1DA1F2]/20">
            <Cpu className="w-6 h-6 text-[#1DA1F2]" />
          </div>
          <h3 className="font-semibold mb-2 text-white">AI-Powered Content</h3>
          <p className="text-sm text-gray-400">Advanced AI generates professional content tailored to your experience</p>
        </div>
        <div className="text-center">
          <div className="w-12 h-12 rounded-xl mx-auto mb-3 flex items-center justify-center bg-[#1DA1F2]/10 border border-[#1DA1F2]/20">
            <Target className="w-6 h-6 text-[#1DA1F2]" />
          </div>
          <h3 className="font-semibold mb-2 text-white">Professional Design</h3>
          <p className="text-sm text-gray-400">Beautiful, ATS-friendly templates designed for modern hiring</p>
        </div>
        <div className="text-center">
          <div className="w-12 h-12 rounded-xl mx-auto mb-3 flex items-center justify-center bg-[#1DA1F2]/10 border border-[#1DA1F2]/20">
            <Zap className="w-6 h-6 text-[#1DA1F2]" />
          </div>
          <h3 className="font-semibold mb-2 text-white">Instant Results</h3>
          <p className="text-sm text-gray-400">Get a complete, professional resume in seconds</p>
        </div>
      </div>
    </div>
  );

  const renderGeneratingStep = () => (
    <div className="max-w-2xl mx-auto text-center py-16">
      <div className="w-20 h-20 rounded-2xl mx-auto mb-6 flex items-center justify-center bg-[#1DA1F2]/10 border border-[#1DA1F2]/20">
        <Bot className="w-10 h-10 animate-pulse text-[#1DA1F2]" />
      </div>
      <h2 className="text-3xl font-bold mb-4 text-white">Generating Your Resume</h2>
      <p className="text-lg mb-8 text-gray-400">AI is analyzing your background and creating a professional resume...</p>
      
      <div className="space-y-4">
        <div className="flex items-center justify-center gap-3 p-4 rounded-lg bg-gray-900 border border-gray-700">
          <Loader2 className="w-5 h-5 animate-spin text-[#1DA1F2]" />
          <span className="text-white">Analyzing your professional background...</span>
        </div>
        <div className="flex items-center justify-center gap-3 p-4 rounded-lg opacity-70 bg-gray-900 border border-gray-700">
          <Sparkles className="w-5 h-5 text-[#1DA1F2]" />
          <span className="text-white">Generating optimized content...</span>
        </div>
        <div className="flex items-center justify-center gap-3 p-4 rounded-lg opacity-40 bg-gray-900 border border-gray-700">
          <FileText className="w-5 h-5 text-[#1DA1F2]" />
          <span className="text-white">Applying professional design...</span>
        </div>
      </div>
    </div>
  );

  const renderPreviewStep = () => {
    if (!generatedResume) return null;

    return (
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-white">Your AI-Generated Resume</h1>
            <p className="text-lg text-gray-400">Review and download your professional resume</p>
          </div>
          <div className="flex items-center gap-3">
            <Button
              onClick={() => setStep('input')}
              variant="outlined"
              className="flex items-center gap-2 border-gray-700 text-white hover:bg-gray-800"
            >
              <ArrowLeft className="w-4 h-4" />
              Edit
            </Button>
            <Button
              onClick={handleDownloadPDF}
              className="bg-[#1DA1F2] text-white hover:bg-[#1A8CD8] flex items-center gap-2"
            >
              <Download className="w-4 h-4" />
              Download PDF
            </Button>
          </div>
        </div>

        {/* Resume Preview */}
        <div className="rounded-2xl border border-gray-700 p-8 bg-white text-gray-900 min-h-[800px] shadow-2xl max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8 pb-6 border-b-2 border-[#1DA1F2]">
            <h1 className="text-4xl font-bold text-[#1DA1F2] mb-2">
              {generatedResume.personalInfo.fullName}
            </h1>
            <div className="flex justify-center gap-4 text-sm text-gray-600 flex-wrap">
              <span>{generatedResume.personalInfo.email}</span>
              <span>{generatedResume.personalInfo.phone}</span>
              <span>{generatedResume.personalInfo.location}</span>
              {generatedResume.personalInfo.linkedin && (
                <span>{generatedResume.personalInfo.linkedin}</span>
              )}
            </div>
          </div>

          {/* Summary */}
          <div className="mb-6">
            <h2 className="text-xl font-bold text-[#1DA1F2] mb-3 pb-1 border-b border-[#1DA1F2]/30">
              Professional Summary
            </h2>
            <p className="text-gray-700 leading-relaxed">
              {generatedResume.personalInfo.summary}
            </p>
          </div>

          {/* Experience */}
          <div className="mb-6">
            <h2 className="text-xl font-bold text-[#1DA1F2] mb-3 pb-1 border-b border-[#1DA1F2]/30">
              Experience
            </h2>
            <div className="space-y-4">
              {generatedResume.experience.map((exp) => (
                <div key={exp.id}>
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-semibold text-gray-900">{exp.position}</h3>
                      <p className="text-[#1DA1F2] font-medium">{exp.company}</p>
                    </div>
                    <span className="text-gray-600 text-sm">
                      {exp.startDate} - {exp.current ? 'Present' : exp.endDate}
                    </span>
                  </div>
                  <p className="text-gray-700 mt-2 text-sm">{exp.description}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Education */}
          <div className="mb-6">
            <h2 className="text-xl font-bold text-[#1DA1F2] mb-3 pb-1 border-b border-[#1DA1F2]/30">
              Education
            </h2>
            <div className="space-y-3">
              {generatedResume.education.map((edu) => (
                <div key={edu.id} className="flex justify-between items-start">
                  <div>
                    <h3 className="font-semibold text-gray-900">
                      {edu.degree} in {edu.field}
                    </h3>
                    <p className="text-[#1DA1F2]">{edu.institution}</p>
                  </div>
                  <div className="text-right text-sm text-gray-600">
                    <p>{edu.startDate} - {edu.endDate}</p>
                    {edu.gpa && <p>GPA: {edu.gpa}</p>}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Skills */}
          <div>
            <h2 className="text-xl font-bold text-[#1DA1F2] mb-3 pb-1 border-b border-[#1DA1F2]/30">
              Skills
            </h2>
            <div className="space-y-3">
              {generatedResume.skills.map((skillGroup) => (
                <div key={skillGroup.id}>
                  <h3 className="font-semibold text-gray-900 mb-1">{skillGroup.category}</h3>
                  <div className="flex flex-wrap gap-2">
                    {skillGroup.items.map((skill, index) => (
                      <span
                        key={index}
                        className="px-3 py-1 bg-[#1DA1F2]/10 text-[#1DA1F2] rounded-lg text-sm font-medium border border-[#1DA1F2]/20"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <PageLayout className="bg-black text-white">
      {/* Header with Tab Navigation */}
      <div className="sticky top-0 z-10 backdrop-blur-sm border-b bg-black/90 border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <h1 className="text-2xl font-bold text-white">Resume Builder</h1>
            </div>

            <div className="flex items-center space-x-3">
              {step === 'preview' && (
                <Button
                  onClick={handleDownloadPDF}
                  className="bg-[#1DA1F2] text-white hover:bg-[#1A8CD8] flex items-center gap-2"
                >
                  <Download className="w-4 h-4" />
                  Download PDF
                </Button>
              )}
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex space-x-1 border-b border-transparent">
            <button
              onClick={() => navigate('/resume-builder')}
              className="px-6 py-3 text-sm font-medium transition-all duration-200 border-b-2 flex items-center gap-2 hover:bg-opacity-10 border-transparent text-gray-400 hover:text-gray-300 hover:bg-gray-800 hover:border-gray-600"
            >
              <Edit3 className="w-4 h-4" />
              Traditional Builder
            </button>
            <button
              onClick={() => {/* Stay on current page - AI Builder */}}
              className="px-6 py-3 text-sm font-medium transition-all duration-200 border-b-2 flex items-center gap-2 border-[#1DA1F2] text-[#1DA1F2]"
            >
              <Bot className="w-4 h-4" />
              AI Resume Builder
            </button>
          </div>
        </div>
      </div>

      <div className="py-8">
        {step === 'input' && renderInputStep()}
        {step === 'generating' && renderGeneratingStep()}
        {step === 'preview' && renderPreviewStep()}
      </div>
    </PageLayout>
  );
}