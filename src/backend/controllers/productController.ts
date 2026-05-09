import { Request, Response } from "express";
import { Product } from "../models/productModel";
import fs from "fs";
import path from "path";

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
    const { name, description, price, category, brand, features, whatsappLink, promoPrice, promoEndDate } = req.body;

    let images: string[] = [];
    let videos: string[] = [];

    if ((req as any).files && (req as any).files.length > 0) {
      for (const file of (req as any).files) {
        const filePath = `/uploads/${file.filename}`;
        if (file.mimetype.startsWith('image/')) {
          images.push(filePath);
        } else if (file.mimetype.startsWith('video/')) {
          videos.push(filePath);
        }
      }
    }

    let parsedFeatures = features;
    if (typeof features === "string") {
      try {
        parsedFeatures = JSON.parse(features);
      } catch {
        parsedFeatures = features ? [features] : [];
      }
    }

    // Gérer la date de fin de promotion
    let parsedPromoEndDate = null;
    if (promoEndDate && promoEndDate !== "") {
      parsedPromoEndDate = new Date(promoEndDate);
      // Fixer à 23:59:59 pour que la promo soit valable toute la journée
      parsedPromoEndDate.setHours(23, 59, 59, 999);
    }

    const product = await Product.create({
      name,
      description,
      price,
      category,
      brand: brand || "",
      images,
      videos,
      features: Array.isArray(parsedFeatures) ? parsedFeatures : [],
      whatsappLink,
      promoPrice: promoPrice ? Number(promoPrice) : 0,
      promoEndDate: parsedPromoEndDate,
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

    const { 
      name, 
      description, 
      price, 
      category, 
      brand, 
      features, 
      whatsappLink, 
      existingImages, 
      existingVideos, 
      imagesToDelete, 
      videosToDelete, 
      promoPrice, 
      promoEndDate 
    } = req.body;

    // Gérer les images
    let finalImages: string[] = [];
    if (existingImages) {
      try {
        finalImages = JSON.parse(existingImages);
      } catch {
        finalImages = Array.isArray(existingImages) ? existingImages : [];
      }
    } else {
      finalImages = [...product.images];
    }
    
    let finalVideos: string[] = [];
    if (existingVideos) {
      try {
        finalVideos = JSON.parse(existingVideos);
      } catch {
        finalVideos = Array.isArray(existingVideos) ? existingVideos : [];
      }
    } else {
      finalVideos = [...product.videos];
    }
    
    if ((req as any).files && (req as any).files.length > 0) {
      for (const file of (req as any).files) {
        const filePath = `/uploads/${file.filename}`;
        if (file.mimetype.startsWith('image/')) {
          finalImages.push(filePath);
        } else if (file.mimetype.startsWith('video/')) {
          finalVideos.push(filePath);
        }
      }
    }

    const deleteFiles = async (filesToDelete: string[]) => {
      for (const filePath of filesToDelete) {
        const fullPath = path.join(process.cwd(), filePath);
        if (fs.existsSync(fullPath)) {
          fs.unlinkSync(fullPath);
        }
      }
    };

    if (imagesToDelete) {
      let toDelete: string[] = [];
      try {
        toDelete = JSON.parse(imagesToDelete);
      } catch {
        toDelete = Array.isArray(imagesToDelete) ? imagesToDelete : [];
      }
      await deleteFiles(toDelete);
    }

    if (videosToDelete) {
      let toDelete: string[] = [];
      try {
        toDelete = JSON.parse(videosToDelete);
      } catch {
        toDelete = Array.isArray(videosToDelete) ? videosToDelete : [];
      }
      await deleteFiles(toDelete);
    }

    let parsedFeatures = features;
    if (typeof features === "string") {
      try {
        parsedFeatures = JSON.parse(features);
      } catch {
        parsedFeatures = features ? [features] : product.features;
      }
    }

    // Mise à jour des champs de base
    if (name) product.name = name;
    if (description) product.description = description;
    if (price) product.price = price;
    if (category) product.category = category;
    if (brand !== undefined) product.brand = brand;
    if (parsedFeatures) product.features = Array.isArray(parsedFeatures) ? parsedFeatures : product.features;
    if (whatsappLink) product.whatsappLink = whatsappLink;
    if (finalImages.length >= 0) product.images = finalImages;
    if (finalVideos.length >= 0) product.videos = finalVideos;
    
    // Gestion de la promotion
    if (promoPrice !== undefined) {
      product.promoPrice = Number(promoPrice) || 0;
    }
    
    // Gestion de la date de fin de promotion
    if (promoEndDate !== undefined) {
      if (promoEndDate && promoEndDate !== "") {
        const endDate = new Date(promoEndDate);
        endDate.setHours(23, 59, 59, 999);
        product.promoEndDate = endDate;
      } else {
        product.promoEndDate = null;
      }
    }

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
    
    if (product.images && product.images.length > 0) {
      for (const imgPath of product.images) {
        const fullPath = path.join(process.cwd(), imgPath);
        if (fs.existsSync(fullPath)) {
          fs.unlinkSync(fullPath);
        }
      }
    }
    
    if (product.videos && product.videos.length > 0) {
      for (const videoPath of product.videos) {
        const fullPath = path.join(process.cwd(), videoPath);
        if (fs.existsSync(fullPath)) {
          fs.unlinkSync(fullPath);
        }
      }
    }
    
    await product.deleteOne();
    res.json({ message: "Produit supprimé" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Erreur serveur" });
  }
};