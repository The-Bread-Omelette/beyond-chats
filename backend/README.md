# BeyondChats Blog Scraper & Enhancement System

This project implements Phase 1 and 2 of the BeyondChats assignment.

It programmatically scrapes the five oldest blog articles from the BeyondChats website, stores them in a database, and exposes full CRUD APIs to manage the scraped data.

Searches Google for competing articles on the same topic
Scrapes content from top-ranking competitors
Uses Groq LLM to rewrite articles matching competitor quality and style
Processes enhancements asynchronously via Redis queue
Maintains proper citations and references


## Tech Stack
### Core:

Node.js 18+ (ES Modules)
Express 4.x
MongoDB 7.0 + Mongoose 8.x
Redis 7.x

### Enhancement Pipeline:

BullMQ (job queue)
SerpAPI (Google search)
Groq LLM (content generation)
Mozilla Readability (content extraction)
Cheerio (HTML parsing)

### Infrastructure:

Docker Compose (local development)
Winston (structured logging)
Helmet (security headers)
Circuit breakers (fault tolerance)


## Project Structure

src/
├─ app.js # Express app configuration
├─ server.js # Server bootstrap
├── config/
│   ├── db.js                    ### MongoDB connection
│   ├── env.js                   ### Environment validation
│   └── services.js              ### External service configs
│
├── models/
│   └── Article.js               ### Mongoose schema
│
├── infrastructure/
│   ├── circuitBreaker.js        ### Fault tolerance for external APIs
│   └── queue/
│       └── enhancementQueue.js  ### BullMQ worker setup
│
├── features/
│   ├── articles/
│   │   ├── controllers/         ### Request handlers
│   │   ├── routes/              ### API routes
│   │   ├── validators/          ### Input validation schemas
│   │   └── services/            ### Business logic layer
│   └── enhancement/
│       ├── controllers/
│       ├── routes/
│       └── services/
│
├── routes/
│   ├── healthRoutes.js          ### Health check endpoints
│   └── index.js                 ### Route aggregation
│
├── scrapers/
│   ├── articleScraper.js        ### BeyondChats blog scraper
│   └── contentScraper.js        ### Content extraction utilities
│
├── services/
│   ├── googleSearchService.js   ### SerpAPI integration
│   ├── contentScraperService.js ### Competing article scraper
│   └── llmService.js            ### Groq API client
│
├── jobs/
│   └── articleEnhancementJob.js ### Background enhancement worker
│
├── middleware/
│   ├── errorHandler.js          ### Global error handling
│   ├── rateLimiter.js           ### API rate limiting
│   └── validateRequest.js       ### Request validation
│
├── utils/
│   ├── httpClient.js            ### Axios with retry logic
│   └── logger.js                ### Winston logger
tests/
├── articles.test.js
└── scraper.test.js

## Installation
# Prerequisites```:

N
ode.js >= 18.0.0
Docker and Docker Compose
SerpAPI key (sign up here)
Groq API key (sign up here)


# requirements:
```bash
# Check Node.js version (should be 18 or higher)
node --version

# Check if Docker is installed
docker --version

# Check if Docker Compose is installed
docker-compose --version
```
# Setup:
```bash
### Clone and install dependencies
npm install

### Configure environment
cp .env.example .env
### Edit .env with your API keys

### Start infrastructure services
docker-compose up -d

### Run the application
npm start
```

## Environment Variables

Create a `.env` file:
```yaml
### Environment
NODE_ENV=development
PORT=3000

### Database
MONGO_URI=mongodb://localhost:27017/beyondchats

### Redis
# Use a managed Redis by setting `REDIS_URL` (supports `rediss://` for TLS).
# Example: REDIS_URL=rediss://default:your_token_here@special-colt-7095.upstash.io:6379
REDIS_URL=
# Or use host/port/password (defaults to local redis service when using docker-compose)
REDIS_HOST=localhost
REDIS_PORT=6379
REDIS_PASSWORD=

### API Keys (required for Phase 2)
GROQ_API_KEY=your_groq_api_key
SERP_API_KEY=your_serpapi_key

### Security
ALLOWED_ORIGINS=http://localhost:3000

### Logging
LOG_LEVEL=info
```

## Running the Application

### use Docker:
```bash
docker-compose up -d
```
### Development mode (with auto-reload):
```bash
npm i
npm run dev

```

### Production mode:

```bash
npm start
```


### On startup:

Connects to MongoDB and Redis
Scrapes the 5 oldest articles from BeyondChats
Starts the API server on configured port
Begins processing enhancement queue


## API Endpoints
Base URL: http://localhost:3000/api
### Articles


| Method | Endpoint          | Description                              |
|-------:|-------------------|------------------------------------------|
| GET    | `/articles`       | Get all articles (with pagination)       |
| GET    | `/articles/:id`   | Get single article                       |
| POST   | `/articles`       | Create new article                       |
| PUT    | `/articles/:id`   | Update article                           |
| DELETE | `/articles/:id`   | Delete article                           |

### Query Parameters — `GET /articles`

| Parameter | Default     | Description                                             |
|----------:|-------------|---------------------------------------------------------|
| `page`    | `1`         | Page number                                             |
| `limit`   | `20`        | Items per page (max `100`)                              |
| `status`  | —           | `pending`, `processing`, `completed`, `failed`         |
| `sortBy`  | `createdAt` | Sort field                                              |
| `order`   | `desc`      | `asc` or `desc`                                        |


### Enhancement Endpoints

| Method | Endpoint                            | Description                                |
|-------:|-------------------------------------|--------------------------------------------|
| POST   | `/enhancement/enhance/:id`          | Queue single article for enhancement       |
| POST   | `/enhancement/enhance-all?limit=10` | Queue multiple pending articles            |
| GET    | `/enhancement/status/:id`           | Get enhancement status                     |
| GET    | `/enhancement/queue/stats`          | Get queue statistics                       |

---

### Rate Limits

| Scope       | Limit                 |
|-------------|-----------------------|
| Enhancement | 10 requests / hour    |

---

### Enhancement Process

1. Article queued via `POST` request  
2. Worker picks up job from Redis queue  
3. Searches Google for competing articles (SerpAPI)  
4. Scrapes content from top 2–3 results  
5. Sends competitor content to Groq LLM  
6. LLM rewrites article to match competitor style  
7. Database updated with enhanced content and citations  
8. Job marked as `completed`

---

### Circuit Breaker Protection

- External API calls protected by circuit breakers  
- Circuit opens after **5 consecutive failures**  
- Automatic recovery after **60 seconds**


### Testing
```bash
### Run all tests
npm test

### Watch mode
npm test -- --watch

### Coverage report
npm test -- --coverage

```
Tests use Vitest for fast, ES-module-native testing.

### Monitoring
Logs are written to:

logs/combined.log (all logs)
logs/error.log (errors only)
Console (development mode)

Log format: Structured JSON with timestamps
### Queue monitoring:
```bash
curl http://localhost:3000/api/enhancement/queue/stats
```
## Production Deployment
### Checklist:

### Set NODE_ENV=production
Use managed MongoDB (Atlas, DocumentDB)
Use managed Redis (ElastiCache, Redis Cloud)
### Configure SSL/TLS for all connections
Set up log aggregation (DataDog, LogDNA)
Enable monitoring (Prometheus, Grafana)
Use process manager (PM2) or container orchestration

### Docker Deployment:
bashdocker-compose up -d

### Error Handling
The application implements comprehensive error handling:

### Global error middleware catches all unhandled errors
Circuit breakers prevent cascading failures
Graceful shutdown on SIGTERM/SIGINT
Automatic retry with exponential backoff
Detailed error logging with context


## Security

Helmet middleware for security headers
MongoDB query sanitization
Input validation on all endpoints
Rate limiting per IP address
CORS with configurable origins
No sensitive data in logs

