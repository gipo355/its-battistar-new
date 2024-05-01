// import { CustomResponse } from '@its-battistar/shared-types';
import { Handler } from 'express';
import { StatusCodes } from 'http-status-codes';
import { AuthorizationTokenConfig } from 'simple-oauth2';

import { APP_CONFIG as c } from '../../../app.config';
import { sessionRedisConnection } from '../../../db/redis';
// TODO: refactor, too much code duplication
import {
  AppError,
  catchAsync,
  createJWT,
  generateTokens,
  getUserInfoFromOauthToken,
} from '../../../utils';
import { UserModel } from '../../api/users/users.model';
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

    const { user, account, error } = await createUserAndAccount({
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

    // TODO: should either use cookies or headers, possibly refactor this into
    // a factory to use in different places to differentiate
    const { refreshToken } = await generateTokens({
      setCookiesOn: res,
      payload: {
        user: user._id.toString(),
        strategy: 'LOCAL',
      },
    });

    // TODO: move to util fn
    /**
     * set up the whitelist for the refresh token, add it as a key to the redis store
     * this will allow us to revoke the refresh token and check quickly if it is valid during refresh
     * we need to store the id of the user to be able to revoke all the refresh tokens associated with the user in case
     * a an invalid refresh token is used
     */
    // saving individual token as key is used to save info about the session
    // like IP, user agent, etc
    const data = {
      user: realUser._id.toString(),
      ip: req.ip,
      userAgent: req.get('User-Agent'),
    };
    await sessionRedisConnection.set(
      refreshToken,
      JSON.stringify(data),
      'EX',
      c.JWT_REFRESH_TOKEN_OPTIONS.expSeconds
    );

    /**
     * add it to a list of refresh tokens for the user to be able to revoke it
     * where the key is the user id and the values are the refresh tokens issued and valid
     */
    const key = `${c.REDIS_USER_SESSION_PREFIX}${realUser._id.toString()}`;
    await sessionRedisConnection.sadd(key, refreshToken);
    // reset the expiration time for the user sessions
    // we must have both the token key and user key with token value for token to be valid
    await sessionRedisConnection.expire(key, c.REDIS_USER_SESSION_MAX_EX);

    // return res.status(StatusCodes.OK).json(githubAccessToken.token);
    // TODO: redirect to dashboard
    res.redirect('http://localhost:4200/#/dashboard');
  } catch (error) {
    if (error instanceof Error) {
      // throw new AppError(error.message, StatusCodes.INTERNAL_SERVER_ERROR);
    }
    throw new AppError('Access Token Error', StatusCodes.INTERNAL_SERVER_ERROR);
  }
});
