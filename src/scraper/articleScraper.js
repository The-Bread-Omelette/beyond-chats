import * as cheerio from 'cheerio';
import client from '../utils/httpClient.js';
import Article from '../models/Article.js';
import logger from '../utils/logger.js';

const BASE_URL = 'https://beyondchats.com/blogs/';

async function resolveLastPage() {
  try {
    const { data } = await client.get(BASE_URL);
    const $ = cheerio.load(data);

    const pages = [BASE_URL];

    $('a.page-numbers').each((_, el) => {
      const href = $(el).attr('href');
      if (href) pages.push(href);
    });

    return pages.at(-1) || BASE_URL;
  } catch (error) {
    logger.error('Failed to resolve last page', { error: error.message });
    throw error;
  }
}

async function scrapeArticleContent(url) {
  try {
    const { data } = await client.get(url);
    const $ = cheerio.load(data);

    const mainContent = $(
      '.entry-content, .post-content, .article, .content, .article-content'
    )
      .first()
      .clone();
    
    mainContent.find(
      'script, style, nav, aside, .sidebar, .related-posts, .comments, .sharedaddy, .jp-relatedposts'
    ).remove();
    
    const content = mainContent.text().trim();
    
    return content || $('article').text().trim();
  } catch (error) {
    logger.error(`Failed to scrape content from ${url}`, { error: error.message });
    return null;
  }
}

export default async function scrapeOldestArticles() {
  try {
    logger.info('Starting article scraping');
    
    const lastPage = await resolveLastPage();
    const { data } = await client.get(lastPage);
    const $ = cheerio.load(data);

    const nodes = $('article').toArray().slice(-5);
    let scraped = 0;
    let skipped = 0;

    for (const el of nodes) {
      const title = $(el).find('h2 a').text().trim();
      const url = $(el).find('h2 a').attr('href');
      const excerpt = $(el).find('p').first().text().trim();

      if (!title || !url) {
        logger.warn('Skipping article with missing title or URL');
        continue;
      }

      if (await Article.exists({ url })) {
        skipped++;
        continue;
      }

      const content = await scrapeArticleContent(url);

      if (!content) {
        logger.warn(`Skipping article with no content: ${url}`);
        continue;
      }

      await Article.create({ title, url, excerpt, content });
      scraped++;
      logger.info(`Scraped article: ${title}`);
    }

    logger.info(`Scraping completed: ${scraped} new, ${skipped} skipped`);
  } catch (error) {
    logger.error('Scraping failed', { error: error.message, stack: error.stack });
    throw error;
  }
}