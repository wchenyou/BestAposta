-- Admin users table
CREATE TABLE IF NOT EXISTS admin_users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  username TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Player types table
CREATE TABLE IF NOT EXISTS player_types (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name_en TEXT NOT NULL,
  name_pt TEXT NOT NULL,
  name_zh TEXT,
  description_en TEXT,
  description_pt TEXT,
  description_zh TEXT,
  icon TEXT,
  sort_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT 1,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Casinos table
CREATE TABLE IF NOT EXISTS casinos (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  slug TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  logo_url TEXT,
  website_url TEXT,
  affiliate_link TEXT,
  is_active BOOLEAN DEFAULT 1,
  sort_order INTEGER DEFAULT 0,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Casino details table (multilingual content)
CREATE TABLE IF NOT EXISTS casino_details (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  casino_id INTEGER NOT NULL,
  language TEXT NOT NULL, -- 'en', 'pt', 'zh'
  
  -- Overview section
  welcome_bonus TEXT,
  min_deposit TEXT,
  payment_methods TEXT,
  license TEXT,
  founded_year TEXT,
  
  -- Detailed sections
  bonus_description TEXT,
  games_description TEXT,
  payment_description TEXT,
  support_description TEXT,
  mobile_description TEXT,
  security_description TEXT,
  responsible_gaming_description TEXT,
  
  -- Pros and cons
  pros TEXT, -- JSON array
  cons TEXT, -- JSON array
  
  -- Rating scores (0-100)
  rating_overall INTEGER DEFAULT 0,
  rating_bonus INTEGER DEFAULT 0,
  rating_games INTEGER DEFAULT 0,
  rating_payment INTEGER DEFAULT 0,
  rating_support INTEGER DEFAULT 0,
  rating_mobile INTEGER DEFAULT 0,
  
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (casino_id) REFERENCES casinos(id) ON DELETE CASCADE,
  UNIQUE(casino_id, language)
);

-- Player type casinos relation table
CREATE TABLE IF NOT EXISTS player_type_casinos (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  player_type_id INTEGER NOT NULL,
  casino_id INTEGER NOT NULL,
  sort_order INTEGER DEFAULT 0,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (player_type_id) REFERENCES player_types(id) ON DELETE CASCADE,
  FOREIGN KEY (casino_id) REFERENCES casinos(id) ON DELETE CASCADE,
  UNIQUE(player_type_id, casino_id)
);

-- Blog categories table
CREATE TABLE IF NOT EXISTS blog_categories (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  slug TEXT UNIQUE NOT NULL,
  name_en TEXT NOT NULL,
  name_pt TEXT NOT NULL,
  name_zh TEXT,
  description_en TEXT,
  description_pt TEXT,
  description_zh TEXT,
  sort_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT 1,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Blog posts table
CREATE TABLE IF NOT EXISTS blog_posts (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  category_id INTEGER NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  title_en TEXT NOT NULL,
  title_pt TEXT NOT NULL,
  title_zh TEXT,
  excerpt_en TEXT,
  excerpt_pt TEXT,
  excerpt_zh TEXT,
  content_en TEXT,
  content_pt TEXT,
  content_zh TEXT,
  featured_image TEXT,
  author TEXT,
  is_published BOOLEAN DEFAULT 0,
  published_at DATETIME,
  views INTEGER DEFAULT 0,
  sort_order INTEGER DEFAULT 0,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (category_id) REFERENCES blog_categories(id) ON DELETE CASCADE
);

-- Contact settings table
CREATE TABLE IF NOT EXISTS contact_settings (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  email TEXT,
  content_en TEXT,
  content_pt TEXT,
  content_zh TEXT,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_casinos_slug ON casinos(slug);
CREATE INDEX IF NOT EXISTS idx_casinos_active ON casinos(is_active);
CREATE INDEX IF NOT EXISTS idx_casino_details_casino_id ON casino_details(casino_id);
CREATE INDEX IF NOT EXISTS idx_casino_details_language ON casino_details(language);
CREATE INDEX IF NOT EXISTS idx_player_type_casinos_player ON player_type_casinos(player_type_id);
CREATE INDEX IF NOT EXISTS idx_player_type_casinos_casino ON player_type_casinos(casino_id);
CREATE INDEX IF NOT EXISTS idx_blog_posts_category ON blog_posts(category_id);
CREATE INDEX IF NOT EXISTS idx_blog_posts_slug ON blog_posts(slug);
CREATE INDEX IF NOT EXISTS idx_blog_posts_published ON blog_posts(is_published);
CREATE INDEX IF NOT EXISTS idx_blog_categories_slug ON blog_categories(slug);