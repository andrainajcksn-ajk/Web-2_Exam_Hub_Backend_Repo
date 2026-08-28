import { Request, Response } from 'express';
import * as examService from '../Service/examService';
import * as questionService from '../Service/questionService';
import * as resultService from '../Service/resultService';

export async function list(req: Request, res: Response) {
  try {
    res.json(await examService.listExams());
  } catch (err: any) {
    res.status(err.status || 500).json({ message: err.message || 'Internal error' });
  }
}

export async function get(req: Request, res: Response) {
  try {
    res.json(await examService.getExam(Number(req.params.id)));
  } catch (err: any) {
    res.status(err.status || 500).json({ message: err.message || 'Internal error' });
  }
}

export async function create(req: Request, res: Response) {
  try {
    const exam = await examService.createExam(req.body);
    res.status(201).json(exam);
  } catch (err: any) {
    res.status(err.status || 500).json({ message: err.message || 'Internal error' });
  }
}

export async function update(req: Request, res: Response) {
  try {
    const exam = await examService.updateExam(Number(req.params.id), req.body);
    res.json(exam);
  } catch (err: any) {
    res.status(err.status || 500).json({ message: err.message || 'Internal error' });
  }
}

export async function remove(req: Request, res: Response) {
  try {
    await examService.deleteExam(Number(req.params.id));
    res.json({ message: 'Exam deleted' });
  } catch (err: any) {
    res.status(err.status || 500).json({ message: err.message || 'Internal error' });
  }
}

export async function questions(req: Request, res: Response) {
  try {
    res.json(await questionService.questionsForExam(Number(req.params.id)));
  } catch (err: any) {
    res.status(err.status || 500).json({ message: err.message || 'Internal error' });
  }
}

export async function addQuestion(req: Request, res: Response) {
  try {
    const q = await questionService.addQuestion(Number(req.params.id), req.body);
    res.status(201).json(q);
  } catch (err: any) {
    res.status(err.status || 500).json({ message: err.message || 'Internal error' });
  }
}

export async function results(req: Request, res: Response) {
  try {
    res.json(await resultService.examResults(Number(req.params.id)));
  } catch (err: any) {
    res.status(err.status || 500).json({ message: err.message || 'Internal error' });
  }
}
