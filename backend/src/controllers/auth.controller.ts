import { Request, Response } from 'express';
import * as authService from '../services/auth.service.js';

const COOKIE_OPTIONS = {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'lax' as const,
  maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days (matches JWT expiry)
  path: '/',
};

export async function signup(req: Request, res: Response): Promise<void> {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      res.status(400).json({ error: 'Username and password are required' });
      return;
    }

    const result = await authService.signupUser(username, password);
    res.cookie('token', result.token, COOKIE_OPTIONS);
    res.status(201).json({ user: result.user });
  } catch (error: any) {
    console.error('Signup error:', error);
    if (error.statusCode) {
      res.status(error.statusCode).json({ error: error.message });
      return;
    }
    res.status(500).json({ error: 'Internal server error' });
  }
}

export async function login(req: Request, res: Response): Promise<void> {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      res.status(400).json({ error: 'Username and password are required' });
      return;
    }

    const result = await authService.loginUser(username, password);
    res.cookie('token', result.token, COOKIE_OPTIONS);
    res.json({ user: result.user });
  } catch (error: any) {
    console.error('Login error:', error);
    if (error.statusCode) {
      res.status(error.statusCode).json({ error: error.message });
      return;
    }
    res.status(500).json({ error: 'Internal server error' });
  }
}

export async function logout(_req: Request, res: Response): Promise<void> {
  res.clearCookie('token', { path: '/' });
  res.json({ message: 'Logged out successfully' });
}

export async function getMe(req: Request, res: Response): Promise<void> {
  try {
    const user = await authService.getUserProfile(req.user!.userId);
    res.json({ user });
  } catch (error: any) {
    console.error('Get me error:', error);
    if (error.statusCode) {
      res.status(error.statusCode).json({ error: error.message });
      return;
    }
    res.status(500).json({ error: 'Internal server error' });
  }
}

/**
 * Returns the raw JWT token from the httpOnly cookie.
 * Used by the frontend to establish WebSocket connections
 * (browsers can't send httpOnly cookies via WS query params).
 */
export async function getToken(req: Request, res: Response): Promise<void> {
  res.json({ token: req.cookies?.token || null });
}
