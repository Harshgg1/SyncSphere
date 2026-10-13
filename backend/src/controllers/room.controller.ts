import { Request, Response } from 'express';
import * as roomService from '../services/room.service.js';

export async function createRoom(req: Request, res: Response): Promise<void> {
  try {
    const { name } = req.body;
    const userId = req.user!.userId;

    if (!name) {
      res.status(400).json({ error: 'Room name is required' });
      return;
    }

    const room = await roomService.createRoom(name, userId);
    res.status(201).json({ room });
  } catch (error: any) {
    console.error('Create room error:', error);
    if (error.statusCode) {
      res.status(error.statusCode).json({ error: error.message });
      return;
    }
    res.status(500).json({ error: 'Internal server error' });
  }
}

export async function getRooms(req: Request, res: Response): Promise<void> {
  try {
    const userId = req.user!.userId;
    const rooms = await roomService.getUserRooms(userId);
    res.json({ rooms });
  } catch (error: any) {
    console.error('List rooms error:', error);
    if (error.statusCode) {
      res.status(error.statusCode).json({ error: error.message });
      return;
    }
    res.status(500).json({ error: 'Internal server error' });
  }
}

export async function getRoom(req: Request, res: Response): Promise<void> {
  try {
    const roomId = req.params.roomId as string;
    const room = await roomService.getRoomById(roomId);
    res.json({ room });
  } catch (error: any) {
    console.error('Get room error:', error);
    if (error.statusCode) {
      res.status(error.statusCode).json({ error: error.message });
      return;
    }
    res.status(500).json({ error: 'Internal server error' });
  }
}

export async function joinRoom(req: Request, res: Response): Promise<void> {
  try {
    const roomId = req.params.roomId as string;
    const userId = req.user!.userId;

    const room = await roomService.joinRoom(roomId, userId);
    res.json({ room });
  } catch (error: any) {
    console.error('Join room error:', error);
    if (error.statusCode) {
      res.status(error.statusCode).json({ error: error.message });
      return;
    }
    res.status(500).json({ error: 'Internal server error' });
  }
}

export async function leaveRoom(req: Request, res: Response): Promise<void> {
  try {
    const roomId = req.params.roomId as string;
    const userId = req.user!.userId;

    const result = await roomService.leaveRoom(roomId, userId);
    res.json(result);
  } catch (error: any) {
    console.error('Leave room error:', error);
    if (error.statusCode) {
      res.status(error.statusCode).json({ error: error.message });
      return;
    }
    res.status(500).json({ error: 'Internal server error' });
  }
}

export async function deleteRoom(req: Request, res: Response): Promise<void> {
  try {
    const roomId = req.params.roomId as string;
    const userId = req.user!.userId;

    const result = await roomService.deleteRoom(roomId, userId);
    res.json(result);
  } catch (error: any) {
    console.error('Delete room error:', error);
    if (error.statusCode) {
      res.status(error.statusCode).json({ error: error.message });
      return;
    }
    res.status(500).json({ error: 'Internal server error' });
  }
}

export async function getRoomMembers(req: Request, res: Response): Promise<void> {
  try {
    const roomId = req.params.roomId as string;
    const members = await roomService.getRoomMembers(roomId);
    res.json({ members });
  } catch (error: any) {
    console.error('Get members error:', error);
    if (error.statusCode) {
      res.status(error.statusCode).json({ error: error.message });
      return;
    }
    res.status(500).json({ error: 'Internal server error' });
  }
}
