export interface User {
  id: number;
  name: string;
  email: string;
  password_hash?: string;
  role: 'admin' | 'student';
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
