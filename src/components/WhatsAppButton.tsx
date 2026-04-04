import React from 'react';
import { MessageCircle, Zap } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export default function WhatsAppButton() {
  const phone = "221766560258";
  const message = "Bonjour OpenTech Business, j'aimerais avoir plus d'informations sur vos services.";

  return (
    <div className="fixed bottom-8 right-8 z-50 flex flex-col items-end gap-4 pointer-events-none">
      <AnimatePresence>
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-white px-4 py-2 rounded-2xl shadow-2xl text-primary text-xs font-black uppercase tracking-widest hidden md:block border border-white/20 backdrop-blur-xl"
        >
          Besoin d'aide ? <span className="text-accent-blue">Chattez avec nous</span>
        </motion.div>
      </AnimatePresence>
      
      <motion.a
        href={`https://wa.me/${phone}?text=${encodeURIComponent(message)}`}
        target="_blank"
        rel="noopener noreferrer"
        initial={{ scale: 0, rotate: -45 }}
        animate={{ scale: 1, rotate: 0 }}
        whileHover={{ scale: 1.1, rotate: 5 }}
        whileTap={{ scale: 0.9 }}
        className="pointer-events-auto w-16 h-16 bg-[#25D366] rounded-3xl flex items-center justify-center text-white shadow-[0_20px_50px_rgba(37,211,102,0.3)] relative group overflow-hidden"
      >
        {/* Pulsing Ring */}
        <div className="absolute inset-0 bg-[#25D366] rounded-3xl animate-ping opacity-20 group-hover:animate-none" />
        
        {/* Glow Effect */}
        <div className="absolute inset-0 bg-gradient-to-tr from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
        
        <MessageCircle size={32} className="relative z-10" />
        
        {/* Badge */}
        <div className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full border-2 border-white animate-bounce" />
      </motion.a>
    </div>
  );
}
