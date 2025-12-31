import { itemVariants } from '../ui/AnimatedList';
import { motion } from 'framer-motion';
import { Box } from '@mui/material';
import ArticleCard from './ArticleCard';

const ArticleGrid = ({ articles, onView, onEnhance }) => {
  return (
    <Box
      sx={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
        gap: 3,
      }}
    >
      {articles.map((article) => (
        <motion.div key={article._id} variants={itemVariants} initial="hidden" animate="show" exit="exit">
          <ArticleCard article={article} onView={onView} onEnhance={onEnhance} />
        </motion.div>
      ))}
    </Box>
  );
};

export default ArticleGrid;