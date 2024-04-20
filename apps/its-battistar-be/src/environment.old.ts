import { logger } from './utils/logger';

const environment = {
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

logger.debug(`Environment
  ${JSON.stringify(environment, null, 2)}`);

Object.freeze(environment);

for (const key of Object.keys(environment)) {
  if (!environment[key as keyof typeof environment]) {
    logger.error(
      `Environment variable ${key} is not defined. Closing server...`
    );
    throw new Error(`Environment variable ${key} is not defined`);
  }
}

export { environment };
