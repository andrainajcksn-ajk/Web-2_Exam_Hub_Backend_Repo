import { AppError } from '../errors/appError';
import * as examRepo from '../repositories/examRepository';
import * as attemptRepo from '../repositories/attemptRepository';
import { query } from '../config/db';

export async function examResults(examId: number) {
  const exam = await examRepo.findById(examId);
  if (!exam) throw new AppError(404, 'Exam not found');

  const questions = await query(
    'SELECT COALESCE(SUM(points),0)::int AS total FROM questions WHERE exam_id = $1',
    [examId]
  );
  const totalPoints = questions.rows[0].total;

  const { rows } = await query(
    `SELECT a.student_id, u.name, a.score, a.submitted_at
     FROM attempts a
     JOIN users u ON u.id = a.student_id
     WHERE a.exam_id = $1
     ORDER BY a.score DESC, u.name`,
    [examId]
  );

  const attemptCount = rows.length;
  const average =
    attemptCount > 0
      ? Math.round((rows.reduce((s, r) => s + r.score, 0) / attemptCount) * 100) / 100
      : null;

  return {
    exam: { id: exam.id, title: exam.title },
    total_points: totalPoints,
    average,
    attempt_count: attemptCount,
    results: rows,
  };
}

export async function studentResults(studentId: number) {
  const { rows } = await query(
    `SELECT e.id AS exam_id, e.title, c.code AS course_code,
            a.score, a.submitted_at,
            (SELECT COALESCE(SUM(q.points),0)::int FROM questions q WHERE q.exam_id = e.id) AS total_points
     FROM attempts a
     JOIN exams e ON e.id = a.exam_id
     JOIN courses c ON c.id = e.course_id
     WHERE a.student_id = $1
     ORDER BY a.submitted_at DESC`,
    [studentId]
  );
  return rows;
}
