import {
  customResponseSchemaFactory,
  todoSchema,
} from '@its-battistar/shared-types';
import { Type } from '@sinclair/typebox';
import stringify from 'fast-json-stringify';

// import { stringifyCustomResponseFactory } from '../utils';

/**
 * TODOS serializers
 */

// get all todos
export const getAllTodosResponseDataSchema = Type.Array(todoSchema);
export const getAllTodosResponseSchema = customResponseSchemaFactory(
  getAllTodosResponseDataSchema
);
export const stringifyGetAllTodosResponse = stringify(
  getAllTodosResponseSchema
);
// export const stringifyGetAllTodosResponse = stringifyCustomResponseFactory(
//   getAllTodosResponseDataSchema
// );

// send one todo
export const sendOneTodoResponseSchema =
  customResponseSchemaFactory(todoSchema);
// export const stringifySendOneTodoResponse = stringifyCustomResponseFactory(
//   todoSchema
// );
export const stringifySendOneTodoResponse = stringify(
  sendOneTodoResponseSchema
);
