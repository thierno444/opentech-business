import dotenv from "dotenv";
dotenv.config();
import express from "express";
import path from "path";
import mongoose from "mongoose";
import cors from "cors";
import { createServer as createViteServer } from "vite";
import {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
} from "./src/backend/controllers/productController";
import { loginUser, registerUser } from "./src/backend/controllers/userController";
import {
  createOrder,
  getOrders,
  updateOrderStatus,
} from "./src/backend/controllers/orderController";
import { protect, admin } from "./src/backend/middleware/authMiddleware";
import { User } from "./src/backend/models/userModel";
import { Product } from "./src/backend/models/productModel";
import multer from "multer";
import fs from "fs";

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(cors());
  app.use(express.json());

  /* ------------------------------ MongoDB ------------------------------ */
  const mongoUri = process.env.MONGODB_URI;
  if (mongoUri) {
    mongoose
      .connect(mongoUri)
      .then(async () => {
        console.log("✅ Connected to MongoDB");

        // Création de l'administrateur s'il n'existe pas
        const adminEmail =
          process.env.ADMIN_EMAIL || "businessopentech@gmail.com";
        const adminExists = await User.findOne({ email: adminEmail });
        if (!adminExists) {
          await User.create({
            email: adminEmail,
            password: process.env.ADMIN_PASSWORD || "admin123",
            role: "admin",
          });
          console.log("👤 Admin user created");
        }

        // Produits de base, uniquement si vide
        const count = await Product.countDocuments();
        if (count === 0) {
          const init = [
            {
              name: "Pack Site Vitrine Starter",
              description: "Idéal pour débuter votre présence en ligne.",
              price: 80000,
              category: "Web",
              images: ["https://picsum.photos/seed/web1/800/600"],
              features: ["5 pages", "Responsive", "Contact Form"],
            },
            {
              name: "Pack E-commerce Starter",
              description: "Vendez vos produits en ligne facilement.",
              price: 150000,
              category: "E-commerce",
              images: ["https://picsum.photos/seed/shop1/800/600"],
              features: ["Boutique", "Panier", "Paiement"],
            },
          ];
          await Product.insertMany(init);
          console.log("🛠️ Base products seeded");
        }
      })
      .catch((err) => console.error("MongoDB connection error:", err));
  } else {
    console.warn(
      "⚠️  MONGODB_URI not found in environment variables. Database features will not work."
    );
  }

  /* ----------------------------- Upload images ----------------------------- */
  const uploadDir = path.join(process.cwd(), "uploads");
  if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir);

  const storage = multer.diskStorage({
    destination: (_req, _file, cb) => cb(null, uploadDir),
    filename: (_req, file, cb) => {
      const unique = Date.now() + "-" + Math.round(Math.random() * 1e9);
      cb(null, file.fieldname + "-" + unique + path.extname(file.originalname));
    },
  });
  const upload = multer({ storage });

  // Route d'upload simple (si besoin)
  app.post(
    "/api/products/upload",
    protect,
    admin,
    upload.array("images", 10),
    (req, res) => {
      if (!(req.files instanceof Array))
        return res.status(400).json({ message: "No files received" });
      const paths = req.files.map((f) => `/uploads/${f.filename}`);
      res.json({ success: true, images: paths });
    }
  );

  // Servir les images
  app.use("/uploads", express.static(uploadDir));

  /* --------------------------- API principales --------------------------- */
  app.post("/api/users/login", loginUser);
  app.post("/api/users/register", registerUser);

  app.get("/api/products", getProducts);
  app.get("/api/products/:id", getProductById);
  // ⬇️ upload multiple possible directement pendant create / update
  app.post("/api/products", protect, admin, upload.array("images", 10), createProduct);
  app.put("/api/products/:id", protect, admin, upload.array("images", 10), updateProduct);
  app.delete("/api/products/:id", protect, admin, deleteProduct);

  app.post("/api/orders", createOrder);
  app.get("/api/orders", protect, admin, getOrders);
  app.put("/api/orders/:id", protect, admin, updateOrderStatus);

  /* ---------------------------- Serveur Vite ---------------------------- */
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (_req, res) =>
      res.sendFile(path.join(distPath, "index.html"))
    );
  }

  /* ----------------------------- Lancement ----------------------------- */
  app.listen(PORT, () =>
    console.log(`🚀 Server running on http://localhost:${PORT}`)
  );
}

startServer();