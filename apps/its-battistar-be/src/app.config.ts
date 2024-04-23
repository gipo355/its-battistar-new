/* eslint-disable no-magic-numbers */
import { e } from './environments';

export const API_VERSION = 'v1';

export const corsOptions = {};

export const helmetOptions = {};

export const NUMBER_OF_PROXIES = 0;

// rate limiting
export const RATE_LIMITER_POINTS = 100;
export const RATE_LIMITER_DURATION = 60 * 60; // seconds

export const ENABLE_LOKI = e.NODE_ENV !== 'development' && true;
