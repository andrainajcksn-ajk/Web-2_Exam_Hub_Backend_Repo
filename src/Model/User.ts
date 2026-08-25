export type UserRole = 'admin' | 'student';

export interface User {
  id: number;
  name: string;
  email: string;
  password_hash: string;
  role: UserRole;
  is_active: boolean;
  created_at: Date;
}

export interface AuthenticatedUser {
  id: number;
  role: UserRole;
}
