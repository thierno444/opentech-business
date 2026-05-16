import mongoose from 'mongoose';
import { Product } from '../src/backend/models/productModel.js';
import dotenv from 'dotenv';

dotenv.config();

async function checkDatabase() {
  console.log('\n📊 VÉRIFICATION DE LA BASE DE DONNÉES');
  console.log('='.repeat(50));
  
  try {
    await mongoose.connect(process.env.MONGODB_URI as string);
    console.log('✅ Connecté à MongoDB\n');
    
    const products = await Product.find({});
    console.log(`�� Total produits: ${products.length}\n`);
    
    let withCloudinaryImages = 0;
    let withLocalImages = 0;
    let totalImages = 0;
    
    for (const product of products) {
      if (product.images && product.images.length > 0) {
        totalImages += product.images.length;
        
        const hasCloudinary = product.images.some(img => img.includes('cloudinary'));
        const hasLocal = product.images.some(img => img.includes('/uploads/'));
        
        if (hasCloudinary) {
          withCloudinaryImages++;
          console.log(`☁️ ${product.name}: ${product.images.length} image(s) Cloudinary`);
        }
        if (hasLocal) {
          withLocalImages++;
          console.log(`📁 ${product.name}: ${product.images.length} image(s) locale(s) - À NETTOYER`);
        }
      }
    }
    
    console.log('\n' + '='.repeat(50));
    console.log('📊 RÉSULTAT:');
    console.log(`   Produits avec images Cloudinary: ${withCloudinaryImages}`);
    console.log(`   Produits avec images locales: ${withLocalImages}`);
    console.log(`   Total images stockées: ${totalImages}`);
    console.log('='.repeat(50));
    
    if (withLocalImages > 0) {
      console.log('\n⚠️ Des images locales existent encore. Exécutez le script de nettoyage.');
    } else {
      console.log('\n✅ Base de données propre !');
    }
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Erreur:', error);
    process.exit(1);
  }
}

checkDatabase();
