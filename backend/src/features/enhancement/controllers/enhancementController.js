import Article from '../../../models/Article.js';
import enhancementQueue from '../../../infrastructure/queue/enhancementQueue.js';
import { AppError } from '../../../middleware/errorHandler.js';
import logger from '../../../utils/logger.js';

export const enhanceSingleArticle = async (req, res, next) => {
  try {
    const article = await Article.findById(req.params.id);
    
    if (!article) {
      throw new AppError('Article not found', 404);
    }

    if (article.enhancementStatus === 'processing') {
      throw new AppError('Enhancement already in progress', 409);
    }

    const job = await enhancementQueue.add('enhance', {
      articleId: article._id.toString()
    });

    logger.info('Article queued for enhancement', {
      jobId: job.id,
      articleId: article._id,
      title: article.title
    });

    res.json({
      success: true,
      message: 'Enhancement queued',
      data: {
        jobId: job.id,
        articleId: article._id
      }
    });
  } catch (error) {
    next(error);
  }
};

export const enhanceAllPendingArticles = async (req, res, next) => {
  try {
    const limit = req.query.limit ? parseInt(req.query.limit) : 5; // default to oldest 5

    const articles = await Article.find({ 
      enhancementStatus: 'pending' 
    })
      .sort({ createdAt: 1 })
      .limit(limit);

    if (articles.length === 0) {
      return res.json({
        success: true,
        message: 'No pending articles to enhance'
      });
    }

    const jobs = await Promise.all(
      articles.map(article => 
        enhancementQueue.add('enhance', {
          articleId: article._id.toString()
        })
      )
    );

    logger.info(`Queued ${jobs.length} articles for enhancement`);

    res.json({
      success: true,
      message: `Queued ${jobs.length} articles for enhancement`,
      data: jobs.map(j => ({
        jobId: j.id,
        articleId: j.data.articleId
      }))
    });
  } catch (error) {
    next(error);
  }
};

export const getEnhancementStatus = async (req, res, next) => {
  try {
    const article = await Article.findById(req.params.id)
      .select('title enhancementStatus enhancedAt enhancementError references');

    if (!article) {
      throw new AppError('Article not found', 404);
    }

    res.json({
      success: true,
      data: article
    });
  } catch (error) {
    next(error);
  }
};

export const getQueueStats = async (req, res, next) => {
  try {
    const [waiting, active, completed, failed] = await Promise.all([
      enhancementQueue.getWaitingCount(),
      enhancementQueue.getActiveCount(),
      enhancementQueue.getCompletedCount(),
      enhancementQueue.getFailedCount()
    ]);

    res.json({
      success: true,
      data: { 
        waiting, 
        active, 
        completed, 
        failed,
        total: waiting + active
      }
    });
  } catch (error) {
    next(error);
  }
};