import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export type ItemType = 'book' | 'movie' | 'series';

export interface Profile {
  id: string;
  name: string;
  joined_at: string;
}

export interface Item {
  id: string;
  type: ItemType;
  title: string;
  author: string;
  description: string;
  icon: string;
  created_at: string;
}

export interface Rating {
  id: string;
  item_id: string;
  user_id: string;
  score: number;
  created_at: string;
}

export interface Comment {
  id: string;
  item_id: string;
  user_id: string;
  body: string;
  created_at: string;
  profiles?: { name: string };
}

export interface UserList {
  id: string;
  user_id: string;
  item_id: string;
  added_at: string;
  items?: Item;
}
