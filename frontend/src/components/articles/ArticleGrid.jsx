import { motion } from 'framer-motion';
import AnimatedList, { itemVariants } from '../ui/AnimatedList';
import { Box } from '@mui/material';
import ArticleCard from './ArticleCard';
import RevealOnScroll from '../ui/RevealOnScroll';

const ArticleGrid = ({ articles, onView, onEnhance }) => {
  return (
    <AnimatedList>
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
          gap: 3,
        }}
      >
        {articles.map((article) => (
          <motion.div key={article._id} variants={itemVariants}>
            <RevealOnScroll>
              <ArticleCard article={article} onView={onView} onEnhance={onEnhance} />
            </RevealOnScroll>
          </motion.div>
        ))}
      </Box>
    </AnimatedList>
  );
};

export default ArticleGrid;