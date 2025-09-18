# 網站標籤文字更新

## 更新日期
2025-01-18

## 更新內容

### 1. 導航選單「首頁」更新
將導航選單的「首頁」連結文字更改為「客製化推薦」

| 語言 | 原文字 | 新文字 |
|------|--------|--------|
| 🇬🇧 英文 | Home | Personalized Recommendations |
| 🇧🇷 葡萄牙文 | Início | Recomendações Personalizadas |
| 🇹🇼 中文 | 首頁 | 客製化推薦 |

### 1.1 首頁分類標題更新
將首頁的玩家類型分類標題更改為「客製化推薦」

| 語言 | 原文字 | 新文字 |
|------|--------|--------|
| 🇬🇧 英文 | Find the Right Casino for You | Personalized Recommendations |
| 🇧🇷 葡萄牙文 | Encontre o Cassino Certo para Você | Recomendações Personalizadas |
| 🇹🇼 中文 | 找到適合您的娛樂城 | 客製化推薦 |

### 2. 娛樂城頁面標題更新
將導航選單和頁面標題從「娛樂城」更改為「所有娛樂城」

| 語言 | 原文字 | 新文字 |
|------|--------|--------|
| 🇬🇧 英文 | Casinos | All Casinos |
| 🇧🇷 葡萄牙文 | Cassinos | Todos os Cassinos |
| 🇹🇼 中文 | 娛樂城 | 所有娛樂城 |

### 3. 娛樂城頁面描述更新
更新了娛樂城列表頁面的描述文字，使其更加準確

| 語言 | 新描述 |
|------|--------|
| 🇬🇧 英文 | Explore our complete list of trusted online casinos with detailed reviews and comparisons |
| 🇧🇷 葡萄牙文 | Explore nossa lista completa de cassinos online confiáveis, com análises detalhadas e comparações |
| 🇹🇼 中文 | 探索我們完整的可靠線上娛樂城列表，包含詳細分析和比較 |

## 影響範圍

### 受影響的頁面
1. **首頁** (`/`)
   - "客製化推薦" 區塊標題
   
2. **導航選單** (所有頁面)
   - "所有娛樂城" 選單項目

3. **娛樂城列表頁** (`/casinos`)
   - 頁面標題
   - 頁面描述

### 受影響的檔案
- `/src/utils/language.ts` - 語言翻譯檔案
- `/src/pages/casinos.ts` - 娛樂城列表頁面

## 更新理由

1. **客製化推薦**：
   - 更準確地反映功能本質
   - 強調個人化服務
   - 提升使用者體驗感知

2. **所有娛樂城**：
   - 明確表示這是完整列表
   - 與首頁的「客製化推薦」形成對比
   - 更清楚的導航指示

## 測試檢查點

- [x] 英文版本顯示正確
- [x] 葡萄牙文版本顯示正確
- [x] 中文版本顯示正確
- [x] 導航選單更新
- [x] 首頁標題更新
- [x] 娛樂城頁面標題更新

## 截圖對比

### 之前
- 首頁：「找到適合您的娛樂城」
- 導航：「娛樂城」

### 之後
- 首頁：「客製化推薦」
- 導航：「所有娛樂城」