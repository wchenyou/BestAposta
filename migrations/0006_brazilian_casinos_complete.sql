-- Complete Brazilian Casinos Information
-- All 12 casinos with full details in Portuguese, English and Chinese

-- First ensure all casinos are in the main table
DELETE FROM casinos WHERE slug IN ('betwinner', '22bet', 'betano', 'bet365', '1xbet', 'estrela-bet', 'blaze', 'br4bet', 'lottoland', 'seguro-bet', 'bateu-bet', 'brazino777');

INSERT INTO casinos (slug, name, logo_url, website_url, affiliate_link, is_active, sort_order) VALUES
('betwinner', 'Betwinner', 'https://betwinner.com/favicon.ico', 'https://betwinner4.com/br', 'https://betwinner4.com/br', 1, 1),
('22bet', '22BET', 'https://22bet.com/favicon.ico', 'https://22bet.co.ke/br', 'https://22bet.co.ke/br', 1, 2),
('betano', 'BETANO', 'https://www.betano.com/favicon.ico', 'https://www.betano.bet.br/', 'https://www.betano.bet.br/', 1, 3),
('bet365', 'BET365', 'https://www.bet365.com/favicon.ico', 'https://www.bet365.bet.br/', 'https://www.bet365.bet.br/', 1, 4),
('1xbet', '1xBET', 'https://1xbet.com/favicon.ico', 'https://1xbet.com', 'https://1xbet.com', 1, 5),
('estrela-bet', 'Estrela Bet', 'https://www.estrelabet.com/favicon.ico', 'https://www.estrelabet.bet.br/', 'https://www.estrelabet.bet.br/', 1, 6),
('blaze', 'Blaze', 'https://blaze.com/favicon.ico', 'https://blaze-7.com/pt/', 'https://blaze-7.com/pt/', 1, 7),
('br4bet', 'BR4BET', 'https://br4bet.com/favicon.ico', 'https://br4bet.org/', 'https://br4bet.org/', 1, 8),
('lottoland', 'Lottoland', 'https://www.lottoland.com/favicon.ico', 'https://www.lottoland.bet.br/', 'https://www.lottoland.bet.br/', 1, 9),
('seguro-bet', 'Seguro Bet', 'https://www.seguro.bet/favicon.ico', 'https://www.seguro.bet.br/', 'https://www.seguro.bet.br/', 1, 10),
('bateu-bet', 'Bateu Bet', 'https://bateu.bet/favicon.ico', 'https://bateu.bet.br/', 'https://bateu.bet.br/', 1, 11),
('brazino777', 'Brazino777', 'https://www.brazino777.com/favicon.ico', 'https://www.brazino777.bet.br/', 'https://www.brazino777.bet.br/', 1, 12);

-- Clear existing casino_info data for these casinos
DELETE FROM casino_info WHERE casino_id IN (SELECT id FROM casinos WHERE slug IN ('betwinner', '22bet', 'betano', 'bet365', '1xbet', 'estrela-bet', 'blaze', 'br4bet', 'lottoland', 'seguro-bet', 'bateu-bet', 'brazino777'));

-- 1. BETWINNER - Complete Information
INSERT INTO casino_info (casino_id, language, company_info, established_year, licenses_safety, operating_countries, supported_currencies, supported_languages, game_types, payment_methods, mobile_apps, customer_support, why_choose, casino_features, licenses_safety_detail, operating_countries_detail, game_variety_detail, sports_betting_features, special_promotions, suitable_players)
SELECT c.id, 'pt',
  'PREVAILER B.V.', -- company_info
  '2018', -- established_year
  'Licença de Curaçao (8048/JAZ)', -- licenses_safety
  'Brasil, Portugal, Moçambique', -- operating_countries
  'BRL, USD, EUR', -- supported_currencies
  'Português, Inglês, Espanhol', -- supported_languages
  'Apostas Esportivas, Cassino, Cassino ao Vivo, eSports', -- game_types
  'PIX, Boleto, Cartões, Criptomoedas', -- payment_methods
  'Android, iOS', -- mobile_apps
  'Chat ao Vivo 24/7, E-mail', -- customer_support
  'Uma das maiores casas de apostas internacionais com forte presença no Brasil', -- why_choose
  'Ampla variedade de esportes, odds competitivas, transmissões ao vivo, cash out', -- casino_features
  'Licença oficial de Curaçao com regulamentação internacional. Site seguro com certificado SSL e proteção de dados avançada.', -- licenses_safety_detail
  'Operação global com foco especial no mercado brasileiro. Aceita jogadores de todo o Brasil com suporte local.', -- operating_countries_detail
  'Mais de 30 modalidades esportivas, incluindo futebol brasileiro, vôlei, basquete, MMA. Cassino com mais de 5000 jogos.', -- game_variety_detail
  'Apostas ao vivo em tempo real, streaming de jogos, estatísticas detalhadas, criador de apostas, apostas múltiplas com boost', -- sports_betting_features
  'Bônus de boas-vindas de até R$ 700, promoções semanais, programa VIP, cashback, apostas grátis', -- special_promotions
  'Ideal para apostadores que buscam variedade e boas odds. Excelente para iniciantes e profissionais.' -- suitable_players
FROM casinos c WHERE c.slug = 'betwinner';

INSERT INTO casino_info (casino_id, language, company_info, established_year, licenses_safety, operating_countries, supported_currencies, supported_languages, game_types, payment_methods, mobile_apps, customer_support, why_choose, casino_features, licenses_safety_detail, operating_countries_detail, game_variety_detail, sports_betting_features, special_promotions, suitable_players)
SELECT c.id, 'en',
  'PREVAILER B.V.', -- company_info
  '2018', -- established_year
  'Curaçao License (8048/JAZ)', -- licenses_safety
  'Brazil, Portugal, Mozambique', -- operating_countries
  'BRL, USD, EUR', -- supported_currencies
  'Portuguese, English, Spanish', -- supported_languages
  'Sports Betting, Casino, Live Casino, eSports', -- game_types
  'PIX, Bank Slip, Cards, Cryptocurrencies', -- payment_methods
  'Android, iOS', -- mobile_apps
  'Live Chat 24/7, Email', -- customer_support
  'One of the largest international betting houses with strong presence in Brazil', -- why_choose
  'Wide variety of sports, competitive odds, live streaming, cash out', -- casino_features
  'Official Curaçao license with international regulation. Secure site with SSL certificate and advanced data protection.', -- licenses_safety_detail
  'Global operation with special focus on Brazilian market. Accepts players from all Brazil with local support.', -- operating_countries_detail
  'Over 30 sports modalities, including Brazilian football, volleyball, basketball, MMA. Casino with over 5000 games.', -- game_variety_detail
  'Live betting in real time, game streaming, detailed statistics, bet builder, multiple bets with boost', -- sports_betting_features
  'Welcome bonus up to R$ 700, weekly promotions, VIP program, cashback, free bets', -- special_promotions
  'Ideal for bettors seeking variety and good odds. Excellent for beginners and professionals.' -- suitable_players
FROM casinos c WHERE c.slug = 'betwinner';

INSERT INTO casino_info (casino_id, language, company_info, established_year, licenses_safety, operating_countries, supported_currencies, supported_languages, game_types, payment_methods, mobile_apps, customer_support, why_choose, casino_features, licenses_safety_detail, operating_countries_detail, game_variety_detail, sports_betting_features, special_promotions, suitable_players)
SELECT c.id, 'zh',
  'PREVAILER B.V.', -- company_info
  '2018', -- established_year
  '庫拉索牌照 (8048/JAZ)', -- licenses_safety
  '巴西、葡萄牙、莫桑比克', -- operating_countries
  'BRL, USD, EUR', -- supported_currencies
  '葡萄牙語、英語、西班牙語', -- supported_languages
  '體育博彩、賭場、真人賭場、電競', -- game_types
  'PIX、銀行轉帳、信用卡、加密貨幣', -- payment_methods
  'Android, iOS', -- mobile_apps
  '24/7即時聊天、電子郵件', -- customer_support
  '巴西市場上最大的國際博彩公司之一', -- why_choose
  '豐富的體育項目、競爭力賠率、直播串流、提前兌現', -- casino_features
  '擁有庫拉索官方牌照並受國際監管。網站安全，具有SSL證書和先進的數據保護。', -- licenses_safety_detail
  '全球運營，特別關注巴西市場。接受來自巴西各地的玩家，提供本地支援。', -- operating_countries_detail
  '超過30種體育項目，包括巴西足球、排球、籃球、MMA。賭場擁有超過5000款遊戲。', -- game_variety_detail
  '即時投注、比賽直播、詳細統計、投注構建器、多重投注加成', -- sports_betting_features
  '高達700雷亞爾歡迎獎金、每週促銷、VIP計劃、返現、免費投注', -- special_promotions
  '適合尋求多樣性和高賠率的投注者。適合初學者和專業人士。' -- suitable_players
FROM casinos c WHERE c.slug = 'betwinner';

-- 2. 22BET - Complete Information
INSERT INTO casino_info (casino_id, language, company_info, established_year, licenses_safety, operating_countries, supported_currencies, supported_languages, game_types, payment_methods, mobile_apps, customer_support, why_choose, casino_features, licenses_safety_detail, operating_countries_detail, game_variety_detail, sports_betting_features, special_promotions, suitable_players)
SELECT c.id, 'pt',
  'TECHSOLUTIONS N.V.', -- company_info
  '2017', -- established_year
  'Licença de Curaçao (1668/JAZ)', -- licenses_safety
  'Brasil, África, Ásia', -- operating_countries
  'BRL, USD, EUR, Criptomoedas', -- supported_currencies
  'Português, Inglês, Espanhol', -- supported_languages
  'Apostas Esportivas, Cassino, Cassino ao Vivo, Jogos Virtuais', -- game_types
  'PIX, Boleto, AstroPay, Perfect Money', -- payment_methods
  'Android, iOS', -- mobile_apps
  'Chat ao Vivo 24/7, E-mail, Telefone', -- customer_support
  'Casa de apostas com foco em mercados emergentes e excelentes odds', -- why_choose
  'Odds acima da média, grande variedade de mercados, apostas em tempo real', -- casino_features
  'Licenciada e regulamentada por Curaçao. Utiliza criptografia SSL de 256 bits para proteção de dados.', -- licenses_safety_detail
  'Presente em mais de 40 países, com forte atuação no Brasil. Interface totalmente em português.', -- operating_countries_detail
  'Mais de 40 esportes disponíveis, milhares de eventos diários. Cassino com fornecedores premium.', -- game_variety_detail
  'Live betting, cash out parcial e total, estatísticas ao vivo, multiview para acompanhar várias partidas', -- sports_betting_features
  'Bônus de primeiro depósito de 100% até R$ 500, sexta-feira de recarga, acumulador do dia', -- special_promotions
  'Perfeito para apostadores que procuram odds elevadas e variedade de mercados asiáticos.' -- suitable_players
FROM casinos c WHERE c.slug = '22bet';

INSERT INTO casino_info (casino_id, language, company_info, established_year, licenses_safety, operating_countries, supported_currencies, supported_languages, game_types, payment_methods, mobile_apps, customer_support, why_choose, casino_features, licenses_safety_detail, operating_countries_detail, game_variety_detail, sports_betting_features, special_promotions, suitable_players)
SELECT c.id, 'en',
  'TECHSOLUTIONS N.V.', -- company_info
  '2017', -- established_year
  'Curaçao License (1668/JAZ)', -- licenses_safety
  'Brazil, Africa, Asia', -- operating_countries
  'BRL, USD, EUR, Cryptocurrencies', -- supported_currencies
  'Portuguese, English, Spanish', -- supported_languages
  'Sports Betting, Casino, Live Casino, Virtual Games', -- game_types
  'PIX, Bank Slip, AstroPay, Perfect Money', -- payment_methods
  'Android, iOS', -- mobile_apps
  'Live Chat 24/7, Email, Phone', -- customer_support
  'Betting house focused on emerging markets with excellent odds', -- why_choose
  'Above average odds, wide variety of markets, real-time betting', -- casino_features
  'Licensed and regulated by Curaçao. Uses 256-bit SSL encryption for data protection.', -- licenses_safety_detail
  'Present in over 40 countries, with strong presence in Brazil. Interface fully in Portuguese.', -- operating_countries_detail
  'Over 40 sports available, thousands of daily events. Casino with premium providers.', -- game_variety_detail
  'Live betting, partial and total cash out, live statistics, multiview to follow multiple matches', -- sports_betting_features
  'First deposit bonus of 100% up to R$ 500, reload Friday, accumulator of the day', -- special_promotions
  'Perfect for bettors looking for high odds and variety of Asian markets.' -- suitable_players
FROM casinos c WHERE c.slug = '22bet';

INSERT INTO casino_info (casino_id, language, company_info, established_year, licenses_safety, operating_countries, supported_currencies, supported_languages, game_types, payment_methods, mobile_apps, customer_support, why_choose, casino_features, licenses_safety_detail, operating_countries_detail, game_variety_detail, sports_betting_features, special_promotions, suitable_players)
SELECT c.id, 'zh',
  'TECHSOLUTIONS N.V.', -- company_info
  '2017', -- established_year
  '庫拉索牌照 (1668/JAZ)', -- licenses_safety
  '巴西、非洲、亞洲', -- operating_countries
  'BRL, USD, EUR, 加密貨幣', -- supported_currencies
  '葡萄牙語、英語、西班牙語', -- supported_languages
  '體育博彩、賭場、真人賭場、虛擬遊戲', -- game_types
  'PIX、銀行轉帳、AstroPay、Perfect Money', -- payment_methods
  'Android, iOS', -- mobile_apps
  '24/7即時聊天、電子郵件、電話', -- customer_support
  '專注於新興市場的博彩公司，提供優秀賠率', -- why_choose
  '高於平均的賠率、豐富的市場選擇、即時投注', -- casino_features
  '由庫拉索授權和監管。使用256位SSL加密保護數據。', -- licenses_safety_detail
  '在40多個國家運營，在巴西有強大影響力。界面完全支援葡萄牙語。', -- operating_countries_detail
  '超過40種體育項目，每天數千場賽事。與頂級供應商合作的賭場。', -- game_variety_detail
  '即時投注、部分和完全提前兌現、即時統計、多視窗追蹤多場比賽', -- sports_betting_features
  '首存100%獎金高達500雷亞爾、週五充值、每日累加器', -- special_promotions
  '適合尋求高賠率和亞洲市場多樣性的投注者。' -- suitable_players
FROM casinos c WHERE c.slug = '22bet';

-- 3. BETANO - Complete Information
INSERT INTO casino_info (casino_id, language, company_info, established_year, licenses_safety, operating_countries, supported_currencies, supported_languages, game_types, payment_methods, mobile_apps, customer_support, why_choose, casino_features, licenses_safety_detail, operating_countries_detail, game_variety_detail, sports_betting_features, special_promotions, suitable_players)
SELECT c.id, 'pt',
  'Kaizen Gaming International Ltd', -- company_info
  '2013', -- established_year
  'MGA (Malta Gaming Authority)', -- licenses_safety
  'Brasil, Portugal, Alemanha', -- operating_countries
  'BRL, EUR', -- supported_currencies
  'Português, Inglês', -- supported_languages
  'Apostas Esportivas, Cassino, Cassino ao Vivo, Apostas Especiais', -- game_types
  'PIX, Transferência Bancária, Cartões', -- payment_methods
  'Android, iOS', -- mobile_apps
  'Chat ao Vivo 24/7, E-mail, Central de Ajuda', -- customer_support
  'Patrocinadora oficial do Fluminense e Atlético Mineiro, marca de confiança no Brasil', -- why_choose
  'Interface intuitiva, odds competitivas, transmissões ao vivo gratuitas, SuperOdds', -- casino_features
  'Licença da Malta Gaming Authority, uma das mais respeitadas do mundo. Cumpre rigorosos padrões europeus.', -- licenses_safety_detail
  'Líder em Portugal e Grécia, expansão forte no Brasil. Investimento em marketing esportivo local.', -- operating_countries_detail
  'Cobertura completa do futebol brasileiro, NBA, tênis, e-sports. Cassino com jogos exclusivos.', -- game_variety_detail
  'Apostas ao vivo avançadas, cash out automático, Bet Mentor, criador de apostas personalizadas', -- sports_betting_features
  'Missões Betano com prêmios, SuperOdds diárias, bônus de boas-vindas até R$ 500, apostas grátis', -- special_promotions
  'Ideal para fãs de futebol brasileiro. Excelente para apostadores recreativos e semi-profissionais.' -- suitable_players
FROM casinos c WHERE c.slug = 'betano';

INSERT INTO casino_info (casino_id, language, company_info, established_year, licenses_safety, operating_countries, supported_currencies, supported_languages, game_types, payment_methods, mobile_apps, customer_support, why_choose, casino_features, licenses_safety_detail, operating_countries_detail, game_variety_detail, sports_betting_features, special_promotions, suitable_players)
SELECT c.id, 'en',
  'Kaizen Gaming International Ltd', -- company_info
  '2013', -- established_year
  'MGA (Malta Gaming Authority)', -- licenses_safety
  'Brazil, Portugal, Germany', -- operating_countries
  'BRL, EUR', -- supported_currencies
  'Portuguese, English', -- supported_languages
  'Sports Betting, Casino, Live Casino, Special Bets', -- game_types
  'PIX, Bank Transfer, Cards', -- payment_methods
  'Android, iOS', -- mobile_apps
  'Live Chat 24/7, Email, Help Center', -- customer_support
  'Official sponsor of Fluminense and Atlético Mineiro, trusted brand in Brazil', -- why_choose
  'Intuitive interface, competitive odds, free live streaming, SuperOdds', -- casino_features
  'Malta Gaming Authority license, one of the most respected in the world. Meets strict European standards.', -- licenses_safety_detail
  'Leader in Portugal and Greece, strong expansion in Brazil. Investment in local sports marketing.', -- operating_countries_detail
  'Complete coverage of Brazilian football, NBA, tennis, e-sports. Casino with exclusive games.', -- game_variety_detail
  'Advanced live betting, automatic cash out, Bet Mentor, custom bet builder', -- sports_betting_features
  'Betano Missions with prizes, daily SuperOdds, welcome bonus up to R$ 500, free bets', -- special_promotions
  'Ideal for Brazilian football fans. Excellent for recreational and semi-professional bettors.' -- suitable_players
FROM casinos c WHERE c.slug = 'betano';

INSERT INTO casino_info (casino_id, language, company_info, established_year, licenses_safety, operating_countries, supported_currencies, supported_languages, game_types, payment_methods, mobile_apps, customer_support, why_choose, casino_features, licenses_safety_detail, operating_countries_detail, game_variety_detail, sports_betting_features, special_promotions, suitable_players)
SELECT c.id, 'zh',
  'Kaizen Gaming International Ltd', -- company_info
  '2013', -- established_year
  'MGA (馬耳他博彩管理局)', -- licenses_safety
  '巴西、葡萄牙、德國', -- operating_countries
  'BRL, EUR', -- supported_currencies
  '葡萄牙語、英語', -- supported_languages
  '體育博彩、賭場、真人賭場、特殊投注', -- game_types
  'PIX、銀行轉帳、信用卡', -- payment_methods
  'Android, iOS', -- mobile_apps
  '24/7即時聊天、電子郵件、幫助中心', -- customer_support
  'Fluminense和Atlético Mineiro的官方贊助商，巴西值得信賴的品牌', -- why_choose
  '直觀的界面、競爭力賠率、免費直播、超級賠率', -- casino_features
  '馬耳他博彩管理局牌照，世界上最受尊重的牌照之一。符合嚴格的歐洲標準。', -- licenses_safety_detail
  '在葡萄牙和希臘的領導者，在巴西強勢擴張。投資當地體育營銷。', -- operating_countries_detail
  '全面覆蓋巴西足球、NBA、網球、電競。賭場提供獨家遊戲。', -- game_variety_detail
  '高級即時投注、自動提前兌現、投注導師、自定義投注構建器', -- sports_betting_features
  'Betano任務獎勵、每日超級賠率、高達500雷亞爾歡迎獎金、免費投注', -- special_promotions
  '適合巴西足球迷。非常適合休閒和半專業投注者。' -- suitable_players
FROM casinos c WHERE c.slug = 'betano';

-- 4. BET365 - Complete Information
INSERT INTO casino_info (casino_id, language, company_info, established_year, licenses_safety, operating_countries, supported_currencies, supported_languages, game_types, payment_methods, mobile_apps, customer_support, why_choose, casino_features, licenses_safety_detail, operating_countries_detail, game_variety_detail, sports_betting_features, special_promotions, suitable_players)
SELECT c.id, 'pt',
  'Hillside (New Media) Limited', -- company_info
  '2000', -- established_year
  'UK Gambling Commission, MGA', -- licenses_safety
  'Brasil, Reino Unido, Austrália', -- operating_countries
  'BRL, USD, EUR, GBP', -- supported_currencies
  'Português, Inglês, Espanhol', -- supported_languages
  'Apostas Esportivas, Cassino, Poker, Bingo', -- game_types
  'PIX, Transferência Bancária, Cartões', -- payment_methods
  'Android, iOS', -- mobile_apps
  'Chat ao Vivo 24/7, E-mail, Telefone', -- customer_support
  'A maior casa de apostas online do mundo, referência global em apostas esportivas', -- why_choose
  'Melhor plataforma de apostas ao vivo, streaming gratuito, cash out líder do mercado', -- casino_features
  'Múltiplas licenças internacionais incluindo UK e Malta. Padrões de segurança mais altos da indústria.', -- licenses_safety_detail
  'Operação em mais de 200 países. Líder absoluto no mercado europeu e forte presença no Brasil.', -- operating_countries_detail
  'Cobertura incomparável de eventos esportivos. Mais de 35 esportes, centenas de ligas.', -- game_variety_detail
  'Apostas ao vivo mais completas, transmissão de milhares de eventos, estatísticas em tempo real', -- sports_betting_features
  'Créditos de aposta para novos clientes, pagamento antecipado, acumulador aumentado até 70%', -- special_promotions
  'Essencial para apostadores sérios. Melhor escolha para quem busca profissionalismo e confiabilidade.' -- suitable_players
FROM casinos c WHERE c.slug = 'bet365';

INSERT INTO casino_info (casino_id, language, company_info, established_year, licenses_safety, operating_countries, supported_currencies, supported_languages, game_types, payment_methods, mobile_apps, customer_support, why_choose, casino_features, licenses_safety_detail, operating_countries_detail, game_variety_detail, sports_betting_features, special_promotions, suitable_players)
SELECT c.id, 'en',
  'Hillside (New Media) Limited', -- company_info
  '2000', -- established_year
  'UK Gambling Commission, MGA', -- licenses_safety
  'Brazil, United Kingdom, Australia', -- operating_countries
  'BRL, USD, EUR, GBP', -- supported_currencies
  'Portuguese, English, Spanish', -- supported_languages
  'Sports Betting, Casino, Poker, Bingo', -- game_types
  'PIX, Bank Transfer, Cards', -- payment_methods
  'Android, iOS', -- mobile_apps
  'Live Chat 24/7, Email, Phone', -- customer_support
  'The world''s largest online betting house, global reference in sports betting', -- why_choose
  'Best live betting platform, free streaming, market-leading cash out', -- casino_features
  'Multiple international licenses including UK and Malta. Highest security standards in the industry.', -- licenses_safety_detail
  'Operation in over 200 countries. Absolute leader in European market with strong presence in Brazil.', -- operating_countries_detail
  'Unmatched coverage of sporting events. Over 35 sports, hundreds of leagues.', -- game_variety_detail
  'Most complete live betting, streaming of thousands of events, real-time statistics', -- sports_betting_features
  'Bet credits for new customers, early payout, accumulator boost up to 70%', -- special_promotions
  'Essential for serious bettors. Best choice for those seeking professionalism and reliability.' -- suitable_players
FROM casinos c WHERE c.slug = 'bet365';

INSERT INTO casino_info (casino_id, language, company_info, established_year, licenses_safety, operating_countries, supported_currencies, supported_languages, game_types, payment_methods, mobile_apps, customer_support, why_choose, casino_features, licenses_safety_detail, operating_countries_detail, game_variety_detail, sports_betting_features, special_promotions, suitable_players)
SELECT c.id, 'zh',
  'Hillside (New Media) Limited', -- company_info
  '2000', -- established_year
  '英國博彩委員會, MGA', -- licenses_safety
  '巴西、英國、澳大利亞', -- operating_countries
  'BRL, USD, EUR, GBP', -- supported_currencies
  '葡萄牙語、英語、西班牙語', -- supported_languages
  '體育博彩、賭場、撲克、賓果', -- game_types
  'PIX、銀行轉帳、信用卡', -- payment_methods
  'Android, iOS', -- mobile_apps
  '24/7即時聊天、電子郵件、電話', -- customer_support
  '世界最大的線上博彩公司，體育博彩的全球標竿', -- why_choose
  '最佳即時投注平台、免費串流、市場領先的提前兌現', -- casino_features
  '包括英國和馬耳他的多個國際牌照。業界最高的安全標準。', -- licenses_safety_detail
  '在200多個國家運營。歐洲市場的絕對領導者，在巴西有強大影響力。', -- operating_countries_detail
  '無與倫比的體育賽事覆蓋。超過35種運動，數百個聯賽。', -- game_variety_detail
  '最完整的即時投注、數千場賽事直播、即時統計數據', -- sports_betting_features
  '新客戶投注積分、提前派彩、累加器加成高達70%', -- special_promotions
  '認真投注者的必備選擇。尋求專業性和可靠性的最佳選擇。' -- suitable_players
FROM casinos c WHERE c.slug = 'bet365';

-- 5. 1xBET - Complete Information
INSERT INTO casino_info (casino_id, language, company_info, established_year, licenses_safety, operating_countries, supported_currencies, supported_languages, game_types, payment_methods, mobile_apps, customer_support, why_choose, casino_features, licenses_safety_detail, operating_countries_detail, game_variety_detail, sports_betting_features, special_promotions, suitable_players)
SELECT c.id, 'pt',
  '1X Corp N.V.', -- company_info
  '2007', -- established_year
  'Licença de Curaçao (1668/JAZ)', -- licenses_safety
  'Brasil, Rússia, África', -- operating_countries
  'BRL, USD, EUR, Criptomoedas', -- supported_currencies
  'Português, Inglês, Russo, Espanhol', -- supported_languages
  'Apostas Esportivas, Cassino, eSports, Apostas Financeiras', -- game_types
  'PIX, Boleto, Criptomoedas, E-wallets', -- payment_methods
  'Android, iOS, Windows', -- mobile_apps
  'Chat ao Vivo 24/7, E-mail, Telegram', -- customer_support
  'Uma das maiores variedades de mercados e métodos de pagamento do mundo', -- why_choose
  'Odds altas, milhares de eventos diários, apostas em política e TV', -- casino_features
  'Licença de Curaçao com operação global. Aceita criptomoedas para maior privacidade.', -- licenses_safety_detail
  'Presença em mais de 50 países. Forte no mercado brasileiro com promoções locais.', -- operating_countries_detail
  'Mais de 90 tipos de esportes, incluindo esportes virtuais e apostas não esportivas.', -- game_variety_detail
  'Apostas ao vivo com vídeo, multi-live com até 4 jogos simultâneos, estatísticas avançadas', -- sports_betting_features
  'Bônus de primeiro depósito de 100% até R$ 1200, sexta-feira feliz, cashback VIP', -- special_promotions
  'Perfeito para apostadores experientes que buscam variedade máxima e altas odds.' -- suitable_players
FROM casinos c WHERE c.slug = '1xbet';

INSERT INTO casino_info (casino_id, language, company_info, established_year, licenses_safety, operating_countries, supported_currencies, supported_languages, game_types, payment_methods, mobile_apps, customer_support, why_choose, casino_features, licenses_safety_detail, operating_countries_detail, game_variety_detail, sports_betting_features, special_promotions, suitable_players)
SELECT c.id, 'en',
  '1X Corp N.V.', -- company_info
  '2007', -- established_year
  'Curaçao License (1668/JAZ)', -- licenses_safety
  'Brazil, Russia, Africa', -- operating_countries
  'BRL, USD, EUR, Cryptocurrencies', -- supported_currencies
  'Portuguese, English, Russian, Spanish', -- supported_languages
  'Sports Betting, Casino, eSports, Financial Betting', -- game_types
  'PIX, Bank Slip, Cryptocurrencies, E-wallets', -- payment_methods
  'Android, iOS, Windows', -- mobile_apps
  'Live Chat 24/7, Email, Telegram', -- customer_support
  'One of the world''s largest varieties of markets and payment methods', -- why_choose
  'High odds, thousands of daily events, politics and TV betting', -- casino_features
  'Curaçao license with global operation. Accepts cryptocurrencies for greater privacy.', -- licenses_safety_detail
  'Presence in over 50 countries. Strong in Brazilian market with local promotions.', -- operating_countries_detail
  'Over 90 types of sports, including virtual sports and non-sports betting.', -- game_variety_detail
  'Live betting with video, multi-live with up to 4 simultaneous games, advanced statistics', -- sports_betting_features
  'First deposit bonus of 100% up to R$ 1200, happy Friday, VIP cashback', -- special_promotions
  'Perfect for experienced bettors seeking maximum variety and high odds.' -- suitable_players
FROM casinos c WHERE c.slug = '1xbet';

INSERT INTO casino_info (casino_id, language, company_info, established_year, licenses_safety, operating_countries, supported_currencies, supported_languages, game_types, payment_methods, mobile_apps, customer_support, why_choose, casino_features, licenses_safety_detail, operating_countries_detail, game_variety_detail, sports_betting_features, special_promotions, suitable_players)
SELECT c.id, 'zh',
  '1X Corp N.V.', -- company_info
  '2007', -- established_year
  '庫拉索牌照 (1668/JAZ)', -- licenses_safety
  '巴西、俄羅斯、非洲', -- operating_countries
  'BRL, USD, EUR, 加密貨幣', -- supported_currencies
  '葡萄牙語、英語、俄語、西班牙語', -- supported_languages
  '體育博彩、賭場、電競、金融投注', -- game_types
  'PIX、銀行轉帳、加密貨幣、電子錢包', -- payment_methods
  'Android, iOS, Windows', -- mobile_apps
  '24/7即時聊天、電子郵件、Telegram', -- customer_support
  '世界上市場和支付方式種類最多的公司之一', -- why_choose
  '高賠率、每天數千場賽事、政治和電視節目投注', -- casino_features
  '庫拉索牌照，全球運營。接受加密貨幣以提供更高隱私性。', -- licenses_safety_detail
  '在50多個國家運營。在巴西市場強勢，提供本地促銷。', -- operating_countries_detail
  '超過90種體育類型，包括虛擬體育和非體育投注。', -- game_variety_detail
  '視頻即時投注、多視窗同時觀看4場比賽、高級統計數據', -- sports_betting_features
  '首存100%獎金高達1200雷亞爾、快樂星期五、VIP返現', -- special_promotions
  '適合尋求最大多樣性和高賠率的資深投注者。' -- suitable_players
FROM casinos c WHERE c.slug = '1xbet';

-- 6. ESTRELA BET - Complete Information
INSERT INTO casino_info (casino_id, language, company_info, established_year, licenses_safety, operating_countries, supported_currencies, supported_languages, game_types, payment_methods, mobile_apps, customer_support, why_choose, casino_features, licenses_safety_detail, operating_countries_detail, game_variety_detail, sports_betting_features, special_promotions, suitable_players)
SELECT c.id, 'pt',
  'Stars Investments N.V.', -- company_info
  '2020', -- established_year
  'Licença de Curaçao', -- licenses_safety
  'Brasil', -- operating_countries
  'BRL', -- supported_currencies
  'Português', -- supported_languages
  'Apostas Esportivas, Cassino, Cassino ao Vivo', -- game_types
  'PIX, Transferência Bancária', -- payment_methods
  'Android, iOS', -- mobile_apps
  'Chat ao Vivo, E-mail, WhatsApp', -- customer_support
  'Casa brasileira com embaixadores famosos como Ronaldinho Gaúcho', -- why_choose
  'Interface 100% brasileira, promoções locais, PIX instantâneo', -- casino_features
  'Licenciada em Curaçao com foco exclusivo no mercado brasileiro. Site seguro com SSL.', -- licenses_safety_detail
  'Operação dedicada ao Brasil. Parcerias com celebridades e times brasileiros.', -- operating_countries_detail
  'Foco em esportes populares no Brasil. Cassino com jogos adaptados ao gosto brasileiro.', -- game_variety_detail
  'Apostas ao vivo simplificadas, cash out rápido, boost em múltiplas brasileiras', -- sports_betting_features
  'Bônus de até R$ 500, promoções com influencers, programa de indicação', -- special_promotions
  'Ideal para brasileiros que preferem uma plataforma nacional com suporte local.' -- suitable_players
FROM casinos c WHERE c.slug = 'estrela-bet';

INSERT INTO casino_info (casino_id, language, company_info, established_year, licenses_safety, operating_countries, supported_currencies, supported_languages, game_types, payment_methods, mobile_apps, customer_support, why_choose, casino_features, licenses_safety_detail, operating_countries_detail, game_variety_detail, sports_betting_features, special_promotions, suitable_players)
SELECT c.id, 'en',
  'Stars Investments N.V.', -- company_info
  '2020', -- established_year
  'Curaçao License', -- licenses_safety
  'Brazil', -- operating_countries
  'BRL', -- supported_currencies
  'Portuguese', -- supported_languages
  'Sports Betting, Casino, Live Casino', -- game_types
  'PIX, Bank Transfer', -- payment_methods
  'Android, iOS', -- mobile_apps
  'Live Chat, Email, WhatsApp', -- customer_support
  'Brazilian house with famous ambassadors like Ronaldinho Gaúcho', -- why_choose
  '100% Brazilian interface, local promotions, instant PIX', -- casino_features
  'Licensed in Curaçao with exclusive focus on Brazilian market. Secure site with SSL.', -- licenses_safety_detail
  'Dedicated operation in Brazil. Partnerships with Brazilian celebrities and teams.', -- operating_countries_detail
  'Focus on sports popular in Brazil. Casino with games adapted to Brazilian taste.', -- game_variety_detail
  'Simplified live betting, quick cash out, boost on Brazilian multiples', -- sports_betting_features
  'Bonus up to R$ 500, promotions with influencers, referral program', -- special_promotions
  'Ideal for Brazilians who prefer a national platform with local support.' -- suitable_players
FROM casinos c WHERE c.slug = 'estrela-bet';

INSERT INTO casino_info (casino_id, language, company_info, established_year, licenses_safety, operating_countries, supported_currencies, supported_languages, game_types, payment_methods, mobile_apps, customer_support, why_choose, casino_features, licenses_safety_detail, operating_countries_detail, game_variety_detail, sports_betting_features, special_promotions, suitable_players)
SELECT c.id, 'zh',
  'Stars Investments N.V.', -- company_info
  '2020', -- established_year
  '庫拉索牌照', -- licenses_safety
  '巴西', -- operating_countries
  'BRL', -- supported_currencies
  '葡萄牙語', -- supported_languages
  '體育博彩、賭場、真人賭場', -- game_types
  'PIX、銀行轉帳', -- payment_methods
  'Android, iOS', -- mobile_apps
  '即時聊天、電子郵件、WhatsApp', -- customer_support
  '巴西本土公司，有羅納爾迪尼奧等著名代言人', -- why_choose
  '100%巴西化界面、本地促銷、即時PIX', -- casino_features
  '在庫拉索獲得牌照，專注於巴西市場。使用SSL的安全網站。', -- licenses_safety_detail
  '專門在巴西運營。與巴西名人和球隊合作。', -- operating_countries_detail
  '專注於巴西流行的體育項目。賭場提供適合巴西口味的遊戲。', -- game_variety_detail
  '簡化的即時投注、快速提前兌現、巴西連串投注加成', -- sports_betting_features
  '高達500雷亞爾獎金、網紅促銷活動、推薦計劃', -- special_promotions
  '適合喜歡本土平台和本地支援的巴西人。' -- suitable_players
FROM casinos c WHERE c.slug = 'estrela-bet';

-- 7. BLAZE - Complete Information
INSERT INTO casino_info (casino_id, language, company_info, established_year, licenses_safety, operating_countries, supported_currencies, supported_languages, game_types, payment_methods, mobile_apps, customer_support, why_choose, casino_features, licenses_safety_detail, operating_countries_detail, game_variety_detail, sports_betting_features, special_promotions, suitable_players)
SELECT c.id, 'pt',
  'Prolific Trade N.V.', -- company_info
  '2019', -- established_year
  'Licença de Curaçao', -- licenses_safety
  'Brasil, América Latina', -- operating_countries
  'BRL, USD', -- supported_currencies
  'Português, Inglês, Espanhol', -- supported_languages
  'Cassino, Crash Games, Apostas Esportivas', -- game_types
  'PIX, Criptomoedas', -- payment_methods
  'Android, iOS', -- mobile_apps
  'Chat ao Vivo 24/7, E-mail', -- customer_support
  'Pioneira em Crash Games no Brasil, jogos exclusivos como Crash e Double', -- why_choose
  'Jogos próprios originais, interface moderna, saques rápidos', -- casino_features
  'Licença de Curaçao. Popularidade baseada em jogos inovadores e marketing digital.', -- licenses_safety_detail
  'Foco principal no Brasil e países latino-americanos. Interface totalmente adaptada.', -- operating_countries_detail
  'Especializada em jogos crash, slots modernos, apostas esportivas básicas.', -- game_variety_detail
  'Apostas esportivas simples, foco maior em cassino e jogos crash', -- sports_betting_features
  'Bônus de boas-vindas, código promocional, programa VIP com rewards', -- special_promotions
  'Ideal para jogadores jovens que buscam jogos rápidos e emocionantes.' -- suitable_players
FROM casinos c WHERE c.slug = 'blaze';

INSERT INTO casino_info (casino_id, language, company_info, established_year, licenses_safety, operating_countries, supported_currencies, supported_languages, game_types, payment_methods, mobile_apps, customer_support, why_choose, casino_features, licenses_safety_detail, operating_countries_detail, game_variety_detail, sports_betting_features, special_promotions, suitable_players)
SELECT c.id, 'en',
  'Prolific Trade N.V.', -- company_info
  '2019', -- established_year
  'Curaçao License', -- licenses_safety
  'Brazil, Latin America', -- operating_countries
  'BRL, USD', -- supported_currencies
  'Portuguese, English, Spanish', -- supported_languages
  'Casino, Crash Games, Sports Betting', -- game_types
  'PIX, Cryptocurrencies', -- payment_methods
  'Android, iOS', -- mobile_apps
  'Live Chat 24/7, Email', -- customer_support
  'Pioneer in Crash Games in Brazil, exclusive games like Crash and Double', -- why_choose
  'Original proprietary games, modern interface, fast withdrawals', -- casino_features
  'Curaçao license. Popularity based on innovative games and digital marketing.', -- licenses_safety_detail
  'Main focus on Brazil and Latin American countries. Fully adapted interface.', -- operating_countries_detail
  'Specialized in crash games, modern slots, basic sports betting.', -- game_variety_detail
  'Simple sports betting, greater focus on casino and crash games', -- sports_betting_features
  'Welcome bonus, promotional code, VIP program with rewards', -- special_promotions
  'Ideal for young players looking for fast and exciting games.' -- suitable_players
FROM casinos c WHERE c.slug = 'blaze';

INSERT INTO casino_info (casino_id, language, company_info, established_year, licenses_safety, operating_countries, supported_currencies, supported_languages, game_types, payment_methods, mobile_apps, customer_support, why_choose, casino_features, licenses_safety_detail, operating_countries_detail, game_variety_detail, sports_betting_features, special_promotions, suitable_players)
SELECT c.id, 'zh',
  'Prolific Trade N.V.', -- company_info
  '2019', -- established_year
  '庫拉索牌照', -- licenses_safety
  '巴西、拉丁美洲', -- operating_countries
  'BRL, USD', -- supported_currencies
  '葡萄牙語、英語、西班牙語', -- supported_languages
  '賭場、崩潰遊戲、體育博彩', -- game_types
  'PIX、加密貨幣', -- payment_methods
  'Android, iOS', -- mobile_apps
  '24/7即時聊天、電子郵件', -- customer_support
  '巴西崩潰遊戲先驅，獨家遊戲如Crash和Double', -- why_choose
  '原創專有遊戲、現代化界面、快速提款', -- casino_features
  '庫拉索牌照。基於創新遊戲和數位行銷的人氣。', -- licenses_safety_detail
  '主要專注於巴西和拉丁美洲國家。完全適應的界面。', -- operating_countries_detail
  '專門從事崩潰遊戲、現代老虎機、基礎體育博彩。', -- game_variety_detail
  '簡單的體育博彩，更專注於賭場和崩潰遊戲', -- sports_betting_features
  '歡迎獎金、促銷代碼、VIP計劃與獎勵', -- special_promotions
  '適合尋求快速刺激遊戲的年輕玩家。' -- suitable_players
FROM casinos c WHERE c.slug = 'blaze';

-- 8. BR4BET - Complete Information
INSERT INTO casino_info (casino_id, language, company_info, established_year, licenses_safety, operating_countries, supported_currencies, supported_languages, game_types, payment_methods, mobile_apps, customer_support, why_choose, casino_features, licenses_safety_detail, operating_countries_detail, game_variety_detail, sports_betting_features, special_promotions, suitable_players)
SELECT c.id, 'pt',
  'BR4BET Entertainment', -- company_info
  '2023', -- established_year
  'Licença de Curaçao', -- licenses_safety
  'Brasil', -- operating_countries
  'BRL', -- supported_currencies
  'Português', -- supported_languages
  'Apostas Esportivas, Cassino, Jogos Rápidos', -- game_types
  'PIX', -- payment_methods
  'Android, iOS', -- mobile_apps
  'Chat ao Vivo, E-mail', -- customer_support
  'Nova casa brasileira com foco em simplicidade e pagamentos rápidos', -- why_choose
  'PIX instantâneo, interface limpa, promoções diárias', -- casino_features
  'Licenciada em Curaçao. Nova no mercado mas com crescimento rápido.', -- licenses_safety_detail
  'Operação focada 100% no Brasil. Suporte e promoções em português.', -- operating_countries_detail
  'Cobertura de esportes brasileiros, cassino com jogos populares.', -- game_variety_detail
  'Apostas ao vivo básicas, cash out, estatísticas simples', -- sports_betting_features
  'Bônus de cadastro, cashback semanal, rodadas grátis', -- special_promotions
  'Boa opção para iniciantes que buscam uma plataforma simples e brasileira.' -- suitable_players
FROM casinos c WHERE c.slug = 'br4bet';

INSERT INTO casino_info (casino_id, language, company_info, established_year, licenses_safety, operating_countries, supported_currencies, supported_languages, game_types, payment_methods, mobile_apps, customer_support, why_choose, casino_features, licenses_safety_detail, operating_countries_detail, game_variety_detail, sports_betting_features, special_promotions, suitable_players)
SELECT c.id, 'en',
  'BR4BET Entertainment', -- company_info
  '2023', -- established_year
  'Curaçao License', -- licenses_safety
  'Brazil', -- operating_countries
  'BRL', -- supported_currencies
  'Portuguese', -- supported_languages
  'Sports Betting, Casino, Quick Games', -- game_types
  'PIX', -- payment_methods
  'Android, iOS', -- mobile_apps
  'Live Chat, Email', -- customer_support
  'New Brazilian house focused on simplicity and fast payments', -- why_choose
  'Instant PIX, clean interface, daily promotions', -- casino_features
  'Licensed in Curaçao. New to market but growing rapidly.', -- licenses_safety_detail
  '100% focused operation in Brazil. Support and promotions in Portuguese.', -- operating_countries_detail
  'Coverage of Brazilian sports, casino with popular games.', -- game_variety_detail
  'Basic live betting, cash out, simple statistics', -- sports_betting_features
  'Registration bonus, weekly cashback, free spins', -- special_promotions
  'Good option for beginners looking for a simple Brazilian platform.' -- suitable_players
FROM casinos c WHERE c.slug = 'br4bet';

INSERT INTO casino_info (casino_id, language, company_info, established_year, licenses_safety, operating_countries, supported_currencies, supported_languages, game_types, payment_methods, mobile_apps, customer_support, why_choose, casino_features, licenses_safety_detail, operating_countries_detail, game_variety_detail, sports_betting_features, special_promotions, suitable_players)
SELECT c.id, 'zh',
  'BR4BET Entertainment', -- company_info
  '2023', -- established_year
  '庫拉索牌照', -- licenses_safety
  '巴西', -- operating_countries
  'BRL', -- supported_currencies
  '葡萄牙語', -- supported_languages
  '體育博彩、賭場、快速遊戲', -- game_types
  'PIX', -- payment_methods
  'Android, iOS', -- mobile_apps
  '即時聊天、電子郵件', -- customer_support
  '專注於簡單性和快速支付的新巴西公司', -- why_choose
  '即時PIX、簡潔界面、每日促銷', -- casino_features
  '在庫拉索獲得牌照。市場新手但成長迅速。', -- licenses_safety_detail
  '100%專注於巴西的運營。葡萄牙語支援和促銷。', -- operating_countries_detail
  '巴西體育賽事覆蓋，賭場提供熱門遊戲。', -- game_variety_detail
  '基礎即時投注、提前兌現、簡單統計', -- sports_betting_features
  '註冊獎金、每週返現、免費旋轉', -- special_promotions
  '適合尋求簡單巴西平台的初學者的好選擇。' -- suitable_players
FROM casinos c WHERE c.slug = 'br4bet';

-- 9. LOTTOLAND - Complete Information
INSERT INTO casino_info (casino_id, language, company_info, established_year, licenses_safety, operating_countries, supported_currencies, supported_languages, game_types, payment_methods, mobile_apps, customer_support, why_choose, casino_features, licenses_safety_detail, operating_countries_detail, game_variety_detail, sports_betting_features, special_promotions, suitable_players)
SELECT c.id, 'pt',
  'EU Lotto Limited', -- company_info
  '2013', -- established_year
  'MGA, UK Gambling Commission', -- licenses_safety
  'Brasil, Reino Unido, Alemanha', -- operating_countries
  'BRL, EUR, GBP', -- supported_currencies
  'Português, Inglês, Alemão', -- supported_languages
  'Loterias, Apostas Esportivas, Cassino', -- game_types
  'PIX, Cartões, Boleto', -- payment_methods
  'Android, iOS', -- mobile_apps
  'Chat ao Vivo, E-mail, Telefone', -- customer_support
  'Líder mundial em apostas em loterias internacionais', -- why_choose
  'Acesso a maiores loterias do mundo, apostas esportivas integradas', -- casino_features
  'Múltiplas licenças premium incluindo Malta e Reino Unido. Segurança de nível bancário.', -- licenses_safety_detail
  'Operação em mais de 15 países. Recém chegada ao Brasil com grande investimento.', -- operating_countries_detail
  'Especializada em loterias globais. Apostas esportivas e cassino como complemento.', -- game_variety_detail
  'Apostas esportivas tradicionais, foco principal em loterias', -- sports_betting_features
  'Bônus de boas-vindas, jackpots garantidos, promoções em loterias', -- special_promotions
  'Perfeito para fãs de loterias que também querem apostar em esportes.' -- suitable_players
FROM casinos c WHERE c.slug = 'lottoland';

INSERT INTO casino_info (casino_id, language, company_info, established_year, licenses_safety, operating_countries, supported_currencies, supported_languages, game_types, payment_methods, mobile_apps, customer_support, why_choose, casino_features, licenses_safety_detail, operating_countries_detail, game_variety_detail, sports_betting_features, special_promotions, suitable_players)
SELECT c.id, 'en',
  'EU Lotto Limited', -- company_info
  '2013', -- established_year
  'MGA, UK Gambling Commission', -- licenses_safety
  'Brazil, United Kingdom, Germany', -- operating_countries
  'BRL, EUR, GBP', -- supported_currencies
  'Portuguese, English, German', -- supported_languages
  'Lotteries, Sports Betting, Casino', -- game_types
  'PIX, Cards, Bank Slip', -- payment_methods
  'Android, iOS', -- mobile_apps
  'Live Chat, Email, Phone', -- customer_support
  'World leader in international lottery betting', -- why_choose
  'Access to world''s biggest lotteries, integrated sports betting', -- casino_features
  'Multiple premium licenses including Malta and UK. Bank-level security.', -- licenses_safety_detail
  'Operation in over 15 countries. Recently arrived in Brazil with major investment.', -- operating_countries_detail
  'Specialized in global lotteries. Sports betting and casino as complement.', -- game_variety_detail
  'Traditional sports betting, main focus on lotteries', -- sports_betting_features
  'Welcome bonus, guaranteed jackpots, lottery promotions', -- special_promotions
  'Perfect for lottery fans who also want to bet on sports.' -- suitable_players
FROM casinos c WHERE c.slug = 'lottoland';

INSERT INTO casino_info (casino_id, language, company_info, established_year, licenses_safety, operating_countries, supported_currencies, supported_languages, game_types, payment_methods, mobile_apps, customer_support, why_choose, casino_features, licenses_safety_detail, operating_countries_detail, game_variety_detail, sports_betting_features, special_promotions, suitable_players)
SELECT c.id, 'zh',
  'EU Lotto Limited', -- company_info
  '2013', -- established_year
  'MGA、英國博彩委員會', -- licenses_safety
  '巴西、英國、德國', -- operating_countries
  'BRL, EUR, GBP', -- supported_currencies
  '葡萄牙語、英語、德語', -- supported_languages
  '彩票、體育博彩、賭場', -- game_types
  'PIX、信用卡、銀行轉帳', -- payment_methods
  'Android, iOS', -- mobile_apps
  '即時聊天、電子郵件、電話', -- customer_support
  '國際彩票投注的世界領導者', -- why_choose
  '可參與世界最大彩票、整合體育博彩', -- casino_features
  '包括馬耳他和英國的多個高級牌照。銀行級別的安全性。', -- licenses_safety_detail
  '在超過15個國家運營。最近進入巴西並進行大量投資。', -- operating_countries_detail
  '專門從事全球彩票。體育博彩和賭場作為補充。', -- game_variety_detail
  '傳統體育博彩，主要專注於彩票', -- sports_betting_features
  '歡迎獎金、保證頭獎、彩票促銷', -- special_promotions
  '適合同時想投注體育的彩票愛好者。' -- suitable_players
FROM casinos c WHERE c.slug = 'lottoland';

-- 10. SEGURO BET - Complete Information
INSERT INTO casino_info (casino_id, language, company_info, established_year, licenses_safety, operating_countries, supported_currencies, supported_languages, game_types, payment_methods, mobile_apps, customer_support, why_choose, casino_features, licenses_safety_detail, operating_countries_detail, game_variety_detail, sports_betting_features, special_promotions, suitable_players)
SELECT c.id, 'pt',
  'Seguro Entertainment S.A.', -- company_info
  '2022', -- established_year
  'Licença de Curaçao', -- licenses_safety
  'Brasil', -- operating_countries
  'BRL', -- supported_currencies
  'Português', -- supported_languages
  'Apostas Esportivas, Cassino', -- game_types
  'PIX, Transferência Bancária', -- payment_methods
  'Android, iOS', -- mobile_apps
  'Chat ao Vivo, WhatsApp', -- customer_support
  'Casa brasileira com nome que transmite confiança e segurança', -- why_choose
  'Foco em segurança, pagamentos garantidos, suporte brasileiro', -- casino_features
  'Licença de Curaçao com operação transparente. Ênfase em jogo responsável.', -- licenses_safety_detail
  'Exclusivamente focada no mercado brasileiro. Atendimento 100% em português.', -- operating_countries_detail
  'Cobertura completa de esportes brasileiros, cassino com jogos seguros.', -- game_variety_detail
  'Apostas ao vivo com proteção, cash out garantido, limites personalizados', -- sports_betting_features
  'Bônus conservador, programa de fidelidade, apostas seguras', -- special_promotions
  'Ideal para apostadores conservadores que priorizam segurança.' -- suitable_players
FROM casinos c WHERE c.slug = 'seguro-bet';

INSERT INTO casino_info (casino_id, language, company_info, established_year, licenses_safety, operating_countries, supported_currencies, supported_languages, game_types, payment_methods, mobile_apps, customer_support, why_choose, casino_features, licenses_safety_detail, operating_countries_detail, game_variety_detail, sports_betting_features, special_promotions, suitable_players)
SELECT c.id, 'en',
  'Seguro Entertainment S.A.', -- company_info
  '2022', -- established_year
  'Curaçao License', -- licenses_safety
  'Brazil', -- operating_countries
  'BRL', -- supported_currencies
  'Portuguese', -- supported_languages
  'Sports Betting, Casino', -- game_types
  'PIX, Bank Transfer', -- payment_methods
  'Android, iOS', -- mobile_apps
  'Live Chat, WhatsApp', -- customer_support
  'Brazilian house with name that conveys trust and security', -- why_choose
  'Focus on security, guaranteed payments, Brazilian support', -- casino_features
  'Curaçao license with transparent operation. Emphasis on responsible gaming.', -- licenses_safety_detail
  'Exclusively focused on Brazilian market. 100% Portuguese service.', -- operating_countries_detail
  'Complete coverage of Brazilian sports, casino with secure games.', -- game_variety_detail
  'Live betting with protection, guaranteed cash out, personalized limits', -- sports_betting_features
  'Conservative bonus, loyalty program, safe bets', -- special_promotions
  'Ideal for conservative bettors who prioritize security.' -- suitable_players
FROM casinos c WHERE c.slug = 'seguro-bet';

INSERT INTO casino_info (casino_id, language, company_info, established_year, licenses_safety, operating_countries, supported_currencies, supported_languages, game_types, payment_methods, mobile_apps, customer_support, why_choose, casino_features, licenses_safety_detail, operating_countries_detail, game_variety_detail, sports_betting_features, special_promotions, suitable_players)
SELECT c.id, 'zh',
  'Seguro Entertainment S.A.', -- company_info
  '2022', -- established_year
  '庫拉索牌照', -- licenses_safety
  '巴西', -- operating_countries
  'BRL', -- supported_currencies
  '葡萄牙語', -- supported_languages
  '體育博彩、賭場', -- game_types
  'PIX、銀行轉帳', -- payment_methods
  'Android, iOS', -- mobile_apps
  '即時聊天、WhatsApp', -- customer_support
  '名稱傳達信任和安全的巴西公司', -- why_choose
  '專注於安全、保證支付、巴西支援', -- casino_features
  '庫拉索牌照，透明運營。強調負責任的遊戲。', -- licenses_safety_detail
  '專門專注於巴西市場。100%葡萄牙語服務。', -- operating_countries_detail
  '全面覆蓋巴西體育，賭場提供安全遊戲。', -- game_variety_detail
  '受保護的即時投注、保證提前兌現、個性化限制', -- sports_betting_features
  '保守獎金、忠誠計劃、安全投注', -- special_promotions
  '適合優先考慮安全的保守投注者。' -- suitable_players
FROM casinos c WHERE c.slug = 'seguro-bet';

-- 11. BATEU BET - Complete Information
INSERT INTO casino_info (casino_id, language, company_info, established_year, licenses_safety, operating_countries, supported_currencies, supported_languages, game_types, payment_methods, mobile_apps, customer_support, why_choose, casino_features, licenses_safety_detail, operating_countries_detail, game_variety_detail, sports_betting_features, special_promotions, suitable_players)
SELECT c.id, 'pt',
  'Bateu Entertainment Ltd', -- company_info
  '2023', -- established_year
  'Licença de Curaçao', -- licenses_safety
  'Brasil', -- operating_countries
  'BRL', -- supported_currencies
  'Português', -- supported_languages
  'Apostas Esportivas, Cassino, Aviator', -- game_types
  'PIX', -- payment_methods
  'Android, iOS', -- mobile_apps
  'Chat ao Vivo, E-mail', -- customer_support
  'Nova casa com nome brasileiro e foco em jogos populares', -- why_choose
  'Interface simples, jogos crash populares, PIX rápido', -- casino_features
  'Licença de Curaçao. Nova operadora focada no público jovem brasileiro.', -- licenses_safety_detail
  'Operação exclusiva no Brasil. Marketing direcionado ao público jovem.', -- operating_countries_detail
  'Foco em futebol brasileiro, jogos crash como Aviator, slots populares.', -- game_variety_detail
  'Apostas ao vivo em principais ligas, cash out, apostas rápidas', -- sports_betting_features
  'Bônus de primeiro depósito, promoções em jogos crash', -- special_promotions
  'Boa para jovens que gostam de jogos rápidos e apostas simples.' -- suitable_players
FROM casinos c WHERE c.slug = 'bateu-bet';

INSERT INTO casino_info (casino_id, language, company_info, established_year, licenses_safety, operating_countries, supported_currencies, supported_languages, game_types, payment_methods, mobile_apps, customer_support, why_choose, casino_features, licenses_safety_detail, operating_countries_detail, game_variety_detail, sports_betting_features, special_promotions, suitable_players)
SELECT c.id, 'en',
  'Bateu Entertainment Ltd', -- company_info
  '2023', -- established_year
  'Curaçao License', -- licenses_safety
  'Brazil', -- operating_countries
  'BRL', -- supported_currencies
  'Portuguese', -- supported_languages
  'Sports Betting, Casino, Aviator', -- game_types
  'PIX', -- payment_methods
  'Android, iOS', -- mobile_apps
  'Live Chat, Email', -- customer_support
  'New house with Brazilian name and focus on popular games', -- why_choose
  'Simple interface, popular crash games, fast PIX', -- casino_features
  'Curaçao license. New operator focused on young Brazilian audience.', -- licenses_safety_detail
  'Exclusive operation in Brazil. Marketing directed at young audience.', -- operating_countries_detail
  'Focus on Brazilian football, crash games like Aviator, popular slots.', -- game_variety_detail
  'Live betting on major leagues, cash out, quick bets', -- sports_betting_features
  'First deposit bonus, crash game promotions', -- special_promotions
  'Good for young people who like fast games and simple betting.' -- suitable_players
FROM casinos c WHERE c.slug = 'bateu-bet';

INSERT INTO casino_info (casino_id, language, company_info, established_year, licenses_safety, operating_countries, supported_currencies, supported_languages, game_types, payment_methods, mobile_apps, customer_support, why_choose, casino_features, licenses_safety_detail, operating_countries_detail, game_variety_detail, sports_betting_features, special_promotions, suitable_players)
SELECT c.id, 'zh',
  'Bateu Entertainment Ltd', -- company_info
  '2023', -- established_year
  '庫拉索牌照', -- licenses_safety
  '巴西', -- operating_countries
  'BRL', -- supported_currencies
  '葡萄牙語', -- supported_languages
  '體育博彩、賭場、Aviator', -- game_types
  'PIX', -- payment_methods
  'Android, iOS', -- mobile_apps
  '即時聊天、電子郵件', -- customer_support
  '擁有巴西名稱並專注於熱門遊戲的新公司', -- why_choose
  '簡單界面、熱門崩潰遊戲、快速PIX', -- casino_features
  '庫拉索牌照。專注於巴西年輕受眾的新運營商。', -- licenses_safety_detail
  '專門在巴西運營。針對年輕受眾的營銷。', -- operating_countries_detail
  '專注於巴西足球、Aviator等崩潰遊戲、熱門老虎機。', -- game_variety_detail
  '主要聯賽即時投注、提前兌現、快速投注', -- sports_betting_features
  '首存獎金、崩潰遊戲促銷', -- special_promotions
  '適合喜歡快速遊戲和簡單投注的年輕人。' -- suitable_players
FROM casinos c WHERE c.slug = 'bateu-bet';

-- 12. BRAZINO777 - Complete Information
INSERT INTO casino_info (casino_id, language, company_info, established_year, licenses_safety, operating_countries, supported_currencies, supported_languages, game_types, payment_methods, mobile_apps, customer_support, why_choose, casino_features, licenses_safety_detail, operating_countries_detail, game_variety_detail, sports_betting_features, special_promotions, suitable_players)
SELECT c.id, 'pt',
  'Techcore Holding B.V.', -- company_info
  '2011', -- established_year
  'Licença de Curaçao (8048/JAZ)', -- licenses_safety
  'Brasil, América Latina', -- operating_countries
  'BRL, USD, EUR', -- supported_currencies
  'Português, Inglês, Espanhol', -- supported_languages
  'Cassino, Apostas Esportivas, Bingo, Poker', -- game_types
  'PIX, Boleto, Cartões, Criptomoedas', -- payment_methods
  'Android, iOS', -- mobile_apps
  'Chat ao Vivo 24/7, E-mail', -- customer_support
  'Um dos cassinos online mais antigos e confiáveis do Brasil', -- why_choose
  'Enorme variedade de jogos, jackpots progressivos, torneios regulares', -- casino_features
  'Licença de Curaçao de longa data. Reputação sólida construída ao longo de anos.', -- licenses_safety_detail
  'Forte presença em toda América Latina. Totalmente adaptado ao mercado brasileiro.', -- operating_countries_detail
  'Mais de 4000 jogos de cassino, apostas esportivas completas, poker e bingo.', -- game_variety_detail
  'Apostas em todos os principais esportes, especial atenção ao futebol brasileiro', -- sports_betting_features
  'Bônus de até R$ 4000, programa VIP exclusivo, torneios semanais', -- special_promotions
  'Perfeito para jogadores que buscam variedade máxima em cassino e esportes.' -- suitable_players
FROM casinos c WHERE c.slug = 'brazino777';

INSERT INTO casino_info (casino_id, language, company_info, established_year, licenses_safety, operating_countries, supported_currencies, supported_languages, game_types, payment_methods, mobile_apps, customer_support, why_choose, casino_features, licenses_safety_detail, operating_countries_detail, game_variety_detail, sports_betting_features, special_promotions, suitable_players)
SELECT c.id, 'en',
  'Techcore Holding B.V.', -- company_info
  '2011', -- established_year
  'Curaçao License (8048/JAZ)', -- licenses_safety
  'Brazil, Latin America', -- operating_countries
  'BRL, USD, EUR', -- supported_currencies
  'Portuguese, English, Spanish', -- supported_languages
  'Casino, Sports Betting, Bingo, Poker', -- game_types
  'PIX, Bank Slip, Cards, Cryptocurrencies', -- payment_methods
  'Android, iOS', -- mobile_apps
  'Live Chat 24/7, Email', -- customer_support
  'One of Brazil''s oldest and most trusted online casinos', -- why_choose
  'Huge variety of games, progressive jackpots, regular tournaments', -- casino_features
  'Long-standing Curaçao license. Solid reputation built over years.', -- licenses_safety_detail
  'Strong presence throughout Latin America. Fully adapted to Brazilian market.', -- operating_countries_detail
  'Over 4000 casino games, complete sports betting, poker and bingo.', -- game_variety_detail
  'Betting on all major sports, special attention to Brazilian football', -- sports_betting_features
  'Bonus up to R$ 4000, exclusive VIP program, weekly tournaments', -- special_promotions
  'Perfect for players seeking maximum variety in casino and sports.' -- suitable_players
FROM casinos c WHERE c.slug = 'brazino777';

INSERT INTO casino_info (casino_id, language, company_info, established_year, licenses_safety, operating_countries, supported_currencies, supported_languages, game_types, payment_methods, mobile_apps, customer_support, why_choose, casino_features, licenses_safety_detail, operating_countries_detail, game_variety_detail, sports_betting_features, special_promotions, suitable_players)
SELECT c.id, 'zh',
  'Techcore Holding B.V.', -- company_info
  '2011', -- established_year
  '庫拉索牌照 (8048/JAZ)', -- licenses_safety
  '巴西、拉丁美洲', -- operating_countries
  'BRL, USD, EUR', -- supported_currencies
  '葡萄牙語、英語、西班牙語', -- supported_languages
  '賭場、體育博彩、賓果、撲克', -- game_types
  'PIX、銀行轉帳、信用卡、加密貨幣', -- payment_methods
  'Android, iOS', -- mobile_apps
  '24/7即時聊天、電子郵件', -- customer_support
  '巴西最古老和最值得信賴的線上賭場之一', -- why_choose
  '遊戲種類繁多、累積獎池、定期錦標賽', -- casino_features
  '長期持有的庫拉索牌照。多年建立的良好聲譽。', -- licenses_safety_detail
  '在整個拉丁美洲有強大影響力。完全適應巴西市場。', -- operating_countries_detail
  '超過4000款賭場遊戲、完整體育博彩、撲克和賓果。', -- game_variety_detail
  '投注所有主要體育項目，特別關注巴西足球', -- sports_betting_features
  '高達4000雷亞爾獎金、專屬VIP計劃、每週錦標賽', -- special_promotions
  '適合尋求賭場和體育最大多樣性的玩家。' -- suitable_players
FROM casinos c WHERE c.slug = 'brazino777';