import express from 'express';
import { authMiddleware, isAdmin } from '../middlewares/auth.middleware';
import {
   createProblem,
   deleteProblem,
   getAllProblems,
   getProblemById,
   getSolvedProblemsByUser,
   updateProblem,
} from '../controllers/problems.controller';

const problemRoutes = express.Router();

problemRoutes.post('/create-problem', authMiddleware, isAdmin, createProblem);
problemRoutes.get('/problems', authMiddleware, getAllProblems);
problemRoutes.get('/problem/:id', authMiddleware, getProblemById);
problemRoutes.put('/problem', authMiddleware, isAdmin, updateProblem);
problemRoutes.delete('/problem', authMiddleware, isAdmin, deleteProblem);
problemRoutes.get('/solved-problmes', authMiddleware, getSolvedProblemsByUser);

export default problemRoutes;
