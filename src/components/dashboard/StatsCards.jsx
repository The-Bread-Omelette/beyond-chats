import { useEffect, useState } from 'react';
import { motion, useSpring, useTransform } from 'framer-motion';
import { Box, Typography, Grid } from '@mui/material';
import {
  DescriptionRounded,
  ScheduleRounded,
  CheckCircleRounded,
  ErrorRounded,
} from '@mui/icons-material';

const AnimatedCounter = ({ value }) => {
  const spring = useSpring(0, { mass: 0.8, stiffness: 75, damping: 15 });
  const display = useTransform(spring, (current) => Math.round(current));

  useEffect(() => {
    spring.set(value);
  }, [value, spring]);

  return <motion.span>{display}</motion.span>;
};

const StatCard = ({ icon: Icon, label, value, color, delay }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay }}
      whileHover={{ y: -5 }}
    >
      <Box
        sx={{
          p: 3,
          height: '100%',
          borderRadius: 3,
          position: 'relative',
          overflow: 'hidden',
          background: 'rgba(20, 20, 25, 0.4)', // Base dark
          backdropFilter: 'blur(10px)',
          border: '1px solid rgba(255, 255, 255, 0.05)',
          transition: 'border-color 0.3s',
          '&:hover': {
            borderColor: color,
            bgcolor: 'rgba(255,255,255,0.03)',
            transform: 'translateY(-2px)',
            boxShadow: `0 4px 20px -8px ${color}40`, // Subtle colored shadow instead of glow
          }
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', mb: 2 }}>
          <Box
            sx={{
              p: 1.5,
              borderRadius: 2,
              bgcolor: 'rgba(255,255,255,0.03)',
              border: '1px solid rgba(255,255,255,0.05)',
              display: 'flex'
            }}
          >
            <Icon sx={{ color: color, fontSize: 24 }} />
          </Box>
          {/* Trend Indicator could go here */}
        </Box>

        <Box>
          <Typography variant="body2" sx={{ color: 'text.secondary', fontWeight: 500, mb: 0.5 }}>
            {label}
          </Typography>
          <Typography variant="h3" sx={{ fontWeight: 700, color: 'white' }}>
            <AnimatedCounter value={value} />
          </Typography>
        </Box>
      </Box>
    </motion.div>
  );
};

const StatsCards = ({ articles = [], loading }) => {
  if (loading) return null;

  const stats = {
    total: articles.length,
    pending: articles.filter(a => a.enhancementStatus === 'pending').length,
    completed: articles.filter(a => ['completed', 'enhanced'].includes(a.enhancementStatus?.toLowerCase())).length,
    failed: articles.filter(a => a.enhancementStatus === 'failed').length,
  };

  return (
    <Box sx={{ mb: 6 }}>
      <Grid container spacing={3}>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            icon={DescriptionRounded}
            label="Total Articles"
            value={stats.total}
            color="#3B82F6"
            delay={0}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            icon={ScheduleRounded}
            label="Pending Processing"
            value={stats.pending}
            color="#F59E0B"
            delay={0.1}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            icon={CheckCircleRounded}
            label="Successfully Enhanced"
            value={stats.completed}
            color="#10B981"
            delay={0.2}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            icon={ErrorRounded}
            label="Failed Attempts"
            value={stats.failed}
            color="#EF4444"
            delay={0.3}
          />
        </Grid>
      </Grid>
    </Box>
  );
};

export default StatsCards;