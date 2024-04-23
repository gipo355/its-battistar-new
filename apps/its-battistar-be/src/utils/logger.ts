import pino from 'pino';

import { ENABLE_LOKI } from '../config';
import { e } from '../environments';

const streams: (pino.DestinationStream | pino.StreamEntry<string>)[] = [
  {
    level: e.NODE_ENV === 'production' ? 'info' : 'debug',
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    stream: pino.transport({
      target: 'pino-pretty',
      options: {
        ignore: 'pid,hostname',
        colorize: true,
      },
    }),
  },
];

// TODO: change console to file stream for prod

// TODO: remote and security for loki
// TODO: change ports and addresses for grafana loki, put into configs and envs

// https://skaug.dev/node-js-app-with-loki/
// grafana UI will be on http://localhost:3200 and will contain all logs
// eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
if (ENABLE_LOKI) {
  streams.push({
    level: e.NODE_ENV === 'production' ? 'warn' : 'debug',
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    stream: pino.transport({
      target: 'pino-loki',
      options: {
        host: 'http://localhost:3100', // Change if Loki hostname is different
        labels: { application: 'its-battistar-be' },
      },
    }),
  });

  // eslint-disable-next-line no-console
  console.log('🚀 Loki enabled. Check grafana on http://localhost:3200');
}

export const logger = pino(
  { level: e.NODE_ENV === 'production' ? 'info' : 'debug' },
  pino.multistream(streams)
);
