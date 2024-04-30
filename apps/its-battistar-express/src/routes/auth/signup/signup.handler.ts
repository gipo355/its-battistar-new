import { CustomResponse } from '@its-battistar/shared-types';
import { Handler } from 'express';
import { StatusCodes } from 'http-status-codes';

import { APP_CONFIG as c } from '../../../app.config';
import { sessionRedisConnection } from '../../../db/redis';
import { AppError, catchAsync, createJWT } from '../../../utils';
import { AccountModel } from '../../api/users/accounts.model';
import { UserModel } from '../../api/users/users.model';

export const signupHandler: Handler = catchAsync(async (req, res) => {
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

  /**
   * objectives:
   * if there is a user with a local account, throw an error
   * if there is no user at all, create a new user with a local account
   * if there is a user but no local account, create a local account for the user
   */
  const foundUser = await UserModel.findOne({ email }).populate({
    path: 'accounts',
  });

  // should be using a transaction here
  if (!foundUser) {
    const newUser = await UserModel.create({
      email,
    });
    // TODO: what if we create a user but fail to create an account? mongoose does not support transactions without replica sets
    await AccountModel.create({
      user: newUser._id,
      strategy: 'LOCAL',
      password,
      passwordConfirm,
    });
  } else {
    const userAccounts = await AccountModel.find({
      user: foundUser._id,
    });
    if (
      userAccounts.some(
        (account) => account.strategy === 'LOCAL' && account.password
      )
    ) {
      // VULNERABILITY: brute force attack, leaking user existence
      throw new AppError('User already exists', StatusCodes.CONFLICT);
    }

    await AccountModel.create([
      {
        user: foundUser.id as string,
        strategy: 'LOCAL',
        password,
        passwordConfirm,
      },
    ]);

    // TODO: check if needed
    await foundUser.save();
  }

  // TODO: check if to keep same model for account
  // multiple emails
  const user = await UserModel.findOne({
    email,
  });

  // TODO: this must go in use service
  if (!user) {
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
      user: user._id.toString(),
      strategy: 'LOCAL',
    },
    type: 'access',
  });
  const refreshToken = await createJWT({
    data: {
      user: user._id.toString(),
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
    user: user._id.toString(),
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
  const key = `${c.REDIS_USER_SESSION_PREFIX}${user._id.toString()}`;
  await sessionRedisConnection.sadd(key, refreshToken);
  // reset the expiration time for the user sessions
  // we must have both the token key and user key with token value for token to be valid
  await sessionRedisConnection.expire(key, c.REDIS_USER_SESSION_MAX_EX);

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
