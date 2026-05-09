import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import {
  Save,
  ArrowLeft,
  Image as ImageIcon,
  Video,
  Tag,
  DollarSign,
  AlignLeft,
  Layers,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  X,
  Upload,
  Trash2,
  Play,
  Percent,
  Calendar,
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { API_URL } from "../../config/api";  // ← AJOUT DE L'IMPORT

const BRANDS = [
  { value: "", label: "Sélectionner une marque" },
  { value: "Dell", label: "Dell" },
  { value: "HP", label: "HP" },
  { value: "Lenovo", label: "Lenovo" },
  { value: "Asus", label: "Asus" },
  { value: "Macbook", label: "Apple MacBook" },
  { value: "Acer", label: "Acer" },
  { value: "MSI", label: "MSI" },
  { value: "Canon", label: "Canon" },
  { value: "Epson", label: "Epson" },
  { value: "Brother", label: "Brother" },
  { value: "Xerox", label: "Xerox" },
  { value: "Ricoh", label: "Ricoh" },
  { value: "Kyocera", label: "Kyocera" },
];

const CATEGORIES = [
  { value: "WEB", label: "🌐 Développement Web" },
  { value: "E-COMMERCE", label: "🛒 E-commerce" },
  { value: "FORMATION", label: "📚 Formation" },
  { value: "DESIGN", label: "🎨 Design" },
  { value: "DESIGN-IMPRESSION", label: "🎨 Design & Impression" },
  { value: "MARKETING", label: "📢 Marketing Digital" },
  { value: "ORDINATEURS", label: "💻 Ordinateurs Portables" },
  { value: "IMPRIMANTES", label: "🖨️ Imprimantes & Scanners" },
  { value: "ACCESSOIRES", label: "🔌 Accessoires" },
  { value: "AUTRE", label: "📦 Autre" },
];

export default function ProductForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: 0,
    category: "",
    brand: "",
    features: [] as string[],
    images: [] as string[],
    videos: [] as string[],
    promoPrice: 0,
    promoEndDate: "",
  });

  const [featureInput, setFeatureInput] = useState("");
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [previewImages, setPreviewImages] = useState<string[]>([]);
  const [previewVideos, setPreviewVideos] = useState<string[]>([]);
  const [existingImages, setExistingImages] = useState<string[]>([]);
  const [existingVideos, setExistingVideos] = useState<string[]>([]);
  const [imagesToDelete, setImagesToDelete] = useState<string[]>([]);
  const [videosToDelete, setVideosToDelete] = useState<string[]>([]);

  useEffect(() => {
    if (!token) navigate("/login");
    if (id) fetchProduct();
  }, [id, token]);

  const fetchProduct = async () => {
    try {
      const { data } = await axios.get(`${API_URL}/api/products/${id}`);
      
      setFormData({
        name: data.name || "",
        description: data.description || "",
        price: data.price || 0,
        category: data.category || "",
        brand: data.brand || "",
        features: data.features || [],
        images: data.images || [],
        videos: data.videos || [],
        promoPrice: data.promoPrice || 0,
        promoEndDate: data.promoEndDate ? new Date(data.promoEndDate).toISOString().slice(0, 10) : "",
      });
      
      setExistingImages(data.images || []);
      setExistingVideos(data.videos || []);
      setPreviewImages(data.images || []);
      setPreviewVideos(data.videos || []);
    } catch {
      setError("Erreur lors du chargement du produit");
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      const newFiles = Array.from(files);
      setSelectedFiles(prev => [...prev, ...newFiles]);
      
      newFiles.forEach((file) => {
        const url = URL.createObjectURL(file);
        if (file.type.startsWith('image/')) {
          setPreviewImages(prev => [...prev, url]);
        } else if (file.type.startsWith('video/')) {
          setPreviewVideos(prev => [...prev, url]);
        }
      });
    }
  };

  const removeNewFile = (index: number, type: 'image' | 'video') => {
    if (type === 'image') {
      setSelectedFiles(prev => prev.filter((_, i) => i !== index));
      setPreviewImages(prev => prev.filter((_, i) => i !== index));
    } else {
      const videoIndex = index - previewImages.length;
      setSelectedFiles(prev => prev.filter((_, i) => i !== videoIndex));
      setPreviewVideos(prev => prev.filter((_, i) => i !== videoIndex));
    }
  };

  const removeExistingImage = (imageUrl: string) => {
    setExistingImages(prev => prev.filter(img => img !== imageUrl));
    setImagesToDelete(prev => [...prev, imageUrl]);
    setPreviewImages(prev => prev.filter(img => img !== imageUrl));
  };

  const removeExistingVideo = (videoUrl: string) => {
    setExistingVideos(prev => prev.filter(vid => vid !== videoUrl));
    setVideosToDelete(prev => [...prev, videoUrl]);
    setPreviewVideos(prev => prev.filter(vid => vid !== videoUrl));
  };

  const isValidDate = (dateString: string) => {
    if (!dateString) return true;
    const selectedDate = new Date(dateString);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return selectedDate >= today;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    
    if (formData.promoEndDate && !isValidDate(formData.promoEndDate)) {
      setError("La date de fin de promotion ne peut pas être dans le passé");
      setLoading(false);
      return;
    }
    
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      };

      const data = new FormData();
      data.append("name", formData.name);
      data.append("description", formData.description);
      data.append("price", String(formData.price));
      data.append("category", formData.category);
      data.append("brand", formData.brand);
      data.append("features", JSON.stringify(formData.features));
      data.append("existingImages", JSON.stringify(existingImages));
      data.append("existingVideos", JSON.stringify(existingVideos));
      data.append("imagesToDelete", JSON.stringify(imagesToDelete));
      data.append("videosToDelete", JSON.stringify(videosToDelete));
      data.append("promoPrice", String(formData.promoPrice || 0));
      if (formData.promoEndDate) {
        const endDate = new Date(formData.promoEndDate);
        endDate.setHours(23, 59, 59, 999);
        data.append("promoEndDate", endDate.toISOString());
      } else {
        data.append("promoEndDate", "");
      }
      
      selectedFiles.forEach((file) => {
        data.append("media", file);
      });

      if (id) {
        await axios.put(`${API_URL}/api/products/${id}`, data, config);
      } else {
        await axios.post(`${API_URL}/api/products`, data, config);
      }

      setSuccess(true);
      setTimeout(() => navigate("/admin"), 2000);
    } catch (err: any) {
      console.error(err);
      setError(err.response?.data?.message || "Erreur lors de l'enregistrement");
    } finally {
      setLoading(false);
    }
  };

  const addFeature = () => {
    if (featureInput.trim()) {
      setFormData({
        ...formData,
        features: [...formData.features, featureInput.trim()],
      });
      setFeatureInput("");
    }
  };

  const removeFeature = (i: number) => {
    setFormData({
      ...formData,
      features: formData.features.filter((_, x) => x !== i),
    });
  };

  const isPromoActive = () => {
    if (!formData.promoPrice || formData.promoPrice <= 0) return false;
    if (!formData.promoEndDate) return true;
    const endDate = new Date(formData.promoEndDate);
    endDate.setHours(23, 59, 59, 999);
    return endDate > new Date();
  };

  const getDisplayPrice = () => {
    if (isPromoActive() && formData.promoPrice > 0) {
      return formData.promoPrice;
    }
    return formData.price;
  };

  const getMinDate = () => {
    const today = new Date();
    return today.toISOString().slice(0, 10);
  };

  return (
    <div className="pt-32 pb-24 px-6 min-h-screen bg-primary relative overflow-hidden">
      <div className="absolute top-0 left-0 w-[600px] h-[600px] bg-accent-blue/5 rounded-full blur-[120px]" />
      <div className="absolute bottom-0 right-0 w-[600px] h-[600px] bg-accent-cyan/5 rounded-full blur-[120px]" />

      <div className="max-w-5xl mx-auto relative z-10">
        <button
          onClick={() => navigate("/admin")}
          className="flex items-center gap-2 text-text-silver/40 hover:text-white mb-12 group"
        >
          <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
          <span className="font-black uppercase tracking-widest text-xs">
            Retour au Dashboard
          </span>
        </button>

        <h1 className="text-5xl font-black tracking-tighter mb-10">
          {id ? "Modifier" : "Nouveau"}{" "}
          <span className="text-gradient">Produit</span>
        </h1>

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
            <span className="font-bold">Produit enregistré avec succès !</span>
          </motion.div>
        )}

        <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          <div className="lg:col-span-2 space-y-8">
            <div className="glass rounded-[60px] p-10 md:p-16 border-white/5 space-y-10">
              <div>
                <label className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-text-silver/40 ml-2">
                  <Tag size={14} /> Nom du Produit
                </label>
                <input
                  required
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Ex: Dell XPS 13 Plus"
                  className="w-full px-8 py-5 glass rounded-3xl text-xl font-bold outline-none"
                />
              </div>

              <div>
                <label className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-text-silver/40 ml-2">
                  <AlignLeft size={14} /> Description
                </label>
                <textarea
                  required
                  rows={6}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-8 py-5 glass rounded-3xl text-lg resize-none outline-none"
                />
              </div>

              <div>
                <label className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-text-silver/40 ml-2">
                  <Sparkles size={14} /> Points forts
                </label>
                <div className="flex gap-4 mt-2">
                  <input
                    type="text"
                    placeholder="Ajouter un détail..."
                    value={featureInput}
                    onChange={(e) => setFeatureInput(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addFeature())}
                    className="flex-1 px-8 py-4 glass rounded-2xl outline-none"
                  />
                  <button
                    type="button"
                    onClick={addFeature}
                    className="px-8 bg-accent-blue text-white rounded-2xl font-bold"
                  >
                    Ajouter
                  </button>
                </div>
                <div className="flex flex-wrap gap-3 mt-4">
                  {formData.features.map((f, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="px-6 py-3 glass border-white/10 rounded-full flex items-center gap-3 text-sm font-bold"
                    >
                      {f}
                      <button
                        type="button"
                        onClick={() => removeFeature(i)}
                        className="text-text-silver/40 hover:text-red-500"
                      >
                        <X size={16} />
                      </button>
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-8">
            <div className="glass rounded-[40px] p-8 border-white/5 space-y-8">
              <div>
                <label className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-text-silver/40 ml-2">
                  <DollarSign size={14} /> Prix normal (FCFA)
                </label>
                <input
                  required
                  type="number"
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })}
                  className="w-full px-8 py-4 glass rounded-2xl text-2xl font-black text-accent-orange outline-none"
                />
              </div>

              <div>
                <label className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-text-silver/40 ml-2">
                  <Layers size={14} /> Catégorie
                </label>
                <select
                  required
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="w-full px-8 py-4 glass rounded-2xl font-bold outline-none"
                >
                  <option value="">Sélectionner une catégorie</option>
                  {CATEGORIES.map(cat => (
                    <option key={cat.value} value={cat.value}>{cat.label}</option>
                  ))}
                </select>
              </div>

              {(formData.category === "ORDINATEURS" || formData.category === "IMPRIMANTES") && (
                <div>
                  <label className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-text-silver/40 ml-2">
                    <Tag size={14} /> Marque
                  </label>
                  <select
                    value={formData.brand}
                    onChange={(e) => setFormData({ ...formData, brand: e.target.value })}
                    className="w-full px-8 py-4 glass rounded-2xl font-bold outline-none"
                  >
                    {BRANDS.map(brand => (
                      <option key={brand.value} value={brand.value}>{brand.label}</option>
                    ))}
                  </select>
                </div>
              )}

              <div className="border-t border-white/10 pt-6">
                <h3 className="text-sm font-black uppercase tracking-widest text-accent-cyan mb-4 flex items-center gap-2">
                  <Percent size={14} /> Promotion
                </h3>
                <div className="space-y-4">
                  <div>
                    <label className="text-xs font-black uppercase tracking-widest text-text-silver/40">
                      Prix promo (FCFA)
                    </label>
                    <input
                      type="number"
                      min="0"
                      value={formData.promoPrice}
                      onChange={(e) => setFormData({ ...formData, promoPrice: Number(e.target.value) })}
                      placeholder="0 = pas de promo"
                      className="w-full px-4 py-3 glass rounded-2xl outline-none"
                    />
                    <p className="text-[10px] text-text-silver/40 mt-1">
                      Mettez 0 pour désactiver la promotion
                    </p>
                  </div>
                  <div>
                    <label className="text-xs font-black uppercase tracking-widest text-text-silver/40">
                      <Calendar size={12} className="inline mr-1" /> Date de fin (optionnelle)
                    </label>
                    <input
                      type="date"
                      min={getMinDate()}
                      value={formData.promoEndDate}
                      onChange={(e) => setFormData({ ...formData, promoEndDate: e.target.value })}
                      className="w-full px-4 py-3 glass rounded-2xl outline-none"
                    />
                    <p className="text-[10px] text-text-silver/40 mt-1">
                      Laissez vide pour une promotion sans limite de temps
                    </p>
                  </div>
                </div>
                {isPromoActive() && formData.promoPrice > 0 && (
                  <div className="mt-3 bg-accent-orange/20 rounded-xl p-2 text-center">
                    <p className="text-xs font-bold text-accent-orange">
                      🔥 Promo active ! Prix affiché: {getDisplayPrice().toLocaleString()} FCFA
                    </p>
                  </div>
                )}
                {formData.promoPrice > 0 && !isPromoActive() && formData.promoEndDate && (
                  <div className="mt-3 bg-red-500/20 rounded-xl p-2 text-center">
                    <p className="text-xs font-bold text-red-500">
                      ⚠️ Promotion expirée (date dépassée)
                    </p>
                  </div>
                )}
              </div>

              <div>
                <label className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-text-silver/40 ml-2 mb-4">
                  <Upload size={14} /> Médias (Images & Vidéos)
                </label>
                
                <div className="relative">
                  <input
                    type="file"
                    accept="image/*,video/*"
                    multiple
                    onChange={handleFileChange}
                    className="hidden"
                    id="media-upload"
                  />
                  <label
                    htmlFor="media-upload"
                    className="flex items-center justify-center gap-3 w-full px-8 py-6 glass rounded-2xl border-2 border-dashed border-white/10 hover:border-accent-cyan/50 cursor-pointer transition-all group"
                  >
                    <Upload size={24} className="text-accent-cyan group-hover:scale-110 transition-transform" />
                    <span className="font-bold">Images & Vidéos</span>
                  </label>
                </div>

                {previewImages.length > 0 && (
                  <div className="mt-4">
                    <h4 className="text-xs font-bold uppercase tracking-widest text-accent-cyan mb-3 flex items-center gap-2">
                      <ImageIcon size={14} /> Images ({previewImages.length})
                    </h4>
                    <div className="grid grid-cols-2 gap-4">
                      <AnimatePresence>
                        {previewImages.map((src, i) => {
                          const isExisting = existingImages.includes(src);
                          return (
                            <motion.div
                              key={`img-${i}`}
                              initial={{ opacity: 0, scale: 0.8 }}
                              animate={{ opacity: 1, scale: 1 }}
                              exit={{ opacity: 0, scale: 0.8 }}
                              className="relative group/image rounded-2xl overflow-hidden glass border-white/10 aspect-square"
                            >
                              <img src={src} className="w-full h-full object-cover" />
                              <button
                                type="button"
                                onClick={() => isExisting ? removeExistingImage(src) : removeNewFile(i, 'image')}
                                className="absolute top-2 right-2 w-8 h-8 bg-red-500/80 rounded-xl flex items-center justify-center text-white opacity-0 group-hover/image:opacity-100 transition-all hover:scale-110"
                              >
                                <Trash2 size={16} />
                              </button>
                              {isExisting && (
                                <div className="absolute bottom-2 left-2 px-2 py-1 bg-accent-blue/80 rounded-lg text-[10px] font-bold">
                                  Existant
                                </div>
                              )}
                            </motion.div>
                          );
                        })}
                      </AnimatePresence>
                    </div>
                  </div>
                )}

                {previewVideos.length > 0 && (
                  <div className="mt-4">
                    <h4 className="text-xs font-bold uppercase tracking-widest text-accent-cyan mb-3 flex items-center gap-2">
                      <Video size={14} /> Vidéos ({previewVideos.length})
                    </h4>
                    <div className="grid grid-cols-2 gap-4">
                      <AnimatePresence>
                        {previewVideos.map((src, i) => {
                          const isExisting = existingVideos.includes(src);
                          return (
                            <motion.div
                              key={`vid-${i}`}
                              initial={{ opacity: 0, scale: 0.8 }}
                              animate={{ opacity: 1, scale: 1 }}
                              exit={{ opacity: 0, scale: 0.8 }}
                              className="relative group/video rounded-2xl overflow-hidden glass border-white/10 aspect-video bg-black/50"
                            >
                              <video src={src} className="w-full h-full object-cover" />
                              <div className="absolute inset-0 flex items-center justify-center">
                                <div className="w-12 h-12 bg-accent-cyan/80 rounded-full flex items-center justify-center">
                                  <Play size={24} className="text-white ml-1" />
                                </div>
                              </div>
                              <button
                                type="button"
                                onClick={() => isExisting ? removeExistingVideo(src) : removeNewFile(previewImages.length + i, 'video')}
                                className="absolute top-2 right-2 w-8 h-8 bg-red-500/80 rounded-xl flex items-center justify-center text-white opacity-0 group-hover/video:opacity-100 transition-all hover:scale-110 z-10"
                              >
                                <Trash2 size={16} />
                              </button>
                              {isExisting && (
                                <div className="absolute bottom-2 left-2 px-2 py-1 bg-accent-blue/80 rounded-lg text-[10px] font-bold z-10">
                                  Existant
                                </div>
                              )}
                            </motion.div>
                          );
                        })}
                      </AnimatePresence>
                    </div>
                  </div>
                )}
                
                <p className="text-xs text-text-silver/40 mt-3">
                  Formats images: JPG, PNG, GIF | Vidéos: MP4, WebM (max 100MB)
                </p>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full py-6 text-xl flex items-center justify-center gap-4 group disabled:opacity-50"
            >
              {loading ? (
                <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  <Save size={24} />
                  {id ? "Mettre à jour" : "Publier le produit"}
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}