import prisma from '../config/prisma.js';

export async function createRoom(name: string, userId: string) {
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

  return room;
}

export async function getUserRooms(userId: string) {
  const rooms = await prisma.room.findMany({
    where: { members: { some: { userId } } },
    include: {
      _count: { select: { members: true } },
      admin: { select: { id: true, username: true } },
    },
    orderBy: { updatedAt: 'desc' },
  });

  return rooms;
}

export async function getRoomById(roomId: string) {
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
    const error = new Error('Room not found');
    (error as any).statusCode = 404;
    throw error;
  }

  return room;
}

export async function joinRoom(roomId: string, userId: string) {
  const room = await prisma.room.findUnique({ where: { id: roomId } });
  if (!room) {
    const error = new Error('Room not found');
    (error as any).statusCode = 404;
    throw error;
  }

  const existingMember = await prisma.roomMember.findUnique({
    where: { roomId_userId: { roomId, userId } },
  });

  if (existingMember) {
    const error = new Error('Already a member of this room');
    (error as any).statusCode = 409;
    throw error;
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

  return updatedRoom;
}

export async function leaveRoom(roomId: string, userId: string) {
  const room = await prisma.room.findUnique({ where: { id: roomId } });
  if (!room) {
    const error = new Error('Room not found');
    (error as any).statusCode = 404;
    throw error;
  }

  // If admin leaves, delete the room
  if (room.adminId === userId) {
    await prisma.room.delete({ where: { id: roomId } });
    return { message: 'Room deleted (admin left)' };
  }

  await prisma.roomMember.delete({
    where: { roomId_userId: { roomId, userId } },
  });

  return { message: 'Left the room' };
}

export async function deleteRoom(roomId: string, userId: string) {
  const room = await prisma.room.findUnique({ where: { id: roomId } });
  if (!room) {
    const error = new Error('Room not found');
    (error as any).statusCode = 404;
    throw error;
  }

  if (room.adminId !== userId) {
    const error = new Error('Only room admin can delete the room');
    (error as any).statusCode = 403;
    throw error;
  }

  await prisma.room.delete({ where: { id: roomId } });
  return { message: 'Room deleted' };
}

export async function getRoomMembers(roomId: string) {
  const members = await prisma.roomMember.findMany({
    where: { roomId },
    include: {
      user: { select: { id: true, username: true, status: true, lastSeen: true } },
    },
  });

  return members;
}
