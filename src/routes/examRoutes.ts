import { Router } from 'express';
import * as examController from '../controllers/examController';

const router = Router();

router.get('/', examController.list);
router.post('/', examController.create);
router.get('/:id', examController.get);
router.put('/:id', examController.update);
router.delete('/:id', examController.remove);
router.get('/:id/results', examController.results);
router.get('/:id/questions', examController.questions);
router.post('/:id/questions', examController.addQuestion);

export default router;
