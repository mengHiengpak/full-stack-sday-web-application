import { Server as SocketIOServer, Socket } from 'socket.io';
import http from 'http';
import jwt from 'jsonwebtoken';
import { AuthPayload } from './types';
import ChatMessage from './models/ChatMessage';
import Chat from './models/Chat';

let io: SocketIOServer;

export const initSocket = (server: http.Server) => {
  io = new SocketIOServer(server, {
    cors: {
      origin: process.env.CLIENT_URL || 'http://localhost:3000',
      credentials: true,
    },
  });

  io.use((socket: Socket, next) => {
    const token = socket.handshake.auth?.token;
    if (!token) return next(new Error('Authentication required'));

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as AuthPayload;
      (socket as any).userId = parseInt(decoded.id);
      next();
    } catch {
      next(new Error('Invalid token'));
    }
  });

  io.on('connection', (socket: Socket) => {
    const userId = (socket as any).userId as number;
    console.log(`User ${userId} connected`);

    socket.join(`user_${userId}`);

    socket.on('send_message', async (data: { chatId: number; content: string; mediaUrl?: string; mediaType?: string }) => {
      try {
        const chat = await Chat.findByPk(data.chatId);
        if (!chat || !chat.participants.includes(userId)) return;

        const message = await ChatMessage.create({
          chatId: data.chatId,
          senderId: userId,
          content: data.content,
          mediaUrl: data.mediaUrl || '',
          mediaType: data.mediaType || '',
        });

        await chat.update({ lastMessage: data.content || data.mediaType || '', lastMessageAt: new Date() });

        const result = await ChatMessage.findByPk(message.id, {
          include: [{ association: 'sender', attributes: ['id', 'username', 'profilePicture'] }],
        });

        chat.participants.forEach(pid => {
          io.to(`user_${pid}`).emit('new_message', result);
        });
      } catch (err) {
        socket.emit('error', { message: 'Failed to send message' });
      }
    });

    socket.on('typing', async (data: { chatId: number }) => {
      const chat = await Chat.findByPk(data.chatId);
      if (!chat) return;
      const otherPid = chat.participants.find(pid => pid !== userId);
      if (otherPid) socket.to(`user_${otherPid}`).emit('typing', { chatId: data.chatId, userId });
    });

    socket.on('mark_read', async (data: { chatId: number; messageIds: number[] }) => {
      try {
        await ChatMessage.update(
          { readAt: new Date() },
          { where: { id: data.messageIds, chatId: data.chatId } }
        );

        const chat = await Chat.findByPk(data.chatId);
        if (chat) {
          chat.participants.forEach(pid => {
            io.to(`user_${pid}`).emit('messages_read', { chatId: data.chatId, messageIds: data.messageIds, readBy: userId });
          });
        }
      } catch (err) {
        socket.emit('error', { message: 'Failed to mark messages as read' });
      }
    });

    socket.on('disconnect', () => {
      console.log(`User ${userId} disconnected`);
    });
  });

  return io;
};

export const getIO = (): SocketIOServer => {
  if (!io) throw new Error('Socket.IO not initialized');
  return io;
};
