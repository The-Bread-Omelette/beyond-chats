import { env } from './env.js';

export default {
  groq: {
    apiKey: env.GROQ_API_KEY,
    model: 'llama-3.3-70b-versatile',
    maxTokens: 4096,
    temperature: 0.7,
    timeout: 30000
  },
  
  serpApi: {
    apiKey: env.SERP_API_KEY,
    resultsPerQuery: 10,
    timeout: 10000
  },
  
  enhancement: {
    maxConcurrent: 3,
    retryAttempts: 3,
    retryDelay: 5000,
    minCompetingArticles: 2,
    maxContentLength: 6000,
    timeout: 60000
  },
  
  scraping: {
    timeout: 15000,
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
    maxRetries: 3
  }
};