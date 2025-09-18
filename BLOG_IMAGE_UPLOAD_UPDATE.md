# 部落格文章圖片上傳功能更新完成

## 更新日期
2025-01-18

## 更新內容
已成功將部落格文章 (Blog Posts) 的特色圖片 (Featured Image) 上傳功能更新為與賭場 logo 相同的實現方式。

## 主要變更

### 1. 更新檔案
- **檔案**: `/home/user/webapp/src/pages/admin.ts`
- **位置**: BlogPostForm 元件 (lines 1576-1644)

### 2. 功能改進

#### 之前的實現 (僅客戶端)
- 只在客戶端將圖片轉換為 base64
- 沒有真正上傳到伺服器
- 圖片資料儲存在文章記錄中，可能造成資料庫負擔

#### 更新後的實現 (伺服器端儲存)
- 使用 FormData 上傳圖片到伺服器
- 支援多重儲存方式：
  1. **本地 D1 資料庫** (`/admin/upload-local`) - 最大 2MB，透過 `/api/images/:id` 提供服務
  2. **Cloudflare R2** (`/admin/upload-r2`) - 大檔案儲存（需配置）
  3. **外部服務** (`/admin/upload-image`) - imgbb.com API 作為備用

### 3. 使用者體驗改善

- **上傳狀態顯示**: 顯示 "Uploading image..." 載入提示
- **自動 URL 更新**: 上傳成功後自動填入圖片 URL
- **改進的預覽**: 
  - 顯示圖片來源（資料庫、R2、外部）
  - 錯誤處理與圖片載入失敗的替代顯示
  - 顯示部分 URL 資訊
- **錯誤處理**: 上傳失敗時保留原始 URL 並顯示錯誤訊息

## 測試步驟

1. 登入管理後台：https://[your-domain]/admin
   - 使用者名稱：wchenyou
   - 密碼：Aaron12345678

2. 進入 Blog 管理頁面

3. 點擊 "Add Post" 新增文章或編輯現有文章

4. 在 "Featured Image" 欄位：
   - 點擊 "Upload" 按鈕選擇圖片
   - 觀察上傳過程中的載入提示
   - 確認 URL 自動更新
   - 檢查圖片預覽顯示

5. 儲存文章並檢查前台顯示

## 技術實現細節

### 上傳流程
```javascript
1. 檔案選擇 → 建立 FormData
2. 顯示 "uploading..." 狀態
3. 依序嘗試上傳端點：
   - /admin/upload-local (D1 資料庫，最大 2MB)
   - /admin/upload-r2 (R2 bucket，需配置)
   - /admin/upload-image (外部服務備用)
4. 成功後更新 formData.featured_image
5. 顯示成功訊息和圖片預覽
```

### 程式碼範例
```javascript
// 建立 FormData
const uploadData = new FormData();
uploadData.append('image', file);

// 上傳到伺服器
let res = await apiCall('/admin/upload-local', {
    method: 'POST',
    body: uploadData,
    headers: {} // 讓瀏覽器自動設置 multipart headers
});

// 處理回應
if (res.ok) {
    const data = await res.json();
    const finalUrl = data.directUrl || data.url;
    setFormData(prev => ({
        ...prev,
        featured_image: finalUrl
    }));
}
```

## 相容性
- 與現有資料庫結構完全相容
- 支援已存在的外部圖片 URL
- 可以處理 base64 編碼的圖片
- 與賭場 logo 使用相同的上傳機制

## 注意事項
1. 檔案大小限制：最大 10MB
2. 小於 2MB 的圖片會儲存在 D1 資料庫
3. 大於 2MB 的圖片需要配置 R2 或使用外部服務
4. 所有上傳的圖片都有持久化的 URL

## 相關檔案
- 管理後台：`/src/pages/admin.ts`
- 本地上傳 API：`/src/routes/local-upload.ts`
- 上傳 API：`/src/routes/upload-api.ts`
- 資料庫遷移：`/migrations/0004a_casino_info.sql` (uploaded_images 表)

## 下一步建議
1. 考慮實現圖片壓縮功能以節省儲存空間
2. 添加圖片格式驗證（只允許 jpg, png, webp 等）
3. 實現圖片管理介面，查看和刪除已上傳的圖片
4. 考慮添加圖片 CDN 加速