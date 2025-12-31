import { Box, Paper, Typography, Chip } from '@mui/material';
import { useRef } from 'react';
import ReactMarkdown from 'react-markdown';

const VersionCompare = ({ original = '', enhanced = '' }) => {
  const leftRef = useRef(null);
  const rightRef = useRef(null);

  const handleScroll = (source, target) => {
    if (!source.current || !target.current) return;
    const percentage = source.current.scrollTop / (source.current.scrollHeight - source.current.clientHeight);
    target.current.scrollTop = percentage * (target.current.scrollHeight - target.current.clientHeight);
  };

  return (
    <Box
      sx={{
        display: 'grid',
        gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' },
        gap: 3,
        height: 600,
      }}
    >
      <Paper
        elevation={0}
        sx={{
          display: 'flex',
          flexDirection: 'column',
          bgcolor: 'rgba(255,255,255,0.02)',
          border: '1px solid rgba(255,255,255,0.05)',
          overflow: 'hidden'
        }}
      >
        <Box sx={{ p: 2, borderBottom: '1px solid rgba(255,255,255,0.05)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="subtitle2" fontWeight={600} color="text.secondary">ORIGINAL</Typography>
        </Box>
        <Box
          ref={leftRef}
          onScroll={() => handleScroll(leftRef, rightRef)}
          sx={{
            p: 3,
            overflow: 'auto',
            flexGrow: 1,
            '&::-webkit-scrollbar': { display: 'none' }, // Hide scrollbar for cleaner look vs sync
            scrollbarWidth: 'none'
          }}
        >
          <Typography
            component="div"
            variant="body2"
            sx={{ whiteSpace: 'pre-wrap', fontFamily: 'monospace', color: 'text.secondary', lineHeight: 1.6 }}
          >
            {original || 'No original content available.'}
          </Typography>
        </Box>
      </Paper>

      <Paper
        elevation={0}
        sx={{
          display: 'flex',
          flexDirection: 'column',
          bgcolor: 'rgba(255,255,255,0.02)',
          border: '1px solid rgba(34, 197, 94, 0.3)', // Green border hint
          overflow: 'hidden',
          position: 'relative'
        }}
      >
        <Box sx={{ p: 2, borderBottom: '1px solid rgba(255,255,255,0.05)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', bgcolor: 'rgba(34, 197, 94, 0.05)' }}>
          <Typography variant="subtitle2" fontWeight={600} color="success.main">ENHANCED</Typography>
          <Chip label="AI Optimized" size="small" color="success" variant="outlined" sx={{ height: 20, fontSize: '0.65rem' }} />
        </Box>
        <Box
          ref={rightRef}
          onScroll={() => handleScroll(rightRef, leftRef)}
          sx={{
            p: 3,
            overflow: 'auto',
            flexGrow: 1,
          }}
        >
          <Box className="markdown-content">
            <ReactMarkdown>{enhanced}</ReactMarkdown>
          </Box>
        </Box>
      </Paper>
    </Box>
  );
};

export default VersionCompare;
