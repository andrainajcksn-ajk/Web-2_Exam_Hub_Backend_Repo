import { Router } from 'express';
import * as attemptController from '../controllers/attemptController';
import * as resultController from '../controllers/resultController';

const router = Router();

router.get('/exams', attemptController.myExams);
router.get('/exams/:id', attemptController.myExamDetail);
router.post('/exams/:id/submit', attemptController.submit);
router.get('/results', resultController.myResults);

export default router;
