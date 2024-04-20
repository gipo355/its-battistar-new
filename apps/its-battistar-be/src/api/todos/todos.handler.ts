import { CustomResponse, ITodo } from '@its-battistar/shared-types';
import { StatusCodes } from 'http-status-codes';

import { AppError } from '../../utils/app-error';
import { catchAsync } from '../../utils/catch-async';
import { TodoModel } from './todos.model';

export const getAllTodos = catchAsync(async (req, res) => {
  const { showCompleted } = req.query as { showCompleted: string | undefined };

  // TODO: validation for query params

  const todos = await TodoModel.find({
    ...(showCompleted === 'false' && { completed: { $ne: 'true' } }),
  });

  res.status(StatusCodes.OK).json(
    new CustomResponse<ITodo[]>({
      ok: true,
      length: todos.length,
      statusCode: StatusCodes.OK,
      message: 'Todos fetched successfully',
      data: todos,
    })
  );
});

// TODO: validation for all inputs, stringify for responses
// FIXME: all errors returns html

export const createTodo = catchAsync(async (req, res) => {
  const {
    title,
    // dueDate
  } = req.body as { title: string; dueDate: string };

  // let date: string | Date | undefined;
  //
  // if (dueDate) {
  //   date = new Date(dueDate).toISOString();
  // }

  // FIXME: this validation doesn't work
  // if (!validateTodo({ title, dueDate })) {
  //   throw new AppError('Invalid data', StatusCodes.BAD_REQUEST);
  // }

  const newTodo = await TodoModel.create({
    title,
    // (dueDate && ...{dueDate: date}),
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

  const todo = await TodoModel.findById(id);

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
