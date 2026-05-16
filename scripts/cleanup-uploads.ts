// scripts/cleanup-uploads.ts
import mongoose from 'mongoose';
import { Product } from '../src/backend/models/productModel.js';
import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, '../.env') });

async function cleanupUploads() {
  console.log('🧹 Nettoyage des fichiers uploads...\n');
  
  try {
    await mongoose.connect(process.env.MONGODB_URI as string);
    console.log('✅ Connecté à MongoDB\n');
    
    const products = await Product.find({});
    console.log(`📦 ${products.length} produits trouvés\n`);
    
    const usedPaths = new Set<string>();
    
    products.forEach(product => {
      if (product.images && product.images.length) {
        product.images.forEach(img => {
          if (img && img.startsWith('/uploads/')) {
            usedPaths.add(img);
          }
        });
      }
      if (product.videos && product.videos.length) {
        product.videos.forEach(vid => {
          if (vid && vid.startsWith('/uploads/')) {
            usedPaths.add(vid);
          }
        });
      }
    });
    
    console.log(`📁 ${usedPaths.size} fichiers référencés dans la base\n`);
    
    const uploadDir = path.join(process.cwd(), 'uploads');
    
    if (!fs.existsSync(uploadDir)) {
      console.log('📁 Dossier uploads inexistant');
      process.exit(0);
    }
    
    const files = fs.readdirSync(uploadDir);
    console.log(`📂 ${files.length} fichiers dans uploads/\n`);
    
    let deletedCount = 0;
    
    for (const file of files) {
      const filePath = `/uploads/${file}`;
      const fullPath = path.join(uploadDir, file);
      
      if (!usedPaths.has(filePath)) {
        fs.unlinkSync(fullPath);
        console.log(`🗑️ SUPPRIMÉ: ${file}`);
        deletedCount++;
      } else {
        console.log(`✅ CONSERVÉ: ${file}`);
      }
    }
    
    console.log(`\n✅ Nettoyage terminé: ${deletedCount} fichier(s) supprimé(s)`);
    process.exit(0);
  } catch (error) {
    console.error('❌ Erreur:', error);
    process.exit(1);
  }
}

cleanupUploads();