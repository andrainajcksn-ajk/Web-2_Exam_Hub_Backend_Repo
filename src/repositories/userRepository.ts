import { query } from '../config/db';
import { User, UserPublic } from '../models/userModel';

const toPublic = (row: any): UserPublic => ({
  id: row.id,
  name: row.name,
  email: row.email,
  is_active: row.is_active,
  created_at: row.created_at,
});

export const findByEmail = async (email: string): Promise<User | undefined> => {
  const { rows } = await query('SELECT * FROM users WHERE email = $1', [email]);
  return rows[0];
};

export const findById = async (id: number): Promise<User | undefined> => {
  const { rows } = await query('SELECT * FROM users WHERE id = $1', [id]);
  return rows[0];
};

export const allStudents = async (): Promise<UserPublic[]> => {
  const { rows } = await query(
    "SELECT id, name, email, is_active, created_at FROM users WHERE role = 'student' ORDER BY id"
  );
  return rows.map(toPublic);
};

export const createStudent = async (
  name: string,
  email: string,
  passwordHash: string
): Promise<UserPublic> => {
  const { rows } = await query(
    "INSERT INTO users (name, email, password_hash, role) VALUES ($1, $2, $3, 'student') RETURNING id, name, email, is_active, created_at",
    [name, email, passwordHash]
  );
  return rows[0];
};

export const updateStudent = async (
  id: number,
  name: string,
  email: string,
  isActive: boolean,
  passwordHash?: string
): Promise<UserPublic | undefined> => {
  if (passwordHash) {
    const { rows } = await query(
      'UPDATE users SET name = $1, email = $2, is_active = $3, password_hash = $4 WHERE id = $5 RETURNING id, name, email, is_active, created_at',
      [name, email, isActive, passwordHash, id]
    );
    return rows[0];
  }
  const { rows } = await query(
    'UPDATE users SET name = $1, email = $2, is_active = $3 WHERE id = $4 RETURNING id, name, email, is_active, created_at',
    [name, email, isActive, id]
  );
  return rows[0];
};

export const deactivate = async (id: number): Promise<UserPublic | undefined> => {
  const { rows } = await query(
    'UPDATE users SET is_active = FALSE WHERE id = $1 RETURNING id, name, email, is_active, created_at',
    [id]
  );
  return rows[0];
};