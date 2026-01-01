# BeyondChats Scraper & AI Enhancer

This full-stack application scrapes articles from BeyondChats, enhances them using AI based on competing content from Google Search, and presents them in a premium, modern dashboard.

## Live Link : [Link](https://beyond-chats-beryl.vercel.app/article/695618d65962c74f3cf1874c)

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

## 🏠 Local development (detailed)

If you want to run the app fully locally (backend + frontend), follow these steps.

Option A — Local Node / Mongo

1. Start MongoDB (local or via Docker). If using Docker:

```bash
docker run -d --name beyondchats-mongo -p 27017:27017 mongo:6
```

2. Backend

```bash
cd backend
npm install
cp .env.example .env
# set MONGODB_URI and API keys in .env
npm run dev
```

3. Frontend

```bash
cd frontend
npm install
cp .env.template .env
# set VITE_API_BASE_URL to http://localhost:3000 (or your backend port)
npm run dev
```

Option B — Docker Compose (quick)

1. From the repo root you can use the provided compose file (if present) to run services together:

```bash
cd backend
docker-compose up --build
```

Notes
- Ensure API keys (Google Custom Search, Gemini) are set in the backend `.env` before running enhancement jobs.
- Frontend dev server runs on port `5173` by default; backend typically runs on `3000`.
- If you prefer a production preview, build the frontend (`npm run build`) and serve from a static server.

Security & Rate limiting
- This project intentionally does not implement authentication on the API endpoints for simplicity and demo purposes; authentication and role-based access control are intentionally skipped. If you deploy this in production, add proper auth (OAuth/JWT) and API keys.
- The backend includes rate-limiting middleware (`express-rate-limit`) to prevent abuse — ensure it's enabled in `src/app.js` when deploying behind a proxy. If you prefer stricter limits, adjust the configuration in `src/middleware/rateLimiter.js` or add IP-based blocking.

Running the scraper and enhancement jobs
- To scrape the 5 oldest articles from BeyondChats last page and store them in MongoDB:

```bash
cd backend
npm run scrape
```

- To queue enhancements (process pending articles) you can use the API or the `Auto-Enhance` button in the frontend. Ensure Redis is running for the job queue. Use `docker-compose` in `backend/docker-compose.yml` if present.

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
