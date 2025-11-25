import { Mail, Phone, MapPin, Briefcase, GraduationCap, Award, User, Edit3 } from 'lucide-react';
import { ResumeData, ColorTheme } from './types';
import { useState } from 'react';

interface ResumeTemplateProps {
  resumeData: ResumeData;
  currentTheme: ColorTheme;
  isVisualEditMode?: boolean;
  onEditElement?: (elementType: string, elementId: string, field: string, value: string) => void;
  editingElement?: string | null;
}

// Editable Text Component for visual editing
function EditableText({ 
  value, 
  elementType, 
  elementId, 
  field, 
  isEditing, 
  onEdit, 
  className, 
  style, 
  multiline = false 
}: {
  value: string;
  elementType: string;
  elementId: string;
  field: string;
  isEditing: boolean;
  onEdit?: (elementType: string, elementId: string, field: string, value: string) => void;
  className?: string;
  style?: React.CSSProperties;
  multiline?: boolean;
}) {
  const [tempValue, setTempValue] = useState(value);
  const [isHovered, setIsHovered] = useState(false);

  const handleSave = () => {
    if (onEdit && tempValue !== value) {
      onEdit(elementType, elementId, field, tempValue);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !multiline) {
      e.preventDefault();
      handleSave();
    } else if (e.key === 'Escape') {
      setTempValue(value);
    }
  };

  if (isEditing && onEdit) {
    return multiline ? (
      <textarea
        value={tempValue}
        onChange={(e) => setTempValue(e.target.value)}
        onBlur={handleSave}
        onKeyDown={handleKeyDown}
        className={`${className} border-2 border-info-500 bg-info-50 focus:outline-hidden resize-none`}
        style={style}
        autoFocus
        rows={3}
      />
    ) : (
      <input
        type="text"
        value={tempValue}
        onChange={(e) => setTempValue(e.target.value)}
        onBlur={handleSave}
        onKeyDown={handleKeyDown}
        className={`${className} border-2 border-info-500 bg-info-50 focus:outline-hidden`}
        style={style}
        autoFocus
      />
    );
  }

  return (
    <div
      className={`${className} ${onEdit ? 'cursor-pointer hover:bg-info-50 hover:ring-1 hover:ring-blue-300 rounded transition-all' : ''} relative group`}
      style={style}
      onClick={() => onEdit && onEdit(elementType, elementId, field, value)}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {value || (onEdit ? 'Click to edit...' : '')}
      {onEdit && isHovered && (
        <Edit3 className="absolute -top-2 -right-2 h-4 w-4 text-info-500 bg-white rounded-full p-0.5 shadow-xs" />
      )}
    </div>
  );
}

export function ModernTemplate({ resumeData, currentTheme, isVisualEditMode, onEditElement, editingElement }: ResumeTemplateProps) {
  return (
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
          <EditableText 
            value={resumeData.personalInfo.fullName || 'Your Name'}
            elementType="personalInfo"
            elementId={resumeData.personalInfo.id}
            field="fullName"
            isEditing={editingElement === 'personalInfo'}
            onEdit={onEditElement}
            className="inline"
          />
        </h1>
        <div className="flex flex-wrap gap-4 text-sm">
          {resumeData.personalInfo.email && (
            <div className="flex items-center gap-1">
              <Mail className="h-4 w-4" style={{ color: currentTheme.secondary }} />
              <EditableText 
                value={resumeData.personalInfo.email}
                elementType="personalInfo"
                elementId={resumeData.personalInfo.id}
                field="email"
                isEditing={editingElement === 'personalInfo'}
                onEdit={onEditElement}
              />
            </div>
          )}
          {resumeData.personalInfo.phone && (
            <div className="flex items-center gap-1">
              <Phone className="h-4 w-4" style={{ color: currentTheme.secondary }} />
              <EditableText 
                value={resumeData.personalInfo.phone}
                elementType="personalInfo"
                elementId={resumeData.personalInfo.id}
                field="phone"
                isEditing={editingElement === 'personalInfo'}
                onEdit={onEditElement}
              />
            </div>
          )}
          {resumeData.personalInfo.location && (
            <div className="flex items-center gap-1">
              <MapPin className="h-4 w-4" style={{ color: currentTheme.secondary }} />
              <EditableText 
                value={resumeData.personalInfo.location}
                elementType="personalInfo"
                elementId={resumeData.personalInfo.id}
                field="location"
                isEditing={editingElement === 'personalInfo'}
                onEdit={onEditElement}
              />
            </div>
          )}
        </div>
        {resumeData.personalInfo.summary && (
          <p className="mt-4 text-sm leading-relaxed text-gray-700">
            <EditableText 
              value={resumeData.personalInfo.summary}
              elementType="personalInfo"
              elementId={resumeData.personalInfo.id}
              field="summary"
              isEditing={editingElement === 'personalInfo'}
              onEdit={onEditElement}
              multiline
            />
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
                  <EditableText 
                    value={exp.position}
                    elementType="experience"
                    elementId={exp.id}
                    field="position"
                    isEditing={editingElement === 'experience'}
                    onEdit={onEditElement}
                  />
                </h3>
                <span className="text-sm text-gray-600">
                  {exp.startDate} - {exp.current ? 'Present' : exp.endDate}
                </span>
              </div>
              <p className="font-medium text-gray-800 mb-2">
                <EditableText 
                  value={exp.company}
                  elementType="experience"
                  elementId={exp.id}
                  field="company"
                  isEditing={editingElement === 'experience'}
                  onEdit={onEditElement}
                />
              </p>
              {exp.description && (
                <p className="text-sm text-gray-700 leading-relaxed">
                  <EditableText 
                    value={exp.description}
                    elementType="experience"
                    elementId={exp.id}
                    field="description"
                    isEditing={editingElement === 'experience'}
                    onEdit={onEditElement}
                    multiline
                  />
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
}

export function ClassicTemplate({ resumeData, currentTheme, isVisualEditMode, onEditElement, editingElement }: ResumeTemplateProps) {
  return (
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
}

// Minimal Template - Simple and elegant
export function MinimalTemplate({ resumeData, currentTheme, isVisualEditMode, onEditElement, editingElement }: ResumeTemplateProps) {
  return (
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
          <p className="text-base leading-relaxed text-gray-700 max-w-4xl">
            {resumeData.personalInfo.summary}
          </p>
        )}
      </div>

      {/* Experience */}
      {resumeData.experience.length > 0 && (
        <div className="mb-12">
          <h2 
            className="text-2xl font-light mb-8 tracking-wider"
            style={{ color: currentTheme.primary }}
          >
            Experience
          </h2>
          {resumeData.experience.map((exp) => (
            <div key={exp.id} className="border-l-2 pl-6 first:mt-0 mt-8" style={{ borderColor: currentTheme.accent }}>
              <div className="flex justify-between items-start mb-2">
                <div>
                  <h3 className="text-xl font-medium" style={{ color: currentTheme.secondary }}>
                    {exp.position}
                  </h3>
                  <p className="text-gray-600 font-medium">{exp.company}</p>
                </div>
                <span className="text-sm text-gray-500">
                  {exp.startDate} - {exp.current ? 'Present' : exp.endDate}
                </span>
              </div>
              {exp.description && (
                <p className="text-gray-700 leading-relaxed mt-3">
                  {exp.description}
                </p>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Education */}
      {resumeData.education.length > 0 && (
        <div className="mb-12">
          <h2 
            className="text-2xl font-light mb-8 tracking-wider"
            style={{ color: currentTheme.primary }}
          >
            Education
          </h2>
          {resumeData.education.map((edu) => (
            <div key={edu.id} className="border-l-2 pl-6 first:mt-0 mt-6" style={{ borderColor: currentTheme.accent }}>
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
        <div className="mb-8">
          <h2 
            className="text-2xl font-light mb-8 tracking-wider"
            style={{ color: currentTheme.primary }}
          >
            Skills
          </h2>
          <div className="space-y-6">
            {resumeData.skills.map((skill) => (
              <div key={skill.id}>
                <h3 className="text-lg font-medium mb-3" style={{ color: currentTheme.secondary }}>
                  {skill.category}
                </h3>
                <p className="text-gray-700 leading-relaxed">
                  {skill.items.join(' • ')}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// Professional Template - Executive style with sidebar
export function ProfessionalTemplate({ resumeData, currentTheme, isVisualEditMode, onEditElement, editingElement }: ResumeTemplateProps) {
  return (
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
      </div>

      {/* White Right Content Area */}
      <div className="w-2/3 bg-white p-8">
        {/* Header */}
        <div className="mb-8">
          <h1 
            className="text-4xl font-bold mb-2 tracking-wide"
            style={{ color: currentTheme.primary }}
          >
            {resumeData.personalInfo.fullName || 'Your Name'}
          </h1>
          <div 
            className="text-lg font-medium mb-6 tracking-wider"
            style={{ color: currentTheme.secondary }}
          >
            PROFESSIONAL
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
                <div className="w-4 h-4 bg-white rounded" />
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
                      {exp.position || 'Position'}
                    </h3>
                    <p className="text-sm text-gray-600 font-medium">
                      {exp.company || 'Company'}
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
                <div className="w-4 h-4 bg-white rounded" />
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
                      {edu.degree || 'Degree'} {edu.field && `IN ${edu.field.toUpperCase()}`}
                    </h3>
                    <p className="text-sm text-gray-600 font-medium">
                      {edu.institution || 'Institution'}
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
      </div>
    </div>
  );
}

// Creative Template - Bold and expressive design
export function CreativeTemplate({ resumeData, currentTheme, isVisualEditMode, onEditElement, editingElement }: ResumeTemplateProps) {
  return (
    <div className="relative overflow-hidden">
      {/* Decorative Background Elements */}
      <div className="absolute top-0 right-0 w-64 h-64 opacity-10">
        <div 
          className="w-full h-full rounded-full"
          style={{ backgroundColor: currentTheme.accent }}
        />
      </div>
      <div className="absolute bottom-0 left-0 w-48 h-48 opacity-5">
        <div 
          className="w-full h-full rounded-full"
          style={{ backgroundColor: currentTheme.primary }}
        />
      </div>

      <div className="relative z-10 p-8">
        {/* Creative Header */}
        <div className="mb-10">
          <div className="flex items-start justify-between mb-6">
            <div className="flex-1">
              <h1 
                className="text-5xl font-black mb-3 leading-tight"
                style={{ color: currentTheme.primary }}
              >
                {resumeData.personalInfo.fullName || 'YOUR NAME'}
              </h1>
              <div 
                className="text-lg font-bold uppercase tracking-wider mb-4"
                style={{ color: currentTheme.secondary }}
              >
                Creative Professional
              </div>
              
              <div className="flex flex-wrap gap-4 text-sm font-medium">
                {resumeData.personalInfo.email && (
                  <div 
                    className="flex items-center gap-2 px-3 py-1 rounded-full"
                    style={{ backgroundColor: `${currentTheme.accent}20`, color: currentTheme.accent }}
                  >
                    <Mail className="h-4 w-4" />
                    {resumeData.personalInfo.email}
                  </div>
                )}
                {resumeData.personalInfo.phone && (
                  <div 
                    className="flex items-center gap-2 px-3 py-1 rounded-full"
                    style={{ backgroundColor: `${currentTheme.accent}20`, color: currentTheme.accent }}
                  >
                    <Phone className="h-4 w-4" />
                    {resumeData.personalInfo.phone}
                  </div>
                )}
                {resumeData.personalInfo.location && (
                  <div 
                    className="flex items-center gap-2 px-3 py-1 rounded-full"
                    style={{ backgroundColor: `${currentTheme.accent}20`, color: currentTheme.accent }}
                  >
                    <MapPin className="h-4 w-4" />
                    {resumeData.personalInfo.location}
                  </div>
                )}
              </div>
            </div>
            
            <div className="ml-8">
              <div 
                className="w-32 h-32 rounded-2xl flex items-center justify-center shadow-lg"
                style={{ backgroundColor: currentTheme.primary }}
              >
                <User className="w-16 h-16 text-white" />
              </div>
            </div>
          </div>

          {resumeData.personalInfo.summary && (
            <div 
              className="p-6 rounded-2xl border-l-8 shadow-xs"
              style={{ 
                backgroundColor: `${currentTheme.primary}05`,
                borderLeftColor: currentTheme.primary 
              }}
            >
              <h3 
                className="text-lg font-bold mb-3 uppercase tracking-wider"
                style={{ color: currentTheme.secondary }}
              >
                Creative Vision
              </h3>
              <p className="text-gray-700 leading-relaxed text-lg">
                {resumeData.personalInfo.summary}
              </p>
            </div>
          )}
        </div>

        {/* Experience with Creative Layout */}
        {resumeData.experience.length > 0 && (
          <div className="mb-10">
            <h2 
              className="text-3xl font-black mb-8 uppercase tracking-wider"
              style={{ color: currentTheme.primary }}
            >
              Experience
            </h2>
            
            <div className="space-y-8">
              {resumeData.experience.map((exp, index) => (
                <div 
                  key={exp.id}
                  className="relative p-6 rounded-2xl shadow-lg border-l-8"
                  style={{ 
                    backgroundColor: index % 2 === 0 ? `${currentTheme.accent}10` : 'white',
                    borderLeftColor: currentTheme.accent 
                  }}
                >
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 
                        className="text-2xl font-bold mb-2"
                        style={{ color: currentTheme.secondary }}
                      >
                        {exp.position}
                      </h3>
                      <p className="text-xl font-semibold text-gray-800">{exp.company}</p>
                    </div>
                    <div 
                      className="px-4 py-2 rounded-full text-sm font-bold text-white shadow-lg"
                      style={{ backgroundColor: currentTheme.primary }}
                    >
                      {exp.startDate} - {exp.current ? 'Present' : exp.endDate}
                    </div>
                  </div>
                  {exp.description && (
                    <p className="text-gray-700 leading-relaxed">
                      {exp.description}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Creative Skills Grid */}
        {resumeData.skills.length > 0 && (
          <div className="mb-10">
            <h2 
              className="text-3xl font-black mb-8 uppercase tracking-wider"
              style={{ color: currentTheme.primary }}
            >
              Skills & Expertise
            </h2>
            
            <div className="grid md:grid-cols-2 gap-6">
              {resumeData.skills.map((skill, index) => (
                <div 
                  key={skill.id}
                  className="p-6 rounded-2xl shadow-lg transform hover:scale-105 transition-transform"
                  style={{ 
                    backgroundColor: index % 2 === 0 ? currentTheme.primary : currentTheme.secondary,
                    color: 'white'
                  }}
                >
                  <h3 className="text-xl font-bold mb-4 text-center">
                    {skill.category}
                  </h3>
                  <div className="flex flex-wrap gap-2 justify-center">
                    {skill.items.map((item, itemIndex) => (
                      <span 
                        key={itemIndex}
                        className="px-3 py-1 rounded-full text-sm font-medium bg-white bg-opacity-20 backdrop-blur-sm"
                      >
                        {item}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Education */}
        {resumeData.education.length > 0 && (
          <div className="mb-8">
            <h2 
              className="text-3xl font-black mb-8 uppercase tracking-wider"
              style={{ color: currentTheme.primary }}
            >
              Education
            </h2>
            
            <div className="space-y-6">
              {resumeData.education.map((edu) => (
                <div 
                  key={edu.id}
                  className="p-6 rounded-2xl shadow-lg border-t-8"
                  style={{ 
                    backgroundColor: `${currentTheme.secondary}15`,
                    borderTopColor: currentTheme.secondary 
                  }}
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 
                        className="text-2xl font-bold mb-2"
                        style={{ color: currentTheme.primary }}
                      >
                        {edu.degree} {edu.field && `in ${edu.field}`}
                      </h3>
                      <p className="text-xl font-semibold text-gray-700">
                        {edu.institution}
                      </p>
                      {edu.gpa && (
                        <div 
                          className="inline-block px-4 py-2 rounded-full text-sm font-bold shadow-lg"
                          style={{ backgroundColor: currentTheme.accent, color: 'white' }}
                        >
                          GPA: {edu.gpa}
                        </div>
                      )}
                    </div>
                    <div 
                      className="px-4 py-2 rounded-full text-sm font-bold text-white"
                      style={{ backgroundColor: currentTheme.primary }}
                    >
                      {edu.startDate} - {edu.endDate}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// AUT Special Template - Enhanced version for special occasions
export function AUTSpecialTemplate({ resumeData, currentTheme, isVisualEditMode, onEditElement, editingElement }: ResumeTemplateProps) {
  return (
    <div className="bg-white">
      {/* Header with enhanced AUT branding */}
      <div className="bg-linear-to-r from-red-800 via-red-900 to-black text-white p-8 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-16 translate-x-16"></div>
        <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/5 rounded-full translate-y-12 -translate-x-12"></div>
        <div className="relative z-10">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-5xl font-bold mb-3 tracking-tight">
                {resumeData.personalInfo.fullName || 'Your Name'}
              </h1>
              <div className="flex items-center gap-3 mb-4">
                <div className="px-4 py-2 rounded-full text-sm font-bold bg-white text-red-800">
                  AUT Distinguished Graduate
                </div>
                <div 
                  className="px-4 py-2 rounded-full text-sm font-bold"
                  style={{ backgroundColor: currentTheme.accent, color: 'white' }}
                >
                  Innovation Leader
                </div>
              </div>
              <div className="flex flex-wrap gap-6 text-sm opacity-90">
                {resumeData.personalInfo.email && <span className="flex items-center gap-2"><Mail className="w-4 h-4" />{resumeData.personalInfo.email}</span>}
                {resumeData.personalInfo.phone && <span className="flex items-center gap-2"><Phone className="w-4 h-4" />{resumeData.personalInfo.phone}</span>}
                {resumeData.personalInfo.location && <span className="flex items-center gap-2"><MapPin className="w-4 h-4" />{resumeData.personalInfo.location}</span>}
              </div>
            </div>
            <div className="text-right">
              <div className="text-8xl font-bold opacity-30 text-white mb-2">
                AUT
              </div>
              <div className="text-sm opacity-90 font-medium">
                Excellence • Innovation • Global Impact
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="p-8">
        {/* Executive Summary */}
        {resumeData.personalInfo.summary && (
          <div className="mb-10">
            <div className="flex items-center gap-4 mb-6">
              <div 
                className="w-2 h-12 rounded-full bg-linear-to-b"
                style={{ backgroundImage: `linear-gradient(to bottom, ${currentTheme.primary}, ${currentTheme.secondary})` }}
              />
              <h2 
                className="text-3xl font-bold"
                style={{ color: currentTheme.primary }}
              >
                EXECUTIVE SUMMARY
              </h2>
            </div>
            <div className="bg-linear-to-r from-gray-50 via-white to-gray-50 p-8 rounded-xl border-l-8" 
                 style={{ borderLeftColor: currentTheme.primary }}>
              <p className="text-gray-800 leading-relaxed text-lg font-medium">
                {resumeData.personalInfo.summary}
              </p>
            </div>
          </div>
        )}

        {/* Professional Journey */}
        {resumeData.experience.length > 0 && (
          <div className="mb-10">
            <div className="flex items-center gap-4 mb-8">
              <div 
                className="w-2 h-12 rounded-full bg-linear-to-b"
                style={{ backgroundImage: `linear-gradient(to bottom, ${currentTheme.primary}, ${currentTheme.secondary})` }}
              />
              <h2 
                className="text-3xl font-bold"
                style={{ color: currentTheme.primary }}
              >
                PROFESSIONAL JOURNEY
              </h2>
            </div>
            
            <div className="relative">
              {/* Timeline line */}
              <div 
                className="absolute left-8 top-0 bottom-0 w-1 rounded-full"
                style={{ backgroundColor: currentTheme.accent }}
              />
              
              <div className="space-y-8">
                {resumeData.experience.map((exp) => (
                  <div key={exp.id} className="relative pl-20">
                    <div 
                      className="absolute left-6 w-4 h-4 rounded-full border-4 border-white shadow-lg"
                      style={{ backgroundColor: currentTheme.primary }}
                    />
                    <div 
                      className="bg-white p-8 rounded-xl shadow-lg border-l-8"
                      style={{ borderLeftColor: currentTheme.secondary }}
                    >
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <h3 
                            className="text-2xl font-bold mb-2"
                            style={{ color: currentTheme.secondary }}
                          >
                            {exp.position || 'Position'}
                          </h3>
                          <p className="text-xl font-semibold text-gray-700 mb-2">
                            {exp.company || 'Company'}
                          </p>
                        </div>
                        <div 
                          className="px-6 py-3 rounded-full text-sm font-bold text-white shadow-lg"
                          style={{ backgroundColor: currentTheme.primary }}
                        >
                          {exp.startDate} - {exp.current ? 'Present' : exp.endDate}
                        </div>
                      </div>
                      {exp.description && (
                        <p className="text-gray-700 leading-relaxed text-lg">
                          {exp.description}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Academic Excellence */}
        {resumeData.education.length > 0 && (
          <div className="mb-10">
            <div className="flex items-center gap-4 mb-8">
              <div 
                className="w-2 h-12 rounded-full bg-linear-to-b"
                style={{ backgroundImage: `linear-gradient(to bottom, ${currentTheme.primary}, ${currentTheme.secondary})` }}
              />
              <h2 
                className="text-3xl font-bold"
                style={{ color: currentTheme.primary }}
              >
                ACADEMIC EXCELLENCE
              </h2>
            </div>
            
            <div className="grid gap-6">
              {resumeData.education.map((edu) => (
                <div 
                  key={edu.id}
                  className="bg-linear-to-r from-white via-gray-50 to-white p-8 rounded-xl shadow-lg border-t-8"
                  style={{ borderTopColor: currentTheme.accent }}
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 
                        className="text-2xl font-bold mb-2"
                        style={{ color: currentTheme.secondary }}
                      >
                        {edu.degree || 'Degree'} {edu.field && `in ${edu.field}`}
                      </h3>
                      <p className="text-xl font-semibold text-gray-700 mb-3">
                        {edu.institution || 'Institution'}
                      </p>
                      {edu.gpa && (
                        <div 
                          className="inline-block px-4 py-2 rounded-full text-sm font-bold shadow-lg"
                          style={{ backgroundColor: currentTheme.accent, color: 'white' }}
                        >
                          Cumulative GPA: {edu.gpa}
                        </div>
                      )}
                    </div>
                    <div 
                      className="px-6 py-3 rounded-full text-sm font-bold text-white"
                      style={{ backgroundColor: currentTheme.primary }}
                    >
                      {edu.startDate} - {edu.endDate}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Technical Mastery */}
        {resumeData.skills.length > 0 && (
          <div className="mb-10">
            <div className="flex items-center gap-4 mb-8">
              <div 
                className="w-2 h-12 rounded-full bg-linear-to-b"
                style={{ backgroundImage: `linear-gradient(to bottom, ${currentTheme.primary}, ${currentTheme.secondary})` }}
              />
              <h2 
                className="text-3xl font-bold"
                style={{ color: currentTheme.primary }}
              >
                TECHNICAL MASTERY
              </h2>
            </div>
            
            <div className="grid md:grid-cols-2 gap-8">
              {resumeData.skills.map((skill) => (
                <div 
                  key={skill.id}
                  className="bg-white p-8 rounded-xl shadow-lg border-4"
                  style={{ borderColor: currentTheme.accent }}
                >
                  <h3 
                    className="text-xl font-bold mb-6 text-center"
                    style={{ color: currentTheme.secondary }}
                  >
                    {skill.category}
                  </h3>
                  <div className="flex flex-wrap gap-3 justify-center">
                    {skill.items.map((item, index) => (
                      <span 
                        key={index}
                        className="px-4 py-2 rounded-full text-sm font-bold text-white shadow-lg transform hover:scale-105 transition-transform"
                        style={{ backgroundColor: currentTheme.primary }}
                      >
                        {item}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* AUT Excellence Seal */}
        <div 
          className="text-center py-8 rounded-xl shadow-lg relative overflow-hidden"
          style={{ backgroundColor: currentTheme.primary }}
        >
          <div className="absolute inset-0 bg-linear-to-r from-transparent via-white/10 to-transparent transform -skew-y-1"></div>
          <div className="relative z-10">
            <div className="text-white text-lg font-bold mb-2">
              American University of Technology
            </div>
            <div className="text-white/90 text-sm font-medium">
              Empowering Future Leaders • Driving Global Innovation • Building Tomorrow's Solutions
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}