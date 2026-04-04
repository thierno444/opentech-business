import React from 'react';
import { 
  Mail, 
  Phone, 
  MapPin, 
  Facebook, 
  Instagram, 
  Linkedin, 
  Twitter,
  ArrowRight,
  Globe,
  ShieldCheck,
  Zap
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion } from 'motion/react';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  const footerLinks = {
    company: [
      { name: 'Accueil', path: '/' },
      { name: 'À Propos', path: '/about' },
      { name: 'Services', path: '/services' },
      { name: 'Boutique', path: '/shop' },
      { name: 'Contact', path: '/contact' },
    ],
    services: [
      { name: 'Développement Web', path: '/services' },
      { name: 'Design Graphique', path: '/services' },
      { name: 'Marketing Digital', path: '/services' },
      { name: 'Formation IT', path: '/services' },
      { name: 'Maintenance', path: '/services' },
    ],
    legal: [
      { name: 'Mentions Légales', path: '#' },
      { name: 'Confidentialité', path: '#' },
      { name: 'Conditions de Vente', path: '#' },
      { name: 'Support Client', path: '/contact' },
    ]
  };

  return (
    <footer className="bg-primary relative overflow-hidden pt-24 pb-12 border-t border-white/5">
      {/* Background Glows */}
      <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-accent-blue/5 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-accent-cyan/5 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        {/* Top Section: Newsletter or CTA */}
        <div className="glass rounded-[40px] p-10 md:p-16 border-white/10 mb-24 flex flex-col lg:flex-row items-center justify-between gap-12 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-accent-blue/10 rounded-full blur-3xl -mr-32 -mt-32" />
          <div className="space-y-4 text-center lg:text-left">
            <h3 className="text-3xl md:text-4xl font-black tracking-tighter">Prêt à <span className="text-gradient">Innover</span> ?</h3>
            <p className="text-text-silver/60 text-lg max-w-md">Rejoignez plus de 500 entreprises qui nous font confiance pour leur transformation digitale.</p>
          </div>
          <div className="flex flex-col sm:flex-row gap-4 w-full lg:w-auto">
            <Link to="/contact" className="btn-primary px-10 py-5 text-lg flex items-center justify-center gap-3">
              Démarrer un Projet <ArrowRight size={20} />
            </Link>
            <Link to="/shop" className="glass px-10 py-5 rounded-2xl border-white/10 text-white font-bold hover:bg-white/5 transition-all text-center">
              Voir la Boutique
            </Link>
          </div>
        </div>

        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-16 mb-24">
          {/* Brand Column */}
          <div className="lg:col-span-2 space-y-8">
            <Link to="/" className="flex items-center gap-3 group">
              <div className="w-12 h-12 bg-accent-blue rounded-2xl flex items-center justify-center glow-blue group-hover:scale-110 transition-transform">
                <Zap className="text-white" size={24} fill="white" />
              </div>
              <span className="text-2xl font-black tracking-tighter text-white">
                OpenTech <span className="text-accent-cyan">Business</span>
              </span>
            </Link>
            <p className="text-text-silver/40 leading-relaxed text-lg max-w-sm">
              Leader de l'innovation digitale au Sénégal. Nous transformons vos idées en réalités technologiques puissantes et esthétiques.
            </p>
            <div className="flex gap-4">
              {[Facebook, Instagram, Linkedin, Twitter].map((Icon, i) => (
                <a key={i} href="#" className="w-12 h-12 glass rounded-xl flex items-center justify-center text-text-silver/60 hover:text-accent-cyan hover:border-accent-cyan/30 transition-all">
                  <Icon size={20} />
                </a>
              ))}
            </div>
          </div>

          {/* Links Columns */}
          <div className="space-y-8">
            <h4 className="text-xs font-black uppercase tracking-widest text-white">Entreprise</h4>
            <ul className="space-y-4">
              {footerLinks.company.map((link, i) => (
                <li key={i}>
                  <Link to={link.path} className="text-text-silver/40 hover:text-accent-cyan transition-colors font-medium">
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="space-y-8">
            <h4 className="text-xs font-black uppercase tracking-widest text-white">Services</h4>
            <ul className="space-y-4">
              {footerLinks.services.map((link, i) => (
                <li key={i}>
                  <Link to={link.path} className="text-text-silver/40 hover:text-accent-cyan transition-colors font-medium">
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="space-y-8">
            <h4 className="text-xs font-black uppercase tracking-widest text-white">Contact</h4>
            <ul className="space-y-6">
              <li className="flex items-start gap-4 group">
                <div className="w-10 h-10 glass rounded-xl flex items-center justify-center text-accent-blue shrink-0 group-hover:bg-accent-blue group-hover:text-white transition-all">
                  <Mail size={18} />
                </div>
                <div className="text-sm">
                  <p className="text-white font-bold">Email</p>
                  <p className="text-text-silver/40">contact@opentech.sn</p>
                </div>
              </li>
              <li className="flex items-start gap-4 group">
                <div className="w-10 h-10 glass rounded-xl flex items-center justify-center text-accent-cyan shrink-0 group-hover:bg-accent-cyan group-hover:text-white transition-all">
                  <Phone size={18} />
                </div>
                <div className="text-sm">
                  <p className="text-white font-bold">Téléphone</p>
                  <p className="text-text-silver/40">+221 76 656 02 58</p>
                </div>
              </li>
              <li className="flex items-start gap-4 group">
                <div className="w-10 h-10 glass rounded-xl flex items-center justify-center text-accent-green shrink-0 group-hover:bg-accent-green group-hover:text-white transition-all">
                  <MapPin size={18} />
                </div>
                <div className="text-sm">
                  <p className="text-white font-bold">Siège</p>
                  <p className="text-text-silver/40">Thiès, Sénégal</p>
                </div>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-12 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="flex items-center gap-8 text-xs font-black uppercase tracking-widest text-text-silver/20">
            <p>© {currentYear} OpenTech Business</p>
            <div className="hidden md:flex items-center gap-2">
              <ShieldCheck size={14} /> Sécurisé par SSL
            </div>
            <div className="hidden md:flex items-center gap-2">
              <Globe size={14} /> Global Presence
            </div>
          </div>
          <div className="flex gap-8 text-xs font-black uppercase tracking-widest text-text-silver/20">
            <a href="#" className="hover:text-white transition-colors">Privacy</a>
            <a href="#" className="hover:text-white transition-colors">Terms</a>
            <a href="#" className="hover:text-white transition-colors">Cookies</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
