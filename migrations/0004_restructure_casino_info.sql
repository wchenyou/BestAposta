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
  status TEXT DEFAULT 'new', -- 'new', 'read', 'replied', 'archived'
  notes TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  replied_at DATETIME
);

-- Update blog_categories table to add visibility control (skip if exists)
-- ALTER TABLE blog_categories ADD COLUMN IF NOT EXISTS is_visible BOOLEAN DEFAULT 1;

-- Update blog_posts table to add published_at if not exists
-- ALTER TABLE blog_posts ADD COLUMN IF NOT EXISTS published_at DATETIME DEFAULT CURRENT_TIMESTAMP;

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
CREATE INDEX IF NOT EXISTS idx_contact_submissions_status ON contact_submissions(status);
CREATE INDEX IF NOT EXISTS idx_contact_submissions_created ON contact_submissions(created_at);
CREATE INDEX IF NOT EXISTS idx_blog_posts_published ON blog_posts(published_at);

-- Insert sample data for bet365 with new structure
INSERT OR IGNORE INTO casino_info (casino_id, language, 
  company_info, established_year, licenses_safety, operating_countries, 
  supported_currencies, supported_languages, game_types, payment_methods,
  mobile_apps, customer_support,
  why_choose, casino_features, licenses_safety_detail, operating_countries_detail,
  game_variety_detail, sports_betting_features, special_promotions, suitable_players)
SELECT 
  c.id, 
  'en',
  'Hillside Technology Ventures', -- company_info
  '2000', -- established_year
  'Malta Gaming Authority, UK Gambling Commission', -- licenses_safety
  'Brazil, UK, Australia, 200+ countries', -- operating_countries
  'BRL, USD, EUR, BTC, ETH', -- supported_currencies
  'PT-BR, English, Spanish, 40+ languages', -- supported_languages
  'Sports, Casino, Live Casino, Poker, Bingo', -- game_types
  'PIX, Boleto, Credit Cards, Bank Transfer, Crypto', -- payment_methods
  'iOS: Yes, Android: Yes', -- mobile_apps
  '24/7 Live Chat, Email, PT-BR Support', -- customer_support
  '• Industry leader with 20+ years experience\n• Fast PIX payments\n• Extensive sports coverage\n• Portuguese customer support', -- why_choose
  'Complete betting platform with focus on Brazilian market, offering instant PIX deposits and withdrawals', -- casino_features
  'Licensed by Malta Gaming Authority and UK Gambling Commission. Uses SSL encryption and two-factor authentication for account security', -- licenses_safety_detail
  'Strong presence in Brazil with localized payment methods and Portuguese support. Operating in over 200 countries worldwide', -- operating_countries_detail
  'Sports Betting: 40+ sports\nCasino Games: 2000+ slots\nLive Casino: 100+ tables\nPoker Room: Available\nVirtual Sports: 20+ games', -- game_variety_detail
  '• Cash-Out: Full, Partial, Auto available\n• Bet Builder: Yes, with enhanced odds\n• Accumulator: Up to 14 selections with bonus\n• Player Props: Extensive coverage\n• Asian Handicap: Full markets\n• Live Streaming: 140,000+ events yearly\n• Match Center: Complete statistics and data', -- sports_betting_features
  'Welcome bonus for new players, regular reload bonuses, accumulator boost up to 70%, early payout offers on football', -- special_promotions
  'Ideal for sports enthusiasts who want comprehensive coverage and professional bettors who need advanced features like cash-out and bet builder. Also suitable for beginners due to intuitive interface and Portuguese support' -- suitable_players
FROM casinos c WHERE c.slug = 'bet365';

-- Portuguese version
INSERT OR IGNORE INTO casino_info (casino_id, language, 
  company_info, established_year, licenses_safety, operating_countries, 
  supported_currencies, supported_languages, game_types, payment_methods,
  mobile_apps, customer_support,
  why_choose, casino_features, licenses_safety_detail, operating_countries_detail,
  game_variety_detail, sports_betting_features, special_promotions, suitable_players)
SELECT 
  c.id, 
  'pt',
  'Hillside Technology Ventures', -- company_info
  '2000', -- established_year
  'Malta Gaming Authority, UK Gambling Commission', -- licenses_safety
  'Brasil, Reino Unido, Austrália, 200+ países', -- operating_countries
  'BRL, USD, EUR, BTC, ETH', -- supported_currencies
  'PT-BR, Inglês, Espanhol, 40+ idiomas', -- supported_languages
  'Esportes, Cassino, Cassino ao Vivo, Pôquer, Bingo', -- game_types
  'PIX, Boleto, Cartões de Crédito, Transferência Bancária, Cripto', -- payment_methods
  'iOS: Sim, Android: Sim', -- mobile_apps
  'Chat ao Vivo 24/7, E-mail, Suporte em PT-BR', -- customer_support
  '• Líder do setor com mais de 20 anos de experiência\n• Pagamentos PIX rápidos\n• Ampla cobertura esportiva\n• Suporte ao cliente em português', -- why_choose
  'Plataforma completa de apostas com foco no mercado brasileiro, oferecendo depósitos e saques instantâneos via PIX', -- casino_features
  'Licenciado pela Malta Gaming Authority e UK Gambling Commission. Utiliza criptografia SSL e autenticação de dois fatores para segurança da conta', -- licenses_safety_detail
  'Forte presença no Brasil com métodos de pagamento localizados e suporte em português. Operando em mais de 200 países no mundo', -- operating_countries_detail
  'Apostas Esportivas: 40+ esportes\nJogos de Cassino: 2000+ slots\nCassino ao Vivo: 100+ mesas\nSala de Pôquer: Disponível\nEsportes Virtuais: 20+ jogos', -- game_variety_detail
  '• Cash-Out: Total, Parcial, Automático disponível\n• Bet Builder: Sim, com odds melhoradas\n• Acumuladas: Até 14 seleções com bônus\n• Player Props: Cobertura extensa\n• Handicap Asiático: Mercados completos\n• Transmissão ao Vivo: 140.000+ eventos anuais\n• Centro de Partidas: Estatísticas e dados completos', -- sports_betting_features
  'Bônus de boas-vindas para novos jogadores, bônus de recarga regulares, boost de acumuladas até 70%, ofertas de pagamento antecipado no futebol', -- special_promotions
  'Ideal para entusiastas de esportes que desejam cobertura abrangente e apostadores profissionais que precisam de recursos avançados como cash-out e bet builder. Também adequado para iniciantes devido à interface intuitiva e suporte em português' -- suitable_players
FROM casinos c WHERE c.slug = 'bet365';

-- Chinese version
INSERT OR IGNORE INTO casino_info (casino_id, language, 
  company_info, established_year, licenses_safety, operating_countries, 
  supported_currencies, supported_languages, game_types, payment_methods,
  mobile_apps, customer_support,
  why_choose, casino_features, licenses_safety_detail, operating_countries_detail,
  game_variety_detail, sports_betting_features, special_promotions, suitable_players)
SELECT 
  c.id, 
  'zh',
  'Hillside Technology Ventures', -- company_info
  '2000', -- established_year
  '馬耳他博彩管理局、英國博彩委員會', -- licenses_safety
  '巴西、英國、澳大利亞、200+國家', -- operating_countries
  'BRL、USD、EUR、BTC、ETH', -- supported_currencies
  'PT-BR、英語、西班牙語、40+語言', -- supported_languages
  '體育、賭場、真人賭場、撲克、賓果', -- game_types
  'PIX、Boleto、信用卡、銀行轉帳、加密貨幣', -- payment_methods
  'iOS：有、Android：有', -- mobile_apps
  '24/7即時聊天、電郵、PT-BR支援', -- customer_support
  '• 擁有20年以上經驗的行業領導者\n• 快速PIX支付\n• 廣泛的體育覆蓋\n• 葡萄牙語客戶支援', -- why_choose
  '專注於巴西市場的完整投注平台，提供即時PIX存款和提款', -- casino_features
  '由馬耳他博彩管理局和英國博彩委員會許可。使用SSL加密和雙因素身份驗證確保帳戶安全', -- licenses_safety_detail
  '在巴西有強大的市場地位，提供本地化支付方式和葡萄牙語支援。在全球200多個國家營運', -- operating_countries_detail
  '體育博彩：40+體育項目\n賭場遊戲：2000+老虎機\n真人賭場：100+賭桌\n撲克室：可用\n虛擬體育：20+遊戲', -- game_variety_detail
  '• 提前兌現：完整、部分、自動可用\n• 組合投注：有，含增強賠率\n• 串關：最多14個選項含獎勵\n• 球員投注：廣泛覆蓋\n• 亞洲盤：完整市場\n• 直播：每年140,000+賽事\n• 比賽中心：完整統計和數據', -- sports_betting_features
  '新玩家歡迎獎金、定期充值獎金、串關加成高達70%、足球提前派彩優惠', -- special_promotions
  '適合希望獲得全面覆蓋的體育愛好者和需要提前兌現、組合投注等高級功能的專業投注者。由於直觀的界面和葡萄牙語支援，也適合初學者' -- suitable_players
FROM casinos c WHERE c.slug = 'bet365';