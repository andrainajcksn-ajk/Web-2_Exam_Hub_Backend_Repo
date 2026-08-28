import { AppError } from '../appError';
import { query } from '../config/db';
import * as examRepo from '../repositories/examRepository';
import * as questionRepo from '../repositories/questionRepository';
import * as choiceRepo from '../repositories/choiceRepository';
import * as attemptRepo from '../repositories/attemptRepository';
import * as answerRepo from '../repositories/answerRepository';
import { AnswerInput } from '../models/attemptModel';

function now() {
  return new Date();
}

export async function availableExams(studentId: number) {
  const { rows } = await query(
    `SELECT e.id, e.title, e.description, e.ends_at,
            json_build_object('code', c.code, 'name', c.name) AS course,
            (SELECT COUNT(*)::int FROM questions q WHERE q.exam_id = e.id) AS question_count,
            (SELECT COALESCE(SUM(q.points),0)::int FROM questions q WHERE q.exam_id = e.id) AS total_points
     FROM exams e
     JOIN courses c ON c.id = e.course_id
     WHERE e.starts_at <= NOW() AND e.ends_at >= NOW()
       AND NOT EXISTS (SELECT 1 FROM attempts a WHERE a.exam_id = e.id AND a.student_id = $1)
     ORDER BY e.ends_at`,
    [studentId]
  );
  return rows;
}

export async function getExamDetail(studentId: number, examId: number) {
  const { rows } = await query(
    `SELECT e.id, e.title, e.description, e.starts_at, e.ends_at,
            json_build_object('code', c.code, 'name', c.name) AS course,
            (SELECT COUNT(*)::int FROM questions q WHERE q.exam_id = e.id) AS question_count,
            (SELECT COALESCE(SUM(q.points),0)::int FROM questions q WHERE q.exam_id = e.id) AS total_points
     FROM exams e
     JOIN courses c ON c.id = e.course_id
     WHERE e.id = $1`,
    [examId]
  );
  const exam = rows[0];
  if (!exam) throw new AppError(404, 'Exam not found');

  const existing = await attemptRepo.findByStudentAndExam(studentId, examId);
  if (existing) throw new AppError(409, 'Exam already taken');

  const nowMs = now().getTime();
  if (nowMs < new Date(exam.starts_at).getTime() || nowMs > new Date(exam.ends_at).getTime()) {
    throw new AppError(403, 'Exam is not available');
  }

  // RG-07 : sans is_correct
  const questions = await questionRepo.questionsForExam(examId);
  const ids = questions.map((q) => q.id);
  const choices = await choiceRepo.choicesByQuestionIds(ids);
  exam.questions = questions.map((q) => ({
    id: q.id,
    statement: q.statement,
    points: q.points,
    position: q.position,
    choices: (choices[q.id] || []).map((c) => ({ id: c.id, text: c.text })),
  }));

  return exam;
}

export async function submitExam(studentId: number, examId: number, answers: AnswerInput[]) {
  const exam = await examRepo.findById(examId);
  if (!exam) throw new AppError(404, 'Exam not found');

  if (!Array.isArray(answers)) {
    throw new AppError(400, 'answers array is required');
  }

  const existing = await attemptRepo.findByStudentAndExam(studentId, examId);
  if (existing) throw new AppError(409, 'Exam already taken');

  const nowMs = now().getTime();
  if (nowMs < new Date(exam.starts_at).getTime() || nowMs > new Date(exam.ends_at).getTime()) {
    throw new AppError(403, 'Exam is not available');
  }

  const questions = await questionRepo.questionsForExam(examId);
  const ids = questions.map((q) => q.id);
  const choices = await choiceRepo.choicesByQuestionIds(ids);

  const correctById: Record<number, any> = {};
  for (const q of questions) {
    for (const c of choices[q.id] || []) {
      if (c.is_correct) correctById[q.id] = c;
    }
  }

  // Validation des réponses
  const seen = new Set<number>();
  for (const a of answers) {
    if (!a.question_id || !a.choice_id) {
      throw new AppError(400, 'Each answer needs question_id and choice_id');
    }
    if (seen.has(a.question_id)) {
      throw new AppError(400, 'Duplicate question_id in answers');
    }
    seen.add(a.question_id);
    if (!ids.includes(a.question_id)) {
      throw new AppError(400, 'Question does not belong to this exam');
    }
    const choice = choices[a.question_id]?.find((c) => c.id === a.choice_id);
    if (!choice) {
      throw new AppError(400, 'Choice does not belong to this question');
    }
  }

  // Calcul de la note (RG-06, serveur uniquement)
  const answerMap: Record<number, number> = {};
  for (const a of answers) answerMap[a.question_id] = a.choice_id;

  let score = 0;
  const correction = questions.map((q) => {
    const chosen = answerMap[q.id] ?? null;
    const correct = correctById[q.id];
    const isCorrect = chosen !== null && chosen === correct.id;
    if (isCorrect) score += q.points;
    return {
      question_id: q.id,
      statement: q.statement,
      points: q.points,
      student_choice_id: chosen,
      correct_choice_id: correct.id,
      is_correct: isCorrect,
    };
  });

  const attempt = await attemptRepo.createAttempt(studentId, examId, score);

  for (const a of answers) {
    await answerRepo.insertAnswer(attempt.id, a.question_id, a.choice_id);
  }

  const total = questions.reduce((s, q) => s + q.points, 0);
  return { score, total_points: total, correction };
}
