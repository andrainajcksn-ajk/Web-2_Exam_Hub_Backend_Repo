import { Router } from 'express';
import { listCourses, createCourse, updateCourse, deleteCourse } from '../controllers/courseController';
import { authenticate, authorize } from '../security/authMiddleware';

const router = Router();

router.use(authenticate, authorize('admin'));

router.get('/', listCourses);
router.post('/', createCourse);
router.put('/:id', updateCourse);
router.delete('/:id', deleteCourse);

export default router;