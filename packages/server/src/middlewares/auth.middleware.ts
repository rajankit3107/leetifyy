import type { NextFunction, Request, Response } from 'express';
import { db } from '../lib/db';
import type { JwtPayload } from 'jsonwebtoken';
import jwt from 'jsonwebtoken';

export interface AuthRequest extends Request {
   user?: {
      id: string;
      name: string;
      email: string;
      role: string;
   };
}

export const authMiddleware = async (
   req: AuthRequest,
   res: Response,
   next: NextFunction
) => {
   try {
      const token = req.cookies?.jwt;

      if (!token) {
         return res.status(401).json({ message: 'Unauthorized' });
      }

      if (!process.env.JWT_SECRET) {
         throw new Error('JWT_SECRET is not defined');
      }

      let decoded: JwtPayload;
      try {
         decoded = jwt.verify(token, process.env.JWT_SECRET) as JwtPayload;
         //  console.log(decoded);
      } catch (error) {
         return res.status(401).json({ message: 'Invalid or expired token' });
      }

      const user = await db.user.findUnique({
         where: { id: decoded.id },
         select: { id: true, email: true, name: true, role: true, image: true },
      });

      if (!user) {
         return res.status(401).json({ message: 'Unauthorized' });
      }

      req.user = user;
      next();
   } catch (error) {
      console.error('Error authenticating user:', error);
      return res.status(500).json({ message: 'Internal server error' });
   }
};
