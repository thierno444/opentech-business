import mongoose from 'mongoose';
import { Product } from '../src/backend/models/productModel.js';
import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';

dotenv.config();

async function diagnose() {
  try {
    await mongoose.connect(process.env.MONGODB_URI as string);
    console.log('✅ Connecté à MongoDB\n');
    
    const products = await Product.find({});
    const uploadDir = path.join(process.cwd(), 'uploads');
    const availableFiles = fs.existsSync(uploadDir) ? fs.readdirSync(uploadDir) : [];
    
    console.log(`�� ${availableFiles.length} fichiers disponibles dans uploads/\n`);
    
    let totalLocalRefs = 0;
    let foundCount = 0;
    
    for (const product of products) {
      for (const img of product.images) {
        if (img && img.startsWith('/uploads/')) {
          totalLocalRefs++;
          const fileName = path.basename(img);
          const exists = availableFiles.includes(fileName);
          if (exists) {
            foundCount++;
            console.log(`✅ ${product.name}: ${fileName} (trouvé)`);
          } else {
            console.log(`❌ ${product.name}: ${fileName} (MANQUANT)`);
          }
        }
      }
    }
    
    console.log(`\n📊 RÉSULTAT:`);
    console.log(`   Références locales: ${totalLocalRefs}`);
    console.log(`   Fichiers trouvés: ${foundCount}`);
    console.log(`   Fichiers manquants: ${totalLocalRefs - foundCount}`);
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Erreur:', error);
    process.exit(1);
  }
}

diagnose();
