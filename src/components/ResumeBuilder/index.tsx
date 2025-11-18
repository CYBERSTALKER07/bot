import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Download, Eye, User, Briefcase, GraduationCap, Award, Sparkles, Wand2, X, Save, Edit3, Cloud, FileText, Trash2, Copy, Bot, Cpu } from 'lucide-react';
import Button from '../ui/Button';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { cn } from '../../lib/cva';

// Import the new components
import { PersonalInfoForm } from './PersonalInfoForm';
import { ExperienceForm } from './ExperienceForm';
import { EducationForm } from './EducationForm';
import { SkillsForm } from './SkillsForm';
import { TemplateSelector } from './TemplateSelector';
import { ResumePreview } from './ResumePreview';
import { handlePDFGeneration } from './pdfUtils';
import { ResumeData, colorThemes } from './types';
import { AIResumeBuilder } from './AIResumeBuilder';

interface User {
  email: string;
  full_name?: string;
}

export default function ResumeBuilder() {
  const { user } = useAuth();
  const { isDark } = useTheme();
  const resumeRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  const [selectedTemplate, setSelectedTemplate] = useState('modern');
  const [selectedTheme, setSelectedTheme] = useState(0);
  const [isPreviewMode, setIsPreviewMode] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [activeSection, setActiveSection] = useState('personal');
  const [isMobile, setIsMobile] = useState(window.innerWidth < 1024);
  const [showAIBuilder, setShowAIBuilder] = useState(false);
  const [isVisualEditMode, setIsVisualEditMode] = useState(false);
  const [editingElement, setEditingElement] = useState<string | null>(null);
  const [saveSlots, setSaveSlots] = useState<Array<{id: string, name: string, data: ResumeData, timestamp: number}>>([]);
  const [showSaveModal, setShowSaveModal] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [isAILoading, setIsAILoading] = useState(false);

  const [resumeData, setResumeData] = useState<ResumeData>({
    personalInfo: {
      fullName: (user as User)?.full_name || '',
      email: user?.email || '',
      phone: '',
      location: '',
      website: '',
      linkedin: '',
      summary: '',
    },
    experience: [],
    education: [],
    skills: [],
    projects: [],
    certifications: [],
  });

  const currentTheme = colorThemes[selectedTheme];

  // Auto-save functionality
  useEffect(() => {
    const savedData = localStorage.getItem('resume-builder-data');
    if (savedData) {
      try {
        setResumeData(JSON.parse(savedData));
      } catch (error) {
        console.error('Error loading saved resume data:', error);
      }
    }
  }, []);

  useEffect(() => {
    const saveTimer = setTimeout(() => {
      localStorage.setItem('resume-builder-data', JSON.stringify(resumeData));
      setLastSaved(new Date());
    }, 1000);

    return () => clearTimeout(saveTimer);
  }, [resumeData]);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 1024);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Enhanced save functionality
  useEffect(() => {
    const savedSlots = localStorage.getItem('resume-save-slots');
    if (savedSlots) {
      try {
        setSaveSlots(JSON.parse(savedSlots));
      } catch (error) {
        console.error('Error loading save slots:', error);
      }
    }
  }, []);

  // Update functions
  const updatePersonalInfo = (field: string, value: string) => {
    setResumeData(prev => ({
      ...prev,
      personalInfo: { ...prev.personalInfo, [field]: value }
    }));
  };

  const addExperience = () => {
    const newExp = {
      id: Date.now().toString(),
      company: '',
      position: '',
      startDate: '',
      endDate: '',
      current: false,
      description: '',
    };
    setResumeData(prev => ({
      ...prev,
      experience: [...prev.experience, newExp]
    }));
  };

  const updateExperience = (id: string, field: string, value: string | boolean) => {
    setResumeData(prev => ({
      ...prev,
      experience: prev.experience.map(exp => 
        exp.id === id ? { ...exp, [field]: value } : exp
      )
    }));
  };

  const removeExperience = (id: string) => {
    setResumeData(prev => ({
      ...prev,
      experience: prev.experience.filter(exp => exp.id !== id)
    }));
  };

  const addEducation = () => {
    const newEdu = {
      id: Date.now().toString(),
      institution: '',
      degree: '',
      field: '',
      startDate: '',
      endDate: '',
      gpa: '',
    };
    setResumeData(prev => ({
      ...prev,
      education: [...prev.education, newEdu]
    }));
  };

  const updateEducation = (id: string, field: string, value: string) => {
    setResumeData(prev => ({
      ...prev,
      education: prev.education.map(edu => 
        edu.id === id ? { ...edu, [field]: value } : edu
      )
    }));
  };

  const removeEducation = (id: string) => {
    setResumeData(prev => ({
      ...prev,
      education: prev.education.filter(edu => edu.id !== id)
    }));
  };

  const addSkillCategory = () => {
    const newSkill = {
      id: Date.now().toString(),
      category: '',
      items: [],
    };
    setResumeData(prev => ({
      ...prev,
      skills: [...prev.skills, newSkill]
    }));
  };

  const updateSkillCategory = (id: string, category: string) => {
    setResumeData(prev => ({
      ...prev,
      skills: prev.skills.map(skill => 
        skill.id === id ? { ...skill, category } : skill
      )
    }));
  };

  const updateSkillItems = (id: string, items: string) => {
    const itemsArray = items.split(',').map(item => item.trim()).filter(item => item);
    setResumeData(prev => ({
      ...prev,
      skills: prev.skills.map(skill => 
        skill.id === id ? { ...skill, items: itemsArray } : skill
      )
    }));
  };

  const removeSkillCategory = (id: string) => {
    setResumeData(prev => ({
      ...prev,
      skills: prev.skills.filter(skill => skill.id !== id)
    }));
  };

  // PDF Generation
  const generatePDF = async () => {
    setIsGenerating(true);
    try {
      await handlePDFGeneration(resumeRef, resumeData, currentTheme);
    } catch (error) {
      console.error('Error generating PDF:', error);
      alert('Error generating PDF. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  const sections = [
    { id: 'personal', name: 'Personal Info', icon: User },
    { id: 'experience', name: 'Experience', icon: Briefcase },
    { id: 'education', name: 'Education', icon: GraduationCap },
    { id: 'skills', name: 'Skills', icon: Award },
  ];

  const renderFormSection = () => {
    switch (activeSection) {
      case 'personal':
        return (
          <PersonalInfoForm 
            resumeData={resumeData} 
            updatePersonalInfo={updatePersonalInfo} 
          />
        );
      case 'experience':
        return (
          <ExperienceForm 
            resumeData={resumeData}
            addExperience={addExperience}
            updateExperience={updateExperience}
            removeExperience={removeExperience}
          />
        );
      case 'education':
        return (
          <EducationForm 
            resumeData={resumeData}
            addEducation={addEducation}
            updateEducation={updateEducation}
            removeEducation={removeEducation}
          />
        );
      case 'skills':
        return (
          <SkillsForm 
            resumeData={resumeData}
            addSkillCategory={addSkillCategory}
            updateSkillCategory={updateSkillCategory}
            updateSkillItems={updateSkillItems}
            removeSkillCategory={removeSkillCategory}
          />
        );
      default:
        return null;
    }
  };

  // Handle AI-generated content
  const handleAIGeneration = (generatedData: Partial<ResumeData>) => {
    setIsAILoading(true);
    setTimeout(() => {
      setResumeData(prev => ({
        ...prev,
        ...generatedData,
        personalInfo: { ...prev.personalInfo, ...generatedData.personalInfo },
        experience: generatedData.experience || prev.experience,
        education: generatedData.education || prev.education,
        skills: generatedData.skills || prev.skills,
        projects: generatedData.projects || prev.projects,
        certifications: generatedData.certifications || prev.certifications,
      }));
      setShowAIBuilder(false);
      setIsAILoading(false);
    }, 500);
  };

  // Visual editing handlers
  const handleEditElement = (elementType: string, elementId: string, field: string, value: string) => {
    switch (elementType) {
      case 'personalInfo':
        updatePersonalInfo(field, value);
        break;
      case 'experience':
        updateExperience(elementId, field, value);
        break;
      case 'education':
        updateEducation(elementId, field, value);
        break;
      case 'skills':
        if (field === 'category') {
          updateSkillCategory(elementId, value);
        }
        break;
      default:
        break;
    }
    setEditingElement(null);
  };

  const saveToSlot = async (slotName: string) => {
    setIsSaving(true);
    const newSlot = {
      id: Date.now().toString(),
      name: slotName,
      data: resumeData,
      timestamp: Date.now()
    };
    
    const updatedSlots = [...saveSlots, newSlot];
    setSaveSlots(updatedSlots);
    localStorage.setItem('resume-save-slots', JSON.stringify(updatedSlots));
    
    // Simulate cloud save
    await new Promise(resolve => setTimeout(resolve, 1000));
    setIsSaving(false);
    setShowSaveModal(false);
    setLastSaved(new Date());
  };

  const loadFromSlot = (slotId: string) => {
    const slot = saveSlots.find(s => s.id === slotId);
    if (slot) {
      setResumeData(slot.data);
    }
  };

  const deleteSlot = (slotId: string) => {
    const updatedSlots = saveSlots.filter(s => s.id !== slotId);
    setSaveSlots(updatedSlots);
    localStorage.setItem('resume-save-slots', JSON.stringify(updatedSlots));
  };

  const duplicateSlot = (slotId: string) => {
    const slot = saveSlots.find(s => s.id === slotId);
    if (slot) {
      const newSlot = {
        id: Date.now().toString(),
        name: `${slot.name} (Copy)`,
        data: slot.data,
        timestamp: Date.now()
      };
      const updatedSlots = [...saveSlots, newSlot];
      setSaveSlots(updatedSlots);
      localStorage.setItem('resume-save-slots', JSON.stringify(updatedSlots));
    }
  };

  if (isPreviewMode && isMobile) {
    return (
      <div className={cn(
        "min-h-screen",
        isDark ? 'bg-black text-white' : 'bg-white text-black'
      )}>
        <div className={cn(
          "sticky top-0 z-10 backdrop-blur-sm border-b",
          isDark ? 'bg-black/90 border-gray-800' : 'bg-white/90 border-gray-200'
        )}>
          <div className="flex items-center justify-between p-4">
            <Button
              variant="text"
              onClick={() => setIsPreviewMode(false)}
              className={cn(
                "hover:bg-opacity-10",
                isDark ? 'text-info-400 hover:text-info-300 hover:bg-info-400' : 'text-info-500 hover:text-info-700 hover:bg-info-500'
              )}
            >
              ← Back to Editor
            </Button>
            <Button
              onClick={generatePDF}
              disabled={isGenerating}
              className="bg-info-500 text-white rounded-full px-6 flex items-center gap-2 hover:bg-info-600"
            >
              <Download className="h-4 w-4" />
              {isGenerating ? 'Generating...' : 'Download PDF'}
            </Button>
          </div>
        </div>
        
        <div className="overflow-auto">
          <ResumePreview
            resumeData={resumeData}
            selectedTemplate={selectedTemplate}
            currentTheme={currentTheme}
            resumeRef={resumeRef}
            isVisualEditMode={isVisualEditMode}
            onEditElement={handleEditElement}
            editingElement={editingElement}
          />
        </div>
      </div>
    );
  }

  return (
    <div className={cn(
      "min-h-screen",
      isDark ? 'bg-black text-white' : 'bg-white text-black'
    )}>
      {/* Header */}
      <div className={cn(
        "sticky top-0 z-10 backdrop-blur-sm border-b",
        isDark ? 'bg-black/90 border-gray-800' : 'bg-white/90 border-gray-200'
      )}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <h1 className={cn(
                "text-2xl font-bold",
                isDark ? 'text-white' : 'text-black'
              )}>Resume Builder</h1>
              {!isMobile && (
                <Button
                  variant={isPreviewMode ? "filled" : "text"}
                  onClick={() => setIsPreviewMode(!isPreviewMode)}
                  className={cn(
                    "flex items-center gap-2",
                    !isPreviewMode && isDark ? 'text-white hover:bg-gray-800' : '',
                    !isPreviewMode && !isDark ? 'text-black hover:bg-gray-100' : ''
                  )}
                >
                  <Eye className="h-4 w-4" />
                  {isPreviewMode ? 'Edit Mode' : 'Preview'}
                </Button>
              )}
            </div>

            <div className="flex items-center space-x-3">
              {/* Save Management */}
              <Button
                variant="text"
                onClick={() => setShowSaveModal(true)}
                className={cn(
                  "flex items-center gap-2",
                  isDark ? 'text-white hover:bg-gray-800' : 'text-black hover:bg-gray-100'
                )}
              >
                <Save className="h-4 w-4" />
                Save
              </Button>

              {/* Auto-save indicator */}
              {lastSaved && (
                <div className={cn(
                  "flex items-center gap-1 text-xs",
                  isDark ? 'text-gray-400' : 'text-gray-500'
                )}>
                  <Cloud className="h-3 w-3" />
                  Saved {lastSaved.toLocaleTimeString()}
                </div>
              )}

              {isMobile && (
                <Button
                  variant="text"
                  onClick={() => setIsPreviewMode(true)}
                  className={cn(
                    "flex items-center gap-2",
                    isDark ? 'text-info-400 hover:text-info-300' : 'text-info-500 hover:text-info-700'
                  )}
                >
                  <Eye className="h-4 w-4" />
                  Preview
                </Button>
              )}
              
              <Button
                onClick={generatePDF}
                disabled={isGenerating}
                className="bg-info-500 text-white rounded-full px-6 flex items-center gap-2 hover:bg-info-600"
              >
                <Download className="h-4 w-4" />
                {isGenerating ? 'Generating...' : 'Download PDF'}
              </Button>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex space-x-1 border-b border-transparent">
            <button
              onClick={() => {/* Stay on current page - Traditional Builder */}}
              className={cn(
                "px-6 py-3 text-sm font-medium transition-all duration-200 border-b-2 flex items-center gap-2",
                "border-info-500 text-info-500", // Always active since we're on this tab
                isDark ? 'text-info-400 border-info-400' : 'text-info-600 border-info-600'
              )}
            >
              <Edit3 className="w-4 h-4" />
              Traditional Builder
            </button>
            <button
              onClick={() => navigate('/ai-resume-builder')}
              className={cn(
                "px-6 py-3 text-sm font-medium transition-all duration-200 border-b-2 flex items-center gap-2 hover:bg-opacity-10",
                "border-transparent",
                isDark 
                  ? 'text-gray-400 hover:text-gray-300 hover:bg-gray-800 hover:border-gray-600' 
                  : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100 hover:border-gray-300'
              )}
            >
              <Bot className="w-4 h-4" />
              AI Resume Builder
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Left Sidebar - Form */}
          <div className="lg:w-1/2 space-y-6">
            {/* Section Navigation */}
            <div className={cn(
              "rounded-2xl p-4 border",
              isDark ? 'bg-black border-gray-800 text-white' : 'bg-white border-gray-200 text-black'
            )}>
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-2">
                {sections.map((section) => {
                  const IconComponent = section.icon;
                  return (
                    <button
                      key={section.id}
                      onClick={() => setActiveSection(section.id)}
                      className={cn(
                        "p-3 rounded-xl text-sm font-medium transition-all duration-200 flex flex-col items-center gap-1 border",
                        activeSection === section.id
                          ? 'bg-info-500 text-white shadow-lg border-info-500'
                          : isDark 
                            ? 'text-white hover:bg-gray-800 border-gray-800' 
                            : 'text-black hover:bg-gray-100 border-gray-200'
                      )}
                    >
                      <IconComponent className="h-5 w-5" />
                      <span className="hidden sm:block">{section.name}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Template Selector */}
            <TemplateSelector
              selectedTemplate={selectedTemplate}
              setSelectedTemplate={setSelectedTemplate}
              selectedTheme={selectedTheme}
              setSelectedTheme={setSelectedTheme}
            />

            {/* AI Resume Builder Section */}
            {showAIBuilder ? (
              <div className={cn(
                "rounded-2xl p-6 border",
                isDark ? 'bg-black border-gray-800 text-white' : 'bg-white border-gray-200 text-black'
              )}>
                <div className="flex items-center justify-between mb-4">
                  <h2 className={cn(
                    "text-lg font-semibold",
                    isDark ? 'text-white' : 'text-black'
                  )}>AI Resume Builder</h2>
                  <Button
                    onClick={() => setShowAIBuilder(false)}
                    variant="text"
                    size="small"
                    className="p-2"
                  >
                    <X className="h-5 w-5" />
                  </Button>
                </div>
                <AIResumeBuilder
                  onGenerate={handleAIGeneration}
                  isLoading={isAILoading}
                />
              </div>
            ) : (
              <div className={cn(
                "rounded-2xl p-6 border",
                isDark ? 'bg-black border-gray-800 text-white' : 'bg-white border-gray-200 text-black'
              )}>
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-gradient-to-br from-purple-500 to-info-600 rounded-xl">
                      <Sparkles className="h-5 w-5 text-white" />
                    </div>
                    <div>
                      <h2 className={cn(
                        "text-lg font-semibold",
                        isDark ? 'text-white' : 'text-black'
                      )}>AI Resume Builder</h2>
                      <p className={cn(
                        "text-sm",
                        isDark ? 'text-gray-400' : 'text-gray-500'
                      )}>Generate professional resume content with AI</p>
                    </div>
                  </div>
                  <Button
                    onClick={() => setShowAIBuilder(true)}
                    className="bg-gradient-to-r from-purple-500 to-info-600 text-white px-6 py-3 rounded-xl font-medium flex items-center gap-2 hover:from-purple-600 hover:to-blue-700 transition-all duration-200"
                  >
                    <Wand2 className="h-4 w-4" />
                    Generate with AI
                  </Button>
                </div>
                
                <div className={cn(
                  "text-sm",
                  isDark ? 'text-gray-400' : 'text-gray-600'
                )}>
                  <p className="mb-2">✨ Describe your ideal resume and let AI do the work</p>
                  <p className="mb-2">🚀 Generate professional content in seconds</p>
                  <p>🎯 Tailored to your industry and experience level</p>
                </div>
              </div>
            )}

            {/* Form Section */}
            <div className={cn(
              "rounded-2xl p-6 border",
              isDark ? 'bg-black border-gray-800 text-white' : 'bg-white border-gray-200 text-black'
            )}>
              {renderFormSection()}
            </div>
          </div>

          {/* Right Side - Preview (Desktop only) */}
          {!isMobile && (
            <div className="lg:w-1/2">
              <div className="sticky top-24">
                <ResumePreview
                  resumeData={resumeData}
                  selectedTemplate={selectedTemplate}
                  currentTheme={currentTheme}
                  resumeRef={resumeRef}
                  isVisualEditMode={isVisualEditMode}
                  onEditElement={handleEditElement}
                  editingElement={editingElement}
                />
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Save Management Modal */}
      {showSaveModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className={cn(
            "max-w-2xl w-full max-h-[90vh] overflow-y-auto rounded-2xl border",
            isDark ? 'bg-black border-gray-800 text-white' : 'bg-white border-gray-200 text-black'
          )}>
            {/* Modal Header */}
            <div className={cn(
              "sticky top-0 backdrop-blur-xl border-b p-6 flex items-center justify-between",
              isDark ? 'bg-black/80 border-gray-800' : 'bg-white/80 border-gray-200'
            )}>
              <h2 className="text-xl font-bold">Save & Load Resume</h2>
              <Button
                onClick={() => setShowSaveModal(false)}
                variant="text"
                size="small"
                className="p-2"
              >
                <X className="h-5 w-5" />
              </Button>
            </div>

            {/* Modal Content */}
            <div className="p-6 space-y-6">
              {/* New Save Section */}
              <div>
                <h3 className="text-lg font-semibold mb-4">Save Current Resume</h3>
                <div className="flex gap-3">
                  <input
                    type="text"
                    placeholder="Enter save name..."
                    className={cn(
                      "flex-1 px-4 py-2 rounded-lg border transition-all duration-200",
                      isDark 
                        ? 'bg-gray-900 border-gray-700 text-white placeholder-gray-400' 
                        : 'bg-white border-gray-300 text-black placeholder-gray-500'
                    )}
                    onKeyPress={(e) => {
                      if (e.key === 'Enter' && e.currentTarget.value.trim()) {
                        saveToSlot(e.currentTarget.value.trim());
                        e.currentTarget.value = '';
                      }
                    }}
                  />
                  <Button
                    onClick={(e) => {
                      const input = e.currentTarget.previousElementSibling as HTMLInputElement;
                      if (input.value.trim()) {
                        saveToSlot(input.value.trim());
                        input.value = '';
                      }
                    }}
                    disabled={isSaving}
                    className="bg-info-500 text-white px-6 py-2 rounded-lg hover:bg-info-600 flex items-center gap-2"
                  >
                    {isSaving ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        Saving...
                      </>
                    ) : (
                      <>
                        <Save className="h-4 w-4" />
                        Save
                      </>
                    )}
                  </Button>
                </div>
              </div>

              {/* Saved Resumes */}
              <div>
                <h3 className="text-lg font-semibold mb-4">Saved Resumes ({saveSlots.length})</h3>
                {saveSlots.length === 0 ? (
                  <div className={cn(
                    "text-center py-8 rounded-lg border-2 border-dashed",
                    isDark ? 'border-gray-700 text-gray-400' : 'border-gray-300 text-gray-500'
                  )}>
                    <FileText className="h-12 w-12 mx-auto mb-3 opacity-50" />
                    <p>No saved resumes yet</p>
                    <p className="text-sm mt-1">Save your current resume to get started</p>
                  </div>
                ) : (
                  <div className="space-y-3 max-h-64 overflow-y-auto">
                    {saveSlots.map((slot) => (
                      <div
                        key={slot.id}
                        className={cn(
                          "p-4 rounded-lg border transition-all duration-200 hover:shadow-md",
                          isDark ? 'bg-gray-900 border-gray-700 hover:border-gray-600' : 'bg-gray-50 border-gray-200 hover:border-gray-300'
                        )}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex-1 min-w-0">
                            <h4 className="font-semibold truncate">{slot.name}</h4>
                            <p className={cn(
                              "text-sm mt-1",
                              isDark ? 'text-gray-400' : 'text-gray-500'
                            )}>
                              Saved {new Date(slot.timestamp).toLocaleDateString()} at{' '}
                              {new Date(slot.timestamp).toLocaleTimeString()}
                            </p>
                          </div>
                          <div className="flex items-center gap-2 ml-4">
                            <Button
                              onClick={() => loadFromSlot(slot.id)}
                              variant="text"
                              size="small"
                              className={cn(
                                "p-2 hover:bg-info-500 hover:text-white",
                                isDark ? 'text-info-400' : 'text-info-500'
                              )}
                              title="Load Resume"
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button
                              onClick={() => duplicateSlot(slot.id)}
                              variant="text"
                              size="small"
                              className={cn(
                                "p-2 hover:bg-green-500 hover:text-white",
                                isDark ? 'text-green-400' : 'text-green-500'
                              )}
                              title="Duplicate Resume"
                            >
                              <Copy className="h-4 w-4" />
                            </Button>
                            <Button
                              onClick={() => deleteSlot(slot.id)}
                              variant="text"
                              size="small"
                              className={cn(
                                "p-2 hover:bg-red-500 hover:text-white",
                                isDark ? 'text-red-400' : 'text-red-500'
                              )}
                              title="Delete Resume"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Cloud Sync Status */}
              <div className={cn(
                "flex items-center justify-between p-4 rounded-lg border",
                isDark ? 'bg-gray-900 border-gray-700' : 'bg-info-50 border-info-200'
              )}>
                <div className="flex items-center gap-3">
                  <Cloud className={cn(
                    "h-5 w-5",
                    isDark ? 'text-info-400' : 'text-info-500'
                  )} />
                  <div>
                    <h4 className="font-medium">Cloud Sync</h4>
                    <p className={cn(
                      "text-sm",
                      isDark ? 'text-gray-400' : 'text-gray-600'
                    )}>
                      Auto-saves every change locally
                    </p>
                  </div>
                </div>
                <div className={cn(
                  "px-3 py-1 rounded-full text-xs font-medium",
                  isDark ? 'bg-green-900 text-green-300' : 'bg-green-100 text-green-700'
                )}>
                  Active
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}