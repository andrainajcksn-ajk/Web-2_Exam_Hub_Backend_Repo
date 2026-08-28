import { query } from '../config/db';
import { Attempt } from '../Model/attemptModel';

export async function findByStudentAndExam(
  studentId: number,
  examId: number
): Promise<Attempt | undefined> {
  const { rows } = await query(
    'SELECT * FROM attempts WHERE student_id = $1 AND exam_id = $2',
    [studentId, examId]
  );
  return rows[0];
}

export async function createAttempt(
  studentId: number,
  examId: number,
  score: number
): Promise<Attempt> {
  const { rows } = await query(
    'INSERT INTO attempts (student_id, exam_id, score) VALUES ($1, $2, $3) RETURNING *',
    [studentId, examId, score]
  );
  return rows[0];
}

export async function countAttemptsForExam(examId: number): Promise<number> {
  const { rows } = await query('SELECT COUNT(*)::int AS count FROM attempts WHERE exam_id = $1', [
    examId,
  ]);
  return rows[0].count;
}
