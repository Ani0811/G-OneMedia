import { rateLimit } from 'express-rate-limit'

export const contactLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  limit: 10, // Limit each IP to 10 requests per 15 minutes
  message: { error: 'Too many requests from this IP, please try again after 15 minutes.' },
  standardHeaders: 'draft-7',
  legacyHeaders: false,
})

export const chatLimiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minute
  limit: 30, // Limit each IP to 30 requests per minute
  message: { error: 'Too many messages. Please slow down and try again in a minute.' },
  standardHeaders: 'draft-7',
  legacyHeaders: false,
})
