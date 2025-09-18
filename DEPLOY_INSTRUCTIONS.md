# 部署指南 - v1.0 版本

## GitHub 推送指令

由於環境限制，請在您的本地環境執行以下命令來推送代碼到 GitHub：

### 1. 下載專案備份
下載連結：https://page.gensparksite.com/project_backups/toolu_01RvZyhdKbeuw4K17NBur1Jf.tar.gz

### 2. 解壓並推送到 GitHub
```bash
# 解壓檔案
tar -xzf best-apostas-v1.0-final-2025-09-18.tar.gz
cd home/user/webapp

# 設置 Git 遠端（如果需要）
git remote add origin https://github.com/wchenyou/BestAposta.git

# 推送到 master 分支
git push -u origin master

# 推送 v1.0 標籤
git push origin v1.0
```

### 3. 在 GitHub 創建 Release
1. 訪問 https://github.com/wchenyou/BestAposta/releases
2. 點擊 "Create a new release"
3. 選擇標籤 "v1.0"
4. 標題：Version 1.0 - Production Ready
5. 描述內容：

```markdown
## 🎉 Version 1.0 - Production Ready

### 主要功能
- ✅ 完整的多語言支持 (PT/EN/ZH簡體中文)
- ✅ 12家巴西賭場完整資訊
- ✅ 博客系統與多語言內容管理
- ✅ 管理後台功能
- ✅ 響應式設計（手機/平板/桌面）
- ✅ SEO優化
- ✅ 玩家類型個性化推薦系統

### 技術特點
- **後端**: Hono Framework + Cloudflare Workers
- **資料庫**: Cloudflare D1 (SQLite)
- **前端**: Tailwind CSS + Vanilla JS
- **部署支持**: Docker / Render / Cloudflare Pages

### 重要更新
- 界面全部使用簡體中文
- 修復所有已知問題
- 完整的技術文檔
- Docker 和 Render 部署配置

### 文檔
- 查看 [README.md](README.md) 獲取快速開始
- 查看 [README_COMPLETE.md](README_COMPLETE.md) 獲取完整技術文檔
```

## Cloudflare Pages 部署

### 1. 準備工作
```bash
# 構建項目
npm install
npm run build
```

### 2. 創建 Cloudflare 資料庫
```bash
# 創建 D1 資料庫
npx wrangler d1 create best-apostas-production

# 將返回的 database_id 更新到 wrangler.jsonc
```

### 3. 部署到 Cloudflare Pages
```bash
# 創建 Pages 項目
npx wrangler pages project create best-apostas \
  --production-branch master \
  --compatibility-date 2025-09-18

# 部署
npx wrangler pages deploy dist --project-name best-apostas

# 應用資料庫遷移
npx wrangler d1 migrations apply best-apostas-production
```

### 4. 設置環境變數（如需要）
```bash
# 設置密鑰
npx wrangler pages secret put API_KEY --project-name best-apostas
```

## Docker 本地部署

```bash
# 使用 Docker Compose
docker-compose up -d --build

# 訪問
http://localhost:3000
```

## Render 雲端部署

1. Fork 專案到您的 GitHub
2. 在 Render Dashboard 創建新 Web Service
3. 連接 GitHub 儲存庫
4. Render 會自動讀取 `render.yaml` 配置
5. 點擊部署

## 版本信息

- **版本號**: v1.0
- **發布日期**: 2025-09-18
- **狀態**: Production Ready
- **備份下載**: https://page.gensparksite.com/project_backups/toolu_01RvZyhdKbeuw4K17NBur1Jf.tar.gz