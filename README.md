# BeyondChats Scraper & AI Enhancer

This full-stack application scrapes articles from BeyondChats, enhances them using AI based on competing content from Google Search, and presents them in a premium, modern dashboard.

## Features

-   **Deep Scraping**: Fetches the oldest articles from the BeyondChats blog.
-   **AI Enhancement**:
    -   Searches Google for competing articles.
    -   Scrapes content from top competitors.
    -   Uses LLM (Gemini) to rewrite and enhance the original article.
    -   Adds citations and references automatically.
-   **Premium Dashboard**:
    -   Dark mode aesthetic ("Obsidian & Glass").
    -   Real-time enhancement status tracking.
    -   Interactive "Version Comparison" mode.
    -   Responsive, mobile-ready design.

---

## 🛠 Tech Stack

-   **Frontend**: React, Vite, Material UI (MUI), Framer Motion.
-   **Backend**: Node.js, Express, MongoDB (Mongoose).
-   **Services**: Cheerio (Scraping), Google Custom Search JSON API, Gemini Pro (LLM).

---

## 🚀 Setup & Installation

### Prerequisites
- Node.js (v18+)
- MongoDB running locally or a connection string
- Google Custom Search API Key & Search Engine ID
- Gemini API Key

### 1. Backend Setup

```bash
cd backend

# Install dependencies
npm install

# Configure environment
cp .env.example .env
# Edit .env with your credentials:
# PORT=3000
# MONGODB_URI=mongodb://localhost:27017/beyondchats
# GOOGLE_API_KEY=...
# GOOGLE_SEARCH_ENGINE_ID=...
# GEMINI_API_KEY=...

# Start the server
npm run dev
```

### 2. Frontend Setup

```bash
cd frontend

# Install dependencies
npm install

# Start the development server
npm run dev
```

The app will be available at `http://localhost:5173`.

---

## 🏗 Architecture

```mermaid
graph TD
    A[Frontend (React)] -->|API REST| B[Backend API (Express)]
    B -->|Read/Write| C[(MongoDB)]
    B -->|Queue| D[Enhancement Job]
    D -->|1. Search| E[Google API]
    D -->|2. Scrape| F[External Blogs]
    D -->|3. Enhance| G[Gemini LLM]
    D -->|Update| C
```

## 🌐 Live Demo

[Link to Live Demo](http://localhost:5173) (Local)

---

## 📝 Usage Guide

1.  **Dashboard**: View all scraped articles.
2.  **Auto-Enhance**: Click "Auto-Enhance Stack" to process pending articles in the background.
3.  **Detail View**: Click an article to see its excerpt.
4.  **Comparison**: Once enhanced, click "Compare Versions" to see the AI improvements side-by-side (or tabbed).
