import { Router } from 'express';
import { login } from '../Controller/AuthController';

const router = Router();
// POST /api/auth/login (public)
router.post('/login', login);

export default router;
