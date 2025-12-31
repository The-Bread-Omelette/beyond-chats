import { useEffect, useState } from 'react';
import { IconButton, Box, InputBase, Paper, Tooltip, Badge } from '@mui/material';
import { Search, Queue as QueueIcon } from '@mui/icons-material';
import { motion } from 'framer-motion';
import { articleApi } from '../../api/endpoints/articles';
import { Link } from 'react-router-dom';
import { useToast } from '../ui/ToastProvider';

const Topbar = () => {
  const [query, setQuery] = useState('');
  const [queueCount, setQueueCount] = useState(0);
  const { show } = useToast();

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
        />
      </Paper>

      <Box sx={{ flex: 1 }} />

      <Tooltip title="Queue overview">
        <IconButton component={Link} to="/queue" size="large">
          <Badge badgeContent={queueCount} color="primary">
            <QueueIcon />
          </Badge>
        </IconButton>
      </Tooltip>
    </Box>
  );
};

export default Topbar;
