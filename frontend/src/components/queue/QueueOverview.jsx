import { Box, Typography, List, ListItem, ListItemText, Divider, Chip } from '@mui/material';
import { useEffect, useState } from 'react';
import { articleApi } from '../../api/endpoints/articles';
import { formatDistanceToNow } from 'date-fns';

const QueueOverview = () => {
  const [items, setItems] = useState([]);
  const [meta, setMeta] = useState({});

  const fetchStats = async () => {
    try {
      const res = await articleApi.getQueueStats();
      const d = res.data || {};
      const last = d.last || [];
      setItems(last);
      setMeta({ waiting: d.waiting || 0, active: d.active || 0, completed: d.completed || 0, failed: d.failed || 0 });
    } catch (err) {
      setItems([]);
      setMeta({ waiting: 0, active: 0, completed: 0, failed: 0 });
    }
  };

  useEffect(() => { fetchStats(); }, []);

  return (
    <Box sx={{ width: { xs: '100%', sm: 360 }, bgcolor: 'rgba(18,18,20,0.65)', border: '1px solid', borderColor: 'divider', borderRadius: 2, p: 2 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
        <Typography variant="h6">Queue</Typography>
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Chip label={`Waiting ${meta.waiting || 0}`} size="small" />
          <Chip label={`Active ${meta.active || 0}`} color="primary" size="small" />
        </Box>
      </Box>
      <Divider sx={{ mb: 1 }} />
      <List dense>
        {items.length === 0 ? (
          <ListItem>
            <ListItemText primary="No recent jobs" />
          </ListItem>
        ) : (
          items.map((it) => (
            <ListItem key={it.id} sx={{ alignItems: 'flex-start' }}>
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
