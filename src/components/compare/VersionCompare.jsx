import { Box, Paper, IconButton, Tooltip } from '@mui/material';
import { useRef } from 'react';
import ReactMarkdown from 'react-markdown';

const VersionCompare = ({ original = '', enhanced = '' }) => {
  const leftRef = useRef(null);
  const rightRef = useRef(null);

  const sync = (src, dst) => {
    if (!src.current || !dst.current) return;
    dst.current.scrollTop = src.current.scrollTop;
  };

  return (
    <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: 3 }}>
      <Paper elevation={0} sx={{ border: '1px solid', borderColor: 'divider', height: 520, overflow: 'auto' }} ref={leftRef} onScroll={() => sync(leftRef, rightRef)}>
        <Box sx={{ p: 3 }}>
          <ReactMarkdown>{original}</ReactMarkdown>
        </Box>
      </Paper>

      <Paper elevation={0} sx={{ border: '1px solid', borderColor: 'divider', height: 520, overflow: 'auto' }} ref={rightRef} onScroll={() => sync(rightRef, leftRef)}>
        <Box sx={{ p: 3 }}>
          <ReactMarkdown>{enhanced}</ReactMarkdown>
        </Box>
      </Paper>
    </Box>
  );
};

export default VersionCompare;
