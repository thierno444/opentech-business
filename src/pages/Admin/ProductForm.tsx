import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
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
  X,
} from "lucide-react";
import { motion } from "motion/react";

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
    features: [] as string[],
    images: [] as string[],
  });

  const [featureInput, setFeatureInput] = useState("");
  const [selectedFiles, setSelectedFiles] = useState<FileList | null>(null);
  const [previewImages, setPreviewImages] = useState<string[]>([]);

  useEffect(() => {
    if (!token) navigate("/login");
    if (id) fetchProduct();
  }, [id, token]);

  // Charger le produit à modifier
  const fetchProduct = async () => {
    try {
      const { data } = await axios.get(`/api/products/${id}`);
      setFormData(data);
      if (data.images && data.images.length) setPreviewImages(data.images);
    } catch {
      setError("Erreur lors du chargement du produit");
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    setSelectedFiles(files);
    if (files) {
      const urls = Array.from(files).map((f) => URL.createObjectURL(f));
      setPreviewImages(urls);
    }
  };

  // Sauvegarde
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
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
      data.append("features", JSON.stringify(formData.features));
      if (selectedFiles) {
        Array.from(selectedFiles).forEach((f) => data.append("images", f));
      }

      if (id) {
        await axios.put(`/api/products/${id}`, data, config);
      } else {
        await axios.post("/api/products", data, config);
      }

      setSuccess(true);
      setTimeout(() => navigate("/admin"), 2000);
    } catch (err: any) {
      console.error(err);
      setError(
        err.response?.data?.message || "Erreur lors de l'enregistrement"
      );
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

  return (
    <div className="pt-32 pb-24 px-6 min-h-screen bg-primary relative overflow-hidden">
      {/* décor */}
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
          {/* Colonne gauche */}
          <div className="lg:col-span-2 space-y-8">
            <div className="glass rounded-[60px] p-10 md:p-16 border-white/5 space-y-10">
              {/* Nom */}
              <div>
                <label className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-text-silver/40 ml-2">
                  <Tag size={14} /> Nom du Produit
                </label>
                <input
                  required
                  type="text"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  placeholder="Ex: MacBook Pro M3 Max"
                  className="w-full px-8 py-5 glass rounded-3xl text-xl font-bold outline-none"
                />
              </div>

              {/* Description */}
              <div>
                <label className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-text-silver/40 ml-2">
                  <AlignLeft size={14} /> Description
                </label>
                <textarea
                  required
                  rows={6}
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  className="w-full px-8 py-5 glass rounded-3xl text-lg resize-none outline-none"
                />
              </div>

              {/* Points forts */}
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
                    onKeyDown={(e) =>
                      e.key === "Enter" && (e.preventDefault(), addFeature())
                    }
                    className="flex-1 px-8 py-4 glass rounded-2xl outline-none"
                  />
                  <button
                    type="button"
                    onClick={addFeature}
                    className="px-8 bg-accent-blue text-white rounded-2xl"
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

          {/* Colonne droite */}
          <div className="space-y-8">
            <div className="glass rounded-[40px] p-8 border-white/5 space-y-8">
              {/* Prix */}
              <div>
                <label className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-text-silver/40 ml-2">
                  <DollarSign size={14} /> Prix (FCFA)
                </label>
                <input
                  required
                  type="number"
                  value={formData.price}
                  onChange={(e) =>
                    setFormData({ ...formData, price: Number(e.target.value) })
                  }
                  className="w-full px-8 py-4 glass rounded-2xl text-2xl font-black text-accent-orange outline-none"
                />
              </div>

              {/* Catégorie */}
              <div>
                <label className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-text-silver/40 ml-2">
                  <Layers size={14} /> Catégorie
                </label>
                <input
                  required
                  type="text"
                  value={formData.category}
                  onChange={(e) =>
                    setFormData({ ...formData, category: e.target.value })
                  }
                  className="w-full px-8 py-4 glass rounded-2xl font-bold outline-none"
                />
              </div>

              {/* Images */}
              <div>
                <label className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-text-silver/40 ml-2">
                  <ImageIcon size={14} /> Images du produit
                </label>
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleFileChange}
                  className="w-full px-8 py-4 glass rounded-2xl text-sm"
                />
                {previewImages.length > 0 && (
                  <div className="mt-4 grid grid-cols-2 gap-4">
                    {previewImages.map((src, i) => (
                      <div
                        key={i}
                        className="rounded-2xl overflow-hidden glass border-white/10 aspect-square"
                      >
                        <img
                          src={src}
                          className="w-full h-full object-cover"
                          alt={`preview-${i}`}
                        />
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full py-6 text-xl flex items-center justify-center gap-4 group disabled:opacity-50"
            >
              {loading ? "Enregistrement..." : <><Save size={24} /> {id ? "Mettre à jour" : "Publier le produit"}</>}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}