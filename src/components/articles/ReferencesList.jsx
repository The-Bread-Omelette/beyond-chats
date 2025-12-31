import { Box, Paper, Typography, IconButton } from '@mui/material';
import { OpenInNew } from '@mui/icons-material';

const ReferencesList = ({ references }) => {
  if (!references || references.length === 0) return null;

  return (
    <Paper elevation={0} sx={{ p: 3, border: '1px solid', borderColor: 'divider', backgroundColor: '#fafafa' }}>
      <Typography variant="h6" gutterBottom sx={{ fontWeight: 600, mb: 2 }}>
        Sources & References
      </Typography>
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
        {references.map((ref, index) => (
          <Box key={ref.id || ref._id || index} sx={{ display: 'flex', alignItems: 'center', gap: 1, p: 1.5, borderRadius: 1, backgroundColor: 'white', border: '1px solid', borderColor: 'divider' }}>
            <Box sx={{ flex: 1 }}>
              <Typography variant='body2' sx={{ fontWeight: 500 }}>{ref.title}</Typography>
              <Typography variant='caption' color='text.secondary' sx={{ display: 'block', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{ref.url}</Typography>
            </Box>
            <IconButton size="small" href={ref.url} target="_blank" rel="noopener noreferrer">
              <OpenInNew fontSize="small" />
            </IconButton>
          </Box>
        ))}
      </Box>
    </Paper>
  );
};

export default ReferencesList;
