import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Box,
  Typography,
  Paper,
  Grid,
  LinearProgress,
  Button,
} from '@mui/material';
import {
  Refresh,
  Schedule,
  Loop,
  CheckCircle,
  Error as ErrorIcon,
} from '@mui/icons-material';
import { articleApi } from '../api/endpoints/articles';
import PageTransition from '../components/ui/PageTransition';
import { fadeInUp } from '../utils/motionVariants';
import { useToast } from '../components/ui/ToastProvider';

const QueueStatsPage = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const { show } = useToast();

  const fetchStats = async () => {
    try {
      setLoading(true);
      const response = await articleApi.getQueueStats();
      setStats(response.data);
    } catch (err) {
      console.error('Failed to fetch stats:', err);
      show('Failed to load queue statistics', { severity: 'error', action: { label: 'Retry', onClick: fetchStats } });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
    const interval = setInterval(fetchStats, 5000);
    return () => clearInterval(interval);
  }, []);

  const statCards = [
    { label: 'Waiting', value: stats?.waiting || 0, color: '#ff991f', icon: Schedule },
    { label: 'Active', value: stats?.active || 0, color: '#0052cc', icon: Loop },
    { label: 'Completed', value: stats?.completed || 0, color: '#00875a', icon: CheckCircle },
    { label: 'Failed', value: stats?.failed || 0, color: '#de350b', icon: ErrorIcon },
  ];

  const totalJobs = (stats?.waiting || 0) + (stats?.active || 0);
  const completionRate = stats?.completed
    ? ((stats.completed / (stats.completed + stats.failed)) * 100).toFixed(1)
    : 0;

  return (
    <PageTransition>
      <Box>
        <motion.div variants={fadeInUp} initial="initial" animate="animate">
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
            <Typography variant="h4" sx={{ fontWeight: 700 }}>
              Queue Statistics
            </Typography>
            <Button
              variant="outlined"
              startIcon={<Refresh />}
              onClick={fetchStats}
              disabled={loading}
            >
              Refresh
            </Button>
          </Box>
        </motion.div>

        <Grid container spacing={3}>
          {statCards.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <Grid item xs={12} sm={6} md={3} key={stat.label}>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.08 }}
                >
                  <Paper sx={{ p: 2, height: '100%' }} elevation={2}>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <Icon sx={{ fontSize: 40, color: stat.color, mr: 2 }} />
                      <Box>
                        <Typography variant="subtitle2" sx={{ color: 'text.secondary' }}>
                          {stat.label}
                        </Typography>
                        <Typography variant="h5" sx={{ fontWeight: 700 }}>
                          {stat.value}
                        </Typography>
                      </Box>
                    </Box>

                    <Box sx={{ mt: 2 }}>
                      <LinearProgress
                        variant="determinate"
                        value={totalJobs ? (stat.value / Math.max(1, totalJobs)) * 100 : 0}
                        sx={{ height: 8, borderRadius: 1 }}
                      />
                    </Box>
                  </Paper>
                </motion.div>
              </Grid>
            );
          })}
        </Grid>

        <Box sx={{ mt: 4, display: 'flex', gap: 3, alignItems: 'center' }}>
          <Paper sx={{ p: 2, flex: '1 1 320px' }} elevation={1}>
            <Typography variant="subtitle2" sx={{ color: 'text.secondary' }}>
              Total Jobs
            </Typography>
            <Typography variant="h4" sx={{ fontWeight: 700 }}>
              {totalJobs}
            </Typography>
          </Paper>

          <Paper sx={{ p: 2, width: 220 }} elevation={1}>
            <Typography variant="subtitle2" sx={{ color: 'text.secondary' }}>
              Completion Rate
            </Typography>
            <Typography variant="h4" sx={{ fontWeight: 700 }}>
              {completionRate}%
            </Typography>
            <LinearProgress
              variant="determinate"
              value={Number(completionRate) || 0}
              sx={{ mt: 2, height: 8, borderRadius: 1 }}
            />
          </Paper>
        </Box>

      </Box>
    </PageTransition>
  );
};

export default QueueStatsPage;