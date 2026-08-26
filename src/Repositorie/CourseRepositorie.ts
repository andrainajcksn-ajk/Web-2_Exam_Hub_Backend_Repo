import { pool } from '../config/db';
import { Course } from '../Model/Course';

export const CourseRepositorie = {
  findAll: async (): Promise<Course[]> => {
    const result = await pool.query<Course>(
      `SELECT id, code, name, description
       FROM courses
       ORDER BY code`
    );
    return result.rows;
  },

  findById: async (id: string): Promise<Course | null> => {
    const result = await pool.query<Course>(
      `SELECT id, code, name, description
       FROM courses
       WHERE id = $1`,
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

  update: async (id: string, data: { code: string; name: string; description: string | null }): Promise<Course | null> => {
    const result = await pool.query<Course>(
      `UPDATE courses
       SET code = $1, name = $2, description = $3
       WHERE id = $4
       RETURNING id, code, name, description`,
      [data.code, data.name, data.description, id]
    );
    return result.rows[0] ?? null;
  },

  delete: async (id: string): Promise<boolean> => {
    const result = await pool.query(
      `DELETE FROM courses
       WHERE id = $1`,
      [id]
    );
    return (result.rowCount ?? 0) > 0;
  },

  hasExams: async (id: string): Promise<boolean> => {
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