import React, { useState } from 'react';
import { motion } from 'motion/react';
import { 
  Send, 
  Phone, 
  Mail, 
  MapPin, 
  MessageCircle, 
  Clock, 
  CheckCircle2,
  Globe,
  Instagram,
  Facebook,
  Linkedin
} from 'lucide-react';
import { sendWhatsAppMessage } from '../lib/utils';

// Icône TikTok personnalisée
const TikTokIcon = ({ size = 20, className = "" }: { size?: number; className?: string }) => (
  <img 
    src="https://cdn.jsdelivr.net/npm/simple-icons@v9/icons/tiktok.svg" 
    alt="TikTok" 
    width={size} 
    height={size} 
    className={className}
    style={{ filter: 'invert(1)' }}
  />
);

export default function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Form submitted:', formData);
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 5000);
    
    const waMessage = `📋 Nouvelle demande de contact de ${formData.name}\n📧 Email: ${formData.email}\n📝 Sujet: ${formData.subject}\n💬 Message: ${formData.message}`;
    sendWhatsAppMessage("221766560258", waMessage);
  };

  // Liens des réseaux sociaux avec TikTok
  const socialLinks = [
    { 
      Icon: Facebook, 
      href: 'https://www.facebook.com/share/12MUySx2pg4/?mibextid=wwXIfr',
      label: 'Facebook',
      color: 'hover:text-[#1877F2]'
    },
    { 
      Icon: Instagram, 
      href: 'https://www.instagram.com/open_tech_business?igsh=YWE0YnhmbWNvN3ht&utm_source=qr',
      label: 'Instagram',
      color: 'hover:text-[#E4405F]'
    },
    { 
      Icon: Linkedin, 
      href: 'https://www.linkedin.com/company/opentech-business',
      label: 'LinkedIn',
      color: 'hover:text-[#0A66C2]'
    },
    { 
      Icon: TikTokIcon, 
      href: 'https://www.tiktok.com/@opentech_business',
      label: 'TikTok',
      color: 'hover:text-[#000000]'
    }
  ];

  const contactInfo = [
    {
      title: "Appelez-nous",
      value: "+221 76 656 02 58",
      desc: "Disponible du Lun au Sam, 9h-19h",
      icon: <Phone />,
      color: "accent-blue",
      action: () => window.location.href = "tel:+221766560258"
    },
    {
      title: "Email",
      value: "businessopentech@gmail.com",
      shortValue: "businessopentech@gmail.com",
      desc: "Réponse sous 24h ouvrées",
      icon: <Mail />,
      color: "accent-cyan",
      action: () => window.location.href = "mailto:businessopentech@gmail.com"
    },
    {
      title: "WhatsApp",
      value: "Discuter en direct",
      desc: "Le moyen le plus rapide",
      icon: <MessageCircle />,
      color: "accent-green",
      action: () => sendWhatsAppMessage("221766560258", "Bonjour OpenTech Business, j'ai une question concernant vos services.")
    }
  ];

  const googleMapsUrl = "https://www.google.com/maps?q=Thiès+Sénégal+Cité+Ballabey";

  return (
    <div className="pt-32 pb-24 px-6 relative overflow-hidden">
      <div className="absolute top-0 left-0 w-[600px] h-[600px] bg-accent-blue/5 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-[600px] h-[600px] bg-accent-cyan/5 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="text-center mb-24 space-y-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-block px-4 py-1 rounded-full glass border-white/10 text-accent-cyan text-xs font-black uppercase tracking-widest mb-4"
          >
            Contact & Support
          </motion.div>
          <h1 className="text-5xl md:text-7xl font-black tracking-tighter">
            Parlons de votre <span className="text-gradient">Projet</span>
          </h1>
          <p className="text-xl text-text-silver/40 max-w-2xl mx-auto">
            Une question ? Un projet ? Notre équipe d'experts est là pour vous accompagner dans votre réussite digitale.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Contact Info Cards */}
          <div className="lg:col-span-1 space-y-8">
            {contactInfo.map((info, i) => (
              <motion.div
                key={i}
                whileHover={{ x: 10 }}
                onClick={info.action}
                className={`p-8 glass rounded-[40px] border-white/5 cursor-pointer group transition-all ${info.action ? 'hover:border-accent-green/30' : ''}`}
              >
                <div className="flex items-center gap-5">
                  <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-white shrink-0 ${info.color === 'accent-blue' ? 'bg-accent-blue glow-blue' : info.color === 'accent-cyan' ? 'bg-accent-cyan glow-cyan' : 'bg-accent-green glow-green'}`}>
                    {info.icon}
                  </div>
                  <div className="min-w-0 flex-1">
                    <h4 className="text-xs text-text-silver/40 uppercase font-bold tracking-widest mb-1">{info.title}</h4>
                    <div className={`font-black text-white ${info.title === 'Email' ? 'text-base break-all' : 'text-xl'}`}>
                      {info.title === 'Email' ? (
                        <span className="text-sm sm:text-base">{info.value}</span>
                      ) : (
                        info.value
                      )}
                    </div>
                    <p className="text-xs text-text-silver/40 mt-1">{info.desc}</p>
                  </div>
                </div>
              </motion.div>
            ))}

            {/* Réseaux Sociaux avec TikTok */}
            <div className="p-10 glass rounded-[40px] border-white/5 space-y-8">
              <h4 className="text-xl font-black">Suivez-nous</h4>
              <div className="flex gap-4 flex-wrap">
                {socialLinks.map(({ Icon, href, label, color }, i) => (
                  <a
                    key={i}
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`w-12 h-12 glass rounded-xl flex items-center justify-center text-text-silver/60 ${color} hover:border-accent-cyan/30 transition-all duration-300 hover:scale-110`}
                    aria-label={label}
                  >
                    <Icon size={20} />
                  </a>
                ))}
              </div>
            </div>
          </div>

          {/* Contact Form - Taille réduite */}
          <div className="lg:col-span-2">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="glass rounded-[60px] p-8 md:p-12 border-white/5 relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-accent-blue/10 rounded-full blur-3xl" />
              
              {submitted ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="text-center py-20 space-y-6"
                >
                  <div className="w-24 h-24 bg-accent-green/20 rounded-full flex items-center justify-center text-accent-green mx-auto">
                    <CheckCircle2 size={48} />
                  </div>
                  <h3 className="text-3xl font-black">Message Envoyé !</h3>
                  <p className="text-text-silver/60 text-lg">
                    Merci {formData.name}. Nous avons bien reçu votre message et nous vous répondrons dans les plus brefs délais.
                  </p>
                  <button 
                    onClick={() => setSubmitted(false)}
                    className="text-accent-cyan font-bold hover:underline"
                  >
                    Envoyer un autre message
                  </button>
                </motion.div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-xs font-black uppercase tracking-widest text-text-silver/40 ml-2">Nom Complet *</label>
                      <input
                        required
                        type="text"
                        placeholder="Ex: Thierno Ngom"
                        className="w-full px-6 py-4 glass rounded-2xl focus:border-accent-blue outline-none transition-all text-base"
                        value={formData.name}
                        onChange={(e) => setFormData({...formData, name: e.target.value})}
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-black uppercase tracking-widest text-text-silver/40 ml-2">Email *</label>
                      <input
                        required
                        type="email"
                        placeholder="Ex: contact@exemple.sn"
                        className="w-full px-6 py-4 glass rounded-2xl focus:border-accent-cyan outline-none transition-all text-base"
                        value={formData.email}
                        onChange={(e) => setFormData({...formData, email: e.target.value})}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-black uppercase tracking-widest text-text-silver/40 ml-2">Sujet *</label>
                    <input
                      required
                      type="text"
                      placeholder="Ex: Demande de devis site web"
                      className="w-full px-6 py-4 glass rounded-2xl focus:border-accent-blue outline-none transition-all text-base"
                      value={formData.subject}
                      onChange={(e) => setFormData({...formData, subject: e.target.value})}
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-black uppercase tracking-widest text-text-silver/40 ml-2">Message *</label>
                    <textarea
                      required
                      rows={5}
                      placeholder="Décrivez votre projet en quelques mots..."
                      className="w-full px-6 py-4 glass rounded-2xl focus:border-accent-cyan outline-none transition-all text-base resize-none"
                      value={formData.message}
                      onChange={(e) => setFormData({...formData, message: e.target.value})}
                    />
                  </div>

                  <button
                    type="submit"
                    className="btn-primary w-full py-4 text-lg flex items-center justify-center gap-3 group"
                  >
                    Envoyer le message
                    <Send className="group-hover:translate-x-2 group-hover:-translate-y-2 transition-transform" size={18} />
                  </button>
                </form>
              )}
            </motion.div>
          </div>
        </div>

        {/* Map avec localisation cliquable */}
        <div className="mt-24 h-[450px] glass rounded-[60px] overflow-hidden border-white/5 relative group">
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3959.2!2d-16.9269!3d14.7975!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0xec1725f4c5b9b2b%3A0x4b2e8c5f5a5b5c5d!2zVGhpw6hzLCBTw6luZWdhbA!5e0!3m2!1sfr!2ssn!4v1234567890"
            className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700"
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            title="Carte OpenTech Business - Thiès"
          ></iframe>
          
          <a 
            href={googleMapsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-20 cursor-pointer group/marker"
          >
            <div className="w-16 h-16 bg-accent-orange rounded-full flex items-center justify-center text-white glow-orange animate-bounce group-hover/marker:scale-110 transition-transform">
              <MapPin size={32} />
            </div>
          </a>
          
          <a 
            href={googleMapsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="absolute bottom-8 left-8 z-20 glass p-6 rounded-3xl border-white/10 max-w-sm cursor-pointer hover:bg-white/5 transition-all group/info"
          >
            <h4 className="text-lg font-black mb-1 group-hover/info:text-accent-cyan transition-colors">Notre Siège Social</h4>
            <p className="text-sm text-text-silver/60">Cité Ballabey, Thiès, Sénégal</p>
            <div className="mt-3 flex items-center gap-2 text-accent-cyan font-bold text-sm">
              <Clock size={14} /> Ouvert de 09:00 à 19:00
            </div>
            <div className="mt-2 text-xs text-accent-cyan/60 flex items-center gap-1">
              Cliquez pour voir sur Google Maps ↗
            </div>
          </a>
        </div>
      </div>
    </div>
  );
}