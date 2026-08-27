import { Router } from 'express';
import { listStudents, createStudent, updateStudent, desactivateStudent } from '../Controller/StudentController';
import { authenticate, authorize } from '../Security/authMiddleware';

const router = Router();

router.use(authenticate, authorize('admin'));

router.get('/', listStudents);
router.post('/', createStudent);
router.put('/:id', updateStudent);
router.delete('/:id', desactivateStudent); 
export default router;
