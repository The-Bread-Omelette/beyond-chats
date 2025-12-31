import { Box, Typography, List, ListItem, ListItemText, Divider } from '@mui/material';
import { useEffect, useState } from 'react';
import { articleApi } from '../../api/endpoints/articles';
import { formatDistanceToNow } from 'date-fns';

const QueueOverview = () => {
  const [items, setItems] = useState([]);

  const fetch = async () => {
    try {
      const res = await articleApi.getQueueStats();
      // Attempt to show last jobs if available
      setItems(res.data?.last || []);
    } catch (err) {
      // silent fallback
      setItems([]);
    }
  };

  useEffect(() => {
    fetch();
  }, []);

  return (
    <Box sx={{ width: 360 }}>
      <Typography variant="h6" sx={{ mb: 1 }}>
        Queue
      </Typography>
      <Divider sx={{ mb: 1 }} />
      <List dense>
        {items.length === 0 ? (
          <ListItem>
            <ListItemText primary="No recent jobs" />
          </ListItem>
        ) : (
          items.map((it) => (
            <ListItem key={it.id}>
              <ListItemText
                primary={it.title || 'Untitled'}
                secondary={formatDistanceToNow(new Date(it.createdAt || Date.now()), { addSuffix: true })}
              />
            </ListItem>
          ))
        )}
      </List>
    </Box>
  );
};

export default QueueOverview;
