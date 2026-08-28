import { Router } from 'express';
import { authenticate } from '../security/authenticate';
import { requireRole } from '../security/requireRole';
import authRoutes from './authRoutes';
import studentRoutes from './studentRoutes';
import courseRoutes from './courseRoutes';
import examRoutes from './examRoutes';
import questionRoutes from './questionRoutes';
import studentExamRoutes from './studentExamRoutes';

const router = Router();

// Public
router.use('/auth', authRoutes);

// Admin uniquement
router.use('/students', authenticate, requireRole('admin'), studentRoutes);
router.use('/courses', authenticate, requireRole('admin'), courseRoutes);
router.use('/exams', authenticate, requireRole('admin'), examRoutes);
router.use('/questions', authenticate, requireRole('admin'), questionRoutes);

// Étudiant uniquement
router.use('/my', authenticate, requireRole('student'), studentExamRoutes);

export default router;
