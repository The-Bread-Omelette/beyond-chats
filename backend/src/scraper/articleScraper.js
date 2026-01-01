import * as cheerio from 'cheerio';
import client from '../utils/httpClient.js';
import TurndownService from 'turndown';
import Article from '../models/Article.js';
import logger from '../utils/logger.js';

const BASE_URL = 'https://beyondchats.com/blogs/';

async function resolveLastPage() {
  try {
    const { data } = await client.get(BASE_URL);
    const $ = cheerio.load(data);

    const pageLinks = [];

    $('a.page-numbers').each((_, el) => {
      const href = $(el).attr('href');
      const text = $(el).text().trim();
      
      if (href && !isNaN(text)) {
        pageLinks.push({
          url: href,
          pageNum: parseInt(text)
        });
      }
    });

    if (pageLinks.length > 0) {
      pageLinks.sort((a, b) => b.pageNum - a.pageNum);
      const lastPageUrl = pageLinks[0].url;
      logger.info(`Found last page: ${lastPageUrl} (page ${pageLinks[0].pageNum})`);
      return lastPageUrl;
    }

    const nextLink = $('a.next.page-numbers').attr('href');
    if (!nextLink) {
      logger.info('Already on the last page');
      return BASE_URL;
    }

    logger.warn('Could not determine last page, using base URL');
    return BASE_URL;
  } catch (error) {
    logger.error('Failed to resolve last page', { error: error.message });
    throw error;
  }
}

async function scrapeArticleContent(url, httpClient) {
  try {
    const { data } = await (httpClient || client).get(url);
    const $ = cheerio.load(data);

    const contentSelectors = [
      '.entry-content',
      '.post-content', 
      '.article-content',
      'article .content',
      '.content',
      'article'
    ];

    let content = '';
    let contentHtml = '';
    const turndown = new TurndownService({ headingStyle: 'atx' });
    
    for (const selector of contentSelectors) {
      const element = $(selector).first();
      if (element.length) {
        const cloned = element.clone();
        
        // Remove unwanted elements
        cloned.find(
          'script, style, nav, aside, .sidebar, .related-posts, ' +
          '.comments, .sharedaddy, .jp-relatedposts, .social-share, ' +
          'iframe, .advertisement'
        ).remove();
        
        // preserve inner HTML and convert to markdown
        contentHtml = cloned.html() || '';
        try {
          content = turndown.turndown(contentHtml).trim();
        } catch (e) {
          // fallback to text if turndown fails
          content = cloned.text().trim();
        }
        
        if (content.length > 200) {
          logger.debug(`Content extracted using selector: ${selector}`);
          break;
        }
      }
    }
    
    // normalize excessive blank lines
    if (content) {
      content = content.replace(/\r\n/g, '\n');
      content = content.replace(/\n{3,}/g, '\n\n');
      content = content.replace(/[ \t]{2,}/g, ' ');
      content = content.trim();
    }

    // return both markdown and raw html for callers if needed
    return content ? { markdown: content, html: contentHtml || null } : null;
  } catch (error) {
    logger.error(`Failed to scrape content from ${url}`, { error: error.message });
    return null;
  }
}

function cleanContent(text) {
  if (!text) return text;
  let s = String(text);
  s = s.replace(/\r\n/g, '\n');
  s = s.replace(/&nbsp;|\u00A0/g, ' ');
  s = s.replace(/(.)\1{3,}/g, '$1');
  s = s.replace(/\n{3,}/g, '\n\n');
  s = s.replace(/[ \t]{2,}/g, ' ');
  s = s.replace(/[ \t]*\n[ \t]*/g, '\n');
  s = s.trim();
  s = s.replace(/\b([A-Z]{4,})\b/g, (m) => m.toLowerCase());
  return s;
}

export default async function scrapeOldestArticles(customClient) {
  try {
    logger.info('Starting article scraping for oldest articles');
    const httpClient = customClient || client;

    const lastPageUrl = await resolveLastPage();

    // Try to extract page number from last page URL
    const pageMatch = /\/page\/(\d+)/i.exec(lastPageUrl || '');
    let currentPage = pageMatch ? parseInt(pageMatch[1], 10) : 1;

    const targetNew = 5;
    let scraped = 0;
    let skipped = 0;

    // Helper to build a page URL for a given page number
    const pageUrlFor = (baseUrl, pageNum) => {
      if (!pageNum || pageNum <= 1) return BASE_URL;
      if (/\/page\/(\d+)/i.test(baseUrl)) {
        return baseUrl.replace(/\/page\/(\d+)/i, `/page/${pageNum}`);
      }
      return `${BASE_URL}page/${pageNum}/`;
    };

    // Walk pages backwards (older pages) until we scraped `targetNew` new articles
    while (scraped < targetNew && currentPage >= 1) {
      const url = pageUrlFor(lastPageUrl, currentPage);
      logger.info(`Fetching page ${currentPage}: ${url}`);

      const { data } = await httpClient.get(url);
      const $ = cheerio.load(data);

      const articles = [];
      $('article').each((index, el) => {
        const $article = $(el);

        const titleSelectors = [
          'h2.entry-title a',
          'h2 a',
          '.entry-title a',
          'h3 a',
          'a[rel="bookmark"]'
        ];

        let title = '';
        let url = '';

        for (const selector of titleSelectors) {
          const element = $article.find(selector).first();
          if (element.length) {
            title = element.text().trim();
            url = element.attr('href');
            if (title && url) break;
          }
        }

        const excerpt = $article.find('p').first().text().trim() ||
                       $article.find('.entry-summary').text().trim() ||
                       $article.find('.excerpt').text().trim();

        if (title && url) articles.push({ title, url, excerpt });
      });

      if (!articles.length) {
        logger.warn(`No articles found on page ${currentPage}`);
        currentPage -= 1;
        continue;
      }

      // Process articles from oldest to newest (iterate from end)
      for (let i = articles.length - 1; i >= 0 && scraped < targetNew; i--) {
        const articleData = articles[i];
        try {
          const exists = await Article.exists({ url: articleData.url });
          if (exists) {
            logger.info(`Article already exists: ${articleData.title}`);
            skipped++;
            continue;
          }

          const scrapedContent = await scrapeArticleContent(articleData.url,httpClient);
          const raw = scrapedContent
            ? (scrapedContent.markdown || scrapedContent.html || articleData.excerpt)
            : articleData.excerpt;
          const cleaned = cleanContent(raw || '');
          
          scraped++;

          await Article.create({
            title: articleData.title,
            url: articleData.url,
            excerpt: articleData.excerpt,
            content: cleaned || articleData.excerpt,
            originalContent: cleaned || articleData.excerpt
          });

          scraped++;
          logger.info(`Successfully scraped article: ${articleData.title}`);
        } catch (error) {
          logger.error(`Error processing article: ${articleData.title}`, {
            error: error.message
          });
        }
      }

      currentPage -= 1;
    }

    logger.info(`Scraping completed: ${scraped} new articles, ${skipped} skipped`);

    return {
      scraped,
      skipped,
      total: scraped + skipped
    };

  } catch (error) {
    logger.error('Scraping failed', { 
      error: error.message, 
      stack: error.stack 
    });
    throw error;
  }
}