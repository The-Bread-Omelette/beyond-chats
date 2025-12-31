import Article from '../../../models/Article.js';
import enhancementQueue from '../../../infrastructure/queue/enhancementQueue.js';
import logger from '../../../utils/logger.js';

export class EnhancementService {
  async queueArticle(articleId) {
    const article = await Article.findById(articleId);
    
    if (!article) {
      throw new Error('Article not found');
    }

    if (article.enhancementStatus === 'processing') {
      throw new Error('Enhancement already in progress');
    }

    const job = await enhancementQueue.add('enhance', {
      articleId: article._id.toString()
    });

    logger.info('Article queued for enhancement', {
      jobId: job.id,
      articleId: article._id
    });

    return {
      jobId: job.id,
      articleId: article._id
    };
  }

  async queueMultipleArticles(articleIds) {
    const jobs = await Promise.all(
      articleIds.map(articleId => 
        enhancementQueue.add('enhance', {
          articleId: articleId.toString()
        })
      )
    );

    logger.info(`Queued ${jobs.length} articles for enhancement`);

    return jobs.map(j => ({
      jobId: j.id,
      articleId: j.data.articleId
    }));
  }

  async getArticleStatus(articleId) {
    return Article.findById(articleId)
      .select('title enhancementStatus enhancedAt enhancementError references')
      .lean();
  }

  async getQueueStatistics() {
    const [waiting, active, completed, failed] = await Promise.all([
      enhancementQueue.getWaitingCount(),
      enhancementQueue.getActiveCount(),
      enhancementQueue.getCompletedCount(),
      enhancementQueue.getFailedCount()
    ]);

    return { 
      waiting, 
      active, 
      completed, 
      failed,
      total: waiting + active
    };
  }

  async retryFailedEnhancements(limit = 5) {
    const failedArticles = await Article.find({
      enhancementStatus: 'failed'
    })
      .limit(parseInt(limit))
      .select('_id');

    if (failedArticles.length === 0) {
      return { count: 0, message: 'No failed articles to retry' };
    }

    await Article.updateMany(
      { _id: { $in: failedArticles.map(a => a._id) } },
      { 
        enhancementStatus: 'pending',
        $unset: { enhancementError: 1 }
      }
    );

    const jobs = await this.queueMultipleArticles(
      failedArticles.map(a => a._id)
    );

    return {
      count: jobs.length,
      jobs
    };
  }
}

export default new EnhancementService();