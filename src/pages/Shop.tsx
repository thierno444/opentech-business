import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'motion/react';
import { ShoppingCart, MessageCircle, Search, Filter, ArrowRight, Star, CheckCircle2, Plus } from 'lucide-react';
import { formatPrice, sendWhatsAppMessage, cn } from '../lib/utils';
import { useCart } from '../context/CartContext';

interface Product {
  _id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  image: string;
  features: string[];
}

export default function Shop() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All');
  const { addToCart } = useCart();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const { data } = await axios.get('/api/products');
        setProducts(data);
      } catch (error) {
        console.error('Error fetching products', error);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  const filteredProducts = products.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(search.toLowerCase()) || 
                         p.description.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = category === 'All' || p.category === category;
    return matchesSearch && matchesCategory;
  });

  const categories = ['All', ...new Set(products.map(p => p.category))];

  const handleWhatsAppOrder = (product: Product) => {
    const message = `Bonjour OpenTech Business, je souhaite commander le pack : ${product.name} (${formatPrice(product.price)})`;
    sendWhatsAppMessage("221766560258", message);
  };

  return (
    <div className="pt-32 pb-24 px-6 relative">
      {/* Background Glows */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-accent-blue/5 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-accent-cyan/5 rounded-full blur-[120px] pointer-events-none" />

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
          <p className="text-xl text-text-silver/40 max-w-2xl mx-auto">
            Des solutions clés en main pour digitaliser votre business ou booster vos compétences professionnelles.
          </p>
        </div>

        {/* Filters & Search */}
        <div className="flex flex-col lg:flex-row gap-8 mb-16 items-center justify-between">
          <div className="relative w-full lg:w-[450px]">
            <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-text-silver/40" size={20} />
            <input
              type="text"
              placeholder="Rechercher un pack ou une formation..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-16 pr-6 py-5 glass rounded-3xl focus:border-accent-cyan outline-none transition-all text-lg"
            />
          </div>
          
          <div className="flex gap-3 overflow-x-auto w-full lg:w-auto pb-4 lg:pb-0 no-scrollbar">
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setCategory(cat)}
                className={cn(
                  "px-8 py-4 rounded-2xl text-sm font-black uppercase tracking-widest transition-all whitespace-nowrap",
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

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            {[1, 2, 3, 4, 5, 6].map(i => (
              <div key={i} className="h-[500px] glass rounded-[40px] animate-pulse" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            <AnimatePresence mode="popLayout">
              {filteredProducts.map((product) => (
                <motion.div
                  key={product._id}
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  whileHover={{ y: -15 }}
                  className="glass rounded-[40px] overflow-hidden flex flex-col group border-white/5 hover:border-accent-cyan/30 transition-all duration-500"
                >
                  <div className="h-64 relative overflow-hidden">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-primary/90 via-transparent to-transparent opacity-60" />
                    <div className="absolute top-6 left-6 px-4 py-1 bg-accent-blue/80 backdrop-blur-md text-white text-[10px] font-black uppercase tracking-widest rounded-full">
                      {product.category}
                    </div>
                    <div className="absolute bottom-6 left-6 flex items-center gap-1 text-accent-orange">
                      <Star size={14} fill="currentColor" />
                      <Star size={14} fill="currentColor" />
                      <Star size={14} fill="currentColor" />
                      <Star size={14} fill="currentColor" />
                      <Star size={14} fill="currentColor" />
                    </div>
                  </div>

                  <div className="p-10 flex-1 flex flex-col space-y-6">
                    <div className="space-y-2">
                      <h3 className="text-2xl font-black leading-tight group-hover:text-accent-cyan transition-colors">
                        {product.name}
                      </h3>
                      <p className="text-sm text-text-silver/40 leading-relaxed line-clamp-2">
                        {product.description}
                      </p>
                    </div>

                    <div className="space-y-3 flex-1">
                      {product.features.map((f, i) => (
                        <div key={i} className="flex items-start gap-3 text-xs text-text-silver/70">
                          <CheckCircle2 size={16} className="text-accent-green shrink-0" />
                          <span>{f}</span>
                        </div>
                      ))}
                    </div>

                    <div className="pt-8 border-t border-white/5 flex items-center justify-between">
                      <div className="flex flex-col">
                        <span className="text-xs text-text-silver/40 uppercase font-bold tracking-widest">Prix</span>
                        <span className="text-3xl font-black text-white">{formatPrice(product.price)}</span>
                      </div>
                      <div className="flex gap-3">
                        <button
                          onClick={() => addToCart(product)}
                          className="w-12 h-12 glass border-white/10 rounded-xl text-accent-cyan hover:bg-accent-cyan hover:text-white transition-all flex items-center justify-center group/cart"
                          title="Ajouter au panier"
                        >
                          <ShoppingCart size={20} className="group-hover/cart:scale-110 transition-transform" />
                        </button>
                        <button
                          onClick={() => handleWhatsAppOrder(product)}
                          className="w-12 h-12 bg-accent-orange rounded-xl text-white glow-orange hover:scale-110 active:scale-95 transition-all flex items-center justify-center"
                          title="Commander via WhatsApp"
                        >
                          <MessageCircle size={20} />
                        </button>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}

        {!loading && filteredProducts.length === 0 && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-32 space-y-6"
          >
            <div className="text-6xl text-text-silver/10 font-black">Oups !</div>
            <p className="text-text-silver/40 text-xl">Aucun pack ne correspond à votre recherche.</p>
            <button 
              onClick={() => { setSearch(''); setCategory('All'); }}
              className="text-accent-cyan font-bold hover:underline"
            >
              Réinitialiser les filtres
            </button>
          </motion.div>
        )}
      </div>
    </div>
  );
}
