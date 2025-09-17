-- Setup initial player type associations
-- No minimum requirement - can have any number of casinos

-- Clear existing associations
DELETE FROM player_type_casinos;

-- Insert some default player types if they don't exist
INSERT OR IGNORE INTO player_types (id, name_en, name_pt, name_zh, description_en, description_pt, description_zh, icon, is_active, sort_order)
VALUES 
(1, 'Beginners', 'Iniciantes', '初學者', 
 'Best casinos for new players with easy interfaces and good support', 
 'Melhores cassinos para novos jogadores com interfaces fáceis e bom suporte',
 '適合新手的最佳賭場，界面簡單，支援良好',
 'fa-user-plus', 1, 1),
(2, 'Sports Fans', 'Fãs de Esportes', '體育迷',
 'Top platforms for sports betting enthusiasts',
 'Principais plataformas para entusiastas de apostas esportivas',
 '體育博彩愛好者的頂級平台',
 'fa-futbol', 1, 2),
(3, 'High Rollers', 'Apostadores VIP', '高額玩家',
 'Premium casinos with high limits and VIP programs',
 'Cassinos premium com limites altos e programas VIP',
 '具有高限額和VIP計劃的優質賭場',
 'fa-crown', 1, 3),
(4, 'Casino Lovers', 'Amantes de Cassino', '賭場愛好者',
 'Best variety of casino games and slots',
 'Melhor variedade de jogos de cassino e slots',
 '最佳的賭場遊戲和老虎機種類',
 'fa-dice', 1, 4),
(5, 'Mobile Players', 'Jogadores Mobile', '手機玩家',
 'Optimized for mobile gaming experience',
 'Otimizado para experiência de jogo móvel',
 '優化的手機遊戲體驗',
 'fa-mobile-alt', 1, 5);

-- Associate casinos with player types based on their characteristics
-- Beginners - Simple interfaces, good support, PIX payment
INSERT INTO player_type_casinos (player_type_id, casino_id, sort_order)
SELECT 1, c.id, ROW_NUMBER() OVER (ORDER BY c.name) 
FROM casinos c 
WHERE c.slug IN ('betano', 'estrela-bet', 'br4bet', 'seguro-bet');

-- Sports Fans - Best sports betting platforms
INSERT INTO player_type_casinos (player_type_id, casino_id, sort_order)
SELECT 2, c.id, ROW_NUMBER() OVER (ORDER BY c.name)
FROM casinos c 
WHERE c.slug IN ('bet365', 'betano', 'betwinner', '22bet', '1xbet');

-- High Rollers - Premium platforms with high limits
INSERT INTO player_type_casinos (player_type_id, casino_id, sort_order)
SELECT 3, c.id, ROW_NUMBER() OVER (ORDER BY c.name)
FROM casinos c 
WHERE c.slug IN ('bet365', '1xbet', 'betwinner', 'brazino777');

-- Casino Lovers - Best casino game variety
INSERT INTO player_type_casinos (player_type_id, casino_id, sort_order)
SELECT 4, c.id, ROW_NUMBER() OVER (ORDER BY c.name)
FROM casinos c 
WHERE c.slug IN ('brazino777', 'blaze', '1xbet', '22bet', 'betwinner');

-- Mobile Players - Best mobile experience
INSERT INTO player_type_casinos (player_type_id, casino_id, sort_order)
SELECT 5, c.id, ROW_NUMBER() OVER (ORDER BY c.name)
FROM casinos c 
WHERE c.slug IN ('betano', 'bet365', 'blaze', 'estrela-bet');