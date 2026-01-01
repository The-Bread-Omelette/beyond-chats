import { Queue, Worker, QueueEvents } from 'bullmq';
import { processArticleEnhancement } from '../../jobs/articleEnhancementJob.js';
import logger from '../../utils/logger.js';
import config from '../../config/services.js';
import { env } from '../../config/env.js';

// Support either a single REDIS_URL (managed services) or host/port (local/docker)
const baseConnectionOptions = {
  maxRetriesPerRequest: null,
  enableReadyCheck: false,
  retryStrategy: (times) => {
    const delay = Math.min(times * 50, 2000);
    return delay;
  }
};

let connection;
if (env.REDIS_URL) {
  connection = { url: env.REDIS_URL, ...baseConnectionOptions };
} else {
  connection = { host: env.REDIS_HOST, port: env.REDIS_PORT, password: env.REDIS_PASSWORD, ...baseConnectionOptions };
}

export const enhancementQueue = new Queue('article-enhancement', {
  connection,
  defaultJobOptions: {
    attempts: config.enhancement.retryAttempts,
    backoff: {
      type: 'exponential',
      delay: config.enhancement.retryDelay
    },
    removeOnComplete: {
      count: 100,
      age: 24 * 3600
    },
    removeOnFail: {
      count: 1000
    }
  }
});

export const enhancementWorker = new Worker(
  'article-enhancement',
  async (job) => {
    logger.info(`Processing enhancement job`, { 
      jobId: job.id, 
      articleId: job.data.articleId 
    });
    
    const result = await processArticleEnhancement(job.data.articleId);
    return result;
  },
  {
    connection,
    concurrency: config.enhancement.maxConcurrent
  }
);

const queueEvents = new QueueEvents('article-enhancement', { connection });

queueEvents.on('completed', ({ jobId }) => {
  logger.info(`Enhancement job completed`, { jobId });
});

queueEvents.on('failed', ({ jobId, failedReason }) => {
  logger.error(`Enhancement job failed`, { 
    jobId, 
    error: failedReason 
  });
});

enhancementWorker.on('error', (err) => {
  logger.error('Enhancement worker error', { error: err.message });
});

export async function closeQueue() {
  await enhancementWorker.close();
  await enhancementQueue.close();
  await queueEvents.close();
  logger.info('Enhancement queue and worker closed');
}

export default enhancementQueue;