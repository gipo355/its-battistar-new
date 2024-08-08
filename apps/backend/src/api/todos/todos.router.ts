import { Router } from 'express';

import { protectRoute } from '../../utils/auth/protect-route';
import {
    assignTodo,
    completeTodo,
    createTodo,
    deleteTodo,
    getTodos,
    uncompleteTodo,
} from './todos.service';

const r = Router();

r.use(protectRoute);

r.get('/', getTodos);
r.post('/', createTodo);
r.patch('/:id/check', completeTodo);
r.patch('/:id/uncheck', uncompleteTodo);
r.post('/:id/assign', assignTodo);
r.delete('/:id', deleteTodo);

export default r;
