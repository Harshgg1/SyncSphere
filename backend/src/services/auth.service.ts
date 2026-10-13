import prisma from '../config/prisma.js';
import { hashPassword, comparePassword, generateToken } from '../utils/auth.util.js';

export async function signupUser(username: string, password: string) {
  const existing = await prisma.user.findUnique({ where: { username } });
  if (existing) {
    const error = new Error('Username already taken');
    (error as any).statusCode = 409;
    throw error;
  }

  const hashedPassword = await hashPassword(password);
  const user = await prisma.user.create({
    data: { username, password: hashedPassword },
  });

  const token = generateToken({ userId: user.id, username: user.username });
  return { token, user: { id: user.id, username: user.username } };
}

export async function loginUser(username: string, password: string) {
  const user = await prisma.user.findUnique({ where: { username } });
  if (!user) {
    const error = new Error('Invalid credentials');
    (error as any).statusCode = 401;
    throw error;
  }

  const valid = await comparePassword(password, user.password);
  if (!valid) {
    const error = new Error('Invalid credentials');
    (error as any).statusCode = 401;
    throw error;
  }

  const token = generateToken({ userId: user.id, username: user.username });
  return { token, user: { id: user.id, username: user.username } };
}

export async function getUserProfile(userId: string) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { id: true, username: true, status: true, lastSeen: true, createdAt: true },
  });

  if (!user) {
    const error = new Error('User not found');
    (error as any).statusCode = 404;
    throw error;
  }

  return user;
}
