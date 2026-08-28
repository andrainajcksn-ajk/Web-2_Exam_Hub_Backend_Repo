import { pool } from '../config/db';
import { User } from '../models/user';

export const UserRepositorie = {
  async findByEmail(email: string): Promise<User | null> {
    const result = await pool.query<User>(
      `SELECT id, name, email, password_hash, role, is_active, created_at
       FROM users
       WHERE email = $1`,
      [email]
    );
    return result.rows[0] ?? null;
  },

  async findById(id: number): Promise<User | null> {
    const result = await pool.query<User>(
      `SELECT id, name, email, password_hash, role, is_active, created_at
       FROM users
       WHERE id = $1`,
      [id]
    );
    return result.rows[0] ?? null;
  },

  async findAllStudents(): Promise<Omit<User, 'password_hash'>[]> {
    const result = await pool.query<Omit<User, 'password_hash'>>(
      `SELECT id, name, email, role, is_active, created_at
       FROM users
       WHERE role = 'student'
       ORDER BY name`
    );
    return result.rows;
  },

  async create(data: { name: string; email: string; password_hash: string }): Promise<User> {
    const result = await pool.query<User>(
      `INSERT INTO users (name, email, password_hash, role)
       VALUES ($1, $2, $3, 'student')
       RETURNING id, name, email, password_hash, role, is_active, created_at`,
      [data.name, data.email, data.password_hash]
    );
    return result.rows[0]!;
  },

  async update(
    id: number,
    data: { name: string; email: string; password_hash?: string | null }
  ): Promise<User | null> {
    const result = await pool.query<User>(
      `UPDATE users
       SET name = $1, email = $2, password_hash = COALESCE($3, password_hash)
       WHERE id = $4 AND role = 'student'
       RETURNING id, name, email, password_hash, role, is_active, created_at`,
      [data.name, data.email, data.password_hash ?? null, id]
    );
    return result.rows[0] ?? null;
  },

  async desactivate(id: number): Promise<Omit<User, 'password_hash'> | null> {
    const result = await pool.query<Omit<User, 'password_hash'>>(
      `UPDATE users
       SET is_active = false
       WHERE id = $1 AND role = 'student'
       RETURNING id, name, email, role, is_active, created_at`,
      [id]
    );
    return result.rows[0] ?? null;
  },
};
