import { pool } from '../config/db'; 
import { User } from '../Model/User';

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
};
