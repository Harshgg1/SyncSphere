import { Request, Response, NextFunction } from 'express';
import { verifyToken } from '../utils/auth.util.js';

declare global {
  namespace Express {
    interface Request {
      user?: { userId: string; username: string };
    }
  }
}

export function authMiddleware(req: Request, res: Response, next: NextFunction): void {
  // 1. Try httpOnly cookie first
  let token = req.cookies?.token;

  // 2. Fallback to Authorization header (for backward compatibility / API clients)
  if (!token) {
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith('Bearer ')) {
      token = authHeader.split(' ')[1];
    }
  }

  if (!token) {
    res.status(401).json({ error: 'No token provided' });
    return;
  }

  const decoded = verifyToken(token);
  if (!decoded) {
    res.status(401).json({ error: 'Invalid token' });
    return;
  }

  req.user = decoded;
  next();
}
