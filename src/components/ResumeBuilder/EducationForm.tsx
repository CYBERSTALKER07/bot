import { Plus, Trash2, GraduationCap } from 'lucide-react';
import Button from '../ui/Button';
import { useTheme } from '../../context/ThemeContext';
import { cn } from '../../lib/cva';
import { ResumeData } from './types';

interface EducationFormProps {
  resumeData: ResumeData;
  addEducation: () => void;
  updateEducation: (id: string, field: string, value: string) => void;
  removeEducation: (id: string) => void;
}

export function EducationForm({ 
  resumeData, 
  addEducation, 
  updateEducation, 
  removeEducation 
}: EducationFormProps) {
  const { isDark } = useTheme();

  return (
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
}