import { createHash, randomUUID } from 'node:crypto';

import type { EStrategy } from '@its-battistar/shared-types';
import type { Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import * as jose from 'jose';

import { APP_CONFIG, APP_CONFIG as c } from '../app.config';
import { e } from '../environments';
import { AppError } from './app-error';
import { logger } from './logger';

interface CustomJWTClaims extends jose.JWTPayload {
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
  data: CustomJWTClaims;
  type: 'access' | 'refresh';
}): Promise<string> => {
  if (type === 'access') {
    return new jose.EncryptJWT(data)
      .setProtectedHeader({ alg: 'dir', enc: 'A128CBC-HS256' })
      .setAudience(c.JWT_TOKEN_OPTIONS.audience)
      .setIssuer(c.JWT_TOKEN_OPTIONS.issuer)
      .setIssuedAt()
      .setJti(randomUUID())
      .setExpirationTime(c.JWT_ACCESS_TOKEN_OPTIONS.expirationTime)
      .encrypt(key);
  }

  return new jose.EncryptJWT(data)
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
): Promise<jose.JWTDecryptResult<CustomJWTClaims>> => {
  try {
    const { payload, protectedHeader } = await jose.jwtDecrypt<CustomJWTClaims>(
      token,
      key,
      {
        issuer: c.JWT_TOKEN_OPTIONS.issuer,
        audience: c.JWT_TOKEN_OPTIONS.audience,
      }
    );

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

/**
 * generateTokens is a utility function that generates JWT tokens
 * and can set them as cookies on the response object.
 */
export const generateTokens = async ({
  generateAccessToken = true,
  generateRefreshToken = true,
  setCookiesOn = null,
  payload,
}: {
  generateAccessToken?: boolean;
  generateRefreshToken?: boolean;
  setCookiesOn?: Response | null;
  payload: CustomJWTClaims;
}): Promise<{
  accessToken: string | undefined;
  refreshToken: string | undefined;
}> => {
  // TODO: handle edge cases where all are false
  // use ts conditional? force at least one to be true
  // TODO: workerpool?
  if (!generateAccessToken && !generateRefreshToken && !setCookiesOn) {
    throw new Error(
      'At least one of generateAccessToken, generateRefreshToken, or setCookiesOn must be true'
    );
  }

  let accessToken: string | undefined;
  if (generateAccessToken) {
    accessToken = await createJWT({
      data: payload,
      type: 'access',
    });
  }

  let refreshToken: string | undefined;
  if (generateRefreshToken) {
    refreshToken = await createJWT({
      data: payload,
      type: 'refresh',
    });
  }

  if (setCookiesOn) {
    if (accessToken) {
      setCookiesOn.cookie(
        'access_token',
        accessToken,
        APP_CONFIG.JWT_ACCESS_COOKIE_OPTIONS
      );
    }
    if (refreshToken) {
      setCookiesOn.cookie(
        'refresh_token',
        refreshToken,
        APP_CONFIG.JWT_REFRESH_COOKIE_OPTIONS
      );
    }
  }

  return { accessToken, refreshToken };
};
