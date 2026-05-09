import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, ShoppingCart, LogIn, User, LayoutDashboard } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useCart } from '../context/CartContext';
import { cn } from '../lib/utils';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();
  const isAdmin = localStorage.getItem('token') !== null;
  const { totalItems } = useCart();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Accueil', path: '/' },
    { name: 'Boutique', path: '/shop' },
    { name: 'Services', path: '/services' },
    { name: 'À Propos', path: '/about' },
    { name: 'Contact', path: '/contact' },
  ];

  return (
    <nav className={cn(
      "fixed top-0 w-full z-50 transition-all duration-500 px-6 py-4",
      scrolled ? "bg-primary/80 backdrop-blur-2xl border-b border-white/5 py-3" : "bg-transparent py-6"
    )}>
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <Link to="/" className="flex items-center gap-3 group">
          {/* Logo image avec animation */}
          <div className="relative">
            <motion.div
              whileHover={{ scale: 1.05, rotate: 5 }}
              transition={{ duration: 0.3 }}
              className="w-12 h-12 rounded-2xl overflow-hidden bg-gradient-to-br from-accent-blue to-accent-cyan flex items-center justify-center"
            >
              <img 
                src="/images/logo.png" 
                alt="OpenTech Business" 
                className="w-full h-full object-cover"
                onError={(e) => {
                  // Fallback si l'image ne charge pas
                  e.currentTarget.style.display = 'none';
                  e.currentTarget.parentElement!.innerHTML = '<span class="text-white font-black text-2xl">OT</span>';
                }}
              />
            </motion.div>
            <div className="absolute inset-0 bg-gradient-to-br from-accent-blue to-accent-cyan rounded-2xl blur-xl opacity-0 group-hover:opacity-50 transition-opacity duration-500" />
          </div>
          
          <div className="flex flex-col">
            <span className="text-xl font-black tracking-tighter text-white leading-none">
              OpenTech
            </span>
            <span className="text-xs font-bold tracking-[0.2em] text-accent-cyan uppercase">
              Business
            </span>
          </div>
        </Link>

        {/* Desktop Nav */}
        <div className="hidden lg:flex items-center gap-10">
          <div className="flex items-center gap-8 px-8 py-3 glass rounded-full border-white/5">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={cn(
                  "nav-link",
                  location.pathname === link.path && "nav-link-active"
                )}
              >
                {link.name}
              </Link>
            ))}
          </div>
          
          <div className="flex items-center gap-4">
            <Link to="/cart" className="relative p-3 glass rounded-2xl hover:text-accent-cyan transition-all hover:scale-110">
              <ShoppingCart size={20} />
              <AnimatePresence>
                {totalItems > 0 && (
                  <motion.span
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    exit={{ scale: 0 }}
                    className="absolute -top-1 -right-1 w-5 h-5 bg-accent-orange text-white text-[10px] font-bold rounded-full flex items-center justify-center glow-orange"
                  >
                    {totalItems}
                  </motion.span>
                )}
              </AnimatePresence>
            </Link>
            
            {isAdmin ? (
              <Link to="/admin" className="flex items-center gap-2 px-5 py-3 glass rounded-2xl text-accent-cyan font-bold hover:bg-white/10 transition-all">
                <LayoutDashboard size={18} />
                <span className="text-sm">Admin</span>
              </Link>
            ) : (
              <Link to="/login" className="flex items-center gap-2 px-6 py-3 bg-accent-blue text-white font-bold rounded-2xl glow-blue hover:scale-105 transition-all">
                <LogIn size={18} />
                <span className="text-sm">Connexion</span>
              </Link>
            )}
          </div>
        </div>

        {/* Mobile Toggle */}
        <button 
          className="lg:hidden w-12 h-12 glass rounded-2xl flex items-center justify-center text-white" 
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="lg:hidden absolute top-full left-0 w-full bg-primary/95 backdrop-blur-3xl border-b border-white/5 overflow-hidden"
          >
            <div className="p-8 flex flex-col gap-6">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  onClick={() => setIsOpen(false)}
                  className={cn(
                    "text-2xl font-bold transition-all",
                    location.pathname === link.path ? "text-accent-cyan translate-x-4" : "text-text-silver/60"
                  )}
                >
                  {link.name}
                </Link>
              ))}
              <div className="pt-8 border-t border-white/10 flex flex-col gap-4">
                <Link 
                  to="/cart" 
                  onClick={() => setIsOpen(false)} 
                  className="flex items-center justify-between p-5 glass rounded-3xl text-accent-cyan font-bold"
                >
                  <div className="flex items-center gap-3">
                    <ShoppingCart size={24} /> Panier
                  </div>
                  <AnimatePresence>
                    {totalItems > 0 && (
                      <motion.span
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="bg-accent-orange text-white px-3 py-1 rounded-full text-xs"
                      >
                        {totalItems}
                      </motion.span>
                    )}
                  </AnimatePresence>
                </Link>
                <Link 
                  to="/login" 
                  onClick={() => setIsOpen(false)} 
                  className="flex items-center gap-3 p-5 bg-accent-blue text-white font-bold rounded-3xl glow-blue"
                >
                  <LogIn size={24} /> Connexion Admin
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
