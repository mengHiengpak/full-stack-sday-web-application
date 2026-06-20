import { Router, Response } from 'express';
import Comment from '../models/Comment';
import { protect } from '../middleware/auth';
import { AuthenticatedRequest } from '../types';

const router = Router();

router.get('/post/:postId', protect, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const postId = parseInt(req.params.postId as string);
    const comments = await Comment.findAll({
      where: { postId, parentCommentId: null },
      include: [
        { association: 'author', attributes: ['id', 'username', 'profilePicture', 'role'] },
        {
          association: 'replies',
          include: [{ association: 'author', attributes: ['id', 'username', 'profilePicture', 'role'] }],
        },
      ],
      order: [['createdAt', 'ASC']],
    });
    res.json({ success: true, data: comments });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Server error';
    res.status(500).json({ success: false, message });
  }
});

router.post('/post/:postId', protect, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { content, parentCommentId } = req.body;
    if (!content) return res.status(400).json({ success: false, message: 'Content required' });
    const comment = await Comment.create({
      postId: parseInt(req.params.postId as string),
      authorId: req.user!.id,
      content,
      parentCommentId: parentCommentId ? parseInt(parentCommentId as string) : null,
    });
    const result = await Comment.findByPk(comment.id, {
      include: [{ association: 'author', attributes: ['id', 'username', 'profilePicture', 'role'] }],
    });
    res.status(201).json({ success: true, data: result });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Server error';
    res.status(500).json({ success: false, message });
  }
});

router.put('/:id', protect, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const commentId = parseInt(req.params.id as string);
    const comment = await Comment.findByPk(commentId);
    if (!comment) return res.status(404).json({ success: false, message: 'Comment not found' });
    if (comment.authorId !== req.user!.id && req.user!.role !== 'admin')
      return res.status(403).json({ success: false, message: 'Not authorized' });
    await comment.update({ content: req.body.content, isEdited: true });
    res.json({ success: true, data: comment });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Server error';
    res.status(500).json({ success: false, message });
  }
});

router.delete('/:id', protect, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const commentId = parseInt(req.params.id as string);
    const comment = await Comment.findByPk(commentId);
    if (!comment) return res.status(404).json({ success: false, message: 'Comment not found' });
    if (comment.authorId !== req.user!.id && req.user!.role !== 'admin')
      return res.status(403).json({ success: false, message: 'Not authorized' });
    await Comment.destroy({ where: { parentCommentId: comment.id } });
    await comment.destroy();
    res.json({ success: true, message: 'Comment deleted' });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Server error';
    res.status(500).json({ success: false, message });
  }
});

router.post('/:id/like', protect, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const commentId = parseInt(req.params.id as string);
    const comment = await Comment.findByPk(commentId);
    if (!comment) return res.status(404).json({ success: false, message: 'Comment not found' });

    const c = comment as any;
    const liked = await c.countLikedByUsers({ where: { id: req.user!.id } });
    if (liked > 0) {
      await c.removeLikedByUsers(req.user!.id);
    } else {
      await c.addLikedByUsers(req.user!.id);
    }

    const likeCount = await c.countLikedByUsers();
    res.json({ success: true, liked: liked === 0, likeCount });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Server error';
    res.status(500).json({ success: false, message });
  }
});

export default router;
