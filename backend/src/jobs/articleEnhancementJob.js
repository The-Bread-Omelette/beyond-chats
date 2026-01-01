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

    const scrapedArticles = (await Promise.all(scrapePromises))
      .filter(Boolean);

    if (scrapedArticles.length === 0) {
      throw new Error('Failed to scrape any competing articles');
    }

    logger.info(`Scraped ${scrapedArticles.length} competing articles`, {
      articleId,
      sources: scrapedArticles.map(a => a.url)
    });

    const { content, references } = await enhanceArticle(
      article.toObject(),
      scrapedArticles
    );

    await article.updateOne({
      content,
      originalContent: article.originalContent || article.content, // Preserve original content
      references,
      enhancementStatus: 'completed',
      enhancedAt: new Date(),
      $unset: { enhancementError: 1 }
    });

    logger.info(`Successfully enhanced article`, {
      articleId,
      title: article.title,
      referencesCount: references.length
    });

    return {
      success: true,
      articleId,
      referencesCount: references.length
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