import pLimit from 'p-limit';
import Article from '../models/Article.js';
import { searchCompetingArticles } from '../services/googleSearchService.js';
import { scrapeCompetingArticle } from '../services/contentScraperService.js';
import { enhanceArticle } from '../services/llmService.js';
import config from '../config/services.js';
import logger from '../utils/logger.js';

const limit = pLimit(config.enhancement.maxConcurrent);

export async function processArticleEnhancement(articleId) {
  const article = await Article.findById(articleId);

  if (!article) {
    throw new Error(`Article not found: ${articleId}`);
  }

  logger.info(`Starting enhancement for article`, {
    articleId,
    title: article.title
  });

  await article.updateOne({ enhancementStatus: 'processing' });

  try {
    const searchResults = await searchCompetingArticles(article.title);

    if (searchResults.length < config.enhancement.minCompetingArticles) {
      throw new Error(
        `Insufficient search results: ${searchResults.length} found, ` +
        `minimum ${config.enhancement.minCompetingArticles} required`
      );
    }

    const scrapePromises = searchResults.map(result =>
      limit(async () => {
        const scraped = await scrapeCompetingArticle(result.url);
        return scraped ? { ...result, ...scraped } : null;
      })
    );

    const scrapedArticles = (await Promise.all(scrapePromises)).filter(Boolean);

    if (scrapedArticles.length === 0) {
      throw new Error('Failed to scrape any competing articles');
    }

    logger.info(`Scraped ${scrapedArticles.length} competing articles`, {
      articleId,
      sources: scrapedArticles.map(a => a.url)
    });

    // Ensure we only use the top 2 competing articles as references
    const topTwo = scrapedArticles.slice(0, 2);

    // Clean and persist original content if not already stored
    function cleanText(s) {
      if (!s) return '';
      let str = String(s);
      str = str.replace(/\r\n/g, '\n');
      str = str.replace(/\u00A0/g, ' ');
      str = str.replace(/\n{3,}/g, '\n\n');
      str = str.replace(/[ \t]{2,}/g, ' ');
      str = str.split('\n').map(l => l.trim()).join('\n');
      str = str.replace(/\n{2,}/g, '\n\n').trim();
      return str;
    }

    if (!article.originalContent) {
      const cleaned = cleanText(article.content || article.excerpt || '');
      await article.updateOne({ originalContent: cleaned });
    }

    const { content } = await enhanceArticle(article.toObject(), topTwo);

    const referencesToSave = topTwo.map(c => ({ title: c.title, url: c.url }));

    await article.updateOne({
      content,
      originalContent: article.originalContent || article.content,
      references: referencesToSave,
      enhancementStatus: 'completed',
      enhancedAt: new Date(),
      $unset: { enhancementError: 1 }
    });

    logger.info(`Successfully enhanced article`, { articleId, title: article.title, referencesCount: referencesToSave.length });

    return {
      success: true,
      articleId,
      referencesCount: referencesToSave.length,
      references: referencesToSave
    };

  } catch (error) {
    logger.error(`Enhancement failed`, {
      articleId,
      title: article.title,
      error: error.message,
      stack: error.stack
    });

    await article.updateOne({
      enhancementStatus: 'failed',
      enhancementError: error.message
    });

    throw error;
  }
}