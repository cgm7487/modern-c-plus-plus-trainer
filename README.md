# Modern C++ Trainer

互動式 Modern C++ (C++11/14/17/20) 學習訓練平台，包含教學內容、即時線上編譯器和練習題。

## 功能特色

- **18 個學習主題** 涵蓋 5 大分類：
  - C++11 語法：auto/decltype、Range-based for、Lambda、智慧指標、移動語意、可變參數模板
  - C++14/17/20：結構化綁定、optional/variant/any、Concepts、Ranges
  - Best Practices：RAII、const 正確性
  - Design Patterns：Singleton、Observer、Factory
  - 系統程式設計：多執行緒、async/future、條件變數
- **線上 C++ 編譯器**：Monaco Editor + g++ 即時編譯執行
- **互動式練習題**：每個主題附帶練習，自動驗證測試案例
- **Docker Compose 一鍵啟動**

## 快速開始

### 使用 Docker Compose（推薦）

```bash
docker compose up --build
```

啟動後開啟 http://localhost:5173

### 本地開發

**Backend：**
```bash
cd backend
npm install
npm run dev
```

**Frontend：**
```bash
cd frontend
npm install
npm run dev
```

## 技術架構

| 元件 | 技術 |
|------|------|
| Frontend | React 18 + Vite + Monaco Editor |
| Backend | Node.js + Express |
| Compiler | g++ (C++20) |
| 容器化 | Docker Compose |

## 專案結構

```
├── docker-compose.yml
├── frontend/
│   ├── src/
│   │   ├── components/    # React 元件
│   │   ├── pages/         # 頁面元件
│   │   ├── data/          # 學習內容資料
│   │   └── styles/        # CSS 樣式
│   └── Dockerfile
├── backend/
│   ├── src/server.js      # API 伺服器 + 編譯服務
│   └── Dockerfile
└── README.md
```
