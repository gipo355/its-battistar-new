import { randomBytes } from 'node:crypto';

export const generateRandomBytes = async function (
  bytes: number
): Promise<string> {
  return new Promise((resolve, reject) => {
    randomBytes(bytes, (err, buf) => {
      if (err) reject(err);
      resolve(buf.toString('hex'));
    });
  });
};
