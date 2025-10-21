import { createContext, useContext, useState, useEffect, ReactNode, useCallback, useRef } from 'react';
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
  signIn: (email: string, password: string) => Promise<{ error: Error | null }>;
  signUp: (email: string, password: string, options?: { full_name?: string; username?: string; role?: 'student' | 'employer' }) => Promise<{ error: Error | null }>;
  signOut: () => Promise<void>;
  updateProfile: (profile: Partial<UserProfile>) => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

// Cache for profile data to avoid redundant queries
const profileCache = new Map<string, UserProfile>();

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const authInitializedRef = useRef(false);

  const loadUserProfile = useCallback(async (supabaseUser: SupabaseUser, skipCache = false) => {
    try {
      // Check cache first
      if (!skipCache && profileCache.has(supabaseUser.id)) {
        const cachedProfile = profileCache.get(supabaseUser.id)!;
        const user: User = {
          id: supabaseUser.id,
          email: supabaseUser.email!,
          role: cachedProfile.role || 'student',
          profile: cachedProfile
        };
        setUser(user);
        setLoading(false);
        return;
      }

      // Fetch profile from profiles table with timeout
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 8000); // 8 second timeout

      const { data: profile, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', supabaseUser.id)
        .single();

      clearTimeout(timeoutId);

      if (error && error.code !== 'PGRST116') {
        console.error('Error loading profile:', error);
      }

      if (profile) {
        // Cache the profile
        profileCache.set(supabaseUser.id, profile);
        const user: User = {
          id: supabaseUser.id,
          email: supabaseUser.email!,
          role: profile.role || 'student',
          profile: profile
        };
        setUser(user);
      } else {
        // Create profile if it doesn't exist - this shouldn't happen after signup optimization
        const newProfile: UserProfile = {
          id: supabaseUser.id,
          username: supabaseUser.email?.split('@')[0] || '',
          full_name: supabaseUser.user_metadata?.full_name || null,
          bio: null,
          avatar_url: null,
          website: null,
          role: (supabaseUser.user_metadata?.role || 'student') as 'student' | 'employer' | 'admin',
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

        if (createError) {
          console.error('Error creating profile:', createError);
          // Use local profile data even if DB fails
          profileCache.set(supabaseUser.id, newProfile);
          const basicUser: User = {
            id: supabaseUser.id,
            email: supabaseUser.email!,
            role: 'student',
            profile: newProfile
          };
          setUser(basicUser);
        } else if (createdProfile) {
          profileCache.set(supabaseUser.id, createdProfile);
          const user: User = {
            id: supabaseUser.id,
            email: supabaseUser.email!,
            role: createdProfile.role || 'student',
            profile: createdProfile
          };
          setUser(user);
        }
      }
    } catch (error) {
      console.error('Error in loadUserProfile:', error);
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    // Only run initialization once per page load
    if (authInitializedRef.current) {
      setLoading(false);
      return;
    }

    authInitializedRef.current = true;

    // Check active sessions and sets the user
    const initAuth = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (session?.user) {
          await loadUserProfile(session.user);
        } else {
          setLoading(false);
        }
      } catch (error) {
        console.error('Error initializing auth:', error);
        setLoading(false);
      }
    };

    initAuth();

    // Listen for changes on auth state (logged in, signed out, etc.)
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
      if (session?.user) {
        await loadUserProfile(session.user);
      } else {
        setUser(null);
        setLoading(false);
        // Clear cache on logout
        profileCache.clear();
        authInitializedRef.current = false;
      }
    });

    return () => subscription.unsubscribe();
  }, [loadUserProfile]);

  const createProfileForNewUser = async (
    userId: string,
    email: string,
    metadata: { full_name?: string; username?: string; role?: 'student' | 'employer' }
  ): Promise<UserProfile | null> => {
    try {
      const newProfile: UserProfile = {
        id: userId,
        username: metadata.username || email.split('@')[0],
        full_name: metadata.full_name || null,
        bio: null,
        avatar_url: null,
        website: null,
        role: (metadata.role || 'student') as 'student' | 'employer' | 'admin',
        company_name: null,
        title: null,
        location: null,
        verified: false,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };

      const { data: createdProfile, error } = await supabase
        .from('profiles')
        .insert([newProfile])
        .select()
        .single();

      if (error) {
        console.error('Error creating profile:', error);
        return null;
      }

      profileCache.set(userId, createdProfile);
      return createdProfile;
    } catch (error) {
      console.error('Error in createProfileForNewUser:', error);
      return null;
    }
  };

  const signIn = async (email: string, password: string): Promise<{ error: Error | null }> => {
    try {
      setLoading(true);
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        setLoading(false);
        return { error: new Error(error.message) };
      }

      if (data.user) {
        await loadUserProfile(data.user, true);
        return { error: null };
      }

      setLoading(false);
      return { error: new Error('Sign in failed. Please try again.') };
    } catch (error) {
      setLoading(false);
      return { error: error as Error };
    }
  };

  const signUp = async (
    email: string, 
    password: string, 
    options?: { full_name?: string; username?: string; role?: 'student' | 'employer' }
  ): Promise<{ error: Error | null }> => {
    try {
      setLoading(true);
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: options?.full_name || '',
            username: options?.username || email.split('@')[0],
            role: options?.role || 'student'
          }
        }
      });

      if (error) {
        setLoading(false);
        return { error: new Error(error.message) };
      }

      if (data.user) {
        // Create profile immediately after successful signup
        const profile = await createProfileForNewUser(data.user.id, email, {
          full_name: options?.full_name,
          username: options?.username,
          role: options?.role
        });

        if (data.session && profile) {
          // Auto-login successful
          const user: User = {
            id: data.user.id,
            email: data.user.email!,
            role: profile.role || 'student',
            profile: profile
          };
          setUser(user);
        } else if (!data.session) {
          // Email confirmation required
          setLoading(false);
          return { error: new Error('Please check your email to confirm your account.') };
        }
      }

      return { error: null };
    } catch (error) {
      setLoading(false);
      return { error: error as Error };
    } finally {
      setLoading(false);
    }
  };

  const signOut = async () => {
    try {
      setLoading(true);
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      setUser(null);
      profileCache.clear();
      authInitializedRef.current = false;
    } catch (error) {
      console.error('Error signing out:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const updateProfile = async (profileData: Partial<UserProfile>) => {
    if (!user) throw new Error('No user logged in');

    try {
      setLoading(true);
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

      // Update cache
      profileCache.set(user.id, data);
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
    signIn,
    signUp,
    signOut,
    updateProfile,
    resetPassword
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export { AuthContext };
export type { AuthContextType, User, UserProfile };

// eslint-disable-next-line react-refresh/only-export-components
export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}