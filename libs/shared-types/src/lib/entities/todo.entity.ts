import { Type, Static } from '@sinclair/typebox';
import fastJsonStringify from 'fast-json-stringify';
import ajvInstance from '../../utils/ajv';

export const todoSchemaInput = Type.Object({
  title: Type.String(),
  completed: Type.Boolean(),
});

export const todoSchema = Type.Object({
  ...todoSchemaInput.properties,
  dueDate: Type.String({
    format: 'date-time',
  }),
  expired: Type.Boolean(),
  createdAt: Type.String({
    format: 'date-time',
  }),
  updatedAt: Type.String({
    format: 'date-time',
  }),
});

export type TTodo = Static<typeof todoSchema>;

export interface ITodo {
  id?: string;

  title: string;

  dueDate: Date;

  completed: boolean;

  expired: boolean;

  createdAt: Date;

  updatedAt: Date;
}

// export class Todo {
//   id?: string;
//
//   title: string;
//
//   dueDate: string;
//
//   completed = false;
//
//   createdAt = new Date().toISOString();
//
//   updatedAt = new Date().toISOString();
//
//   constructor({ title, dueDate }: { title: string; dueDate: string }) {
//     this.title = title;
//     this.dueDate = dueDate;
//   }
//
//   get expired(): boolean {
//     return Date.now() > new Date(this.dueDate).getTime();
//   }
// }

export const stringifyTodo = fastJsonStringify(todoSchema);

export const validateTodo = ajvInstance.compile(todoSchemaInput);
