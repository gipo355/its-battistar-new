import { Router } from 'express';

import { protectRoute } from '../../middleware/protect-route';
import {
    assignTodo,
    completeTodo,
    createTodo,
    getTodos,
    uncompleteTodo,
} from './todos.handler';

const r = Router();

r.use(protectRoute);

r.get('/', getTodos);
r.post('/', createTodo);
r.patch('/:id/check', completeTodo);
r.patch('/:id/uncheck', uncompleteTodo);
r.patch('/:id/assign', assignTodo);

export default r;
