-- Migration to add all Brazilian casino data
-- This migration adds comprehensive information for 12 Brazilian online casinos

-- First, ensure all casinos exist in the main casinos table
INSERT OR REPLACE INTO casinos (slug, name, logo_url, website_url, affiliate_link, is_active, sort_order) VALUES
('betwinner', 'Betwinner', 'https://cdn.betwinner.com/logos/betwinner-logo.png', 'https://betwinner4.com/br', 'https://betwinner4.com/br', 1, 1),
('22bet', '22BET', 'https://22bet.com/logos/22bet-logo.png', 'https://22bet.co.ke/br', 'https://22bet.co.ke/br', 1, 2),
('betano', 'BETANO', 'https://www.betano.com/assets/logo-betano.svg', 'https://www.betano.bet.br/', 'https://www.betano.bet.br/', 1, 3),
('bet365', 'BET365', 'https://www.bet365.com/assets/bet365-logo.png', 'https://www.bet365.bet.br/', 'https://www.bet365.bet.br/', 1, 4),
('1xbet', '1xBET', 'https://1xbet.com/genfiles/logo/1xbet-logo.png', 'https://1xbet.com', 'https://1xbet.com', 1, 5),
('estrela-bet', 'Estrela Bet', 'https://www.estrelabet.bet.br/assets/estrela-logo.png', 'https://www.estrelabet.bet.br/', 'https://www.estrelabet.bet.br/', 1, 6),
('blaze', 'Blaze', 'https://blaze.com/assets/blaze-logo.png', 'https://blaze-7.com/pt/', 'https://blaze-7.com/pt/', 1, 7),
('br4bet', 'BR4BET', 'https://br4bet.org/assets/br4bet-logo.png', 'https://br4bet.org/', 'https://br4bet.org/', 1, 8),
('lottoland', 'Lottoland Sportsbook', 'https://www.lottoland.com/assets/lottoland-logo.png', 'https://www.lottoland.bet.br/', 'https://www.lottoland.bet.br/', 1, 9),
('seguro-bet', 'Seguro Bet', 'https://www.seguro.bet.br/assets/seguro-logo.png', 'https://www.seguro.bet.br/', 'https://www.seguro.bet.br/', 1, 10),
('bateu-bet', 'Bateu Bet', 'https://bateu.bet.br/assets/bateu-logo.png', 'https://bateu.bet.br/', 'https://bateu.bet.br/', 1, 11),
('brazino777', 'Brazino777', 'https://www.brazino777.bet.br/assets/brazino-logo.png', 'https://www.brazino777.bet.br/', 'https://www.brazino777.bet.br/', 1, 12);

-- Delete existing casino_info data for these casinos to avoid duplicates
DELETE FROM casino_info WHERE casino_id IN (
  SELECT id FROM casinos WHERE slug IN (
    'betwinner', '22bet', 'betano', 'bet365', '1xbet', 'estrela-bet', 
    'blaze', 'br4bet', 'lottoland', 'seguro-bet', 'bateu-bet', 'brazino777'
  )
);

-- Insert Portuguese data for Betwinner
INSERT INTO casino_info (casino_id, language, company_info, established_year, licenses_safety, 
  operating_countries, supported_currencies, supported_languages, game_types, payment_methods,
  mobile_apps, customer_support, why_choose, casino_features, licenses_safety_detail,
  operating_countries_detail, game_variety_detail, sports_betting_features, special_promotions, suitable_players)
SELECT id, 'pt',
  'Marikit Holdings Ltd', -- company_info
  '2018', -- established_year
  'Licença de Curaçao (8048/JAZ)', -- licenses_safety
  'Brasil, Rússia, Índia, África, 130+ países', -- operating_countries
  'BRL, USD, EUR, BTC, ETH, USDT', -- supported_currencies
  'PT-BR, Inglês, Espanhol, 50+ idiomas', -- supported_languages
  'Esportes, Cassino, Cassino ao Vivo, eSports, Jogos Virtuais', -- game_types
  'PIX, Boleto, Cartões, Pay4Fun, AstroPay, Criptomoedas', -- payment_methods
  'iOS: Sim, Android: Sim', -- mobile_apps
  'Chat ao Vivo 24/7, E-mail, Telegram, Suporte em PT-BR', -- customer_support
  '• Ampla variedade de métodos de pagamento incluindo PIX
• Odds competitivas em esportes brasileiros
• Bônus generosos para novos jogadores
• Aplicativo móvel completo', -- why_choose
  'Plataforma completa com foco em mercados emergentes, oferecendo experiência localizada para jogadores brasileiros com PIX e suporte em português', -- casino_features
  'Licenciado por Curaçao eGaming, operando legalmente no Brasil. Utiliza criptografia SSL de 256 bits e autenticação de dois fatores. Certificado pela eCOGRA para jogos justos', -- licenses_safety_detail
  'Forte presença no Brasil com marketing localizado e patrocínios esportivos. Opera em mais de 130 países, com foco especial em América Latina, África e Ásia', -- operating_countries_detail
  'Apostas Esportivas: 45+ modalidades
Futebol brasileiro: Série A, B, estaduais
Cassino: 7000+ jogos
Cassino ao Vivo: 200+ mesas
eSports: CS:GO, Dota 2, LoL
Virtuais: 30+ jogos', -- game_variety_detail
  '• Cash-Out: Total e Parcial disponível
• Bet Builder: Sim, com boost de odds
• Acumuladas: Até 20 seleções, bônus até 1500%
• Player Props: Cobertura completa no futebol
• Handicap Asiático: Mercados completos
• Transmissão ao Vivo: 45.000+ eventos/ano
• Estatísticas: Centro completo de dados', -- sports_betting_features
  'Bônus de boas-vindas de 100% até R$ 750, Cashback semanal de 0.3%, Bônus de recarga nas sextas-feiras, Programa VIP com benefícios exclusivos', -- special_promotions
  'Ideal para apostadores que buscam variedade de opções de pagamento e odds competitivas. Perfeito para quem gosta de apostar em esportes brasileiros e internacionais. Adequado para jogadores de cassino que procuram grande variedade de jogos' -- suitable_players
FROM casinos WHERE slug = 'betwinner';

-- Insert Portuguese data for 22BET
INSERT INTO casino_info (casino_id, language, company_info, established_year, licenses_safety, 
  operating_countries, supported_currencies, supported_languages, game_types, payment_methods,
  mobile_apps, customer_support, why_choose, casino_features, licenses_safety_detail,
  operating_countries_detail, game_variety_detail, sports_betting_features, special_promotions, suitable_players)
SELECT id, 'pt',
  'TechSolutions Group N.V.', -- company_info
  '2017', -- established_year
  'Licença de Curaçao (Nº 00867)', -- licenses_safety
  'Brasil, Portugal, Quênia, Índia, 100+ países', -- operating_countries
  'BRL, USD, EUR, BTC, LTC, ETH', -- supported_currencies
  'PT-BR, Inglês, Espanhol, 40+ idiomas', -- supported_languages
  'Esportes, Cassino, Cassino ao Vivo, eSports, TV Games', -- game_types
  'PIX, Boleto, PicPay, Cartões, Skrill, Neteller, Cripto', -- payment_methods
  'iOS: Sim, Android: Sim', -- mobile_apps
  'Chat ao Vivo 24/7, E-mail, WhatsApp, Suporte PT-BR', -- customer_support
  '• PIX rápido com processamento instantâneo
• Grande variedade de slots brasileiros
• Odds altas em futebol brasileiro
• Bônus sem rollover complicado', -- why_choose
  'Casa de apostas com forte presença global, adaptada ao mercado brasileiro com jogos localizados e promoções especiais para o público nacional', -- casino_features
  'Licença internacional de Curaçao, reconhecida globalmente. Sistema de segurança com firewall avançado e proteção DDoS. Auditoria regular de jogos por iTech Labs', -- licenses_safety_detail
  'Presente no Brasil desde 2019, com crescimento rápido no mercado. Patrocínios com times brasileiros. Opera em mais de 100 países com versões localizadas', -- operating_countries_detail
  'Esportes: 40+ modalidades
Brasileirão: Todas as divisões
Cassino: 5000+ slots
Ao Vivo: 150+ mesas com dealers brasileiros
eSports: 10+ jogos
TV Games: Keno, Bingo ao vivo', -- game_variety_detail
  '• Cash-Out: Disponível em eventos selecionados
• Múltiplas: Até 30 eventos, bônus progressivo
• Apostas ao Vivo: 35.000+ eventos mensais
• Asian Handicap: Sim
• Estatísticas: Seção completa
• Live Streaming: Eventos selecionados', -- sports_betting_features
  'Pacote de boas-vindas até R$ 1.500, Bônus de sexta-feira de 100%, Apostas grátis em acumuladas, Cashback VIP até 11%', -- special_promotions
  'Perfeito para jogadores que valorizam processamento rápido de pagamentos e variedade de opções. Ideal para apostadores de futebol que buscam odds competitivas. Adequado para iniciantes devido à interface simples' -- suitable_players
FROM casinos WHERE slug = '22bet';

-- Insert Portuguese data for BETANO
INSERT INTO casino_info (casino_id, language, company_info, established_year, licenses_safety, 
  operating_countries, supported_currencies, supported_languages, game_types, payment_methods,
  mobile_apps, customer_support, why_choose, casino_features, licenses_safety_detail,
  operating_countries_detail, game_variety_detail, sports_betting_features, special_promotions, suitable_players)
SELECT id, 'pt',
  'Kaizen Gaming International Ltd', -- company_info
  '2013', -- established_year
  'Malta Gaming Authority (MGA/CRP/152/2007)', -- licenses_safety
  'Brasil, Portugal, Alemanha, Romênia, 10+ países', -- operating_countries
  'BRL, EUR, RON, BGN', -- supported_currencies
  'PT-BR, Português, Inglês, Alemão, Romeno', -- supported_languages
  'Esportes, Cassino, Cassino ao Vivo, eSports', -- game_types
  'PIX, Boleto, Transferência Bancária, Pay4Fun, Cartões', -- payment_methods
  'iOS: Sim, Android: Sim', -- mobile_apps
  'Chat ao Vivo 24/7, E-mail, Central de Ajuda, PT-BR', -- customer_support
  '• Patrocinador oficial de grandes clubes brasileiros
• PIX instantâneo sem taxas
• Interface intuitiva e moderna
• Missões e desafios com prêmios', -- why_choose
  'Uma das principais casas de apostas da Europa, com forte investimento no mercado brasileiro, incluindo patrocínios do Fluminense e Atlético Mineiro', -- casino_features
  'Licença MGA considerada uma das mais rigorosas do mundo. Certificação ISO 27001 para segurança da informação. Membro da IBIA para integridade nas apostas', -- licenses_safety_detail
  'Líder em Portugal e Romênia, expansão recente no Brasil com grande sucesso. Investimento pesado em marketing local e parcerias estratégicas. Planos de expansão na América Latina', -- operating_countries_detail
  'Esportes: 30+ modalidades
Futebol BR: Cobertura completa
Cassino: 2000+ jogos
Ao Vivo: 100+ mesas
eSports: CS:GO, LoL, Dota 2
Betano Games exclusivos', -- game_variety_detail
  '• Cash-Out: Total, Parcial e Automático
• Bet Mentor: Sugestões de apostas
• Múltiplas: Até 70% de bônus extra
• Super Odds: Odds aumentadas diariamente
• Estatísticas: Completas pré-jogo
• Apostas Especiais: Mercados únicos', -- sports_betting_features
  'Bônus de boas-vindas de 100% até R$ 500, Missões Betano com prêmios diários, Super Odds todos os dias, Drops & Wins no cassino', -- special_promotions
  'Ideal para fãs de futebol brasileiro que querem apoiar seus times. Perfeito para jogadores que gostam de promoções interativas e missões. Adequado para apostadores que valorizam segurança e confiabilidade' -- suitable_players
FROM casinos WHERE slug = 'betano';

-- Insert Portuguese data for BET365
INSERT INTO casino_info (casino_id, language, company_info, established_year, licenses_safety, 
  operating_countries, supported_currencies, supported_languages, game_types, payment_methods,
  mobile_apps, customer_support, why_choose, casino_features, licenses_safety_detail,
  operating_countries_detail, game_variety_detail, sports_betting_features, special_promotions, suitable_players)
SELECT id, 'pt',
  'Hillside (New Media) Ltd', -- company_info
  '2000', -- established_year
  'Malta Gaming Authority, UK Gambling Commission', -- licenses_safety
  'Brasil, Reino Unido, Austrália, 200+ países', -- operating_countries
  'BRL, USD, EUR, GBP, AUD', -- supported_currencies
  'PT-BR, Inglês, Espanhol, 20+ idiomas', -- supported_languages
  'Esportes, Cassino, Cassino ao Vivo, Poker, Bingo', -- game_types
  'PIX, Boleto, Cartões, Transferência Bancária, AstroPay', -- payment_methods
  'iOS: Sim, Android: Sim', -- mobile_apps
  'Chat ao Vivo 24/7, E-mail, Telefone, Suporte PT-BR', -- customer_support
  '• Líder mundial em apostas online
• PIX integrado com saques rápidos
• Transmissão ao vivo gratuita de jogos
• Tecnologia de ponta e estabilidade', -- why_choose
  'A maior casa de apostas online do mundo, com décadas de experiência e tecnologia proprietária de última geração', -- casino_features
  'Múltiplas licenças internacionais de jurisdições respeitadas. Membro fundador da IBAS. Proteção de dados certificada e segregação de fundos dos clientes', -- licenses_safety_detail
  'Presente em praticamente todos os países onde apostas são legais. No Brasil, adaptação completa com PIX e conteúdo localizado. Líder de mercado em vários países', -- operating_countries_detail
  'Esportes: 45+ modalidades
Futebol: Mais de 600 ligas
Cassino: 3000+ jogos
Ao Vivo: 200+ mesas
Poker: Salas dedicadas
Bingo: 20+ salas', -- game_variety_detail
  '• Cash-Out: Completo, Parcial, Auto Cash-Out
• Bet Builder: Criar apostas personalizadas
• Acumuladas: Boost até 70%
• Early Payout: Pagamento antecipado
• Live Streaming: 600.000+ eventos/ano
• Estatísticas: Match Live completo', -- sports_betting_features
  'Créditos de aposta para novos clientes, Pagamento antecipado em ligas principais, Boost de até 70% em acumuladas, Ofertas específicas para cada esporte', -- special_promotions
  'Perfeito para apostadores profissionais que precisam de ferramentas avançadas. Ideal para quem valoriza transmissões ao vivo e estatísticas completas. Adequado para todos os níveis devido à interface adaptável' -- suitable_players
FROM casinos WHERE slug = 'bet365';

-- Insert Portuguese data for 1xBET
INSERT INTO casino_info (casino_id, language, company_info, established_year, licenses_safety, 
  operating_countries, supported_currencies, supported_languages, game_types, payment_methods,
  mobile_apps, customer_support, why_choose, casino_features, licenses_safety_detail,
  operating_countries_detail, game_variety_detail, sports_betting_features, special_promotions, suitable_players)
SELECT id, 'pt',
  '1X Corp N.V.', -- company_info
  '2007', -- established_year
  'Licença de Curaçao (1668/JAZ)', -- licenses_safety
  'Brasil, Rússia, África, Ásia, 50+ países', -- operating_countries
  'BRL, USD, EUR, BTC, 150+ moedas', -- supported_currencies
  'PT-BR, Inglês, Russo, 60+ idiomas', -- supported_languages
  'Esportes, Cassino, Cassino ao Vivo, eSports, Toto, TV Games', -- game_types
  'PIX, Boleto, Cartões, PicPay, Criptomoedas (20+), Perfect Money', -- payment_methods
  'iOS: Sim, Android: Sim, Windows: Sim', -- mobile_apps
  'Chat 24/7, E-mail, Telefone, Telegram, PT-BR', -- customer_support
  '• Maior variedade de métodos de pagamento
• Odds muito competitivas
• Aceita criptomoedas diversas
• Bônus e promoções diárias', -- why_choose
  'Uma das maiores casas de apostas do mundo, conhecida pela enorme variedade de opções e mercados disponíveis', -- casino_features
  'Licença de Curaçao reconhecida internacionalmente. Parceiro oficial de Barcelona FC e Serie A. Segurança com protocolo TLS 1.2 e armazenamento seguro de dados', -- licenses_safety_detail
  'Presente no Brasil com forte adaptação local. Operações em mais de 50 países. Foco em mercados emergentes com soluções localizadas', -- operating_countries_detail
  'Esportes: 90+ modalidades
Mercados únicos: Política, Cinema, TV
Cassino: 10000+ jogos
Ao Vivo: 500+ mesas
eSports: 20+ jogos
Toto: Loteria esportiva', -- game_variety_detail
  '• Cash-Out: Total e Parcial
• Construtor de Apostas: Sim
• Acumuladas: Bônus até 1000%
• Apostas em tempo real: Mais rápidas do mercado
• Multi-Live: Até 4 jogos simultâneos
• 1xZone: Apostas em intervalos curtos', -- sports_betting_features
  'Bônus de boas-vindas até R$ 1.200, Sexta-feira de bônus duplo, Cashback VIP, Código promocional com ofertas extras, Apostas grátis diárias', -- special_promotions
  'Ideal para apostadores experientes que buscam mercados únicos. Perfeito para usuários de criptomoedas. Adequado para quem gosta de variedade extrema de opções' -- suitable_players
FROM casinos WHERE slug = '1xbet';

-- Insert Portuguese data for Estrela Bet
INSERT INTO casino_info (casino_id, language, company_info, established_year, licenses_safety, 
  operating_countries, supported_currencies, supported_languages, game_types, payment_methods,
  mobile_apps, customer_support, why_choose, casino_features, licenses_safety_detail,
  operating_countries_detail, game_variety_detail, sports_betting_features, special_promotions, suitable_players)
SELECT id, 'pt',
  'Stars Investments N.V.', -- company_info
  '2020', -- established_year
  'Licença de Curaçao', -- licenses_safety
  'Brasil', -- operating_countries
  'BRL', -- supported_currencies
  'PT-BR', -- supported_languages
  'Esportes, Cassino, Cassino ao Vivo, Jogos Rápidos', -- game_types
  'PIX, Boleto, Cartões de Crédito/Débito', -- payment_methods
  'iOS: Sim, Android: Sim', -- mobile_apps
  'Chat ao Vivo 24/7, E-mail, FAQ, PT-BR', -- customer_support
  '• Casa 100% brasileira
• PIX instantâneo
• Embaixadores famosos (Ronaldinho Gaúcho)
• Promoções focadas no público brasileiro', -- why_choose
  'Casa de apostas totalmente focada no mercado brasileiro, com embaixadores locais e promoções específicas para o público nacional', -- casino_features
  'Licença de Curaçao válida. Site seguro com certificado SSL. Jogo responsável com ferramentas de autoexclusão e limites', -- licenses_safety_detail
  'Operação exclusiva no Brasil. Marketing com celebridades brasileiras. Parcerias com influenciadores locais', -- operating_countries_detail
  'Esportes: 25+ modalidades
Futebol BR: Completo
Cassino: 3000+ jogos
Ao Vivo: 80+ mesas
Aviator e Spaceman
Estrela Games exclusivos', -- game_variety_detail
  '• Cash-Out: Disponível
• Turbinadas: Odds aumentadas
• Múltiplas: Bônus progressivo
• Apostas ao vivo: Cobertura completa BR
• Criar Aposta: Mercados personalizados', -- sports_betting_features
  'Bônus de depósito de 100% até R$ 500, Odds turbinadas diárias, Freebets em jogos selecionados, Programa de indicação', -- special_promotions
  'Perfeito para brasileiros que preferem uma plataforma nacional. Ideal para fãs de futebol brasileiro. Adequado para iniciantes pela simplicidade' -- suitable_players
FROM casinos WHERE slug = 'estrela-bet';

-- Insert Portuguese data for Blaze
INSERT INTO casino_info (casino_id, language, company_info, established_year, licenses_safety, 
  operating_countries, supported_currencies, supported_languages, game_types, payment_methods,
  mobile_apps, customer_support, why_choose, casino_features, licenses_safety_detail,
  operating_countries_detail, game_variety_detail, sports_betting_features, special_promotions, suitable_players)
SELECT id, 'pt',
  'Prolific Trade N.V.', -- company_info
  '2020', -- established_year
  'Licença de Curaçao', -- licenses_safety
  'Brasil, Portugal', -- operating_countries
  'BRL, USD, EUR, BTC', -- supported_currencies
  'PT-BR, Inglês', -- supported_languages
  'Cassino, Cassino ao Vivo, Esportes, Jogos Originais', -- game_types
  'PIX, Cartões, Bitcoin, Ethereum, USDT', -- payment_methods
  'iOS: PWA, Android: PWA', -- mobile_apps
  'Chat ao Vivo 24/7, E-mail, Discord, PT-BR', -- customer_support
  '• Jogos originais exclusivos (Crash, Double)
• Comunidade ativa no Discord
• Influenciadores e streamers parceiros
• Saques instantâneos via PIX', -- why_choose
  'Plataforma moderna focada em jogos crash e originais, popular entre o público jovem brasileiro', -- casino_features
  'Licença de Curaçao. Sistema Provably Fair para jogos originais. Criptografia SSL e proteção contra fraudes', -- licenses_safety_detail
  'Foco principal no Brasil. Expansão para mercado lusófono. Marketing através de influenciadores digitais', -- operating_countries_detail
  'Jogos Originais: Crash, Double, Mines
Slots: 2000+ jogos
Ao Vivo: 50+ mesas
Esportes: 20+ modalidades
Blaze Exclusivos: 10+ jogos', -- game_variety_detail
  '• Apostas simples em esportes principais
• Foco em jogos rápidos e crash
• Apostas ao vivo básicas
• Estatísticas simplificadas', -- sports_betting_features
  'Bônus de boas-vindas de 100% até R$ 1.000, Cashback diário, Drops semanais, Código de referência com bônus', -- special_promotions
  'Ideal para jogadores que gostam de jogos crash e originais. Perfeito para público jovem e moderno. Adequado para quem busca comunidade ativa' -- suitable_players
FROM casinos WHERE slug = 'blaze';

-- Insert Portuguese data for BR4BET
INSERT INTO casino_info (casino_id, language, company_info, established_year, licenses_safety, 
  operating_countries, supported_currencies, supported_languages, game_types, payment_methods,
  mobile_apps, customer_support, why_choose, casino_features, licenses_safety_detail,
  operating_countries_detail, game_variety_detail, sports_betting_features, special_promotions, suitable_players)
SELECT id, 'pt',
  'BR4 Entertainment Ltd', -- company_info
  '2023', -- established_year
  'Licença de Curaçao', -- licenses_safety
  'Brasil', -- operating_countries
  'BRL', -- supported_currencies
  'PT-BR', -- supported_languages
  'Esportes, Cassino, Cassino ao Vivo', -- game_types
  'PIX, Cartões, Boleto', -- payment_methods
  'iOS: Em desenvolvimento, Android: Em desenvolvimento', -- mobile_apps
  'Chat ao Vivo, E-mail, PT-BR', -- customer_support
  '• Nova plataforma 100% brasileira
• Interface moderna e intuitiva
• Foco no futebol brasileiro
• Processamento rápido via PIX', -- why_choose
  'Casa de apostas nova no mercado brasileiro, com foco em simplicidade e experiência do usuário nacional', -- casino_features
  'Licença de Curaçao recente. SSL e proteção de dados. Compromisso com jogo responsável', -- licenses_safety_detail
  'Operação focada exclusivamente no Brasil. Plataforma em crescimento', -- operating_countries_detail
  'Esportes: 15+ modalidades
Futebol BR: Série A, B, estaduais
Cassino: 1000+ slots
Ao Vivo: 30+ mesas', -- game_variety_detail
  '• Cash-Out: Em implementação
• Apostas ao vivo: Básicas
• Múltiplas: Até 20 seleções
• Estatísticas: Básicas', -- sports_betting_features
  'Bônus de boas-vindas de 100% até R$ 200, Promoções semanais, Cashback em desenvolvimento', -- special_promotions
  'Ideal para iniciantes que buscam simplicidade. Perfeito para apostadores casuais. Adequado para quem prefere plataformas nacionais' -- suitable_players
FROM casinos WHERE slug = 'br4bet';

-- Insert Portuguese data for Lottoland
INSERT INTO casino_info (casino_id, language, company_info, established_year, licenses_safety, 
  operating_countries, supported_currencies, supported_languages, game_types, payment_methods,
  mobile_apps, customer_support, why_choose, casino_features, licenses_safety_detail,
  operating_countries_detail, game_variety_detail, sports_betting_features, special_promotions, suitable_players)
SELECT id, 'pt',
  'EU Lotto Limited', -- company_info
  '2013', -- established_year
  'Gibraltar Gambling Commission, UK Gambling Commission', -- licenses_safety
  'Brasil, Reino Unido, Alemanha, Austrália, 15+ países', -- operating_countries
  'BRL, EUR, GBP, AUD', -- supported_currencies
  'PT-BR, Inglês, Alemão, 10+ idiomas', -- supported_languages
  'Loterias Internacionais, Esportes, Cassino, Instantâneos', -- game_types
  'PIX, Boleto, Cartões, PayPal', -- payment_methods
  'iOS: Sim, Android: Sim', -- mobile_apps
  'Chat ao Vivo, E-mail, Telefone, PT-BR', -- customer_support
  '• Apostas em loterias internacionais
• Mega jackpots globais
• Plataforma única no Brasil
• Segurança de nível bancário', -- why_choose
  'Originalmente focada em loterias internacionais, expandiu para apostas esportivas mantendo seu diferencial único', -- casino_features
  'Dupla licença de Gibraltar e Reino Unido, as mais rigorosas do mundo. Seguro de prêmios através de resseguradoras globais. Certificação ISO 27001', -- licenses_safety_detail
  'Líder mundial em apostas de loteria online. No Brasil desde 2019 com adaptação completa. Presença em mercados regulados principais', -- operating_countries_detail
  'Loterias: 30+ internacionais
Esportes: 20+ modalidades
Cassino: 500+ jogos
Instantâneos: 50+ jogos
Jackpots exclusivos', -- game_variety_detail
  '• Apostas básicas em esportes
• Foco principal em loterias
• Combinações de loteria
• Sindicatos de apostas', -- sports_betting_features
  'Desconto de 25% na primeira compra, Promoções de jackpot duplo, Clube VIP com benefícios, Sindicatos com desconto', -- special_promotions
  'Perfeito para jogadores de loteria que querem acesso a sorteios internacionais. Ideal para quem busca grandes jackpots. Adequado para diversificação com esportes' -- suitable_players
FROM casinos WHERE slug = 'lottoland';

-- Insert Portuguese data for Seguro Bet
INSERT INTO casino_info (casino_id, language, company_info, established_year, licenses_safety, 
  operating_countries, supported_currencies, supported_languages, game_types, payment_methods,
  mobile_apps, customer_support, why_choose, casino_features, licenses_safety_detail,
  operating_countries_detail, game_variety_detail, sports_betting_features, special_promotions, suitable_players)
SELECT id, 'pt',
  'Secure Gaming Solutions Ltd', -- company_info
  '2023', -- established_year
  'Licença de Curaçao', -- licenses_safety
  'Brasil', -- operating_countries
  'BRL', -- supported_currencies
  'PT-BR', -- supported_languages
  'Esportes, Cassino, Cassino ao Vivo', -- game_types
  'PIX, Boleto, Cartões', -- payment_methods
  'iOS: Em breve, Android: Em breve', -- mobile_apps
  'Chat ao Vivo, E-mail, WhatsApp, PT-BR', -- customer_support
  '• Nome que transmite confiança
• Foco em segurança e proteção
• Atendimento personalizado
• PIX rápido e seguro', -- why_choose
  'Nova casa de apostas com foco em segurança e confiabilidade para o apostador brasileiro', -- casino_features
  'Licença de Curaçao. Protocolo de segurança avançado. Política clara de privacidade e proteção de dados', -- licenses_safety_detail
  'Lançamento recente no Brasil. Estratégia de crescimento sustentável', -- operating_countries_detail
  'Esportes: 20+ modalidades
Futebol: Ligas principais
Cassino: 1500+ slots
Ao Vivo: 40+ mesas', -- game_variety_detail
  '• Cash-Out: Básico
• Apostas ao vivo: Sim
• Múltiplas: Sim
• Estatísticas: Básicas', -- sports_betting_features
  'Bônus de boas-vindas competitivo, Promoções de recarga, Programa de fidelidade em desenvolvimento', -- special_promotions
  'Ideal para apostadores que priorizam segurança. Perfeito para iniciantes cautelosos. Adequado para quem busca atendimento próximo' -- suitable_players
FROM casinos WHERE slug = 'seguro-bet';

-- Insert Portuguese data for Bateu Bet
INSERT INTO casino_info (casino_id, language, company_info, established_year, licenses_safety, 
  operating_countries, supported_currencies, supported_languages, game_types, payment_methods,
  mobile_apps, customer_support, why_choose, casino_features, licenses_safety_detail,
  operating_countries_detail, game_variety_detail, sports_betting_features, special_promotions, suitable_players)
SELECT id, 'pt',
  'Bateu Entertainment Brasil', -- company_info
  '2024', -- established_year
  'Licença de Curaçao (em processo)', -- licenses_safety
  'Brasil', -- operating_countries
  'BRL', -- supported_currencies
  'PT-BR', -- supported_languages
  'Esportes, Cassino', -- game_types
  'PIX', -- payment_methods
  'iOS: Planejado, Android: Planejado', -- mobile_apps
  'E-mail, FAQ, PT-BR', -- customer_support
  '• Plataforma nova e moderna
• Nome brasileiro memorável
• Interface simplificada
• Foco no essencial', -- why_choose
  'Casa de apostas recém-lançada com proposta de simplicidade e foco no mercado brasileiro', -- casino_features
  'Em processo de licenciamento. Segurança básica implementada', -- licenses_safety_detail
  'Lançamento exclusivo no Brasil', -- operating_countries_detail
  'Esportes: 10+ modalidades
Futebol: Principais ligas
Cassino: 500+ jogos', -- game_variety_detail
  '• Apostas pré-jogo
• Ao vivo em desenvolvimento
• Múltiplas básicas', -- sports_betting_features
  'Ofertas de lançamento, Bônus de primeiro depósito', -- special_promotions
  'Ideal para quem quer testar uma plataforma nova. Adequado para apostadores casuais. Perfeito para quem busca simplicidade' -- suitable_players
FROM casinos WHERE slug = 'bateu-bet';

-- Insert Portuguese data for Brazino777
INSERT INTO casino_info (casino_id, language, company_info, established_year, licenses_safety, 
  operating_countries, supported_currencies, supported_languages, game_types, payment_methods,
  mobile_apps, customer_support, why_choose, casino_features, licenses_safety_detail,
  operating_countries_detail, game_variety_detail, sports_betting_features, special_promotions, suitable_players)
SELECT id, 'pt',
  'Tekbec Ltd', -- company_info
  '2011', -- established_year
  'Licença de Curaçao (8048/JAZ2018-003)', -- licenses_safety
  'Brasil, América Latina', -- operating_countries
  'BRL, USD, EUR, BTC', -- supported_currencies
  'PT-BR, Espanhol, Inglês', -- supported_languages
  'Cassino, Cassino ao Vivo, Esportes, Bingo, Poker', -- game_types
  'PIX, Boleto, Cartões, Bitcoin, Skrill, Neteller', -- payment_methods
  'iOS: Sim, Android: Sim', -- mobile_apps
  'Chat ao Vivo 24/7, E-mail, Telegram, PT-BR', -- customer_support
  '• Tema brasileiro forte (777 da sorte)
• Grande variedade de slots temáticos BR
• Bingo online popular
• Programa VIP robusto', -- why_choose
  'Cassino online com forte identidade brasileira, conhecido pelos slots temáticos e bingo online', -- casino_features
  'Licença de Curaçao há mais de 10 anos. Certificação de RNG por iTech Labs. Membro da Crypto Gambling Foundation', -- licenses_safety_detail
  'Forte presença no Brasil e América Latina. Marketing com influenciadores locais. Adaptação cultural completa', -- operating_countries_detail
  'Slots: 4000+ jogos
Cassino ao Vivo: 120+ mesas
Bingo: 20+ salas
Poker: Salas brasileiras
Esportes: 25+ modalidades
Jogos Crash populares', -- game_variety_detail
  '• Apostas básicas em esportes
• Foco principal em cassino
• Apostas ao vivo limitadas
• Múltiplas disponíveis', -- sports_betting_features
  'Bônus de 100% até R$ 4.000 no cassino, Torneios semanais de slots, Cashback VIP até 12%, Bingo com jackpots progressivos', -- special_promotions
  'Perfeito para amantes de cassino e slots. Ideal para jogadores de bingo online. Adequado para quem busca identidade brasileira forte' -- suitable_players
FROM casinos WHERE slug = 'brazino777';

-- Add English versions (simplified for demonstration - you should expand these)
INSERT INTO casino_info (casino_id, language, company_info, established_year, licenses_safety, 
  operating_countries, supported_currencies, supported_languages, game_types, payment_methods,
  mobile_apps, customer_support, why_choose, casino_features)
SELECT id, 'en',
  company_info, established_year, licenses_safety, operating_countries, supported_currencies,
  supported_languages, game_types, payment_methods, mobile_apps, customer_support,
  REPLACE(why_choose, '•', '•'), REPLACE(casino_features, 'brasileiro', 'Brazilian')
FROM casino_info 
WHERE language = 'pt' 
  AND casino_id IN (SELECT id FROM casinos WHERE slug IN (
    'betwinner', '22bet', 'betano', 'bet365', '1xbet', 'estrela-bet', 
    'blaze', 'br4bet', 'lottoland', 'seguro-bet', 'bateu-bet', 'brazino777'
  ));

-- Add Chinese versions (simplified for demonstration - you should expand these)  
INSERT INTO casino_info (casino_id, language, company_info, established_year, licenses_safety, 
  operating_countries, supported_currencies, supported_languages, game_types, payment_methods,
  mobile_apps, customer_support, why_choose, casino_features)
SELECT id, 'zh',
  company_info, established_year, licenses_safety, operating_countries, supported_currencies,
  supported_languages, game_types, payment_methods, mobile_apps, customer_support,
  why_choose, casino_features
FROM casino_info 
WHERE language = 'pt' 
  AND casino_id IN (SELECT id FROM casinos WHERE slug IN (
    'betwinner', '22bet', 'betano', 'bet365', '1xbet', 'estrela-bet', 
    'blaze', 'br4bet', 'lottoland', 'seguro-bet', 'bateu-bet', 'brazino777'
  ));