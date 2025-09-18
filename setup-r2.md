# Cloudflare R2 圖片儲存設定指南

## 步驟 1: 在 Cloudflare Dashboard 建立 R2 Bucket

1. 登入 [Cloudflare Dashboard](https://dash.cloudflare.com/)
2. 選擇您的帳號
3. 左側選單點擊 "R2"
4. 點擊 "Create Bucket"
5. 輸入 bucket 名稱：`casino-images`
6. 選擇地區（建議選擇離您最近的）
7. 點擊 "Create Bucket"

## 步驟 2: 設定公開存取

1. 在 R2 bucket 頁面，點擊 "Settings"
2. 在 "Public Access" 區塊，點擊 "Allow Public Access"
3. 複製 Public Bucket URL（類似：`https://pub-xxxxx.r2.dev`）

## 步驟 3: 建立 R2 API Token

1. 在 R2 頁面，點擊 "Manage R2 API Tokens"
2. 點擊 "Create API Token"
3. 選擇權限：
   - Object Read & Write
   - 選擇您的 bucket: `casino-images`
4. 點擊 "Create API Token"
5. 儲存以下資訊：
   - Access Key ID
   - Secret Access Key
   - Endpoint URL

## 步驟 4: 設定專案

在專案根目錄的 `.dev.vars` 檔案加入：

```
R2_ACCESS_KEY_ID=your_access_key_id
R2_SECRET_ACCESS_KEY=your_secret_access_key
R2_ENDPOINT=https://xxxxx.r2.cloudflarestorage.com
R2_PUBLIC_URL=https://pub-xxxxx.r2.dev
```

在 `wrangler.jsonc` 加入：

```json
{
  "r2_buckets": [
    {
      "binding": "R2_BUCKET",
      "bucket_name": "casino-images"
    }
  ]
}
```

## 注意事項

- R2 免費層包含：
  - 10 GB/月 儲存空間
  - 10 百萬次讀取操作/月
  - 1 百萬次寫入操作/月
- 超過免費層會產生費用
- 圖片會永久儲存直到您刪除