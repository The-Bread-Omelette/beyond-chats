import 'dotenv/config';
import connectDB, { disconnectDB } from './config/db.js';
import scrapeOldestArticles from './scraper/articleScraper.js';
import { closeQueue } from './infrastructure/queue/enhancementQueue.js';
import app from './app.js';
import logger from './utils/logger.js';

const PORT = process.env.PORT || 3000;
let server;

async function startServer() {
  try {
    await connectDB();
    await scrapeOldestArticles();

    app.listen(PORT,()=>{
      console.log(`Server running on port ${PORT}`);
    });

    process.on('unhandledRejection', (err) => {
      logger.error('Unhandled Rejection', { error: err.message, stack: err.stack });
      shutdown('unhandled rejection');
    });

    process.on('uncaughtException', (err) => {
      logger.error('Uncaught Exception', { error: err.message, stack: err.stack });
      shutdown('uncaught exception');
    });

    process.on('SIGTERM', () => shutdown('SIGTERM'));
    process.on('SIGINT', () => shutdown('SIGINT'));
  } catch (error) {
    logger.error('Failed to start server', { error: error.message });
    process.exit(1);
  }
}

async function shutdown(signal) {
  logger.info(`${signal} received, starting shutdown`);
  
  if (server) {
    server.close(async () => {
      logger.info('HTTP server closed');
      
      try {
        await closeQueue();
        await disconnectDB();
        logger.info('Shutdown completed');
        process.exit(0);
      } catch (error) {
        logger.error('Error during shutdown', { error: error.message });
        process.exit(1);
      }
    });

    setTimeout(() => {
      logger.error('Forcing shutdown after timeout');
      process.exit(1);
    }, 30000);
  }
}

startServer();