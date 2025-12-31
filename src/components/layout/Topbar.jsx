import { useEffect, useState, useRef } from 'react';
import { IconButton, Box, InputBase, Paper, Tooltip, Badge, Popover } from '@mui/material';
import { Search, Queue as QueueIcon } from '@mui/icons-material';
import { motion } from 'framer-motion';
import { articleApi } from '../../api/endpoints/articles';
import { Link } from 'react-router-dom';
import { useToast } from '../ui/ToastProvider';
import QueueOverview from '../queue/QueueOverview';

const Topbar = () => {
  const [query, setQuery] = useState('');
  const [queueCount, setQueueCount] = useState(0);
  const { show } = useToast();
  const [anchorEl, setAnchorEl] = useState(null);
  const inputRef = useRef(null);
  const badgeRef = useRef(null);

  const fetchQueue = async () => {
    try {
      const res = await articleApi.getQueueStats();
      setQueueCount((res.data?.waiting || 0) + (res.data?.active || 0));
    } catch (err) {
      show('Unable to load queue', { severity: 'error' });
    }
  };

  useEffect(() => {
    fetchQueue();
    const t = setInterval(fetchQueue, 7000);
    return () => clearInterval(t);
  }, []);

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === '/' && document.activeElement.tagName !== 'INPUT') {
        e.preventDefault();
        inputRef.current?.focus();
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  return (
    <Box sx={{ display: 'flex', gap: 2, alignItems: 'center', py: 1 }}>
      <Paper
        component={motion.div}
        whileFocus={{ scale: 1.01 }}
        sx={{ display: 'flex', alignItems: 'center', px: 1, width: 360, maxWidth: '60%' }}
        elevation={0}
      >
        <IconButton size="small" sx={{ mr: 1 }}>
          <Search />
        </IconButton>
        <InputBase
          placeholder="Search articles..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          sx={{ flex: 1 }}
          inputProps={{ 'aria-label': 'search articles' }}
          inputRef={inputRef}
        />
      </Paper>

      <Box sx={{ flex: 1 }} />

      <Tooltip title="Queue overview">
        <IconButton
          ref={badgeRef}
          size="large"
          onClick={(e) => setAnchorEl(e.currentTarget)}
          aria-describedby={anchorEl ? 'queue-popover' : undefined}
        >
          <Badge badgeContent={queueCount} color="primary">
            <QueueIcon />
          </Badge>
        </IconButton>
      </Tooltip>

      <Popover
        id="queue-popover"
        open={Boolean(anchorEl)}
        anchorEl={anchorEl}
        onClose={() => setAnchorEl(null)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
        PaperProps={{ sx: { p: 2, width: 360 } }}
      >
        <QueueOverview />
      </Popover>
    </Box>
  );
};

export default Topbar;
