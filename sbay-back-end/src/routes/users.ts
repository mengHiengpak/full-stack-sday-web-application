import { Router, Response } from 'express';
import path from 'path';
import fs from 'fs';
import { Op } from 'sequelize';
import sequelize from '../config/database';
import User from '../models/User';
import Post from '../models/Post';
import Comment from '../models/Comment';
import Story from '../models/Story';
import ChatMessage from '../models/ChatMessage';
import Chat from '../models/Chat';
import FriendRequest from '../models/FriendRequest';
import Reaction from '../models/Reaction';
import StoryComment from '../models/StoryComment';
import { protect, adminOnly } from '../middleware/auth';
import { uploadAvatar, uploadCover, cloudinary, isCloudinaryConfigured } from '../middleware/upload';
import { tryUploadToSupabase } from '../middleware/supabaseUpload';
import { AuthenticatedRequest } from '../types';

const fileUrl = (file: Express.Multer.File) =>
  isCloudinaryConfigured() ? file.path : `/uploads/${path.relative(path.join(__dirname, '../../uploads'), file.path).replace(/\\/g, '/')}`;

const router = Router();

router.get('/', protect, adminOnly, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 20;
    const offset = (page - 1) * limit;
    const { rows: users, count: total } = await User.findAndCountAll({
      attributes: { exclude: ['password'] },
      offset,
      limit,
      order: [['createdAt', 'DESC']],
    });
    res.json({ success: true, data: users, total, page, pages: Math.ceil(total / limit) });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Server error';
    res.status(500).json({ success: false, message });
  }
});

router.get('/suggested', protect, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const limit = parseInt(req.query.limit as string) || 5;
    const users = await User.findAll({
      where: { id: { [Op.ne]: req.user!.id } },
      attributes: ['id', 'username', 'profilePicture', 'bio'],
      order: sequelize.random(),
      limit,
    });

    const now = Date.now();
    const friends = await FriendRequest.findAll({
      where: {
        [Op.or]: [
          { senderId: req.user!.id },
          { receiverId: req.user!.id },
        ],
        status: { [Op.in]: ['pending', 'accepted'] },
      },
    });

    const friendMap: Record<number, string> = {};
    for (const fr of friends) {
      const otherId = fr.senderId === req.user!.id ? fr.receiverId : fr.senderId;
      if (fr.status === 'accepted') friendMap[otherId] = 'friends';
      else if (fr.status === 'pending' && !friendMap[otherId]) {
        friendMap[otherId] = fr.senderId === req.user!.id ? 'sent' : 'received';
      }
    }

    const data = users.map(u => {
      const json = u.toJSON() as unknown as Record<string, unknown>;
      json.friendStatus = friendMap[u.id] || 'none';
      return json;
    });

    res.json({ success: true, data });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Server error';
    res.status(500).json({ success: false, message });
  }
});

router.get('/search', protect, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const q = req.query.q as string;
    const users = await User.findAll({
      where: {
        [Op.or]: [
          { username: { [Op.iLike]: `%${q}%` } },
          { email: { [Op.iLike]: `%${q}%` } },
        ],
      },
      attributes: ['id', 'username', 'profilePicture', 'bio'],
      limit: 10,
    });
    res.json({ success: true, data: users });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Server error';
    res.status(500).json({ success: false, message });
  }
});

router.get('/:id', protect, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const userId = parseInt(req.params.id as string);
    const user = await User.findByPk(userId, {
      attributes: {
        exclude: ['password'],
        include: [
          [sequelize.literal(`(SELECT COUNT(*) FROM "Posts" WHERE "Posts"."authorId" = "User"."id" AND "Posts"."visibility" = 'public')`), 'postCount'],
          [sequelize.literal(`(SELECT COUNT(*) FROM "FriendRequests" WHERE ("FriendRequests"."senderId" = "User"."id" OR "FriendRequests"."receiverId" = "User"."id") AND "FriendRequests"."status" = 'accepted')`), 'friendsCount'],
        ],
      },
      include: [
        { association: 'followers', attributes: ['id', 'username', 'profilePicture'] },
        { association: 'following', attributes: ['id', 'username', 'profilePicture'] },
      ],
    });
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });

    if (user.profilePicture && !user.profilePicture.startsWith('http')) {
      const localPath = path.join(__dirname, '../../uploads', user.profilePicture.replace('/uploads/', ''));
      try { if (!fs.existsSync(localPath)) { await user.update({ profilePicture: '' }); user.profilePicture = ''; } } catch {}
    }
    if (user.coverPhoto && !user.coverPhoto.startsWith('http')) {
      const localPath = path.join(__dirname, '../../uploads', user.coverPhoto.replace('/uploads/', ''));
      try { if (!fs.existsSync(localPath)) { await user.update({ coverPhoto: '' }); user.coverPhoto = ''; } } catch {}
    }

    let friendStatus = 'none';
    let friendRequestId = null;
    if (userId === req.user!.id) {
      friendStatus = 'self';
    } else {
      const [sentRequest, receivedRequest] = await Promise.all([
        FriendRequest.findOne({
          where: { senderId: req.user!.id, receiverId: userId },
          order: [['createdAt', 'DESC']],
        }),
        FriendRequest.findOne({
          where: { senderId: userId, receiverId: req.user!.id },
          order: [['createdAt', 'DESC']],
        }),
      ]);

      if (sentRequest?.status === 'accepted' || receivedRequest?.status === 'accepted') {
        friendStatus = 'friends';
        friendRequestId = (sentRequest?.status === 'accepted' ? sentRequest : receivedRequest)?.id;
      } else if (sentRequest?.status === 'pending') {
        friendStatus = 'sent';
        friendRequestId = sentRequest.id;
      } else if (receivedRequest?.status === 'pending') {
        friendStatus = 'received';
        friendRequestId = receivedRequest.id;
      }
    }

    const data = user.toJSON() as unknown as Record<string, unknown>;
    data.friendStatus = friendStatus;
    data.friendRequestId = friendRequestId;
    res.json({ success: true, data });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Server error';
    res.status(500).json({ success: false, message });
  }
});

router.get('/:id/posts', protect, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const userId = parseInt(req.params.id as string);
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const offset = (page - 1) * limit;
    const { rows: posts, count: total } = await Post.findAndCountAll({
      where: { authorId: userId, visibility: 'public' },
      include: [
        { association: 'author', attributes: ['id', 'username', 'profilePicture', 'role'] },
      ],
      attributes: {
        include: [
          [sequelize.literal(`(SELECT COUNT(*) FROM "Comments" WHERE "Comments"."postId" = "Post"."id")`), 'commentCount'],
          [sequelize.literal(`(SELECT COUNT(*) FROM "PostLikes" WHERE "PostLikes"."postId" = "Post"."id")`), 'likeCount'],
          [sequelize.literal(`EXISTS (SELECT 1 FROM "PostLikes" WHERE "PostLikes"."postId" = "Post"."id" AND "PostLikes"."userId" = ${Number.isInteger(req.user!.id) ? req.user!.id : 0})`), 'likedByUser'],
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

router.put('/profile/update', protect, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { bio, website, location, username } = req.body;
    const updates: Record<string, unknown> = {};
    if (bio !== undefined) updates.bio = bio;
    if (website !== undefined) updates.website = website;
    if (location !== undefined) updates.location = location;
    if (username) {
      const taken = await User.findOne({ where: { username, id: { [Op.ne]: req.user!.id } } });
      if (taken) return res.status(409).json({ success: false, message: 'Username taken' });
      updates.username = username;
    }
    await req.user!.update(updates);
    const user = await User.findByPk(req.user!.id, { attributes: { exclude: ['password'] } });
    res.json({ success: true, data: user });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Server error';
    res.status(500).json({ success: false, message });
  }
});

router.put('/profile/avatar', protect, uploadAvatar.single('avatar'), async (req: AuthenticatedRequest, res: Response) => {
  try {
    if (!req.file) return res.status(400).json({ success: false, message: 'No file uploaded' });
    let url = fileUrl(req.file);
    if (!isCloudinaryConfigured()) {
      const supabaseUrl = await tryUploadToSupabase(req.file.path, `avatars/${req.file.filename}`);
      if (supabaseUrl) url = supabaseUrl;
    }
    await req.user!.update({ profilePicture: url });
    const user = await User.findByPk(req.user!.id, { attributes: { exclude: ['password'] } });
    res.json({ success: true, data: user });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Server error';
    res.status(500).json({ success: false, message });
  }
});

router.put('/profile/cover', protect, uploadCover.single('cover'), async (req: AuthenticatedRequest, res: Response) => {
  try {
    if (!req.file) return res.status(400).json({ success: false, message: 'No file uploaded' });
    let url = fileUrl(req.file);
    if (!isCloudinaryConfigured()) {
      const supabaseUrl = await tryUploadToSupabase(req.file.path, `covers/${req.file.filename}`);
      if (supabaseUrl) url = supabaseUrl;
    }
    await req.user!.update({ coverPhoto: url });
    const user = await User.findByPk(req.user!.id, { attributes: { exclude: ['password'] } });
    res.json({ success: true, data: user });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Server error';
    res.status(500).json({ success: false, message });
  }
});

router.post('/:id/follow', protect, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const targetId = parseInt(req.params.id as string);
    if (targetId === req.user!.id)
      return res.status(400).json({ success: false, message: 'Cannot follow yourself' });

    const targetUser = await User.findByPk(targetId);
    if (!targetUser) return res.status(404).json({ success: false, message: 'User not found' });

    const t = targetUser as any;
    const followers = await t.countFollowers({ where: { id: req.user!.id } });
    if (followers > 0) {
      await t.removeFollowers(req.user!.id);
      return res.json({ success: true, message: 'Unfollowed', following: false });
    } else {
      await t.addFollowers(req.user!.id);
      return res.json({ success: true, message: 'Followed', following: true });
    }
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Server error';
    res.status(500).json({ success: false, message });
  }
});

router.delete('/:id', protect, adminOnly, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const userId = parseInt(req.params.id as string);
    await ChatMessage.destroy({ where: { senderId: userId } });
    await Story.destroy({ where: { userId } });
    await StoryComment.destroy({ where: { authorId: userId } });
    await Comment.destroy({ where: { authorId: userId } });
    await Reaction.destroy({ where: { userId } });
    await FriendRequest.destroy({ where: { [Op.or]: [{ senderId: userId }, { receiverId: userId }] } });
    await Post.destroy({ where: { authorId: userId } });
    await sequelize.query('DELETE FROM "ChatParticipants" WHERE "userId" = ?', { replacements: [userId] });
    await sequelize.query('DELETE FROM "UserFollows" WHERE "followerId" = ? OR "followingId" = ?', { replacements: [userId, userId] });
    await sequelize.query('DELETE FROM "PostLikes" WHERE "userId" = ?', { replacements: [userId] });
    await sequelize.query('DELETE FROM "PostShares" WHERE "userId" = ?', { replacements: [userId] });
    await sequelize.query('DELETE FROM "CommentLikes" WHERE "userId" = ?', { replacements: [userId] });
    await User.destroy({ where: { id: userId } });
    res.json({ success: true, message: 'User and all related data deleted' });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Server error';
    res.status(500).json({ success: false, message });
  }
});

export default router;
