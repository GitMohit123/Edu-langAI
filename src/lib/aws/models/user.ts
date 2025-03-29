export const USERS_TABLE = process.env.USERS_TABLE || 'users';

export interface User {
  userId: string;
  email: string;
  password: string; // Hashed password
  name: string;
  role: string;
  tokensAvailable: number;
  createdAt: string;
  updatedAt: string;
}

export interface UserCreateInput {
  email: string;
  password: string;
  name: string;
  role: string;
  tokensAvailable?: number;
}

export interface UserUpdateInput {
  name?: string;
  email?: string;
  password?: string;
  tokensAvailable?: number;
  role?: string;
} 