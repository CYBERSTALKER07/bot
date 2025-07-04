import React, { createContext, useContext, useState, ReactNode } from 'react';
import { User } from '../types';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string, role: 'student' | 'employer') => Promise<void>;
  logout: () => Promise<void>;
  register: (email: string, password: string, role: 'student' | 'employer') => Promise<void>;
  updateProfile: (profile: any) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  // Start with no user - users must log in to access protected routes
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(false);

  const login = async (email: string, password: string, role: 'student' | 'employer') => {
    setLoading(true);
    // Simulate login delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Set static user based on role
    if (role === 'student') {
      setUser({
        id: 'demo-student-1',
        email: email,
        role: 'student',
        profile: {
          id: 'demo-student-1',
          username: email.split('@')[0],
          full_name: 'Demo Student',
          bio: 'Computer Science student at AUT',
          avatar_url: null,
          website: null
        }
      });
    } else {
      setUser({
        id: 'demo-employer-1',
        email: email,
        role: 'employer',
        profile: {
          id: 'demo-employer-1',
          username: email.split('@')[0],
          full_name: 'Demo Employer',
          bio: 'HR Manager at Tech Company',
          avatar_url: null,
          website: null
        }
      });
    }
    setLoading(false);
  };

  const logout = async () => {
    setUser(null);
  };

  const register = async (email: string, password: string, role: 'student' | 'employer') => {
    setLoading(true);
    // Simulate registration delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Set static user based on role
    if (role === 'student') {
      setUser({
        id: 'demo-student-new',
        email: email,
        role: 'student',
        profile: {
          id: 'demo-student-new',
          username: email.split('@')[0],
          full_name: 'New Student',
          bio: 'New AUT student',
          avatar_url: null,
          website: null
        }
      });
    } else {
      setUser({
        id: 'demo-employer-new',
        email: email,
        role: 'employer',
        profile: {
          id: 'demo-employer-new',
          username: email.split('@')[0],
          full_name: 'New Employer',
          bio: 'New employer partner',
          avatar_url: null,
          website: null
        }
      });
    }
    setLoading(false);
  };

  const updateProfile = async (profileData: any) => {
    if (!user) throw new Error('No user logged in');
    
    setUser({
      ...user,
      profile: {
        ...user.profile,
        ...profileData
      }
    });
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, register, updateProfile }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}