import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

/**
 * Uploads a base64 image string to Cloudinary and returns the secure URL.
 * @param {string} base64Data - Base64 image payload
 * @param {string} folder - Folder destination on Cloudinary
 * @returns {Promise<string>} - Secure asset URL
 */
export async function uploadToCloudinary(base64Data, folder = 'products') {
  if (!process.env.CLOUDINARY_CLOUD_NAME || !process.env.CLOUDINARY_API_KEY || !process.env.CLOUDINARY_API_SECRET) {
    throw new Error('Cloudinary credentials are not configured');
  }

  // Ensure base64 string is correctly prefixed
  const dataToUpload = base64Data.startsWith('data:') ? base64Data : `data:image/png;base64,${base64Data}`;

  const result = await cloudinary.uploader.upload(dataToUpload, {
    folder: folder,
    resource_type: 'auto',
  });

  return result.secure_url;
}

export default cloudinary;
