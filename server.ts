import dotenv from "dotenv";
dotenv.config();

import express from "express";
import path from "path";
import mongoose from "mongoose";
import cors from "cors";
import fs from "fs";
import multer from "multer";
import { createServer as createViteServer } from "vite";

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

async function startServer() {
  const app = express();
  const PORT = process.env.PORT || 5000;

  // Configuration CORS
  app.use(cors({
    origin: true,
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept'],
  }));
  
  app.options('*', (req, res) => {
    res.setHeader('Access-Control-Allow-Origin', req.headers.origin || '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS, PATCH');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With, Accept');
    res.setHeader('Access-Control-Allow-Credentials', 'true');
    res.sendStatus(204);
  });
  
  app.use(express.json());

  // Connexion DB
  const mongoUri = process.env.MONGODB_URI;
  await mongoose.connect(mongoUri as string)
    .then(() => console.log("✅ Connected to MongoDB"))
    .catch((err) => console.error("❌ Mongo connection error:", err));

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

  // Upload fichiers avec support vidéo
  const uploadDir = path.join(process.cwd(), "uploads");
  if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir);
  
  const storage = multer.diskStorage({
    destination: (_, __, cb) => cb(null, uploadDir),
    filename: (_, file, cb) => cb(null, file.fieldname + "-" + Date.now() + path.extname(file.originalname)),
  });
  
  // Configuration multer améliorée pour les vidéos
  const upload = multer({ 
    storage,
    limits: { 
      fileSize: 100 * 1024 * 1024, // 100MB pour les vidéos
      files: 20 // Jusqu'à 20 fichiers (images + vidéos)
    },
    fileFilter: (req, file, cb) => {
      // Accepter les images et les vidéos
      if (file.mimetype.startsWith('image/') || file.mimetype.startsWith('video/')) {
        cb(null, true);
      } else {
        cb(new Error('Format non supporté. Utilisez des images (JPEG, PNG, GIF) ou des vidéos (MP4, WebM)') as any, false);
      }
    }
  });
  
  app.use("/uploads", express.static(uploadDir));

  // ============ ROUTES API ============
  
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

  // Route spéciale pour créer des admins (protégée par admin)
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

  // Produits - avec support médias (images + vidéos)
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

  // Routes de gestion des utilisateurs
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

  console.log("✅ Toutes les routes API sont enregistrées");

  // ============ SERVEUR VITE ============
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const dist = path.join(process.cwd(), "dist");
    app.use(express.static(dist));
    app.get("*", (_, res) => res.sendFile(path.join(dist, "index.html")));
  }

  app.listen(PORT, () => console.log(`🚀 Server running on http://localhost:${PORT}`));
}

startServer();