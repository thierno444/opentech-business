import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import { 
  Save, 
  ArrowLeft, 
  Image as ImageIcon, 
  Tag, 
  DollarSign, 
  AlignLeft, 
  Layers,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  X
} from 'lucide-react';
import { motion } from 'motion/react';

export default function ProductForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const token = localStorage.getItem('token');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: 0,
    category: '',
    image: '',
    features: [] as string[],
  });

  const [featureInput, setFeatureInput] = useState('');

  useEffect(() => {
    if (!token) navigate('/login');
    if (id) fetchProduct();
  }, [id, token]);

  const fetchProduct = async () => {
    try {
      const { data } = await axios.get(`/api/products/${id}`);
      setFormData(data);
    } catch (err) {
      setError('Erreur lors du chargement du produit');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const config = { headers: { Authorization: `Bearer ${token}` } };
      if (id) {
        await axios.put(`/api/products/${id}`, formData, config);
      } else {
        await axios.post('/api/products', formData, config);
      }
      setSuccess(true);
      setTimeout(() => navigate('/admin'), 2000);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Erreur lors de l\'enregistrement');
    } finally {
      setLoading(false);
    }
  };

  const addFeature = () => {
    if (featureInput.trim()) {
      setFormData({ ...formData, features: [...formData.features, featureInput.trim()] });
      setFeatureInput('');
    }
  };

  const removeFeature = (index: number) => {
    setFormData({ ...formData, features: formData.features.filter((_, i) => i !== index) });
  };

  return (
    <div className="pt-32 pb-24 px-6 min-h-screen bg-primary relative overflow-hidden">
      {/* Background Glows */}
      <div className="absolute top-0 left-0 w-[600px] h-[600px] bg-accent-blue/5 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-[600px] h-[600px] bg-accent-cyan/5 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-5xl mx-auto relative z-10">
        <button
          onClick={() => navigate('/admin')}
          className="flex items-center gap-2 text-text-silver/40 hover:text-white transition-colors mb-12 group"
        >
          <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
          <span className="font-black uppercase tracking-widest text-xs">Retour au Dashboard</span>
        </button>

        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-16">
          <div className="space-y-2">
            <h1 className="text-5xl font-black tracking-tighter">
              {id ? 'Modifier' : 'Nouveau'} <span className="text-gradient">Produit</span>
            </h1>
            <p className="text-text-silver/40 font-medium">Configurez les détails de votre produit premium.</p>
          </div>
          <div className="w-20 h-20 glass rounded-3xl flex items-center justify-center text-accent-cyan glow-cyan">
            <Sparkles size={40} />
          </div>
        </div>

        {error && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8 p-6 glass border-red-500/20 bg-red-500/5 rounded-3xl flex items-center gap-4 text-red-500"
          >
            <AlertCircle size={24} />
            <span className="font-bold">{error}</span>
          </motion.div>
        )}

        {success && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8 p-6 glass border-accent-green/20 bg-accent-green/5 rounded-3xl flex items-center gap-4 text-accent-green"
          >
            <CheckCircle2 size={24} />
            <span className="font-bold">Produit enregistré avec succès ! Redirection...</span>
          </motion.div>
        )}

        <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Left Column: Main Info */}
          <div className="lg:col-span-2 space-y-8">
            <div className="glass rounded-[60px] p-10 md:p-16 border-white/5 space-y-10">
              <div className="space-y-4">
                <label className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-text-silver/40 ml-2">
                  <Tag size={14} /> Nom du Produit
                </label>
                <input
                  required
                  type="text"
                  placeholder="Ex: MacBook Pro M3 Max"
                  className="w-full px-8 py-5 glass rounded-3xl focus:border-accent-blue outline-none transition-all text-xl font-bold"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                />
              </div>

              <div className="space-y-4">
                <label className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-text-silver/40 ml-2">
                  <AlignLeft size={14} /> Description Détaillée
                </label>
                <textarea
                  required
                  rows={6}
                  placeholder="Décrivez les caractéristiques exceptionnelles de ce produit..."
                  className="w-full px-8 py-5 glass rounded-3xl focus:border-accent-cyan outline-none transition-all text-lg resize-none"
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                />
              </div>

              <div className="space-y-6">
                <label className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-text-silver/40 ml-2">
                  <Sparkles size={14} /> Points Forts / Caractéristiques
                </label>
                <div className="space-y-4">
                  <div className="flex gap-4">
                    <input
                      type="text"
                      placeholder="Ajouter un détail..."
                      className="flex-1 px-8 py-4 glass rounded-2xl focus:border-accent-green outline-none transition-all"
                      value={featureInput}
                      onChange={(e) => setFeatureInput(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addFeature())}
                    />
                    <button
                      type="button"
                      onClick={addFeature}
                      className="px-8 bg-accent-blue text-white rounded-2xl font-bold glow-blue"
                    >
                      Ajouter
                    </button>
                  </div>
                  <div className="flex flex-wrap gap-3">
                    {formData.features.map((f, i) => (
                      <motion.div
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        key={i}
                        className="px-6 py-3 glass border-white/10 rounded-full flex items-center gap-3 text-sm font-bold group"
                      >
                        {f}
                        <button
                          type="button"
                          onClick={() => removeFeature(i)}
                          className="text-text-silver/40 hover:text-red-500 transition-colors"
                        >
                          <X size={16} />
                        </button>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Sidebar Info */}
          <div className="space-y-8">
            <div className="glass rounded-[40px] p-8 border-white/5 space-y-8">
              <div className="space-y-4">
                <label className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-text-silver/40 ml-2">
                  <DollarSign size={14} /> Prix (FCFA)
                </label>
                <input
                  required
                  type="number"
                  placeholder="0"
                  className="w-full px-8 py-4 glass rounded-2xl focus:border-accent-orange outline-none transition-all text-2xl font-black text-accent-orange"
                  value={formData.price}
                  onChange={(e) => setFormData({...formData, price: Number(e.target.value)})}
                />
              </div>

              <div className="space-y-4">
                <label className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-text-silver/40 ml-2">
                  <Layers size={14} /> Catégorie
                </label>
                <input
                  required
                  type="text"
                  placeholder="Ex: Informatique"
                  className="w-full px-8 py-4 glass rounded-2xl focus:border-accent-cyan outline-none transition-all font-bold"
                  value={formData.category}
                  onChange={(e) => setFormData({...formData, category: e.target.value})}
                />
              </div>

              <div className="space-y-4">
                <label className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-text-silver/40 ml-2">
                  <ImageIcon size={14} /> URL de l'Image
                </label>
                <input
                  required
                  type="text"
                  placeholder="https://..."
                  className="w-full px-8 py-4 glass rounded-2xl focus:border-accent-blue outline-none transition-all text-sm"
                  value={formData.image}
                  onChange={(e) => setFormData({...formData, image: e.target.value})}
                />
                {formData.image && (
                  <div className="mt-4 rounded-2xl overflow-hidden glass border-white/10 aspect-square">
                    <img src={formData.image} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                  </div>
                )}
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full py-6 text-xl flex items-center justify-center gap-4 group disabled:opacity-50"
            >
              {loading ? 'Enregistrement...' : (
                <>
                  <Save size={24} />
                  {id ? 'Mettre à jour' : 'Publier le Produit'}
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
