import express from 'express';
import path from 'path';
import mongoose from 'mongoose';
import cors from 'cors';
import { createServer as createViteServer } from 'vite';
import { getProducts, getProductById, createProduct, updateProduct, deleteProduct } from './src/backend/controllers/productController';
import { loginUser, registerUser } from './src/backend/controllers/userController';
import { createOrder, getOrders, updateOrderStatus } from './src/backend/controllers/orderController';
import { protect, admin } from './src/backend/middleware/authMiddleware';
import { User } from './src/backend/models/userModel';
import { Product } from './src/backend/models/productModel';

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(cors());
  app.use(express.json());

  // Connect to MongoDB
  const mongoUri = process.env.MONGODB_URI;
  if (mongoUri) {
    mongoose.connect(mongoUri)
      .then(async () => {
        console.log('Connected to MongoDB');
        // Seed Admin if not exists
        const adminEmail = process.env.ADMIN_EMAIL || 'businessopentech@gmail.com';
        const adminExists = await User.findOne({ email: adminEmail });
        if (!adminExists) {
          await User.create({
            email: adminEmail,
            password: process.env.ADMIN_PASSWORD || 'admin123',
            role: 'admin'
          });
          console.log('Admin user created');
        }

        // Seed some products if empty
        const productCount = await Product.countDocuments();
        if (productCount === 0) {
          const initialProducts = [
            { name: 'Pack Site Vitrine Starter', description: 'Idéal pour débuter votre présence en ligne.', price: 80000, category: 'Web', image: 'https://picsum.photos/seed/web1/800/600', features: ['5 pages', 'Responsive', 'Contact Form'] },
            { name: 'Pack Site Vitrine Pro', description: 'Pour une image professionnelle et complète.', price: 120000, category: 'Web', image: 'https://picsum.photos/seed/web2/800/600', features: ['10 pages', 'SEO Basic', 'Blog'] },
            { name: 'Pack E-commerce Starter', description: 'Vendez vos produits en ligne facilement.', price: 150000, category: 'E-commerce', image: 'https://picsum.photos/seed/shop1/800/600', features: ['Boutique', 'Panier', 'Paiement'] },
            { name: 'Pack E-commerce Business', description: 'Solution complète pour votre business.', price: 200000, category: 'E-commerce', image: 'https://picsum.photos/seed/shop2/800/600', features: ['Illimité', 'Gestion Stock', 'Marketing Tools'] },
            { name: 'Formation Bureautique', description: 'Maîtrisez Word, Excel et PowerPoint.', price: 50000, category: 'Formation', image: 'https://picsum.photos/seed/edu1/800/600', features: ['3 mois', 'Attestation', 'Pratique'] }
          ];
          await Product.insertMany(initialProducts);
          console.log('Initial products seeded');
        }
      })
      .catch(err => console.error('MongoDB connection error:', err));
  } else {
    console.warn('MONGODB_URI not found in environment variables. Database features will not work.');
  }

  // API Routes
  app.post('/api/users/login', loginUser);
  app.post('/api/users/register', registerUser);

  app.get('/api/products', getProducts);
  app.get('/api/products/:id', getProductById);
  app.post('/api/products', protect, admin, createProduct);
  app.put('/api/products/:id', protect, admin, updateProduct);
  app.delete('/api/products/:id', protect, admin, deleteProduct);

  app.post('/api/orders', createOrder);
  app.get('/api/orders', protect, admin, getOrders);
  app.put('/api/orders/:id', protect, admin, updateOrderStatus);

  // Vite middleware for development
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
