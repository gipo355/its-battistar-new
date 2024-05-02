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
import { getAccountAndUserOrThrow } from '../../api/users/users.service';

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

  const sanitizedEmail = new Sanitize(email).email().forMongoInjection().end;

  const sanitizedPassword = new Sanitize(password).password().end;

  // FIXME: must sanitize user input
  const { user, account, error } = await getAccountAndUserOrThrow({
    email: sanitizedEmail,
    strategy: 'LOCAL',
  });
  if (error ?? (!user || !account)) {
    throw new AppError('Wrong credentials', StatusCodes.BAD_REQUEST);
  }

  const isValid = await account.comparePassword(sanitizedPassword);
  if (!isValid) {
    throw new AppError('Invalid email or password', StatusCodes.UNAUTHORIZED);
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

  res.status(StatusCodes.OK).json(
    new CustomResponse<{
      accessToken: string;
      refreshToken: string;
    }>({
      ok: true,
      statusCode: StatusCodes.OK,
      message: 'Logged in successfully',
      data: {
        accessToken,
        refreshToken,
      },
    })
  );
});
