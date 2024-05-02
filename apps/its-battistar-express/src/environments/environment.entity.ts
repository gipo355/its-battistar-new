import type { Static } from '@sinclair/typebox';
import { Type } from '@sinclair/typebox';

export const requiredEnvironmentSchema = Type.Object({
  MONGO_STRING: Type.String({}),

  REDIS_HOST: Type.String({}),
  REDIS_PORT: Type.String({}),
  REDIS_USERNAME: Type.String({}),
  REDIS_PASSWORD: Type.String({}),

  BASE_URL: Type.String({}),

  SENTRY_DSN: Type.Optional(Type.String()),

  NODE_ENV: Type.Union([
    Type.Literal('development'),
    Type.Literal('production'),
    Type.Literal('test'),
  ]),

  PORT: Type.String({}),

  CORS_ORIGINS: Type.String(),

  ARGON2_SECRET: Type.String(),

  CSRF_SECRET: Type.String(),
  JWT_SECRET: Type.String(),
  COOKIE_SECRET: Type.String(),
  SESSION_SECRET: Type.String(),
});

export const optionalEnvironmentSchema = Type.Object({
  UV_THREADPOOL_SIZE: Type.Optional(Type.String()),

  SENTRY_DSN: Type.Optional(Type.String()),

  ENABLE_RATE_LIMITER: Type.String(),
  RATE_LIMITER_POINTS: Type.String(),
  RATE_LIMITER_DURATION: Type.String(),

  EXPRESS_TRUST_NUMBER_OF_PROXIES: Type.String(),

  ENABLE_LOKI: Type.String(),

  GITHUB_CLIENT_ID: Type.String({}),
  GITHUB_CLIENT_SECRET: Type.String({}),
  GITHUB_CALLBACK_URL: Type.String({}),
  GITHUB_SCOPE: Type.String(),
  GITHUB_STATE: Type.String(),
  GITHUB_FINAL_REDIRECT: Type.String(),
  GITHUB_FINAL_REDIRECT_ON_ERROR: Type.String(),
});

export type TRequiredEnvironment = Static<typeof requiredEnvironmentSchema>;
export type TOptionalEnvironment = Static<typeof optionalEnvironmentSchema>;
