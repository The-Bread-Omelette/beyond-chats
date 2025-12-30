import express from 'express';
import cors from 'cors';
import articleRoutes from './routes/articleRoutes.js';
import {apiLimiter} from './middleware/rateLimiter.js';

const app=express();

app.use(cors({
  origin:['http://localhost:3000'],
  methods:['GET','POST','PUT','DELETE'],
  credentials:true
}));

app.use(express.json());
app.use('/api',apiLimiter);
app.use('/api/articles',articleRoutes);

export default app;
