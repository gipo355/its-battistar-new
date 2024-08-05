import { Router } from 'express';

import authRouter from './auth/auth.router';
import todosRouter from './todos/todos.router';
import usersRouter from './users/users.router';

const r = Router();

r.use('/todos', todosRouter);
r.use('/users', usersRouter);
r.use(authRouter);

export default r;
