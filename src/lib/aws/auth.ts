import { compare, hash } from 'bcryptjs';
import { sign, verify, Secret } from 'jsonwebtoken';
import { User } from './models/user';

const JWT_SECRET = (process.env.JWT_SECRET || 'your-secret-key') as Secret;
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '7d';

export async function hashPassword(password: string): Promise<string> {
  return hash(password, 12);
}

export async function verifyPassword(password: string, hashedPassword: string): Promise<boolean> {
  return compare(password, hashedPassword);
}

export function generateToken(user: User): string {
  return sign(
    { 
      userId: user.userId,
      email: user.email,
      name: user.name,
      role: user.role,
      tokensAvailable: user.tokensAvailable
    },
    JWT_SECRET,
    { expiresIn: JWT_EXPIRES_IN } as any
  );
}

export function verifyToken(token: string): any {
  try {
    return verify(token, JWT_SECRET);
  } catch (error) {
    return null;
  }
} 