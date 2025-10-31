import express, { type Request, type Response } from 'express';
import dotenv from 'dotenv';
import CookieParser from 'cookie-parser';
import authRoutes from './src/routes/auth.routes';
import problemRoutes from './src/routes/problem.route';

dotenv.config();

const app = express();
app.use(express.json());
app.use(CookieParser());

const port = process.env.PORT || 3000;

app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/problem', problemRoutes);

app.listen(port, () => {
   console.log(`server is running on ${port}`);
});
