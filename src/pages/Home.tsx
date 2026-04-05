import React from 'react';
import { motion } from 'motion/react';
import { 
  ArrowRight, 
  Laptop, 
  Palette, 
  Zap, 
  Code, 
  PenTool, 
  CheckCircle2,
  TrendingUp,
  Users,
  Globe
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { cn } from '../lib/utils';

export default function Home() {
  const poles = [
    {
      title: "Pôle IT & Développement",
      icon: <Laptop size={32} />,
      color: "accent-blue",
      services: [
        "Création de sites web (Vitrine, E-commerce)",
        "Maintenance informatique préventive & curative",
        "Développement d'applications sur mesure",
        "Vente de matériel informatique",
        "Formation professionnelle aux outils numériques"
      ]
    },
    {
      title: "Pôle Design & Communication",
      icon: <Palette size={32} />,
      color: "accent-cyan",
      services: [
        "Création d'identité visuelle & Logos",
        "Conception graphique (Affiches, Flyers, Cartes)",
        "Impression numérique & Offset",
        "Supports personnalisés (T-shirts, Mugs, etc.)",
        "Gestion de la communication digitale"
      ]
    }
  ];

  const values = [
    { title: "Multiservices", desc: "Une solution unique pour tous vos besoins digitaux.", icon: <Zap /> },
    { title: "Personnalisé", desc: "Des solutions adaptées à votre budget et vos objectifs.", icon: <Users /> },
    { title: "Tarif Accessible", desc: "La technologie de pointe au meilleur prix du marché.", icon: <TrendingUp /> },
    { title: "Support Local", desc: "Une équipe réactive basée à Thiès et Dakar.", icon: <Globe /> }
  ];

  return (
    <div className="relative overflow-hidden">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center pt-20 px-6">
        {/* Background Decorative Elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/4 -left-1/4 w-[600px] h-[600px] bg-accent-blue/10 rounded-full blur-[120px] animate-pulse" />
          <div className="absolute bottom-1/4 -right-1/4 w-[600px] h-[600px] bg-accent-cyan/10 rounded-full blur-[120px] animate-pulse delay-1000" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full opacity-10 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]" />
        </div>

        <div className="max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-2 gap-16 items-center z-10">
          <motion.div
            initial={{ opacity: 0, x: -100 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 1, ease: "circOut" }}
            className="space-y-10"
          >
            <div className="inline-flex items-center gap-3 px-6 py-2 rounded-full glass border-white/10 text-accent-cyan text-sm font-black uppercase tracking-widest">
              <span className="relative flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent-cyan opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-accent-cyan"></span>
              </span>
              Innovation Digitale au Sénégal
            </div>
            
            <h1 className="text-6xl md:text-8xl font-black leading-[0.9] tracking-tighter">
              Accélérez votre <br />
              <span className="text-gradient">transformation</span> <br />
              digitale
            </h1>
            
            <p className="text-xl text-text-silver/60 max-w-xl leading-relaxed font-medium">
              Nous accompagnons les particuliers, PME, écoles et institutions dans la création de solutions numériques, la communication visuelle et la formation professionnelle.
            </p>
            
            <div className="flex flex-wrap gap-6">
              <Link to="/services" className="btn-primary group">
                Découvrir nos services 
                <ArrowRight className="group-hover:translate-x-2 transition-transform" />
              </Link>
              <Link to="/contact" className="btn-secondary">
                Demander un devis
              </Link>
            </div>

            <div className="pt-8 flex items-center gap-8 border-t border-white/5">
              <div className="flex -space-x-4">
                {[1, 2, 3, 4].map(i => (
                  <img 
                    key={i} 
                    src={`/images/avatars/client${i}.jpg`}
                    className="w-12 h-12 rounded-full border-4 border-primary" 
                    alt={`Client ${i}`}
                  />
                ))}
              </div>
              <div className="text-sm">
                <div className="font-black text-white">+50 Clients Satisfaits</div>
                <div className="text-text-silver/40">À Thiès, Dakar et partout au Sénégal</div>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.8, rotate: 5 }}
            animate={{ opacity: 1, scale: 1, rotate: 0 }}
            transition={{ duration: 1.2, ease: "backOut" }}
            className="relative hidden lg:block"
          >
            <div className="relative z-10 rounded-[60px] overflow-hidden border border-white/10 shadow-2xl animate-float">
              <img
                src="/images/hero.jpg"
                alt="OpenTech Business"
                className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-1000"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-primary via-transparent to-transparent opacity-60" />
            </div>

            {/* Floating Tech Cards */}
            <motion.div 
              animate={{ y: [0, -20, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              className="absolute -top-10 -right-10 p-8 glass rounded-[40px] glow-blue z-20"
            >
              <Code className="text-accent-blue mb-4" size={40} />
              <div className="text-lg font-black">Full Stack</div>
              <div className="text-xs text-text-silver/40 uppercase tracking-widest">Solutions Web</div>
            </motion.div>

            <motion.div 
              animate={{ y: [0, 20, 0] }}
              transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
              className="absolute -bottom-10 -left-10 p-8 glass rounded-[40px] glow-cyan z-20"
            >
              <PenTool className="text-accent-cyan mb-4" size={40} />
              <div className="text-lg font-black">Creative</div>
              <div className="text-xs text-text-silver/40 uppercase tracking-widest">Design & Print</div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Presentation Section */}
      <section className="py-32 px-6 relative">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-24 items-center">
          <div className="relative order-2 lg:order-1">
            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-6 pt-12">
                <div className="h-80 rounded-[40px] overflow-hidden border border-white/10 group">
                  <img src="/images/about-1.jpg" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" referrerPolicy="no-referrer" />
                </div>
                <div className="h-60 rounded-[40px] overflow-hidden border border-white/10 group">
                  <img src="/images/about-2.jpg" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" referrerPolicy="no-referrer" />
                </div>
              </div>
              <div className="space-y-6">
                <div className="h-60 rounded-[40px] overflow-hidden border border-white/10 group">
                  <img src="/images/about-3.jpg" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" referrerPolicy="no-referrer" />
                </div>
                <div className="h-80 rounded-[40px] overflow-hidden border border-white/10 group">
                  <img src="/images/about-4.jpg" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" referrerPolicy="no-referrer" />
                </div>
              </div>
            </div>
            <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-accent-orange rounded-full flex items-center justify-center text-white font-black text-center p-4 rotate-12 glow-orange">
              Expertise <br /> Locale
            </div>
          </div>

          <div className="space-y-10 order-1 lg:order-2">
            <div className="space-y-4">
              <h2 className="text-4xl md:text-6xl font-black tracking-tighter">
                Rendre la technologie <br />
                <span className="text-accent-cyan">accessible à tous</span>
              </h2>
              <div className="w-24 h-2 bg-accent-blue rounded-full" />
            </div>
            
            <div className="space-y-6 text-lg text-text-silver/70 leading-relaxed">
              <p>
                OpenTech Business est une entreprise innovante basée à <span className="text-white font-bold">Thiès (Cité Ballabey)</span> et <span className="text-white font-bold">Dakar (Ouest Foire)</span>. Nous sommes le pont entre vos ambitions et les outils numériques de demain.
              </p>
              <p>
                Notre mission est claire : rendre la technologie accessible, utile et surtout rentable pour chaque entrepreneur, chaque école et chaque institution au Sénégal.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {values.map((v, i) => (
                <div key={i} className="p-6 glass rounded-3xl border-white/5 hover:border-accent-cyan/30 transition-colors group">
                  <div className="w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center text-accent-cyan mb-4 group-hover:scale-110 transition-transform">
                    {v.icon}
                  </div>
                  <h4 className="font-bold text-white mb-2">{v.title}</h4>
                  <p className="text-sm text-text-silver/40">{v.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Pôles d'activités */}
      <section className="py-32 px-6 bg-primary-dark/50 relative">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-24 space-y-6">
            <h2 className="text-5xl md:text-7xl font-black tracking-tighter">Nos Pôles d'Excellence</h2>
            <p className="text-xl text-text-silver/40 max-w-3xl mx-auto">
              Une structure organisée en deux pôles majeurs pour couvrir l'intégralité de vos besoins en transformation digitale.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {poles.map((pole, i) => (
              <motion.div
                key={i}
                whileHover={{ y: -20 }}
                className={cn(
                  "relative p-12 glass rounded-[60px] border-white/5 overflow-hidden group",
                  pole.color === "accent-blue" ? "hover:border-accent-blue/50" : "hover:border-accent-cyan/50"
                )}
              >
                <div className={cn(
                  "absolute -top-20 -right-20 w-64 h-64 rounded-full blur-[100px] opacity-20 transition-opacity group-hover:opacity-40",
                  pole.color === "accent-blue" ? "bg-accent-blue" : "bg-accent-cyan"
                )} />

                <div className="relative z-10 space-y-10">
                  <div className={cn(
                    "w-20 h-20 rounded-3xl flex items-center justify-center text-white",
                    pole.color === "accent-blue" ? "bg-accent-blue glow-blue" : "bg-accent-cyan glow-cyan"
                  )}>
                    {pole.icon}
                  </div>

                  <h3 className="text-4xl font-black">{pole.title}</h3>

                  <ul className="space-y-4">
                    {pole.services.map((s, idx) => (
                      <li key={idx} className="flex items-start gap-4 text-lg text-text-silver/70">
                        <CheckCircle2 className={cn(
                          "mt-1 shrink-0",
                          pole.color === "accent-blue" ? "text-accent-blue" : "text-accent-cyan"
                        )} size={20} />
                        {s}
                      </li>
                    ))}
                  </ul>

                  <Link 
                    to="/services" 
                    className={cn(
                      "inline-flex items-center gap-3 font-black uppercase tracking-widest text-sm group/btn",
                      pole.color === "accent-blue" ? "text-accent-blue" : "text-accent-cyan"
                    )}
                  >
                    En savoir plus <ArrowRight className="group-hover/btn:translate-x-3 transition-transform" />
                  </Link>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-32 px-6">
        <div className="max-w-5xl mx-auto glass rounded-[60px] p-16 text-center space-y-10 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-accent-blue via-accent-cyan to-accent-green" />
          
          <h2 className="text-4xl md:text-6xl font-black tracking-tighter">
            Prêt à lancer votre <br />
            <span className="text-gradient">projet numérique ?</span>
          </h2>
          
          <p className="text-xl text-text-silver/60 max-w-2xl mx-auto">
            Que vous soyez une PME, une école ou un particulier, nous avons la solution adaptée à vos ambitions et à votre budget.
          </p>

          <div className="flex flex-wrap justify-center gap-6">
            <Link to="/contact" className="btn-primary px-12 py-6 text-xl">
              Demander un devis gratuit
            </Link>
            <Link to="/shop" className="btn-secondary px-12 py-6 text-xl">
              Voir nos packs
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
