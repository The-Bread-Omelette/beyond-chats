import axios from 'axios';
import { makeRequest } from '../utils/httpClient.js';
import config from '../config/services.js';
import logger from '../utils/logger.js';

const EXCLUDED_DOMAINS = [
  'youtube.com',
  'facebook.com',
  'twitter.com',
  'x.com',
  'instagram.com',
  'linkedin.com/posts',
  'pinterest.com',
  'reddit.com/r/',
  'tiktok.com',
  'beyondchats.com'
];

const EXCLUDED_PATTERNS = [
  /\/tag\//i,
  /\/category\//i,
  /\/author\//i,
  /\/page\/\d+/i,
  /\/search\//i
];

function isValidArticleUrl(url) {
  const lowercaseUrl = url.toLowerCase();
  
  if (EXCLUDED_DOMAINS.some(domain => lowercaseUrl.includes(domain))) {
    return false;
  }
  
  if (EXCLUDED_PATTERNS.some(pattern => pattern.test(lowercaseUrl))) {
    return false;
  }
  
  return true;
}

export async function searchCompetingArticles(query) {
  try {
    const sanitizedQuery = query.trim().slice(0, 200);
    
    logger.info('Searching for competing articles', { query: sanitizedQuery });
    
    const response = await makeRequest(() =>
      axios.get('https://serpapi.com/search', {
        params: {
          q: sanitizedQuery,
          api_key: config.serpApi.apiKey,
          num: config.serpApi.resultsPerQuery,
          gl: 'us',
          hl: 'en',
          safe: 'active'
        },
        timeout: config.serpApi.timeout
      })
    );

    const results = response.data.organic_results || [];
    
    const articles = results
      .filter(result => {
        return result.link &&
               result.title &&
               result.snippet?.length > 100 &&
               isValidArticleUrl(result.link);
      })
      .slice(0, 3)
      .map(r => ({
        title: r.title,
        url: r.link,
        snippet: r.snippet
      }));

    logger.info(`Found ${articles.length} valid competing articles`, { 
      query: sanitizedQuery,
      total: results.length
    });
    
    return articles;

  } catch (error) {
    logger.error('Google search failed', { 
      query, 
      error: error.message,
      isCircuitOpen: error.message.includes('Circuit breaker')
    });
    throw new Error(`Search failed: ${error.message}`);
  }
}