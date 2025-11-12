const ffmpeg = require('fluent-ffmpeg');
const ffmpegStatic = require('ffmpeg-static');
const path = require('path');
const fs = require('fs').promises;

ffmpeg.setFfmpegPath(ffmpegStatic);

class VideoService {
  // Extract frames from video
  async extractFrames(videoPath, count = 10) {
    const outputDir = path.join(__dirname, '../temp/frames');
    await fs.mkdir(outputDir, { recursive: true });

    return new Promise((resolve, reject) => {
      ffmpeg(videoPath)
        .on('end', async () => {
          const files = await fs.readdir(outputDir);
          const frames = [];
          
          for (const file of files.slice(0, count)) {
            const framePath = path.join(outputDir, file);
            const frameBuffer = await fs.readFile(framePath);
            frames.push(frameBuffer);
          }
          
          resolve(frames);
        })
        .on('error', reject)
        .screenshots({
          count: count,
          folder: outputDir,
          filename: 'frame-%i.jpg'
        });
    });
  }

  // Extract short clip
  async extractClip(videoPath, startTime, endTime, outputPath) {
    return new Promise((resolve, reject) => {
      ffmpeg(videoPath)
        .setStartTime(startTime)
        .setDuration(endTime - startTime)
        .output(outputPath)
        .videoCodec('libx264')
        .audioCodec('aac')
        .on('end', () => resolve(outputPath))
        .on('error', reject)
        .run();
    });
  }

  // Get video metadata
  async getVideoMetadata(videoPath) {
    return new Promise((resolve, reject) => {
      ffmpeg.ffprobe(videoPath, (err, metadata) => {
        if (err) reject(err);
        else resolve(metadata);
      });
    });
  }

  // Add captions to video
  async addCaptions(videoPath, captionsText, outputPath) {
    // Generate SRT file
    const srtPath = await this.generateSRT(captionsText);
    
    return new Promise((resolve, reject) => {
      ffmpeg(videoPath)
        .outputOptions([
          `-vf subtitles=${srtPath}:force_style='FontSize=24,PrimaryColour=&HFFFFFF&'`
        ])
        .output(outputPath)
        .on('end', () => resolve(outputPath))
        .on('error', reject)
        .run();
    });
  }

  async generateSRT(text) {
    // Simple SRT generation - you can enhance this
    const srtPath = path.join(__dirname, '../temp/captions.srt');
    const srtContent = `1\n00:00:00,000 --> 00:00:05,000\n${text}\n`;
    await fs.writeFile(srtPath, srtContent);
    return srtPath;
  }
}

module.exports = new VideoService();