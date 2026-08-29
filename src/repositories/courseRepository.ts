import { query } from '../config/db';
import { Course } from '../models/courseModel';

export const allCourses = async (): Promise<Course[]> => {
  const { rows } = await query(
    `SELECT c.id, c.code, c.name, c.description,
            COUNT(e.id)::int AS exam_count
     FROM courses c
     LEFT JOIN exams e ON e.course_id = c.id
     GROUP BY c.id
     ORDER BY c.id`
  );
  return rows;
};

export const findById = async (id: number): Promise<Course | undefined> => {
  const { rows } = await query('SELECT * FROM courses WHERE id = $1', [id]);
  return rows[0];
};

export const findByCode = async (code: string): Promise<Course | undefined> => {
  const { rows } = await query('SELECT * FROM courses WHERE LOWER(code) = LOWER($1)', [
    code,
  ]);
  return rows[0];
};

export const createCourse = async (
  code: string,
  name: string,
  description: string | null
): Promise<Course> => {
  const { rows } = await query(
    'INSERT INTO courses (code, name, description) VALUES ($1, $2, $3) RETURNING id, code, name, description, 0 AS exam_count',
    [code, name, description]
  );
  return rows[0];
};

export const updateCourse = async (
  id: number,
  code: string,
  name: string,
  description: string | null
): Promise<Course | undefined> => {
  const { rows } = await query(
    `UPDATE courses c
     SET code = $1, name = $2, description = $3
     WHERE id = $4
     RETURNING c.id, c.code, c.name, c.description,
       (SELECT COUNT(*)::int FROM exams e WHERE e.course_id = c.id) AS exam_count`,
    [code, name, description, id]
  );
  return rows[0];
};

export const deleteCourse = async (id: number): Promise<boolean> => {
  const { rowCount } = await query('DELETE FROM courses WHERE id = $1', [id]);
  return (rowCount ?? 0) > 0;
};

export const countExams = async (courseId: number): Promise<number> => {
  const { rows } = await query('SELECT COUNT(*)::int AS count FROM exams WHERE course_id = $1', [
    courseId,
  ]);
  return rows[0].count;
};