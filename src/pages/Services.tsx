import React from 'react';
import { motion } from 'motion/react';
import { 
  Laptop, 
  Palette, 
  Globe, 
  Smartphone, 
  Settings, 
  Shield, 
  CheckCircle2, 
  ArrowRight,
  MessageCircle,
  Monitor,
  Code,
  PenTool,
  Printer,
  Cpu
} from 'lucide-react';
import { sendWhatsAppMessage } from '../lib/utils';

export default function Services() {
  const serviceGroups = [
    {
      title: "Pôle IT & Développement",
      description: "Solutions technologiques de pointe pour propulser votre infrastructure numérique.",
      icon: <Laptop size={48} />,
      color: "accent-blue",
      items: [
        {
          name: "Création de Sites Web",
          desc: "Sites vitrines, boutiques e-commerce (Shopify, WooCommerce, Custom), et plateformes éducatives.",
          features: ["Design Responsive", "Optimisation SEO", "Paiement en ligne"],
          icon: <Globe />
        },
        {
          name: "Maintenance Informatique",
          desc: "Entretien préventif et curatif de vos parcs informatiques, serveurs et réseaux.",
          features: ["Support 24/7", "Sécurité Réseau", "Audit Système"],
          icon: <Settings />
        },
        {
          name: "Développement d'Applications",
          desc: "Conception de logiciels sur mesure et applications mobiles (iOS/Android) adaptées à vos besoins.",
          features: ["UI/UX Moderne", "Performance Native", "Scalabilité"],
          icon: <Smartphone />
        },
        {
          name: "Vente de Matériel",
          desc: "Fourniture d'ordinateurs, serveurs, imprimantes et accessoires de grandes marques.",
          features: ["Garantie Constructeur", "Installation Offerte", "SAV Réactif"],
          icon: <Monitor />
        }
      ]
    },
    {
      title: "Pôle Design & Communication",
      description: "L'art de sublimer votre image de marque à travers des créations visuelles uniques.",
      icon: <Palette size={48} />,
      color: "accent-cyan",
      items: [
        {
          name: "Identité Visuelle",
          desc: "Création de logos, chartes graphiques et univers de marque cohérents et mémorables.",
          features: ["Logo Vectoriel", "Palette de Couleurs", "Typographie"],
          icon: <PenTool />
        },
        {
          name: "Conception Graphique",
          desc: "Design de supports marketing : affiches, flyers, cartes de visite, brochures et catalogues.",
          features: ["Qualité HD", "Formats Multiples", "Délai Rapide"],
          icon: <Palette />
        },
        {
          name: "Impression Numérique",
          desc: "Service d'impression haute qualité sur tous supports (papier, bâche, vinyle).",
          features: ["Grand Format", "Finition Premium", "Livraison"],
          icon: <Printer />
        },
        {
          name: "Supports Personnalisés",
          desc: "Personnalisation d'objets publicitaires : T-shirts, mugs, stylos, agendas et goodies.",
          features: ["Sérigraphie", "Sublimation", "Broderie"],
          icon: <Cpu />
        }
      ]
    }
  ];

  const handleQuote = (serviceName: string) => {
    const message = `Bonjour OpenTech Business, je souhaite obtenir un devis pour le service : ${serviceName}`;
    sendWhatsAppMessage("221766560258", message);
  };

  return (
    <div className="pt-32 pb-24 px-6 relative overflow-hidden">
      {/* Background Decorative Elements */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[600px] bg-accent-blue/5 blur-[120px] pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="text-center mb-24 space-y-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-block px-4 py-1 rounded-full glass border-white/10 text-accent-cyan text-xs font-black uppercase tracking-widest mb-4"
          >
            Expertise & Innovation
          </motion.div>
          <h1 className="text-5xl md:text-7xl font-black tracking-tighter">
            Nos Services <span className="text-gradient">Premium</span>
          </h1>
          <p className="text-xl text-text-silver/40 max-w-3xl mx-auto">
            Une gamme complète de solutions digitales et créatives pour accompagner votre croissance au Sénégal.
          </p>
        </div>

        <div className="space-y-32">
          {serviceGroups.map((group, groupIndex) => (
            <div key={groupIndex} className="space-y-16">
              <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 border-b border-white/5 pb-12">
                <div className="space-y-4">
                  <div className={`w-20 h-20 rounded-3xl flex items-center justify-center text-white ${group.color === 'accent-blue' ? 'bg-accent-blue glow-blue' : 'bg-accent-cyan glow-cyan'}`}>
                    {group.icon}
                  </div>
                  <h2 className="text-4xl md:text-5xl font-black tracking-tight">{group.title}</h2>
                  <p className="text-xl text-text-silver/60 max-w-2xl">{group.description}</p>
                </div>
                <div className="hidden md:block text-8xl font-black text-white/5 select-none">
                  0{groupIndex + 1}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {group.items.map((item, itemIndex) => (
                  <motion.div
                    key={itemIndex}
                    whileHover={{ y: -10 }}
                    className="p-10 glass rounded-[40px] border-white/5 hover:border-white/20 transition-all group relative overflow-hidden"
                  >
                    <div className={`absolute -top-10 -right-10 w-32 h-32 rounded-full blur-[60px] opacity-10 group-hover:opacity-30 transition-opacity ${group.color === 'accent-blue' ? 'bg-accent-blue' : 'bg-accent-cyan'}`} />
                    
                    <div className="relative z-10 space-y-6">
                      <div className={`w-14 h-14 rounded-2xl flex items-center justify-center ${group.color === 'accent-blue' ? 'text-accent-blue bg-accent-blue/10' : 'text-accent-cyan bg-accent-cyan/10'}`}>
                        {item.icon}
                      </div>
                      
                      <div className="space-y-2">
                        <h3 className="text-2xl font-black">{item.name}</h3>
                        <p className="text-text-silver/60 leading-relaxed">{item.desc}</p>
                      </div>

                      <div className="space-y-3">
                        {item.features.map((f, i) => (
                          <div key={i} className="flex items-center gap-3 text-sm text-text-silver/40">
                            <CheckCircle2 size={16} className={group.color === 'accent-blue' ? 'text-accent-blue' : 'text-accent-cyan'} />
                            {f}
                          </div>
                        ))}
                      </div>

                      <button
                        onClick={() => handleQuote(item.name)}
                        className={`w-full py-4 rounded-2xl font-black uppercase tracking-widest text-xs flex items-center justify-center gap-3 transition-all ${
                          group.color === 'accent-blue' 
                            ? 'bg-accent-blue/10 text-accent-blue hover:bg-accent-blue hover:text-white' 
                            : 'bg-accent-cyan/10 text-accent-cyan hover:bg-accent-cyan hover:text-white'
                        }`}
                      >
                        Demander un devis <MessageCircle size={16} />
                      </button>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Training Section */}
        <section className="mt-32 p-16 glass rounded-[60px] relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-accent-blue/10 to-accent-cyan/10" />
          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div className="space-y-8">
              <h2 className="text-4xl md:text-6xl font-black tracking-tighter">
                Pôle Formation <br />
                <span className="text-accent-cyan">Professionnelle</span>
              </h2>
              <p className="text-xl text-text-silver/60 leading-relaxed">
                Nous formons la prochaine génération d'experts du numérique. Nos programmes sont 100% pratiques et adaptés aux réalités du marché de l'emploi.
              </p>
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {[
                  "Développement Web & Mobile",
                  "Infographie & Design",
                  "Marketing Digital",
                  "Bureautique Avancée",
                  "Maintenance & Réseaux",
                  "Montage Vidéo"
                ].map((t, i) => (
                  <li key={i} className="flex items-center gap-3 text-text-silver/80">
                    <div className="w-2 h-2 bg-accent-cyan rounded-full" />
                    {t}
                  </li>
                ))}
              </ul>
              <button 
                onClick={() => handleQuote("Formation Professionnelle")}
                className="btn-primary"
              >
                S'inscrire à une formation
              </button>
            </div>
            <div className="relative">
              <div className="rounded-[40px] overflow-hidden border border-white/10 shadow-2xl rotate-3">
                <img src="https://picsum.photos/seed/training/800/600" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
              </div>
              <div className="absolute -bottom-6 -left-6 p-8 glass rounded-3xl glow-blue">
                <div className="text-4xl font-black text-white">100%</div>
                <div className="text-xs text-text-silver/40 uppercase tracking-widest">Pratique</div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
