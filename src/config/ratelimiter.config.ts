import { registerAs } from '@nestjs/config';
import { AuthConfig, RateLimiterConfig } from './config.type';

export default registerAs<RateLimiterConfig>('ratelimiter', () => ({
  ttl: process.env.RATE_LIMITER_TTL
    ? parseInt(process.env.RATE_LIMITER_TTL)
    : 60,
  requests: process.env.RATE_LIMITER_REQUESTS
    ? parseInt(process.env.RATE_LIMITER_REQUESTS)
    : 10,
}));
