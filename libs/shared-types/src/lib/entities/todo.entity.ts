import { Type, Static } from '@sinclair/typebox';
import fastJsonStringify from 'fast-json-stringify';
import ajvInstance from '../../utils/ajv';

export const todoSchema = Type.Object({
  id: Type.Optional(Type.String()),
  title: Type.String(),
  dueDate: Type.Date(),
  completed: Type.Boolean(),
  expired: Type.Boolean(),
});

export type TTodo = Static<typeof todoSchema>;

export class Todo implements TTodo {
  id?: string;

  title: string;

  dueDate: Date;

  completed: boolean;

  expired: boolean;

  createdAt = new Date();

  updatedAt = new Date();

  constructor({
    id,
    title,
    dueDate,
    completed,
    expired,
  }: {
    id?: string;
    title: string;
    dueDate: Date;
    completed: boolean;
    expired: boolean;
  }) {
    this.id = id;
    this.title = title;
    this.dueDate = dueDate;
    this.completed = completed;
    this.expired = expired;
  }
}

/**
 * @description must pass the data schema to the function to stringify the response
 * Do it globally to cache the stringify function on startup
 */
export const stringifyTodo = fastJsonStringify(todoSchema);

export const validateTodo = ajvInstance.compile(todoSchema);
