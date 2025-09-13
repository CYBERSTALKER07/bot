export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          username: string;
          full_name: string | null;
          bio: string | null;
          avatar_url: string | null;
          website: string | null;
          role: 'student' | 'employer' | 'admin';
          company_name: string | null;
          title: string | null;
          location: string | null;
          verified: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          username: string;
          full_name?: string | null;
          bio?: string | null;
          avatar_url?: string | null;
          website?: string | null;
          role: 'student' | 'employer' | 'admin';
          company_name?: string | null;
          title?: string | null;
          location?: string | null;
          verified?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          username?: string;
          full_name?: string | null;
          bio?: string | null;
          avatar_url?: string | null;
          website?: string | null;
          role?: 'student' | 'employer' | 'admin';
          company_name?: string | null;
          title?: string | null;
          location?: string | null;
          verified?: boolean;
          created_at?: string;
          updated_at?: string;
        };
      };
      posts: {
        Row: {
          id: string;
          user_id: string;
          content: string | null;
          image_url: string | null;
          video_url: string | null;
          media_type: string;
          visibility: string;
          tags: string[] | null;
          location: string | null;
          likes_count: number;
          comments_count: number;
          shares_count: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          content?: string | null;
          image_url?: string | null;
          video_url?: string | null;
          media_type?: string;
          visibility?: string;
          tags?: string[] | null;
          location?: string | null;
          likes_count?: number;
          comments_count?: number;
          shares_count?: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          content?: string | null;
          image_url?: string | null;
          video_url?: string | null;
          media_type?: string;
          visibility?: string;
          tags?: string[] | null;
          location?: string | null;
          likes_count?: number;
          comments_count?: number;
          shares_count?: number;
          created_at?: string;
          updated_at?: string;
        };
      };
      jobs: {
        Row: {
          id: string;
          employer_id: string;
          title: string;
          description: string;
          location: string | null;
          type: string | null;
          salary_range: string | null;
          requirements: string[] | null;
          skills: string[] | null;
          status: string;
          posted_at: string;
          deadline: string | null;
          company: string | null;
          benefits: string | null;
          experience_level: string | null;
        };
        Insert: {
          id?: string;
          employer_id: string;
          title: string;
          description: string;
          location?: string | null;
          type?: string | null;
          salary_range?: string | null;
          requirements?: string[] | null;
          skills?: string[] | null;
          status?: string;
          posted_at?: string;
          deadline?: string | null;
          company?: string | null;
          benefits?: string | null;
          experience_level?: string | null;
        };
        Update: {
          id?: string;
          employer_id?: string;
          title?: string;
          description?: string;
          location?: string | null;
          type?: string | null;
          salary_range?: string | null;
          requirements?: string[] | null;
          skills?: string[] | null;
          status?: string;
          posted_at?: string;
          deadline?: string | null;
          company?: string | null;
          benefits?: string | null;
          experience_level?: string | null;
        };
      };
      applications: {
        Row: {
          id: string;
          job_id: string;
          student_id: string;
          cover_letter: string | null;
          applied_at: string;
          status: string;
        };
        Insert: {
          id?: string;
          job_id: string;
          student_id: string;
          cover_letter?: string | null;
          applied_at?: string;
          status?: string;
        };
        Update: {
          id?: string;
          job_id?: string;
          student_id?: string;
          cover_letter?: string | null;
          applied_at?: string;
          status?: string;
        };
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      [_ in never]: never;
    };
  };
}