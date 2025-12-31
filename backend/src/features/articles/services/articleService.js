import Article from '../../../models/Article.js';
import logger from '../../../utils/logger.js';

export class ArticleService {
  async findAll(filters = {}) {
    const { 
      status, 
      page = 1, 
      limit = 20, 
      sortBy = 'createdAt', 
      order = 'asc' 
    } = filters;
    
    const query = status ? { enhancementStatus: status } : {};
    const skip = (page - 1) * limit;
    const sort = { [sortBy]: order === 'desc' ? -1 : 1 };
    
    const [articles, total] = await Promise.all([
      Article.find(query)
        .sort(sort)
        .skip(skip)
        .limit(parseInt(limit))
        .select('-__v')
        .lean(),
      Article.countDocuments(query)
    ]);
    
    return {
      articles,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit)
      }
    };
  }

  async findById(id) {
    return Article.findById(id).select('-__v').lean();
  }

  async create(data) {
    const article = await Article.create(data);
    logger.info('Article created', { articleId: article._id });
    return article;
  }

  async update(id, data) {
    const article = await Article.findByIdAndUpdate(
      id,
      data,
      { new: true, runValidators: true }
    ).select('-__v');
    
    if (article) {
      logger.info('Article updated', { articleId: article._id });
    }
    
    return article;
  }

  async delete(id) {
    const article = await Article.findByIdAndDelete(id);
    
    if (article) {
      logger.info('Article deleted', { articleId: article._id });
    }
    
    return article;
  }

  async existsByUrl(url) {
    return Article.exists({ url });
  }

  async findPendingArticles(limit = 10) {
    return Article.find({ 
      enhancementStatus: 'pending' 
    })
      .limit(parseInt(limit))
      .select('_id title enhancementStatus')
      .lean();
  }
}

export default new ArticleService();