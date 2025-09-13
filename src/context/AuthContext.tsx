import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User as SupabaseUser } from '@supabase/supabase-js';
import { supabase } from '../lib/supabase';

interface UserProfile {
  id: string;
  username: string;
  full_name: string | null;
  bio: string | null;
  avatar_url: string | null;
  website: string | null;
  role: 'student' | 'employer' | 'admin';
  company_name?: string | null;
  title?: string | null;
  location?: string | null;
  verified?: boolean;
  created_at: string;
  updated_at: string;
}

interface User {
  id: string;
  email: string;
  role: 'student' | 'employer' | 'admin';
  profile: UserProfile;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string, role?: 'student' | 'employer') => Promise<void>;
  register: (email: string, password: string, role: 'student' | 'employer', fullName?: string) => Promise<void>;
  logout: () => Promise<void>;
  updateProfile: (profile: Partial<UserProfile>) => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    
    // Add timeout to prevent endless loading
    const loadingTimeout = setTimeout(() => {
      if (mounted) {
        console.warn('Auth loading timeout - forcing loading to false');
        setLoading(false);
      }
    }, 10000); // 10 second timeout

    // Get initial session
    const initializeAuth = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error('Error getting session:', error);
          if (mounted) {
            setLoading(false);
          }
          return;
        }

        if (session?.user && mounted) {
          await loadUserProfile(session.user);
        } else if (mounted) {
          setLoading(false);
        }
      } catch (error) {
        console.error('Error initializing auth:', error);
        if (mounted) {
          setLoading(false);
        }
      }
    };

    initializeAuth();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (!mounted) return;
        
        try {
          if (event === 'SIGNED_IN' && session?.user) {
            await loadUserProfile(session.user);
          } else if (event === 'SIGNED_OUT') {
            setUser(null);
            setLoading(false);
          }
        } catch (error) {
          console.error('Error in auth state change:', error);
          setLoading(false);
        }
      }
    );

    return () => {
      mounted = false;
      clearTimeout(loadingTimeout);
      subscription.unsubscribe();
    };
  }, []);

  const loadUserProfile = async (supabaseUser: SupabaseUser) => {
    try {
      setLoading(true);
      
      // Add timeout for profile loading
      const profileTimeout = new Promise((_, reject) => {
        setTimeout(() => reject(new Error('Profile loading timeout')), 5000);
      });

      const profilePromise = supabase
        .from('profiles')
        .select('*')
        .eq('id', supabaseUser.id)
        .single();

      const { data: profile, error } = await Promise.race([profilePromise, profileTimeout]) as any;

      if (error && error.code !== 'PGRST116') { // PGRST116 is "no rows returned"
        throw error;
      }

      if (profile) {
        // Profile exists, use it
        const user: User = {
          id: supabaseUser.id,
          email: supabaseUser.email!,
          role: profile.role || 'student',
          profile: profile
        };
        setUser(user);
      } else {
        // Profile doesn't exist, create a basic one
        const newProfile = {
          id: supabaseUser.id,
          username: supabaseUser.email?.split('@')[0] || '',
          full_name: supabaseUser.user_metadata?.full_name || null,
          bio: null,
          avatar_url: null,
          website: null,
          role: 'student' as const,
          company_name: null,
          title: null,
          location: null,
          verified: false,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        };

        const { data: createdProfile, error: createError } = await supabase
          .from('profiles')
          .insert([newProfile])
          .select()
          .single();

        if (createError) throw createError;

        const user: User = {
          id: supabaseUser.id,
          email: supabaseUser.email!,
          role: createdProfile.role || 'student',
          profile: createdProfile
        };
        setUser(user);
      }
    } catch (error) {
      console.error('Error loading user profile:', error);
      // Don't leave user in endless loading state
      // Set a basic user object if we have the supabase user
      if (supabaseUser?.email) {
        const basicUser: User = {
          id: supabaseUser.id,
          email: supabaseUser.email,
          role: 'student',
          profile: {
            id: supabaseUser.id,
            username: supabaseUser.email.split('@')[0],
            full_name: supabaseUser.user_metadata?.full_name || null,
            bio: null,
            avatar_url: null,
            website: null,
            role: 'student',
            company_name: null,
            title: null,
            location: null,
            verified: false,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          }
        };
        setUser(basicUser);
      }
    } finally {
      setLoading(false);
    }
  };

  const login = async (email: string, password: string, role?: 'student' | 'employer') => {
    setLoading(true);
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        // Handle specific error cases
        if (error.message.includes('Invalid login credentials')) {
          throw new Error('Invalid email or password. Please check your credentials and try again.');
        } else if (error.message.includes('Email not confirmed')) {
          throw new Error('Please check your email and click the confirmation link before signing in.');
        } else {
          throw new Error(error.message);
        }
      }

      if (data.user) {
        // If role is specified, update the profile with the role
        if (role) {
          await supabase
            .from('profiles')
            .update({ role })
            .eq('id', data.user.id);
        }
        
        await loadUserProfile(data.user);
      }
    } catch (error) {
      setLoading(false);
      throw error;
    }
  };

  const register = async (email: string, password: string, role: 'student' | 'employer', fullName?: string) => {
    setLoading(true);
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName,
            role: role
          }
        }
      });

      if (error) {
        if (error.message.includes('User already registered')) {
          throw new Error('An account with this email already exists. Please sign in instead.');
        } else if (error.message.includes('Password should be at least 6 characters')) {
          throw new Error('Password must be at least 6 characters long.');
        } else {
          throw new Error(error.message);
        }
      }

      if (data.user) {
        // Create profile with role information
        const profileData = {
          id: data.user.id,
          username: email.split('@')[0],
          full_name: fullName || null,
          bio: null,
          avatar_url: null,
          website: null,
          role: role,
          company_name: role === 'employer' ? null : null,
          title: null,
          location: null,
          verified: false,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        };

        const { error: profileError } = await supabase
          .from('profiles')
          .insert([profileData]);

        if (profileError) {
          console.error('Error creating profile:', profileError);
          // Don't throw here as the user account was created successfully
        }

        // If email confirmation is enabled, user won't be signed in automatically
        if (!data.session) {
          throw new Error('Please check your email and click the confirmation link to complete your registration.');
        }
      }
    } catch (error) {
      setLoading(false);
      throw error;
    }
  };

  const logout = async () => {
    setLoading(true);
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      setUser(null);
    } catch (error) {
      console.error('Error signing out:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateProfile = async (profileData: Partial<UserProfile>) => {
    if (!user) throw new Error('No user logged in');

    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('profiles')
        .update({
          ...profileData,
          updated_at: new Date().toISOString()
        })
        .eq('id', user.id)
        .select()
        .single();

      if (error) throw error;

      // Update local user state
      setUser({
        ...user,
        profile: data
      });
    } catch (error) {
      console.error('Error updating profile:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const resetPassword = async (email: string) => {
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    });

    if (error) {
      throw new Error(error.message);
    }
  };

  const value = {
    user,
    loading,
    login,
    register,
    logout,
    updateProfile,
    resetPassword
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