import type { ITodo } from '@its-battistar/shared-types';
import { CustomResponse } from '@its-battistar/shared-types';
import { StatusCodes } from 'http-status-codes';

import { AppError } from '../../../../utils/app-error';
import { catchAsync } from '../../../../utils/catch-async';
import { TodoModel } from '../todos.model';

export const markForCheck = catchAsync(async (req, res) => {
  const { id } = req.params as { id: string };

  const todo = await TodoModel.findById(id);

  if (!todo || !todo.id) {
    throw new AppError('Todo not found', StatusCodes.NOT_FOUND);
  }

  todo.completed = true;

  await todo.save();

  res.status(StatusCodes.OK).json(
    new CustomResponse<ITodo>({
      ok: true,
      statusCode: StatusCodes.OK,
      message: 'Todo checked successfully',
      data: todo,
    })
  );
});

export const markForUncheck = catchAsync(async (req, res) => {
  const { id } = req.params as { id: string };

  const todo = await TodoModel.findById(id);

  if (!todo || !todo.id) {
    throw new AppError('Todo not found', StatusCodes.NOT_FOUND);
  }

  todo.completed = false;

  await todo.save();

  res.status(StatusCodes.OK).json(
    new CustomResponse<ITodo>({
      ok: true,
      statusCode: StatusCodes.OK,
      message: 'Todo unchecked successfully',
      data: todo,
    })
  );
});
