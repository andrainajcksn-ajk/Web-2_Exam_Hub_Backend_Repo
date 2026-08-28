import { Router } from 'express';
import * as questionController from '../controllers/questionController';

const router = Router();

router.put('/:id', questionController.update);
router.delete('/:id', questionController.remove);

export default router;
