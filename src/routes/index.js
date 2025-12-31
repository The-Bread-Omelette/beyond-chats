import express from 'express';
import articleRoutes from '../features/articles/routes/articleRoutes.js';

const router = express.Router();

router.use('/articles', articleRoutes);

export default router;