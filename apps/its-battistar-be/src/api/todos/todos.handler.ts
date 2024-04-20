import {
  CustomResponse,
  ITodo,
  validateTodo,
} from '@its-battistar/shared-types';
import { StatusCodes } from 'http-status-codes';

import { AppError } from '../../utils/app-error';
import { catchAsync } from '../../utils/catch-async';
import { TodoModel } from './todos.model';

export const getAllTodos = catchAsync(async (req, res) => {
  const { showCompleted } = req.query as { showCompleted: string | undefined };

  const todos = await TodoModel.find({
    ...(showCompleted && { completed: showCompleted === 'true' }),
  });

  res.status(StatusCodes.OK).json(
    new CustomResponse<ITodo[]>({
      ok: true,
      statusCode: StatusCodes.OK,
      message: 'Todos fetched successfully',
      data: todos,
    })
  );
});

export const createTodo = catchAsync(async (req, res) => {
  const { title, dueDate } = req.body as { title: string; dueDate: string };

  const date = new Date(dueDate).toISOString();

  // BUG: validation error returns html
  if (!validateTodo({ title, dueDate })) {
    throw new AppError('Invalid data', StatusCodes.BAD_REQUEST);
  }

  const newTodo = await TodoModel.create({
    title,
    dueDate: date,
  });

  if (!newTodo.id) {
    throw new AppError(
      'Failed to create todo',
      StatusCodes.INTERNAL_SERVER_ERROR
    );
  }

  res.status(StatusCodes.CREATED).json(
    new CustomResponse<ITodo>({
      ok: true,
      statusCode: StatusCodes.CREATED,
      message: 'Todo created successfully',
      data: newTodo,
    })
  );
});

export const getOneTodo = catchAsync(async (req, res) => {
  const { id } = req.params as { id: string };

  console.log('getOneTodo id', id);

  const todo = await TodoModel.findOne({
    id,
  });

  if (!todo || !todo.id) {
    throw new AppError('Todo not found', StatusCodes.NOT_FOUND);
  }

  res.status(StatusCodes.OK).json(
    new CustomResponse<ITodo>({
      ok: true,
      statusCode: StatusCodes.OK,
      message: 'Todo checked successfully',
      data: todo,
    })
  );
});
