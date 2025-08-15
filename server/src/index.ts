import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import path from 'path';
import fs from 'fs';
import { prisma } from './lib/prisma';
import authRoutes from './routes/auth';
import postsRoutes from './routes/posts';
import commentsRoutes from './routes/comments';
import uploadRoutes from './routes/upload';

const app = express();
const PORT = process.env.PORT || 4000;

const uploadsDir = path.join(__dirname, '../uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use('/uploads', express.static(uploadsDir));

app.use('/api/auth', authRoutes);
app.use('/api/posts', postsRoutes);
app.use('/api/comments', commentsRoutes);
app.use('/api/upload', uploadRoutes);

app.get('/', (req, res) => {
  res.json({ 
    message: 'Blogged API is running!',
    timestamp: new Date().toISOString()
  });
});

app.get('/health', (req, res) => {
  res.json({ 
    status: 'OK',
    uptime: process.uptime(),
    timestamp: new Date().toISOString()
  });
});

app.listen(PORT, () => {
  console.log(`🚀 Server is running on port ${PORT}`);
  console.log(`📡 Health check available at http://localhost:${PORT}/health`);
  console.log(`🌐 API available at http://localhost:${PORT}`);
  console.log(`🔐 Auth API available at http://localhost:${PORT}/api/auth`);
  console.log(`📝 Blog API available at http://localhost:${PORT}/api/posts`);
  console.log(`📁 Uploads available at http://localhost:${PORT}/uploads`);
});

export default app;
