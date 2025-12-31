import * as cheerio from 'cheerio';
import { Readability } from '@mozilla/readability';
import { JSDOM } from 'jsdom';
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
  '[role="main"] article'
];

const REMOVE_SELECTORS = [
  'script',
  'style',
  'nav',
  'aside',
  'header',
  'footer',
  '.sidebar',
  '.related-posts',
  '.comments',
  '.social-share',
  'iframe',
  '.advertisement',
  '[class*="ad-"]',
  '[id*="ad-"]'
];

export function extractWithReadability(html, url, options = {}) {
  try {
    const dom = new JSDOM(html, { url });
    const reader = new Readability(dom.window.document, {
      charThreshold: options.minLength || 500,
      classesToPreserve: []
    });
    const article = reader.parse();

    if (!article?.textContent) {
      return null;
    }

    const cleanedText = article.textContent
      .replace(/\s+/g, ' ')
      .trim();

    if (cleanedText.length < (options.minLength || 500)) {
      return null;
    }

    return {
      title: article.title || 'Unknown',
      textContent: cleanedText.substring(0, options.maxLength || 6000)
    };
  } catch (error) {
    logger.debug('Readability extraction failed', { error: error.message });
    return null;
  }
}

export function extractWithCheerio(html, options = {}) {
  try {
    const $ = cheerio.load(html);
    
    $(REMOVE_SELECTORS.join(', ')).remove();
    
    let content = null;
    for (const selector of CONTENT_SELECTORS) {
      const element = $(selector).first();
      if (element.length && element.text().trim().length > (options.minLength || 500)) {
        content = element.clone();
        break;
      }
    }
    
    if (!content || content.text().trim().length < (options.minLength || 500)) {
      content = $('body');
    }
    
    const text = content.text()
      .replace(/\s+/g, ' ')
      .replace(/\n+/g, '\n')
      .trim();

    if (text.length < (options.minLength || 500)) {
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
      textContent: text.substring(0, options.maxLength || 6000)
    };
  } catch (error) {
    logger.debug('Cheerio extraction failed', { error: error.message });
    return null;
  }
}

export function cleanText(text) {
  return text
    .replace(/\s+/g, ' ')
    .replace(/\n+/g, '\n')
    .trim();
}