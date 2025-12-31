import { Box, Typography, IconButton, Link } from '@mui/material';
import { OpenInNewRounded, LinkRounded } from '@mui/icons-material';

const ReferencesList = ({ references }) => {
  if (!references || references.length === 0) return null;

  return (
    <Box
      sx={{
        p: 3,
        borderRadius: 3,
        bgcolor: 'rgba(255,255,255,0.02)',
        border: '1px solid rgba(255,255,255,0.05)'
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 3 }}>
        <LinkRounded sx={{ color: 'primary.main' }} />
        <Typography variant="h6" fontWeight={600}>
          Sources & Verification
        </Typography>
      </Box>

      <Box sx={{ display: 'grid', gap: 2, gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))' }}>
        {references.map((ref, index) => (
          <Box
            key={ref.id || index}
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 2,
              p: 2,
              borderRadius: 2,
              bgcolor: 'rgba(255,255,255,0.03)',
              border: '1px solid rgba(255,255,255,0.05)',
              transition: 'background 0.2s',
              '&:hover': {
                bgcolor: 'rgba(255,255,255,0.06)'
              }
            }}
          >
            <Box sx={{ flex: 1, overflow: 'hidden' }}>
              <Typography variant='subtitle2' fontWeight={600} noWrap>
                {ref.title || 'Untitled Source'}
              </Typography>
              <Link
                href={ref.url}
                target="_blank"
                color="text.secondary"
                underline="hover"
                sx={{ fontSize: '0.75rem', display: 'block', mt: 0.5 }}
                noWrap
              >
                {ref.url}
              </Link>
            </Box>
            <IconButton
              size="small"
              href={ref.url}
              target="_blank"
              sx={{ color: 'text.secondary', '&:hover': { color: 'primary.main' } }}
            >
              <OpenInNewRounded fontSize="small" />
            </IconButton>
          </Box>
        ))}
      </Box>
    </Box>
  );
};

export default ReferencesList;
