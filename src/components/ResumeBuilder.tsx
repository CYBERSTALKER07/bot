import React, { useState, useRef, useEffect } from 'react';
import { Download, Eye, Plus, Trash2, Edit3, Palette, User, Briefcase, GraduationCap, Award, Phone, Mail, MapPin, Sparkles } from 'lucide-react';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import Button from './ui/Button';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { cn } from '../lib/cva';
import { AIResumeBuilder } from './ResumeBuilder/AIResumeBuilder';

// Color themes for auto-patterns
const colorThemes = [
  { name: 'Professional Blue', primary: '#1e40af', secondary: '#3b82f6', accent: '#93c5fd', text: '#1f2937' },
  { name: 'Modern Purple', primary: '#7c3aed', secondary: '#a855f7', accent: '#c4b5fd', text: '#374151' },
  { name: 'Elegant Green', primary: '#059669', secondary: '#10b981', accent: '#86efac', text: '#111827' },
  { name: 'Classic Black', primary: '#111827', secondary: '#374151', accent: '#9ca3af', text: '#1f2937' },
  { name: 'Cool Blue', primary: '#3b82f6', secondary: '#60a5fa', accent: '#bfdbfe', text: '#1c1917' },
  { name: 'Tech Cyan', primary: '#0891b2', secondary: '#06b6d4', accent: '#a5f3fc', text: '#0f172a' },
];

// Resume templates (removed creative template)
const templates = [
  { id: 'modern', name: 'Modern', description: 'Clean and contemporary design' },
  { id: 'classic', name: 'Classic', description: 'Traditional professional layout' },
  { id: 'minimal', name: 'Minimal', description: 'Simple and elegant' },
  { id: 'professional', name: 'Professional', description: 'Executive style with photo and sidebar' },
];

interface ResumeData {
  personalInfo: {
    fullName: string;
    email: string;
    phone: string;
    location: string;
    website: string;
    linkedin: string;
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
    gpa: string;
  }>;
  skills: Array<{
    id: string;
    category: string;
    items: string[];
  }>;
  projects: Array<{
    id: string;
    title: string;
    description: string;
    technologies: string[];
    link: string;
  }>;
  certifications: Array<{
    id: string;
    name: string;
    issuer: string;
    date: string;
    link: string;
  }>;
}

export default function ResumeBuilder() {
  const { user } = useAuth();
  const { isDark } = useTheme();
  const resumeRef = useRef<HTMLDivElement>(null);

  const [selectedTemplate, setSelectedTemplate] = useState('modern');
  const [selectedTheme, setSelectedTheme] = useState(0);
  const [isPreviewMode, setIsPreviewMode] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [activeSection, setActiveSection] = useState('personal');
  const [isMobile, setIsMobile] = useState(window.innerWidth < 1024);
  const [showAIBuilder, setShowAIBuilder] = useState(false);

  const [resumeData, setResumeData] = useState<ResumeData>({
    personalInfo: {
      fullName: (user as any)?.full_name || '',
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
      // Create a temporary hidden div for PDF generation with consistent styling
      const tempDiv = document.createElement('div');
      tempDiv.style.position = 'absolute';
      tempDiv.style.left = '-9999px';
      tempDiv.style.top = '0';
      tempDiv.style.width = '210mm';
      tempDiv.style.backgroundColor = '#ffffff';
      tempDiv.style.fontFamily = 'Arial, sans-serif';
      tempDiv.style.fontSize = '14px';
      tempDiv.style.lineHeight = '1.5';
      tempDiv.style.color = '#000000';

      // Create the resume HTML structure for PDF
      tempDiv.innerHTML = `
        <div style="padding: 32px; min-height: 297mm; background: white;">
          <!-- Header -->
          <div style="margin-bottom: 32px;">
            <div style="width: 100%; height: 8px; background-color: ${currentTheme.primary}; margin-bottom: 24px;"></div>
            <h1 style="font-size: 32px; font-weight: bold; margin-bottom: 8px; color: ${currentTheme.primary};">
              ${resumeData.personalInfo.fullName || 'Your Name'}
            </h1>
            <div style="display: flex; flex-wrap: wrap; gap: 16px; font-size: 14px; margin-bottom: 16px;">
              ${resumeData.personalInfo.email ? `
                <div style="display: flex; align-items: center; gap: 4px;">
                  <span style="color: ${currentTheme.secondary};">✉</span>
                  ${resumeData.personalInfo.email}
                </div>
              ` : ''}
              ${resumeData.personalInfo.phone ? `
                <div style="display: flex; align-items: center; gap: 4px;">
                  <span style="color: ${currentTheme.secondary};">📞</span>
                  ${resumeData.personalInfo.phone}
                </div>
              ` : ''}
              ${resumeData.personalInfo.location ? `
                <div style="display: flex; align-items: center; gap: 4px;">
                  <span style="color: ${currentTheme.secondary};">📍</span>
                  ${resumeData.personalInfo.location}
                </div>
              ` : ''}
            </div>
            ${resumeData.personalInfo.summary ? `
              <p style="margin-top: 16px; font-size: 14px; line-height: 1.6; color: #374151;">
                ${resumeData.personalInfo.summary}
              </p>
            ` : ''}
          </div>

          <!-- Experience -->
          ${resumeData.experience.length > 0 ? `
            <div style="margin-bottom: 24px;">
              <h2 style="font-size: 20px; font-weight: bold; margin-bottom: 16px; padding-bottom: 8px; border-bottom: 2px solid ${currentTheme.accent}; color: ${currentTheme.primary};">
                💼 Experience
              </h2>
              ${resumeData.experience.map(exp => `
                <div style="margin-bottom: 16px;">
                  <div style="display: flex; justify-content: space-between; align-items: start; margin-bottom: 4px;">
                    <h3 style="font-size: 18px; font-weight: 600; color: ${currentTheme.secondary};">
                      ${exp.position}
                    </h3>
                    <span style="font-size: 14px; color: #6b7280;">
                      ${exp.startDate} - ${exp.current ? 'Present' : exp.endDate}
                    </span>
                  </div>
                  <p style="font-weight: 500; color: #374151; margin-bottom: 8px;">${exp.company}</p>
                  ${exp.description ? `
                    <p style="font-size: 14px; color: #4b5563; line-height: 1.6;">
                      ${exp.description}
                    </p>
                  ` : ''}
                </div>
              `).join('')}
            </div>
          ` : ''}

          <!-- Education -->
          ${resumeData.education.length > 0 ? `
            <div style="margin-bottom: 24px;">
              <h2 style="font-size: 20px; font-weight: bold; margin-bottom: 16px; padding-bottom: 8px; border-bottom: 2px solid ${currentTheme.accent}; color: ${currentTheme.primary};">
                🎓 Education
              </h2>
              ${resumeData.education.map(edu => `
                <div style="margin-bottom: 16px;">
                  <div style="display: flex; justify-content: space-between; align-items: start; margin-bottom: 4px;">
                    <h3 style="font-size: 18px; font-weight: 600; color: ${currentTheme.secondary};">
                      ${edu.degree} ${edu.field ? `in ${edu.field}` : ''}
                    </h3>
                    <span style="font-size: 14px; color: #6b7280;">
                      ${edu.startDate} - ${edu.endDate}
                    </span>
                  </div>
                  <p style="font-weight: 500; color: #374151;">
                    ${edu.institution}
                    ${edu.gpa ? `<span style="margin-left: 8px; font-size: 14px;">GPA: ${edu.gpa}</span>` : ''}
                  </p>
                </div>
              `).join('')}
            </div>
          ` : ''}

          <!-- Skills -->
          ${resumeData.skills.length > 0 ? `
            <div style="margin-bottom: 24px;">
              <h2 style="font-size: 20px; font-weight: bold; margin-bottom: 16px; padding-bottom: 8px; border-bottom: 2px solid ${currentTheme.accent}; color: ${currentTheme.primary};">
                🏆 Skills
              </h2>
              ${resumeData.skills.map(skill => `
                <div style="margin-bottom: 12px;">
                  <h3 style="font-weight: 600; margin-bottom: 4px; color: ${currentTheme.secondary};">
                    ${skill.category}
                  </h3>
                  <div style="display: flex; flex-wrap: wrap; gap: 8px;">
                    ${skill.items.map(item => `
                      <span style="padding: 4px 8px; font-size: 12px; border-radius: 4px; background-color: ${currentTheme.accent}; color: ${currentTheme.text};">
                        ${item}
                      </span>
                    `).join('')}
                  </div>
                </div>
              `).join('')}
            </div>
          ` : ''}
        </div>
      `;

      document.body.appendChild(tempDiv);

      // Generate PDF from the temporary element
      const canvas = await html2canvas(tempDiv, {
        scale: 3, // Higher scale for better quality
        useCORS: true,
        allowTaint: true,
        backgroundColor: '#ffffff',
        width: tempDiv.scrollWidth,
        height: tempDiv.scrollHeight,
      });

      // Remove temporary element
      document.body.removeChild(tempDiv);

      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4',
      });

      const imgWidth = 210;
      const pageHeight = 297;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      let heightLeft = imgHeight;
      let position = 0;

      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;

      while (heightLeft >= 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
      }

      pdf.save(`${resumeData.personalInfo.fullName || 'Resume'}_Resume.pdf`);
    } catch (error) {
      console.error('Error generating PDF:', error);
      alert('Error generating PDF. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  // Python-based PDF Generation (Professional Quality)
  const generatePDFWithPython = async () => {
    setIsGenerating(true);
    try {
      const response = await fetch('http://localhost:5000/generate-resume', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          resumeData: resumeData,
          theme: currentTheme
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to generate PDF');
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.style.display = 'none';
      a.href = url;
      a.download = `${resumeData.personalInfo.fullName || 'Resume'}_Resume.pdf`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error('Error generating PDF with Python service:', error);
      // Fallback to client-side generation
      alert('Python service unavailable. Using client-side generation...');
      await generatePDF();
    } finally {
      setIsGenerating(false);
    }
  };

  // Combined PDF generation function that tries Python first
  const handlePDFGeneration = async () => {
    // Try Python service first, fallback to client-side if unavailable
    try {
      const healthCheck = await fetch('http://localhost:5000/health');
      if (healthCheck.ok) {
        await generatePDFWithPython();
      } else {
        await generatePDF();
      }
    } catch (error) {
      // Python service not available, use client-side generation
      await generatePDF();
    }
  };

  const currentTheme = colorThemes[selectedTheme];

  // Render functions for different sections
  const renderPersonalInfoForm = () => (
    <div className="space-y-6">
      <h3 className="text-xl font-bold mb-6">Personal Information</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <input
          type="text"
          placeholder="Full Name"
          value={resumeData.personalInfo.fullName}
          onChange={(e) => updatePersonalInfo('fullName', e.target.value)}
          className={cn(
            "px-4 py-3 rounded-xl border transition-all duration-200 focus:outline-hidden focus:ring-2 focus:ring-info-500",
            isDark
              ? 'bg-gray-800 border-gray-700 text-white placeholder-gray-400'
              : 'bg-white border-gray-200 text-gray-900 placeholder-gray-500'
          )}
        />
        <input
          type="email"
          placeholder="Email"
          value={resumeData.personalInfo.email}
          onChange={(e) => updatePersonalInfo('email', e.target.value)}
          className={cn(
            "px-4 py-3 rounded-xl border transition-all duration-200 focus:outline-hidden focus:ring-2 focus:ring-info-500",
            isDark
              ? 'bg-gray-800 border-gray-700 text-white placeholder-gray-400'
              : 'bg-white border-gray-200 text-gray-900 placeholder-gray-500'
          )}
        />
        <input
          type="tel"
          placeholder="Phone"
          value={resumeData.personalInfo.phone}
          onChange={(e) => updatePersonalInfo('phone', e.target.value)}
          className={cn(
            "px-4 py-3 rounded-xl border transition-all duration-200 focus:outline-hidden focus:ring-2 focus:ring-info-500",
            isDark
              ? 'bg-gray-800 border-gray-700 text-white placeholder-gray-400'
              : 'bg-white border-gray-200 text-gray-900 placeholder-gray-500'
          )}
        />
        <input
          type="text"
          placeholder="Location"
          value={resumeData.personalInfo.location}
          onChange={(e) => updatePersonalInfo('location', e.target.value)}
          className={cn(
            "px-4 py-3 rounded-xl border transition-all duration-200 focus:outline-hidden focus:ring-2 focus:ring-info-500",
            isDark
              ? 'bg-gray-800 border-gray-700 text-white placeholder-gray-400'
              : 'bg-white border-gray-200 text-gray-900 placeholder-gray-500'
          )}
        />
        <input
          type="url"
          placeholder="Website"
          value={resumeData.personalInfo.website}
          onChange={(e) => updatePersonalInfo('website', e.target.value)}
          className={cn(
            "px-4 py-3 rounded-xl border transition-all duration-200 focus:outline-hidden focus:ring-2 focus:ring-info-500",
            isDark
              ? 'bg-gray-800 border-gray-700 text-white placeholder-gray-400'
              : 'bg-white border-gray-200 text-gray-900 placeholder-gray-500'
          )}
        />
        <input
          type="url"
          placeholder="LinkedIn"
          value={resumeData.personalInfo.linkedin}
          onChange={(e) => updatePersonalInfo('linkedin', e.target.value)}
          className={cn(
            "px-4 py-3 rounded-xl border transition-all duration-200 focus:outline-hidden focus:ring-2 focus:ring-info-500",
            isDark
              ? 'bg-gray-800 border-gray-700 text-white placeholder-gray-400'
              : 'bg-white border-gray-200 text-gray-900 placeholder-gray-500'
          )}
        />
      </div>
      <textarea
        placeholder="Professional Summary"
        value={resumeData.personalInfo.summary}
        onChange={(e) => updatePersonalInfo('summary', e.target.value)}
        rows={4}
        className={cn(
          "w-full px-4 py-3 rounded-xl border transition-all duration-200 focus:outline-hidden focus:ring-2 focus:ring-info-500 resize-none",
          isDark
            ? 'bg-gray-800 border-gray-700 text-white placeholder-gray-400'
            : 'bg-white border-gray-200 text-gray-900 placeholder-gray-500'
        )}
      />
    </div>
  );

  const renderExperienceForm = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-bold">Work Experience</h3>
        <Button onClick={addExperience} size="small" className="flex items-center gap-2 bg-info-500 text-white rounded-full px-4">
          <Plus className="h-4 w-4" />
          Add Experience
        </Button>
      </div>
      {resumeData.experience.map((exp) => (
        <div key={exp.id} className={cn(
          "rounded-xl p-6 border space-y-4",
          isDark ? 'bg-gray-800 border-gray-700' : 'bg-gray-50 border-gray-200'
        )}>
          <div className="flex justify-between items-start">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 flex-1">
              <input
                type="text"
                placeholder="Company"
                value={exp.company}
                onChange={(e) => updateExperience(exp.id, 'company', e.target.value)}
                className={cn(
                  "px-4 py-3 rounded-xl border transition-all duration-200 focus:outline-hidden focus:ring-2 focus:ring-info-500",
                  isDark
                    ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400'
                    : 'bg-white border-gray-200 text-gray-900 placeholder-gray-500'
                )}
              />
              <input
                type="text"
                placeholder="Position"
                value={exp.position}
                onChange={(e) => updateExperience(exp.id, 'position', e.target.value)}
                className={cn(
                  "px-4 py-3 rounded-xl border transition-all duration-200 focus:outline-hidden focus:ring-2 focus:ring-info-500",
                  isDark
                    ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400'
                    : 'bg-white border-gray-200 text-gray-900 placeholder-gray-500'
                )}
              />
              <input
                type="date"
                placeholder="Start Date"
                value={exp.startDate}
                onChange={(e) => updateExperience(exp.id, 'startDate', e.target.value)}
                className={cn(
                  "px-4 py-3 rounded-xl border transition-all duration-200 focus:outline-hidden focus:ring-2 focus:ring-info-500",
                  isDark
                    ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400'
                    : 'bg-white border-gray-200 text-gray-900 placeholder-gray-500'
                )}
              />
              <div className="flex items-center gap-3">
                <input
                  type="date"
                  placeholder="End Date"
                  value={exp.endDate}
                  onChange={(e) => updateExperience(exp.id, 'endDate', e.target.value)}
                  disabled={exp.current}
                  className={cn(
                    "flex-1 px-4 py-3 rounded-xl border transition-all duration-200 focus:outline-hidden focus:ring-2 focus:ring-info-500",
                    exp.current && "opacity-50",
                    isDark
                      ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400'
                      : 'bg-white border-gray-200 text-gray-900 placeholder-gray-500'
                  )}
                />
                <label className="flex items-center gap-2 text-sm font-medium cursor-pointer">
                  <input
                    type="checkbox"
                    checked={exp.current}
                    onChange={(e) => updateExperience(exp.id, 'current', e.target.checked)}
                    className="w-4 h-4 text-info-600 bg-gray-100 border-gray-300 rounded focus:ring-info-500"
                  />
                  Current
                </label>
              </div>
            </div>
            <Button
              variant="text"
              size="small"
              onClick={() => removeExperience(exp.id)}
              className="text-red-500 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-full p-2"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
          <textarea
            placeholder="Describe your role, achievements, and key responsibilities..."
            value={exp.description}
            onChange={(e) => updateExperience(exp.id, 'description', e.target.value)}
            rows={4}
            className={cn(
              "w-full px-4 py-3 rounded-xl border transition-all duration-200 focus:outline-hidden focus:ring-2 focus:ring-info-500 resize-none",
              isDark
                ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400'
                : 'bg-white border-gray-200 text-gray-900 placeholder-gray-500'
            )}
          />
        </div>
      ))}

      {resumeData.experience.length === 0 && (
        <div className={cn(
          "text-center py-12 rounded-xl border-2 border-dashed",
          isDark ? 'border-gray-600 text-gray-400' : 'border-gray-300 text-gray-500'
        )}>
          <Briefcase className="h-12 w-12 mx-auto mb-4 opacity-50" />
          <p className="text-lg font-medium mb-2">No work experience added yet</p>
          <p className="text-sm">Click "Add Experience" to get started</p>
        </div>
      )}
    </div>
  );

  const renderEducationForm = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-bold">Education</h3>
        <Button onClick={addEducation} size="small" className="flex items-center gap-2 bg-info-500 text-white rounded-full px-4">
          <Plus className="h-4 w-4" />
          Add Education
        </Button>
      </div>
      {resumeData.education.map((edu) => (
        <div key={edu.id} className={cn(
          "rounded-xl p-6 border space-y-4",
          isDark ? 'bg-gray-800 border-gray-700' : 'bg-gray-50 border-gray-200'
        )}>
          <div className="flex justify-between items-start">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 flex-1">
              <input
                type="text"
                placeholder="Institution"
                value={edu.institution}
                onChange={(e) => updateEducation(edu.id, 'institution', e.target.value)}
                className={cn(
                  "px-4 py-3 rounded-xl border transition-all duration-200 focus:outline-hidden focus:ring-2 focus:ring-info-500",
                  isDark
                    ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400'
                    : 'bg-white border-gray-200 text-gray-900 placeholder-gray-500'
                )}
              />
              <input
                type="text"
                placeholder="Degree"
                value={edu.degree}
                onChange={(e) => updateEducation(edu.id, 'degree', e.target.value)}
                className={cn(
                  "px-4 py-3 rounded-xl border transition-all duration-200 focus:outline-hidden focus:ring-2 focus:ring-info-500",
                  isDark
                    ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400'
                    : 'bg-white border-gray-200 text-gray-900 placeholder-gray-500'
                )}
              />
              <input
                type="text"
                placeholder="Field of Study"
                value={edu.field}
                onChange={(e) => updateEducation(edu.id, 'field', e.target.value)}
                className={cn(
                  "px-4 py-3 rounded-xl border transition-all duration-200 focus:outline-hidden focus:ring-2 focus:ring-info-500",
                  isDark
                    ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400'
                    : 'bg-white border-gray-200 text-gray-900 placeholder-gray-500'
                )}
              />
              <input
                type="text"
                placeholder="GPA (optional)"
                value={edu.gpa}
                onChange={(e) => updateEducation(edu.id, 'gpa', e.target.value)}
                className={cn(
                  "px-4 py-3 rounded-xl border transition-all duration-200 focus:outline-hidden focus:ring-2 focus:ring-info-500",
                  isDark
                    ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400'
                    : 'bg-white border-gray-200 text-gray-900 placeholder-gray-500'
                )}
              />
              <input
                type="date"
                placeholder="Start Date"
                value={edu.startDate}
                onChange={(e) => updateEducation(edu.id, 'startDate', e.target.value)}
                className={cn(
                  "px-4 py-3 rounded-xl border transition-all duration-200 focus:outline-hidden focus:ring-2 focus:ring-info-500",
                  isDark
                    ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400'
                    : 'bg-white border-gray-200 text-gray-900 placeholder-gray-500'
                )}
              />
              <input
                type="date"
                placeholder="End Date"
                value={edu.endDate}
                onChange={(e) => updateEducation(edu.id, 'endDate', e.target.value)}
                className={cn(
                  "px-4 py-3 rounded-xl border transition-all duration-200 focus:outline-hidden focus:ring-2 focus:ring-info-500",
                  isDark
                    ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400'
                    : 'bg-white border-gray-200 text-gray-900 placeholder-gray-500'
                )}
              />
            </div>
            <Button
              variant="text"
              size="small"
              onClick={() => removeEducation(edu.id)}
              className="text-red-500 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-full p-2"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      ))}

      {resumeData.education.length === 0 && (
        <div className={cn(
          "text-center py-12 rounded-xl border-2 border-dashed",
          isDark ? 'border-gray-600 text-gray-400' : 'border-gray-300 text-gray-500'
        )}>
          <GraduationCap className="h-12 w-12 mx-auto mb-4 opacity-50" />
          <p className="text-lg font-medium mb-2">No education added yet</p>
          <p className="text-sm">Click "Add Education" to get started</p>
        </div>
      )}
    </div>
  );

  const renderSkillsForm = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-bold">Skills</h3>
        <Button onClick={addSkillCategory} size="small" className="flex items-center gap-2 bg-info-500 text-white rounded-full px-4">
          <Plus className="h-4 w-4" />
          Add Category
        </Button>
      </div>
      {resumeData.skills.map((skill) => (
        <div key={skill.id} className={cn(
          "rounded-xl p-6 border space-y-4",
          isDark ? 'bg-gray-800 border-gray-700' : 'bg-gray-50 border-gray-200'
        )}>
          <div className="flex justify-between items-start gap-3">
            <input
              type="text"
              placeholder="Category (e.g., Programming Languages)"
              value={skill.category}
              onChange={(e) => updateSkillCategory(skill.id, e.target.value)}
              className={cn(
                "flex-1 px-4 py-3 rounded-xl border transition-all duration-200 focus:outline-hidden focus:ring-2 focus:ring-info-500",
                isDark
                  ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400'
                  : 'bg-white border-gray-200 text-gray-900 placeholder-gray-500'
              )}
            />
            <Button
              variant="text"
              size="small"
              onClick={() => removeSkillCategory(skill.id)}
              className="text-red-500 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-full p-2"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
          <textarea
            placeholder="Skills (comma-separated, e.g., JavaScript, React, Node.js)"
            value={skill.items.join(', ')}
            onChange={(e) => updateSkillItems(skill.id, e.target.value)}
            rows={3}
            className={cn(
              "w-full px-4 py-3 rounded-xl border transition-all duration-200 focus:outline-hidden focus:ring-2 focus:ring-info-500 resize-none",
              isDark
                ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400'
                : 'bg-white border-gray-200 text-gray-900 placeholder-gray-500'
            )}
          />
        </div>
      ))}

      {resumeData.skills.length === 0 && (
        <div className={cn(
          "text-center py-12 rounded-xl border-2 border-dashed",
          isDark ? 'border-gray-600 text-gray-400' : 'border-gray-300 text-gray-500'
        )}>
          <Award className="h-12 w-12 mx-auto mb-4 opacity-50" />
          <p className="text-lg font-medium mb-2">No skills added yet</p>
          <p className="text-sm">Click "Add Category" to get started</p>
        </div>
      )}
    </div>
  );

  // Resume Preview Component with all templates
  const renderResumePreview = () => (
    <div
      ref={resumeRef}
      className="bg-white w-full max-w-[210mm] mx-auto shadow-lg"
      style={{
        minHeight: '297mm',
        fontFamily: 'Arial, sans-serif',
        color: currentTheme.text,
      }}
    >
      {selectedTemplate === 'modern' && renderModernTemplate()}
      {selectedTemplate === 'classic' && renderClassicTemplate()}
      {selectedTemplate === 'minimal' && renderMinimalTemplate()}
      {selectedTemplate === 'professional' && renderProfessionalTemplate()}
    </div>
  );

  // Modern Template (existing)
  const renderModernTemplate = () => (
    <div className="p-8">
      {/* Header */}
      <div className="mb-8">
        <div
          className="w-full h-2 mb-6"
          style={{ backgroundColor: currentTheme.primary }}
        />
        <h1
          className="text-4xl font-bold mb-2"
          style={{ color: currentTheme.primary }}
        >
          {resumeData.personalInfo.fullName || 'Your Name'}
        </h1>
        <div className="flex flex-wrap gap-4 text-sm">
          {resumeData.personalInfo.email && (
            <div className="flex items-center gap-1">
              <Mail className="h-4 w-4" style={{ color: currentTheme.secondary }} />
              {resumeData.personalInfo.email}
            </div>
          )}
          {resumeData.personalInfo.phone && (
            <div className="flex items-center gap-1">
              <Phone className="h-4 w-4" style={{ color: currentTheme.secondary }} />
              {resumeData.personalInfo.phone}
            </div>
          )}
          {resumeData.personalInfo.location && (
            <div className="flex items-center gap-1">
              <MapPin className="h-4 w-4" style={{ color: currentTheme.secondary }} />
              {resumeData.personalInfo.location}
            </div>
          )}
        </div>
        {resumeData.personalInfo.summary && (
          <p className="mt-4 text-sm leading-relaxed text-gray-700">
            {resumeData.personalInfo.summary}
          </p>
        )}
      </div>

      {/* Experience */}
      {resumeData.experience.length > 0 && (
        <div className="mb-6">
          <h2
            className="text-xl font-bold mb-4 pb-2 border-b-2"
            style={{
              color: currentTheme.primary,
              borderColor: currentTheme.accent
            }}
          >
            <Briefcase className="inline h-5 w-5 mr-2" />
            Experience
          </h2>
          {resumeData.experience.map((exp, index) => (
            <div key={exp.id} className={index > 0 ? "mt-4" : ""}>
              <div className="flex justify-between items-start mb-1">
                <h3 className="font-semibold text-lg" style={{ color: currentTheme.secondary }}>
                  {exp.position}
                </h3>
                <span className="text-sm text-gray-600">
                  {exp.startDate} - {exp.current ? 'Present' : exp.endDate}
                </span>
              </div>
              <p className="font-medium text-gray-800 mb-2">{exp.company}</p>
              {exp.description && (
                <p className="text-sm text-gray-700 leading-relaxed">
                  {exp.description}
                </p>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Education */}
      {resumeData.education.length > 0 && (
        <div className="mb-6">
          <h2
            className="text-xl font-bold mb-4 pb-2 border-b-2"
            style={{
              color: currentTheme.primary,
              borderColor: currentTheme.accent
            }}
          >
            <GraduationCap className="inline h-5 w-5 mr-2" />
            Education
          </h2>
          {resumeData.education.map((edu, index) => (
            <div key={edu.id} className={index > 0 ? "mt-4" : ""}>
              <div className="flex justify-between items-start mb-1">
                <h3 className="font-semibold text-lg" style={{ color: currentTheme.secondary }}>
                  {edu.degree} {edu.field && `in ${edu.field}`}
                </h3>
                <span className="text-sm text-gray-600">
                  {edu.startDate} - {edu.endDate}
                </span>
              </div>
              <p className="font-medium text-gray-800">
                {edu.institution}
                {edu.gpa && <span className="ml-2 text-sm">GPA: {edu.gpa}</span>}
              </p>
            </div>
          ))}
        </div>
      )}

      {/* Skills */}
      {resumeData.skills.length > 0 && (
        <div className="mb-6">
          <h2
            className="text-xl font-bold mb-4 pb-2 border-b-2"
            style={{
              color: currentTheme.primary,
              borderColor: currentTheme.accent
            }}
          >
            <Award className="inline h-5 w-5 mr-2" />
            Skills
          </h2>
          {resumeData.skills.map((skill) => (
            <div key={skill.id} className="mb-3">
              <h3 className="font-semibold mb-1" style={{ color: currentTheme.secondary }}>
                {skill.category}
              </h3>
              <div className="flex flex-wrap gap-2">
                {skill.items.map((item, index) => (
                  <span
                    key={index}
                    className="px-2 py-1 text-xs rounded"
                    style={{
                      backgroundColor: currentTheme.accent,
                      color: currentTheme.text
                    }}
                  >
                    {item}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );

  // Classic Template - Traditional professional layout
  const renderClassicTemplate = () => (
    <div className="p-8">
      {/* Header */}
      <div className="text-center mb-8 pb-6 border-b-2" style={{ borderColor: currentTheme.primary }}>
        <h1
          className="text-3xl font-bold mb-3"
          style={{ color: currentTheme.primary }}
        >
          {resumeData.personalInfo.fullName || 'Your Name'}
        </h1>
        <div className="text-sm space-y-1">
          {resumeData.personalInfo.email && (
            <div>{resumeData.personalInfo.email}</div>
          )}
          {resumeData.personalInfo.phone && (
            <div>{resumeData.personalInfo.phone}</div>
          )}
          {resumeData.personalInfo.location && (
            <div>{resumeData.personalInfo.location}</div>
          )}
        </div>
        {resumeData.personalInfo.summary && (
          <div className="mt-4 max-w-2xl mx-auto">
            <h3 className="text-sm font-bold mb-2 uppercase tracking-wider" style={{ color: currentTheme.secondary }}>
              Professional Summary
            </h3>
            <p className="text-sm leading-relaxed text-gray-700">
              {resumeData.personalInfo.summary}
            </p>
          </div>
        )}
      </div>

      {/* Experience */}
      {resumeData.experience.length > 0 && (
        <div className="mb-8">
          <h2
            className="text-lg font-bold mb-4 uppercase tracking-wider border-b pb-2"
            style={{ color: currentTheme.primary, borderColor: currentTheme.accent }}
          >
            Professional Experience
          </h2>
          {resumeData.experience.map((exp, index) => (
            <div key={exp.id} className={index > 0 ? "mt-6" : ""}>
              <div className="mb-2">
                <h3 className="font-bold text-base" style={{ color: currentTheme.secondary }}>
                  {exp.position}
                </h3>
                <div className="flex justify-between items-center">
                  <p className="font-semibold text-gray-800">{exp.company}</p>
                  <span className="text-sm text-gray-600 italic">
                    {exp.startDate} - {exp.current ? 'Present' : exp.endDate}
                  </span>
                </div>
              </div>
              {exp.description && (
                <p className="text-sm text-gray-700 leading-relaxed">
                  {exp.description}
                </p>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Education */}
      {resumeData.education.length > 0 && (
        <div className="mb-8">
          <h2
            className="text-lg font-bold mb-4 uppercase tracking-wider border-b pb-2"
            style={{ color: currentTheme.primary, borderColor: currentTheme.accent }}
          >
            Education
          </h2>
          {resumeData.education.map((edu, index) => (
            <div key={edu.id} className={index > 0 ? "mt-4" : ""}>
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-bold text-base" style={{ color: currentTheme.secondary }}>
                    {edu.degree} {edu.field && `in ${edu.field}`}
                  </h3>
                  <p className="font-semibold text-gray-800">
                    {edu.institution}
                    {edu.gpa && <span className="ml-2 text-sm">GPA: {edu.gpa}</span>}
                  </p>
                </div>
                <span className="text-sm text-gray-600 italic">
                  {edu.startDate} - {edu.endDate}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Skills */}
      {resumeData.skills.length > 0 && (
        <div className="mb-6">
          <h2
            className="text-lg font-bold mb-4 uppercase tracking-wider border-b pb-2"
            style={{ color: currentTheme.primary, borderColor: currentTheme.accent }}
          >
            Skills & Competencies
          </h2>
          {resumeData.skills.map((skill) => (
            <div key={skill.id} className="mb-3">
              <h3 className="font-bold text-sm mb-1" style={{ color: currentTheme.secondary }}>
                {skill.category}:
              </h3>
              <p className="text-sm text-gray-700">
                {skill.items.join(' • ')}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );

  // Professional Template - Executive style with photo and dark sidebar (matches the image)
  const renderProfessionalTemplate = () => (
    <div className="flex h-full">
      {/* Dark Left Sidebar */}
      <div className="w-1/3 bg-gray-700 text-white p-6 flex flex-col">
        {/* Profile Photo Placeholder */}
        <div className="mb-6 flex justify-center">
          <div className="w-32 h-32 bg-white rounded-full flex items-center justify-center">
            <User className="w-16 h-16 text-gray-700" />
          </div>
        </div>

        {/* Contact Me Section */}
        <div className="mb-8">
          <h3 className="text-lg font-bold mb-4 text-white">CONTACT ME</h3>
          <div className="space-y-3 text-sm">
            {resumeData.personalInfo.location && (
              <div className="flex items-start gap-3">
                <MapPin className="w-4 h-4 mt-0.5 shrink-0" />
                <div>
                  <div className="font-medium">Address</div>
                  <div className="text-gray-300">{resumeData.personalInfo.location}</div>
                </div>
              </div>
            )}
            {resumeData.personalInfo.phone && (
              <div className="flex items-start gap-3">
                <Phone className="w-4 h-4 mt-0.5 shrink-0" />
                <div>
                  <div className="font-medium">Phone</div>
                  <div className="text-gray-300">{resumeData.personalInfo.phone}</div>
                </div>
              </div>
            )}
            {resumeData.personalInfo.email && (
              <div className="flex items-start gap-3">
                <Mail className="w-4 h-4 mt-0.5 shrink-0" />
                <div>
                  <div className="font-medium">Web</div>
                  <div className="text-gray-300">{resumeData.personalInfo.email}</div>
                  <div className="text-gray-300">{resumeData.personalInfo.website || 'www.website.com'}</div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Pro Skills Section */}
        {resumeData.skills.length > 0 && (
          <div className="mb-8">
            <h3 className="text-lg font-bold mb-4 text-white">PRO SKILLS</h3>
            <div className="space-y-4">
              {resumeData.skills.map((skill) => (
                <div key={skill.id}>
                  {skill.items.slice(0, 5).map((item, index) => (
                    <div key={index} className="mb-3">
                      <div className="text-sm font-medium mb-1">{item}</div>
                      <div className="w-full bg-gray-600 rounded-full h-1">
                        <div
                          className="h-1 rounded-full"
                          style={{
                            backgroundColor: currentTheme.accent,
                            width: `${Math.max(70, 90 - index * 5)}%`
                          }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Follow Me Section */}
        <div className="mt-auto">
          <h3 className="text-lg font-bold mb-4 text-white">FOLLOW ME</h3>
          <div className="space-y-2 text-sm">
            <div className="flex items-center gap-3">
              <div className="w-5 h-5 bg-info-600 rounded flex items-center justify-center">
                <span className="text-xs font-bold">f</span>
              </div>
              <div>
                <div>Facebook</div>
                <div className="text-gray-300">facebook.com/yourname</div>
              </div>
            </div>
            {resumeData.personalInfo.linkedin && (
              <div className="flex items-center gap-3">
                <div className="w-5 h-5 bg-info-500 rounded flex items-center justify-center">
                  <span className="text-xs font-bold">in</span>
                </div>
                <div>
                  <div>LinkedIn</div>
                  <div className="text-gray-300">{resumeData.personalInfo.linkedin}</div>
                </div>
              </div>
            )}
            <div className="flex items-center gap-3">
              <div className="w-5 h-5 bg-info-400 rounded flex items-center justify-center">
                <span className="text-xs font-bold">@</span>
              </div>
              <div>
                <div>Twitter</div>
                <div className="text-gray-300">twitter.com/yourname</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* White Right Content Area */}
      <div className="w-2/3 bg-white p-8">
        {/* Header */}
        <div className="mb-8">
          <h1
            className="text-4xl font-bold mb-2 tracking-wide"
            style={{ color: currentTheme.primary }}
          >
            {resumeData.personalInfo.fullName || 'HENRY MADISON'}
          </h1>
          <div
            className="text-lg font-medium mb-6 tracking-wider"
            style={{ color: currentTheme.secondary }}
          >
            GRAPHIC DESIGNER
          </div>
        </div>

        {/* Profile Section */}
        {resumeData.personalInfo.summary && (
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-4">
              <div
                className="w-8 h-8 rounded-full flex items-center justify-center"
                style={{ backgroundColor: currentTheme.primary }}
              >
                <User className="w-4 h-4 text-white" />
              </div>
              <h2 className="text-xl font-bold" style={{ color: currentTheme.primary }}>
                PROFILE
              </h2>
            </div>
            <p className="text-sm text-gray-700 leading-relaxed">
              {resumeData.personalInfo.summary}
            </p>
          </div>
        )}

        {/* Experience Section */}
        {resumeData.experience.length > 0 && (
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-6">
              <div
                className="w-8 h-8 rounded-full flex items-center justify-center"
                style={{ backgroundColor: currentTheme.primary }}
              >
                <Briefcase className="w-4 h-4 text-white" />
              </div>
              <h2 className="text-xl font-bold" style={{ color: currentTheme.primary }}>
                EXPERIENCE
              </h2>
            </div>

            {resumeData.experience.map((exp, index) => (
              <div key={exp.id} className={`mb-6 ${index > 0 ? 'border-t border-gray-200 pt-6' : ''}`}>
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h3 className="font-bold text-lg" style={{ color: currentTheme.secondary }}>
                      {exp.position || 'SENIOR GRAPHIC DESIGNER'}
                    </h3>
                    <p className="text-sm text-gray-600 font-medium">
                      {exp.company || 'Creative Agency LTD'}
                    </p>
                  </div>
                  <div className="text-sm font-bold" style={{ color: currentTheme.primary }}>
                    {exp.startDate} - {exp.current ? 'Present' : exp.endDate}
                  </div>
                </div>
                {exp.description && (
                  <p className="text-sm text-gray-700 leading-relaxed">
                    {exp.description}
                  </p>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Education Section */}
        {resumeData.education.length > 0 && (
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-6">
              <div
                className="w-8 h-8 rounded-full flex items-center justify-center"
                style={{ backgroundColor: currentTheme.primary }}
              >
                <GraduationCap className="w-4 h-4 text-white" />
              </div>
              <h2 className="text-xl font-bold" style={{ color: currentTheme.primary }}>
                EDUCATION
              </h2>
            </div>

            {resumeData.education.map((edu, index) => (
              <div key={edu.id} className={`mb-6 ${index > 0 ? 'border-t border-gray-200 pt-6' : ''}`}>
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h3 className="font-bold text-lg" style={{ color: currentTheme.secondary }}>
                      {edu.degree || 'BACHELORS OF ARTS'} {edu.field && `IN ${edu.field.toUpperCase()}`}
                    </h3>
                    <p className="text-sm text-gray-600 font-medium">
                      {edu.institution || 'Asian University'}
                    </p>
                  </div>
                  <div className="text-sm font-bold" style={{ color: currentTheme.primary }}>
                    {edu.startDate} - {edu.endDate}
                  </div>
                </div>
                {edu.gpa && (
                  <p className="text-sm text-gray-700">
                    GPA: {edu.gpa}
                  </p>
                )}
              </div>
            ))}
          </div>
        )}

        {/* References Section */}
        <div className="mb-6">
          <div className="flex items-center gap-3 mb-6">
            <div
              className="w-8 h-8 rounded-full flex items-center justify-center"
              style={{ backgroundColor: currentTheme.primary }}
            >
              <User className="w-4 h-4 text-white" />
            </div>
            <h2 className="text-xl font-bold" style={{ color: currentTheme.primary }}>
              REFERENCES
            </h2>
          </div>

          <div className="grid grid-cols-2 gap-6">
            <div>
              <h4 className="font-bold text-base mb-1" style={{ color: currentTheme.secondary }}>
                Jonathon Deo
              </h4>
              <p className="text-sm text-gray-600 mb-1">Designer</p>
              <p className="text-sm text-gray-600">Phone: +000 0000 0000</p>
              <p className="text-sm text-gray-600">Email: your@gmail.com</p>
            </div>
            <div>
              <h4 className="font-bold text-base mb-1" style={{ color: currentTheme.secondary }}>
                Jabin Smith
              </h4>
              <p className="text-sm text-gray-600 mb-1">Web Developer</p>
              <p className="text-sm text-gray-600">Phone: +000 0000 0000</p>
              <p className="text-sm text-gray-600">Email: your@gmail.com</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  // Minimal Template - Simple and elegant
  const renderMinimalTemplate = () => (
    <div className="p-12">
      {/* Header */}
      <div className="mb-12">
        <h1
          className="text-4xl font-light mb-6 tracking-wide"
          style={{ color: currentTheme.primary }}
        >
          {resumeData.personalInfo.fullName || 'Your Name'}
        </h1>

        <div className="flex flex-wrap gap-8 text-sm text-gray-600 mb-8">
          {resumeData.personalInfo.email && <div>{resumeData.personalInfo.email}</div>}
          {resumeData.personalInfo.phone && <div>{resumeData.personalInfo.phone}</div>}
          {resumeData.personalInfo.location && <div>{resumeData.personalInfo.location}</div>}
          {resumeData.personalInfo.website && <div>{resumeData.personalInfo.website}</div>}
        </div>

        {resumeData.personalInfo.summary && (
          <p className="text-sm leading-relaxed text-gray-700 max-w-3xl">
            {resumeData.personalInfo.summary}
          </p>
        )}
      </div>

      {/* Experience */}
      {resumeData.experience.length > 0 && (
        <div className="mb-12">
          <h2
            className="text-lg font-light mb-8 uppercase tracking-widest pb-2"
            style={{ color: currentTheme.primary, borderBottom: `1px solid ${currentTheme.accent}` }}
          >
            Experience
          </h2>
          {resumeData.experience.map((exp, index) => (
            <div key={exp.id} className={`grid grid-cols-4 gap-8 ${index > 0 ? "mt-8" : ""}`}>
              <div className="text-sm text-gray-500">
                {exp.startDate} — {exp.current ? 'Present' : exp.endDate}
              </div>
              <div className="col-span-3">
                <h3 className="font-semibold text-base mb-1" style={{ color: currentTheme.secondary }}>
                  {exp.position}
                </h3>
                <p className="text-sm text-gray-800 mb-2">{exp.company}</p>
                {exp.description && (
                  <p className="text-sm text-gray-700 leading-relaxed">
                    {exp.description}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Education */}
      {resumeData.education.length > 0 && (
        <div className="mb-12">
          <h2
            className="text-lg font-light mb-8 uppercase tracking-widest pb-2"
            style={{ color: currentTheme.primary, borderBottom: `1px solid ${currentTheme.accent}` }}
          >
            Education
          </h2>
          {resumeData.education.map((edu, index) => (
            <div key={edu.id} className={`grid grid-cols-4 gap-8 ${index > 0 ? "mt-8" : ""}`}>
              <div className="text-sm text-gray-500">
                {edu.startDate} — {edu.endDate}
              </div>
              <div className="col-span-3">
                <h3 className="font-semibold text-base mb-1" style={{ color: currentTheme.secondary }}>
                  {edu.degree} {edu.field && `in ${edu.field}`}
                </h3>
                <p className="text-sm text-gray-800">
                  {edu.institution}
                  {edu.gpa && <span className="ml-2">GPA: {edu.gpa}</span>}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Skills */}
      {resumeData.skills.length > 0 && (
        <div className="mb-8">
          <h2
            className="text-lg font-light mb-8 uppercase tracking-widest pb-2"
            style={{ color: currentTheme.primary, borderBottom: `1px solid ${currentTheme.accent}` }}
          >
            Skills
          </h2>
          <div className="grid grid-cols-2 gap-8">
            {resumeData.skills.map((skill) => (
              <div key={skill.id}>
                <h3 className="font-semibold text-sm mb-2" style={{ color: currentTheme.secondary }}>
                  {skill.category}
                </h3>
                <p className="text-sm text-gray-700 leading-relaxed">
                  {skill.items.join(', ')}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );

  const handleAIGenerate = (generatedData: any) => {
    setResumeData(generatedData);
    setActiveSection('personal');
  };

  if (isGenerating) {
    return (
      <div className={cn(
        "min-h-screen flex items-center justify-center",
        isDark ? 'bg-black text-white' : 'bg-white text-black',
        "pt-20 lg:pt-0 lg:ml-20"
      )}>
        <div className="flex flex-col items-center space-y-4">
          <div className={`animate-spin rounded-full h-8 w-8 border-b-2 ${isDark ? 'border-white' : 'border-black'
            }`}></div>
          <span className="text-sm font-medium">Generating your resume...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-linear-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-blue-900">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 shadow-xs border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                Resume Builder
              </h1>
              <button
                onClick={() => setShowAIBuilder(!showAIBuilder)}
                className="flex items-center space-x-2 px-4 py-2 bg-linear-to-r from-purple-600 to-info-600 text-white rounded-lg hover:from-purple-700 hover:to-blue-700 transition-all duration-200"
              >
                <Sparkles className="w-4 h-4" />
                <span>AI Builder</span>
              </button>
            </div>

            <div className="flex items-center space-x-4">
              {/* ...existing code... */}
            </div>
          </div>
        </div>
      </div>

      {/* Conditional rendering for AI Builder */}
      {showAIBuilder ? (
        <AIResumeBuilder
          onGenerate={handleAIGenerate}
          onBack={() => setShowAIBuilder(false)}
        />
      ) : (
        <>
          {/* Main Content */}
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {/* ...existing main content... */}
          </div>
        </>
      )}
    </div>
  );
}
                    </li >                  </ul >                </div >              </div >