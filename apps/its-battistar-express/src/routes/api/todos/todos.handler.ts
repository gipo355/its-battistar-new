import type {
  ITodo,
  ITodoInput,
  ITodoInputWithCompleted,
  ITodoInputWithUserAndCompleted,
} from '@its-battistar/shared-types';
import { CustomResponse } from '@its-battistar/shared-types';
import {
  assertAjvValidationOrThrow,
  stringifyGetAllTodosResponse,
  stringifySendOneTodoResponse,
  validateTodoInput,
} from '@its-battistar/shared-utils';
import { StatusCodes } from 'http-status-codes';

import { AppError, catchAsync, Sanitize } from '../../../utils';
import { TodoModel } from './todos.model';

// FIXME:  validation, add input sanitization

// ALL THESE ROUTES ARE PROTECTED
// we have access to req.user from the middleware,
// if we need it, check at the start of the fn to type cast it
// and add safety check

export const getAllTodos = catchAsync(async (req, res) => {
  // we use access token payload
  const user = req.tokenPayload?.user;
  if (!user) {
    throw new AppError('There was an error', StatusCodes.NOT_FOUND);
  }

  const { showCompleted } = req.query as { showCompleted: string | undefined };

  // limit to only the todos that belong to the user
  const todos = await TodoModel.find({
    user,
    ...(showCompleted !== 'true' && { completed: { $ne: 'true' } }),
  });

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
  const user = req.tokenPayload?.user;
  if (!user) {
    throw new AppError('There was an error', StatusCodes.UNAUTHORIZED);
  }
  // INPUT: title, dueDate, description, color
  const { title, dueDate, description, color, image } =
    req.body as Partial<ITodoInput>;

  // TODO: sanitize inputs

  const candidateTodo: Partial<ITodoInputWithUserAndCompleted> = {
    title,
    dueDate,
    description,
    color,
    image,
    user,
  };

  assertAjvValidationOrThrow<ITodoInputWithUserAndCompleted>(
    candidateTodo,
    validateTodoInput,
    (errors) => {
      let messages = '';
      if (errors)
        for (const error of errors) {
          if (typeof error.message === 'string')
            messages += error.message + '\n';
        }
      new AppError(messages, StatusCodes.INTERNAL_SERVER_ERROR);
    }
  );

  const newTodo = await TodoModel.create(candidateTodo);

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
  const user = req.tokenPayload?.user;
  if (!user) {
    throw new AppError('There was an error', StatusCodes.NOT_FOUND);
  }

  const { id: candidateID } = req.params as { id: string };

  const { string, error } = new Sanitize(candidateID).isMongoId().done;
  if (error) {
    throw new AppError('Invalid ID', StatusCodes.BAD_REQUEST);
  }

  // make sure the todo belongs to the user
  const todo = await TodoModel.findOne({
    _id: string,
    user,
  });

  if (!todo?._id) {
    throw new AppError('Todo not found', StatusCodes.NOT_FOUND);
  }

  res.header('Content-type', 'application/json; charset=utf-8');
  res.status(StatusCodes.OK).send(
    stringifySendOneTodoResponse(
      new CustomResponse<ITodo>({
        ok: true,
        statusCode: StatusCodes.CREATED,
        data: todo,
      })
    )
  );
});

export const patchOneTodo = catchAsync(async (req, res) => {
  const user = req.tokenPayload?.user;
  if (!user) {
    throw new AppError('There was an error', StatusCodes.UNAUTHORIZED);
  }

  // INPUT: title, completed, dueDate, description
  // TODO: repeating this code, refactor
  const { id: candidateID } = req.params as { id: string };

  const { string: id, error } = new Sanitize(candidateID).isMongoId().done;
  if (error) {
    throw new AppError('Invalid ID', StatusCodes.BAD_REQUEST);
  }

  const { title, completed, dueDate, description, image, color } =
    req.body as Partial<ITodoInputWithCompleted>;

  console.log({ title, completed, dueDate, description, image, color });

  // TODO: sanitize inputs

  const candidateTodo: Partial<ITodoInputWithUserAndCompleted> = {
    title,
    dueDate,
    description,
    color,
    image,
    user,
    completed,
  };

  assertAjvValidationOrThrow<ITodoInputWithUserAndCompleted>(
    candidateTodo,
    validateTodoInput,
    (errors) => {
      let messages = '';
      if (errors)
        for (const error of errors) {
          if (typeof error.message === 'string')
            messages += error.message + '\n';
        }
      new AppError(messages, StatusCodes.INTERNAL_SERVER_ERROR);
    }
  );

  const todo = await TodoModel.findOneAndUpdate(
    {
      _id: id,
      user,
    },
    candidateTodo,
    {
      new: true,
    }
  );
  if (!todo || !todo.id) {
    throw new AppError('Todo not found', StatusCodes.NOT_FOUND);
  }

  res.header('Content-type', 'application/json; charset=utf-8');
  res.status(StatusCodes.OK).send(
    stringifySendOneTodoResponse(
      new CustomResponse<ITodo>({
        ok: true,
        statusCode: StatusCodes.OK,
        data: todo,
      })
    )
  );
});

export const deleteOneTodo = catchAsync(async (req, res) => {
  // TODO: repeating this code, refactor
  const user = req.tokenPayload?.user;
  if (!user) {
    throw new AppError('There was an error', StatusCodes.UNAUTHORIZED);
  }

  const { id: candidateID } = req.params as { id: string };

  const { string: id, error } = new Sanitize(candidateID).isMongoId().done;
  if (error) {
    throw new AppError('Invalid ID', StatusCodes.BAD_REQUEST);
  }

  const todo = await TodoModel.findById(id);
  if (!todo || !todo.id) {
    throw new AppError('Todo not found', StatusCodes.NOT_FOUND);
  }

  await TodoModel.findByIdAndDelete(id);

  res.status(StatusCodes.OK).json(
    new CustomResponse<null>({
      ok: true,
      statusCode: StatusCodes.NO_CONTENT,
      data: null,
    })
  );
});
