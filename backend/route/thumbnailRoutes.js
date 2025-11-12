import express from "express";
import multer from "multer";
import path from "path";
import fs from "fs/promises";
import { thumbnailCreate,youtubeanalyis,summary } from "../controller/thumbnailController.js";


const router = express.Router();

const storage = multer.diskStorage({
  destination: async (req, file, cb) => {
    const uploadDir = path.join(process.cwd(), 'public', 'uploads', 'images');
    await fs.mkdir(uploadDir, { recursive: true });
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const ext = path.extname(file.originalname);
    cb(null, `image-${uniqueSuffix}${ext}`);
  }
});

const fileFilter = (req, file, cb) => {
  const allowedTypes = /jpeg|jpg|png|gif|webp/;
  const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
  
  const mimetype = file.mimetype.startsWith('image/');

  if (mimetype && extname) {
    cb(null, true);
  } else {
   
    cb(new Error('Only image files are allowed (jpeg, jpg, png, gif, webp)'), false);
  }
};


const upload = multer({
  storage: storage,
  limits: {
    fileSize: 10 * 1024 * 1024 //10mb
  },
  fileFilter: fileFilter
});


router.post('/create', upload.single('image'), thumbnailCreate);
router.post('/youtube/analyze', youtubeanalyis);
router.post('/youtube/summary', summary);



export default router;
