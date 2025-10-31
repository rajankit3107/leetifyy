import bcrypt from 'bcryptjs';
import type { Request, Response } from 'express';
import { zodRegisterSchema } from '../validation/auth.validation';
import { db } from '../lib/db';
import { UserRole } from '../generated/prisma/enums';
import jwt from 'jsonwebtoken';

export const register = async (req: Request, res: Response) => {
   const validate = zodRegisterSchema.safeParse(req.body);
   if (!validate.success) throw new Error('please provide valid details');

   try {
      const { email, name, password } = req.body;
      const existingUser = await db.user.findUnique({ where: { email } });
      if (existingUser) {
         return res.status(400).json({
            success: false,
            message: 'user already exists',
         });
      }

      const hashedPassword = await bcrypt.hash(password, 10);

      const user = await db.user.create({
         data: {
            email,
            password: hashedPassword,
            name,
            role: UserRole.USER,
         },
      });

      if (!user)
         return res
            .status(400)
            .json({ success: false, message: `Error while creating user` });

      if (!process.env.JWT_SECRET) throw new Error('JWT_SECRET is not defined');

      const token = jwt.sign(
         {
            id: user.id,
         },
         process.env.JWT_SECRET,
         { expiresIn: '7d' }
      );

      res.cookie('jwt', token, {
         httpOnly: true,
         sameSite: 'strict',
         secure: process.env.NODE_ENV !== 'development',
         maxAge: 1000 * 60 * 60 * 24 * 7,
      });

      return res.status(200).json({
         success: true,
         message: 'user created successfully',
         user: {
            id: user.id,
            email: user.email,
            name: user.name,
            role: user.role,
            image: user.image,
         },
      });
   } catch (error) {
      console.error(`Error creating user`, error);
      res.status(500).json({
         error: `Error creating user`,
      });
   }
};
