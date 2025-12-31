import * as cheerio from 'cheerio';
import { Readability } from '@mozilla/readability';
import { JSDOM } from 'jsdom';
import { makeRequest } from '../utils/httpClient.js';
import client from '../utils/httpClient.js';
import config from '../config/services.js';
import logger from '../utils/logger.js';

const CONTENT_SELECTORS = [
  'article',
  '.post-content',
  '.entry-content',
  '.article-content',
  '.article-body',
  '.post-body',
  '.content',
  'main article',
  '[role="main"] article',
  '.blog-post'
];

const REMOVE_SELECTORS = [
  'script',
  'style',
  'nav',
  'aside',
  'header',
  'footer',
  '.sidebar',
  '.navigation',
  '.menu',
  '.related-posts',
  '.comments',
  '.comment-section',
  '.social-share',
  '.share-buttons',
  'iframe',
  '.advertisement',
  '.ad',
  '[class*="ad-"]',
  '[id*="ad-"]',
  '[class*="banner"]',
  '.popup',
  '.modal'
];

export async function scrapeCompetingArticle(url) {
  try {
    logger.info(`Attempting to scrape content from ${url}`);
    
    const { data } = await makeRequest(() =>
      client.get(url, {
        timeout: config.scraping.timeout,
        maxRedirects: 3,
        validateStatus: (status) => status >= 200 && status < 300
      })
    );

    const readabilityResult = extractWithReadability(data, url);
    if (readabilityResult?.textContent?.length > 500) {
      logger.info(`Successfully scraped ${url} using Readability`, {
        contentLength: readabilityResult.textContent.length
      });
      return readabilityResult;
    }

    const cheerioResult = extractWithCheerio(data);
    if (cheerioResult?.textContent?.length > 500) {
      logger.info(`Successfully scraped ${url} using Cheerio`, {
        contentLength: cheerioResult.textContent.length
      });
      return cheerioResult;
    }

    logger.warn(`Insufficient content extracted from ${url}`);
    return null;

  } catch (error) {
    logger.error(`Failed to scrape ${url}`, { 
      error: error.message,
      isCircuitOpen: error.message.includes('Circuit breaker')
    });
    return null;
  }
}

function extractWithReadability(html, url) {
  try {
    const dom = new JSDOM(html, { url });
    const reader = new Readability(dom.window.document, {
      charThreshold: 500,
      classesToPreserve: []
    });
    const article = reader.parse();

    if (!article?.textContent) {
      return null;
    }

    const cleanedText = article.textContent
      .replace(/\s+/g, ' ')
      .trim();

    if (cleanedText.length < 500) {
      return null;
    }

    return {
      title: article.title || 'Unknown',
      textContent: cleanedText.substring(0, config.enhancement.maxContentLength)
    };
  } catch (error) {
    logger.debug('Readability extraction failed', { error: error.message });
    return null;
  }
}

function extractWithCheerio(html) {
  try {
    const $ = cheerio.load(html);
    
    $(REMOVE_SELECTORS.join(', ')).remove();
    
    let content = null;
    for (const selector of CONTENT_SELECTORS) {
      const element = $(selector).first();
      if (element.length && element.text().trim().length > 500) {
        content = element.clone();
        break;
      }
    }
    
    if (!content || content.text().trim().length < 500) {
      content = $('body');
    }
    
    const text = content.text()
      .replace(/\s+/g, ' ')
      .replace(/\n+/g, '\n')
      .trim();

    if (text.length < 500) {
      return null;
    }

    const title = 
      $('h1').first().text().trim() || 
      $('meta[property="og:title"]').attr('content') || 
      $('meta[name="twitter:title"]').attr('content') ||
      $('title').text().trim() || 
      'Unknown';

    return {
      title: title.substring(0, 200),
      textContent: text.substring(0, config.enhancement.maxContentLength)
    };
  } catch (error) {
    logger.debug('Cheerio extraction failed', { error: error.message });
    return null;
  }
}