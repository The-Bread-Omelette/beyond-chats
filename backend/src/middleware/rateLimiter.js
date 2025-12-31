import rateLimit from 'express-rate-limit';

export const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
  message: 'Too many requests from this IP, please try again later',
  skip: (req) => {
    return req.path === '/health';
  }
});

export const enhancementLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 10,
  message: 'Enhancement rate limit exceeded, please try again later'
});

export const createLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 50,
  message: 'Too many articles created, please try again later'
});