import { Router } from 'express';
import * as courseController from '../Controller/courseController';

const router = Router();

router.get('/', courseController.list);
router.post('/', courseController.create);
router.put('/:id', courseController.update);
router.delete('/:id', courseController.remove);

export default router;
