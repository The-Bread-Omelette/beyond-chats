import express from 'express';
import cors from 'cors';
import { env } from './config/env.js';
import helmet from 'helmet';
import mongoSanitize from 'express-mongo-sanitize';
import routes from './routes/index.js';
import {apiLimiter} from './middleware/rateLimiter.js';
import { errorHandler } from './middleware/errorHandler.js';

const app = express();

// Trust first proxy (Render's reverse proxy)
app.set('trust proxy', 1);

app.use(helmet());
app.use(mongoSanitize());

app.use(cors({
  origin: env.ALLOWED_ORIGINS.split(','),
  methods:['GET','POST','PUT','DELETE'],
  credentials:true
}));

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

app.use('/api', apiLimiter);
app.use('/api', routes);

app.use((req, res) => {
  res.status(404).json({
    success: false,
    error: 'Route not found'
  });
});

app.use(errorHandler);

export default app;
