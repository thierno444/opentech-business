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
  Play,
  Maximize2,
  Filter,
} from "lucide-react";
import { formatPrice, cn } from "../lib/utils";
import { useCart } from "../context/CartContext";
import { useNotification } from "../context/NotificationContext";
import { API_URL } from "../config/api";  // ← AJOUT DE L'IMPORT

interface Product {
  _id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  brand?: string;
  images?: string[];
  videos?: string[];
  image?: string;
  features: string[];
  promoPrice?: number;
  promoEndDate?: string;
}

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
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedBrand, setSelectedBrand] = useState("All");
  const [showFilters, setShowFilters] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [selectedMedia, setSelectedMedia] = useState<{ type: 'image' | 'video', url: string }[]>([]);
  const [currentMediaIndex, setCurrentMediaIndex] = useState(0);
  const [loadingProduct, setLoadingProduct] = useState<string | null>(null);
  const { addToCart } = useCart();
  const { showSuccess, showError, showInfo } = useNotification();

  useEffect(() => {
  const fetchProducts = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_URL}/api/products`);
      
      console.log("📦 Réponse API brute:", response.data);
      
      // Normalisation des données
      let productsData = [];
      if (Array.isArray(response.data)) {
        productsData = response.data;
      } else if (response.data && typeof response.data === 'object') {
        // Chercher un tableau dans l'objet réponse
        const possibleArrays = ['data', 'products', 'items', 'mesures', 'results'];
        for (const key of possibleArrays) {
          if (response.data[key] && Array.isArray(response.data[key])) {
            productsData = response.data[key];
            console.log(`✅ Trouvé tableau dans la propriété "${key}"`);
            break;
          }
        }
      }
      
      // Si toujours vide, essayer de convertir l'objet en tableau si c'est un objet numéroté
      if (productsData.length === 0 && response.data && typeof response.data === 'object') {
        const values = Object.values(response.data);
        if (values.length > 0 && Array.isArray(values[0])) {
          productsData = values[0];
        }
      }
      
      console.log("✅ Produits chargés:", productsData.length);
      setProducts(productsData);
    } catch (error) {
      console.error("❌ Erreur fetch produits:", error);
      showError("Erreur lors du chargement des produits");
      setProducts([]);
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

  // Vérifier si promotion active
  const isPromoActive = (product: Product): boolean => {
    if (!product.promoPrice || product.promoPrice <= 0) return false;
    if (!product.promoEndDate) return true;
    const endDate = new Date(product.promoEndDate);
    return endDate > new Date();
  };

  // Obtenir le prix actuel
  const getCurrentPrice = (product: Product): number => {
    if (isPromoActive(product) && product.promoPrice && product.promoPrice > 0) {
      return product.promoPrice;
    }
    return product.price;
  };
  
  // Récupérer toutes les catégories
  const categories = ["All", ...new Set(products.map((p) => p.category).filter(Boolean))];
  
  // 🔧 CORRECTION ICI : Récupérer les marques UNIQUEMENT pour la catégorie sélectionnée
  const getBrandsForSelectedCategory = () => {
    if (selectedCategory === "All") {
      // Si "Tous", on renvoie un tableau vide car on ne veut pas de filtre marque
      return [];
    }
    // Filtrer les produits par la catégorie sélectionnée, puis prendre leurs marques
    return [...new Set(
      products
        .filter(p => p.category === selectedCategory && p.brand)
        .map(p => p.brand)
        .filter(Boolean)
    )];
  };

  const brandsForCategory = getBrandsForSelectedCategory();
  const brands = ["All", ...brandsForCategory];

  // Filtrer les produits
  const filteredProducts = products.filter((p) => {
    const matchesSearch = p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.description.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = selectedCategory === "All" || p.category === selectedCategory;
    // 🔧 CORRECTION : Ne filtrer par marque que si une marque est sélectionnée ET que la catégorie correspond
    const matchesBrand = selectedBrand === "All" || (p.brand === selectedBrand && p.category === selectedCategory);
    return matchesSearch && matchesCategory && matchesBrand;
  });

  // Réinitialiser la marque quand la catégorie change
  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category);
    setSelectedBrand("All"); // ← Important : réinitialiser la marque
  };

  const openMediaModal = (product: Product) => {
    const images = normalizeImages(product);
    const videos = product.videos || [];
    const allMedia = [
      ...videos.map(v => ({ type: 'video' as const, url: v })),
      ...images.map(i => ({ type: 'image' as const, url: i }))
    ];
    setSelectedMedia(allMedia);
    setCurrentMediaIndex(0);
    setShowModal(true);
  };

  const renderMediaThumbnail = (product: Product) => {
    const images = normalizeImages(product);
    const videos = product.videos || [];
    const hasVideo = videos.length > 0;
    const firstImage = images[0];
    
    if (hasVideo) {
      return (
        <div className="relative w-full h-64 group/video cursor-pointer">
          {firstImage ? (
            <img src={firstImage} alt={product.name} className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full bg-black/50 flex items-center justify-center">
              <video className="w-full h-full object-cover" src={videos[0]} />
            </div>
          )}
          <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
            <div className="w-16 h-16 bg-accent-cyan/90 rounded-full flex items-center justify-center transform transition-transform group-hover/video:scale-110">
              <Play size={32} className="text-white ml-1" />
            </div>
          </div>
          <div className="absolute bottom-2 right-2 px-2 py-1 bg-black/60 rounded-lg text-xs flex items-center gap-1">
            <Play size={12} /> Vidéo
          </div>
        </div>
      );
    }
    
    if (images.length === 1) {
      return (
        <img src={images[0]} alt={product.name} className="w-full h-64 object-cover cursor-pointer" />
      );
    }
    
    return (
      <motion.div
        className="absolute inset-0 flex cursor-pointer"
        animate={{ x: [0, "-100%"] }}
        transition={{
          repeat: Infinity,
          repeatType: "loop",
          duration: images.length * 6,
          ease: "linear",
        }}
        style={{ width: `${images.length * 100}%` }}
      >
        {images.map((src, i) => (
          <img key={i} src={src} alt={`${product.name}-${i}`} className="w-full h-64 object-cover flex-shrink-0" />
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

        {/* Filtres avec catégorie et marque */}
        <div className="flex flex-col gap-6 mb-16">
          <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
            <div className="relative w-full lg:w-[450px]">
              <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-text-silver/40" size={20} />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Rechercher un produit..."
                className="w-full pl-16 pr-6 py-5 glass rounded-3xl focus:border-accent-cyan outline-none text-lg"
              />
            </div>
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-2 px-6 py-3 glass rounded-2xl hover:bg-white/10 transition-all"
            >
              <Filter size={18} />
              <span className="font-bold text-sm">Filtres</span>
            </button>
          </div>

          <AnimatePresence>
            {showFilters && (
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="glass rounded-3xl p-6 space-y-6"
              >
                {/* Filtre par catégorie */}
                <div>
                  <h3 className="text-sm font-black uppercase tracking-widest text-accent-cyan mb-3">Catégories</h3>
                  <div className="flex flex-wrap gap-2">
                    {categories.map((cat) => (
                      <button
                        key={cat}
                        onClick={() => handleCategoryChange(cat)} // ← Utiliser handleCategoryChange
                        className={cn(
                          "px-5 py-2 rounded-xl text-sm font-bold transition-all",
                          selectedCategory === cat
                            ? "bg-accent-blue text-white"
                            : "glass border-white/10 hover:bg-white/10"
                        )}
                      >
                        {cat === "All" ? "Tous" : cat}
                      </button>
                    ))}
                  </div>
                </div>

                {/* 🔧 CORRECTION : Filtre par marque - visible seulement si une catégorie spécifique est sélectionnée ET qu'il y a des marques */}
                {selectedCategory !== "All" && brands.length > 1 && (
                  <div>
                    <h3 className="text-sm font-black uppercase tracking-widest text-accent-cyan mb-3">
                      Marques ({selectedCategory})
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {brands.map((brand) => (
                        <button
                          key={brand}
                          onClick={() => setSelectedBrand(brand)}
                          className={cn(
                            "px-5 py-2 rounded-xl text-sm font-bold transition-all",
                            selectedBrand === brand
                              ? "bg-accent-blue text-white"
                              : "glass border-white/10 hover:bg-white/10"
                          )}
                        >
                          {brand === "All" ? "Toutes les marques" : brand}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {(selectedCategory !== "All" || selectedBrand !== "All" || search) && (
                  <div className="pt-4 border-t border-white/10">
                    <p className="text-sm text-text-silver/40">{filteredProducts.length} produit(s) trouvé(s)</p>
                    <button
                      onClick={() => {
                        setSelectedCategory("All");
                        setSelectedBrand("All");
                        setSearch("");
                      }}
                      className="text-xs text-accent-cyan hover:underline mt-2"
                    >
                      Réinitialiser les filtres
                    </button>
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Grille des produits */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          <AnimatePresence mode="popLayout">
            {filteredProducts.map((product) => {
              const imgs = normalizeImages(product);
              const hasPromo = isPromoActive(product);
              const currentPrice = getCurrentPrice(product);
              const savedAmount = hasPromo ? product.price - currentPrice : 0;
              
              return (
                <motion.div
                  key={product._id}
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  whileHover={{ y: -15 }}
                  className="glass rounded-[40px] overflow-hidden flex flex-col group border-white/5 hover:border-accent-cyan/30 transition-all duration-500"
                >
                  {/* Badge promotion */}
                  {hasPromo && (
                    <div className="absolute top-4 right-4 z-20">
                      <div className="bg-gradient-to-r from-accent-orange to-red-500 text-white px-3 py-1.5 rounded-xl text-xs font-black uppercase tracking-widest shadow-lg">
                        -{Math.round(((product.price - currentPrice) / product.price) * 100)}%
                      </div>
                    </div>
                  )}

                  {/* Badge catégorie */}
                  <div className="absolute top-4 left-4 z-20">
                    <div className="px-3 py-1.5 bg-accent-blue/90 backdrop-blur-md text-white text-[10px] font-black uppercase tracking-widest rounded-xl shadow-lg">
                      {product.category}
                    </div>
                  </div>

                  {/* Badge marque */}
                  {product.brand && (
                    <div className="absolute bottom-4 left-4 z-20">
                      <div className="px-3 py-1 bg-black/60 backdrop-blur-md rounded-xl text-xs font-bold">
                        {product.brand}
                      </div>
                    </div>
                  )}

                  <div 
                    className="h-64 relative overflow-hidden cursor-pointer"
                    onClick={() => openMediaModal(product)}
                  >
                    {renderMediaThumbnail(product)}
                    <div className="absolute inset-0 bg-gradient-to-t from-primary/90 via-transparent to-transparent opacity-60 pointer-events-none" />
                    <div className="absolute bottom-6 left-6 flex items-center gap-1 text-accent-orange pointer-events-none">
                      {[1, 2, 3, 4, 5].map((n) => (
                        <Star key={n} size={14} fill="currentColor" />
                      ))}
                    </div>
                  </div>

                  <div className="p-10 flex-1 flex flex-col space-y-6">
                    <div className="space-y-2">
                      <h3 className="text-2xl font-black leading-tight group-hover:text-accent-cyan transition-colors line-clamp-2">
                        {product.name}
                      </h3>
                      <p className="text-sm text-text-silver/40 line-clamp-2">
                        {product.description}
                      </p>
                    </div>

                    <div className="space-y-3 flex-1">
                      {product.features.slice(0, 3).map((f, i) => (
                        <div key={i} className="flex items-start gap-3 text-xs text-text-silver/70">
                          <CheckCircle2 size={16} className="text-accent-green shrink-0" />
                          <span>{f}</span>
                        </div>
                      ))}
                      {product.features.length > 3 && (
                        <p className="text-xs text-text-silver/40">+{product.features.length - 3} autres caractéristiques</p>
                      )}
                    </div>

                    <div className="pt-8 border-t border-white/5">
                      {hasPromo ? (
                        <div className="flex flex-col gap-1">
                          <div className="flex items-center gap-3">
                            <span className="text-3xl font-black text-accent-orange">
                              {formatPrice(currentPrice)}
                            </span>
                            <span className="text-sm text-text-silver/40 line-through">
                              {formatPrice(product.price)}
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-xs text-accent-green">
                              Économisez {formatPrice(savedAmount)}
                            </span>
                          </div>
                          {product.promoEndDate && new Date(product.promoEndDate) > new Date() && (
                            <div className="text-[10px] text-text-silver/40">
                              Offre valable jusqu'au {new Date(product.promoEndDate).toLocaleDateString('fr-FR')}
                            </div>
                          )}
                        </div>
                      ) : (
                        <div className="flex flex-col">
                          <span className="text-xs text-text-silver/40 uppercase font-bold tracking-widest">Prix</span>
                          <span className="text-3xl font-black text-white">{formatPrice(product.price)}</span>
                        </div>
                      )}
                    </div>

                    <div className="flex gap-3 pt-4">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          addToCart(product);
                          showInfo(`🛒 ${product.name} ajouté au panier`);
                        }}
                        className="flex-1 py-3 glass border-white/10 rounded-xl text-accent-cyan hover:bg-accent-cyan hover:text-white flex items-center justify-center gap-2 transition-all"
                      >
                        <ShoppingCart size={18} />
                        <span className="text-sm font-bold">Ajouter</span>
                      </button>
                      <button
                        onClick={async (e) => {
                          e.stopPropagation();
                          e.preventDefault();
                          setLoadingProduct(product._id);
                          try {
                            const orderData = {
                              customerName: "Client Boutique",
                              customerEmail: "client@boutique.com", 
                              customerPhone: "771234567",
                              items: [{ name: product.name, price: currentPrice, quantity: 1 }],
                              totalAmount: currentPrice,
                              message: `Commande du produit : ${product.name}`,
                            };
                            // ← UTILISER API_URL ICI AUSSI
                            await axios.post(`${API_URL}/api/orders`, orderData);
                            showSuccess(`✨ Commande créée ! Total: ${formatPrice(currentPrice)}`);
                            setTimeout(() => {
                              sendWhatsAppMessage("221766560258", `Bonjour OpenTech Business, je souhaite commander : ${product.name} pour ${formatPrice(currentPrice)}`);
                            }, 1000);
                          } catch (error: any) {
                            console.error("Erreur commande:", error);
                            showError("❌ Erreur lors de la commande");
                          } finally {
                            setLoadingProduct(null);
                          }
                        }}
                        disabled={loadingProduct === product._id}
                        className="flex-1 py-3 bg-accent-orange rounded-xl text-white glow-orange hover:scale-105 flex items-center justify-center gap-2 transition-all disabled:opacity-50"
                      >
                        {loadingProduct === product._id ? (
                          <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        ) : (
                          <>
                            <MessageCircle size={18} />
                            <span className="text-sm font-bold">Commander</span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>

        {filteredProducts.length === 0 && (
          <div className="text-center py-20">
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="text-2xl font-black mb-2">Aucun produit trouvé</h3>
            <p className="text-text-silver/40">Essayez de modifier vos filtres ou votre recherche</p>
          </div>
        )}
      </div>

      {/* Modal Médias */}
      <AnimatePresence>
        {showModal && selectedMedia.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/95 flex items-center justify-center z-50 p-4"
            onClick={() => setShowModal(false)}
          >
            <div onClick={(e) => e.stopPropagation()} className="max-w-5xl w-full relative">
              {selectedMedia.length > 1 && (
                <>
                  <button
                    onClick={() => setCurrentMediaIndex((prev) => prev > 0 ? prev - 1 : selectedMedia.length - 1)}
                    className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 glass rounded-full flex items-center justify-center text-white hover:bg-white/20 transition-all z-10"
                  >
                    ←
                  </button>
                  <button
                    onClick={() => setCurrentMediaIndex((prev) => prev < selectedMedia.length - 1 ? prev + 1 : 0)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 glass rounded-full flex items-center justify-center text-white hover:bg-white/20 transition-all z-10"
                  >
                    →
                  </button>
                </>
              )}
              <button onClick={() => setShowModal(false)} className="absolute top-4 right-4 w-12 h-12 glass rounded-full flex items-center justify-center text-white hover:bg-white/20 transition-all z-10">
                <X size={24} />
              </button>
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 glass px-4 py-2 rounded-full text-xs z-10">
                {currentMediaIndex + 1} / {selectedMedia.length}
              </div>
              <div className="flex items-center justify-center min-h-[60vh]">
                {selectedMedia[currentMediaIndex].type === 'video' ? (
                  <video src={selectedMedia[currentMediaIndex].url} className="max-w-full max-h-[80vh] rounded-2xl" controls autoPlay />
                ) : (
                  <img src={selectedMedia[currentMediaIndex].url} alt="media" className="max-w-full max-h-[80vh] rounded-2xl object-contain" />
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}