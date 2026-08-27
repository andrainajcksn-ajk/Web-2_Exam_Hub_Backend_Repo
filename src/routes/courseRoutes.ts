import { Router } from 'express';
import { listCourses, createCourse, updateCourse, deleteCourse } from '../Controller/CourseController';
import { authenticate, authorize } from '../Security/authMiddleware';

const router = Router();

// Toutes les routes /api/courses sont réservées à l'administrateur
router.use(authenticate, authorize('admin'));

router.get('/', listCourses);
router.post('/', createCourse);
router.put('/:id', updateCourse);
router.delete('/:id', deleteCourse);

export default router;