import React from 'react';
import { ResumeData, ColorTheme } from './types';
import { 
  ModernTemplate, 
  ClassicTemplate, 
  MinimalTemplate, 
  ProfessionalTemplate, 
  CreativeTemplate, 
  AUTSpecialTemplate 
} from './templates';

interface ResumePreviewProps {
  resumeData: ResumeData;
  selectedTemplate: string;
  currentTheme: ColorTheme;
  resumeRef: React.RefObject<HTMLDivElement>;
  isVisualEditMode?: boolean;
  onEditElement?: (elementType: string, elementId: string, field: string, value: string) => void;
  editingElement?: string | null;
}

export function ResumePreview({ 
  resumeData, 
  selectedTemplate, 
  currentTheme, 
  resumeRef,
  isVisualEditMode = false,
  onEditElement,
  editingElement
}: ResumePreviewProps) {
  
  const renderTemplate = () => {
    const templateProps = {
      resumeData,
      currentTheme,
      isVisualEditMode,
      onEditElement,
      editingElement
    };

    switch (selectedTemplate) {
      case 'modern':
        return <ModernTemplate {...templateProps} />;
      case 'classic':
        return <ClassicTemplate {...templateProps} />;
      case 'minimal':
        return <MinimalTemplate {...templateProps} />;
      case 'professional':
        return <ProfessionalTemplate {...templateProps} />;
      case 'creative':
        return <CreativeTemplate {...templateProps} />;
      case 'aut-special':
        return <AUTSpecialTemplate {...templateProps} />;
      default:
        return <ModernTemplate {...templateProps} />;
    }
  };

  return (
    <div 
      ref={resumeRef}
      className={`bg-white w-full max-w-[210mm] mx-auto shadow-lg ${
        isVisualEditMode ? 'ring-2 ring-info-500 ring-opacity-50' : ''
      }`}
      style={{ 
        minHeight: '297mm',
        fontFamily: 'Arial, sans-serif',
        color: currentTheme.text,
      }}
    >
      {isVisualEditMode && (
        <div className="absolute top-2 right-2 z-10 bg-info-500 text-white px-3 py-1 rounded-full text-xs font-medium">
          Visual Edit Mode
        </div>
      )}
      {renderTemplate()}
    </div>
  );
}