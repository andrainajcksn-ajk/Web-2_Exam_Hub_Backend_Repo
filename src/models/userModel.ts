export type UserRole = 'admin' | 'student';

export interface User {
  id: number;
  name: string;
  email: string;
  password_hash?: string;
  role: UserRole;
  is_active: boolean;
  created_at: Date;
}

export interface UserPublic {
  id: number;
  name: string;
  email: string;
  is_active: boolean;
  created_at: Date;
}

export interface AuthenticatedUser {
  userId: number;
  role: UserRole;
}