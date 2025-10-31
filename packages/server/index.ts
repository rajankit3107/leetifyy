import express, { type Request, type Response } from 'express';
import dotenv from 'dotenv';
import CookieParser from 'cookie-parser';

dotenv.config();

const app = express();
app.use(express.json());
app.use(CookieParser());

const port = process.env.PORT || 3000;

app.get('/', (req: Request, res: Response) => {
   res.send('Hello world!');
});

app.listen(port, () => {
   console.log(`server is running on ${port}`);
});
