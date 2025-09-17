# Seu Melhor Cassino (您的最佳賭場)

## 項目概述
- **名稱**: Seu Melhor Cassino (您的最佳賭場)
- **目標**: 巴西線上賭場綜合評論和比較平台
- **功能**: 多語言支援（PT/EN/ZH）、賭場比較、部落格系統、玩家類型配對
- **目標受眾**: 巴西和國際線上賭場玩家

## 網址
- **生產環境**: https://your-project.pages.dev (待部署)
- **GitHub**: https://github.com/wchenyou/BestAposta
- **本地開發**: http://localhost:3000

## 主要功能

### ✅ 已完成功能
1. **多語言支援** - 完整的 PT/EN/ZH 翻譯
2. **12家巴西賭場** - 所有主要賭場的完整資訊：
   - Betwinner、22BET、BETANO、BET365、1xBET
   - Estrela Bet、Blaze、BR4BET、Lottoland
   - Seguro Bet、Bateu Bet、Brazino777
3. **玩家類型配對** - 5個玩家類別與賭場推薦
4. **部落格系統** - 多語言部落格與標籤式編輯器
5. **管理後台** - 完整的管理介面包括：
   - 賭場管理與Logo上傳
   - 部落格文章編輯器與語言標籤
   - 玩家類型管理
   - 類別管理
   - 聯絡設定
6. **響應式設計** - 行動裝置友好介面
7. **SEO優化** - 適當的meta標籤和結構

### 🔄 進行中功能
- 目前無

### 📋 建議下一步
1. **部署到Cloudflare Pages** 生產環境
2. **新增更多部落格內容** 以改善SEO
3. **實施用戶評論/評分** 系統
4. **新增賭場比較工具** 進行並排比較
5. **整合分析工具**（Google Analytics或類似工具）
6. **新增電子報訂閱** 功能
7. **實施聯盟連結追蹤**

## 資料架構
- **資料庫**: Cloudflare D1 (SQLite)
- **儲存服務**: 
  - D1用於關聯資料（賭場、部落格文章、玩家類型）
  - 未來：KV用於會話資料、R2用於圖片儲存
- **資料模型**:
  - `casino_info` - 3種語言的賭場詳情
  - `blog_posts` - 多語言支援的部落格文章
  - `blog_categories` - 部落格分類
  - `player_types` - 玩家分類
  - `player_type_casinos` - 賭場關聯
  - `contact_settings` - 網站聯絡資訊

## 技術堆疊
- **框架**: Hono (Cloudflare Workers)
- **資料庫**: Cloudflare D1
- **前端**: Vanilla JS + HTM (Preact) 用於管理後台
- **樣式**: Tailwind CSS (CDN)
- **圖示**: Font Awesome
- **部署**: Cloudflare Pages
- **開發**: Vite + Wrangler

## 使用指南

### 訪客使用
1. 在首頁瀏覽賭場
2. 點擊「查看詳情」查看完整賭場資訊
3. 使用右上角語言切換器（PT/EN/ZH）
4. 在「玩家類型」區域按類型尋找賭場
5. 閱讀部落格文章獲取提示和指南
6. 點擊「立即遊戲」訪問賭場網站

### 管理員使用
1. 在 `/admin` 存取管理後台
2. 管理賭場、部落格文章和設定
3. 在表單中直接上傳賭場Logo
4. 使用語言標籤處理多語言內容
5. 發布前預覽變更

## 開發

### 設定
```bash
npm install
npm run build
```

### 本地開發
```bash
# 使用PM2啟動
pm2 start ecosystem.config.cjs

# 或直接使用wrangler
npm run dev:sandbox
```

### 資料庫管理
```bash
# 在本地套用遷移
npm run db:migrate:local

# 重設資料庫
npm run db:reset
```

## 部署
- **平台**: Cloudflare Pages
- **狀態**: ✅ 準備部署
- **分支**: master
- **最後更新**: 2024-01-17

### 部署指令
```bash
# 建構專案
npm run build

# 部署到Cloudflare Pages
wrangler pages deploy dist --project-name seu-melhor-cassino
```

## 最近更新 (2024-01-17)
- ✅ 網站從「Best Apostas」更名為「Seu Melhor Cassino」
- ✅ 新增12家巴西賭場的完整資訊
- ✅ 實施部落格系統與3篇範例文章
- ✅ 部落格編輯器新增語言標籤
- ✅ 賭場新增Logo上傳功能
- ✅ 修復玩家類型關聯（無最低要求）
- ✅ 更新首頁標語和CTA
- ✅ 在賭場頁面底部新增「立即遊戲」按鈕
- ✅ 修復賭場在玩家類型類別中的顯示問題
- ✅ 將部落格標題改為「相關文章」
- ✅ 調整部落格列表圖片為16:9比例

## 聯絡方式
如有問題或需要支援，請通過管理後台聯絡設定進行聯繫。