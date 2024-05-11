import { createHash, randomUUID } from 'node:crypto';

import type { ERole, EStrategy } from '@its-battistar/shared-types';
import type { Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import * as jose from 'jose';

import { APP_CONFIG as c } from '../app.config';
import { e } from '../environments';
import { AppError } from './app-error';
import { logger } from './logger';

export interface CustomJWTClaims extends jose.JWTPayload {
  account: string;
  role: keyof typeof ERole;
  strategy: keyof typeof EStrategy;
  user: string;
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
): Promise<{
  decryptedJWT: jose.JWTDecryptResult<CustomJWTClaims>;
  error: Error | null;
}> => {
  try {
    const { payload, protectedHeader } = await jose.jwtDecrypt<CustomJWTClaims>(
      token,
      key,
      {
        issuer: c.JWT_TOKEN_OPTIONS.issuer,
        audience: c.JWT_TOKEN_OPTIONS.audience,
      }
    );

    if (protectedHeader.alg !== 'dir') {
      throw new Error('invalid jwt');
    }

    return {
      error: null,
      decryptedJWT: {
        payload,
        protectedHeader,
      },
    };
  } catch (error) {
    if (error instanceof Error) logger.error(`invalid jwt: ${error.message}`);
    throw new AppError('invalid jwt', StatusCodes.BAD_REQUEST);
  }
};

export const clearTokens = (res: Response): void => {
  res.clearCookie(
    c.JWT_ACCESS_TOKEN_OPTIONS.cookieName,
    c.JWT_ACCESS_COOKIE_OPTIONS
  );
  res.clearCookie(
    c.JWT_REFRESH_TOKEN_OPTIONS.cookieName,
    c.JWT_REFRESH_COOKIE_OPTIONS
  );
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
  payload: CustomJWTClaims;
  setCookiesOn?: Response | null;
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
        c.JWT_ACCESS_TOKEN_OPTIONS.cookieName,
        accessToken,
        c.JWT_ACCESS_COOKIE_OPTIONS
      );
    }
    if (refreshToken) {
      setCookiesOn.cookie(
        c.JWT_REFRESH_TOKEN_OPTIONS.cookieName,
        refreshToken,
        c.JWT_REFRESH_COOKIE_OPTIONS
      );
    }
  }

  return { accessToken, refreshToken };
};
