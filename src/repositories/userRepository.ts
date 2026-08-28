import { query } from '../config/db';
import { User, UserPublic } from '../Model/userModel';

function toPublic(row: any): UserPublic {
  return {
    id: row.id,
    name: row.name,
    email: row.email,
    is_active: row.is_active,
    created_at: row.created_at,
  };
}
;

export async function findByEmail(email: string): Promise<User | undefined> {
  const { rows } = await query('SELECT * FROM users WHERE email = $1', [email]);
  return rows[0];
}

export async function findById(id: number): Promise<User | undefined> {
  const { rows } = await query('SELECT * FROM users WHERE id = $1', [id]);
  return rows[0];
}

export async function allStudents(): Promise<UserPublic[]> {
  const { rows } = await query(
    "SELECT id, name, email, is_active, created_at FROM users WHERE role = 'student' ORDER BY id"
  );
  return rows.map(toPublic);
}

export async function createStudent(
  name: string,
  email: string,
  passwordHash: string
): Promise<UserPublic> {
  const { rows } = await query(
    "INSERT INTO users (name, email, password_hash, role) VALUES ($1, $2, $3, 'student') RETURNING id, name, email, is_active, created_at",
    [name, email, passwordHash]
  );
  return rows[0];
}

export async function updateStudent(
  id: number,
  name: string,
  email: string,
  isActive: boolean,
  passwordHash?: string
): Promise<UserPublic | undefined> {
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
}

export async function deactivate(id: number): Promise<UserPublic | undefined> {
  const { rows } = await query(
    'UPDATE users SET is_active = FALSE WHERE id = $1 RETURNING id, name, email, is_active, created_at',
    [id]
  );
  return rows[0];
}
