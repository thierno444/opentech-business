import dotenv from "dotenv";
dotenv.config();

import express from "express";
import path from "path";
import mongoose from "mongoose";
import cors from "cors";
import fs from "fs";
import multer from "multer";
import { createServer as createViteServer } from "vite";
import { getOrders, updateOrderStatus, createOrder, deleteOrder, deleteMultipleOrders } from "./src/backend/controllers/orderController";

import {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
} from "./src/backend/controllers/productController";
import { loginUser, registerUser } from "./src/backend/controllers/userController";
import { getOrders, updateOrderStatus, createOrder } from "./src/backend/controllers/orderController";
import { protect, admin } from "./src/backend/middleware/authMiddleware";
import { User } from "./src/backend/models/userModel";
import { Product } from "./src/backend/models/productModel";
import { Order } from "./src/backend/models/orderModel";

async function startServer() {
  const app = express();
  const PORT = process.env.PORT || 5000;

  // Configuration CORS
   // ============ CONFIGURATION CORS CORRIGÉE ============
  // Version simple pour le développement
  app.use(cors({
    origin: true, // Permet toutes les origines en développement
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept'],
  }));
  
  // Gestion explicite des requêtes OPTIONS
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
        features: ["démo"],
      },
    ]);
    console.log("🛠️ Produits de base créés");
  }

  // Upload fichiers
  const uploadDir = path.join(process.cwd(), "uploads");
  if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir);
  const storage = multer.diskStorage({
    destination: (_, __, cb) => cb(null, uploadDir),
    filename: (_, file, cb) => cb(null, file.fieldname + "-" + Date.now() + path.extname(file.originalname)),
  });
  const upload = multer({ storage });
  app.use("/uploads", express.static(uploadDir));

  // ============ ROUTES API (TOUTES AVANT VITE) ============
  
  // Test routes
  app.get('/api/test', (req, res) => {
    res.json({ message: 'API fonctionne!', port: PORT, timestamp: new Date() });
  });

  // Authentification
  app.post("/api/users/login", loginUser);
  app.post("/api/users/register", registerUser);

  // Produits
  app.get("/api/products", getProducts);
  app.get("/api/products/:id", getProductById);
  app.post("/api/products", protect, admin, upload.array("images", 10), createProduct);
  app.put("/api/products/:id", protect, admin, upload.array("images", 10), updateProduct);
  app.delete("/api/products/:id", protect, admin, deleteProduct);
  app.post("/api/products/upload", protect, admin, upload.array("images", 10), (req, res) => {
    const paths = (req.files as Express.Multer.File[]).map((f) => `/uploads/${f.filename}`);
    res.json({ success: true, images: paths });
  });

  // Commandes - UNE SEULE FOIS !
  app.post("/api/orders", createOrder);
  app.get("/api/orders", getOrders);
  app.put("/api/orders/:id", protect, admin, updateOrderStatus);

  // Commandes
  app.post("/api/orders", createOrder);
  app.get("/api/orders", protect, admin, getOrders);
  app.put("/api/orders/:id", protect, admin, updateOrderStatus);
  app.delete("/api/orders/:id", protect, admin, deleteOrder);  // Suppression unique
  app.post("/api/orders/delete-multiple", protect, admin, deleteMultipleOrders);  // Suppression multiple

  console.log("✅ Toutes les routes API sont enregistrées");

  // ============ SERVEUR VITE (APRÈS LES ROUTES API) ============
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