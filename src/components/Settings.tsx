import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  User,
  Shield,
  Bell,
  Palette,
  Globe,
  Smartphone,
  Key,
  Download,
  Trash2,
  Eye,
  EyeOff,
  Check,
  X,
  Moon,
  Sun,
  Monitor,
  Mail,
  Phone,
  MapPin,
  Building2,
  Briefcase,
  GraduationCap,
  Save,
  Camera,
  Edit3,
  Settings as SettingsIcon
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import Button from './ui/Button';
import Input from './ui/Input';
import { Card } from './ui/Card';
import ThemeToggle from './ui/ThemeToggle';
import { cn } from '../lib/cva';

interface SettingsSection {
  id: string;
  title: string;
  icon: React.ComponentType<any>;
  description: string;
}

interface NotificationSettings {
  emailNotifications: boolean;
  pushNotifications: boolean;
  jobAlerts: boolean;
  messageNotifications: boolean;
  eventReminders: boolean;
  weeklyDigest: boolean;
}

interface PrivacySettings {
  profileVisibility: 'public' | 'private' | 'connections';
  showEmail: boolean;
  showPhone: boolean;
  allowDirectMessages: boolean;
  searchableProfile: boolean;
}

export default function SettingsPage() {
  const { user } = useAuth();
  const { isDark, setIsDark } = useTheme();
  const navigate = useNavigate();
  
  const [activeSection, setActiveSection] = useState('profile');
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);

  // Profile settings
  const [profileData, setProfileData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: '',
    location: '',
    company: '',
    position: '',
    bio: '',
    website: ''
  });

  // Notification settings
  const [notifications, setNotifications] = useState<NotificationSettings>({
    emailNotifications: true,
    pushNotifications: true,
    jobAlerts: true,
    messageNotifications: true,
    eventReminders: true,
    weeklyDigest: false
  });

  // Privacy settings
  const [privacy, setPrivacy] = useState<PrivacySettings>({
    profileVisibility: 'public',
    showEmail: false,
    showPhone: false,
    allowDirectMessages: true,
    searchableProfile: true
  });

  // Security settings
  const [security, setSecurity] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
    twoFactorEnabled: false
  });

  const settingsSections: SettingsSection[] = [
    {
      id: 'profile',
      title: 'Profile',
      icon: User,
      description: 'Manage your personal information and profile details'
    },
    {
      id: 'appearance',
      title: 'Appearance',
      icon: Palette,
      description: 'Customize the look and feel of your interface'
    },
    {
      id: 'notifications',
      title: 'Notifications',
      icon: Bell,
      description: 'Control how and when you receive notifications'
    },
    {
      id: 'privacy',
      title: 'Privacy',
      icon: Shield,
      description: 'Manage your privacy and data sharing preferences'
    },
    {
      id: 'security',
      title: 'Security',
      icon: Key,
      description: 'Password, two-factor authentication, and security settings'
    },
    {
      id: 'data',
      title: 'Data & Storage',
      icon: Download,
      description: 'Download your data and manage storage preferences'
    }
  ];

  const handleSave = async () => {
    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      setHasChanges(false);
      // Show success toast
    } catch (error) {
      console.error('Failed to save settings:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const renderProfileSettings = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Profile Information</h2>
          <p className={`${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
            Update your personal details and profile information
          </p>
        </div>
        <Button
          onClick={handleSave}
          disabled={!hasChanges || isLoading}
          className="bg-info-500 text-white hover:bg-info-600"
        >
          <Save className="h-4 w-4 mr-2" />
          {isLoading ? 'Saving...' : 'Save Changes'}
        </Button>
      </div>

      {/* Profile Photo */}
      <Card className={`p-6 ${isDark ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-200'}`}>
        <div className="flex items-center space-x-6">
          <div className="relative">
            <div className={`w-24 h-24 rounded-full flex items-center justify-center ${
              isDark ? 'bg-gray-800' : 'bg-gray-200'
            }`}>
              <User className="h-12 w-12" />
            </div>
            <Button
              size="sm"
              className="absolute -bottom-2 -right-2 w-8 h-8 rounded-full p-0 bg-info-500 text-white hover:bg-info-600"
            >
              <Camera className="h-4 w-4" />
            </Button>
          </div>
          <div>
            <h3 className="font-semibold text-lg">Profile Photo</h3>
            <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'} mb-2`}>
              Upload a professional photo to help others recognize you
            </p>
            <Button variant="outlined" size="sm">
              <Camera className="h-4 w-4 mr-2" />
              Change Photo
            </Button>
          </div>
        </div>
      </Card>

      {/* Basic Information */}
      <Card className={`p-6 ${isDark ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-200'}`}>
        <h3 className="font-semibold text-lg mb-4">Basic Information</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            label="Full Name"
            value={profileData.name}
            onChange={(e) => {
              setProfileData({...profileData, name: e.target.value});
              setHasChanges(true);
            }}
            placeholder="Enter your full name"
          />
          <Input
            label="Email"
            value={profileData.email}
            onChange={(e) => {
              setProfileData({...profileData, email: e.target.value});
              setHasChanges(true);
            }}
            placeholder="Enter your email"
            startIcon={<Mail className="h-4 w-4" />}
          />
          <Input
            label="Phone"
            value={profileData.phone}
            onChange={(e) => {
              setProfileData({...profileData, phone: e.target.value});
              setHasChanges(true);
            }}
            placeholder="Enter your phone number"
            startIcon={<Phone className="h-4 w-4" />}
          />
          <Input
            label="Location"
            value={profileData.location}
            onChange={(e) => {
              setProfileData({...profileData, location: e.target.value});
              setHasChanges(true);
            }}
            placeholder="City, Country"
            startIcon={<MapPin className="h-4 w-4" />}
          />
        </div>
      </Card>

      {/* Professional Information */}
      <Card className={`p-6 ${isDark ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-200'}`}>
        <h3 className="font-semibold text-lg mb-4">Professional Information</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            label="Company"
            value={profileData.company}
            onChange={(e) => {
              setProfileData({...profileData, company: e.target.value});
              setHasChanges(true);
            }}
            placeholder="Your current company"
            startIcon={<Building2 className="h-4 w-4" />}
          />
          <Input
            label="Position"
            value={profileData.position}
            onChange={(e) => {
              setProfileData({...profileData, position: e.target.value});
              setHasChanges(true);
            }}
            placeholder="Your job title"
            startIcon={<Briefcase className="h-4 w-4" />}
          />
        </div>
        <div className="mt-4">
          <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>
            Bio
          </label>
          <textarea
            value={profileData.bio}
            onChange={(e) => {
              setProfileData({...profileData, bio: e.target.value});
              setHasChanges(true);
            }}
            placeholder="Tell us about yourself..."
            rows={4}
            className={`w-full px-4 py-3 border rounded-lg resize-none ${
              isDark 
                ? 'bg-gray-800 border-gray-600 text-white placeholder-gray-400 focus:border-info-500' 
                : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500 focus:border-info-500'
            } focus:ring-2 focus:ring-info-500/20 outline-none transition-colors`}
          />
        </div>
      </Card>
    </div>
  );

  const renderAppearanceSettings = () => (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Appearance</h2>
        <p className={`${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
          Customize how Handshake looks and feels
        </p>
      </div>

      <Card className={`p-6 ${isDark ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-200'}`}>
        <h3 className="font-semibold text-lg mb-4">Theme</h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Color Theme</p>
              <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                Choose your preferred color scheme
              </p>
            </div>
            <ThemeToggle />
          </div>
          
          {/* Theme Options */}
          <div className="grid grid-cols-3 gap-4 mt-6">
            <button
              onClick={() => setIsDark(false)}
              className={cn(
                'p-4 border-2 rounded-xl transition-colors',
                !isDark 
                  ? 'border-info-500 bg-info-50 dark:bg-info-900/20' 
                  : 'border-gray-300 dark:border-gray-600 hover:border-info-400'
              )}
            >
              <div className="flex flex-col items-center space-y-2">
                <Sun className="h-8 w-8 text-yellow-500" />
                <span className="text-sm font-medium">Light</span>
              </div>
            </button>
            
            <button
              onClick={() => setIsDark(true)}
              className={cn(
                'p-4 border-2 rounded-xl transition-colors',
                isDark 
                  ? 'border-info-500 bg-info-50 dark:bg-info-900/20' 
                  : 'border-gray-300 dark:border-gray-600 hover:border-info-400'
              )}
            >
              <div className="flex flex-col items-center space-y-2">
                <Moon className="h-8 w-8 text-info-400" />
                <span className="text-sm font-medium">Dark</span>
              </div>
            </button>
            
            <button
              className="p-4 border-2 border-gray-300 dark:border-gray-600 rounded-xl hover:border-info-400 transition-colors opacity-50 cursor-not-allowed"
              disabled
            >
              <div className="flex flex-col items-center space-y-2">
                <Monitor className="h-8 w-8 text-gray-500" />
                <span className="text-sm font-medium">System</span>
                <span className="text-xs text-gray-400">Coming Soon</span>
              </div>
            </button>
          </div>
        </div>
      </Card>
    </div>
  );

  const renderNotificationSettings = () => (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Notifications</h2>
        <p className={`${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
          Manage how and when you receive notifications
        </p>
      </div>

      <Card className={`p-6 ${isDark ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-200'}`}>
        <h3 className="font-semibold text-lg mb-4">Notification Preferences</h3>
        <div className="space-y-4">
          {Object.entries({
            emailNotifications: 'Email Notifications',
            pushNotifications: 'Push Notifications',
            jobAlerts: 'Job Alerts',
            messageNotifications: 'Message Notifications',
            eventReminders: 'Event Reminders',
            weeklyDigest: 'Weekly Digest'
          }).map(([key, label]) => (
            <div key={key} className="flex items-center justify-between">
              <div>
                <p className="font-medium">{label}</p>
                <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                  Receive {label.toLowerCase()} via your preferred method
                </p>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  setNotifications({...notifications, [key]: !notifications[key as keyof NotificationSettings]});
                  setHasChanges(true);
                }}
                className={cn(
                  'w-12 h-6 rounded-full transition-colors',
                  notifications[key as keyof NotificationSettings]
                    ? 'bg-info-500 text-white'
                    : 'bg-gray-300 dark:bg-gray-600'
                )}
              >
                <div className={cn(
                  'w-4 h-4 rounded-full bg-white transition-transform',
                  notifications[key as keyof NotificationSettings] ? 'translate-x-3' : 'translate-x-0'
                )} />
              </Button>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );

  // ...existing code for other render methods...

  const renderMainContent = () => {
    switch (activeSection) {
      case 'profile':
        return renderProfileSettings();
      case 'appearance':
        return renderAppearanceSettings();
      case 'notifications':
        return renderNotificationSettings();
      case 'privacy':
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold">Privacy Settings</h2>
            <p className={`${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
              Control who can see your information and how your data is used
            </p>
            {/* Privacy settings content */}
          </div>
        );
      case 'security':
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold">Security</h2>
            <p className={`${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
              Manage your password and security preferences
            </p>
            {/* Security settings content */}
          </div>
        );
      case 'data':
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold">Data & Storage</h2>
            <p className={`${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
              Download your data and manage storage settings
            </p>
            {/* Data settings content */}
          </div>
        );
      default:
        return renderProfileSettings();
    }
  };

  return (
    <div className={`min-h-screen ${isDark ? 'bg-black text-white' : 'bg-white text-black'}`}>
      {/* Header */}
      <div className={`sticky top-0 z-10 backdrop-blur-xl border-b ${
        isDark ? 'bg-black/80 border-gray-800' : 'bg-white/80 border-gray-200'
      }`}>
        <div className="max-w-7xl mx-auto flex items-center justify-between px-4 py-4">
          <div className="flex items-center space-x-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate(-1)}
              className="p-2"
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div>
              <h1 className="text-xl font-bold">Settings</h1>
              <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                Manage your account and preferences
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto flex">
        {/* Sidebar */}
        <div className="w-80 p-6 space-y-2">
          {settingsSections.map((section) => {
            const Icon = section.icon;
            const isActive = activeSection === section.id;
            
            return (
              <button
                key={section.id}
                onClick={() => setActiveSection(section.id)}
                className={cn(
                  'w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-colors text-left',
                  isActive
                    ? isDark 
                      ? 'bg-gray-900 text-white' 
                      : 'bg-gray-100 text-black'
                    : isDark 
                      ? 'hover:bg-gray-900/50 text-gray-300' 
                      : 'hover:bg-gray-100/50 text-gray-700'
                )}
              >
                <Icon className="h-5 w-5 flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="font-medium truncate">{section.title}</p>
                  <p className={`text-xs mt-1 truncate ${
                    isDark ? 'text-gray-400' : 'text-gray-600'
                  }`}>
                    {section.description}
                  </p>
                </div>
              </button>
            );
          })}
        </div>

        {/* Main Content */}
        <div className="flex-1 p-6">
          {renderMainContent()}
        </div>
      </div>
    </div>
  );
}