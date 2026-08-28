import { query } from '../config/db';
import { Exam } from '../Model/examModel';

export async function allExams(): Promise<Exam[]> {
  const { rows } = await query(
    `SELECT e.id, e.title, e.description, e.starts_at, e.ends_at,
            json_build_object('id', c.id, 'code', c.code, 'name', c.name) AS course,
            (SELECT COUNT(*)::int FROM questions q WHERE q.exam_id = e.id) AS question_count,
            (SELECT COUNT(*)::int FROM attempts a WHERE a.exam_id = e.id) AS attempt_count
     FROM exams e
     JOIN courses c ON c.id = e.course_id
     ORDER BY e.id`
  );
  return rows;
}

export async function findById(id: number): Promise<Exam | undefined> {
  const { rows } = await query(
    `SELECT e.id, e.title, e.description, e.starts_at, e.ends_at,
            json_build_object('id', c.id, 'code', c.code, 'name', c.name) AS course,
            (SELECT COUNT(*)::int FROM questions q WHERE q.exam_id = e.id) AS question_count,
            (SELECT COUNT(*)::int FROM attempts a WHERE a.exam_id = e.id) AS attempt_count
     FROM exams e
     JOIN courses c ON c.id = e.course_id
     WHERE e.id = $1`,
    [id]
  );
  return rows[0];
}

export async function createExam(input: {
  course_id: number;
  title: string;
  description: string | null;
  starts_at: string;
  ends_at: string;
}): Promise<Exam> {
  const { rows } = await query(
    `INSERT INTO exams (course_id, title, description, starts_at, ends_at)
     VALUES ($1, $2, $3, $4, $5)
     RETURNING id, course_id, title, description, starts_at, ends_at, 0::int AS question_count, 0::int AS attempt_count`,
    [input.course_id, input.title, input.description, input.starts_at, input.ends_at]
  );
  const full = await findById(rows[0].id);
  return full!;
}

export async function updateExam(
  id: number,
  input: {
    course_id: number;
    title: string;
    description: string | null;
    starts_at: string;
    ends_at: string;
  }
): Promise<Exam | undefined> {
  const { rows } = await query(
    `UPDATE exams
     SET course_id = $1, title = $2, description = $3, starts_at = $4, ends_at = $5
     WHERE id = $6
     RETURNING id`,
    [input.course_id, input.title, input.description, input.starts_at, input.ends_at, id]
  );
  if (rows.length === 0) return undefined;
  return findById(id);
}

export async function deleteExam(id: number): Promise<boolean> {
  const { rowCount } = await query('DELETE FROM exams WHERE id = $1', [id]);
  return (rowCount ?? 0) > 0;
}

export async function countAttempts(examId: number): Promise<number> {
  const { rows } = await query('SELECT COUNT(*)::int AS count FROM attempts WHERE exam_id = $1', [
    examId,
  ]);
  return rows[0].count;
}
