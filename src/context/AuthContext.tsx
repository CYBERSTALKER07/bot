import { createContext, useContext, useState, ReactNode } from 'react';

interface User {
  id: string;
  email: string;
  role: 'student' | 'employer' | 'admin';
  profile: {
    full_name: string;
    avatar_url?: string;
    website?: string;
  };
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string, role: 'student' | 'employer') => Promise<void>;
  register: (email: string, password: string, role: 'student' | 'employer') => Promise<void>;
  logout: () => void;
  updateProfile: (profile: Partial<User['profile']>) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(false);

  const login = async (email: string, password: string, role: 'student' | 'employer') => {
    setLoading(true);
    try {
      // Check for admin credentials first
      if (email === 'admin@aut.edu' && password === 'admin123') {
        const adminUser: User = {
          id: 'admin-001',
          email: 'admin@aut.edu',
          role: 'admin',
          profile: {
            full_name: 'System Administrator',
            avatar_url: undefined,
            website: undefined
          }
        };
        setUser(adminUser);
        return;
      }

      // Demo student credentials
      if (email === 'student@aut.edu' && password === 'password123' && role === 'student') {
        const studentUser: User = {
          id: 'student-001',
          email: 'student@aut.edu',
          role: 'student',
          profile: {
            full_name: 'John Doe',
            avatar_url: undefined,
            website: undefined
          }
        };
        setUser(studentUser);
        return;
      }

      // Demo employer credentials
      if (email === 'employer@intel.com' && password === 'password123' && role === 'employer') {
        const employerUser: User = {
          id: 'employer-001',
          email: 'employer@intel.com',
          role: 'employer',
          profile: {
            full_name: 'Jane Smith',
            avatar_url: undefined,
            website: undefined
          }
        };
        setUser(employerUser);
        return;
      }

      // If no demo credentials match, throw error
      throw new Error('Invalid credentials. Please check your email and password.');
    } finally {
      setLoading(false);
    }
  };

  const register = async (email: string, _password: string, role: 'student' | 'employer') => {
    setLoading(true);
    try {
      // Create new user based on role
      const newUser: User = role === 'student' 
        ? {
            id: `student-${Date.now()}`,
            email,
            role: 'student',
            profile: {
              full_name: 'New Student',
              avatar_url: undefined,
              website: undefined
            }
          }
        : {
            id: `employer-${Date.now()}`,
            email,
            role: 'employer',
            profile: {
              full_name: 'New Employer',
              avatar_url: undefined,
              website: undefined
            }
          };
      
      setUser(newUser);
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
  };

  const updateProfile = async (profileData: Partial<User['profile']>) => {
    if (!user) return;
    
    setUser({
      ...user,
      profile: {
        ...user.profile,
        ...profileData
      }
    });
  };

  const value = {
    user,
    loading,
    login,
    register,
    logout,
    updateProfile
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}