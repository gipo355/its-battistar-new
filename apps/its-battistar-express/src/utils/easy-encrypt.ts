import { createHash } from 'crypto';

export const easyEncrypt = function easyEncrypt(token: string): string {
  return createHash('sha256').update(token).digest('hex');
};
