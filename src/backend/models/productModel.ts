import mongoose, { Document, Schema } from "mongoose";

export interface IProduct extends Document {
  name: string;
  description: string;
  price: number;
  category: string;
  brand?: string;  // Nouveau: pour les marques d'ordinateurs
  images: string[];
  videos: string[];
  features: string[];
  whatsappLink?: string;
  // Promotion simple
  promoPrice?: number;      // Prix promo (0 = pas de promo)
  promoEndDate?: Date;      // Date de fin de la promo (optionnelle)
}

const productSchema = new Schema<IProduct>(
  {
    name: { type: String, required: true, trim: true },
    description: { type: String, required: true },
    price: { type: Number, required: true },
    category: { type: String, required: true },
    brand: { type: String, default: "" },
    images: { type: [String], default: [] },
    videos: { type: [String], default: [] },
    features: { type: [String], default: [] },
    whatsappLink: { type: String, default: "" },
    promoPrice: { type: Number, default: 0 },
    promoEndDate: { type: Date, default: null },
  },
  { timestamps: true }
);

export const Product = mongoose.model<IProduct>("Product", productSchema);