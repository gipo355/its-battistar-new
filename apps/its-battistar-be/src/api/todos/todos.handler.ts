import { CustomResponse, ITodo } from '@its-battistar/shared-types';
import { Handler } from 'express';

import { catchAsync } from '../../utils/catch-async';
import { TodoModel } from './todos.model';

export const getAllTodos: Handler = catchAsync((_, res) => {
  const todos = TodoModel.find();

  res.status(200).json(
    new CustomResponse<ITodo>({
      ok: true,
      message: 'Todos fetched successfully',
      data: todos,
    })
  );
});

export const createTodo: Handler = (_, res) => {};
