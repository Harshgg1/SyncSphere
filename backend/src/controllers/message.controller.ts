import { Request, Response } from 'express';
import * as messageService from '../services/message.service.js';

export async function getPinnedMessages(req: Request, res: Response): Promise<void> {
  try {
    const roomId = req.params.roomId as string;
    const messages = await messageService.getPinnedMessages(roomId);
    res.json({ messages });
  } catch (error: any) {
    console.error('Get pinned messages error:', error);
    if (error.statusCode) {
      res.status(error.statusCode).json({ error: error.message });
      return;
    }
    res.status(500).json({ error: 'Internal server error' });
  }
}

export async function getMessages(req: Request, res: Response): Promise<void> {
  try {
    const roomId = req.params.roomId as string;
    const { cursor, limit: limitStr, search } = req.query;
    const limit = parseInt(limitStr as string) || 50;

    const result = await messageService.getRoomMessages(roomId, {
      cursor: cursor as string | undefined,
      limit,
      search: search as string | undefined,
    });

    res.json(result);
  } catch (error: any) {
    console.error('Get messages error:', error);
    if (error.statusCode) {
      res.status(error.statusCode).json({ error: error.message });
      return;
    }
    res.status(500).json({ error: 'Internal server error' });
  }
}

export async function editMessage(req: Request, res: Response): Promise<void> {
  try {
    const messageId = req.params.messageId as string;
    const { content } = req.body;
    const userId = req.user!.userId;

    const updated = await messageService.editMessage(messageId, userId, content);
    res.json({ message: updated });
  } catch (error: any) {
    console.error('Edit message error:', error);
    if (error.statusCode) {
      res.status(error.statusCode).json({ error: error.message });
      return;
    }
    res.status(500).json({ error: 'Internal server error' });
  }
}

export async function deleteMessage(req: Request, res: Response): Promise<void> {
  try {
    const messageId = req.params.messageId as string;
    const userId = req.user!.userId;

    const updated = await messageService.deleteMessage(messageId, userId);
    res.json({ message: updated });
  } catch (error: any) {
    console.error('Delete message error:', error);
    if (error.statusCode) {
      res.status(error.statusCode).json({ error: error.message });
      return;
    }
    res.status(500).json({ error: 'Internal server error' });
  }
}
