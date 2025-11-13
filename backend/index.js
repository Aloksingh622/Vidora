import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import connectDb from './config/connectDb.js';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import authRouter from './route/authRoute.js';
import userRouter from './route/userRoute.js';
import contentRouter from './route/contentRoute.js';
import thumbnailRoutes from "./route/thumbnailRoutes.js";
import { fileURLToPath } from 'url';
import path from 'path';
import fs from 'fs';
import cron from 'node-cron';

// __filename / __dirname for ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// --- Basic Middlewares ---
app.use(cookieParser());
app.use(express.json());

// Put this very early to ensure headers exist even for errors
app.use((req, res, next) => {
  // exact origin when credentials:true
  res.setHeader('Access-Control-Allow-Origin', 'https://vidora-urkl.vercel.app');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type,Authorization');
  // if you use cookies:
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  next();
});

// Use cors middleware too (helps with preflight handling)
app.use(cors({
  origin: 'https://vidora-urkl.vercel.app',
  credentials: true,
}));

// Handle preflight for all routes
app.options('*', cors({
  origin: 'https://vidora-urkl.vercel.app',
  credentials: true
}));

// Static files
app.use(express.static(path.join(__dirname, 'public')));

// Thumbnail cleanup cron
const thumbnailDir = path.join(__dirname, 'public', 'uploads', 'images');
cron.schedule('0 * * * *', () => {
  console.log('Running hourly cleanup task for old thumbnails...');
  try {
    const maxAgeHours = 1;
    const now = Date.now();
    const cutoff = now - maxAgeHours * 60 * 60 * 1000;

    if (!fs.existsSync(thumbnailDir)) {
      console.log(`Thumbnail directory ${thumbnailDir} does not exist. Skipping cleanup.`);
      return;
    }

    fs.readdir(thumbnailDir, (err, files) => {
      if (err) {
        console.error("Error reading thumbnail directory:", err);
        return;
      }
      if (!files || files.length === 0) {
        console.log("No files found in thumbnail directory. Skipping cleanup.");
        return;
      }
      files.forEach(file => {
        const filePath = path.join(thumbnailDir, file);
        fs.stat(filePath, (statErr, stats) => {
          if (statErr) {
            if (statErr.code === 'ENOENT') {
              console.log(`File ${file} not found, likely already processed.`);
            } else {
              console.error(`Error getting stats for ${file}:`, statErr);
            }
            return;
          }
          if (stats.mtimeMs < cutoff) {
            fs.unlink(filePath, (unlinkErr) => {
              if (unlinkErr) {
                if (unlinkErr.code === 'ENOENT') {
                  console.log(`Attempted to delete ${file}, but it was already gone.`);
                } else {
                  console.error(`Error deleting ${file}:`, unlinkErr);
                }
              } else {
                console.log(`Deleted old thumbnail: ${file}`);
              }
            });
          }
        });
      });
    });
  } catch (e) {
    console.error('Cron cleanup error:', e);
  }
});

// Routes
app.use("/api/auth", authRouter);
app.use("/api/user", userRouter);
app.use("/api/content", contentRouter);
app.use('/api/thumbnail', thumbnailRoutes);

// Central error handler (ensures CORS headers remain on error)
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err);
  // Ensure CORS headers exist here also (defensive)
  res.setHeader('Access-Control-Allow-Origin', 'https://vidora-urkl.vercel.app');
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  if (res.headersSent) {
    return next(err);
  }
  res.status(err.status || 500).json({ error: err.message || 'Internal Server Error' });
});

// Start server only after DB connect (safer)
const start = async () => {
  const port = process.env.PORT || 3000;
  try {
    await connectDb(); // if this throws, we won't start the server and logs will show the reason
    app.listen(port, () => {
      console.log(`Server started on port ${port}`);
    });
  } catch (err) {
    console.error('Failed to start server due to DB/connect error:', err);
    process.exit(1); // crash early so logs show the reason
  }
};

start();
