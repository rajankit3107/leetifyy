import bcrypt from 'bcryptjs';
import type { Request, Response } from 'express';
import {
   zodLoginSchema,
   zodRegisterSchema,
} from '../validation/auth.validation';
import { db } from '../lib/db';
import { UserRole } from '../generated/prisma/enums';
import jwt from 'jsonwebtoken';
import type { AuthRequest } from '../middlewares/auth.middleware';

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

export const login = async (req: Request, res: Response) => {
   const validate = zodLoginSchema.safeParse(req.body);
   if (!validate.success) throw new Error('please provide valid details');

   try {
      const { email, password } = req.body;

      const user = await db.user.findUnique({ where: { email } });

      if (!user)
         return res.status(400).json({
            success: false,
            message: `No user exists with this email`,
         });

      const isMatch = await bcrypt.compare(password, user.password);

      if (!isMatch)
         return res
            .status(401)
            .json({ success: false, message: 'Invalid Credentials' });

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
         maxAge: 1000 * 60 * 60 * 24 * 7, //7 days
      });
      return res.status(201).json({
         success: true,
         message: `user logged in successfully`,
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
         error: `Error logging in user`,
      });
   }
};

export const logout = async (req: Request, res: Response) => {
   try {
      res.clearCookie('jwt', {
         httpOnly: true,
         sameSite: 'strict',
         secure: process.env.NODE_ENV !== 'development',
      });

      return res
         .status(200)
         .json({ success: true, message: `user logged out successfully` });
   } catch (error) {
      console.error(`Error logging out`);
   }
};

export const check = async (req: AuthRequest, res: Response) => {
   try {
      res.status(200).json({
         success: true,
         message: 'user authenticated successfully',
         user: req.user,
      });
   } catch (error) {
      console.error(`Error checking user`, error);
      res.status(500).json({
         error: `Error checking user`,
      });
   }
};
