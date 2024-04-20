import {
  CustomResponse,
  ITodo,
  validateTodo,
} from '@its-battistar/shared-types';
import { Handler } from 'express';
import { StatusCodes } from 'http-status-codes';

import { TypedRequestBody } from '../../types/request-body';
import { AppError } from '../../utils/app-error';
import { catchAsync } from '../../utils/catch-async';
import { TodoModel } from './todo.model';

export const getAllTodos: Handler = catchAsync(async (_req, res) => {
  const todos = await TodoModel.find();

  res.status(StatusCodes.OK).json(
    new CustomResponse<ITodo[]>({
      ok: true,
      statusCode: StatusCodes.OK,
      message: 'Todos fetched successfully',
      data: todos,
    })
  );
});

export const createTodo: Handler = catchAsync(
  async (req: TypedRequestBody<ITodo>, res, next) => {
    const { title, dueDate } = req.body;

    if (!validateTodo({ title, dueDate })) {
      next(new AppError('Invalid data', StatusCodes.BAD_REQUEST));
      return;
    }

    const newTodo = await TodoModel.create({
      title: 'New Todo',
      description: 'New Todo Description',
    });
  }
);
