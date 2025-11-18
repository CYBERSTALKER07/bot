import { Plus, Trash2, Briefcase } from 'lucide-react';
import Button from '../ui/Button';
import { useTheme } from '../../context/ThemeContext';
import { cn } from '../../lib/cva';
import { ResumeData } from './types';

interface ExperienceFormProps {
  resumeData: ResumeData;
  addExperience: () => void;
  updateExperience: (id: string, field: string, value: string | boolean) => void;
  removeExperience: (id: string) => void;
}

export function ExperienceForm({ 
  resumeData, 
  addExperience, 
  updateExperience, 
  removeExperience 
}: ExperienceFormProps) {
  const { isDark } = useTheme();

  return (
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
                  "px-4 py-3 rounded-xl border transition-all duration-200",
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
                  "px-4 py-3 rounded-xl border transition-all duration-200",
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
                  "px-4 py-3 rounded-xl border transition-all duration-200",
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
                    "flex-1 px-4 py-3 rounded-xl border transition-all duration-200",
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
                    className="w-4 h-4 text-info-600 bg-gray-100 border-gray-300 rounded"
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
              "w-full px-4 py-3 rounded-xl border transition-all duration-200 resize-none",
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
}