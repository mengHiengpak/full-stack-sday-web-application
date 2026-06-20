import { Router, Response } from 'express';
import { Op } from 'sequelize';
import FriendRequest from '../models/FriendRequest';
import User from '../models/User';
import { protect } from '../middleware/auth';
import { AuthenticatedRequest } from '../types';

const router = Router();

router.post('/request/:userId', protect, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const receiverId = parseInt(req.params.userId as string);
    if (receiverId === req.user!.id)
      return res.status(400).json({ success: false, message: 'Cannot send request to yourself' });

    const receiver = await User.findByPk(receiverId);
    if (!receiver) return res.status(404).json({ success: false, message: 'User not found' });

    const existing = await FriendRequest.findOne({
      where: {
        [Op.or]: [
          { senderId: req.user!.id, receiverId },
          { senderId: receiverId, receiverId: req.user!.id },
        ],
        status: { [Op.in]: ['pending', 'accepted'] },
      },
    });

    if (existing) {
      if (existing.status === 'accepted')
        return res.status(409).json({ success: false, message: 'Already friends' });
      return res.status(409).json({ success: false, message: 'Friend request already sent' });
    }

    const request = await FriendRequest.create({
      senderId: req.user!.id,
      receiverId,
      status: 'pending',
    });

    res.status(201).json({ success: true, data: request });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Server error';
    res.status(500).json({ success: false, message });
  }
});

router.post('/respond/:requestId', protect, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const requestId = parseInt(req.params.requestId as string);
    const { status } = req.body;

    if (!status || !['accepted', 'declined'].includes(status))
      return res.status(400).json({ success: false, message: 'Status must be accepted or declined' });

    const request = await FriendRequest.findByPk(requestId);
    if (!request) return res.status(404).json({ success: false, message: 'Request not found' });
    if (request.receiverId !== req.user!.id)
      return res.status(403).json({ success: false, message: 'Not your request to respond to' });
    if (request.status !== 'pending')
      return res.status(400).json({ success: false, message: 'Request already responded to' });

    await request.update({ status });
    res.json({ success: true, data: request });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Server error';
    res.status(500).json({ success: false, message });
  }
});

router.get('/requests', protect, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const requests = await FriendRequest.findAll({
      where: { receiverId: req.user!.id, status: 'pending' },
      include: [
        { association: 'sender', attributes: ['id', 'username', 'profilePicture'] },
      ],
      order: [['createdAt', 'DESC']],
    });
    res.json({ success: true, data: requests });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Server error';
    res.status(500).json({ success: false, message });
  }
});

router.get('/list', protect, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const sentRequests = await FriendRequest.findAll({
      where: { senderId: req.user!.id, status: 'accepted' },
      include: [
        { association: 'receiver', attributes: ['id', 'username', 'profilePicture'] },
      ],
    });

    const receivedRequests = await FriendRequest.findAll({
      where: { receiverId: req.user!.id, status: 'accepted' },
      include: [
        { association: 'sender', attributes: ['id', 'username', 'profilePicture'] },
      ],
    });

    const friends = [
      ...sentRequests.map(r => (r as any).receiver),
      ...receivedRequests.map(r => (r as any).sender),
    ];

    res.json({ success: true, data: friends });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Server error';
    res.status(500).json({ success: false, message });
  }
});

router.delete('/unfriend/:userId', protect, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const otherId = parseInt(req.params.userId as string);

    const deleted = await FriendRequest.destroy({
      where: {
        [Op.or]: [
          { senderId: req.user!.id, receiverId: otherId, status: 'accepted' },
          { senderId: otherId, receiverId: req.user!.id, status: 'accepted' },
        ],
      },
    });

    if (deleted === 0) return res.status(404).json({ success: false, message: 'Friendship not found' });
    res.json({ success: true, message: 'Unfriended' });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Server error';
    res.status(500).json({ success: false, message });
  }
});

export default router;
