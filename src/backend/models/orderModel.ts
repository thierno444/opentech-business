import mongoose from "mongoose";

const OrderItemSchema = new mongoose.Schema({
  productId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: "Product", 
    default: null,
    required: false  // Rendre optionnel
  },
  name: { type: String, required: true },
  price: { type: Number, required: true },
  quantity: { type: Number, required: true, default: 1 },
});

const OrderSchema = new mongoose.Schema(
  {
    customerName: { type: String, required: true, default: "Anonyme" },
    customerEmail: { type: String, default: "" },
    customerPhone: { type: String, default: "Non renseigné" },
    items: [OrderItemSchema],
    totalAmount: { type: Number, required: true, default: 0 },
    status: {
      type: String,
      enum: ["pending", "validated", "delivered"],
      default: "pending",
    },
    message: { type: String, default: "" },
  },
  { timestamps: true }
);

export const Order = mongoose.models.Order || mongoose.model("Order", OrderSchema);