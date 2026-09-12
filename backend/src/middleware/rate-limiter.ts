import rateLimit from 'express-rate-limit';

/**
 * Rate limiter for the /api/chat endpoint.
 * 30 requests per minute per IP in production.
 * Disabled in development for convenience.
 */
export const chatRateLimit = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 30,
  standardHeaders: 'draft-7',
  legacyHeaders: false,
  skip: () => process.env['NODE_ENV'] === 'development',
  message: {
    success: false,
    error: 'Too many requests. Please wait a moment and try again.',
  },
});

/**
 * General rate limiter for all API routes.
 * 200 requests per 15 minutes per IP.
 */
export const generalRateLimit = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 200,
  standardHeaders: 'draft-7',
  legacyHeaders: false,
  message: {
    success: false,
    error: 'Too many requests. Please try again later.',
  },
});
