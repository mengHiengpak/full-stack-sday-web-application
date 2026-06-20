import { Router, Response } from 'express';
import Reaction from '../models/Reaction';
import Post from '../models/Post';
import Comment from '../models/Comment';
import Story from '../models/Story';
import { protect } from '../middleware/auth';
import { AuthenticatedRequest } from '../types';

const router = Router();

const validTypes = ['like', 'love', 'haha', 'wow', 'sad', 'angry', 'fire'] as const;

router.post('/post/:postId', protect, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const postId = parseInt(req.params.postId as string);
    const { type } = req.body;

    if (!type || !validTypes.includes(type))
      return res.status(400).json({ success: false, message: `Type must be one of: ${validTypes.join(', ')}` });

    const post = await Post.findByPk(postId);
    if (!post) return res.status(404).json({ success: false, message: 'Post not found' });

    const existing = await Reaction.findOne({ where: { postId, userId: req.user!.id } });
    if (existing) {
      if (existing.type === type) {
        await existing.destroy();
        return res.json({ success: true, active: false, data: null, message: 'Reaction removed' });
      }
      await existing.update({ type });
      return res.json({ success: true, active: true, data: existing });
    }

    const reaction = await Reaction.create({ postId, userId: req.user!.id, type });
    res.status(201).json({ success: true, active: true, data: reaction });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Server error';
    res.status(500).json({ success: false, message });
  }
});

router.post('/comment/:commentId', protect, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const commentId = parseInt(req.params.commentId as string);
    const { type } = req.body;

    if (!type || !validTypes.includes(type))
      return res.status(400).json({ success: false, message: `Type must be one of: ${validTypes.join(', ')}` });

    const comment = await Comment.findByPk(commentId);
    if (!comment) return res.status(404).json({ success: false, message: 'Comment not found' });

    const existing = await Reaction.findOne({ where: { commentId, userId: req.user!.id } });
    if (existing) {
      if (existing.type === type) {
        await existing.destroy();
        return res.json({ success: true, active: false, data: null, message: 'Reaction removed' });
      }
      await existing.update({ type });
      return res.json({ success: true, active: true, data: existing });
    }

    const reaction = await Reaction.create({ commentId, userId: req.user!.id, type });
    res.status(201).json({ success: true, active: true, data: reaction });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Server error';
    res.status(500).json({ success: false, message });
  }
});

router.post('/story/:storyId', protect, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const storyId = parseInt(req.params.storyId as string);
    const { type } = req.body;

    if (!type || !validTypes.includes(type))
      return res.status(400).json({ success: false, message: `Type must be one of: ${validTypes.join(', ')}` });

    const story = await Story.findByPk(storyId);
    if (!story) return res.status(404).json({ success: false, message: 'Story not found' });

    const existing = await Reaction.findOne({ where: { storyId, userId: req.user!.id } });
    if (existing) {
      if (existing.type === type) {
        await existing.destroy();
        return res.json({ success: true, active: false, data: null, message: 'Reaction removed' });
      }
      await existing.update({ type });
      return res.json({ success: true, active: true, data: existing });
    }

    const reaction = await Reaction.create({ storyId, userId: req.user!.id, type });
    res.status(201).json({ success: true, active: true, data: reaction });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Server error';
    res.status(500).json({ success: false, message });
  }
});

router.get('/post/:postId', protect, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const postId = parseInt(req.params.postId as string);
    const reactions = await Reaction.findAll({
      where: { postId },
      include: [
        { association: 'user', attributes: ['id', 'username', 'profilePicture'] },
      ],
      order: [['createdAt', 'DESC']],
    });
    res.json({ success: true, data: reactions });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Server error';
    res.status(500).json({ success: false, message });
  }
});

router.get('/story/:storyId', protect, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const storyId = parseInt(req.params.storyId as string);
    const reactions = await Reaction.findAll({
      where: { storyId },
      include: [
        { association: 'user', attributes: ['id', 'username', 'profilePicture'] },
      ],
      order: [['createdAt', 'DESC']],
    });
    res.json({ success: true, data: reactions });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Server error';
    res.status(500).json({ success: false, message });
  }
});

export default router;
