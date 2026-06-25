import { Router, Response } from 'express';
import jwt from 'jsonwebtoken';
import path from 'path';
import fs from 'fs';
import User from '../models/User';
import { protect } from '../middleware/auth';
import { AuthenticatedRequest } from '../types';
import { Op, ValidationError, UniqueConstraintError } from 'sequelize';

const router = Router();

const JWT_SECRET = process.env.JWT_SECRET || 'fallback_dev_secret_do_not_use_in_production';
const signToken = (id: number) => jwt.sign({ id: id.toString() }, JWT_SECRET, { expiresIn: process.env.JWT_EXPIRE } as jwt.SignOptions);

router.post('/register', async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { username, email, password } = req.body;
    if (!username || !email || !password)
      return res.status(400).json({ success: false, message: 'All fields are required' });

    const existingUser = await User.findOne({ where: { [Op.or]: [{ username }, { email }] } });
    if (existingUser) {
      if (existingUser.username === username)
        return res.status(409).json({ success: false, message: 'Username already taken' });
      return res.status(409).json({ success: false, message: 'Email already registered' });
    }

    const user = await User.create({ username, email, password });
    const token = signToken(user.id);
    const data = user.toJSON();
    delete (data as unknown as Record<string, unknown>).password;
    res.status(201).json({ success: true, token, data });
  } catch (err: unknown) {
    if (err instanceof ValidationError) {
      return res.status(400).json({ success: false, message: err.errors.map(e => e.message).join(', ') });
    }
    if (err instanceof UniqueConstraintError) {
      return res.status(409).json({ success: false, message: 'Username or email already registered' });
    }
    const message = err instanceof Error ? err.message : 'Server error';
    res.status(500).json({ success: false, message });
  }
});

router.post('/login', async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { email, password } = req.body;
    if (!email || !password)
      return res.status(400).json({ success: false, message: 'Email/username and password required' });

    const user = await User.unscoped().findOne({
      where: {
        [Op.or]: [
          { email: email.toLowerCase() },
          { username: email },
        ],
      },
    });
    if (!user || !(await user.matchPassword(password)))
      return res.status(401).json({ success: false, message: 'Invalid credentials' });

    const token = signToken(user.id);
    const data = user.toJSON();
    delete (data as unknown as Record<string, unknown>).password;
    if (data.profilePicture && !data.profilePicture.startsWith('http')) {
      const localPath = path.join(__dirname, '../../uploads', data.profilePicture.replace('/uploads/', ''));
      try { if (!fs.existsSync(localPath)) { await user.update({ profilePicture: '' }); data.profilePicture = ''; } } catch {}
    }
    if (data.coverPhoto && !data.coverPhoto.startsWith('http')) {
      const localPath = path.join(__dirname, '../../uploads', data.coverPhoto.replace('/uploads/', ''));
      try { if (!fs.existsSync(localPath)) { await user.update({ coverPhoto: '' }); data.coverPhoto = ''; } } catch {}
    }
    res.json({ success: true, token, data });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Server error';
    res.status(500).json({ success: false, message });
  }
});

router.get('/me', protect, async (req: AuthenticatedRequest, res: Response) => {
  const user = await User.findByPk(req.user!.id, {
    attributes: { exclude: ['password'] },
    include: [
      { association: 'followers', attributes: ['id', 'username', 'profilePicture'] },
      { association: 'following', attributes: ['id', 'username', 'profilePicture'] },
    ],
  });
  if (user) {
    if (user.profilePicture && !user.profilePicture.startsWith('http')) {
      const localPath = path.join(__dirname, '../../uploads', user.profilePicture.replace('/uploads/', ''));
      try { if (!fs.existsSync(localPath)) { await user.update({ profilePicture: '' }); user.profilePicture = ''; } } catch {}
    }
    if (user.coverPhoto && !user.coverPhoto.startsWith('http')) {
      const localPath = path.join(__dirname, '../../uploads', user.coverPhoto.replace('/uploads/', ''));
      try { if (!fs.existsSync(localPath)) { await user.update({ coverPhoto: '' }); user.coverPhoto = ''; } } catch {}
    }
  }
  res.json({ success: true, data: user });
});

router.post('/logout', protect, (req: AuthenticatedRequest, res: Response) => {
  res.json({ success: true, message: 'Logged out successfully' });
});

export default router;
