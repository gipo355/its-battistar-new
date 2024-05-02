import 'dotenv-defaults/config';

import type {
  TOptionalEnvironment,
  TRequiredEnvironment,
} from './environment.entity';

/**
 * Environment variables
 * Prepare the environment variables for the application.
 */

const requiredKeys: Partial<TRequiredEnvironment> = {
  MONGO_STRING: process.env.MONGO_STRING,

  REDIS_HOST: process.env.REDIS_HOST,
  REDIS_PORT: process.env.REDIS_PORT,
  REDIS_USERNAME: process.env.REDIS_USERNAME,
  REDIS_PASSWORD: process.env.REDIS_PASSWORD,

  BASE_URL: process.env.BASE_URL,

  NODE_ENV:
    (process.env.NODE_ENV as
      | 'development'
      | 'production'
      | 'test'
      | undefined) ?? 'production',

  PORT: process.env.PORT ?? '3000',

  CORS_ORIGINS: process.env.CORS_ORIGINS,

  ARGON2_SECRET: process.env.ARGON2_SECRET,

  // TODO: CHANGE STRICT REQUIREMENT IN PRODUCTION
  CSRF_SECRET: process.env.CSRF_SECRET,
  JWT_SECRET: process.env.JWT_SECRET,
  COOKIE_SECRET: process.env.COOKIE_SECRET,
  SESSION_SECRET: process.env.SESSION_SECRET,
} as const;

const optionalKeys: TOptionalEnvironment = {
  UV_THREADPOOL_SIZE: process.env.UV_THREADPOOL_SIZE ?? '4',

  SENTRY_DSN: process.env.SENTRY_DSN ?? '',

  ENABLE_RATE_LIMITER: process.env.ENABLE_RATE_LIMITER ?? 'true',
  RATE_LIMITER_POINTS: process.env.RATE_LIMITER_POINTS ?? '100',
  RATE_LIMITER_DURATION: process.env.RATE_LIMITER_DURATION ?? '3600',

  EXPRESS_TRUST_NUMBER_OF_PROXIES:
    process.env.EXPRESS_TRUST_NUMBER_OF_PROXIES ?? '0',

  GITHUB_CLIENT_ID: process.env.GITHUB_CLIENT_ID ?? '',
  GITHUB_CLIENT_SECRET: process.env.GITHUB_CLIENT_SECRET ?? '',
  GITHUB_CALLBACK_URL: process.env.GITHUB_CALLBACK_URL ?? '',
  GITHUB_SCOPE: process.env.GITHUB_SCOPE ?? 'user:email',
  GITHUB_STATE: process.env.GITHUB_STATE ?? '3(#0/!~',
  GITHUB_FINAL_REDIRECT: process.env.GITHUB_FINAL_REDIRECT ?? '',
  GITHUB_FINAL_REDIRECT_ON_ERROR:
    process.env.GITHUB_FINAL_REDIRECT_ON_ERROR ?? '',

  ENABLE_LOKI: process.env.ENABLE_LOKI ?? 'false',
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

const environment = {
  ...requiredKeys,
  ...optionalKeys,
} as TRequiredEnvironment & TOptionalEnvironment;

export { environment };
export { environment as e };
export default environment;
