import { motion } from 'framer-motion';
import { Box, Skeleton } from '@mui/material';

const SkeletonCard = () => (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
  >
    <Box
      sx={{
        p: 2,
        border: '1px solid',
        borderColor: 'divider',
        borderRadius: 1.5,
      }}
    >
      <Skeleton variant="rectangular" height={120} sx={{ mb: 2, borderRadius: 1 }} />
      <Skeleton width="60%" height={24} sx={{ mb: 1 }} />
      <Skeleton width="40%" height={20} />
    </Box>
  </motion.div>
);

export const SkeletonGrid = ({ count = 6 }) => (
  <Box
    sx={{
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
      gap: 3,
    }}
  >
    {Array.from({ length: count }).map((_, i) => (
      <SkeletonCard key={i} />
    ))}
  </Box>
);

export default SkeletonCard;