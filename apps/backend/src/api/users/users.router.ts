import { Router } from 'express';

import { protectRoute } from '../../utils/auth/protect-route';
import { getUsers } from './users.service';

const r = Router();

r.use(protectRoute);

r.get('/', getUsers);

export default r;
