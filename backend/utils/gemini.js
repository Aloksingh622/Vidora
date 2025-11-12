const { GoogleGenerativeAI } = require('@google/generative-ai');

class GeminiService {
  constructor() {
    this.genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
  }

  // Analyze video for thumbnail generation
  async analyzeVideoForThumbnail(videoFrames, title, description) {
    const model = this.genAI.getGenerativeModel({ model: 'gemini-1.5-pro' });

    const prompt = `Analyze these video frames and suggest the best thumbnail options.
    Video Title: ${title}
    Description: ${description}
    
    Return JSON with:
    - bestFrameIndex: which frame would make the best thumbnail
    - reason: why this frame is engaging
    - suggestedText: text overlay recommendations
    - colorScheme: suggested color adjustments`;

    const imageParts = videoFrames.map(frame => ({
      inlineData: {
        data: frame.toString('base64'),
        mimeType: 'image/jpeg'
      }
    }));

    const result = await model.generateContent([prompt, ...imageParts]);
    const response = await result.response;
    return JSON.parse(response.text());
  }

  // Analyze video for short clips
  async analyzeVideoForShorts(videoPath, duration, contentFocus) {
    const model = this.genAI.getGenerativeModel({ model: 'gemini-1.5-pro' });

    const prompt = `Analyze this video and identify the most ${contentFocus} moments for short-form content.
    Target duration: ${duration} seconds
    
    Return JSON array with:
    - startTime: when the segment starts (seconds)
    - endTime: when the segment ends (seconds)
    - score: engagement score (0-100)
    - title: short description
    - reason: why this segment is engaging
    - hasAction: boolean for action presence
    - hasSpeech: boolean for speech presence`;

    // Read video file
    const videoFile = await this.readVideoFile(videoPath);
    
    const result = await model.generateContent([
      prompt,
      {
        inlineData: {
          data: videoFile.toString('base64'),
          mimeType: 'video/mp4'
        }
      }
    ]);

    const response = await result.response;
    return JSON.parse(response.text());
  }

  async readVideoFile(path) {
    const fs = require('fs').promises;
    return await fs.readFile(path);
  }
}

module.exports = new GeminiService();