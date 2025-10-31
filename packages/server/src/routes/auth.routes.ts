import express from 'express';
import { login, register } from '../controllers/auth.controller';

const authRoutes = express.Router();

authRoutes.post('/register', register);
authRoutes.post('/login', login);
// authRoutes.post('/logout');
// authRoutes.get('/check');

export default authRoutes;
