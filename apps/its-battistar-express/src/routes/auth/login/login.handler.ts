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
import { UserModel } from '../../api/users/users.model';
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

  const { string: sanitizedEmail } = new Sanitize(email)
    .email()
    .forMongoInjection().done;

  const { string: sanitizedPassword } = new Sanitize(password).password().done;

  // FIXME: must sanitize user input
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
  // TODO: put in user service
  // TODO: must exclude inactive users and accounts from all queries
  // VULN: sensitive data, don't expose, only select what is needed
  const userPop = await UserModel.aggregate([
    {
      $match: {
        _id: user._id,
      },
    },
    // populate accounts
    // TODO: transform _id into id for accounts and user
    // TODO: filter out active: false accounts
    {
      $lookup: {
        from: 'accounts',
        localField: '_id',
        foreignField: 'user',
        as: 'accounts',
        // Sub pipeline to filter out inactive accounts and sensitive data
        pipeline: [
          {
            $match: {
              active: true,
            },
          },
          {
            $project: {
              password: 0,
              user: 0,
              __v: 0,
              active: 0,
            },
          },
        ],
      },
    },
    // remove sensitive data
    {
      $project: {
        todos: 0,
        __v: 0,
      },
    },
  ]);

  const data = {
    access_token: accessToken,
    refresh_token: refreshToken,
    user: userPop,
  };

  res.status(StatusCodes.OK).json(
    new CustomResponse<typeof data>({
      ok: true,
      statusCode: StatusCodes.OK,
      message: 'Logged in successfully',
      data,
    })
  );
});
