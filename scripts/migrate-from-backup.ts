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

// Configuration Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Mapping des fichiers locaux vers Cloudinary
const uploadedFiles = new Map();

async function uploadToCloudinary(filePath: string, originalName: string): Promise<string | null> {
  // Éviter les doublons
  if (uploadedFiles.has(filePath)) {
    console.log(`   🔄 Déjà uploadé: ${originalName}`);
    return uploadedFiles.get(filePath);
  }
  
  try {
    const result = await cloudinary.uploader.upload(filePath, {
      folder: 'opentech/products',
      public_id: `${Date.now()}-${originalName.split('.')[0]}`,
      transformation: [{ width: 1200, height: 800, crop: 'limit' }],
    });
    
    uploadedFiles.set(filePath, result.secure_url);
    console.log(`   ✅ Upload réussi: ${originalName} -> ${result.secure_url.substring(0, 60)}...`);
    return result.secure_url;
  } catch (error) {
    console.error(`   ❌ Erreur upload ${originalName}:`, error.message);
    return null;
  }
}

async function migrateProducts() {
  console.log('🚀 Migration des images depuis la backup...\n');
  
  try {
    await mongoose.connect(process.env.MONGODB_URI as string);
    console.log('✅ Connecté à MongoDB\n');
    
    const products = await Product.find({});
    console.log(`📦 ${products.length} produits analysés\n`);
    
    let totalProductsModified = 0;
    let totalImagesMigrated = 0;
    const missingFiles = [];
    
    for (let i = 0; i < products.length; i++) {
      const product = products[i];
      console.log(`\n📦 Produit ${i + 1}/${products.length}: ${product.name}`);
      
      let productModified = false;
      const newImages = [];
      
      for (let j = 0; j < product.images.length; j++) {
        const img = product.images[j];
        
        // Si c'est déjà une URL Cloudinary, on garde
        if (img && img.startsWith('https://res.cloudinary.com/')) {
          console.log(`   ✅ Image ${j + 1}: déjà Cloudinary`);
          newImages.push(img);
          continue;
        }
        
        // Si c'est une URL HTTP externe, on garde
        if (img && (img.startsWith('http://') || img.startsWith('https://'))) {
          console.log(`   ✅ Image ${j + 1}: URL externe`);
          newImages.push(img);
          continue;
        }
        
        // Si c'est une image locale
        if (img && img.startsWith('/uploads/')) {
          const fileName = path.basename(img);
          const localPath = path.join(process.cwd(), img);
          
          console.log(`   📤 Image ${j + 1}: ${fileName}`);
          
          if (fs.existsSync(localPath)) {
            const cloudUrl = await uploadToCloudinary(localPath, fileName);
            if (cloudUrl) {
              newImages.push(cloudUrl);
              productModified = true;
              totalImagesMigrated++;
            } else {
              newImages.push(img);
              missingFiles.push({ product: product.name, file: fileName });
            }
          } else {
            console.log(`      ⚠️ Fichier non trouvé: ${localPath}`);
            newImages.push(img);
            missingFiles.push({ product: product.name, file: fileName, status: 'missing' });
          }
          continue;
        }
        
        // Autres cas
        newImages.push(img);
      }
      
      if (productModified) {
        product.images = newImages;
        await product.save();
        totalProductsModified++;
        console.log(`   ✅ Produit mis à jour (${product.images.length} images)`);
      }
    }
    
    // Résumé
    console.log('\n' + '='.repeat(60));
    console.log('📊 RÉSUMÉ DE LA MIGRATION:');
    console.log(`   📦 Produits modifiés: ${totalProductsModified}/${products.length}`);
    console.log(`   🖼️ Images migrées vers Cloudinary: ${totalImagesMigrated}`);
    
    if (missingFiles.length > 0) {
      console.log(`\n⚠️ Fichiers manquants (${missingFiles.length}):`);
      missingFiles.slice(0, 20).forEach(mf => {
        console.log(`   - ${mf.product}: ${mf.file}`);
      });
      if (missingFiles.length > 20) {
        console.log(`   ... et ${missingFiles.length - 20} autres`);
      }
    }
    
    console.log('='.repeat(60));
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Erreur fatale:', error);
    process.exit(1);
  }
}

migrateProducts();
