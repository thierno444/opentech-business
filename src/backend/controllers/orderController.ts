import { Request, Response } from "express";
import { Order } from "../models/orderModel";
import mongoose from "mongoose";

/* ---------------------- Créer une commande ---------------------- */
export const createOrder = async (req: Request, res: Response) => {
  try {
    console.log("📦 [CONTROLLER] Réception commande:", req.body);
    
    const { customerName, customerEmail, customerPhone, items, totalAmount, message } = req.body;
    
    if (!items || !Array.isArray(items) || items.length === 0) {
      console.log("❌ [CONTROLLER] Pas d'items dans la commande");
      return res.status(400).json({ 
        success: false, 
        message: "Aucun article dans la commande." 
      });
    }

    const preparedItems = items.map((item: any) => ({
      productId: item.productId && mongoose.Types.ObjectId.isValid(item.productId) 
        ? new mongoose.Types.ObjectId(item.productId) 
        : null,
      name: item.name || "Produit sans nom",
      price: Number(item.price) || 0,
      quantity: Number(item.quantity) || 1
    }));

    const orderData = {
      customerName: customerName || "Client anonyme",
      customerEmail: customerEmail || "",
      customerPhone: customerPhone || "Non renseigné",
      items: preparedItems,
      totalAmount: Number(totalAmount) || 0,
      message: message || "",
      status: "pending"
    };

    const order = await Order.create(orderData);
    
    console.log("✅ [CONTROLLER] Commande créée avec succès:", {
      id: order._id,
      customerName: order.customerName,
      totalAmount: order.totalAmount
    });
    
    res.status(201).json({
      success: true,
      data: order,
      message: "Commande créée avec succès"
    });
    
  } catch (error: any) {
    console.error("❌ [CONTROLLER] Erreur createOrder:", error);
    res.status(500).json({ 
      success: false, 
      message: "Erreur serveur lors de la création de la commande",
      error: error.message 
    });
  }
};

/* ---------------------- Récupérer les commandes ---------------------- */
export const getOrders = async (_req: Request, res: Response) => {
  try {
    const orders = await Order.find({}).sort({ createdAt: -1 });
    console.log(`📋 [CONTROLLER] ${orders.length} commandes trouvées`);
    res.status(200).json(orders);
  } catch (error: any) {
    console.error("❌ [CONTROLLER] Erreur getOrders:", error);
    res.status(500).json({ 
      success: false, 
      message: "Erreur serveur",
      error: error.message 
    });
  }
};

/* ---------------------- Mettre à jour le statut ---------------------- */
export const updateOrderStatus = async (req: Request, res: Response) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) {
      return res.status(404).json({ 
        success: false, 
        message: "Commande non trouvée" 
      });
    }

    order.status = req.body.status || order.status;
    const updatedOrder = await order.save();
    
    console.log(`🔄 [CONTROLLER] Statut commande ${order._id} mis à jour: ${order.status} → ${updatedOrder.status}`);
    
    res.status(200).json({
      success: true,
      data: updatedOrder
    });
  } catch (error: any) {
    console.error("❌ [CONTROLLER] Erreur updateOrderStatus:", error);
    res.status(400).json({ 
      success: false, 
      message: "Données invalides",
      error: error.message 
    });
  }
};

/* ---------------------- Supprimer une commande ---------------------- */
export const deleteOrder = async (req: Request, res: Response) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) {
      return res.status(404).json({ 
        success: false, 
        message: "Commande non trouvée" 
      });
    }

    await order.deleteOne();
    console.log(`🗑️ [CONTROLLER] Commande ${req.params.id} supprimée`);
    
    res.status(200).json({
      success: true,
      message: "Commande supprimée avec succès"
    });
  } catch (error: any) {
    console.error("❌ [CONTROLLER] Erreur deleteOrder:", error);
    res.status(500).json({ 
      success: false, 
      message: "Erreur lors de la suppression",
      error: error.message 
    });
  }
};

/* ---------------------- Supprimer plusieurs commandes ---------------------- */
export const deleteMultipleOrders = async (req: Request, res: Response) => {
  try {
    const { orderIds } = req.body;
    
    if (!orderIds || !Array.isArray(orderIds) || orderIds.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Aucun ID de commande fourni"
      });
    }

    const result = await Order.deleteMany({ _id: { $in: orderIds } });
    console.log(`🗑️ [CONTROLLER] ${result.deletedCount} commandes supprimées`);
    
    res.status(200).json({
      success: true,
      message: `${result.deletedCount} commande(s) supprimée(s) avec succès`,
      deletedCount: result.deletedCount
    });
  } catch (error: any) {
    console.error("❌ [CONTROLLER] Erreur deleteMultipleOrders:", error);
    res.status(500).json({
      success: false,
      message: "Erreur lors de la suppression multiple",
      error: error.message
    });
  }
};