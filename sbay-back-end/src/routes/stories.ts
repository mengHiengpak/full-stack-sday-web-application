import { Router, Response } from 'express';
import path from 'path';
import Story from '../models/Story';
import { protect } from '../middleware/auth';
import { uploadStory, isCloudinaryConfigured } from '../middleware/upload';
import { tryUploadToSupabase } from '../middleware/supabaseUpload';
import { AuthenticatedRequest } from '../types';
import { Op } from 'sequelize';

const fileUrl = (file: Express.Multer.File) =>
  isCloudinaryConfigured() ? file.path : `/uploads/${path.relative(path.join(__dirname, '../../uploads'), file.path).replace(/\\/g, '/')}`;

const router = Router();

router.get('/', protect, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const stories = await Story.findAll({
      where: { expiresAt: { [Op.gt]: new Date() } },
      include: [
        { association: 'author', attributes: ['id', 'username', 'profilePicture'] },
      ],
      order: [['createdAt', 'DESC']],
    });
    res.json({ success: true, data: stories });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Server error';
    res.status(500).json({ success: false, message });
  }
});

router.get('/:id', protect, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const story = await Story.findByPk(parseInt(req.params.id as string), {
      include: [
        { association: 'author', attributes: ['id', 'username', 'profilePicture'] },
      ],
    });
    if (!story) return res.status(404).json({ success: false, message: 'Story not found' });
    res.json({ success: true, data: story });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Server error';
    res.status(500).json({ success: false, message });
  }
});

router.put('/:id', protect, uploadStory.single('media'), async (req: AuthenticatedRequest, res: Response) => {
  try {
    const storyId = parseInt(req.params.id as string);
    const story = await Story.findByPk(storyId);
    if (!story) return res.status(404).json({ success: false, message: 'Story not found' });
    if (story.userId !== req.user!.id) return res.status(403).json({ success: false, message: 'Not authorized' });

    const updates: Record<string, unknown> = {};
    if (req.body.caption !== undefined) updates.caption = req.body.caption;
    if (req.file) {
      let mediaUrl = fileUrl(req.file);
      if (!isCloudinaryConfigured()) {
        const supabaseUrl = await tryUploadToSupabase(req.file.path, `stories/${req.file.filename}`);
        if (supabaseUrl) mediaUrl = supabaseUrl;
      }
      updates.mediaUrl = mediaUrl;
      updates.mediaType = req.file.mimetype.startsWith('video/') ? 'video' : 'image';
    }

    await story.update(updates);
    const updated = await Story.findByPk(storyId, {
      include: [
        { association: 'author', attributes: ['id', 'username', 'profilePicture'] },
      ],
    });
    res.json({ success: true, data: updated });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Server error';
    res.status(500).json({ success: false, message });
  }
});

router.post('/', protect, uploadStory.single('media'), async (req: AuthenticatedRequest, res: Response) => {
  try {
    if (!req.file) return res.status(400).json({ success: false, message: 'Media file is required' });

    let mediaUrl = fileUrl(req.file);
    if (!isCloudinaryConfigured()) {
      const supabaseUrl = await tryUploadToSupabase(req.file.path, `stories/${req.file.filename}`);
      if (supabaseUrl) mediaUrl = supabaseUrl;
    }
    const mediaType = req.file.mimetype.startsWith('video/') ? 'video' : 'image';
    const { caption } = req.body;
    const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000);

    const story = await Story.create({
      userId: req.user!.id,
      mediaUrl,
      mediaType,
      caption: caption || '',
      expiresAt,
    });

    res.status(201).json({ success: true, data: story });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Server error';
    res.status(500).json({ success: false, message });
  }
});

router.delete('/:id', protect, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const storyId = parseInt(req.params.id as string);
    const story = await Story.findByPk(storyId);
    if (!story) return res.status(404).json({ success: false, message: 'Story not found' });
    if (story.userId !== req.user!.id && req.user!.role !== 'admin')
      return res.status(403).json({ success: false, message: 'Not authorized' });

    await story.destroy();
    res.json({ success: true, message: 'Story deleted' });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Server error';
    res.status(500).json({ success: false, message });
  }
});

export default router;
