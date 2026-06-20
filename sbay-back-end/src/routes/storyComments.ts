import { Router, Response } from 'express';
import StoryComment from '../models/StoryComment';
import Story from '../models/Story';
import { protect } from '../middleware/auth';
import { AuthenticatedRequest } from '../types';

const router = Router();

router.get('/:storyId', protect, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const storyId = parseInt(req.params.storyId as string);
    const comments = await StoryComment.findAll({
      where: { storyId },
      include: [
        { association: 'author', attributes: ['id', 'username', 'profilePicture'] },
      ],
      order: [['createdAt', 'ASC']],
    });
    res.json({ success: true, data: comments });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Server error';
    res.status(500).json({ success: false, message });
  }
});

router.post('/:storyId', protect, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const storyId = parseInt(req.params.storyId as string);
    const { content } = req.body;

    if (!content) return res.status(400).json({ success: false, message: 'Content required' });

    const story = await Story.findByPk(storyId);
    if (!story) return res.status(404).json({ success: false, message: 'Story not found' });

    const comment = await StoryComment.create({
      storyId,
      authorId: req.user!.id,
      content,
    });

    const result = await StoryComment.findByPk(comment.id, {
      include: [{ association: 'author', attributes: ['id', 'username', 'profilePicture'] }],
    });

    res.status(201).json({ success: true, data: result });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Server error';
    res.status(500).json({ success: false, message });
  }
});

router.delete('/:commentId', protect, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const commentId = parseInt(req.params.commentId as string);
    const comment = await StoryComment.findByPk(commentId);
    if (!comment) return res.status(404).json({ success: false, message: 'Comment not found' });
    if (comment.authorId !== req.user!.id && req.user!.role !== 'admin')
      return res.status(403).json({ success: false, message: 'Not authorized' });

    await comment.destroy();
    res.json({ success: true, message: 'Comment deleted' });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Server error';
    res.status(500).json({ success: false, message });
  }
});

export default router;
