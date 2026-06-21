import cloudinaryLib from 'cloudinary';
import multer from 'multer';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import { Request } from 'express';
import path from 'path';
import fs from 'fs';

const cloudinary = cloudinaryLib.v2;

const isCloudinaryConfigured = (): boolean =>
  !!(
    process.env.CLOUDINARY_CLOUD_NAME &&
    process.env.CLOUDINARY_CLOUD_NAME !== 'your_cloudinary_cloud_name' &&
    process.env.CLOUDINARY_API_KEY &&
    process.env.CLOUDINARY_API_KEY !== 'your_cloudinary_api_key' &&
    process.env.CLOUDINARY_API_SECRET &&
    process.env.CLOUDINARY_API_SECRET !== 'your_cloudinary_api_secret'
  );

if (isCloudinaryConfigured()) {
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
  });
}

const uploadsDir = path.join(__dirname, '../../uploads');
if (!isCloudinaryConfigured()) {
  fs.mkdirSync(uploadsDir, { recursive: true });
  fs.mkdirSync(path.join(uploadsDir, 'posts'), { recursive: true });
  fs.mkdirSync(path.join(uploadsDir, 'avatars'), { recursive: true });
  fs.mkdirSync(path.join(uploadsDir, 'covers'), { recursive: true });
  fs.mkdirSync(path.join(uploadsDir, 'chat'), { recursive: true });
}

const localStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    let folder = 'posts';
    if (file.fieldname === 'avatar') folder = 'avatars';
    if (file.fieldname === 'cover') folder = 'covers';
    cb(null, path.join(uploadsDir, folder));
  },
  filename: (req, file, cb) => {
    const unique = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, unique + path.extname(file.originalname));
  },
});

let uploadPost: multer.Multer;
let uploadAvatar: multer.Multer;
let uploadCover: multer.Multer;
let uploadChat: multer.Multer;
let uploadStory: multer.Multer;

if (isCloudinaryConfigured()) {
  const postStorage = new CloudinaryStorage({
    cloudinary,
    params: async (req: Request, file: Express.Multer.File) => {
      const isVideo = file.mimetype.startsWith('video/');
      return {
        folder: 'sbay/posts',
        resource_type: isVideo ? ('video' as const) : ('image' as const),
        allowed_formats: ['jpg', 'jpeg', 'png', 'gif', 'webp', 'mp4', 'mov', 'avi', 'mkv'],
      } as any;
    },
  });

  const avatarStorage = new CloudinaryStorage({
    cloudinary,
    params: { folder: 'sbay/avatars', resource_type: 'image', allowed_formats: ['jpg', 'jpeg', 'png', 'webp'] } as any,
  });

  const coverStorage = new CloudinaryStorage({
    cloudinary,
    params: { folder: 'sbay/covers', resource_type: 'image', allowed_formats: ['jpg', 'jpeg', 'png', 'webp'] } as any,
  });

  const chatStorage = new CloudinaryStorage({
    cloudinary,
    params: { folder: 'sbay/chat', resource_type: 'auto', allowed_formats: ['jpg', 'jpeg', 'png', 'gif', 'webp', 'mp4', 'mov'] } as any,
  });

  uploadPost = multer({ storage: postStorage });
  uploadAvatar = multer({ storage: avatarStorage });
  uploadCover = multer({ storage: coverStorage });
  uploadChat = multer({ storage: chatStorage });
  uploadStory = multer({ storage: postStorage });
} else {
  uploadPost = multer({
    storage: localStorage,
    limits: { fileSize: 50 * 1024 * 1024 },
  });
  uploadAvatar = multer({
    storage: localStorage,
    limits: { fileSize: 5 * 1024 * 1024 },
  });
  uploadCover = multer({
    storage: localStorage,
    limits: { fileSize: 10 * 1024 * 1024 },
  });
  uploadChat = multer({
    storage: multer.diskStorage({
      destination: (req, file, cb) => cb(null, path.join(uploadsDir, 'chat')),
      filename: (req, file, cb) => {
        const unique = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, unique + path.extname(file.originalname));
      },
    }),
    limits: { fileSize: 50 * 1024 * 1024 },
  });
  uploadStory = multer({
    storage: multer.diskStorage({
      destination: (req, file, cb) => cb(null, path.join(uploadsDir, 'posts')),
      filename: (req, file, cb) => {
        const unique = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, unique + path.extname(file.originalname));
      },
    }),
    limits: { fileSize: 50 * 1024 * 1024 },
  });
}

export { uploadPost, uploadAvatar, uploadCover, uploadChat, uploadStory, cloudinary, isCloudinaryConfigured };
