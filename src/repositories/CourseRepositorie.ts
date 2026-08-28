import { pool } from '../config/db';
import { Course } from '../Model/courseModel';

export const CourseRepositorie = {
  findAll: async (): Promise<Course[]> => {
    const result = await pool.query<Course>(
      `SELECT courses.id, courses.code, courses.name, courses.description, COUNT(exams.id):: int AS total_points
       FROM courses
       LEFT JOIN exams ON exams.course_id = courses.id
       GROUP BY courses.id, courses.code, courses.name, courses.description
       ORDER BY courses.code`
    );
    return result.rows;
  },

  findById: async (id: number): Promise<Course | null> => {
    const result = await pool.query<Course>(
      `SELECT courses.id, courses.code, courses.name, courses.description, COUNT(exams.id)::int AS total_points
      FROM courses
      LEFT JOIN exams ON exams.course_id = courses.id
      WHERE courses.id = $1
      GROUP BY courses.id`,
      [id]
    );
    return result.rows[0] ?? null;
  },

  findByCode: async (code: string): Promise<Course | null> => {
    const result = await pool.query<Course>(
      `SELECT id, code, name, description
       FROM courses
       WHERE code = $1`,
      [code]
    );
    return result.rows[0] ?? null;
  },

  create: async (data: { code: string; name: string; description: string | null }): Promise<Course> => {
    const result = await pool.query<Course>(
      `INSERT INTO courses (code, name, description)
       VALUES ($1, $2, $3)
       RETURNING id, code, name, description`,
      [data.code, data.name, data.description]
    );
    return result.rows[0]!;
  },

  update: async (id: number, data: { code: string; name: string; description: string | null }): Promise<Course | null> => {
    const result = await pool.query<Course>(
      `UPDATE courses
       SET code = $1, name = $2, description = $3
       WHERE id = $4
       RETURNING id, code, name, description`,
      [data.code, data.name, data.description, id]
    );
    return result.rows[0] ?? null;
  },

  delete: async (id: number): Promise<boolean> => {
    const result = await pool.query(
      `DELETE FROM courses
       WHERE id = $1`,
      [id]
    );
    return (result.rowCount ?? 0) > 0;
  },

  hasExams: async (id: number): Promise<boolean> => {
    const result = await pool.query(
      `SELECT 1
       FROM exams
       WHERE course_id = $1
       LIMIT 1`,
      [id]
    );
    return (result.rowCount ?? 0) > 0;
  },
};