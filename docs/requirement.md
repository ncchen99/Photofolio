# 攝影作品集網站規格書（Portfolio Photography Website Spec）

## 專案定位

建立一個以「影像展示」為核心的極簡攝影作品集網站。
網站重點為：

* 快速載入
* 大圖瀏覽體驗
* 響應式瀑布流排版
* 易於維護與新增作品
* 低成本長期運營

網站偏向：

* 靜態網站（Static Site）
* CDN 圖片分發
* 前端展示導向

---

# 一、技術架構規劃

## 1. 前期架構（MVP）

### 圖片存放方案

使用：

* [GitHub](https://github.com?utm_source=chatgpt.com) Repository
* [jsDelivr](https://www.jsdelivr.com/?utm_source=chatgpt.com) 作為 CDN

架構：

```txt
GitHub Repository
├── public/
│   ├── albums/
│   │   ├── tokyo/
│   │   ├── street/
│   │   └── portrait/
│   └── avatar/
```

圖片透過 jsDelivr CDN 存取：

```txt
https://cdn.jsdelivr.net/gh/{user}/{repo}/public/albums/tokyo/photo01.webp
```

---

## 2. 後期擴展架構（Scalable）

未來可逐步遷移至：

* [Cloudflare R2](https://www.cloudflare.com/developer-platform/r2/?utm_source=chatgpt.com)

用途：

* 原始高畫質圖片儲存
* 大量圖片管理
* 降低 Git Repository 體積
* 更佳 CDN 控制

---

## 3. 圖片格式規範

所有展示圖片統一轉換為：

* WebP 格式

原因：

* 檔案更小
* 更快載入
* 保持高畫質
* 支援現代瀏覽器

---

## 4. 圖片尺寸規範

### 展示圖（網站）

建議：

```txt
寬度：1200px 以下
格式：WebP
品質：90~95
```

### Thumbnail

```txt
寬度：400~600px
格式：WebP
```

---

## 5. 前端效能優化

### 必須實作

#### (a) Lazy Loading

使用：

```html
loading="lazy"
```

或：

* Intersection Observer API

避免一次載入全部圖片。

---

#### (b) 響應式圖片

支援：

```html
srcset
sizes
```

根據裝置載入適合尺寸。

---

#### (c) Blur Placeholder（建議）

圖片載入前：

* 顯示低解析模糊縮圖

提升觀感。

---

# 二、網站頁面規劃

---

# 1. 首頁（Home Page）

## 功能

展示：

* 攝影師資訊
* 相簿入口

---

## 版面結構

### (a) Hero 區塊

包含：

#### 攝影師資訊

* 頭像
* 名稱
* 地區
* 簡短介紹
* 社群連結

例如：

```txt
陳念誠
Taiwan, Tainan

Photography / Storytelling / Human Connection
```

---

### (b) 社群連結

支援：

* Instagram
* Threads
* Behance
* Email

---

### (c) 相簿列表

每個相簿包含：

* Cover Image
* 相簿名稱
* 日期
* 簡短描述（可選）

---

# 2. 相簿內頁（Album Page）

## 功能需求

### 顯示內容：

* 大量圖片
* 圖片說明文字
* 段落敘事

---

## 資料結構需求

系統需允許：

```txt
圖片
↓
說明文字
↓
圖片
↓
圖片
↓
段落文字
```

也就是：

> 「圖文混排」

而不是只有純圖片。

---

## 建議資料格式

可使用：

```json
[
  {
    "type": "image",
    "src": "photo01.webp",
    "caption": "Tokyo Street"
  },
  {
    "type": "text",
    "content": "那天下著雨..."
  }
]
```

---

# 三、版面設計規範

---

# 1. 瀑布流（Masonry Layout）

網站核心排版。

風格參考：

* [Google Keep](https://keep.google.com/?utm_source=chatgpt.com)
* [Dribbble](https://dribbble.com/?utm_source=chatgpt.com)
* [Pinterest](https://www.pinterest.com/?utm_source=chatgpt.com)

---

## 排版規則

圖片高度不固定：

* 系統需自動排列
* 後續圖片自動接續前圖尾端

---

## 建議技術方案

### CSS Columns（簡單）

或：

### Masonry Library（推薦）

例如：

* `react-masonry-css`
* `masonic`

---

# 2. 響應式設計（Responsive）

## 手機（Mobile）

```txt
1 Column
```

---

## 平板（Tablet）

```txt
2 Columns
```

---

## 桌機（Desktop）

```txt
3 Columns
```

---

## 間距建議

```txt
Gap: 16~24px
```

---

# 四、技術選型建議

---

# 前端框架

推薦：

## 第一選擇

### [Next.js](https://nextjs.org/?utm_source=chatgpt.com)

原因：

* Image Optimization
* SEO
* Static Export
* Routing 完整
* 適合作品集

---

## UI Styling

推薦：

### [Tailwind CSS](https://tailwindcss.com/?utm_source=chatgpt.com)

---

# 圖片排版套件

推薦：

### `react-masonry-css`

原因：

* 輕量
* 簡單
* 響應式容易

---

# 部署平台

推薦：

## 第一選擇

### [Vercel](https://vercel.com/?utm_source=chatgpt.com)

或：

### [Cloudflare Pages](https://pages.cloudflare.com/?utm_source=chatgpt.com)

---

# 五、SEO 與 Metadata

---

## 基本需求

每個相簿需支援：

* title
* description
* og:image

---

## Open Graph

分享時：

* 顯示封面圖
* 顯示相簿名稱

---

# 六、內容管理方式（CMS）

---

# MVP 階段

直接：

```txt
JSON / Markdown 管理
```

即可。

---

## 相簿資料結構建議

```txt
/content/albums/tokyo.json
/content/albums/street.json
```

---

# 七、未來可擴充功能

---

## 1. Lightbox 圖片檢視

點擊圖片：

* 放大
* 左右切換

---

## 2. EXIF 資訊

顯示：

* Camera
* Lens
* ISO
* Shutter Speed

---

## 3. 分類系統

例如：

* Street
* Portrait
* Travel
* Film

---

## 4. 搜尋與標籤

支援：

* tag
* keyword

---

## 5. 深色模式（Dark Mode）

攝影網站通常很適合。

---

# 八、開發階段規劃

---

# Phase 1（MVP）

完成：

* 首頁
* 相簿頁
* Masonry Layout
* Lazy Loading
* GitHub + jsDelivr
* WebP

---

# Phase 2

加入：

* Lightbox
* Blur Placeholder
* SEO
* 動畫效果

---

# Phase 3

升級：

* Cloudflare R2
* 多尺寸圖片生成
* 自動壓縮 Pipeline
* CMS 後台

---

# 九、最終架構建議（推薦）

```txt
Frontend
├── Next.js
├── Tailwind CSS
├── Masonry Layout
└── Vercel

Images CDN
├── GitHub Repository
└── jsDelivr CDN

Future Upgrade
└── Cloudflare R2
```
