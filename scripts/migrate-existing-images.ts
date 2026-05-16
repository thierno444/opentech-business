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

// Fonction pour uploader une image vers Cloudinary
async function uploadToCloudinary(filePath: string): Promise<string | null> {
  try {
    const result = await cloudinary.uploader.upload(filePath, {
      folder: 'opentech/products/migrated',
      transformation: [{ width: 1200, height: 800, crop: 'limit' }],
    });
    return result.secure_url;
  } catch (error) {
    console.error(`❌ Erreur upload ${filePath}:`, error);
    return null;
  }
}

// Fonction pour vérifier si une image existe localement
function imageExistsLocally(filePath: string): boolean {
  const fullPath = path.join(process.cwd(), filePath);
  return fs.existsSync(fullPath);
}

async function migrateProducts() {
  console.log('🚀 Migration des anciennes images vers Cloudinary...\n');
  
  try {
    // Connexion à MongoDB
    await mongoose.connect(process.env.MONGODB_URI as string);
    console.log('✅ Connecté à MongoDB\n');
    
    // Récupérer tous les produits
    const products = await Product.find({});
    console.log(`📦 ${products.length} produits analysés\n`);
    
    let totalProductsModified = 0;
    let totalImagesMigrated = 0;
    let totalErrors = 0;
    
    for (let i = 0; i < products.length; i++) {
      const product = products[i];
      console.log(`\n📦 Produit ${i + 1}/${products.length}: ${product.name}`);
      
      let productModified = false;
      const newImages = [];
      
      // Analyser chaque image du produit
      for (let j = 0; j < product.images.length; j++) {
        const img = product.images[j];
        
        // Si l'image est déjà une URL Cloudinary ou externe, on la garde
        if (img && (img.startsWith('https://res.cloudinary.com/') || img.startsWith('http://'))) {
          console.log(`   ✅ Image ${j + 1}: déjà distante - ${img.substring(0, 60)}...`);
          newImages.push(img);
          continue;
        }
        
        // Si l'image est locale (/uploads/...)
        if (img && img.startsWith('/uploads/')) {
          const localPath = img;
          console.log(`   📤 Image ${j + 1}: ${path.basename(img)}`);
          
          if (imageExistsLocally(localPath)) {
            const cloudUrl = await uploadToCloudinary(localPath);
            if (cloudUrl) {
              newImages.push(cloudUrl);
              productModified = true;
              totalImagesMigrated++;
              console.log(`      ✅ Migrée vers Cloudinary`);
            } else {
              newImages.push(img);
              totalErrors++;
              console.log(`      ⚠️ Erreur migration, conservée localement`);
            }
          } else {
            console.log(`      ⚠️ Fichier local non trouvé: ${localPath}`);
            newImages.push(img);
          }
          continue;
        }
        
        // Si l'image a un autre format, on la garde
        newImages.push(img);
      }
      
      // Sauvegarder si modifications
      if (productModified) {
        product.images = newImages;
        await product.save();
        totalProductsModified++;
        console.log(`   ✅ Produit mis à jour (${product.images.length} images)`);
      } else {
        console.log(`   ℹ️ Aucune image à migrer`);
      }
    }
    
    // Résumé
    console.log('\n' + '='.repeat(60));
    console.log('📊 RÉSUMÉ DE LA MIGRATION:');
    console.log(`   📦 Produits modifiés: ${totalProductsModified}/${products.length}`);
    console.log(`   🖼️ Images migrées vers Cloudinary: ${totalImagesMigrated}`);
    console.log(`   ❌ Erreurs: ${totalErrors}`);
    console.log('='.repeat(60));
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Erreur fatale:', error);
    process.exit(1);
  }
}

migrateProducts();
