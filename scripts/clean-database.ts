import mongoose from 'mongoose';
import { Product } from '../src/backend/models/productModel.js';
import dotenv from 'dotenv';

dotenv.config();

async function cleanDatabase() {
  console.log('\n🧹 NETTOYAGE DE LA BASE DE DONNÉES');
  console.log('='.repeat(50));
  
  try {
    await mongoose.connect(process.env.MONGODB_URI as string);
    console.log('✅ Connecté à MongoDB\n');
    
    // Compter avant
    const before = await Product.find({});
    let localRefs = 0;
    
    for (const p of before) {
      if (p.images) {
        localRefs += p.images.filter(img => img && img.includes('/uploads/')).length;
      }
    }
    
    console.log(`📊 AVANT nettoyage:`);
    console.log(`   Produits: ${before.length}`);
    console.log(`   Références locales: ${localRefs}`);
    
    // Nettoyer
    const result = await Product.updateMany(
      { 'images': { $regex: '/uploads/', $options: 'i' } },
      { $set: { images: [] } }
    );
    
    const resultVideos = await Product.updateMany(
      { 'videos': { $regex: '/uploads/', $options: 'i' } },
      { $set: { videos: [] } }
    );
    
    console.log(`\n📊 APRÈS nettoyage:`);
    console.log(`   Produits modifiés (images): ${result.modifiedCount}`);
    console.log(`   Produits modifiés (vidéos): ${resultVideos.modifiedCount}`);
    console.log(`\n✅ Base de données nettoyée !`);
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Erreur:', error);
    process.exit(1);
  }
}

cleanDatabase();
