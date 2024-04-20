/**
 * Environment variables
 * Prepare the environment variables for the application.
 */
import { Static, Type } from '@sinclair/typebox';

const environmentSchema = Type.Object({
  UV_THREADPOOL_SIZE: Type.Optional(Type.String()),

  MONGO_STRING: Type.String({}),

  REDIS_HOST: Type.String({}),
  REDIS_PORT: Type.String({}),
  REDIS_USERNAME: Type.String({}),
  REDIS_PASSWORD: Type.String({}),

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

const toCheck = {
  UV_THREADPOOL_SIZE: process.env.UV_THREADPOOL_SIZE ?? '4',

  MONGO_STRING: process.env.MONGO_STRING,

  REDIS_HOST: process.env.REDIS_HOST,
  REDIS_PORT: process.env.REDIS_PORT,
  REDIS_USERNAME: process.env.REDIS_USERNAME,
  REDIS_PASSWORD: process.env.REDIS_PASSWORD,

  NODE_ENV:
    (process.env.NODE_ENV as
      | 'development'
      | 'production'
      | 'test'
      | undefined) ?? 'production',

  PORT: process.env.PORT ?? '3000',

  // TODO: CHANGE STRICT REQUIREMENT IN PRODUCTION
  CSRF_SECRET: process.env.CSRF_SECRET ?? 'csrf-secret',
  JWT_SECRET: process.env.JWT_SECRET ?? 'jwt-secret',
  COOKIE_SECRET: process.env.COOKIE_SECRET ?? 'cookie-secret',
  SESSION_SECRET: process.env.SESSION_SECRET ?? 'session-secret',
} as const;

Object.freeze(toCheck);

// validate environment variables
const missingKeys = Object.keys(toCheck).filter(
  (key) => !toCheck[key as keyof typeof toCheck]
);
if (missingKeys.length > 0) {
  throw new Error(
    `Environment variables ${missingKeys.join(', ')} are not defined`
  );
}

const environment = toCheck as TEnvironment;

export { environment };
