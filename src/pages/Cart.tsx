import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ShoppingBag, Trash2, Plus, Minus, ArrowRight, CreditCard, MessageCircle } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { formatPrice, sendWhatsAppMessage } from '../lib/utils';
import { Link } from 'react-router-dom';

export default function Cart() {
  const { cart, removeFromCart, updateQuantity, totalPrice, totalItems, clearCart } = useCart();

  const handleCheckoutWhatsApp = () => {
    const itemsList = cart.map(item => `- ${item.name} (x${item.quantity}) : ${formatPrice(item.price * item.quantity)}`).join('\n');
    const message = `Bonjour OpenTech Business, je souhaite valider ma commande :\n\n${itemsList}\n\nTotal : ${formatPrice(totalPrice)}\n\nMerci de me recontacter pour le paiement.`;
    sendWhatsAppMessage("221766560258", message);
  };

  if (cart.length === 0) {
    return (
      <div className="pt-40 pb-24 px-6 min-h-screen flex flex-col items-center justify-center text-center space-y-8">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="w-32 h-32 bg-white/5 rounded-full flex items-center justify-center text-text-silver/20"
        >
          <ShoppingBag size={64} />
        </motion.div>
        <div className="space-y-4">
          <h1 className="text-4xl font-black tracking-tighter">Votre panier est vide</h1>
          <p className="text-text-silver/40 max-w-md mx-auto">
            Il semble que vous n'ayez pas encore ajouté de produits à votre panier. 
            Découvrez nos solutions digitales et formations pour booster votre activité.
          </p>
        </div>
        <Link to="/shop" className="btn-primary px-10 py-5 text-lg">
          Découvrir la boutique
        </Link>
      </div>
    );
  }

  return (
    <div className="pt-40 pb-24 px-6 relative min-h-screen">
      {/* Background Glows */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-accent-blue/5 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-accent-cyan/5 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="flex flex-col lg:flex-row gap-12">
          {/* Cart Items List */}
          <div className="flex-1 space-y-8">
            <div className="flex items-center justify-between mb-8">
              <h1 className="text-4xl font-black tracking-tighter">
                Mon <span className="text-gradient">Panier</span>
              </h1>
              <button 
                onClick={clearCart}
                className="text-xs font-black uppercase tracking-widest text-red-500/60 hover:text-red-500 transition-colors"
              >
                Vider le panier
              </button>
            </div>

            <div className="space-y-6">
              <AnimatePresence mode="popLayout">
                {cart.map((item) => (
                  <motion.div
                    key={item._id}
                    layout
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    className="glass rounded-3xl p-6 flex flex-col sm:flex-row items-center gap-6 border-white/5"
                  >
                    <div className="w-24 h-24 rounded-2xl overflow-hidden shrink-0">
                      <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                    </div>
                    
                    <div className="flex-1 text-center sm:text-left space-y-1">
                      <div className="text-xs font-black uppercase tracking-widest text-accent-cyan">{item.category}</div>
                      <h3 className="text-xl font-bold">{item.name}</h3>
                      <p className="text-text-silver/40 font-medium">{formatPrice(item.price)}</p>
                    </div>

                    <div className="flex items-center gap-4 glass rounded-2xl p-2 border-white/10">
                      <button 
                        onClick={() => updateQuantity(item._id, item.quantity - 1)}
                        className="w-10 h-10 flex items-center justify-center hover:bg-white/5 rounded-xl transition-colors"
                      >
                        <Minus size={16} />
                      </button>
                      <span className="w-8 text-center font-black">{item.quantity}</span>
                      <button 
                        onClick={() => updateQuantity(item._id, item.quantity + 1)}
                        className="w-10 h-10 flex items-center justify-center hover:bg-white/5 rounded-xl transition-colors"
                      >
                        <Plus size={16} />
                      </button>
                    </div>

                    <div className="text-xl font-black sm:w-32 text-center sm:text-right">
                      {formatPrice(item.price * item.quantity)}
                    </div>

                    <button 
                      onClick={() => removeFromCart(item._id)}
                      className="p-3 text-red-500/40 hover:text-red-500 transition-colors"
                    >
                      <Trash2 size={20} />
                    </button>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </div>

          {/* Order Summary */}
          <div className="w-full lg:w-[400px] space-y-8">
            <div className="glass rounded-[40px] p-10 border-white/10 sticky top-40 space-y-8">
              <h2 className="text-2xl font-black tracking-tighter">Récapitulatif</h2>
              
              <div className="space-y-4">
                <div className="flex justify-between text-text-silver/60">
                  <span>Articles ({totalItems})</span>
                  <span>{formatPrice(totalPrice)}</span>
                </div>
                <div className="flex justify-between text-text-silver/60">
                  <span>Frais de service</span>
                  <span className="text-accent-green">Gratuit</span>
                </div>
                <div className="pt-4 border-t border-white/5 flex justify-between items-end">
                  <span className="text-lg font-bold">Total</span>
                  <span className="text-3xl font-black text-gradient">{formatPrice(totalPrice)}</span>
                </div>
              </div>

              <div className="space-y-4">
                <button 
                  onClick={handleCheckoutWhatsApp}
                  className="btn-primary w-full py-5 flex items-center justify-center gap-3 group"
                >
                  Commander via WhatsApp <MessageCircle size={20} />
                </button>
                
                <button className="w-full py-5 glass border-white/10 rounded-2xl text-text-silver/40 font-bold flex items-center justify-center gap-3 cursor-not-allowed opacity-50">
                  Paiement par Carte <CreditCard size={20} />
                </button>
                <p className="text-[10px] text-center text-text-silver/20 font-medium uppercase tracking-widest">
                  Paiement en ligne bientôt disponible
                </p>
              </div>

              <div className="pt-8 flex items-center gap-4 text-text-silver/20">
                <div className="w-10 h-10 glass rounded-xl flex items-center justify-center">
                  <ArrowRight size={16} />
                </div>
                <p className="text-xs font-medium">Livraison rapide & Support 24/7</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
