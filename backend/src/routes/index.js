import express from 'express';
import articleRoutes from '../features/articles/routes/articleRoutes.js';
import enhancementRoutes from '../features/enhancement/routes/enhancementRoutes.js';
import healthRoutes from './healthRoutes.js';

const router = express.Router();

router.use('/health', healthRoutes);
router.use('/articles', articleRoutes);
router.use('/enhancement', enhancementRoutes);

export default router;