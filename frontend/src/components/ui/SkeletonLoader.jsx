import { Box, Skeleton } from '@mui/material';

const SkeletonCard = () => (
  <Box
    sx={{
      p: 3,
      borderRadius: 3,
      bgcolor: 'rgba(255,255,255,0.02)',
      border: '1px solid rgba(255,255,255,0.05)',
      height: '100%',
    }}
  >
    <Skeleton
      variant="text"
      width="40%"
      height={24}
      sx={{ mb: 2, bgcolor: 'rgba(255,255,255,0.05)' }}
    />
    <Skeleton
      variant="rectangular"
      height={60}
      sx={{ mb: 2, borderRadius: 1, bgcolor: 'rgba(255,255,255,0.05)' }}
    />
    <Skeleton
      variant="text"
      width="80%"
      sx={{ bgcolor: 'rgba(255,255,255,0.05)' }}
    />
    <Box sx={{ mt: 4, display: 'flex', gap: 2 }}>
      <Skeleton variant="rounded" width={80} height={32} sx={{ bgcolor: 'rgba(255,255,255,0.05)' }} />
      <Skeleton variant="rounded" width={32} height={32} sx={{ bgcolor: 'rgba(255,255,255,0.05)' }} />
    </Box>
  </Box>
);

export const SkeletonGrid = ({ count = 6 }) => (
  <Box
    sx={{
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
      gap: 3,
    }}
  >
    {Array.from({ length: count }).map((_, i) => (
      <SkeletonCard key={i} />
    ))}
  </Box>
);

export default SkeletonCard;