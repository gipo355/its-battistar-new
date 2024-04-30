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
  getUserInfoFromOauthToken,
} from '../../../utils';
import { AccountModel } from '../../api/users/accounts.model';
import { UserModel } from '../../api/users/users.model';
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

    // TODO: save user in db
    // TODO: refactor, many thins are similar with signup handler

    let createdUserId = '';
    // get the account with strategy GITHUB and same email
    const foundUser = await UserModel.findOne({ email: githubUser.email });
    if (!foundUser) {
      const u = await UserModel.create({
        email: githubUser.email,
      });
      await AccountModel.create({
        email: githubUser.email,
        strategy: 'GITHUB',
        providerUid: githubUser.providerUid,
      });
      createdUserId = u._id.toString();
    } else {
      const userAccount = await AccountModel.findOne({
        user: foundUser._id,
        strategy: 'GITHUB',
      });
      if (!userAccount) {
        await AccountModel.create({
          // email: user.email, // TODO: move emails to user
          strategy: 'GITHUB',
          providerUid: githubUser.providerUid,
          token: githubAccessToken.token.access_token,
        });
        // create new user
        // create new account
        createdUserId = foundUser._id.toString();
      }
    }

    // create tokens, update redis
    // TODO: must refactor, equal to signup handler
    // TODO: check if to keep same model for account
    // multiple emails can be associated with the same account
    const realUser = await UserModel.findOne({
      _id: createdUserId,
    });

    // TODO: this must go in use service
    if (!realUser) {
      throw new AppError(
        'There was a problem creating the user',
        StatusCodes.INTERNAL_SERVER_ERROR
      );
    }
    // TODO: check discriminator mongoose to separate accounts

    // TODO: should either use cookies or headers, possibly refactor this into
    // a factory to use in different places to differentiate
    const accessToken = await createJWT({
      data: {
        user: realUser._id.toString(),
        strategy: 'LOCAL',
      },
      type: 'access',
    });
    const refreshToken = await createJWT({
      data: {
        user: realUser._id.toString(),
        strategy: 'LOCAL',
      },
      type: 'refresh',
    });

    res.cookie('accessToken', accessToken, c.JWT_ACCESS_COOKIE_OPTIONS);
    res.cookie('refreshToken', refreshToken, c.JWT_REFRESH_COOKIE_OPTIONS);

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
