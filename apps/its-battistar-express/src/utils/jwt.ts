import { createHash, randomUUID } from 'node:crypto';

import { EStrategy } from '@its-battistar/shared-types';
import { StatusCodes } from 'http-status-codes';
import * as jose from 'jose';

import { APP_CONFIG as c } from '../app.config';
import { e } from '../environments';
import { AppError } from './app-error';
import { logger } from './logger';

interface JWTClaims extends jose.JWTPayload {
  user: string;
  strategy: keyof typeof EStrategy;
}

const key = jose.base64url.decode(
  createHash('sha256').update(e.JWT_SECRET).digest('base64')
);

// verify that key is 256 bits or more

// eslint-disable-next-line no-magic-numbers
if (key.length !== 32) {
  throw new Error('JWT_SECRET must be 256 bits (32 bytes)');
}

export const createJWT = async ({
  data,
  type,
}: {
  data: JWTClaims;
  type: 'access' | 'refresh';
}): Promise<string> => {
  if (type === 'access') {
    return await new jose.EncryptJWT(data)
      .setProtectedHeader({ alg: 'dir', enc: 'A128CBC-HS256' })
      .setAudience(c.JWT_TOKEN_OPTIONS.audience)
      .setIssuer(c.JWT_TOKEN_OPTIONS.issuer)
      .setIssuedAt()
      .setJti(randomUUID())
      .setExpirationTime(c.JWT_ACCESS_TOKEN_OPTIONS.expirationTime)
      .encrypt(key);
  }

  return await new jose.EncryptJWT(data)
    .setProtectedHeader({ alg: 'dir', enc: 'A128CBC-HS256' })
    .setAudience(c.JWT_TOKEN_OPTIONS.audience)
    .setIssuer(c.JWT_TOKEN_OPTIONS.issuer)
    .setIssuedAt()
    .setJti(randomUUID())
    .setExpirationTime(c.JWT_REFRESH_TOKEN_OPTIONS.expirationTime)
    .encrypt(key);
};
/**
 * VULNERABILITY: must whitelist the algorithm used for decryption
 */
export const verifyJWT = async (
  token: string
): Promise<jose.JWTDecryptResult> => {
  try {
    const { payload, protectedHeader } = await jose.jwtDecrypt(token, key, {
      issuer: c.JWT_TOKEN_OPTIONS.issuer,
      audience: c.JWT_TOKEN_OPTIONS.audience,
    });

    if (protectedHeader.alg !== 'dir') throw new Error('invalid jwt');

    return {
      payload,
      protectedHeader,
    };
  } catch (error) {
    if (error instanceof Error) logger.error(`invalid jwt: ${error.message}`);
    throw new AppError('invalid jwt', StatusCodes.BAD_REQUEST);
  }
};
