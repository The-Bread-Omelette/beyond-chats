import 'dotenv/config';
import connectDB, { disconnectDB } from '../../config/db.js';
import scrapeOldestArticles from './articleScraper.js';
import logger from '../../utils/logger.js';

(async function run() {
  try {
    await connectDB();
    const res = await scrapeOldestArticles();
    logger.info('Scrape result', res);
  } catch (err) {
    logger.error('Scrape runner failed', { error: err.message, stack: err.stack });
    process.exit(1);
  } finally {
    await disconnectDB();
    process.exit(0);
  }
})();
