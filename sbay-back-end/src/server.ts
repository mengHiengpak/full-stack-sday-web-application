import 'dotenv/config';
import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import path from 'path';
import http from 'http';
import sequelize from './config/database';
import './models/associations';
import './models/Story';
import User from './models/User';

import authRoutes from './routes/auth';
import userRoutes from './routes/users';
import postRoutes from './routes/posts';
import commentRoutes from './routes/comments';
import storyRoutes from './routes/stories';
import chatRoutes from './routes/chat';
import friendRoutes from './routes/friends';
import reactionRoutes from './routes/reactions';
import storyCommentRoutes from './routes/storyComments';
import { isCloudinaryConfigured } from './middleware/upload';
import { initSocket } from './socket';
import { securityHeaders, generalLimiter, authLimiter, xssSanitize } from './middleware/security';

console.log('🚀 Sbay backend starting...');
console.log(`   NODE_ENV=${process.env.NODE_ENV}, PORT=${process.env.PORT}`);
const missingEnvVars = ['DATABASE_URL', 'JWT_SECRET'].filter(v => !process.env[v]);
if (missingEnvVars.length > 0) {
  console.error(`❌ Missing environment variables: ${missingEnvVars.join(', ')}`);
  console.error('   Set them in Render Dashboard > Environment Variables');
}
if (!process.env.JWT_EXPIRE) {
  console.warn('⚠️  JWT_EXPIRE not set, defaulting to 7d');
  process.env.JWT_EXPIRE = '7d';
}

const app = express();
app.set('trust proxy', 1);
const server = http.createServer(app);

const allowedOrigins = (process.env.CLIENT_URL || 'http://localhost:3000').split(',').map(s => s.trim());
app.use(cors({
  origin: (origin, cb) => {
    if (process.env.NODE_ENV === 'production' || !origin) return cb(null, true);
    cb(null, allowedOrigins.includes(origin) || allowedOrigins.includes('*'));
  },
  credentials: true,
}));
app.use(securityHeaders);
app.use(generalLimiter);
app.use(xssSanitize);
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

if (!isCloudinaryConfigured()) {
  app.use('/uploads', express.static(path.join(__dirname, '../uploads')));
}

const startServer = async () => {
  try {
    await sequelize.authenticate();
    console.log('✅ PostgreSQL Connected');

    await sequelize.sync({ alter: true });
    console.log('✅ Database synced');

    const [admin] = await User.findOrCreate({
      where: { email: 'admin@sbay.com' },
      defaults: { username: 'admin', email: 'admin@sbay.com', password: 'admin123456', role: 'admin' as const },
    });
    if (admin) console.log('✅ Seed: admin@sbay.com / admin123456');

    app.listen(PORT, () => console.log(`🚀 Sbay Server running on port ${PORT}`));
  } catch (err) {
    console.error('❌ Startup Error:', err);
    process.exit(1);
  }
};

app.use('/api/auth', authLimiter, authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/posts', postRoutes);
app.use('/api/comments', commentRoutes);
app.use('/api/stories', storyRoutes);
app.use('/api/chat', chatRoutes);
app.use('/api/friends', friendRoutes);
app.use('/api/reactions', reactionRoutes);
app.use('/api/story-comments', storyCommentRoutes);

initSocket(server);

const envStatus = (key: string) => process.env[key] ? '✅ set' : '❌ missing';
app.get('/', (req: Request, res: Response) => res.json({
  message: 'Sbay Social Media API Running 🔴',
  env: {
    DATABASE_URL: envStatus('DATABASE_URL'),
    JWT_SECRET: envStatus('JWT_SECRET'),
    SUPABASE_URL: envStatus('SUPABASE_URL'),
    SUPABASE_KEY: envStatus('SUPABASE_KEY'),
    PORT: process.env.PORT,
    NODE_ENV: process.env.NODE_ENV,
  },
}));

app.get('/api/health', (req: Request, res: Response) => {
  res.json({
    status: 'ok',
    uptime: process.uptime(),
    env: {
      DATABASE_URL: envStatus('DATABASE_URL'),
      JWT_SECRET: envStatus('JWT_SECRET'),
      SUPABASE_URL: envStatus('SUPABASE_URL'),
      SUPABASE_KEY: envStatus('SUPABASE_KEY'),
      PORT: process.env.PORT,
      NODE_ENV: process.env.NODE_ENV,
    },
  });
});

app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error(err.stack);
  res.status(500).json({ success: false, message: err.message || 'Server Error' });
});

const PORT = process.env.PORT || 5000;

startServer();

process.on('SIGTERM', () => {
  console.log('SIGTERM received, shutting down...');
  server.close(() => process.exit(0));
});
process.on('SIGINT', () => {
  console.log('SIGINT received, shutting down...');
  server.close(() => process.exit(0));
});
