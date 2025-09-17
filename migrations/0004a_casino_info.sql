-- Drop existing casino_details table and recreate with new structure
DROP TABLE IF EXISTS casino_details;

-- Create new casino_info table with restructured fields
CREATE TABLE IF NOT EXISTS casino_info (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  casino_id INTEGER NOT NULL,
  language TEXT NOT NULL, -- 'en', 'pt', 'zh'
  
  -- Top table information (基本資訊表格)
  company_info TEXT, -- 營運公司
  established_year TEXT, -- 成立時間
  licenses_safety TEXT, -- 國際牌照與網站安全
  operating_countries TEXT, -- 經營國家
  supported_currencies TEXT, -- 支援幣別
  supported_languages TEXT, -- 支援語系
  game_types TEXT, -- 遊戲類型
  payment_methods TEXT, -- 支付方式
  mobile_apps TEXT, -- 是否有APP
  customer_support TEXT, -- 客服支援
  
  -- Detailed content sections (詳細內容區塊)
  why_choose TEXT, -- 為何選擇這間娛樂城
  casino_features TEXT, -- 娛樂城特色
  licenses_safety_detail TEXT, -- 國際牌照與網站安全詳細
  operating_countries_detail TEXT, -- 經營國家詳細
  game_variety_detail TEXT, -- 遊戲種類詳細
  sports_betting_features TEXT, -- 體育投注功能
  special_promotions TEXT, -- 特別優惠活動
  suitable_players TEXT, -- 適合玩家
  
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  
  FOREIGN KEY (casino_id) REFERENCES casinos(id) ON DELETE CASCADE,
  UNIQUE(casino_id, language)
);

-- Create contact_submissions table for storing contact form data
CREATE TABLE IF NOT EXISTS contact_submissions (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  subject TEXT,
  message TEXT NOT NULL,
  ip_address TEXT,
  user_agent TEXT,
  submission_status TEXT DEFAULT 'new', -- 'new', 'read', 'replied', 'archived'
  notes TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  replied_at DATETIME
);

-- Create player_type_casinos table if not exists
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

-- Add indexes for better performance
CREATE INDEX IF NOT EXISTS idx_casino_info_casino_id ON casino_info(casino_id);
CREATE INDEX IF NOT EXISTS idx_casino_info_language ON casino_info(language);
CREATE INDEX IF NOT EXISTS idx_contact_submissions_created ON contact_submissions(created_at);