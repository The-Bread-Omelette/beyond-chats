import express from 'express';
import * as enhancementController from '../controllers/enhancementController.js';
import { articleIdValidator } from '../../articles/validators/articleValidators.js';
import { validateRequest } from '../../../middleware/validateRequest.js';
import { enhancementLimiter } from '../../../middleware/rateLimiter.js';
import { apiLimiter } from '../../../middleware/rateLimiter.js';

const router = express.Router();

router.post(
  '/enhance/:id',
  enhancementLimiter,
  articleIdValidator,
  validateRequest,
  enhancementController.enhanceSingleArticle
);

router.post(
  '/enhance-all',
  enhancementLimiter,
  enhancementController.enhanceAllPendingArticles
);

router.get(
  '/status/:id',
  articleIdValidator,
  validateRequest,
  enhancementController.getEnhancementStatus
);

router.get(
  '/queue/stats',
  enhancementController.getQueueStats
);

router.post(
  '/revert/:id',
  enhancementLimiter,
  articleIdValidator,
  validateRequest,
  enhancementController.revertEnhancement
);

router.post(
  '/revert-all',
  apiLimiter,
  enhancementController.revertAllEnhancements
);

export default router;