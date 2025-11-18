import { Palette, ChevronDown, Layers } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import { cn } from '../../lib/cva';
import { colorThemes, ColorTheme } from './types';
import { useState } from 'react';

const templates = [
  {
    id: 'modern',
    name: 'Modern',
    description: 'Clean and contemporary design',
    colors: {
      primary: '#8C1D40', // ASU Maroon
      secondary: '#FFC627', // ASU Gold  
      accent: '#78BE20', // ASU Green
      text: '#191919'
    }
  },
  {
    id: 'professional', 
    name: 'Professional',
    description: 'Executive-style with sidebar layout',
    colors: {
      primary: '#8C1D40', // ASU Maroon
      secondary: '#FFC627', // ASU Gold
      accent: '#78BE20', // ASU Green  
      text: '#191919'
    }
  },
  {
    id: 'creative',
    name: 'Creative',
    description: 'Bold and expressive design',
    colors: {
      primary: '#8C1D40', // ASU Maroon
      secondary: '#FFC627', // ASU Gold
      accent: '#FF6B35', // ASU Orange
      text: '#191919'
    }
  },
  {
    id: 'aut-special',
    name: 'AUT Special',
    description: 'American University of Technology themed template',
    colors: {
      primary: '#1B365D', // AUT Navy Blue
      secondary: '#00A9CE', // AUT Light Blue
      accent: '#E6002B', // AUT Red
      text: '#333333'
    }
  }
];

interface TemplateSelectorProps {
  selectedTemplate: string;
  setSelectedTemplate: (templateId: string) => void;
  selectedTheme: number;
  setSelectedTheme: (themeIndex: number) => void;
}

export function TemplateSelector({ 
  selectedTemplate, 
  setSelectedTemplate, 
  selectedTheme, 
  setSelectedTheme 
}: TemplateSelectorProps) {
  const { isDark } = useTheme();
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="relative">
      {/* Collapsed View - Only Icon */}
      <div 
        className={cn(
          'rounded-2xl p-4 border cursor-pointer transition-all duration-300',
          isDark ? 'bg-black border-gray-800 text-white hover:border-gray-700' : 'bg-white border-gray-200 text-black hover:border-gray-300'
        )}
        onMouseEnter={() => setIsExpanded(true)}
        onMouseLeave={() => setIsExpanded(false)}
      >
        {/* Icon and Current Selection */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className={cn(
              "p-2 rounded-xl transition-colors",
              isDark ? 'bg-gray-800' : 'bg-gray-100'
            )}>
              <Layers className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-sm font-semibold">Templates & Colors</h3>
              <p className={cn(
                "text-xs",
                isDark ? 'text-gray-400' : 'text-gray-500'
              )}>
                {templates.find(t => t.id === selectedTemplate)?.name} • {colorThemes[selectedTheme]?.name}
              </p>
            </div>
          </div>
          <ChevronDown className={cn(
            "h-4 w-4 transition-transform duration-300",
            isExpanded ? 'rotate-180' : 'rotate-0'
          )} />
        </div>

        {/* Expanded Content */}
        <div className={cn(
          'overflow-hidden transition-all duration-300 ease-in-out',
          isExpanded ? 'max-h-96 opacity-100 mt-4' : 'max-h-0 opacity-0'
        )}>
          <div className="space-y-6">
            {/* Template Selection */}
            <div>
              <h4 className={cn(
                "text-sm font-medium mb-3",
                isDark ? 'text-gray-300' : 'text-gray-700'
              )}>Templates</h4>
              <div className="grid grid-cols-2 gap-2">
                {templates.map((template) => (
                  <button
                    key={template.id}
                    onClick={() => setSelectedTemplate(template.id)}
                    className={cn(
                      "w-full p-2 rounded-lg text-left transition-all duration-200 text-xs border",
                      selectedTemplate === template.id
                        ? 'text-white shadow-md border-info-500 bg-info-500'
                        : isDark 
                          ? 'bg-gray-900 border-gray-700 text-white hover:bg-gray-800'
                          : 'bg-gray-50 border-gray-300 text-black hover:bg-gray-100'
                    )}
                  >
                    <div className="font-medium">{template.name}</div>
                    <div className={cn(
                      "text-xs mt-1 opacity-80",
                      selectedTemplate === template.id 
                        ? 'text-info-100' 
                        : isDark ? 'text-gray-400' : 'text-gray-500'
                    )}>
                      {template.description}
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Color Theme Selection */}
            <div>
              <h4 className={cn(
                "text-sm font-medium mb-3 flex items-center gap-2",
                isDark ? 'text-gray-300' : 'text-gray-700'
              )}>
                <Palette className="w-4 h-4" />
                Colors
              </h4>
              <div className="grid grid-cols-2 gap-2">
                {colorThemes.map((theme, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedTheme(index)}
                    className={cn(
                      "p-2 rounded-lg text-left transition-all duration-200 border",
                      selectedTheme === index
                        ? 'border-2 shadow-md border-info-500'
                        : isDark 
                          ? 'bg-gray-900 border-gray-700 hover:bg-gray-800'
                          : 'bg-gray-50 border-gray-300 hover:bg-gray-100'
                    )}
                  >
                    <div className="flex items-center space-x-1 mb-1">
                      <div 
                        className="w-3 h-3 rounded-full" 
                        style={{ backgroundColor: theme.primary }}
                      />
                      <div 
                        className="w-3 h-3 rounded-full" 
                        style={{ backgroundColor: theme.secondary }}
                      />
                      <div 
                        className="w-3 h-3 rounded-full" 
                        style={{ backgroundColor: theme.accent }}
                      />
                    </div>
                    <div className={cn(
                      "text-xs font-medium",
                      isDark ? 'text-white' : 'text-black'
                    )}>
                      {theme.name}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}