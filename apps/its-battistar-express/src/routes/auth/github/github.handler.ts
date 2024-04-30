// import { CustomResponse } from '@its-battistar/shared-types';
import { Handler } from 'express';
import { StatusCodes } from 'http-status-codes';
import { AuthorizationTokenConfig } from 'simple-oauth2';

import {
  AppError,
  catchAsync,
  getOauth2UserInfoFromAccessToken,
} from '../../../utils';
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

    const accessToken = await oauthGithubClient.getToken(options);
    console.log('The resulting token: ', accessToken.token);
    // {
    //   "access_token": "string",
    //   "token_type": "bearer",
    //   "scope": "notifications"
    // }

    if (typeof accessToken.token.access_token !== 'string') {
      throw new AppError('No access token', StatusCodes.INTERNAL_SERVER_ERROR);
    }
    const user = await getOauth2UserInfoFromAccessToken(
      accessToken.token.access_token,
      'GITHUB'
    );
    console.log('The resulting user: ', user);

    // TODO: save user in db

    return res.status(StatusCodes.OK).json(accessToken.token);
  } catch (error) {
    if (error instanceof Error) {
      console.error('Access Token Error', error.message);
      // throw new AppError(error.message, StatusCodes.INTERNAL_SERVER_ERROR);
    }
    throw new AppError('Access Token Error', StatusCodes.INTERNAL_SERVER_ERROR);
  }
});
