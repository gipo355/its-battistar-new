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
    methods: 'GET,PATCH,POST,DELETE,OPTIONS',
    // preflightContinue: false,
    // optionsSuccessStatus: 204,
    allowedHeaders: ['Content-Type', 'Authorization', 'Cookie'],
    credentials: true,
    // maxAge: 86400,
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

  // https://stackoverflow.com/questions/18795220/set-cookie-header-not-working
  // https://stackoverflow.com/questions/61555100/cookie-in-set-cookie-header-not-being-set
  JWT_REFRESH_COOKIE_OPTIONS: {
    httpOnly: true,
    secure: e.NODE_ENV === 'production',
    // TODO: set secure to true in production
    // secure: false,
    expires: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7), // 7 days
    sameSite: 'lax',
    maxAge: 1000 * 60 * 60 * 24 * 7,
  } satisfies CookieOptions,

  JWT_ACCESS_COOKIE_OPTIONS: {
    httpOnly: true,
    secure: e.NODE_ENV === 'production',
    // secure: false,
    expires: new Date(Date.now() + 1000 * 60 * 2), // 2 minutes
    sameSite: 'lax',
    maxAge: 1000 * 60 * 2,
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
    cookieName: 'access_token',
  },

  JWT_REFRESH_TOKEN_OPTIONS: {
    expirationTime: '7d',
    expSeconds: 60 * 60 * 24 * 7,
    cookieName: 'refresh_token',
  },

  REDIS_USER_SESSION_PREFIX: 'userSession_',
  REDIS_USER_SESSION_MAX_EX: 60 * 60 * 24 * 365, // 1 year
};
