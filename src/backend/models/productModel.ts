import mongoose, { Document, Schema } from "mongoose";

/**
 * Interface TypeScript – structure d’un produit
 */
export interface IProduct extends Document {
  name: string;
  description: string;
  price: number;
  category: string;
  images: string[];       // tableau d’images
  features: string[];
  whatsappLink?: string;
}

/**
 * Schéma Mongoose du produit
 */
const productSchema = new Schema<IProduct>(
  {
    name: { type: String, required: true, trim: true },
    description: { type: String, required: true },
    price: { type: Number, required: true },
    category: { type: String, required: true },
    // Plusieurs images stockées sous forme de tableau
    images: { type: [String], default: [] },
    features: { type: [String], default: [] },
    whatsappLink: { type: String, default: "" },
  },
  { timestamps: true }
);

export const Product = mongoose.model<IProduct>("Product", productSchema);