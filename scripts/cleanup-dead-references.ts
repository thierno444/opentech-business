import mongoose from 'mongoose';
import { Product } from '../src/backend/models/productModel.js';
import dotenv from 'dotenv';

dotenv.config();

async function cleanupDeadReferences() {
  console.log('🧹 Nettoyage des références d\'images mortes...\n');
  
  try {
    await mongoose.connect(process.env.MONGODB_URI as string);
    console.log('✅ Connecté à MongoDB\n');
    
    const products = await Product.find({});
    console.log(`📦 ${products.length} produits analysés\n`);
    
    let totalModified = 0;
    let totalImagesRemoved = 0;
    
    for (const product of products) {
      let modified = false;
      const originalCount = product.images.length;
      
      // Filtrer les images : garder uniquement les URLs distantes
      const validImages = product.images.filter(img => {
        // Garder les URLs Cloudinary et les URLs HTTP/HTTPS valides
        if (img && (img.startsWith('https://res.cloudinary.com/') || 
                    img.startsWith('http://') || 
                    img.startsWith('https://'))) {
          return true;
        }
        // Supprimer les références locales (/uploads/...)
        console.log(`   🗑️ Suppression: ${img}`);
        totalImagesRemoved++;
        return false;
      });
      
      if (validImages.length !== originalCount) {
        product.images = validImages;
        await product.save();
        totalModified++;
        console.log(`   ✅ Produit mis à jour: ${product.name} (${originalCount} -> ${validImages.length} images)`);
      }
    }
    
    console.log('\n' + '='.repeat(60));
    console.log('📊 RÉSULTAT DU NETTOYAGE:');
    console.log(`   📦 Produits modifiés: ${totalModified}`);
    console.log(`   🖼️ Images supprimées: ${totalImagesRemoved}`);
    console.log('='.repeat(60));
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Erreur:', error);
    process.exit(1);
  }
}

cleanupDeadReferences();
