import { AppError } from '../errors/appError';
import * as examRepo from '../repositories/examRepository';
import * as questionRepo from '../repositories/questionRepository';
import * as choiceRepo from '../repositories/choiceRepository';
import { QuestionInput } from '../models/questionModel';

function validateQuestion(input: QuestionInput) {
  if (!input.statement || !Array.isArray(input.choices)) {
    throw new AppError(400, 'statement and choices are required');
  }
  if (input.choices.length < 2 || input.choices.length > 6) {
    throw new AppError(400, 'A question must have between 2 and 6 choices');
  }
  const correct = input.choices.filter((c) => c.is_correct).length;
  if (correct !== 1) {
    throw new AppError(400, 'A question must have exactly one correct choice');
  }
}

async function ensureNotLocked(examId: number) {
  const attempts = await examRepo.countAttempts(examId);
  if (attempts > 0) {
    throw new AppError(
      409,
      'Cannot modify questions of an exam that has attempts'
    );
  }
}

export async function questionsForExam(examId: number) {
  const exam = await examRepo.findById(examId);
  if (!exam) throw new AppError(404, 'Exam not found');

  const questions = await questionRepo.questionsForExam(examId);
  const ids = questions.map((q) => q.id);
  const choices = await choiceRepo.choicesByQuestionIds(ids);
  return questions.map((q) => ({ ...q, choices: choices[q.id] || [] }));
}

export async function addQuestion(examId: number, input: QuestionInput) {
  const exam = await examRepo.findById(examId);
  if (!exam) throw new AppError(404, 'Exam not found');

  await ensureNotLocked(examId);
  validateQuestion(input);

  const question = await questionRepo.createQuestion(examId, input);
  for (const c of input.choices) {
    await questionRepo.insertChoice(question.id, c.text, c.is_correct);
  }
  const choices = await questionRepo.choicesForQuestion(question.id);
  return { ...question, choices };
}

export async function updateQuestion(id: number, input: QuestionInput) {
  const question = await questionRepo.findById(id);
  if (!question) throw new AppError(404, 'Question not found');

  await ensureNotLocked(question.exam_id);
  validateQuestion(input);

  await questionRepo.updateQuestion(id, input);
  await questionRepo.deleteChoices(id);
  for (const c of input.choices) {
    await questionRepo.insertChoice(id, c.text, c.is_correct);
  }
  const choices = await questionRepo.choicesForQuestion(id);
  return { ...(await questionRepo.findById(id)), choices };
}

export async function deleteQuestion(id: number) {
  const question = await questionRepo.findById(id);
  if (!question) throw new AppError(404, 'Question not found');

  await ensureNotLocked(question.exam_id);
  await questionRepo.deleteQuestion(id);
  return true;
}
