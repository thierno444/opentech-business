import mongoose from 'mongoose';
import { Product } from '../src/backend/models/productModel.js';
import dotenv from 'dotenv';

dotenv.config();

async function cleanLocalImages() {
  try {
    await mongoose.connect(process.env.MONGODB_URI as string);
    console.log('✅ Connecté à MongoDB\n');
    
    // Récupérer tous les produits
    const products = await Product.find({});
    
    for (const product of products) {
      // Vérifier si le produit a des images locales
      const hasLocalImages = product.images.some(img => img && !img.startsWith('https://res.cloudinary.com/') && img !== '');
      
      if (hasLocalImages) {
        console.log(`🧹 Nettoyage: ${product.name}`);
        // Vider le tableau d'images
        product.images = [];
        await product.save();
        console.log(`   ✅ Images locales supprimées`);
      }
    }
    
    console.log('\n✅ Nettoyage terminé');
    process.exit(0);
  } catch (error) {
    console.error('❌ Erreur:', error);
    process.exit(1);
  }
}

cleanLocalImages();
