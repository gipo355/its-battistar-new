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
import { createUserAndAccount } from '../../api/users/users.service';

export const signupHandler: Handler = catchAsync(async (req, res) => {
  // INPUT: email, password, passwordConfirm
  const { email, password, passwordConfirm } = req.body as {
    email: string | undefined;
    password: string | undefined;
    passwordConfirm: string | undefined;
  };

  // TODO: validate email and password in mongoose schema or ajv
  // TODO: validate only client side password Confirm
  if (!email || !password || !passwordConfirm) {
    throw new AppError(
      'Email, password and password confirmations are required',
      StatusCodes.BAD_REQUEST
    );
  }

  const sanitizedEmail = new Sanitize(email).email().forMongoInjection().end;
  const sanitizedPassword = new Sanitize(password).password().end;

  // FIXME: must sanitize user input
  /**
   * check the logic inside the function
   * handling different accounts with many strategies
   */
  const { user, account, error } = await createUserAndAccount({
    strategy: 'LOCAL',
    email: sanitizedEmail,
    password: sanitizedPassword,
  });

  if (error) {
    throw new AppError(error.message, StatusCodes.BAD_REQUEST);
  }
  if (!user || !account) {
    throw new AppError(
      'There was a problem creating the user',
      StatusCodes.INTERNAL_SERVER_ERROR
    );
  }

  const { accessToken, refreshToken } = await generateTokens({
    setCookiesOn: res,
    payload: {
      user: user._id.toString(),
      strategy: 'LOCAL',
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

  // we only return the id
  // TODO: if we want to return the use object, make a stringify function
  // to prevent leaks
  res.status(StatusCodes.CREATED).json(
    new CustomResponse<{
      accessToken: string;
      refreshToken: string;
      userId: string;
    }>({
      ok: true,
      statusCode: StatusCodes.CREATED,
      message: 'Registered successfully',
      data: {
        accessToken,
        refreshToken,
        userId: user._id.toString(),
      },
    })
  );
});
