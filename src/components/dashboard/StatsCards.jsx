import { motion } from 'framer-motion';
import { itemVariants } from '../ui/AnimatedList';
import { Box, Paper, Typography, Grid } from '@mui/material';
import {
  Article,
  AutoAwesome,
  CheckCircle,
  Schedule,
  Error as ErrorIcon,
} from '@mui/icons-material';
import { fadeInUp, staggerContainer } from '../../utils/motionVariants';
import { useInView } from 'react-intersection-observer';

const StatCard = ({ icon: Icon, label, value, color, delay }) => {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  return (
    <motion.div ref={ref} variants={itemVariants} initial="hidden" animate={inView ? 'show' : 'hidden'} transition={{ delay }}>
      <Paper
        elevation={0}
        sx={{
          p: 3,
          border: '1px solid',
          borderColor: 'divider',
          position: 'relative',
          overflow: 'hidden',
          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          '&:hover': {
            borderColor: color,
            transform: 'translateY(-4px)',
            boxShadow: `0 8px 24px ${color}15`,
          },
        }}
      >
        <Box
          sx={{
            position: 'absolute',
            top: -10,
            right: -10,
            width: 100,
            height: 100,
            background: `radial-gradient(circle, ${color}15 0%, transparent 70%)`,
          }}
        />
        
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 1 }}>
          <Box
            sx={{
              p: 1.5,
              borderRadius: 2,
              bgcolor: `${color}10`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Icon sx={{ color, fontSize: 28 }} />
          </Box>
          
          <Box>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
              {label}
            </Typography>
            <motion.div
              initial={{ scale: 0 }}
              animate={inView ? { scale: 1 } : {}}
              transition={{ duration: 0.5, delay: delay + 0.2 }}
            >
              <Typography variant="h4" sx={{ fontWeight: 700 }}>
                {value}
              </Typography>
            </motion.div>
          </Box>
        </Box>
      </Paper>
    </motion.div>
  );
};

const StatsCards = ({ articles, loading }) => {
  if (loading) return null;

  const stats = {
    total: articles.length,
    pending: articles.filter(a => a.enhancementStatus === 'pending').length,
    completed: articles.filter(a => a.enhancementStatus === 'completed').length,
    failed: articles.filter(a => a.enhancementStatus === 'failed').length,
  };

  return (
    <Box sx={{ mb: 6 }}>
      <Grid container spacing={3}>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            icon={Article}
            label="Total Articles"
            value={stats.total}
            color="#0052cc"
            delay={0}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            icon={Schedule}
            label="Pending"
            value={stats.pending}
            color="#ff991f"
            delay={0.1}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            icon={CheckCircle}
            label="Enhanced"
            value={stats.completed}
            color="#00875a"
            delay={0.2}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            icon={ErrorIcon}
            label="Failed"
            value={stats.failed}
            color="#de350b"
            delay={0.3}
          />
        </Grid>
      </Grid>
    </Box>
  );
};

export default StatsCards;