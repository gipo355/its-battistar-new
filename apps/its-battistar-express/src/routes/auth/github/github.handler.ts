// import { CustomResponse } from '@its-battistar/shared-types';
import type { Handler } from 'express';
import { StatusCodes } from 'http-status-codes';
import type { AuthorizationTokenConfig } from 'simple-oauth2';

import { sessionRedisConnection } from '../../../db/redis';
import { e } from '../../../environments';
// TODO: refactor, too much code duplication
import {
  AppError,
  catchAsync,
  generateTokens,
  rotateRefreshTokenRedis,
} from '../../../utils';
import { getGithubUserInfoFromOauthTokenFetch } from '../../../utils/get-github-info-from-oauth-token';
import { createOrFindUserAndAccount } from '../../api/users/users.service';
import { githubAuthorizationUri, oauthGithubClient } from './github.service';

export const githubHandler: Handler = (_, res) => {
  res.redirect(githubAuthorizationUri);
};

// NOTE: will probably be handler by a dependency
export const githubCallbackHandler: Handler = catchAsync(async (req, res) => {
  try {
    const { code } = req.query as { code: string | undefined };

    if (!code) {
      throw new AppError('Missing code', StatusCodes.BAD_REQUEST);
    }

    const options: AuthorizationTokenConfig = {
      redirect_uri: e.GITHUB_CALLBACK_URL,
      code,
    };

    const githubAccessToken = await oauthGithubClient.getToken(options);
    // {
    //   "access_token": "string",
    //   "token_type": "bearer",
    //   "scope": "notifications"
    // }

    if (typeof githubAccessToken.token.access_token !== 'string') {
      throw new AppError('No access token', StatusCodes.INTERNAL_SERVER_ERROR);
    }

    const githubUser = await getGithubUserInfoFromOauthTokenFetch(
      githubAccessToken.token.access_token,
      'GITHUB'
    );

    if (!githubUser) {
      throw new AppError('No user found', StatusCodes.NOT_FOUND);
    }

    const { user, error, account } = await createOrFindUserAndAccount({
      email: githubUser.email,
      providerUid: githubUser.providerUid,
      accessToken: githubAccessToken.token.access_token,
      strategy: 'GITHUB',
    });

    if (error) {
      throw new AppError(error.message, StatusCodes.INTERNAL_SERVER_ERROR);
    }
    if (!user || !account) {
      throw new AppError('There was a problem', StatusCodes.NOT_FOUND);
    }

    // TODO: check discriminator mongoose to separate accounts

    const { refreshToken: newRefreshToken } = await generateTokens({
      setCookiesOn: res,
      payload: {
        user: user._id.toString(),
        role: user.role,
        strategy: 'GITHUB',
        account: account._id.toString(),
      },
    });

    if (!newRefreshToken) {
      throw new AppError('No refresh token', StatusCodes.INTERNAL_SERVER_ERROR);
    }

    await rotateRefreshTokenRedis({
      redisConnection: sessionRedisConnection,
      newToken: newRefreshToken,
      // BUG: must handle old token if present
      user: user._id.toString(),
      payload: {
        user: user._id.toString(),
        ip: req.ip,
        userAgent: req.get('User-Agent'),
      },
    });

    // TODO: redirect to dashboard, must be in config
    res.redirect(e.GITHUB_FINAL_REDIRECT);

    /**
     * WE REDIRECT ON ERROR HERE.
     * THE CLIENT WILL BE REDIRECTED TO BACKEND WHICH WILL SHOW JSON ERROR IN THE PAGE
     * we must tell the client to go back to the frontend and add query params to the url
     * for error info and handling
     */
  } catch (error) {
    res.redirect(
      `${e.GITHUB_FINAL_REDIRECT_ON_ERROR}?error=github${error instanceof Error ? `&message=${error.message}` : ''}`
    );
  }
});
