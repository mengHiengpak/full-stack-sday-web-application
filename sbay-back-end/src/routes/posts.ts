import { Router, Response } from 'express';
import path from 'path';
import sequelize from '../config/database';
import User from '../models/User';
import Post from '../models/Post';
import Comment from '../models/Comment';
import { protect, adminOnly } from '../middleware/auth';
import { uploadPost, cloudinary, isCloudinaryConfigured } from '../middleware/upload';
import { AuthenticatedRequest } from '../types';

const fileUrl = (file: Express.Multer.File) =>
  isCloudinaryConfigured() ? file.path : `/uploads/${path.relative(path.join(__dirname, '../../uploads'), file.path).replace(/\\/g, '/')}`;

const router = Router();

const safeUserId = (id: unknown): number => Number.isInteger(id) ? id as number : 0;

router.get('/', protect, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const offset = (page - 1) * limit;

    const { rows: posts, count: total } = await Post.findAndCountAll({
      where: { visibility: 'public' },
      include: [
        { association: 'author', attributes: ['id', 'username', 'profilePicture', 'role'] },
      ],
      attributes: {
        include: [
          [sequelize.literal(`(SELECT COUNT(*) FROM "Comments" WHERE "Comments"."postId" = "Post"."id")`), 'commentCount'],
          [sequelize.literal(`(SELECT COUNT(*) FROM "PostLikes" WHERE "PostLikes"."postId" = "Post"."id")`), 'likeCount'],
          [sequelize.literal(`EXISTS (SELECT 1 FROM "PostLikes" WHERE "PostLikes"."postId" = "Post"."id" AND "PostLikes"."userId" = ${safeUserId(req.user!.id)})`), 'likedByUser'],
        ],
      },
      order: [['createdAt', 'DESC']],
      offset,
      limit,
    });
    res.json({ success: true, data: posts, total, page, pages: Math.ceil(total / limit) });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Server error';
    res.status(500).json({ success: false, message });
  }
});

router.get('/explore', protect, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const offset = (page - 1) * limit;
    const { rows: posts, count: total } = await Post.findAndCountAll({
      where: { visibility: 'public' },
      include: [
        { association: 'author', attributes: ['id', 'username', 'profilePicture', 'role'] },
      ],
      attributes: {
        include: [
          [sequelize.literal(`(SELECT COUNT(*) FROM "Comments" WHERE "Comments"."postId" = "Post"."id")`), 'commentCount'],
          [sequelize.literal(`(SELECT COUNT(*) FROM "PostLikes" WHERE "PostLikes"."postId" = "Post"."id")`), 'likeCount'],
          [sequelize.literal(`EXISTS (SELECT 1 FROM "PostLikes" WHERE "PostLikes"."postId" = "Post"."id" AND "PostLikes"."userId" = ${safeUserId(req.user!.id)})`), 'likedByUser'],
        ],
      },
      order: [['createdAt', 'DESC']],
      offset,
      limit,
    });
    res.json({ success: true, data: posts, total, page, pages: Math.ceil(total / limit) });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Server error';
    res.status(500).json({ success: false, message });
  }
});

router.get('/admin/all', protect, adminOnly, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 20;
    const offset = (page - 1) * limit;
    const { rows: posts, count: total } = await Post.findAndCountAll({
      include: [
        { association: 'author', attributes: ['id', 'username', 'profilePicture'] },
      ],
      order: [['createdAt', 'DESC']],
      offset,
      limit,
    });
    res.json({ success: true, data: posts, total, page, pages: Math.ceil(total / limit) });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Server error';
    res.status(500).json({ success: false, message });
  }
});

router.get('/:id', protect, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const postId = parseInt(req.params.id as string);
    const post = await Post.findByPk(postId, {
      include: [
        { association: 'author', attributes: ['id', 'username', 'profilePicture', 'role', 'bio'] },
      ],
      attributes: {
        include: [
          [sequelize.literal(`(SELECT COUNT(*) FROM "Comments" WHERE "Comments"."postId" = "Post"."id")`), 'commentCount'],
          [sequelize.literal(`(SELECT COUNT(*) FROM "PostLikes" WHERE "PostLikes"."postId" = "Post"."id")`), 'likeCount'],
          [sequelize.literal(`EXISTS (SELECT 1 FROM "PostLikes" WHERE "PostLikes"."postId" = "Post"."id" AND "PostLikes"."userId" = ${safeUserId(req.user!.id)})`), 'likedByUser'],
        ],
      },
    });
    if (!post) return res.status(404).json({ success: false, message: 'Post not found' });
    res.json({ success: true, data: post });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Server error';
    res.status(500).json({ success: false, message });
  }
});

router.post('/', protect, uploadPost.single('media'), async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { title, content, visibility, tags } = req.body;
    if (!content && !req.file) return res.status(400).json({ success: false, message: 'Post needs content or media' });

    let mediaUrl = '';
    let mediaPublicId = '';
    let mediaType: 'image' | 'video' | 'none' = 'none';

    if (req.file) {
      mediaUrl = fileUrl(req.file);
      if (!isCloudinaryConfigured()) {
        mediaPublicId = req.file.filename;
      } else {
        mediaPublicId = (req.file as Express.Multer.File & { filename: string }).filename;
      }
      mediaType = (req.file as Express.Multer.File).mimetype.startsWith('video/') ? 'video' : 'image';
    }

    const post = await Post.create({
      authorId: req.user!.id,
      title: title || '',
      content: content || '',
      visibility: visibility || 'public',
      tags: tags ? (tags as string).split(',').map((t: string) => t.trim()) : [],
      mediaUrl,
      mediaPublicId,
      mediaType,
    });

    const result = await Post.findByPk(post.id, {
      include: [
        { association: 'author', attributes: ['id', 'username', 'profilePicture', 'role'] },
      ],
    });
    res.status(201).json({ success: true, data: result });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Server error';
    res.status(500).json({ success: false, message });
  }
});

router.put('/:id', protect, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const postId = parseInt(req.params.id as string);
    const post = await Post.findByPk(postId);
    if (!post) return res.status(404).json({ success: false, message: 'Post not found' });
    if (post.authorId !== req.user!.id && req.user!.role !== 'admin')
      return res.status(403).json({ success: false, message: 'Not authorized' });

    const { title, content, visibility, tags } = req.body;
    const history = (post.editHistory || []) as { title?: string; content?: string; editedAt: Date }[];
    history.push({ title: post.title, content: post.content, editedAt: new Date() });

    const updates: Partial<Record<string, unknown>> = { editHistory: history, isEdited: true };
    if (title !== undefined) updates.title = title;
    if (content !== undefined) updates.content = content;
    if (visibility) updates.visibility = visibility;
    if (tags !== undefined) updates.tags = typeof tags === 'string' ? tags.split(',').map((t: string) => t.trim()) : tags;

    await post.update(updates);
    const result = await Post.findByPk(post.id, {
      include: [
        { association: 'author', attributes: ['id', 'username', 'profilePicture', 'role'] },
      ],
    });
    res.json({ success: true, data: result });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Server error';
    res.status(500).json({ success: false, message });
  }
});

router.delete('/:id', protect, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const postId = parseInt(req.params.id as string);
    const post = await Post.findByPk(postId);
    if (!post) return res.status(404).json({ success: false, message: 'Post not found' });
    if (post.authorId !== req.user!.id && req.user!.role !== 'admin')
      return res.status(403).json({ success: false, message: 'Not authorized' });
    if (post.mediaPublicId && isCloudinaryConfigured()) {
      await cloudinary.uploader.destroy(post.mediaPublicId, { resource_type: post.mediaType === 'video' ? 'video' : 'image' });
    }
    await Comment.destroy({ where: { postId } });
    await post.destroy();
    res.json({ success: true, message: 'Post deleted' });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Server error';
    res.status(500).json({ success: false, message });
  }
});

router.post('/:id/like', protect, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const postId = parseInt(req.params.id as string);
    const post = await Post.findByPk(postId);
    if (!post) return res.status(404).json({ success: false, message: 'Post not found' });

    const p = post as any;
    const liked = await p.countLikedByUsers({ where: { id: req.user!.id } });
    if (liked > 0) {
      await p.removeLikedByUsers(req.user!.id);
    } else {
      await p.addLikedByUsers(req.user!.id);
    }

    const likeCount = await p.countLikedByUsers();
    res.json({ success: true, liked: liked === 0, likeCount });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Server error';
    res.status(500).json({ success: false, message });
  }
});

router.post('/:id/share', protect, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const postId = parseInt(req.params.id as string);
    const post = await Post.findByPk(postId);
    if (!post) return res.status(404).json({ success: false, message: 'Post not found' });

    const p = post as any;
    const shared = await p.countSharedByUsers({ where: { id: req.user!.id } });
    if (shared === 0) {
      await p.addSharedByUsers(req.user!.id);
      await post.increment('shareCount');
    }

    const shareCount = await p.countSharedByUsers();
    res.json({ success: true, shareCount });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Server error';
    res.status(500).json({ success: false, message });
  }
});

export default router;
