// scripts/migrate-to-cloudinary.ts
import mongoose from 'mongoose';
import { Product } from '../src/backend/models/productModel.js';
import fs from 'fs';
import path from 'path';
import { v2 as cloudinary } from 'cloudinary';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, '../.env') });

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

async function uploadToCloudinary(filePath: string, isVideo: boolean): Promise<string | null> {
  try {
    const result = await cloudinary.uploader.upload(filePath, {
      folder: 'opentech/products',
      resource_type: isVideo ? 'video' : 'image',
    });
    return result.secure_url;
  } catch (error) {
    console.error(`Erreur upload ${filePath}:`, error);
    return null;
  }
}

async function migrateProducts() {
  console.log('🚀 Migration vers Cloudinary...\n');
  
  try {
    await mongoose.connect(process.env.MONGODB_URI as string);
    console.log('✅ Connecté à MongoDB\n');
    
    const products = await Product.find({});
    console.log(`📦 ${products.length} produits à traiter\n`);
    
    let migratedCount = 0;
    let totalImagesMigrated = 0;
    
    for (const product of products) {
      let modified = false;
      const newImages = [...product.images];
      
      for (let i = 0; i < newImages.length; i++) {
        const imgPath = newImages[i];
        
        if (imgPath && imgPath.startsWith('/uploads/')) {
          const localPath = path.join(process.cwd(), imgPath);
          if (fs.existsSync(localPath)) {
            console.log(`📤 Upload: ${path.basename(imgPath)}`);
            const cloudUrl = await uploadToCloudinary(localPath, false);
            if (cloudUrl) {
              newImages[i] = cloudUrl;
              modified = true;
              totalImagesMigrated++;
              console.log(`   ✅ Migré`);
            }
          } else {
            console.log(`⚠️ Fichier non trouvé: ${imgPath}`);
          }
        }
      }
      
      if (modified) {
        product.images = newImages;
        await product.save();
        migratedCount++;
        console.log(`✅ Produit migré: ${product.name}\n`);
      }
    }
    
    console.log('\n' + '='.repeat(50));
    console.log('📊 RÉSUMÉ DE LA MIGRATION:');
    console.log(`   ✅ Produits modifiés: ${migratedCount}`);
    console.log(`   📸 Images migrées: ${totalImagesMigrated}`);
    console.log('='.repeat(50));
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Erreur:', error);
    process.exit(1);
  }
}

migrateProducts();