import { GoogleGenAI } from "@google/genai";
import fs from "fs";
import path from "path";
import { fileURLToPath } from 'url';
import axios from "axios"


const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


const ai = new GoogleGenAI({
  apiKey: process.env.GOOGLE_AI_API_KEY
});

export const thumbnailCreate = async (req, res) => {
  try {
    const { description } = req.body;
    const referenceImage = req.file; // Multer uploaded file


    if (!description || description.trim() === '') {
      return res.status(400).json({
        success: false,
        message: 'Description is required'
      });
    }

    // Build the prompt array
    // const prompt = [];

    // // Add text description
    // prompt.push({
    //   text: `Create a professional YouTube thumbnail based on this description: ${description}. 
    //          Make it eye-catching, vibrant, and optimized for YouTube with bold text and clear visuals.
    //          The thumbnail should be in 16:9 aspect ratio (1280x720 pixels).`
    // });

    // // Add reference image if provided
    // if (referenceImage) {
    //   const imagePath = referenceImage.path;
    //   const imageData = fs.readFileSync(imagePath);
    //   const base64Image = imageData.toString("base64");

    //   // Get mime type from file
    //   const mimeType = referenceImage.mimetype;

    //   prompt.push({
    //     inlineData: {
    //       mimeType: mimeType,
    //       data: base64Image
    //     }
    //   });

    //   prompt[0].text += " Use the provided reference image as style inspiration.";
    // }

    const prompt = [];

    let basePrompt = `
Create a high-quality, professional YouTube thumbnail based on this description: "${description}".

Guidelines:
- Maintain a 16:9 aspect ratio (1280x720 pixels).
- The thumbnail should be bold, vibrant, and instantly attention-grabbing.
- Use clear composition: a strong central subject, readable large text, and balanced colors.
- Text should be minimal but impactful (4–7 words max), with high contrast for readability.
- The overall design should look cinematic, modern, and scroll-stopping.
- Avoid clutter and unnecessary small details.
- Lighting and shadows should feel realistic and dramatic.
`;

    if (referenceImage) {
      const imagePath = referenceImage.path;
      const imageData = fs.readFileSync(imagePath);
      const base64Image = imageData.toString("base64");
      const mimeType = referenceImage.mimetype;

      prompt.push({
        inlineData: {
          mimeType: mimeType,
          data: base64Image,
        },
      });

      basePrompt += `Use the provided reference image as visual inspiration for color palette, composition, or style.
                      Do not copy it directly, but match its energy, tone, and aesthetic.
                      Blend the prompt description’s theme with the reference image’s mood for a cohesive final design.`;
    }


    prompt.push({
      text: basePrompt.trim(),
    });




    const thumbnails = [];
    const numberOfThumbnails = 4;

    for (let i = 0; i < numberOfThumbnails; i++) {
      const response = await ai.models.generateContent({
        model: "gemini-2.0-flash-preview-image-generation",
        contents: [
          {
            role: "user",
            parts: prompt
          }
        ],
        config: {
          responseModalities: ["IMAGE", "TEXT"]
        }
      });

      // Process response
      console.log(response.candidates[0])
      for (const part of response.candidates[0].content.parts) {
        if (part.inlineData) {
          const imageData = part.inlineData.data;
          const buffer = Buffer.from(imageData, "base64");

          // Generate unique filename
          const timestamp = Date.now();
          const filename = `thumbnail-${timestamp}-${i + 1}.png`;
          const savePath = path.join(__dirname, '../public/uploads/images', filename);

          // Save the generated thumbnail
          fs.writeFileSync(savePath, buffer);

          // Add to thumbnails array
          thumbnails.push({
            id: i + 1,
            url: `/uploads/images/${filename}`,
            filename: filename
          });

          console.log(`Thumbnail ${i + 1} saved as ${filename}`);
        }
      }
    }


    if (referenceImage) {
      fs.unlinkSync(referenceImage.path);
    }


    res.status(200).json({
      success: true,
      message: 'Thumbnails generated successfully',
      thumbnails: thumbnails,
      count: thumbnails.length
    });

  } catch (error) {
    console.error('Error generating thumbnails:', error);

    if (req.file) {
      try {
        fs.unlinkSync(req.file.path);
      } catch (unlinkError) {
        console.error('Error cleaning up file:', unlinkError);
      }
    }

    res.status(500).json({
      success: false,
      message: 'Failed to generate thumbnails',
      error: error.message
    });
  }
};

export const youtubeanalyis = async (req, res) => {
  try {
    const { videoUrl, analysisType } = req.body;


    if (!videoUrl) {
      return res.status(400).json({
        success: false,
        message: 'Video URL is required'
      });
    }

    if (!analysisType || !['description', 'timestamp'].includes(analysisType)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid analysis type. Must be "description" or "timestamp"'
      });
    }

    console.log('Analyzing YouTube video:', videoUrl);
    console.log('Analysis type:', analysisType);


    const videoId = extractVideoId(videoUrl);
    const youtubeFileUri = `https://www.youtube.com/watch?v=${videoId}`;


    const model = 'gemini-2.5-flash';

    let result;

    if (analysisType === 'description') {
      result = await generateDescription(model, youtubeFileUri);
    } else {
      result = await generateTimestamps(model, youtubeFileUri);
    }

    // Return success response
    return res.status(200).json({
      success: true,
      ...result
    });

  } catch (error) {
    console.error('Error in analyzeYouTubeVideo:', error);

    return res.status(500).json({
      success: false,
      message: error.message || 'Failed to analyze video'
    });
  }
}

export const summary = async (req, res) => {
  try {
    const { videoUrl, analysisType } = req.body;
    if (!videoUrl) {
      return res.status(400).json({
        success: false,
        message: 'Video URL is required'
      });
    }

    console.log('Analyzing YouTube video:', videoUrl);
    console.log('Analysis type:', analysisType);

    const videoId = extractVideoId(videoUrl);
    const youtubeFileUri = `https://www.youtube.com/watch?v=${videoId}`;


    const model = 'gemini-2.5-flash';
    const contents = [
      {
        role: 'user',
        parts: [
          {
            fileData: {
              fileUri: youtubeFileUri,
              mimeType: 'video/mp4',
            }
          },
          {
            text: `Analyze the provided  video link carefully and generate a **detailed, professional summary** of its content.

Follow this exact structure:

1️⃣ **Introduction / Hook (1–2 sentences):**
Start with an engaging overview or main theme of the video that captures attention.

2️⃣ **Detailed Summary (2–3 short paragraphs):**
Summarize the full content of the video clearly — mention key topics, ideas, or discussions covered.  
Keep it informative, readable, and written in a natural, conversational yet professional tone.  
If it’s a tutorial or informative video, describe the steps or concepts explained.  
If it’s entertainment or storytelling content, summarize the flow of events or message.

3️⃣ **Key Highlights (3–5 bullet points):**
List the most important insights, facts, or takeaways using short bullet points.  
Use emojis before each point to make it visually appealing.

4️⃣ **Final Insight (1 short paragraph):**
Wrap up with a concluding line summarizing the overall purpose or value of the video — what viewers gain from watching it.

Formatting Guidelines:
- Keep paragraphs short (2–3 lines each).
- Use emojis sparingly but effectively.
- Avoid repetition.
- Maintain SEO-friendly and easy-to-read language.

Now, generate the **detailed video summary** `,
          },
        ],
      },
    ];


    const response = await ai.models.generateContent({
      model,
      contents,
    });

    console.log(response)

    let generatedText = '';

    if (response && response.candidates && response.candidates.length > 0) {
      const candidate = response.candidates[0];
      if (candidate.content && candidate.content.parts && candidate.content.parts.length > 0) {
        generatedText = candidate.content.parts[0].text;
      }
    }

    let result = {
      type: 'summary',
      content: generatedText,
      metadata: {
        videoTitle: 'YouTube Video',
        duration: 'N/A',
        analyzed: new Date().toLocaleString()
      }
    };

    return res.status(200).json({
      success: true,
      ...result
    });

  } catch (error) {

    const errorObject = JSON.parse(error.message);

    const errorMessage = errorObject.error.message;

    console.error('Error in analyzeYouTubeVideo:', errorMessage + " please upload the link of short length video");

    return res.status(500).json({
      success: false,
      message: errorMessage + " please upload the link of short length video" || 'Failed to analyze video'
    });




  }

}




function extractVideoId(url) {
  const patterns = [
    /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([a-zA-Z0-9_-]{11})/,
    /youtube\.com\/watch\?.*v=([a-zA-Z0-9_-]{11})/
  ];

  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match) return match[1];
  }

  throw new Error('Invalid YouTube URL');
}
async function generateDescription(model, youtubeFileUri) {
  try {
    const contents = [
      {
        role: 'user',
        parts: [
          {
            fileData: {
              fileUri: youtubeFileUri,
              mimeType: 'video/*',
            }
          },
          {
            text: `Analyze this YouTube video and create an engaging, professional video description.

Requirements:
1. Start with an attention-grabbing hook (1-2 sentences)
2. Provide a compelling summary of the video content (2-3 paragraphs)
3. Include 3-5 key highlights or takeaways (use bullet points with emojis)
4. Add a call-to-action (subscribe, like, comment)
5. Include 5-7 relevant hashtags at the end

Format:
- Use emojis strategically to make it engaging
- Keep paragraphs short and readable
- Make it SEO-friendly
- Professional yet conversational tone

Generate the description now:`,
          },
        ],
      },
    ];



    const response = await ai.models.generateContent({
      model,
      contents,
    });

    let generatedText = '';

    if (response && response.candidates && response.candidates.length > 0) {
      const candidate = response.candidates[0];
      if (candidate.content && candidate.content.parts && candidate.content.parts.length > 0) {
        generatedText = candidate.content.parts[0].text;
      }
    }

    return {
      type: 'description',
      content: generatedText,
      metadata: {
        videoTitle: 'YouTube Video',
        duration: 'N/A',
        analyzed: new Date().toLocaleString()
      }
    };

  } catch (error) {
    console.error('Error generating description:', error);
    throw new Error('Failed to generate description: ' + error.message);
  }
}
async function generateTimestamps(model, youtubeFileUri) {
  try {
    const contents = [
      {
        role: 'user',
        parts: [
          {
            fileData: {
              fileUri: youtubeFileUri,
              mimeType: 'video/*',
            }
          },
          {
            text: `Analyze this YouTube video and create detailed timestamps (chapters) for it.

Requirements:
1. Watch the entire video carefully
2. Identify major topic changes, sections, and key moments
3. Create timestamps at logical breakpoints
4. Each timestamp should have a clear, descriptive label
5. Aim for 5-10 timestamps depending on video length
6. Include intro and outro if present

Format your response as a JSON array:
[
  {"time": "0:00", "label": "Introduction"},
  {"time": "1:23", "label": "Main Topic Begins"},
  {"time": "3:45", "label": "Key Point 1: [specific topic]"},
  ...
]

Important: Return ONLY the JSON array, no other text or markdown.`,
          },
        ],
      },
    ];

    const response = await ai.models.generateContent({
      model,
      contents,
    });
    let generatedText = '';

    if (response && response.candidates && response.candidates.length > 0) {
      const candidate = response.candidates[0];
      if (candidate.content && candidate.content.parts && candidate.content.parts.length > 0) {
        generatedText = candidate.content.parts[0].text;
      }
    }


    // Clean up response - remove markdown code blocks if present
    generatedText = generatedText.replace(/```json\n?/g, '');
    generatedText = generatedText.replace(/```\n?/g, '');
    generatedText = generatedText.trim();

    // Parse JSON
    const timestamps = JSON.parse(generatedText);

    // Validate timestamps format
    if (!Array.isArray(timestamps)) {
      throw new Error('Invalid timestamp format');
    }

    return {
      type: 'timestamp',
      content: timestamps,
      metadata: {
        videoTitle: 'YouTube Video',
        duration: 'N/A',
        analyzed: new Date().toLocaleString()
      }
    };

  } catch (error) {
    console.error('Error generating timestamps:', error);


    return {
      type: 'timestamp',
      content: [
        { time: '0:00', label: 'Introduction' },
        { time: '0:30', label: 'Main Content' },
        { time: '1:00', label: 'Conclusion' }
      ],
      metadata: {
        videoTitle: 'YouTube Video',
        duration: 'N/A',
        analyzed: new Date().toLocaleString()
      }
    };
  }
}

