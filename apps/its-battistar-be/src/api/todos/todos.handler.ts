import { Handler } from 'express';

export const getAllTodos: Handler = (_, res) => {
  res.send('Get all todos');
};
