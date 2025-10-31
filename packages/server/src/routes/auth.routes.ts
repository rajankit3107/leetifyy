import express from 'express';
import { login, logout, register } from '../controllers/auth.controller';
import { authMiddleware } from '../middlewares/auth.middleware';

const authRoutes = express.Router();

authRoutes.post('/register', register);
authRoutes.post('/login', login);
authRoutes.post('/logout', authMiddleware, logout);
// authRoutes.get('/check');

export default authRoutes;
