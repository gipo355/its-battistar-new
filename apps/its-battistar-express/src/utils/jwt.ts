import { createHash, randomUUID } from 'node:crypto';

import { EStrategy } from '@its-battistar/shared-types';
import { StatusCodes } from 'http-status-codes';
import * as jose from 'jose';

import { e } from '../environments';
import { AppError } from './app-error';
import { logger } from './logger';

interface JWTClaims extends jose.JWTPayload {
  user: string;
  strategy: keyof typeof EStrategy;
}

// TODO: move this in config
export const JWTOptions = {
  expirationTime: '2h',
  issuer: 'urn:example:issuer',
  audience: 'urn:example:audience',
};

const key = jose.base64url.decode(
  createHash('sha256').update(e.JWT_SECRET).digest('base64')
);

// verify that key is 256 bits or more

// eslint-disable-next-line no-magic-numbers
if (key.length !== 32) {
  throw new Error('JWT_SECRET must be 256 bits (32 bytes)');
}

export const createJWT = async (data: JWTClaims): Promise<string> =>
  await new jose.EncryptJWT(data)
    .setProtectedHeader({ alg: 'dir', enc: 'A128CBC-HS256' })
    .setAudience(JWTOptions.audience)
    .setIssuer(JWTOptions.issuer)
    .setIssuedAt()
    .setJti(randomUUID())
    .setExpirationTime(JWTOptions.expirationTime)
    .encrypt(key);

/**
 * VULNERABILITY: must whitelist the algorithm used for decryption
 */
export const verifyJWT = async (
  token: string
): Promise<jose.JWTDecryptResult> => {
  try {
    const { payload, protectedHeader } = await jose.jwtDecrypt(token, key, {
      issuer: JWTOptions.issuer,
      audience: JWTOptions.audience,
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
