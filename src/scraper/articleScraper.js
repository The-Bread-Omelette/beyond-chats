import * as cheerio from 'cheerio';
import client from '../utils/httpClient.js';
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

async function scrapeArticleContent(url) {
  try {
    const { data } = await client.get(url);
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
        
        content = cloned.text().trim();
        
        if (content.length > 200) {
          logger.debug(`Content extracted using selector: ${selector}`);
          break;
        }
      }
    }
    
    return content || null;
  } catch (error) {
    logger.error(`Failed to scrape content from ${url}`, { error: error.message });
    return null;
  }
}

export default async function scrapeOldestArticles() {
  try {
    logger.info('Starting article scraping for oldest articles');
    
    const lastPageUrl = await resolveLastPage();
    const { data } = await client.get(lastPageUrl);
    const $ = cheerio.load(data);

    // Get all articles on the last page
    const articles = [];
    
    $('article').each((index, el) => {
      const $article = $(el);
      
      // Try multiple selectors for title and link
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
      
      // Get excerpt
      const excerpt = $article.find('p').first().text().trim() ||
                     $article.find('.entry-summary').text().trim() ||
                     $article.find('.excerpt').text().trim();
      
      if (title && url) {
        articles.push({ title, url, excerpt, index });
      }
    });

    logger.info(`Found ${articles.length} articles on last page`);

    if (articles.length === 0) {
      logger.warn('No articles found on last page');
      return;
    }

    // Take the LAST 5 articles (oldest ones at the end of the page)
    const oldestArticles = articles.slice(-5);
    
    logger.info(`Processing ${oldestArticles.length} oldest articles`);

    let scraped = 0;
    let skipped = 0;

    for (const articleData of oldestArticles) {
      try {
        // Check if article already exists
        const exists = await Article.exists({ url: articleData.url });
        
        if (exists) {
          logger.info(`Article already exists: ${articleData.title}`);
          skipped++;
          continue;
        }

        // Scrape full content
        const content = await scrapeArticleContent(articleData.url);

        if (!content) {
          logger.warn(`Could not scrape content for: ${articleData.title}`);
          // Still save the article with excerpt only
        }

        await Article.create({
          title: articleData.title,
          url: articleData.url,
          excerpt: articleData.excerpt,
          content: content || articleData.excerpt
        });

        scraped++;
        logger.info(`Successfully scraped article: ${articleData.title}`);
        
      } catch (error) {
        logger.error(`Error processing article: ${articleData.title}`, { 
          error: error.message 
        });
      }
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