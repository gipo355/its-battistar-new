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
  getUserInfoFromOauthToken,
  rotateRefreshToken,
} from '../../../utils';
import { createUserAndAccount } from '../../api/users/users.service';
import { githubAuthorizationUri, oauthGithubClient } from './github.service';

export const githubHandler: Handler = (_, res) => {
  console.log(githubAuthorizationUri);
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
      redirect_uri: 'http://localhost:3000/auth/github/callback',
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

    const githubUser = await getUserInfoFromOauthToken(
      githubAccessToken.token.access_token,
      'GITHUB'
    );

    if (!githubUser) {
      throw new AppError('No user found', StatusCodes.NOT_FOUND);
    }

    const { user, error } = await createUserAndAccount({
      email: githubUser.email,
      providerUid: githubUser.providerUid,
      accessToken: githubAccessToken.token.access_token,
      strategy: 'GITHUB',
    });

    if (error) {
      throw new AppError(error.message, StatusCodes.INTERNAL_SERVER_ERROR);
    }
    if (!user) {
      throw new AppError('No user found', StatusCodes.NOT_FOUND);
    }

    // TODO: check discriminator mongoose to separate accounts

    const { refreshToken } = await generateTokens({
      setCookiesOn: res,
      payload: {
        user: user._id.toString(),
        strategy: 'LOCAL',
      },
    });

    if (!refreshToken) {
      throw new AppError('No refresh token', StatusCodes.INTERNAL_SERVER_ERROR);
    }

    await rotateRefreshToken({
      redisConnection: sessionRedisConnection,
      newToken: refreshToken,
      user: user._id.toString(),
      payload: {
        user: user._id.toString(),
        ip: req.ip,
        userAgent: req.get('User-Agent'),
      },
    });

    // TODO: redirect to dashboard, must be in config
    res.redirect(e.GITHUB_FINAL_REDIRECT);
  } catch (error) {
    throw new Error('Access Token Error');
  }
});
