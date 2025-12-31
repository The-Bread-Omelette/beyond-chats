import express from 'express';
import mongoose from 'mongoose';
import enhancementQueue from '../infrastructure/queue/enhancementQueue.js';

const router = express.Router();

router.get('/health', async (req, res) => {
  const health = {
    uptime: process.uptime(),
    timestamp: Date.now(),
    status: 'OK',
    services: {
      database: 'disconnected',
      redis: 'disconnected'
    }
  };

  try {
    if (mongoose.connection.readyState === 1) {
      health.services.database = 'connected';
    }

    await enhancementQueue.client.ping();
    health.services.redis = 'connected';

    const allHealthy = Object.values(health.services).every(
      status => status === 'connected'
    );

    res.status(allHealthy ? 200 : 503).json(health);
  } catch (error) {
    health.status = 'ERROR';
    res.status(503).json(health);
  }
});

router.get('/ready', async (req, res) => {
  try {
    await mongoose.connection.db.admin().ping();
    await enhancementQueue.client.ping();
    res.status(200).json({ ready: true });
  } catch (error) {
    res.status(503).json({ ready: false });
  }
});

export default router;