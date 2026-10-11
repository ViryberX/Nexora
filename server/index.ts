import express from 'express';
import path from 'path';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';

import { errorHandler } from './middleware/error.js';
import { apiLimiter } from './middleware/rateLimit.js';

import researchRoutes from './routes/research.js';
import adminRoutes from './routes/admin.js';

dotenv.config();

const app = express();

// Security and Middleware
app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(apiLimiter); // Apply rate limiting to all requests

// Routes
app.use('/api/research', researchRoutes);
app.use('/research', researchRoutes); // Fallback if Vercel strips /api
app.use('/api/admin', adminRoutes);
app.use('/admin', adminRoutes); // Fallback if Vercel strips /api

// Global Error Handler
app.use(errorHandler);

// Serve static frontend files in production (Render or standalone Node server; Vercel handles static files via CDN)
if (!process.env.VERCEL && (process.env.NODE_ENV === 'production' || process.env.RENDER)) {
  const distPath = path.join(process.cwd(), 'dist');
  app.use(express.static(distPath));
  app.get('{*splat}', (req, res) => {
    res.sendFile(path.join(distPath, 'index.html'));
  });
}

// Serverless export
if (process.env.NODE_ENV !== 'production') {
  const PORT = process.env.PORT || 3001;
  app.listen(PORT, () => {
    console.log(`API Server running on port ${PORT}`);
  });
}

export default app;
