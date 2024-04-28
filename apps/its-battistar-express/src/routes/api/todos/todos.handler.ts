import {
  CustomResponse,
  ITodo,
  validateTodo,
} from '@its-battistar/shared-types';
import { StatusCodes } from 'http-status-codes';

import { AppError } from '../../../utils/app-error';
import { catchAsync } from '../../../utils/catch-async';
import { TodoModel } from './todos.model';

export const getAllTodos = catchAsync(async (req, res) => {
  const { showCompleted } = req.query as { showCompleted: string | undefined };

  // TODO: validation for query params

  const todos = await TodoModel.find({
    ...(showCompleted !== 'true' && { completed: { $ne: 'true' } }),
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
export const createTodo = catchAsync(async (req, res) => {
  const { title, dueDate } = req.body as { title: string; dueDate: string };

  // let date: string | Date | undefined;

  // if (dueDate) {
  //   date = new Date(dueDate);
  // }

  // FIXME: this validation doesn't work
  if (!validateTodo({ title, dueDate })) {
    throw new AppError('Invalid data', StatusCodes.BAD_REQUEST);
  }

  const newTodo = await TodoModel.create({
    title,
    // (dueDate && ...{dueDate}),
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

export const patchOneTodo = catchAsync(async (req, res) => {
  const { id } = req.params as { id: string };
  const { title, completed, dueDate } = req.body as Partial<ITodo>;

  const todo = await TodoModel.findById(id);

  if (!todo || !todo.id) {
    throw new AppError('Todo not found', StatusCodes.NOT_FOUND);
  }

  // FIXME: fix validation
  // if (!validateTodo({ title, dueDate })) {
  //   throw new AppError('Invalid data', StatusCodes.BAD_REQUEST);
  // }

  title && (todo.title = title);
  completed && (todo.completed = completed);
  dueDate && (todo.dueDate = dueDate);

  await todo.save();

  res.status(StatusCodes.OK).json(
    new CustomResponse<ITodo>({
      ok: true,
      statusCode: StatusCodes.OK,
      message: 'Todo updated successfully',
      data: todo,
    })
  );
});

export const deleteOneTodo = catchAsync(async (req, res) => {
  const { id } = req.params as { id: string };

  // TODO: is this double query necessary?
  const todo = await TodoModel.findById(id);

  if (!todo || !todo.id) {
    throw new AppError('Todo not found', StatusCodes.NOT_FOUND);
  }

  await TodoModel.findByIdAndDelete(id);

  res.status(StatusCodes.OK).json(
    new CustomResponse<ITodo | null>({
      ok: true,
      statusCode: StatusCodes.NO_CONTENT,
      message: 'Todo deleted successfully',
      data: null,
    })
  );
});