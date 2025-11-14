import dotenv from 'dotenv'
dotenv.config()
import express from 'express'
import connectDb from './config/connectDb.js'
import cookieParser from 'cookie-parser'
import cors from 'cors'
import authRouter from './route/authRoute.js'
import userRouter from './route/userRoute.js'
import contentRouter from './route/contentRoute.js'
import thumbnailRoutes from "./route/thumbnailRoutes.js";
import { fileURLToPath } from 'url'
import cron from 'node-cron'
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
import path from "path";
import fs from 'fs';


const port = process.env.PORT
console.log(process.env.PORT)


const app = express()
app.use(cookieParser())
app.use(express.json())
app.use(cors({ 
   origin:"https://vidora-urkl.vercel.app",
   credentials:true
}))

app.use(express.static(path.join(__dirname, 'public')));

const thumbnailDir = path.join(__dirname, 'public', 'uploads', 'images');
cron.schedule('0 * * * *', () => {
    console.log('Running minute cleanup task for old thumbnails...');
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

        if (files.length === 0) {
            console.log("No files found in thumbnail directory. Skipping cleanup.");
            return;
        }

        console.log(`Found ${files.length} files. Checking modification times...`);

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
                    console.log(`File ${file} is older than ${maxAgeHours} minute(s). Deleting...`);
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
                } else {
                }
            });
        });
    })
  })

app.use("/api/auth",authRouter)
app.use("/api/user",userRouter)
app.use("/api/content",contentRouter)
app.use('/api/thumbnail', thumbnailRoutes);






app.listen(port , ()=>{
    console.log("Server Started")
    connectDb()
})