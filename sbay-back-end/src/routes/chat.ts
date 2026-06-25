import { Router, Response } from 'express';
import { Op } from 'sequelize';
import sequelize from '../config/database';
import Chat from '../models/Chat';
import ChatMessage from '../models/ChatMessage';
import User from '../models/User';
import { protect, adminOnly } from '../middleware/auth';
import { AuthenticatedRequest } from '../types';
import { getIO } from '../socket';
import { uploadChat, isCloudinaryConfigured } from '../middleware/upload';

const router = Router();

const enrichChat = async (chat: Chat) => {
  const users = await User.findAll({
    where: { id: chat.participants },
    attributes: ['id', 'username', 'profilePicture'],
  });
  return { ...chat.toJSON(), participants: users };
};

router.post('/', protect, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { receiverId } = req.body;
    if (!receiverId) return res.status(400).json({ success: false, message: 'receiverId required' });
    const recId = parseInt(receiverId as string);
    if (recId === req.user!.id) return res.status(400).json({ success: false, message: 'Cannot chat with yourself' });

    const existingChat = await Chat.findOne({
      where: {
        [Op.and]: [
          { participants: { [Op.contains]: [req.user!.id] } },
          { participants: { [Op.contains]: [recId] } },
        ],
      },
    });

    if (existingChat) return res.json({ success: true, data: await enrichChat(existingChat) });

    const chat = await Chat.create({ participants: [req.user!.id, recId] });
    res.status(201).json({ success: true, data: await enrichChat(chat) });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Server error';
    res.status(500).json({ success: false, message });
  }
});

router.get('/', protect, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const chats = await Chat.findAll({
      where: { participants: { [Op.contains]: [req.user!.id] } },
      order: [['updatedAt', 'DESC']],
    });
    const enriched = await Promise.all(chats.map(enrichChat));
    res.json({ success: true, data: enriched });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Server error';
    res.status(500).json({ success: false, message });
  }
});

router.get('/:chatId/messages', protect, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const chatId = parseInt(req.params.chatId as string);
    const chat = await Chat.findByPk(chatId);
    if (!chat) return res.status(404).json({ success: false, message: 'Chat not found' });
    if (!chat.participants.includes(req.user!.id))
      return res.status(403).json({ success: false, message: 'Not a participant' });

    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 50;
    const offset = (page - 1) * limit;

    const { rows: messages, count: total } = await ChatMessage.findAndCountAll({
      where: { chatId },
      include: [
        { association: 'sender', attributes: ['id', 'username', 'profilePicture'] },
      ],
      order: [['createdAt', 'DESC']],
      offset,
      limit,
    });

    res.json({ success: true, data: messages.reverse(), total, page, pages: Math.ceil(total / limit) });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Server error';
    res.status(500).json({ success: false, message });
  }
});

router.post('/:chatId/messages', protect, uploadChat.single('media'), async (req: AuthenticatedRequest, res: Response) => {
  try {
    const chatId = parseInt(req.params.chatId as string);
    const chat = await Chat.findByPk(chatId);
    if (!chat) return res.status(404).json({ success: false, message: 'Chat not found' });
    if (!chat.participants.includes(req.user!.id))
      return res.status(403).json({ success: false, message: 'Not a participant' });

    const { content } = req.body;
    if (!content && !req.file) return res.status(400).json({ success: false, message: 'Message content or media required' });

    let mediaUrl = '';
    let mediaType = '';
    if (req.file) {
      mediaUrl = isCloudinaryConfigured() ? req.file.path : `/uploads/chat/${req.file.filename}`;
      mediaType = req.file.mimetype;
    }

    const message = await ChatMessage.create({
      chatId,
      senderId: req.user!.id,
      content: content || '',
      mediaUrl,
      mediaType,
    });

    await chat.update({ lastMessage: content || mediaType, lastMessageAt: new Date() });

    const result = await ChatMessage.findByPk(message.id, {
      include: [{ association: 'sender', attributes: ['id', 'username', 'profilePicture'] }],
    });

    const io = getIO();
    chat.participants.forEach(pid => {
      io.to(`user_${pid}`).emit('new_message', result);
    });

    res.status(201).json({ success: true, data: result });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Server error';
    res.status(500).json({ success: false, message });
  }
});

router.delete('/messages/:messageId', protect, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const messageId = parseInt(req.params.messageId as string);
    const message = await ChatMessage.findByPk(messageId);
    if (!message) return res.status(404).json({ success: false, message: 'Message not found' });
    if (message.senderId !== req.user!.id && req.user!.role !== 'admin')
      return res.status(403).json({ success: false, message: 'Not authorized' });

    await message.destroy();
    res.json({ success: true, message: 'Message deleted' });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Server error';
    res.status(500).json({ success: false, message });
  }
});

router.delete('/:chatId', protect, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const chatId = parseInt(req.params.chatId as string);
    const chat = await Chat.findByPk(chatId);
    if (!chat) return res.status(404).json({ success: false, message: 'Chat not found' });
    if (!chat.participants.includes(req.user!.id) && req.user!.role !== 'admin')
      return res.status(403).json({ success: false, message: 'Not authorized' });

    await ChatMessage.destroy({ where: { chatId } });
    await sequelize.query('DELETE FROM "ChatParticipants" WHERE "chatId" = ?', { replacements: [chatId] });
    await chat.destroy();
    res.json({ success: true, message: 'Chat and all messages deleted' });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Server error';
    res.status(500).json({ success: false, message });
  }
});

router.get('/admin/all', protect, adminOnly, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const chats = await Chat.findAll({ order: [['updatedAt', 'DESC']] });
    const enriched = await Promise.all(chats.map(async (chat) => {
      const users = await User.findAll({
        where: { id: chat.participants },
        attributes: ['id', 'username', 'profilePicture'],
      });
      return { ...chat.toJSON(), participants: users };
    }));
    res.json({ success: true, data: enriched });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Server error';
    res.status(500).json({ success: false, message });
  }
});

export default router;
