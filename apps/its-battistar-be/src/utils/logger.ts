import pino from 'pino';

// eslint-disable-next-line unicorn/prevent-abbreviations
import { environment as e } from '../environment';

export const logger = pino({
  level: e.NODE_ENV === 'production' ? 'info' : 'debug',
  transport: {
    target: 'pino-pretty',
    options: {
      colorize: true,
    },
  },
});
