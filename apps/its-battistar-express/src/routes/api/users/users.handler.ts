import { CustomResponse } from '@its-battistar/shared-types';
import { StatusCodes } from 'http-status-codes';

import { AppError } from '../../../utils/app-error';
import { catchAsync } from '../../../utils/catch-async';
import { UserModel } from './users.model';

export const getAllUsersHandler = catchAsync(async (req, res) => {
  const { showCompleted } = req.query as { showCompleted: string | undefined };

  // TODO: validation for query params

  const foundUsers = await UserModel.find({
    ...(showCompleted !== 'true' && { completed: { $ne: 'true' } }),
  });

  res.status(StatusCodes.OK).json(
    new CustomResponse<void>({
      ok: true,
      length: foundUsers.length,
      statusCode: StatusCodes.OK,
      message: 'Users fetched successfully',
    })
  );
});

// TODO: validation for all inputs, stringify for responses
export const createUserHandler = catchAsync(async (req, res) => {
  const { title } = req.body as { dueDate: string; title: string };

  // let date: string | Date | undefined;

  // if (dueDate) {
  //   date = new Date(dueDate);
  // }

  // FIXME: this validation doesn't work
  // if (!validateUser({ title, dueDate })) {
  //   throw new AppError('Invalid data', StatusCodes.BAD_REQUEST);
  // }

  const newUser = await UserModel.create({
    title,
    // (dueDate && ...{dueDate}),
  });

  if (!newUser.id) {
    throw new AppError(
      'Failed to create user',
      StatusCodes.INTERNAL_SERVER_ERROR
    );
  }

  res.status(StatusCodes.CREATED).json(
    new CustomResponse<void>({
      ok: true,
      statusCode: StatusCodes.CREATED,
      message: 'User created successfully',
    })
  );
});

export const getOneUserHandler = catchAsync(async (req, res) => {
  const { id } = req.params as { id: string };

  const foundUser = await UserModel.findById(id);

  if (!foundUser || !foundUser.id) {
    throw new AppError('User not found', StatusCodes.NOT_FOUND);
  }

  res.status(StatusCodes.OK).json(
    new CustomResponse<void>({
      ok: true,
      statusCode: StatusCodes.OK,
      message: 'User checked successfully',
    })
  );
});

export const patchOneUserHandler = catchAsync(async (req, res) => {
  const { id } = req.params as { id: string };

  const foundUser = await UserModel.findById(id);

  if (!foundUser || !foundUser.id) {
    throw new AppError('User not found', StatusCodes.NOT_FOUND);
  }

  // FIXME: fix validation
  // if (!validateUser({ title, dueDate })) {
  //   throw new AppError('Invalid data', StatusCodes.BAD_REQUEST);
  // }

  await foundUser.save();

  res.status(StatusCodes.OK).json(
    new CustomResponse<void>({
      ok: true,
      statusCode: StatusCodes.OK,
      message: 'User updated successfully',
    })
  );
});

export const deleteOneUserHandler = catchAsync(async (req, res) => {
  const { id } = req.params as { id: string };

  // TODO: is this double query necessary?
  const foundUser = await UserModel.findById(id);

  if (!foundUser || !foundUser.id) {
    throw new AppError('User not found', StatusCodes.NOT_FOUND);
  }

  await UserModel.findByIdAndDelete(id);

  res.status(StatusCodes.OK).json(
    new CustomResponse<null>({
      ok: true,
      statusCode: StatusCodes.NO_CONTENT,
      message: 'User deleted successfully',
      data: null,
    })
  );
});

export const getMeHandler = catchAsync(async (_, res) => {
  // const { user } = req as { user: IUser };

  const foundUser = await UserModel.findById({ id: '123' });

  if (!foundUser || !foundUser.id) {
    throw new AppError('User not found', StatusCodes.NOT_FOUND);
  }

  res.status(StatusCodes.OK).json(
    new CustomResponse<void>({
      ok: true,
      statusCode: StatusCodes.OK,
      message: 'User fetched successfully',
    })
  );
});
