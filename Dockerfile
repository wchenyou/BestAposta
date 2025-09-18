# 使用 Node.js 官方映像作為基礎
FROM node:20-slim

# 安裝 PM2 全域工具
RUN npm install -g pm2

# 設定工作目錄
WORKDIR /app

# 複製 package.json 和 package-lock.json
COPY package*.json ./

# 安裝依賴
RUN npm ci --only=production

# 複製所有專案檔案
COPY . .

# 建構專案
RUN npm run build

# 暴露埠號
EXPOSE 3000

# 使用 PM2 啟動應用
CMD ["pm2-runtime", "start", "ecosystem.config.cjs"]