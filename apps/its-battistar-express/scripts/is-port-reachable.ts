/* eslint-disable no-magic-numbers */
import net from 'node:net';

import { isFinite } from 'lodash';

export async function isPortReachable({
  port,
  host = 'localhost',

  timeout = 1000,
}: {
  host?: string;
  port: number;
  timeout?: number;
}): Promise<boolean> {
  if (typeof host !== 'string' || host.length === 0) {
    throw new TypeError('Specify a `host`');
  }
  if (typeof port !== 'number' || !isFinite(port) || port < 1 || port > 65535) {
    throw new TypeError('Specify a valid `port`');
  }

  const promise = new Promise((resolve, reject) => {
    const socket = new net.Socket();

    const onError = () => {
      socket.destroy();
      reject(new Error('unreachable'));
    };

    socket.setTimeout(timeout);
    socket.once('error', onError);
    socket.once('timeout', onError);

    socket.connect(port, host, () => {
      socket.end();
      resolve('ok');
    });
  });

  try {
    await promise;
    return true;
  } catch {
    return false;
  }
}
