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
  Linkedin,
  Twitter
} from 'lucide-react';
import { sendWhatsAppMessage } from '../lib/utils';

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
    // Simulate form submission
    console.log('Form submitted:', formData);
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 5000);
    
    // Also offer WhatsApp as alternative
    const waMessage = `Nouveau message de ${formData.name} (${formData.email}) : ${formData.subject} - ${formData.message}`;
    // sendWhatsAppMessage("221766560258", waMessage);
  };

  const contactInfo = [
    {
      title: "Appelez-nous",
      value: "+221 76 656 02 58",
      desc: "Disponible du Lun au Sam, 9h-19h",
      icon: <Phone />,
      color: "accent-blue"
    },
    {
      title: "Email",
      value: "contact@opentech.sn",
      desc: "Réponse sous 24h ouvrées",
      icon: <Mail />,
      color: "accent-cyan"
    },
    {
      title: "WhatsApp",
      value: "Discuter en direct",
      desc: "Le moyen le plus rapide",
      icon: <MessageCircle />,
      color: "accent-green",
      action: () => sendWhatsAppMessage("221766560258", "Bonjour OpenTech Business, j'ai une question.")
    }
  ];

  return (
    <div className="pt-32 pb-24 px-6 relative overflow-hidden">
      {/* Background Decorative Elements */}
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
                <div className="flex items-center gap-6">
                  <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-white ${info.color === 'accent-blue' ? 'bg-accent-blue glow-blue' : info.color === 'accent-cyan' ? 'bg-accent-cyan glow-cyan' : 'bg-accent-green glow-green'}`}>
                    {info.icon}
                  </div>
                  <div>
                    <h4 className="text-xs text-text-silver/40 uppercase font-bold tracking-widest mb-1">{info.title}</h4>
                    <div className="text-xl font-black text-white">{info.value}</div>
                    <p className="text-sm text-text-silver/40">{info.desc}</p>
                  </div>
                </div>
              </motion.div>
            ))}

            <div className="p-10 glass rounded-[40px] border-white/5 space-y-8">
              <h4 className="text-xl font-black">Suivez-nous</h4>
              <div className="flex gap-4">
                {[Facebook, Instagram, Linkedin, Twitter].map((Icon, i) => (
                  <button key={i} className="w-12 h-12 glass rounded-xl flex items-center justify-center text-text-silver/60 hover:text-accent-cyan hover:border-accent-cyan/30 transition-all">
                    <Icon size={20} />
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="lg:col-span-2">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="glass rounded-[60px] p-10 md:p-16 border-white/5 relative overflow-hidden"
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
                <form onSubmit={handleSubmit} className="space-y-8">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-3">
                      <label className="text-sm font-black uppercase tracking-widest text-text-silver/40 ml-2">Nom Complet</label>
                      <input
                        required
                        type="text"
                        placeholder="Ex: Thierno Ngom"
                        className="w-full px-8 py-5 glass rounded-3xl focus:border-accent-blue outline-none transition-all text-lg"
                        value={formData.name}
                        onChange={(e) => setFormData({...formData, name: e.target.value})}
                      />
                    </div>
                    <div className="space-y-3">
                      <label className="text-sm font-black uppercase tracking-widest text-text-silver/40 ml-2">Email</label>
                      <input
                        required
                        type="email"
                        placeholder="Ex: contact@exemple.sn"
                        className="w-full px-8 py-5 glass rounded-3xl focus:border-accent-cyan outline-none transition-all text-lg"
                        value={formData.email}
                        onChange={(e) => setFormData({...formData, email: e.target.value})}
                      />
                    </div>
                  </div>

                  <div className="space-y-3">
                    <label className="text-sm font-black uppercase tracking-widest text-text-silver/40 ml-2">Sujet</label>
                    <input
                      required
                      type="text"
                      placeholder="Ex: Demande de devis site web"
                      className="w-full px-8 py-5 glass rounded-3xl focus:border-accent-blue outline-none transition-all text-lg"
                      value={formData.subject}
                      onChange={(e) => setFormData({...formData, subject: e.target.value})}
                    />
                  </div>

                  <div className="space-y-3">
                    <label className="text-sm font-black uppercase tracking-widest text-text-silver/40 ml-2">Message</label>
                    <textarea
                      required
                      rows={6}
                      placeholder="Décrivez votre projet en quelques mots..."
                      className="w-full px-8 py-5 glass rounded-3xl focus:border-accent-cyan outline-none transition-all text-lg resize-none"
                      value={formData.message}
                      onChange={(e) => setFormData({...formData, message: e.target.value})}
                    />
                  </div>

                  <button
                    type="submit"
                    className="btn-primary w-full py-6 text-xl flex items-center justify-center gap-4 group"
                  >
                    Envoyer le message
                    <Send className="group-hover:translate-x-2 group-hover:-translate-y-2 transition-transform" />
                  </button>
                </form>
              )}
            </motion.div>
          </div>
        </div>

        {/* Map Placeholder */}
        <div className="mt-24 h-[500px] glass rounded-[60px] overflow-hidden border-white/5 relative group">
          <div className="absolute inset-0 bg-primary/40 z-10 group-hover:bg-transparent transition-all duration-700" />
          <img 
            src="https://picsum.photos/seed/map-location/1920/1080" 
            className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700" 
            referrerPolicy="no-referrer"
          />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-20">
            <div className="w-20 h-20 bg-accent-orange rounded-full flex items-center justify-center text-white glow-orange animate-bounce">
              <MapPin size={40} />
            </div>
          </div>
          <div className="absolute bottom-10 left-10 z-20 glass p-8 rounded-3xl border-white/10 max-w-sm">
            <h4 className="text-xl font-black mb-2">Notre Siège Social</h4>
            <p className="text-text-silver/60">Cité Ballabey, Thiès, Sénégal</p>
            <div className="mt-4 flex items-center gap-2 text-accent-cyan font-bold">
              <Clock size={16} /> Ouvert de 09:00 à 19:00
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
