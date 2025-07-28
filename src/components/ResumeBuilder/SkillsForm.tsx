import { Plus, Trash2, Award } from 'lucide-react';
import Button from '../ui/Button';
import { useTheme } from '../../context/ThemeContext';
import { cn } from '../../lib/cva';
import { ResumeData } from './types';

interface SkillsFormProps {
  resumeData: ResumeData;
  addSkillCategory: () => void;
  updateSkillCategory: (id: string, category: string) => void;
  updateSkillItems: (id: string, items: string) => void;
  removeSkillCategory: (id: string) => void;
}

export function SkillsForm({ 
  resumeData, 
  addSkillCategory, 
  updateSkillCategory, 
  updateSkillItems,
  removeSkillCategory 
}: SkillsFormProps) {
  const { isDark } = useTheme();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-bold">Skills</h3>
        <Button onClick={addSkillCategory} size="small" className="flex items-center gap-2 bg-blue-500 text-white rounded-full px-4">
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
                "flex-1 px-4 py-3 rounded-xl border transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500",
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
              "w-full px-4 py-3 rounded-xl border transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none",
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
}