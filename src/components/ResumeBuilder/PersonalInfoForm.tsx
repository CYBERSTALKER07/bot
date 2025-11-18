import { Plus, Trash2, User } from 'lucide-react';
import Button from '../ui/Button';
import { useTheme } from '../../context/ThemeContext';
import { cn } from '../../lib/cva';
import { ResumeData } from './types';

interface PersonalInfoFormProps {
  resumeData: ResumeData;
  updatePersonalInfo: (field: string, value: string) => void;
}

export function PersonalInfoForm({ resumeData, updatePersonalInfo }: PersonalInfoFormProps) {
  const { isDark } = useTheme();

  return (
    <div className="space-y-6">
      <h3 className="text-xl font-bold mb-6">Personal Information</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <input
          type="text"
          placeholder="Full Name"
          value={resumeData.personalInfo.fullName}
          onChange={(e) => updatePersonalInfo('fullName', e.target.value)}
          className={cn(
            "px-4 py-3 rounded-xl border transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-info-500",
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
            "px-4 py-3 rounded-xl border transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-info-500",
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
            "px-4 py-3 rounded-xl border transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-info-500",
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
            "px-4 py-3 rounded-xl border transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-info-500",
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
            "px-4 py-3 rounded-xl border transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-info-500",
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
            "px-4 py-3 rounded-xl border transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-info-500",
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
          "w-full px-4 py-3 rounded-xl border transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-info-500 resize-none",
          isDark 
            ? 'bg-gray-800 border-gray-700 text-white placeholder-gray-400' 
            : 'bg-white border-gray-200 text-gray-900 placeholder-gray-500'
        )}
      />
    </div>
  );
}