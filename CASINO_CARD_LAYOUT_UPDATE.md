# 首頁娛樂城卡片版面優化

## 更新日期
2025-01-18

## 問題描述
電腦版首頁的娛樂城圖片卡片左右兩邊留白太多，卡片太寬導致圖片顯示不美觀。

## 解決方案

### 1. 調整網格佈局
**之前**: 
- 桌面版：5 欄 (`lg:grid-cols-5`)
- 卡片較寬，左右留白多

**現在**: 
- 手機：2 欄 (`grid-cols-2`)
- 小平板：3 欄 (`sm:grid-cols-3`)
- 平板：4 欄 (`md:grid-cols-4`)
- 桌面：6 欄 (`lg:grid-cols-6`)
- 間距從 `gap-4` 縮小到 `gap-3`

### 2. 優化圖片容器
**改進內容**:
- 高度從 `h-16` 增加到 `h-20` (80px)
- 添加內邊距 `p-3` 讓圖片不會貼邊
- 背景漸層效果：`from-gray-50 to-white`
- Hover 效果：背景變為紫色調
- 圖片使用 `max-w-full max-h-full` 確保不溢出
- 添加錯誤處理，圖片載入失敗時顯示文字

### 3. 容器寬度優化
- 從 `container mx-auto` 改為 `max-w-7xl mx-auto`
- 最大寬度 80rem (1280px)，減少兩側留白
- 讓內容區域更緊湊

### 4. 視覺改進
- 卡片陰影從 `shadow-lg` 改為 `shadow-md`
- Hover 時陰影加強：`hover:shadow-xl`
- 添加群組 hover 效果 (`group`)
- 名稱區域背景會在 hover 時變色
- 圖片 hover 時輕微提亮 `brightness(1.05)`

### 5. 文字優化
- 卡片名稱文字大小從 `text-sm` 改為 `text-xs`
- 添加 `truncate` 防止文字過長
- 描述文字添加 `line-clamp-1` 限制為單行

## 技術細節

### 響應式網格
```html
<!-- 6欄佈局，更緊湊的顯示 -->
<div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
```

### 圖片容器優化
```html
<div class="h-20 p-3 flex items-center justify-center bg-gradient-to-b from-gray-50 to-white">
    <img class="max-w-full max-h-full object-contain" style="width: auto; height: auto;">
</div>
```

## 視覺效果對比

### 之前
- 5 欄佈局，卡片較寬
- 圖片高度 64px，可能被裁切
- 大量側邊留白

### 之後
- 6 欄佈局，卡片更緊湊
- 圖片高度 80px，顯示更完整
- 減少側邊留白，內容更集中
- 更好的 hover 互動效果

## 更新的檔案
- `/src/pages/home.ts` - 首頁渲染元件
- `/src/pages/layout.ts` - 全局樣式

## 優點
1. **更好的空間利用**: 減少留白，顯示更多內容
2. **圖片顯示優化**: 增加高度，避免過度裁切
3. **響應式設計**: 各種螢幕尺寸都有最佳顯示
4. **互動體驗提升**: 更細緻的 hover 效果
5. **性能優化**: 使用 CSS 漸變和過渡效果

## 下一步建議
1. 考慮添加圖片懶載入優化載入速度
2. 可以為不同玩家類型使用不同的背景色
3. 添加載入骨架屏提升體驗
4. 考慮實現拖放排序功能