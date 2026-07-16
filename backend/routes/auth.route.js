import express from 'express';
const router = express.Router();
import { login, register, password } from '../controllers/auth.controller.js';

router.post('/login', login);
router.post('/register', register);
router.put('/:gov_id/password', password);

export default router;