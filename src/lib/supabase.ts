import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Check if Supabase is properly configured
export const isSupabaseConfigured = () => {
  return !!(supabaseUrl && supabaseAnonKey);
};

// Create client only if properly configured
export const supabase = isSupabaseConfigured() 
  ? createClient(supabaseUrl!, supabaseAnonKey!)
  : null;

export type Database = {
  public: {
    Tables: {
      user_plans: {
        Row: {
          id: string;
          user_id: string;
          title: string;
          date: string;
          time: string;
          location: string;
          activity: string;
          type: 'outdoor' | 'indoor';
          description: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          title: string;
          date: string;
          time: string;
          location: string;
          activity: string;
          type: 'outdoor' | 'indoor';
          description?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          title?: string;
          date?: string;
          time?: string;
          location?: string;
          activity?: string;
          type?: 'outdoor' | 'indoor';
          description?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      user_settings: {
        Row: {
          id: string;
          user_id: string;
          theme: 'light' | 'dark' | 'system';
          notifications: boolean;
          location_services: boolean;
          preferences: {
            books: string[];
            movies: string[];
            music: string[];
          };
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          theme?: 'light' | 'dark' | 'system';
          notifications?: boolean;
          location_services?: boolean;
          preferences?: {
            books: string[];
            movies: string[];
            music: string[];
          };
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          theme?: 'light' | 'dark' | 'system';
          notifications?: boolean;
          location_services?: boolean;
          preferences?: {
            books: string[];
            movies: string[];
            music: string[];
          };
          created_at?: string;
          updated_at?: string;
        };
      };
    };
  };
};