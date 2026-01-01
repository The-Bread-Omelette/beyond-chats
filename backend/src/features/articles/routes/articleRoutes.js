import express from 'express';
import * as articleController from '../controllers/articleController.js';
import { 
  createArticleValidator, 
  updateArticleValidator, 
  articleIdValidator 
} from '../validators/articleValidators.js';
import { validateRequest } from '../../../middleware/validateRequest.js';
import { createLimiter } from '../../../middleware/rateLimiter.js';
import { apiLimiter } from '../../../middleware/rateLimiter.js';

const router = express.Router();

router.post(
  '/',
  createLimiter,
  createArticleValidator,
  validateRequest,
  articleController.createArticle
);

router.post(
  '/scrape',
  apiLimiter,
  articleController.scrapeLastPage
);

router.get(
  '/',
  articleController.getAllArticles
);

router.get(
  '/:id',
  articleIdValidator,
  validateRequest,
  articleController.getArticleById
);

router.put(
  '/:id',
  updateArticleValidator,
  validateRequest,
  articleController.updateArticle
);

router.delete(
  '/:id',
  articleIdValidator,
  validateRequest,
  articleController.deleteArticle
);

// Clear entire collection (use with caution)
router.delete(
  '/',
  apiLimiter,
  articleController.clearAllArticles
);

export default router;