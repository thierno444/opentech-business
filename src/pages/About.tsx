import React from 'react';
import { motion } from 'motion/react';
import { 
  Target, 
  Eye, 
  Award, 
  Users, 
  MapPin, 
  Phone, 
  Mail, 
  CheckCircle2,
  TrendingUp,
  ShieldCheck,
  Zap,
  Globe
} from 'lucide-react';

export default function About() {
  const stats = [
    { label: "Projets Terminés", value: "150+", icon: <Zap /> },
    { label: "Clients Satisfaits", value: "500+", icon: <Users /> },
    { label: "Années d'Expérience", value: "5+", icon: <Award /> },
    { label: "Villes Couvertes", value: "10+", icon: <Globe /> }
  ];

  const values = [
    {
      title: "Innovation",
      desc: "Nous restons à la pointe des dernières technologies pour vous offrir le meilleur.",
      icon: <Zap className="text-accent-blue" />
    },
    {
      title: "Proximité",
      desc: "Basés à Thiès et Dakar, nous sommes toujours proches de nos clients.",
      icon: <MapPin className="text-accent-cyan" />
    },
    {
      title: "Qualité",
      desc: "Chaque projet est traité avec une attention méticuleuse aux détails.",
      icon: <ShieldCheck className="text-accent-green" />
    },
    {
      title: "Engagement",
      desc: "Votre succès est notre priorité absolue. Nous vous accompagnons sur le long terme.",
      icon: <Target className="text-accent-orange" />
    }
  ];

  return (
    <div className="pt-32 pb-24 px-6 relative overflow-hidden">
      {/* Background Decorative Elements */}
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-accent-blue/5 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-accent-cyan/5 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Hero Section */}
        <div className="text-center mb-32 space-y-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-block px-4 py-1 rounded-full glass border-white/10 text-accent-cyan text-xs font-black uppercase tracking-widest mb-4"
          >
            Notre Histoire & Vision
          </motion.div>
          <h1 className="text-6xl md:text-8xl font-black tracking-tighter leading-[0.9]">
            Propulser le Sénégal <br />
            <span className="text-gradient">vers le futur digital</span>
          </h1>
          <p className="text-xl text-text-silver/40 max-w-3xl mx-auto leading-relaxed">
            OpenTech Business est bien plus qu'une agence digitale. C'est un partenaire stratégique dédié à l'excellence technologique et créative.
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 mb-32">
          {stats.map((stat, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="p-10 glass rounded-[40px] border-white/5 text-center space-y-4 group hover:border-accent-cyan/30 transition-all"
            >
              <div className="w-14 h-14 bg-white/5 rounded-2xl flex items-center justify-center text-accent-cyan mx-auto group-hover:scale-110 transition-transform">
                {stat.icon}
              </div>
              <div className="text-4xl font-black text-white">{stat.value}</div>
              <div className="text-xs text-text-silver/40 uppercase tracking-widest font-bold">{stat.label}</div>
            </motion.div>
          ))}
        </div>

        {/* Mission & Vision - AVEC IMAGE LOCALE */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-24 items-center mb-32">
          <div className="space-y-12">
            <div className="space-y-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-1 bg-accent-blue rounded-full" />
                <h2 className="text-4xl font-black uppercase tracking-tighter">Notre Mission</h2>
              </div>
              <p className="text-xl text-text-silver/60 leading-relaxed">
                Démocratiser l'accès aux outils numériques de haute performance pour les PME, les institutions éducatives et les entrepreneurs au Sénégal. Nous transformons les défis technologiques en opportunités de croissance.
              </p>
            </div>

            <div className="space-y-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-1 bg-accent-cyan rounded-full" />
                <h2 className="text-4xl font-black uppercase tracking-tighter">Notre Vision</h2>
              </div>
              <p className="text-xl text-text-silver/60 leading-relaxed">
                Devenir le leader incontesté de la transformation digitale en Afrique de l'Ouest, en créant un écosystème où l'innovation technologique et la créativité visuelle se rencontrent pour générer un impact social et économique durable.
              </p>
            </div>
          </div>

          <div className="relative">
            <div className="rounded-[60px] overflow-hidden border border-white/10 shadow-2xl animate-float">
              {/* Image locale pour Mission/Vision - Remplacez par votre image */}
              <img 
                src="/images/mission-vision.jpg" 
                alt="Mission et Vision OpenTech Business"
                className="w-full h-[500px] object-cover"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=1000&h=1200&fit=crop";
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-primary via-transparent to-transparent opacity-60" />
            </div>
            <div className="absolute -bottom-10 -left-10 p-10 glass rounded-[40px] glow-blue">
              <Award className="text-accent-blue mb-4" size={48} />
              <div className="text-2xl font-black">Expertise</div>
              <div className="text-xs text-text-silver/40 uppercase tracking-widest">Certifiée</div>
            </div>
          </div>
        </div>

        {/* Values Section */}
        <div className="mb-32">
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-6xl font-black tracking-tighter">Nos Valeurs Fondamentales</h2>
            <div className="w-24 h-2 bg-accent-blue mx-auto mt-6 rounded-full" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((v, i) => (
              <motion.div
                key={i}
                whileHover={{ y: -15 }}
                className="p-10 glass rounded-[40px] border-white/5 space-y-6 group"
              >
                <div className="w-16 h-16 bg-white/5 rounded-3xl flex items-center justify-center group-hover:scale-110 transition-transform">
                  {v.icon}
                </div>
                <h3 className="text-2xl font-black">{v.title}</h3>
                <p className="text-text-silver/60 leading-relaxed">{v.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Locations Section - AVEC IMAGE LOCALE */}
        <div className="glass rounded-[60px] p-16 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-accent-blue/10 to-accent-cyan/10" />
          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div className="space-y-8">
              <h2 className="text-4xl md:text-6xl font-black tracking-tighter">Où nous trouver ?</h2>
              <p className="text-xl text-text-silver/60">
                Nous sommes présents dans les deux pôles économiques majeurs du Sénégal pour mieux vous servir.
              </p>
              
              <div className="space-y-8">
                <div className="flex items-start gap-6">
                  <div className="w-12 h-12 bg-accent-blue/20 rounded-2xl flex items-center justify-center text-accent-blue shrink-0">
                    <MapPin size={24} />
                  </div>
                  <div>
                    <h4 className="text-2xl font-black text-white">Siège Thiès</h4>
                    <p className="text-text-silver/40">Cité Ballabey, Thiès, Sénégal</p>
                  </div>
                </div>

                <div className="flex items-start gap-6">
                  <div className="w-12 h-12 bg-accent-cyan/20 rounded-2xl flex items-center justify-center text-accent-cyan shrink-0">
                    <MapPin size={24} />
                  </div>
                  <div>
                    <h4 className="text-2xl font-black text-white">Agence Dakar</h4>
                    <p className="text-text-silver/40">Ouest Foire, Dakar, Sénégal</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="h-96 rounded-[40px] overflow-hidden border border-white/10 grayscale hover:grayscale-0 transition-all duration-700">
              {/* Image locale pour Localisation - Remplacez par votre image */}
              <img 
                src="/images/localisation.jpg" 
                alt="Localisation OpenTech Business - Thiès et Dakar"
                className="w-full h-full object-cover"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1582268611958-ebfd161ef9cf?w=1200&h=800&fit=crop";
                }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}