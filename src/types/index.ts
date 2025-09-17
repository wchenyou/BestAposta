export interface Bindings {
  DB: D1Database;
  KV: KVNamespace;
  JWT_SECRET?: string;
}

export interface User {
  id: number;
  username: string;
  email: string;
  password_hash?: string;
  created_at: string;
  updated_at: string;
}

export interface PlayerType {
  id: number;
  name_en: string;
  name_pt: string;
  name_zh?: string;
  description_en?: string;
  description_pt?: string;
  description_zh?: string;
  icon?: string;
  sort_order: number;
  is_active: boolean;
  casinos?: Casino[];
}

export interface Casino {
  id: number;
  slug: string;
  name: string;
  logo_url?: string;
  website_url?: string;
  affiliate_link?: string;
  is_active: boolean;
  sort_order: number;
  details?: CasinoDetail[];
}

export interface CasinoDetail {
  id: number;
  casino_id: number;
  language: 'en' | 'pt' | 'zh';
  welcome_bonus?: string;
  min_deposit?: string;
  payment_methods?: string;
  license?: string;
  founded_year?: string;
  bonus_description?: string;
  games_description?: string;
  payment_description?: string;
  support_description?: string;
  mobile_description?: string;
  security_description?: string;
  responsible_gaming_description?: string;
  pros?: string[];
  cons?: string[];
  rating_overall: number;
  rating_bonus: number;
  rating_games: number;
  rating_payment: number;
  rating_support: number;
  rating_mobile: number;
}

export interface BlogCategory {
  id: number;
  slug: string;
  name_en: string;
  name_pt: string;
  name_zh?: string;
  description_en?: string;
  description_pt?: string;
  description_zh?: string;
  sort_order: number;
  is_active: boolean;
}

export interface BlogPost {
  id: number;
  category_id: number;
  slug: string;
  title_en: string;
  title_pt: string;
  title_zh?: string;
  excerpt_en?: string;
  excerpt_pt?: string;
  excerpt_zh?: string;
  content_en?: string;
  content_pt?: string;
  content_zh?: string;
  featured_image?: string;
  author?: string;
  is_published: boolean;
  published_at?: string;
  views: number;
  category?: BlogCategory;
}

export interface ContactSettings {
  id: number;
  email?: string;
  content_en?: string;
  content_pt?: string;
  content_zh?: string;
}

export type Language = 'en' | 'pt' | 'zh';