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

    // Preserve newlines but clean other whitespace
    const cleanedText = cleanText(article.textContent);

    if (cleanedText.length < (options.minLength || 500)) {
      return null;
    }

    return {
      title: article.title || 'Unknown',
      textContent: cleanedText.substring(0, options.maxLength || 8000)
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

    const text = cleanText(content.text());

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
      textContent: text.substring(0, options.maxLength || 8000)
    };
  } catch (error) {
    logger.debug('Cheerio extraction failed', { error: error.message });
    return null;
  }
}

export function cleanText(text) {
  if (!text) return '';
  return text
    // Replace non-breaking spaces with normal spaces
    .replace(/\u00A0/g, ' ')
    // Replace multiple spaces/tabs with single space (but NOT newlines)
    .replace(/[ \t]+/g, ' ')
    // Replace 3+ newlines with 2 newlines (paragraph break)
    .replace(/\n\s*\n\s*\n/g, '\n\n')
    // Replace multiple newlines with 2
    .replace(/\n{3,}/g, '\n\n')
    .trim();
}