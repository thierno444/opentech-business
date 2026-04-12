import React, { useState, useEffect } from "react";
import axios from "axios";
import { motion, AnimatePresence } from "motion/react";
import {
  ShoppingCart,
  MessageCircle,
  Search,
  Star,
  CheckCircle2,
  X,
} from "lucide-react";
import { formatPrice, cn } from "../lib/utils";
import { useCart } from "../context/CartContext";
import { useNotification } from "../context/NotificationContext";

interface Product {
  _id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  images?: string[];
  image?: string;
  features: string[];
}

// Fonction WhatsApp intégrée
const sendWhatsAppMessage = (phoneNumber: string, message: string) => {
  const cleanPhone = phoneNumber.replace('+', '').replace(/\s/g, '');
  const encodedMessage = encodeURIComponent(message);
  const whatsappUrl = `https://wa.me/${cleanPhone}?text=${encodedMessage}`;
  window.open(whatsappUrl, '_blank');
};

export default function Shop() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [showModal, setShowModal] = useState(false);
  const [selectedImages, setSelectedImages] = useState<string[]>([]);
  const [loadingProduct, setLoadingProduct] = useState<string | null>(null);
  const { addToCart } = useCart();
  const { showSuccess, showError, showInfo } = useNotification();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const API_URL = 'http://localhost:5000';
        const { data } = await axios.get(`${API_URL}/api/products`);
        console.log("Produits chargés:", data.length);
        setProducts(data);
      } catch (error) {
        console.error("Error fetching products", error);
        showError("Erreur lors du chargement des produits");
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  const normalizeImages = (product: Product): string[] => {
    if (product.images && product.images.length > 0) return product.images;
    if (product.image) return [product.image];
    return [];
  };

  const filteredProducts = products.filter((p) => {
    const s = search.toLowerCase();
    return (
      (p.name.toLowerCase().includes(s) ||
        p.description.toLowerCase().includes(s)) &&
      (category === "All" || p.category === category)
    );
  });

  const categories = ["All", ...new Set(products.map((p) => p.category))];

  const handleWhatsAppOrder = async (product: Product) => {
    console.log("🚨 BOUTON CLIQUE - produit:", product.name);
    
    setLoadingProduct(product._id);
    const API_URL = 'http://localhost:5000';
    
    const orderData = {
      customerName: "Client Boutique",
      customerEmail: "client@boutique.com", 
      customerPhone: "771234567",
      items: [
        {
          name: product.name,
          price: product.price,
          quantity: 1,
        },
      ],
      totalAmount: product.price,
      message: `Commande du produit : ${product.name}`,
    };

    try {
      const res = await axios.post(`${API_URL}/api/orders`, orderData, {
        headers: { 
          "Content-Type": "application/json",
          "Accept": "application/json"
        },
        timeout: 10000,
      });
      
      showSuccess(`✨ Commande créée ! Total: ${formatPrice(product.price)}`);
      
      setTimeout(() => {
        const whatsappMessage = `Bonjour OpenTech Business, je souhaite commander : ${product.name} pour ${formatPrice(product.price)}`;
        sendWhatsAppMessage("221766560258", whatsappMessage);
      }, 1000);
      
    } catch (error: any) {
      console.error("❌ Erreur:", error);
      if (error.response) {
        showError(`❌ Erreur ${error.response.status}: ${error.response.data.message || 'Erreur serveur'}`);
      } else if (error.request) {
        showError("❌ Impossible de contacter le serveur");
      } else {
        showError(`❌ Erreur: ${error.message}`);
      }
    } finally {
      setLoadingProduct(null);
    }
  };

  const renderImageArea = (imgs: string[], productName: string) => {
    if (!imgs || imgs.length === 0) return null;
    if (imgs.length === 1) {
      return (
        <img
          src={imgs[0]}
          alt={productName}
          className="w-full h-64 object-cover"
        />
      );
    }
    return (
      <motion.div
        className="absolute inset-0 flex"
        animate={{ x: [0, "-100%"] }}
        transition={{
          repeat: Infinity,
          repeatType: "loop",
          duration: imgs.length * 6,
          ease: "linear",
        }}
        style={{ width: `${imgs.length * 100}%` }}
      >
        {imgs.map((src, i) => (
          <img
            key={i}
            src={src}
            alt={`${productName}-${i}`}
            className="w-full h-64 object-cover flex-shrink-0"
          />
        ))}
      </motion.div>
    );
  };

  if (loading) {
    return (
      <div className="pt-32 pb-24 px-6 min-h-screen flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="w-16 h-16 border-4 border-accent-cyan/20 border-t-accent-cyan rounded-full animate-spin mx-auto"></div>
          <p className="text-text-silver/60">Chargement des produits...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-32 pb-24 px-6 relative">
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-accent-blue/5 rounded-full blur-[120px]" />
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-accent-cyan/5 rounded-full blur-[120px]" />

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Titre */}
        <div className="text-center mb-20 space-y-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-block px-4 py-1 rounded-full glass border-white/10 text-accent-cyan text-xs font-black uppercase tracking-widest mb-4"
          >
            Solutions Digitales & Formations
          </motion.div>
          <h1 className="text-5xl md:text-7xl font-black tracking-tighter">
            Nos Packs & <span className="text-gradient">Formations</span>
          </h1>
        </div>

        {/* Filtres */}
        <div className="flex flex-col lg:flex-row gap-8 mb-16 items-center justify-between">
          <div className="relative w-full lg:w-[450px]">
            <Search
              className="absolute left-6 top-1/2 -translate-y-1/2 text-text-silver/40"
              size={20}
            />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Rechercher un pack..."
              className="w-full pl-16 pr-6 py-5 glass rounded-3xl focus:border-accent-cyan outline-none text-lg"
            />
          </div>
          <div className="flex gap-3 overflow-x-auto w-full lg:w-auto pb-4 no-scrollbar">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setCategory(cat)}
                className={cn(
                  "px-8 py-4 rounded-2xl text-sm font-black uppercase tracking-widest whitespace-nowrap transition-all",
                  category === cat
                    ? "bg-accent-blue text-white glow-blue"
                    : "glass border-white/5 text-text-silver/60 hover:bg-white/10"
                )}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Grille des produits */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          <AnimatePresence mode="popLayout">
            {filteredProducts.map((product) => {
              const imgs = normalizeImages(product);
              return (
                <motion.div
                  key={product._id}
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  whileHover={{ y: -15 }}
                  className="glass rounded-[40px] overflow-hidden flex flex-col group border-white/5 hover:border-accent-cyan/30 transition-all duration-500 cursor-pointer"
                  onClick={() => {
                    if (imgs.length) {
                      setSelectedImages(imgs);
                      setShowModal(true);
                    }
                  }}
                >
                  <div className="h-64 relative overflow-hidden">
                    {renderImageArea(imgs, product.name)}
                    <div className="absolute inset-0 bg-gradient-to-t from-primary/90 via-transparent to-transparent opacity-60" />
                    <div className="absolute top-6 left-6 px-4 py-1 bg-accent-blue/80 backdrop-blur-md text-white text-[10px] font-black uppercase tracking-widest rounded-full">
                      {product.category}
                    </div>
                    <div className="absolute bottom-6 left-6 flex items-center gap-1 text-accent-orange">
                      {[1, 2, 3, 4, 5].map((n) => (
                        <Star key={n} size={14} fill="currentColor" />
                      ))}
                    </div>
                  </div>

                  <div className="p-10 flex-1 flex flex-col space-y-6">
                    <div className="space-y-2">
                      <h3 className="text-2xl font-black leading-tight group-hover:text-accent-cyan transition-colors">
                        {product.name}
                      </h3>
                      <p className="text-sm text-text-silver/40 line-clamp-2">
                        {product.description}
                      </p>
                    </div>

                    <div className="space-y-3 flex-1">
                      {product.features.map((f, i) => (
                        <div
                          key={i}
                          className="flex items-start gap-3 text-xs text-text-silver/70"
                        >
                          <CheckCircle2
                            size={16}
                            className="text-accent-green shrink-0"
                          />
                          <span>{f}</span>
                        </div>
                      ))}
                    </div>

                    <div className="pt-8 border-t border-white/5 flex items-center justify-between">
                      <div className="flex flex-col">
                        <span className="text-xs text-text-silver/40 uppercase font-bold tracking-widest">
                          Prix
                        </span>
                        <span className="text-3xl font-black text-white">
                          {formatPrice(product.price)}
                        </span>
                      </div>
                      <div className="flex gap-3">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            addToCart(product);
                            showInfo(`🛒 ${product.name} ajouté au panier`);
                          }}
                          className="w-12 h-12 glass border-white/10 rounded-xl text-accent-cyan hover:bg-accent-cyan hover:text-white flex items-center justify-center transition-all"
                        >
                          <ShoppingCart size={20} />
                        </button>
                        <button
                          onClick={async (e) => {
                            e.stopPropagation();
                            e.preventDefault();
                            await handleWhatsAppOrder(product);
                          }}
                          disabled={loadingProduct === product._id}
                          className="w-12 h-12 bg-accent-orange rounded-xl text-white glow-orange hover:scale-110 flex items-center justify-center transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          {loadingProduct === product._id ? (
                            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                          ) : (
                            <MessageCircle size={20} />
                          )}
                        </button>
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      </div>

      {/* Aperçu plein écran */}
      <AnimatePresence>
        {showModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4"
            onClick={() => setShowModal(false)}
          >
            <div
              onClick={(e) => e.stopPropagation()}
              className="max-w-4xl w-full relative"
            >
              <button
                onClick={() => setShowModal(false)}
                className="absolute top-4 right-4 text-white hover:text-red-400 z-10"
              >
                <X size={28} />
              </button>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {selectedImages.map((src, i) => (
                  <motion.img
                    key={i}
                    src={src}
                    alt={`img-${i}`}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: i * 0.1 }}
                    className="object-cover w-full h-80 rounded-xl"
                  />
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}