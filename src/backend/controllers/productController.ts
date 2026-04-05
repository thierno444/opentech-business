import { Request, Response } from "express";
import { Product } from "../models/productModel";

/* ------------ Récupération de tous les produits ------------ */
export const getProducts = async (_req: Request, res: Response) => {
  try {
    const products = await Product.find({});
    res.json(products);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Erreur serveur" });
  }
};

/* ------------ Récupération d’un produit ------------ */
export const getProductById = async (req: Request, res: Response) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: "Produit non trouvé" });
    res.json(product);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Erreur serveur" });
  }
};

/* ------------ Création d’un produit ------------ */
export const createProduct = async (req: Request, res: Response) => {
  try {
    const { name, description, price, category, features, whatsappLink } = req.body;

    // 🔹 extraction correcte du champ images (array / string / JSON)
    let images: string[] = [];
    if (Array.isArray(req.body.images)) {
      images = req.body.images;
    } else if (typeof req.body.images === "string") {
      try {
        const parsed = JSON.parse(req.body.images);
        images = Array.isArray(parsed) ? parsed : [parsed];
      } catch {
        images = [req.body.images];
      }
    }

    // 🔹 fallback : si rien reçu, mais qu’un upload existe en mémoire
    if (!images.length && (req as any).files?.length > 0) {
      const uploaded = (req as any).files.map(
        (f: Express.Multer.File) => `/uploads/${f.filename}`
      );
      images = uploaded;
    }

    const product = await Product.create({
      name,
      description,
      price,
      category,
      images,
      features,
      whatsappLink,
    });

    res.status(201).json(product);
  } catch (err) {
    console.error("Erreur createProduct:", err);
    res.status(400).json({ message: "Données produit invalides" });
  }
};

/* ------------ Mise à jour ------------ */
export const updateProduct = async (req: Request, res: Response) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: "Produit non trouvé" });

    const { name, description, price, category, features, whatsappLink } = req.body;

    let images: string[] = [];
    if (Array.isArray(req.body.images)) {
      images = req.body.images;
    } else if (typeof req.body.images === "string") {
      try {
        const parsed = JSON.parse(req.body.images);
        images = Array.isArray(parsed) ? parsed : [parsed];
      } catch {
        images = [req.body.images];
      }
    }

    // 🔹 si requête multipart → prendre les fichiers uploadés
    if (!images.length && (req as any).files?.length > 0) {
      const uploaded = (req as any).files.map(
        (f: Express.Multer.File) => `/uploads/${f.filename}`
      );
      images = uploaded;
    }

    // 🔹 appliquer les champs modifiés
    if (name) product.name = name;
    if (description) product.description = description;
    if (price) product.price = price;
    if (category) product.category = category;
    if (features) product.features = features;
    if (whatsappLink) product.whatsappLink = whatsappLink;
    if (images.length) product.images = images;

    const updated = await product.save();
    res.json(updated);
  } catch (err) {
    console.error("Erreur updateProduct:", err);
    res.status(400).json({ message: "Erreur lors de la mise à jour" });
  }
};

/* ------------ Suppression ------------ */
export const deleteProduct = async (req: Request, res: Response) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: "Produit non trouvé" });
    await product.deleteOne();
    res.json({ message: "Produit supprimé" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Erreur serveur" });
  }
};