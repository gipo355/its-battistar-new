/* eslint-disable no-magic-numbers */
import type { CorsOptions } from 'cors';
import type { CookieOptions } from 'express';
import type { HelmetOptions } from 'helmet';
import type { IRateLimiterRedisOptions } from 'rate-limiter-flexible';

import { rateLimitRedisConnection } from './db/redis';
import { e } from './environments';

export const APP_CONFIG = {
  API_VERSION: 'v1',

  corsOptions: {
    origin: e.CORS_ORIGINS,
    methods: 'GET,PATCH,POST,DELETE',
    preflightContinue: false,
    optionsSuccessStatus: 204,
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
    maxAge: 86400,
  } satisfies CorsOptions,

  helmetOptions: {} satisfies HelmetOptions,

  // rate limiting
  rateLimiterOptions: {
    storeClient: rateLimitRedisConnection,
    points: Number(e.RATE_LIMITER_POINTS), // Number of points
    duration: Number(e.RATE_LIMITER_DURATION), // Per second(s)
    keyPrefix: 'rateLimiter',

    // Custom
    execEvenly: false, // Do not delay actions evenly
    // blockDuration: 0, // Do not block if consumed more than points
  } satisfies IRateLimiterRedisOptions,

  RANDOM_BYTES_VALUE: 32,

  RESET_TOKEN_EXPIRY_MINS: 10,

  JWT_REFRESH_COOKIE_OPTIONS: {
    httpOnly: true,
    secure: e.NODE_ENV === 'production',
    expires: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7), // 7 days
    sameSite: 'strict',
  } satisfies CookieOptions,

  JWT_ACCESS_COOKIE_OPTIONS: {
    httpOnly: true,
    secure: e.NODE_ENV === 'production',
    expires: new Date(Date.now() + 1000 * 60 * 2), // 2 minutes
    sameSite: 'strict',
  } satisfies CookieOptions,

  // TODO: move this in config
  JWT_TOKEN_OPTIONS: {
    expirationTime: '2h',
    issuer: 'urn:example:issuer',
    audience: 'urn:example:audience',
  },

  JWT_ACCESS_TOKEN_OPTIONS: {
    expirationTime: '2m',
    expSeconds: 1000 * 60 * 2,
  },

  JWT_REFRESH_TOKEN_OPTIONS: {
    expirationTime: '7d',
    expSeconds: 60 * 60 * 24 * 7,
  },

  REDIS_USER_SESSION_PREFIX: 'userSession_',
  REDIS_USER_SESSION_MAX_EX: 60 * 60 * 24 * 365, // 1 year
};
