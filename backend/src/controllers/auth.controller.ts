import { Request, Response } from 'express';
import * as authService from '../services/auth.service.js';

export async function signup(req: Request, res: Response): Promise<void> {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      res.status(400).json({ error: 'Username and password are required' });
      return;
    }

    const result = await authService.signupUser(username, password);
    res.status(201).json(result);
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
    res.json(result);
  } catch (error: any) {
    console.error('Login error:', error);
    if (error.statusCode) {
      res.status(error.statusCode).json({ error: error.message });
      return;
    }
    res.status(500).json({ error: 'Internal server error' });
  }
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
