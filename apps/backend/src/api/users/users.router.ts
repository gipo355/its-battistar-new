import { Router } from 'express';

import { protectRoute } from '../../middleware/protect-route';
import { getUsers } from './users.handler';

const r = Router();

// r.use(protectRoute);

r.get('/', getUsers);

export default r;
