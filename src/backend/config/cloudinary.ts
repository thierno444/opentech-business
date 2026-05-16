import { v2 as cloudinary } from 'cloudinary';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import dotenv from 'dotenv';

dotenv.config();

// Configuration Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

console.log('☁️ Cloudinary configuré avec:', {
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY ? '***' : 'manquant',
});

// Configuration simplifiée du stockage
export const cloudinaryStorage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'opentech/products',
    format: async (req, file) => {
      const ext = file.originalname.split('.').pop();
      return ext === 'png' ? 'png' : 'jpg';
    },
    public_id: (req, file) => `${Date.now()}-${Math.round(Math.random() * 10000)}`,
  },
});

export default cloudinary;
