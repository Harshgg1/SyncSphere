import { Router } from 'express';
import prisma from '../config/prisma.js';
import { authMiddleware } from '../auth.js';

const router = Router();
router.use(authMiddleware);

// Create room
router.post('/', async (req, res) => {
  try {
    const { name } = req.body;
    const userId = req.user!.userId;

    if (!name) {
      res.status(400).json({ error: 'Room name is required' });
      return;
    }

    const room = await prisma.room.create({
      data: {
        name,
        adminId: userId,
        members: {
          create: { userId, role: 'ADMIN' },
        },
      },
      include: {
        members: { include: { user: { select: { id: true, username: true, status: true } } } },
        _count: { select: { members: true } },
      },
    });

    res.status(201).json({ room });
  } catch (error) {
    console.error('Create room error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// List user's rooms
router.get('/', async (req, res) => {
  try {
    const userId = req.user!.userId;

    const rooms = await prisma.room.findMany({
      where: { members: { some: { userId } } },
      include: {
        _count: { select: { members: true } },
        admin: { select: { id: true, username: true } },
      },
      orderBy: { updatedAt: 'desc' },
    });

    res.json({ rooms });
  } catch (error) {
    console.error('List rooms error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get room details
router.get('/:roomId', async (req, res) => {
  try {
    const { roomId } = req.params;

    const room = await prisma.room.findUnique({
      where: { id: roomId },
      include: {
        members: {
          include: { user: { select: { id: true, username: true, status: true, lastSeen: true } } },
        },
        admin: { select: { id: true, username: true } },
        _count: { select: { members: true, messages: true } },
      },
    });

    if (!room) {
      res.status(404).json({ error: 'Room not found' });
      return;
    }

    res.json({ room });
  } catch (error) {
    console.error('Get room error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Join room
router.post('/:roomId/join', async (req, res) => {
  try {
    const { roomId } = req.params;
    const userId = req.user!.userId;

    const room = await prisma.room.findUnique({ where: { id: roomId } });
    if (!room) {
      res.status(404).json({ error: 'Room not found' });
      return;
    }

    const existingMember = await prisma.roomMember.findUnique({
      where: { roomId_userId: { roomId, userId } },
    });

    if (existingMember) {
      res.status(409).json({ error: 'Already a member of this room' });
      return;
    }

    await prisma.roomMember.create({
      data: { roomId, userId, role: 'MEMBER' },
    });

    const updatedRoom = await prisma.room.findUnique({
      where: { id: roomId },
      include: {
        members: { include: { user: { select: { id: true, username: true, status: true } } } },
        _count: { select: { members: true } },
      },
    });

    res.json({ room: updatedRoom });
  } catch (error) {
    console.error('Join room error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Leave room
router.post('/:roomId/leave', async (req, res) => {
  try {
    const { roomId } = req.params;
    const userId = req.user!.userId;

    const room = await prisma.room.findUnique({ where: { id: roomId } });
    if (!room) {
      res.status(404).json({ error: 'Room not found' });
      return;
    }

    // If admin leaves, delete the room
    if (room.adminId === userId) {
      await prisma.room.delete({ where: { id: roomId } });
      res.json({ message: 'Room deleted (admin left)' });
      return;
    }

    await prisma.roomMember.delete({
      where: { roomId_userId: { roomId, userId } },
    });

    res.json({ message: 'Left the room' });
  } catch (error) {
    console.error('Leave room error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Delete room (admin only)
router.delete('/:roomId', async (req, res) => {
  try {
    const { roomId } = req.params;
    const userId = req.user!.userId;

    const room = await prisma.room.findUnique({ where: { id: roomId } });
    if (!room) {
      res.status(404).json({ error: 'Room not found' });
      return;
    }

    if (room.adminId !== userId) {
      res.status(403).json({ error: 'Only room admin can delete the room' });
      return;
    }

    await prisma.room.delete({ where: { id: roomId } });
    res.json({ message: 'Room deleted' });
  } catch (error) {
    console.error('Delete room error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get room members
router.get('/:roomId/members', async (req, res) => {
  try {
    const { roomId } = req.params;

    const members = await prisma.roomMember.findMany({
      where: { roomId },
      include: {
        user: { select: { id: true, username: true, status: true, lastSeen: true } },
      },
    });

    res.json({ members });
  } catch (error) {
    console.error('Get members error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
