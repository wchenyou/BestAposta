# Seu Melhor Cassino (您的最佳赌场)

## 项目概述
- **名称**: Seu Melhor Cassino (您的最佳赌场)
- **目标**: 巴西在线赌场综合评论和比较平台
- **功能**: 多语言支持（PT/EN/ZH）、赌场比较、博客系统、玩家类型匹配
- **目标受众**: 巴西和国际在线赌场玩家

## 网址
- **生产环境**: https://your-project.pages.dev (待部署)
- **GitHub**: https://github.com/wchenyou/BestAposta
- **本地开发**: http://localhost:3000

## 主要功能

### ✅ 已完成功能
1. **多语言支持** - 完整的 PT/EN/ZH 翻译
2. **12家巴西赌场** - 所有主要赌场的完整信息：
   - Betwinner、22BET、BETANO、BET365、1xBET
   - Estrela Bet、Blaze、BR4BET、Lottoland
   - Seguro Bet、Bateu Bet、Brazino777
3. **玩家类型匹配** - 5个玩家类别与赌场推荐
4. **博客系统** - 多语言博客与标签式编辑器
5. **管理后台** - 完整的管理界面包括：
   - 赌场管理与Logo上传
   - 博客文章编辑器与语言标签
   - 玩家类型管理
   - 类别管理
   - 联系设置
6. **响应式设计** - 移动设备友好界面
7. **SEO优化** - 适当的meta标签和结构

### 🔄 进行中功能
- 目前无

### 📋 建议下一步
1. **部署到Cloudflare Pages** 生产环境
2. **新增更多博客内容** 以改善SEO
3. **实施用户评论/评分** 系统
4. **新增赌场比较工具** 进行并排比较
5. **整合分析工具**（Google Analytics或类似工具）
6. **新增电子报订阅** 功能
7. **实施联盟链接跟踪**

## 数据架构
- **数据库**: Cloudflare D1 (SQLite)
- **存储服务**: 
  - D1用于关联数据（赌场、博客文章、玩家类型）
  - 未来：KV用于会话数据、R2用于图片存储
- **数据模型**:
  - `casino_info` - 3种语言的赌场详情
  - `blog_posts` - 多语言支持的博客文章
  - `blog_categories` - 博客分类
  - `player_types` - 玩家分类
  - `player_type_casinos` - 赌场关联
  - `contact_settings` - 网站联系信息

## 技术堆栈
- **框架**: Hono (Cloudflare Workers)
- **数据库**: Cloudflare D1
- **前端**: Vanilla JS + HTM (Preact) 用于管理后台
- **样式**: Tailwind CSS (CDN)
- **图标**: Font Awesome
- **部署**: Cloudflare Pages
- **开发**: Vite + Wrangler

## 使用指南

### 访客使用
1. 在首页浏览赌场
2. 点击「查看详情」查看完整赌场信息
3. 使用右上角语言切换器（PT/EN/ZH）
4. 在「玩家类型」区域按类型寻找赌场
5. 阅读博客文章获取提示和指南
6. 点击「立即游戏」访问赌场网站

### 管理员使用
1. 在 `/admin` 访问管理后台
2. 管理赌场、博客文章和设置
3. 在表单中直接上传赌场Logo
4. 使用语言标签处理多语言内容
5. 发布前预览变更

## 开发

### 设置
```bash
npm install
npm run build
```

### 本地开发
```bash
# 使用PM2启动
pm2 start ecosystem.config.cjs

# 或直接使用wrangler
npm run dev:sandbox
```

### 数据库管理
```bash
# 在本地应用迁移
npm run db:migrate:local

# 重置数据库
npm run db:reset
```

## 部署
- **平台**: Cloudflare Pages
- **状态**: ✅ 准备部署
- **分支**: master
- **最后更新**: 2025-09-18

### 部署指令
```bash
# 构建项目
npm run build

# 部署到Cloudflare Pages
wrangler pages deploy dist --project-name seu-melhor-cassino
```

## 最近更新 (2025-09-18)
- ✅ 修复管理后台空白页面问题
- ✅ 博客文章图片上传改为使用服务器端存储（与赌场Logo相同）
- ✅ 优化博客文章精选图片长宽比例以获得更好显示效果
- ✅ 减少首页赌场卡片的留白（改为6栏布局）
- ✅ 移除赌场Logo的内边距/边框
- ✅ 修复移动设备首页按钮拉伸过高的问题
- ✅ 对齐移动设备按钮的图标与文字在同一行
- ✅ 更新导航标签：「首页」→「个性化推荐」，「赌场」→「所有赌场」
- ✅ 更新导航图标以匹配新标签（fa-magic、fa-list）
- ✅ 将所有「Visit Casino」按钮改为「Play Now」并使用绿色
- ✅ 实施基于IP的语言检测（巴西IP显示葡萄牙语）
- ✅ 修复赌场详细页面的标头不一致问题（使用统一的renderLayout函数）
- ✅ **手机版博客分类选择器置顶固定**（sticky positioning，不会随页面滚动消失）
- ✅ **全站繁体中文转简体中文**（界面文字统一使用简体中文）

## 之前更新 (2024-01-17)
- ✅ 网站从「Best Apostas」更名为「Seu Melhor Cassino」
- ✅ 新增12家巴西赌场的完整信息
- ✅ 实施博客系统与3篇示例文章
- ✅ 博客编辑器新增语言标签
- ✅ 赌场新增Logo上传功能
- ✅ 修复玩家类型关联（无最低要求）
- ✅ 更新首页标语和CTA
- ✅ 在赌场页面底部新增「立即游戏」按钮
- ✅ 修复赌场在玩家类型类别中的显示问题
- ✅ 将博客标题改为「相关文章」
- ✅ 调整博客列表图片为16:9比例

## 📚 完整技术文档
详细的技术文档、部署教学、文件结构说明请参阅：
👉 **[README_COMPLETE.md](./README_COMPLETE.md)**

### 文档包含内容：
- Docker 本地部署完整教学
- Render 云端部署完整教学  
- Cloudflare Pages 部署教学
- 所有技术框架详细说明
- 项目文件结构与每个文件说明
- API 端点文档
- 数据库架构说明
- 开发指南与最佳实践
- 维护与更新指南
- 疑难解决方案

## 快速部署指南

### 🐳 Docker 部署（本地）
```bash
# 克隆项目
git clone https://github.com/wchenyou/BestAposta.git
cd BestAposta

# 使用 Docker Compose 启动
docker-compose up -d --build

# 访问 http://localhost:3000
```

### 🚀 Render 部署（云端）
1. Fork 此项目到您的 GitHub
2. 在 Render Dashboard 创建新 Web Service
3. 连接 GitHub 存储库
4. Render 会自动读取 `render.yaml` 配置
5. 点击部署

### ☁️ Cloudflare Pages 部署
```bash
# 安装 Wrangler
npm install -g wrangler

# 登录并部署
wrangler login
npm run build
npx wrangler pages deploy dist --project-name your-project-name
```

## 技术栈概览
- **后端**: Hono Framework + Cloudflare Workers
- **数据库**: Cloudflare D1 (SQLite)
- **前端**: Tailwind CSS + Vanilla JS + HTM (管理界面)
- **部署**: Docker / Render / Cloudflare Pages
- **构建**: Vite + TypeScript
- **进程管理**: PM2

## 联系方式
如有问题或需要支持，请通过管理后台联系设置进行联系。

---
📖 **完整文档请查看 [README_COMPLETE.md](./README_COMPLETE.md)**