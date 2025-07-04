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
          created_at?: string;
          updated_at?: string;
        };
      };
      posts: {
        Row: {
          id: string;
          user_id: string;
          image_url: string;
          caption: string | null;
          created_at: string;
          updated_at: string;
          title: string;
          days_to_go: number;
          aspect_ratio: string;
          media_type: string;
          tags: string[] | null;
          video_duration: number | null;
          thumbnail_url: string | null;
          color_palette: any | null;
          image_features: string | null;
        };
        Insert: {
          id?: string;
          user_id: string;
          image_url: string;
          caption?: string | null;
          created_at?: string;
          updated_at?: string;
          title?: string;
          days_to_go?: number;
          aspect_ratio?: string;
          media_type?: string;
          tags?: string[] | null;
          video_duration?: number | null;
          thumbnail_url?: string | null;
          color_palette?: any | null;
          image_features?: string | null;
        };
        Update: {
          id?: string;
          user_id?: string;
          image_url?: string;
          caption?: string | null;
          created_at?: string;
          updated_at?: string;
          title?: string;
          days_to_go?: number;
          aspect_ratio?: string;
          media_type?: string;
          tags?: string[] | null;
          video_duration?: number | null;
          thumbnail_url?: string | null;
          color_palette?: any | null;
          image_features?: string | null;
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