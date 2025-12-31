import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import mongoSanitize from 'express-mongo-sanitize';
import routes from './routes/index.js';
import {apiLimiter} from './middleware/rateLimiter.js';
import { errorHandler } from './middleware/errorHandler.js';

const app=express();

app.use(helmet());
app.use(mongoSanitize());

app.use(cors({
  origin:['http://localhost:3000'],
  methods:['GET','POST','PUT','DELETE'],
  credentials:true
}));

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

app.use('/api',apiLimiter);
app.use('/api', routes);

app.use((req, res) => {
  res.status(404).json({
    success: false,
    error: 'Route not found'
  });
});

app.use(errorHandler);

export default app;
