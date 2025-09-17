-- Insert admin user (password: admin123)
INSERT OR IGNORE INTO admin_users (username, email, password_hash) VALUES 
  ('admin', 'admin@bestapostas.com', '$2b$10$nokCm1iMlSRdNztxIM9N1uiiJqjygbNShfGImXLi1Xva8XR8.tUR6');

-- Insert player types
INSERT OR IGNORE INTO player_types (name_en, name_pt, name_zh, description_en, description_pt, description_zh, icon, sort_order) VALUES 
  ('New Players', 'Novos Jogadores', '新玩家', 'Just getting started with online casinos', 'Acabando de começar com cassinos online', '刚接触在线娱乐城的玩家', 'fa-user-plus', 1),
  ('Casual Players', 'Jogadores Casuais', '休闲玩家', 'Occasional betting, small stakes', 'Apostas ocasionais, pequenos valores', '偶尔下注、小额参与者', 'fa-dice', 2),
  ('Frequent Players', 'Jogadores Frequentes', '高频玩家', 'Regular betting, medium to high deposits', 'Apostas regulares, depósitos médios a altos', '频繁下注、中高储值者', 'fa-fire', 3),
  ('Arbitrage Players', 'Jogadores de Arbitragem', '套利玩家', 'Focus on calculating risk and reward', 'Foco em calcular risco e recompensa', '偏好计算风险与回报差价者', 'fa-calculator', 4),
  ('VIP Players', 'Jogadores VIP', '老手/VIP', 'Experienced with VIP status', 'Experientes com status VIP', '有累积储值或VIP资格者', 'fa-crown', 5);

-- Insert blog categories
INSERT OR IGNORE INTO blog_categories (slug, name_en, name_pt, name_zh, sort_order) VALUES 
  ('betting-guides', 'Betting Guides', 'Guias de Apostas', '博彩指南', 1),
  ('sports-news', 'Sports News', 'Notícias Esportivas', '体育新闻', 2),
  ('casino-reviews', 'Casino Reviews', 'Análises de Cassinos', '娱乐城评论', 3),
  ('game-rules', 'Game Rules', 'Regras dos Jogos', '游戏规则', 4),
  ('promotions', 'Promotions', 'Promoções', '优惠活动', 5);

-- Insert contact settings
INSERT OR IGNORE INTO contact_settings (email, content_en, content_pt, content_zh) VALUES 
  ('contact@bestapostas.com', 
   'Feel free to contact us for any inquiries about online casinos and betting in Brazil.',
   'Sinta-se à vontade para nos contatar para qualquer dúvida sobre cassinos online e apostas no Brasil.',
   '如有任何关于巴西在线娱乐城和博彩的问题，欢迎联系我们。');

-- Insert sample casinos
INSERT OR IGNORE INTO casinos (slug, name, website_url, affiliate_link, sort_order) VALUES 
  ('betwinner', 'Betwinner', 'https://betwinner4.com/br', 'https://betwinner4.com/br?ref=affiliate', 1),
  ('22bet', '22BET', 'https://22bet.co.ke/br', 'https://22bet.co.ke/br?ref=affiliate', 2),
  ('betano', 'BETANO', 'https://www.betano.bet.br/', 'https://www.betano.bet.br/?ref=affiliate', 3),
  ('bet365', 'BET365', 'https://www.bet365.bet.br/#/HO/', 'https://www.bet365.bet.br/#/HO/?ref=affiliate', 4),
  ('1xbet', '1xBET', 'https://1xbet.com', 'https://1xbet.com?ref=affiliate', 5),
  ('estrela-bet', 'Estrela Bet', 'https://www.estrelabet.bet.br/', 'https://www.estrelabet.bet.br/?ref=affiliate', 6),
  ('blaze', 'Blaze', 'https://blaze-7.com/pt/', 'https://blaze-7.com/pt/?ref=affiliate', 7),
  ('br4bet', 'BR4BET', 'https://br4bet.org/', 'https://br4bet.org/?ref=affiliate', 8),
  ('lottoland', 'Lottoland Sportsbook', 'https://www.lottoland.bet.br/', 'https://www.lottoland.bet.br/?ref=affiliate', 9),
  ('seguro-bet', 'Seguro Bet', 'https://www.seguro.bet.br/', 'https://www.seguro.bet.br/?ref=affiliate', 10),
  ('bateu-bet', 'Bateu Bet', 'https://bateu.bet.br/', 'https://bateu.bet.br/?ref=affiliate', 11),
  ('brazino777', 'Brazino777', 'https://www.brazino777.bet.br/', 'https://www.brazino777.bet.br/?ref=affiliate', 12);

-- Link casinos to player types (sample relationships)
INSERT OR IGNORE INTO player_type_casinos (player_type_id, casino_id, sort_order) VALUES 
  -- New Players
  (1, 3, 1), -- BETANO
  (1, 4, 2), -- BET365
  (1, 6, 3), -- Estrela Bet
  
  -- Casual Players
  (2, 7, 1), -- Blaze
  (2, 6, 2), -- Estrela Bet
  (2, 12, 3), -- Brazino777
  
  -- Frequent Players
  (3, 1, 1), -- Betwinner
  (3, 2, 2), -- 22BET
  (3, 5, 3), -- 1xBET
  
  -- Arbitrage Players
  (4, 1, 1), -- Betwinner
  (4, 4, 2), -- BET365
  (4, 5, 3), -- 1xBET
  
  -- VIP Players
  (5, 4, 1), -- BET365
  (5, 3, 2), -- BETANO
  (5, 1, 3); -- Betwinner