import prisma from '../config/prisma.js';

export async function getPinnedMessages(roomId: string) {
  const messages = await prisma.message.findMany({
    where: { roomId, isPinned: true, isDeleted: false },
    orderBy: { pinnedAt: 'desc' },
    include: {
      sender: { select: { id: true, username: true } },
    },
  });

  return messages;
}

export interface GetRoomMessagesOptions {
  cursor?: string;
  limit?: number;
  search?: string;
}

export async function getRoomMessages(roomId: string, options: GetRoomMessagesOptions) {
  const limit = options.limit || 50;
  const where: any = { roomId };

  if (options.search) {
    where.content = { contains: options.search, mode: 'insensitive' };
  }

  const findArgs: any = {
    where,
    take: limit,
    orderBy: { createdAt: 'desc' as const },
    include: {
      sender: { select: { id: true, username: true } },
      readReceipts: {
        include: { user: { select: { id: true, username: true } } },
      },
    },
  };

  if (options.cursor) {
    findArgs.cursor = { id: options.cursor };
    findArgs.skip = 1;
  }

  const messages = await prisma.message.findMany(findArgs);
  const nextCursor = messages.length === limit ? messages[messages.length - 1]?.id : null;

  return { messages, nextCursor };
}

export async function editMessage(messageId: string, userId: string, content: string) {
  if (!content) {
    const error = new Error('Content is required');
    (error as any).statusCode = 400;
    throw error;
  }

  const message = await prisma.message.findUnique({ where: { id: messageId } });
  if (!message) {
    const error = new Error('Message not found');
    (error as any).statusCode = 404;
    throw error;
  }

  if (message.senderId !== userId) {
    const error = new Error('Only the sender can edit this message');
    (error as any).statusCode = 403;
    throw error;
  }

  const updated = await prisma.message.update({
    where: { id: messageId },
    data: { content, isEdited: true },
    include: { sender: { select: { id: true, username: true } } },
  });

  return updated;
}

export async function deleteMessage(messageId: string, userId: string) {
  const message = await prisma.message.findUnique({
    where: { id: messageId },
    include: { room: true },
  });

  if (!message) {
    const error = new Error('Message not found');
    (error as any).statusCode = 404;
    throw error;
  }

  if (message.senderId !== userId && message.room.adminId !== userId) {
    const error = new Error('Not authorized to delete this message');
    (error as any).statusCode = 403;
    throw error;
  }

  const updated = await prisma.message.update({
    where: { id: messageId },
    data: { isDeleted: true },
  });

  return updated;
}
