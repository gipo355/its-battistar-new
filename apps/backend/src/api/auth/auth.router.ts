import { Router } from 'express';

import { login, register } from './auth.handler';

const router = Router();

router.post('/login', login);
router.post('/register', register);

export default router;
