import { Static, Type } from '@sinclair/typebox';

export const environmentSchema = Type.Object({
  UV_THREADPOOL_SIZE: Type.Optional(Type.String()),

  MONGO_STRING: Type.String({}),

  REDIS_HOST: Type.String({}),
  REDIS_PORT: Type.String({}),
  REDIS_USERNAME: Type.String({}),
  REDIS_PASSWORD: Type.String({}),

  SENTRY_DSN: Type.Optional(Type.String()),

  NODE_ENV: Type.Union([
    Type.Literal('development'),
    Type.Literal('production'),
    Type.Literal('test'),
  ]),

  PORT: Type.String({}),

  CSRF_SECRET: Type.String(),
  JWT_SECRET: Type.String(),
  COOKIE_SECRET: Type.String(),
  SESSION_SECRET: Type.String(),
});

export type TEnvironment = Static<typeof environmentSchema>;
