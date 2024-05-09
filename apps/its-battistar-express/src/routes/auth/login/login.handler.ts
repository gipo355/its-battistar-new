import { CustomResponse } from '@its-battistar/shared-types';
import type { Handler } from 'express';
import { StatusCodes } from 'http-status-codes';

import { sessionRedisConnection } from '../../../db/redis';
import {
  AppError,
  catchAsync,
  generateTokens,
  rotateRefreshTokenRedis,
  Sanitize,
} from '../../../utils';
import {
  findUserWithAccounts,
  getAccountAndUserOrThrow,
} from '../../api/users/users.service';

export const loginHandler: Handler = catchAsync(async (req, res) => {
  // INPUT: email, password
  const { email, password } = req.body as {
    email: string | undefined;
    password: string | undefined;
  };

  // TODO: validate email and password in mongoose schema or ajv or here before
  // sending to the db
  if (!email || !password) {
    throw new AppError(
      'Email and password are required',
      StatusCodes.BAD_REQUEST
    );
  }

  const { string: sanitizedEmail } = new Sanitize(email)
    .email()
    .forMongoInjection().done;

  const { string: sanitizedPassword } = new Sanitize(password).password().done;

  // FIXME: must sanitize user input
  // TODO: possibly use the findUserWithAccounts function instead of getAccountAndUserOrThrow?
  const { user, account, error } = await getAccountAndUserOrThrow({
    accountEmail: sanitizedEmail,
    strategy: 'LOCAL',
  });
  if (error) {
    throw new AppError('Wrong credentials', StatusCodes.BAD_REQUEST);
  }
  if (!user || !account) {
    throw new AppError('There was a problem', StatusCodes.BAD_REQUEST);
  }

  const isValid = await account.comparePassword(sanitizedPassword);
  if (!isValid) {
    throw new AppError('Invalid email or password', StatusCodes.UNAUTHORIZED);
  }

  const { accessToken, refreshToken } = await generateTokens({
    setCookiesOn: res,
    payload: {
      user: user._id.toString(),
      role: user.role,
      strategy: 'LOCAL',
      account: account._id.toString(),
    },
  });
  if (!accessToken || !refreshToken) {
    throw new AppError(
      'Could not generate tokens',
      StatusCodes.INTERNAL_SERVER_ERROR
    );
  }

  await rotateRefreshTokenRedis({
    redisConnection: sessionRedisConnection,
    newToken: refreshToken,
    user: user._id.toString(),
    payload: {
      user: user._id.toString(),
      ip: req.ip,
      userAgent: req.get('User-Agent'),
    },
  });

  // BUG: user.accounts is not populated
  // await user.populate('account');
  // const userPop = await UserModel.findById(user._id)
  //   .populate({
  //     path: 'accounts',
  //     select: '-password',
  //   })
  //   .exec();

  // REVERSE POPULATE
  // FIXME: double query in this fn
  // VULN: sensitive data, don't expose, only select what is needed
  const { user: userWithAccounts, error: error2 } = await findUserWithAccounts(
    user._id.toString()
  );
  if (error2) {
    throw new AppError(
      'Error finding user with accounts',
      StatusCodes.INTERNAL_SERVER_ERROR
    );
  }

  const data = {
    access_token: accessToken,
    refresh_token: refreshToken,
    user: userWithAccounts.pop(),
  };

  // "data": {
  //      "access_token": "",
  //      "refresh_token": "",
  //      "user": {
  //          "id": ""
  //          "username": "email", TODO: why username is email?
  //          "createdAt": "2024-05-09T06:55:37.236Z",
  //          "updatedAt": "2024-05-09T06:55:42.734Z",
  //          "avatar": "url",
  //          "accounts": [
  //              {
  //                  "email": "",
  //                  "verified": false,
  //                  "primary": true,
  //                  "createdAt": "",
  //                  "updatedAt": "2024-05-09T06:55:37.232Z",
  //                  "strategy": "LOCAL",
  //                  "id": ""
  //              }
  //          ],
  //      }
  //  }

  // TODO: serialize the response in all handlers

  // TODO: make a factory to choose if to send access and refresh in body
  // in all handlers

  // TODO: group up functions and utils in external libs on functionalities, make them reusable and standalone

  // TODO: document, write tests

  // TODO: implement redis session instead of JWT strat

  // TODO: test implementation of full oauth2 flow (no own redis)

  res.status(StatusCodes.OK).json(
    new CustomResponse<typeof data>({
      ok: true,
      statusCode: StatusCodes.OK,
      message: 'Logged in successfully',
      data,
    })
  );
});
