# Seu Melhor Cassino (您的最佳賭場) - 完整技術文件

## 目錄
1. [專案概述](#專案概述)
2. [技術架構](#技術架構)
3. [Docker 本機部署教學](#docker-本機部署教學)
4. [Render 雲端部署教學](#render-雲端部署教學)
5. [Cloudflare Pages 部署教學](#cloudflare-pages-部署教學)
6. [技術框架詳細說明](#技術框架詳細說明)
7. [專案檔案結構說明](#專案檔案結構說明)
8. [資料庫架構](#資料庫架構)
9. [API 端點文件](#api-端點文件)
10. [開發指南](#開發指南)
11. [維護與更新](#維護與更新)

---

## 專案概述

### 基本資訊
- **專案名稱**: Seu Melhor Cassino (您的最佳賭場)
- **專案類型**: 多語言線上賭場評論與比較平台
- **目標市場**: 巴西及國際線上賭場玩家
- **支援語言**: 葡萄牙語 (PT)、英語 (EN)、中文 (ZH)
- **部署平台**: Cloudflare Pages / Docker / Render

### 主要功能
- 12家巴西熱門賭場的完整資訊展示
- 多語言內容管理系統
- 部落格文章系統
- 玩家類型配對推薦
- 管理後台界面
- 響應式設計支援手機/平板/桌面
- SEO 優化

### 網址資訊
- **生產環境**: https://your-project.pages.dev (待部署)
- **GitHub**: https://github.com/wchenyou/BestAposta
- **本地開發**: http://localhost:3000
- **Docker 容器**: http://localhost:3000
- **Render 部署**: https://your-app.onrender.com

---

## 技術架構

### 核心架構
```
┌─────────────────────────────────────────────┐
│              前端 (Frontend)                 │
│   HTML + Tailwind CSS + Vanilla JS          │
│   管理介面: HTM (Preact) + 自訂元件          │
└─────────────────────────────────────────────┘
                      ↓
┌─────────────────────────────────────────────┐
│           應用層 (Application)               │
│     Hono Framework (Cloudflare Workers)      │
│          TypeScript + Vite 建構              │
└─────────────────────────────────────────────┘
                      ↓
┌─────────────────────────────────────────────┐
│            資料層 (Data Layer)               │
│      Cloudflare D1 (SQLite Database)         │
│         未來: KV Storage + R2 Storage         │
└─────────────────────────────────────────────┘
                      ↓
┌─────────────────────────────────────────────┐
│           部署平台 (Deployment)              │
│   Cloudflare Pages / Docker / Render         │
└─────────────────────────────────────────────┘
```

---

## Docker 本機部署教學

### 前置需求
- Docker Desktop (版本 20.10+)
- Docker Compose (版本 1.29+)
- Git

### 部署步驟

#### 1. 克隆專案
```bash
git clone https://github.com/wchenyou/BestAposta.git
cd BestAposta
```

#### 2. 設定環境變數
```bash
# 創建 .env 文件
cat > .env << EOF
NODE_ENV=production
PORT=3000
# 如需 Cloudflare API，請加入以下設定
# CLOUDFLARE_API_TOKEN=your_token_here
EOF
```

#### 3. 使用 Docker Compose 啟動
```bash
# 建構並啟動容器
docker-compose up -d --build

# 查看容器狀態
docker-compose ps

# 查看容器日誌
docker-compose logs -f webapp

# 停止容器
docker-compose down

# 停止並移除所有資料
docker-compose down -v
```

#### 4. 資料庫初始化（首次部署）
```bash
# 進入容器
docker exec -it best-apostas-webapp bash

# 執行資料庫遷移
npx wrangler d1 migrations apply best-apostas-production --local

# 載入種子資料
npx wrangler d1 execute best-apostas-production --local --file=./seed.sql

# 退出容器
exit
```

#### 5. 訪問應用
- 主網站: http://localhost:3000
- 管理後台: http://localhost:3000/admin

### Docker 部署疑難排解

#### 問題 1: 埠號已被使用
```bash
# 修改 docker-compose.yml 中的埠號
ports:
  - "3001:3000"  # 改為其他埠號
```

#### 問題 2: 容器無法啟動
```bash
# 清理並重新建構
docker-compose down
docker system prune -f
docker-compose up --build
```

#### 問題 3: 資料庫連接問題
```bash
# 確保 .wrangler 目錄有正確權限
docker exec -it best-apostas-webapp bash
chmod -R 755 .wrangler
```

---

## Render 雲端部署教學

### 前置需求
- Render 帳號 (https://render.com)
- GitHub 帳號
- 專案已推送至 GitHub

### 部署步驟

#### 1. 在 Render Dashboard 創建新服務
1. 登入 Render Dashboard
2. 點擊 "New +" → "Web Service"
3. 連接您的 GitHub 帳號
4. 選擇 "BestAposta" 儲存庫

#### 2. 配置服務設定
```yaml
Name: best-apostas-webapp
Region: Oregon (US West) 或 Singapore (Asia)
Branch: main 或 master
Runtime: Node
Build Command: npm install && npm run build
Start Command: npx wrangler pages dev dist --ip 0.0.0.0 --port $PORT --compatibility-date 2025-09-17
Instance Type: Free 或 Starter ($7/月)
```

#### 3. 設定環境變數
在 Render Dashboard 中設定：
```
NODE_ENV = production
PORT = (自動生成)
CLOUDFLARE_API_TOKEN = your_cloudflare_token (選填)
```

#### 4. 使用 render.yaml 自動部署
專案已包含 `render.yaml` 配置文件，Render 會自動讀取並配置。

#### 5. 部署監控
```bash
# 查看部署狀態
- 在 Render Dashboard 查看 "Events" 標籤
- 查看 "Logs" 標籤監控應用日誌

# 健康檢查
- Render 會自動檢查 / 路徑
- 可在 Settings 中自訂健康檢查路徑
```

### Render 部署疑難排解

#### 問題 1: 建構失敗
- 檢查 package.json 是否有所有依賴
- 確保 Node.js 版本相容 (建議 20.x)

#### 問題 2: 啟動失敗
- 檢查 Start Command 是否正確
- 查看 Logs 中的錯誤訊息

#### 問題 3: 資料庫問題
- Render 不支援本地檔案系統寫入
- 需要使用外部資料庫服務（如 Supabase、Neon）

---

## Cloudflare Pages 部署教學

### 部署步驟

#### 1. 準備 Cloudflare 帳號
```bash
# 安裝 Wrangler CLI
npm install -g wrangler

# 登入 Cloudflare
wrangler login
```

#### 2. 創建 D1 資料庫
```bash
# 創建生產資料庫
npx wrangler d1 create best-apostas-production

# 將返回的 database_id 更新到 wrangler.jsonc
```

#### 3. 建構專案
```bash
npm install
npm run build
```

#### 4. 部署到 Cloudflare Pages
```bash
# 首次部署
npx wrangler pages project create best-apostas \
  --production-branch main \
  --compatibility-date 2025-09-17

# 部署應用
npx wrangler pages deploy dist --project-name best-apostas

# 設定環境變數
npx wrangler pages secret put API_KEY --project-name best-apostas
```

#### 5. 配置自訂網域（選填）
```bash
npx wrangler pages domain add example.com --project-name best-apostas
```

---

## 技術框架詳細說明

### 後端框架與工具

#### 1. Hono Framework (v4.0.0+)
- **用途**: 輕量級 Web 框架，專為 Cloudflare Workers 設計
- **特點**: 
  - 超快速路由匹配
  - TypeScript 原生支援
  - 中間件系統
  - 內建 CORS、JWT、驗證器
- **官方文件**: https://hono.dev

#### 2. Cloudflare Workers/Pages
- **用途**: 邊緣運算平台，全球分散式部署
- **特點**:
  - 零冷啟動
  - 全球 CDN
  - 自動擴展
  - DDoS 保護
- **限制**:
  - CPU 時間限制 (10ms 免費版)
  - 無檔案系統存取
  - 限制 Node.js API

#### 3. Cloudflare D1
- **用途**: SQLite 邊緣資料庫
- **特點**:
  - SQL 完整支援
  - 自動備份
  - 全球複製
- **使用情境**: 關聯式資料儲存

#### 4. Wrangler CLI (v3.78.0+)
- **用途**: Cloudflare 開發部署工具
- **功能**:
  - 本地開發伺服器
  - 資料庫管理
  - 部署管理
  - 密鑰管理

#### 5. TypeScript (v5.0.0+)
- **用途**: 類型安全的 JavaScript
- **配置**: tsconfig.json
- **編譯目標**: ES2022

#### 6. Vite (v5.0.0+)
- **用途**: 建構工具
- **功能**:
  - 快速 HMR
  - TypeScript 編譯
  - 資產優化
- **配置**: vite.config.ts

### 前端框架與工具

#### 1. Tailwind CSS (v3.4.0 via CDN)
- **用途**: 實用優先的 CSS 框架
- **特點**:
  - 原子化 CSS
  - 響應式設計
  - 深色模式支援
- **載入方式**: CDN Script

#### 2. HTM + Preact
- **用途**: 管理後台的輕量級 React 替代方案
- **特點**:
  - 無需建構步驟
  - JSX-like 語法
  - 3KB gzipped
- **使用位置**: /admin 管理介面

#### 3. Font Awesome (v6.4.0)
- **用途**: 圖示庫
- **載入方式**: CDN Link
- **使用圖示**: 導航、按鈕、狀態指示

#### 4. 原生 JavaScript (ES6+)
- **用途**: 前端互動邏輯
- **功能**:
  - 表單處理
  - AJAX 請求
  - DOM 操作
  - 語言切換

### 開發工具

#### 1. PM2
- **用途**: Node.js 程序管理器
- **功能**:
  - 守護進程
  - 日誌管理
  - 自動重啟
- **配置**: ecosystem.config.cjs

#### 2. Git
- **用途**: 版本控制
- **分支策略**: main/master 主分支
- **忽略文件**: .gitignore

#### 3. Docker
- **用途**: 容器化部署
- **映像基礎**: node:20-slim
- **編排工具**: Docker Compose

#### 4. npm
- **用途**: 套件管理器
- **腳本**: package.json scripts
- **依賴管理**: package-lock.json

### 第三方服務整合

#### 1. Cloudflare API
- **用途**: 部署與管理
- **認證**: API Token
- **SDK**: Wrangler

#### 2. GitHub
- **用途**: 程式碼託管
- **整合**: GitHub Actions (可選)
- **認證**: Personal Access Token

#### 3. 圖片處理
- **Base64 編碼**: 小圖片直接儲存於 D1
- **限制**: 單張圖片最大 2MB
- **未來**: 整合 Cloudflare R2

---

## 專案檔案結構說明

### 根目錄檔案

#### 配置檔案
- **package.json**: Node.js 專案配置，包含依賴、腳本命令
- **package-lock.json**: 鎖定依賴版本，確保一致性
- **tsconfig.json**: TypeScript 編譯器配置
- **vite.config.ts**: Vite 建構工具配置
- **wrangler.jsonc**: Cloudflare Workers 配置（支援註解）
- **ecosystem.config.cjs**: PM2 程序管理配置

#### 部署檔案
- **Dockerfile**: Docker 映像建構指令
- **docker-compose.yml**: Docker Compose 服務編排
- **.dockerignore**: Docker 建構忽略清單
- **render.yaml**: Render 平台自動部署配置

#### 其他檔案
- **.gitignore**: Git 版本控制忽略清單
- **README.md**: 專案說明文件（簡化版）
- **README_COMPLETE.md**: 完整技術文件（本文件）

### 源碼目錄 (/src)

#### /src/index.tsx
- **用途**: 應用程式主入口
- **功能**:
  - 初始化 Hono 應用
  - 設定路由
  - 載入中間件
  - 處理語言偵測
  - 整合所有頁面和 API

#### /src/types/index.ts
- **用途**: TypeScript 類型定義
- **內容**:
  - Cloudflare Bindings 類型
  - 資料模型介面
  - API 回應類型
  - 通用類型定義

### 頁面目錄 (/src/pages)

#### 核心頁面
- **layout.ts**: 主要版面配置模板，所有頁面共用
- **home.ts**: 首頁，展示精選賭場和玩家類型
- **casinos.ts**: 所有賭場列表頁面
- **casino.ts**: 個別賭場詳細資訊頁面
- **blog.ts**: 部落格文章列表和詳細頁面
- **contact.ts**: 聯絡資訊頁面
- **admin.ts**: 管理後台主要介面

#### 備份檔案（開發歷史）
- **admin_*.ts**: 管理介面的各個開發版本
- **casino_old.ts**: 賭場頁面舊版本
- **casino_new.ts**: 賭場頁面新版本測試

### API 路由目錄 (/src/routes)

#### api.ts
- **用途**: 主要 API 端點
- **端點**:
  - `/api/admin/*`: 管理功能
  - `/api/casinos`: 賭場資料
  - `/api/blog`: 部落格操作
  - `/api/contact`: 聯絡設定

#### local-upload.ts
- **用途**: 本地圖片上傳處理
- **功能**:
  - 接收 multipart/form-data
  - Base64 編碼儲存
  - 大小限制檢查

#### casino-api.ts
- **用途**: 賭場相關 API
- **功能**:
  - CRUD 操作
  - 多語言內容管理
  - 玩家類型關聯

#### upload-api.ts
- **用途**: 檔案上傳 API
- **功能**:
  - 圖片驗證
  - 儲存管理
  - CDN 整合（未來）

### 工具目錄 (/src/utils)

#### language.ts
- **用途**: 多語言支援
- **功能**:
  - 語言偵測（cookie、IP）
  - 翻譯字典管理
  - 語言切換邏輯

#### auth.ts
- **用途**: 認證授權
- **功能**:
  - JWT 生成與驗證
  - 管理員登入驗證
  - 會話管理

#### image-upload.ts
- **用途**: 圖片上傳處理
- **功能**:
  - 檔案驗證
  - Base64 轉換
  - 大小限制

### 公開檔案目錄 (/public)

#### /public/static/
- **admin.js**: 管理後台 JavaScript
- **styles.css**: 自訂樣式（如有）
- **其他靜態資源**: 圖片、字體等

### 資料庫遷移目錄 (/migrations)

#### 遷移檔案（按順序執行）
1. **0001_initial_schema.sql**: 初始資料庫結構
2. **0004a_casino_info.sql**: 賭場資訊表
3. **0005a_casinos_only.sql**: 賭場基本資料
4. **0006_brazilian_casinos_complete.sql**: 巴西賭場完整資料
5. **0007_player_type_associations.sql**: 玩家類型關聯
6. **0008_sample_blog_posts.sql**: 範例部落格文章
7. **0009_update_admin_credentials.sql**: 更新管理員憑證

#### 資料檔案
- **seed.sql**: 測試資料種子檔
- **update-logos.sql**: 更新賭場 Logo
- **update-logos-placeholder.sql**: Logo 佔位符

### 建構輸出目錄 (/dist)

#### 自動生成檔案
- **_worker.js**: 編譯後的 Worker 程式碼
- **_routes.json**: 路由配置
- **/static/**: 靜態資源
- **其他編譯資產**: JS、CSS 等

---

## 資料庫架構

### 資料表結構

#### 1. admin_users (管理員用戶)
```sql
CREATE TABLE admin_users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    last_login DATETIME
);
```

#### 2. casinos (賭場基本資訊)
```sql
CREATE TABLE casinos (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    slug TEXT UNIQUE NOT NULL,
    name TEXT NOT NULL,
    logo_url TEXT,
    affiliate_link TEXT,
    rating REAL DEFAULT 0,
    is_featured BOOLEAN DEFAULT 0,
    is_active BOOLEAN DEFAULT 1,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
```

#### 3. casino_info (賭場詳細資訊 - 多語言)
```sql
CREATE TABLE casino_info (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    casino_id INTEGER NOT NULL,
    language TEXT NOT NULL,
    welcome_bonus TEXT,
    license_info TEXT,
    established_year INTEGER,
    payment_methods TEXT,
    support_languages TEXT,
    -- 20+ 其他欄位...
    FOREIGN KEY (casino_id) REFERENCES casinos(id),
    UNIQUE(casino_id, language)
);
```

#### 4. blog_posts (部落格文章)
```sql
CREATE TABLE blog_posts (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    slug TEXT UNIQUE NOT NULL,
    title TEXT NOT NULL,
    content TEXT NOT NULL,
    excerpt TEXT,
    featured_image TEXT,
    category_id INTEGER,
    language TEXT DEFAULT 'en',
    status TEXT DEFAULT 'draft',
    views INTEGER DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (category_id) REFERENCES blog_categories(id)
);
```

#### 5. player_types (玩家類型)
```sql
CREATE TABLE player_types (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    slug TEXT UNIQUE NOT NULL,
    name_en TEXT NOT NULL,
    name_pt TEXT NOT NULL,
    name_zh TEXT NOT NULL,
    description_en TEXT,
    description_pt TEXT,
    description_zh TEXT,
    icon TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
```

#### 6. player_type_casinos (玩家類型與賭場關聯)
```sql
CREATE TABLE player_type_casinos (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    player_type_id INTEGER NOT NULL,
    casino_id INTEGER NOT NULL,
    priority INTEGER DEFAULT 0,
    FOREIGN KEY (player_type_id) REFERENCES player_types(id),
    FOREIGN KEY (casino_id) REFERENCES casinos(id),
    UNIQUE(player_type_id, casino_id)
);
```

### 資料庫索引
```sql
-- 效能優化索引
CREATE INDEX idx_casinos_slug ON casinos(slug);
CREATE INDEX idx_casinos_active ON casinos(is_active);
CREATE INDEX idx_casino_info_casino_lang ON casino_info(casino_id, language);
CREATE INDEX idx_blog_posts_slug ON blog_posts(slug);
CREATE INDEX idx_blog_posts_language ON blog_posts(language);
CREATE INDEX idx_player_type_casinos ON player_type_casinos(player_type_id, casino_id);
```

---

## API 端點文件

### 公開 API 端點

#### GET /api/casinos
- **描述**: 獲取所有活躍賭場
- **參數**: 
  - `lang`: 語言代碼 (en/pt/zh)
  - `featured`: 是否只顯示精選
- **回應**: 賭場列表 JSON

#### GET /api/casinos/:slug
- **描述**: 獲取單一賭場詳細資訊
- **參數**:
  - `slug`: 賭場代碼
  - `lang`: 語言代碼
- **回應**: 賭場詳細資訊 JSON

#### GET /api/blog
- **描述**: 獲取部落格文章列表
- **參數**:
  - `lang`: 語言代碼
  - `category`: 分類 ID
  - `page`: 頁碼
- **回應**: 文章列表 JSON

#### GET /api/player-types
- **描述**: 獲取玩家類型
- **參數**: `lang`: 語言代碼
- **回應**: 玩家類型列表

### 管理 API 端點 (需要認證)

#### POST /api/admin/login
- **描述**: 管理員登入
- **內容**: `{username, password}`
- **回應**: JWT Token

#### POST /api/admin/casinos
- **描述**: 創建新賭場
- **認證**: Bearer Token
- **內容**: 賭場資料 JSON
- **回應**: 創建的賭場資料

#### PUT /api/admin/casinos/:id
- **描述**: 更新賭場資訊
- **認證**: Bearer Token
- **內容**: 更新資料 JSON
- **回應**: 更新後的資料

#### DELETE /api/admin/casinos/:id
- **描述**: 刪除賭場
- **認證**: Bearer Token
- **回應**: 成功/失敗狀態

#### POST /admin/upload-local
- **描述**: 上傳圖片（Base64）
- **認證**: Bearer Token
- **內容**: multipart/form-data
- **限制**: 2MB
- **回應**: 圖片 URL

---

## 開發指南

### 本地開發環境設定

#### 1. 安裝依賴
```bash
npm install
```

#### 2. 初始化資料庫
```bash
# 創建本地 D1 資料庫
npx wrangler d1 migrations apply best-apostas-production --local

# 載入測試資料
npx wrangler d1 execute best-apostas-production --local --file=./seed.sql
```

#### 3. 啟動開發伺服器
```bash
# 使用 PM2
pm2 start ecosystem.config.cjs

# 或直接使用 Wrangler
npm run dev:sandbox
```

### 程式碼風格指南

#### TypeScript 規範
```typescript
// 使用明確的類型定義
interface CasinoData {
  id: number;
  name: string;
  slug: string;
}

// 使用 async/await 而非 callbacks
async function getCasino(slug: string): Promise<CasinoData> {
  // ...
}

// 錯誤處理
try {
  const result = await someOperation();
} catch (error) {
  console.error('Operation failed:', error);
  throw new Error('Custom error message');
}
```

#### HTML/CSS 規範
```html
<!-- 使用語意化 HTML -->
<article class="casino-card">
  <header>
    <h2>Casino Name</h2>
  </header>
  <main>
    <!-- content -->
  </main>
</article>

<!-- Tailwind CSS 類別順序 -->
<div class="
  /* 定位 */ absolute top-0 left-0
  /* 盒模型 */ p-4 m-2
  /* 顯示 */ flex items-center
  /* 外觀 */ bg-white rounded-lg shadow-md
  /* 文字 */ text-gray-800 font-bold
  /* 動畫 */ transition hover:shadow-lg
">
```

### 測試指南

#### 單元測試（未來實施）
```bash
# 執行測試
npm test

# 測試覆蓋率
npm run test:coverage
```

#### 手動測試檢查清單
- [ ] 首頁載入正常
- [ ] 語言切換功能
- [ ] 賭場詳細頁面
- [ ] 部落格文章顯示
- [ ] 管理後台登入
- [ ] 圖片上傳功能
- [ ] 響應式設計（手機/平板）
- [ ] 表單驗證
- [ ] 錯誤頁面

### Git 工作流程

#### 分支策略
```bash
main/master  # 生產環境分支
  ├── feature/casino-update  # 功能開發
  ├── bugfix/header-issue    # 錯誤修復
  └── hotfix/security-patch  # 緊急修復
```

#### 提交訊息規範
```bash
# 功能
git commit -m "feat: 新增賭場比較功能"

# 修復
git commit -m "fix: 修正首頁顯示問題"

# 文件
git commit -m "docs: 更新 API 文件"

# 樣式
git commit -m "style: 調整首頁排版"

# 重構
git commit -m "refactor: 重構賭場 API"

# 測試
git commit -m "test: 新增單元測試"

# 維護
git commit -m "chore: 更新依賴版本"
```

---

## 維護與更新

### 日常維護任務

#### 每日
- 檢查應用健康狀態
- 監控錯誤日誌
- 檢查資源使用率

#### 每週
- 更新部落格內容
- 檢查並更新賭場資訊
- 備份資料庫

#### 每月
- 更新依賴套件
- 效能優化檢查
- 安全性掃描

### 更新依賴

```bash
# 檢查過時的套件
npm outdated

# 更新所有依賴（小心執行）
npm update

# 更新特定套件
npm install package-name@latest

# 安全性修復
npm audit fix
```

### 資料庫備份與還原

#### 備份
```bash
# 本地備份
npx wrangler d1 export best-apostas-production --local --output=backup.sql

# 生產環境備份
npx wrangler d1 export best-apostas-production --output=backup-prod.sql
```

#### 還原
```bash
# 還原到本地
npx wrangler d1 execute best-apostas-production --local --file=backup.sql

# 還原到生產環境（謹慎操作）
npx wrangler d1 execute best-apostas-production --file=backup-prod.sql
```

### 監控與日誌

#### PM2 監控
```bash
# 查看狀態
pm2 status

# 查看日誌
pm2 logs

# 監控面板
pm2 monit
```

#### Cloudflare Analytics
- 訪問 Cloudflare Dashboard
- 查看 Workers Analytics
- 監控請求數、錯誤率、延遲

### 效能優化建議

#### 前端優化
1. 圖片懶加載
2. CSS/JS 最小化
3. 使用 CDN
4. 瀏覽器快取

#### 後端優化
1. 資料庫查詢優化
2. API 回應快取
3. 邊緣快取策略
4. 減少 API 呼叫

#### 資料庫優化
1. 適當的索引
2. 查詢優化
3. 定期清理
4. 分頁查詢

### 安全性最佳實踐

#### 認證與授權
- 使用強密碼
- JWT Token 過期時間
- HTTPS only
- CORS 配置

#### 資料保護
- SQL 注入防護
- XSS 防護
- CSRF 防護
- 輸入驗證

#### 環境變數
- 不提交 .env 檔案
- 使用密鑰管理服務
- 定期更換密鑰
- 最小權限原則

---

## 疑難排解

### 常見問題與解決方案

#### 問題: 資料庫連接錯誤
```bash
# 解決方案
1. 檢查 wrangler.jsonc 中的資料庫配置
2. 確認資料庫已創建
3. 重新執行遷移
npx wrangler d1 migrations apply best-apostas-production --local
```

#### 問題: 建構失敗
```bash
# 解決方案
1. 清理快取
rm -rf node_modules dist .wrangler
2. 重新安裝依賴
npm ci
3. 重新建構
npm run build
```

#### 問題: 部署失敗
```bash
# 解決方案
1. 檢查 Cloudflare API Token 權限
2. 確認專案名稱唯一
3. 檢查檔案大小限制（10MB）
4. 查看詳細錯誤日誌
wrangler pages deploy dist --project-name best-apostas --log-level debug
```

#### 問題: 圖片上傳失敗
```bash
# 解決方案
1. 檢查檔案大小（最大 2MB）
2. 確認檔案格式（JPG/PNG/WebP）
3. 檢查 Base64 編碼
4. 確認資料庫欄位大小
```

---

## 聯絡與支援

### 專案資訊
- **GitHub**: https://github.com/wchenyou/BestAposta
- **問題回報**: GitHub Issues
- **文件版本**: 1.0.0
- **最後更新**: 2025-09-18

### 開發團隊
- 主要開發者: [您的名字]
- 技術支援: [支援信箱]

### 授權
本專案採用 [選擇適當的授權] 授權。

---

## 附錄

### 實用命令速查

```bash
# 開發
npm run dev              # 啟動開發伺服器
npm run build           # 建構專案
npm run preview         # 預覽建構結果

# 資料庫
npm run db:migrate:local    # 本地遷移
npm run db:migrate:prod     # 生產遷移
npm run db:seed            # 載入種子資料
npm run db:reset           # 重置資料庫

# 部署
npm run deploy            # 部署到 Cloudflare
docker-compose up -d      # Docker 部署
pm2 start ecosystem.config.cjs  # PM2 啟動

# 維護
npm run clean            # 清理建構檔案
npm audit fix           # 修復安全性問題
pm2 logs               # 查看日誌
```

### 環境變數參考

```env
# 基本設定
NODE_ENV=production|development
PORT=3000

# Cloudflare
CLOUDFLARE_API_TOKEN=your_token
CLOUDFLARE_ACCOUNT_ID=your_account_id

# 資料庫（如使用外部服務）
DATABASE_URL=your_database_url

# 認證
JWT_SECRET=your_jwt_secret
ADMIN_USERNAME=admin
ADMIN_PASSWORD=secure_password

# 第三方服務（選填）
ANALYTICS_ID=your_analytics_id
SENTRY_DSN=your_sentry_dsn
```

---

本文件為 Seu Melhor Cassino 專案的完整技術文件，包含所有部署方式、技術細節和維護指南。請定期更新此文件以反映專案的最新狀態。