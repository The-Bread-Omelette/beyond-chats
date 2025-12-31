import rateLimit from 'express-rate-limit';

export const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Reduced from 300
  standardHeaders: true,
  legacyHeaders: false,
  message: 'Too many requests from this IP, please try again later',
  skip: (req) => {
    // Skip rate limiting for health checks
    return req.path === '/health';
  }
});

export const enhancementLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 10, // Only 10 enhancement requests per hour
  message: 'Enhancement rate limit exceeded, please try again later'
});

export const createLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 50, // 50 creates per 15 minutes
  message: 'Too many articles created, please try again later'
});