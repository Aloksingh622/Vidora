import dotenv from 'dotenv'
dotenv.config()
import { v2 as cloudinary } from "cloudinary";
import fs from "fs";


cloudinary.config({ 
  cloud_name: process.env.CLOUDINARY_NAME, 
  api_key: process.env.CLOUDINARY_API_KEY, 
  api_secret: process.env.CLOUDINARY_API_SECRET
});

const uploadOnCloudinary = async (filePathOrUrl) => {
  if (!filePathOrUrl) return null;

  try {
    // ✅ Upload (works with both URLs and local paths)
    const uploadResult = await cloudinary.uploader.upload(filePathOrUrl, {
      resource_type: "auto",
      folder: "user_profiles"
    });

    // ✅ Only delete if it's a local file path (not a URL)
    if (!filePathOrUrl.startsWith("http")) {
      fs.unlinkSync(filePathOrUrl);
    }

    return uploadResult.secure_url;
  } catch (error) {
    // ✅ Only try to unlink if local file exists
    if (!filePathOrUrl.startsWith("http") && fs.existsSync(filePathOrUrl)) {
      fs.unlinkSync(filePathOrUrl);
    }
    console.error("Cloudinary upload failed:", error.message);
    throw error;
  }
};

export default uploadOnCloudinary;
