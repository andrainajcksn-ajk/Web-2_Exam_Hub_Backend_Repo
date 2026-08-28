import { Router } from 'express';
import * as studentController from '../controllers/studentController';

const router = Router();

router.get('/', studentController.list);
router.post('/', studentController.create);
router.put('/:id', studentController.update);
router.delete('/:id', studentController.deactivate);

export default router;
