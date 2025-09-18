# 手機版首頁按鈕排版修復

## 更新日期
2025-01-18

## 問題描述
手機版首頁的兩個主要行動按鈕（"Encontre Seu Cassino Ideal" 和 "Artigos Relacionados"）排版異常，按鈕被拉得過高，影響視覺體驗。

## 解決方案

### 1. 分離桌面版與手機版布局
**之前**: 使用同一個 flex 容器，導致手機版按鈕被拉伸
**現在**: 
- 桌面版：水平並排顯示 (`hidden md:flex`)
- 手機版：垂直堆疊顯示 (`md:hidden flex flex-col`)

### 2. 手機版按鈕優化
- 使用 `flex-col` 垂直排列
- 設置 `space-y-3` 按鈕間距
- 限制最大寬度 `max-w-xs`
- 統一按鈕高度 `py-3`
- 文字居中 `text-center`
- 全寬顯示 `w-full`

### 3. 響應式文字大小
- 手機版按鈕文字：`text-base` (16px)
- 桌面版按鈕文字：`text-lg` (18px)

### 4. Hero Section 優化
- 手機版內邊距：`py-12` (48px)
- 桌面版內邊距：`py-20` (80px)
- 標題大小調整：
  - 手機：`text-3xl`
  - 平板：`text-4xl`
  - 桌面：`text-5xl`

## 技術實現

### 按鈕布局程式碼
```html
<!-- 桌面版：水平排列 -->
<div class="hidden md:flex justify-center space-x-4">
    <a href="#" class="...">按鈕1</a>
    <a href="#" class="...">按鈕2</a>
</div>

<!-- 手機版：垂直排列 -->
<div class="md:hidden flex flex-col items-center space-y-3">
    <a href="#" class="w-full max-w-xs text-center ...">按鈕1</a>
    <a href="#" class="w-full max-w-xs text-center ...">按鈕2</a>
</div>
```

## 視覺效果改善

### 之前的問題
- 按鈕高度不一致
- 文字可能被截斷
- 按鈕間距過大或過小
- 在小螢幕上按鈕過寬

### 修復後的效果
- ✅ 按鈕高度統一
- ✅ 適當的按鈕間距
- ✅ 文字完整顯示
- ✅ 按鈕寬度適中
- ✅ 良好的觸控目標大小

## 測試要點

### 不同設備測試
1. **iPhone SE (375px)**: 確認按鈕不會溢出
2. **iPhone 12 (390px)**: 檢查按鈕間距
3. **iPad (768px)**: 確認切換到桌面版布局
4. **Desktop (1024px+)**: 水平排列正常

### 不同語言測試
- 🇧🇷 葡萄牙語：較長文字
- 🇬🇧 英語：中等長度
- 🇨🇳 中文：較短文字

## 相關檔案
- `/src/pages/home.ts` - 首頁元件（第14-32行）

## 優化建議
1. 考慮使用 CSS Grid 替代 Flexbox 以獲得更好的控制
2. 可以添加按鈕點擊動畫效果
3. 考慮添加按鈕載入狀態
4. 可以實現按鈕 A/B 測試追蹤