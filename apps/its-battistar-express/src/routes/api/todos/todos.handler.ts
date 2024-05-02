import type {
  ITodo,
  ITodoInput,
  ITodoInputWithUser,
} from '@its-battistar/shared-types';
import { CustomResponse } from '@its-battistar/shared-types';
import {
  assertAjvValidationOrThrow,
  stringifyGetAllTodosResponse,
  stringifySendOneTodoResponse,
  validateTodoInput,
} from '@its-battistar/shared-utils';
import { StatusCodes } from 'http-status-codes';

import { AppError } from '../../../utils/app-error';
import { catchAsync } from '../../../utils/catch-async';
import { TodoModel } from './todos.model';

// FIXME:  validation, add input sanitization

export const getAllTodos = catchAsync(async (req, res) => {
  const { showCompleted } = req.query as { showCompleted: string | undefined };

  const todos = await TodoModel.find({
    ...(showCompleted !== 'true' && { completed: { $ne: 'true' } }),
  });
  console.log('todos', todos);

  res.header('Content-type', 'application/json; charset=utf-8');
  res.status(StatusCodes.OK).send(
    stringifyGetAllTodosResponse(
      new CustomResponse<ITodo[]>({
        ok: true,
        length: todos.length,
        statusCode: StatusCodes.OK,
        data: todos,
      })
    )
  );
});

// TODO: validation for all inputs, stringify for responses
export const createTodo = catchAsync(async (req, res) => {
  // INPUT: title, dueDate, description, color
  const { title, dueDate, description, color, image } =
    req.body as Partial<ITodoInput>;

  // TODO: sanitize inputs

  const candidateTodo: Partial<ITodoInputWithUser> = {
    title,
    dueDate,
    description,
    color,
    image,
    user: req.user?.id,
  };

  console.log('candidateTodo', candidateTodo);

  assertAjvValidationOrThrow<ITodoInputWithUser>(
    candidateTodo,
    validateTodoInput,
    new AppError('Failed to create todo', StatusCodes.INTERNAL_SERVER_ERROR)
  );

  const newTodo = await TodoModel.create(candidateTodo);

  console.log('newTodo', newTodo);

  res.header('Content-type', 'application/json; charset=utf-8');
  res.status(StatusCodes.CREATED).send(
    stringifySendOneTodoResponse(
      new CustomResponse<ITodo>({
        ok: true,
        statusCode: StatusCodes.CREATED,
        data: newTodo,
      })
    )
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
      data: todo,
    })
  );
});

export const patchOneTodo = catchAsync(async (req, res) => {
  // INPUT: title, completed, dueDate, description
  const { id } = req.params as { id: string };
  const { title, completed, dueDate, description } = req.body as Partial<ITodo>;

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
  description && (todo.description = description);

  const newTodo = await todo.save();

  res.status(StatusCodes.OK).json(
    new CustomResponse<ITodo>({
      ok: true,
      statusCode: StatusCodes.OK,
      message: 'Todo updated successfully',
      data: newTodo,
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
