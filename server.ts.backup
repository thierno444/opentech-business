import dotenv from "dotenv";
dotenv.config();

import express from "express";
import path from "path";
import mongoose from "mongoose";
import cors from "cors";
import fs from "fs";
import multer from "multer";
// SUPPRIMEZ l'import Vite (plus besoin sur Render)
// import { createServer as createViteServer } from "vite";

import {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
} from "./src/backend/controllers/productController";
import { loginUser, registerUser } from "./src/backend/controllers/userController";
import { getOrders, updateOrderStatus, createOrder, deleteOrder, deleteMultipleOrders } from "./src/backend/controllers/orderController";
import { protect, admin } from "./src/backend/middleware/authMiddleware";
import { User } from "./src/backend/models/userModel";
import { Product } from "./src/backend/models/productModel";
import { Order } from "./src/backend/models/orderModel";

const app = express();
const PORT = process.env.PORT || 5000;

// ============ MIDDLEWARE ============

// Configuration CORS (important pour Netlify)
const allowedOrigins = [
  'https://opentech-business.netlify.app',  // Frontend Netlify
  'https://opentech.netlify.app',           // Fallback
  'http://localhost:5173',                   // Dev local
  'http://localhost:5000'                    // Dev local backend
];

app.use(cors({
  origin: function (origin, callback) {
    // Autoriser les requêtes sans origin (Postman, ESP32, etc.)
    if (!origin) return callback(null, true);
    
    if (allowedOrigins.indexOf(origin) !== -1 || origin.includes('netlify.app')) {
      callback(null, true);
    } else {
      console.log(`❌ CORS bloqué pour: ${origin}`);
      callback(new Error('Non autorisé par CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept'],
}));

app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// ============ UPLOADS ============
const uploadDir = path.join(process.cwd(), "uploads");
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });

const storage = multer.diskStorage({
  destination: (_, __, cb) => cb(null, uploadDir),
  filename: (_, file, cb) => cb(null, file.fieldname + "-" + Date.now() + path.extname(file.originalname)),
});

const upload = multer({ 
  storage,
  limits: { 
    fileSize: 100 * 1024 * 1024, // 100MB pour les vidéos
    files: 20
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/') || file.mimetype.startsWith('video/')) {
      cb(null, true);
    } else {
      cb(new Error('Format non supporté') as any, false);
    }
  }
});

app.use("/uploads", express.static(uploadDir));

// ============ ROUTES API ============

// Health check (important pour Render)
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    message: 'API OpenTech Business fonctionne!',
    timestamp: new Date(),
    version: '1.0.0'
  });
});

app.get('/api/test', (req, res) => {
  res.json({ message: 'API fonctionne!', port: PORT, timestamp: new Date() });
});

// Authentification
app.post("/api/users/login", loginUser);
app.post("/api/users/register", async (req, res) => {
  try {
    const { email, password, role } = req.body;
    
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: "Cet email est déjà utilisé" });
    }
    
    const user = await User.create({
      email,
      password,
      role: role === 'admin' ? 'admin' : 'user',
    });
    
    res.status(201).json({
      _id: user._id,
      email: user.email,
      role: user.role,
    });
  } catch (error) {
    res.status(500).json({ message: "Erreur lors de l'inscription" });
  }
});

app.post("/api/users/admin", protect, admin, async (req, res) => {
  try {
    const { email, password } = req.body;
    
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: "Cet email est déjà utilisé" });
    }
    
    const user = await User.create({
      email,
      password,
      role: "admin",
    });
    
    res.status(201).json({
      _id: user._id,
      email: user.email,
      role: user.role,
    });
  } catch (error) {
    console.error("Erreur création admin:", error);
    res.status(500).json({ message: "Erreur lors de la création de l'admin" });
  }
});

// Produits
app.get("/api/products", getProducts);
app.get("/api/products/:id", getProductById);
app.post("/api/products", protect, admin, upload.array("media", 20), createProduct);
app.put("/api/products/:id", protect, admin, upload.array("media", 20), updateProduct);
app.delete("/api/products/:id", protect, admin, deleteProduct);
app.post("/api/products/upload", protect, admin, upload.array("media", 20), (req, res) => {
  const files = (req.files as Express.Multer.File[]);
  const images = files.filter(f => f.mimetype.startsWith('image/')).map(f => `/uploads/${f.filename}`);
  const videos = files.filter(f => f.mimetype.startsWith('video/')).map(f => `/uploads/${f.filename}`);
  res.json({ success: true, images, videos });
});

// Commandes
app.post("/api/orders", createOrder);
app.get("/api/orders", protect, admin, getOrders);
app.put("/api/orders/:id", protect, admin, updateOrderStatus);
app.delete("/api/orders/:id", protect, admin, deleteOrder);
app.post("/api/orders/delete-multiple", protect, admin, deleteMultipleOrders);

// Utilisateurs
app.get("/api/users", protect, admin, async (req, res) => {
  try {
    const users = await User.find({}).select('-password');
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur" });
  }
});

app.delete("/api/users/:id", protect, admin, async (req, res) => {
  try {
    const userToDelete = await User.findById(req.params.id);
    
    if (userToDelete?.email === "businessopentech@gmail.com") {
      return res.status(400).json({ message: "Impossible de supprimer le super admin" });
    }
    
    await User.findByIdAndDelete(req.params.id);
    res.json({ message: "Utilisateur supprimé avec succès" });
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur" });
  }
});

// ============ CONNEXION DB ET DÉMARRAGE ============

async function startServer() {
  try {
    // Connexion MongoDB
    const mongoUri = process.env.MONGODB_URI;
    if (!mongoUri) {
      throw new Error('MONGODB_URI non définie dans les variables d\'environnement');
    }
    
    await mongoose.connect(mongoUri);
    console.log("✅ Connected to MongoDB");
    
    // Création admin
    const adminEmail = process.env.ADMIN_EMAIL || "businessopentech@gmail.com";
    const adminExists = await User.findOne({ email: adminEmail });
    if (!adminExists) {
      await User.create({
        email: adminEmail,
        password: process.env.ADMIN_PASSWORD || "admin123",
        role: "admin",
      });
      console.log("👤 Admin user created");
    }
    
    // Seed produits
    const nb = await Product.countDocuments();
    if (nb === 0) {
      await Product.insertMany([
        {
          name: "Pack Start",
          description: "Produit exemple",
          price: 10000,
          category: "test",
          images: ["https://picsum.photos/seed/a1/600/400"],
          videos: [],
          features: ["démo"],
        },
      ]);
      console.log("🛠️ Produits de base créés");
    }
    
    console.log("✅ Toutes les routes API sont enregistrées");
    
    // Démarrer le serveur (sans Vite)
    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
      console.log(`📡 Health check: http://localhost:${PORT}/api/health`);
      console.log(`🔗 API disponible sur: http://localhost:${PORT}/api`);
    });
    
  } catch (error) {
    console.error('❌ Erreur au démarrage:', error);
    process.exit(1);
  }
}

// Lancer le serveur
startServer();