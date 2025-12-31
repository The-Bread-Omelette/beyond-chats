import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Box,
  Typography,
  Grid,
  LinearProgress,
  Button,
} from '@mui/material';
import {
  RefreshRounded,
  ScheduleRounded,
  AutorenewRounded,
  CheckCircleRounded,
  ErrorRounded,
} from '@mui/icons-material';
import { articleApi } from '../api/endpoints/articles';
import PageTransition from '../components/ui/PageTransition';
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
      show('Failed to load queue statistics', { severity: 'error' });
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
    { label: 'Waiting', value: stats?.waiting || 0, color: '#F59E0B', icon: ScheduleRounded },
    { label: 'Active Processing', value: stats?.active || 0, color: '#3B82F6', icon: AutorenewRounded },
    { label: 'Completed', value: stats?.completed || 0, color: '#10B981', icon: CheckCircleRounded },
    { label: 'Failed', value: stats?.failed || 0, color: '#EF4444', icon: ErrorRounded },
  ];

  const totalJobs = (stats?.waiting || 0) + (stats?.active || 0) + (stats?.completed || 0) + (stats?.failed || 0);
  const completionRate = stats?.completed && totalJobs > 0
    ? ((stats.completed / totalJobs) * 100).toFixed(1)
    : 0;

  return (
    <PageTransition>
      <Box sx={{ maxWidth: 1200, mx: 'auto' }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', mb: 6 }}>
          <Box>
            <Typography variant="caption" color="primary" fontWeight={600} letterSpacing={1} sx={{ mb: 1, display: 'block' }}>
              SYSTEM STATUS
            </Typography>
            <Typography variant="h2" sx={{ fontWeight: 700, mb: 1 }}>
              Queue Activity
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Real-time monitoring of enhancement jobs.
            </Typography>
          </Box>
          <Button
            variant="outlined"
            startIcon={<RefreshRounded />}
            onClick={fetchStats}
            disabled={loading}
          >
            Refresh Data
          </Button>
        </Box>

        <Grid container spacing={3} sx={{ mb: 6 }}>
          {statCards.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <Grid item xs={12} sm={6} md={3} key={stat.label}>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Box
                    sx={{
                      p: 3,
                      borderRadius: 3,
                      bgcolor: 'rgba(255,255,255,0.02)',
                      border: '1px solid rgba(255,255,255,0.05)',
                      height: '100%',
                      position: 'relative',
                      overflow: 'hidden',
                    }}
                  >
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                      <Box sx={{ p: 1, borderRadius: 1.5, bgcolor: `${stat.color}15`, mr: 2 }}>
                        <Icon sx={{ fontSize: 24, color: stat.color }} />
                      </Box>
                      <Box>
                        <Typography variant="body2" color="text.secondary">
                          {stat.label}
                        </Typography>
                        <Typography variant="h4" fontWeight={700}>
                          {stat.value}
                        </Typography>
                      </Box>
                    </Box>

                    <LinearProgress
                      variant="determinate"
                      value={totalJobs ? (stat.value / Math.max(1, totalJobs)) * 100 : 0}
                      sx={{
                        height: 4,
                        borderRadius: 2,
                        bgcolor: 'rgba(255,255,255,0.05)',
                        '& .MuiLinearProgress-bar': { bgcolor: stat.color }
                      }}
                    />
                  </Box>
                </motion.div>
              </Grid>
            );
          })}
        </Grid>

        {/* Aggregates */}
        <Grid container spacing={3}>
          <Grid item xs={12} md={8}>
            <Box sx={{ p: 4, borderRadius: 3, bgcolor: 'background.paper', border: '1px solid', borderColor: 'divider' }}>
              <Typography variant="h6" gutterBottom>Total Throughput</Typography>
              <Typography variant="h3" fontWeight={700} color="primary">{totalJobs}</Typography>
              <Typography variant="body2" color="text.secondary">Jobs processed in current session</Typography>
            </Box>
          </Grid>
          <Grid item xs={12} md={4}>
            <Box sx={{ p: 4, borderRadius: 3, bgcolor: 'background.paper', border: '1px solid', borderColor: 'divider' }}>
              <Typography variant="h6" gutterBottom>Success Rate</Typography>
              <Typography variant="h3" fontWeight={700} color="success.main">{completionRate}%</Typography>
              <LinearProgress
                variant="determinate"
                value={Number(completionRate)}
                sx={{ mt: 2, height: 6, borderRadius: 3, bgcolor: 'rgba(255,255,255,0.05)', '& .MuiLinearProgress-bar': { bgcolor: '#10B981' } }}
              />
            </Box>
          </Grid>
        </Grid>

      </Box>
    </PageTransition>
  );
};

export default QueueStatsPage;