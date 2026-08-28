import { query } from '../config/db';
import { Course } from '../Model/courseModel';

export async function allCourses(): Promise<Course[]> {
  const { rows } = await query(
    `SELECT c.id, c.code, c.name, c.description,
            COUNT(e.id)::int AS exam_count
     FROM courses c
     LEFT JOIN exams e ON e.course_id = c.id
     GROUP BY c.id
     ORDER BY c.id`
  );
  return rows;
}

export async function findById(id: number): Promise<Course | undefined> {
  const { rows } = await query('SELECT * FROM courses WHERE id = $1', [id]);
  return rows[0];
}

export async function findByCode(code: string): Promise<Course | undefined> {
  const { rows } = await query('SELECT * FROM courses WHERE LOWER(code) = LOWER($1)', [
    code,
  ]);
  return rows[0];
}

export async function createCourse(
  code: string,
  name: string,
  description: string | null
): Promise<Course> {
  const { rows } = await query(
    'INSERT INTO courses (code, name, description) VALUES ($1, $2, $3) RETURNING id, code, name, description, 0 AS exam_count',
    [code, name, description]
  );
  return rows[0];
}

export async function updateCourse(
  id: number,
  code: string,
  name: string,
  description: string | null
): Promise<Course | undefined> {
  const { rows } = await query(
    'UPDATE courses SET code = $1, name = $2, description = $3 WHERE id = $4 RETURNING id, code, name, description',
    [code, name, description, id]
  );
  return rows[0];
}

export async function deleteCourse(id: number): Promise<boolean> {
  const { rowCount } = await query('DELETE FROM courses WHERE id = $1', [id]);
  return (rowCount ?? 0) > 0;
}

export async function countExams(courseId: number): Promise<number> {
  const { rows } = await query('SELECT COUNT(*)::int AS count FROM exams WHERE course_id = $1', [
    courseId,
  ]);
  return rows[0].count;
}
