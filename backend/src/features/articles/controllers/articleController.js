import Article from '../../../models/Article.js';
import { AppError } from '../../../middleware/errorHandler.js';
import logger from '../../../utils/logger.js';

export const createArticle = async (req, res, next) => {
  try {
    const existingArticle = await Article.findOne({ url: req.body.url });
    
    if (existingArticle) {
      throw new AppError('Article with this URL already exists', 409);
    }
    
    const article = await Article.create(req.body);
    
    logger.info('Article created', { 
      articleId: article._id, 
      title: article.title 
    });
    
    res.status(201).json({
      success: true,
      data: article
    });
  } catch (error) {
    next(error);
  }
};

export const getAllArticles = async (req, res, next) => {
  try {
    const { status } = req.query;
    const page = parseInt(req.query.page) || 1;
    const limit = req.query.limit ? parseInt(req.query.limit) : 5; // default to oldest 5
    const sortBy = req.query.sortBy;
    const order = req.query.order;

    const query = status ? { enhancementStatus: status } : {};
    const skip = (page - 1) * limit;

    // If client provided sortBy/order, respect it. Otherwise default to oldest first.
    const sort = sortBy
      ? { [sortBy]: order === 'desc' ? -1 : 1 }
      : { createdAt: 1 };

    const [articles, total] = await Promise.all([
      Article.find(query)
        .sort(sort)
        .skip(skip)
        .limit(limit)
        .select('-__v'),
      Article.countDocuments(query)
    ]);
    
    res.json({
      success: true,
      data: articles,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    next(error);
  }
};

export const getArticleById = async (req, res, next) => {
  try {
    const article = await Article.findById(req.params.id).select('-__v');
    
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

export const updateArticle = async (req, res, next) => {
  try {
    const article = await Article.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    ).select('-__v');
    
    if (!article) {
      throw new AppError('Article not found', 404);
    }
    
    logger.info('Article updated', { 
      articleId: article._id, 
      title: article.title 
    });
    
    res.json({
      success: true,
      data: article
    });
  } catch (error) {
    next(error);
  }
};

export const deleteArticle = async (req, res, next) => {
  try {
    const article = await Article.findByIdAndDelete(req.params.id);
    
    if (!article) {
      throw new AppError('Article not found', 404);
    }
    
    logger.info('Article deleted', { 
      articleId: article._id, 
      title: article.title 
    });
    
    res.json({
      success: true,
      message: 'Article deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};