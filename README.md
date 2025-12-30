# BeyondChats Blog Scraper & API

This project implements Phase 1 of the BeyondChats assignment.

It programmatically scrapes the five oldest blog articles from the BeyondChats website, stores them in a database, and exposes full CRUD APIs to manage the scraped data.

The system is built using modern, non-deprecated technologies with native ES Modules.

---

## Features

- Dynamic web scraping (no hard-coded links)
- Pagination-safe extraction of oldest articles
- Full article content scraping
- MongoDB persistence
- RESTful CRUD APIs
- Secure CORS configuration
- API rate limiting
- Retry-safe HTTP requests
- Automated testing with Vitest
- Native ES Module architecture

---

## Tech Stack

- Node.js (18+)
- Express
- MongoDB + Mongoose
- Axios
- Cheerio
- Vitest
- ES Modules (no CommonJS)

---

## Project Structure

src/
├─ app.js # Express app configuration
├─ server.js # Server bootstrap
├─ config/
│ └─ db.js # MongoDB connection
├─ models/
│ └─ Article.js # Article schema
├─ routes/
│ └─ articleRoutes.js # CRUD APIs
├─ scraper/
│ └─ scrapeOldestArticles.js
├─ middleware/
│ └─ rateLimiter.js
├─ utils/
| └─ httpClient.js
tests/
├─ articles.test.js
└─ scraper.test.js

yaml
Copy code

---

## Environment Variables

Create a `.env` file:

MONGO_URI=mongodb://localhost:27017/beyondchats

yaml
Copy code

---

## Installation

```bash
npm install
Running the Project
bash
Copy code
npm start
On startup:

MongoDB connects

The scraper fetches and stores the five oldest articles

The API server starts

API Endpoints
Base URL: /api/articles

Method	Endpoint	Description
GET	/	Get all articles
GET	/:id	Get single article
POST	/	Create article
PUT	/:id	Update article
DELETE	/:id	Delete article

Running Tests
bash
Copy code
npm test
Vitest is used for fast, ES-module-native testing.