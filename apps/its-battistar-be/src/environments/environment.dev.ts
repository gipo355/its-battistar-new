import 'dotenv-defaults/config';

import { TEnvironment } from './environment.entity';

/**
 * Environment variables
 * Prepare the environment variables for the application.
 */

const requiredKeys = {
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

const optionalKeys = {
  SENTRY_DSN: process.env.SENTRY_DSN,
} as const;

// validate required environment variables
const missingKeys = Object.keys(requiredKeys).filter(
  (key) => !requiredKeys[key as keyof typeof requiredKeys]
);
// eslint-disable-next-line no-magic-numbers
if (missingKeys.length > 0) {
  throw new Error(
    `Environment variables ${missingKeys.join(', ')} are not defined`
  );
}

const environment = { ...requiredKeys, ...optionalKeys } as TEnvironment;

export { environment };
export { environment as e };
export default environment;
