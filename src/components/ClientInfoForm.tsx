import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { User, Mail, Phone, Save, Edit2, AlertCircle, CheckCircle } from 'lucide-react';
import { useUser } from '../context/UserContext';
import { useNotification } from '../context/NotificationContext';

interface ClientInfoFormProps {
  onInfoChange?: (info: { name: string; email: string; phone: string }) => void;
  compact?: boolean;
}

interface ValidationErrors {
  name?: string;
  email?: string;
  phone?: string;
}

export default function ClientInfoForm({ onInfoChange, compact = false }: ClientInfoFormProps) {
  const { user, updateUserInfo, isLoggedIn } = useUser();
  const { showSuccess, showError } = useNotification();
  const [isEditing, setIsEditing] = useState(false);
  const [errors, setErrors] = useState<ValidationErrors>({});
  const [touched, setTouched] = useState<{ name: boolean; email: boolean; phone: boolean }>({
    name: false,
    email: false,
    phone: false
  });
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: ''
  });

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || '',
        email: user.email || '',
        phone: user.phone || ''
      });
    }
  }, [user]);

  // Validation du nom
  const validateName = (name: string): string | undefined => {
    if (!name || name.trim() === '') {
      return 'Le nom est requis';
    }
    if (name.length < 2) {
      return 'Le nom doit contenir au moins 2 caractères';
    }
    if (name.length > 50) {
      return 'Le nom est trop long (maximum 50 caractères)';
    }
    if (!/^[a-zA-ZÀ-ÿ\s\-']+$/.test(name)) {
      return 'Le nom ne doit contenir que des lettres, espaces, tirets ou apostrophes';
    }
    return undefined;
  };

  // Validation de l'email
  const validateEmail = (email: string): string | undefined => {
    if (email && email.trim() !== '') {
      const emailRegex = /^[^\s@]+@([^\s@.,]+\.)+[^\s@.,]{2,}$/;
      if (!emailRegex.test(email)) {
        return 'Email invalide (exemple: nom@domaine.com)';
      }
      if (email.length > 100) {
        return 'Email trop long (maximum 100 caractères)';
      }
    }
    return undefined;
  };

  // Validation du téléphone
  const validatePhone = (phone: string): string | undefined => {
    if (!phone || phone.trim() === '') {
      return 'Le numéro de téléphone est requis';
    }
    // Nettoie le numéro (enlève espaces, +, etc.)
    const cleanPhone = phone.replace(/[\s\+]/g, '');
    
    // Vérifie le format (Sénégal: 77, 78, 70, 76 + 7 chiffres)
    const phoneRegex = /^(77|78|70|76|75)[0-9]{7}$/;
    const phoneRegexInternational = /^[0-9]{9,15}$/;
    
    if (!phoneRegex.test(cleanPhone) && !phoneRegexInternational.test(cleanPhone)) {
      return 'Numéro invalide (exemple: 771234567 ou +221771234567)';
    }
    return undefined;
  };

  // Validation de tous les champs
  const validateForm = (): boolean => {
    const newErrors: ValidationErrors = {
      name: validateName(formData.name),
      email: validateEmail(formData.email),
      phone: validatePhone(formData.phone)
    };
    setErrors(newErrors);
    return !newErrors.name && !newErrors.phone; // email est optionnel
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Valider le champ modifié
    let error: string | undefined;
    if (name === 'name') error = validateName(value);
    if (name === 'email') error = validateEmail(value);
    if (name === 'phone') error = validatePhone(value);
    
    setErrors(prev => ({ ...prev, [name]: error }));
    
    if (onInfoChange) {
      onInfoChange({ ...formData, [name]: value });
    }
  };

  const handleBlur = (field: 'name' | 'email' | 'phone') => {
    setTouched(prev => ({ ...prev, [field]: true }));
    
    // Valider le champ au blur
    let error: string | undefined;
    if (field === 'name') error = validateName(formData.name);
    if (field === 'email') error = validateEmail(formData.email);
    if (field === 'phone') error = validatePhone(formData.phone);
    
    setErrors(prev => ({ ...prev, [field]: error }));
  };

  const handleSave = () => {
    // Marquer tous les champs comme touchés
    setTouched({ name: true, email: true, phone: true });
    
    // Valider le formulaire
    if (!validateForm()) {
      showError('Veuillez corriger les erreurs dans le formulaire');
      return;
    }
    
    // Sauvegarder les informations
    updateUserInfo(formData);
    setIsEditing(false);
    showSuccess('✅ Informations enregistrées avec succès');
    
    if (onInfoChange) {
      onInfoChange(formData);
    }
  };

  const isFormValid = () => {
    return formData.name.trim() !== '' && 
           validatePhone(formData.phone) === undefined &&
           validateName(formData.name) === undefined;
  };

  if (compact) {
    return (
      <div className="glass rounded-2xl p-4 space-y-3">
        <h3 className="text-sm font-black uppercase tracking-widest text-accent-cyan">Informations client</h3>
        <div className="space-y-2">
          <div className="flex items-center gap-3 text-sm">
            <User size={16} className="text-text-silver/40" />
            <span className={formData.name ? 'text-white' : 'text-text-silver/40'}>
              {formData.name || 'Nom non renseigné'}
            </span>
          </div>
          <div className="flex items-center gap-3 text-sm">
            <Mail size={16} className="text-text-silver/40" />
            <span className={formData.email ? 'text-white' : 'text-text-silver/40'}>
              {formData.email || 'Email non renseigné'}
            </span>
          </div>
          <div className="flex items-center gap-3 text-sm">
            <Phone size={16} className="text-text-silver/40" />
            <span className={formData.phone ? 'text-white' : 'text-text-silver/40'}>
              {formData.phone || 'Téléphone non renseigné'}
            </span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass rounded-3xl p-6 border-white/5"
    >
      <div className="flex justify-between items-center mb-6">
        <div>
          <h3 className="text-lg font-black tracking-tighter">Informations de livraison</h3>
          <p className="text-xs text-text-silver/40 mt-1">
            Veuillez renseigner vos coordonnées pour la livraison
          </p>
        </div>
        {isLoggedIn && !isEditing && (
          <button
            onClick={() => setIsEditing(true)}
            className="text-xs text-accent-cyan flex items-center gap-1 hover:underline"
          >
            <Edit2 size={12} /> Modifier
          </button>
        )}
      </div>

      <div className="space-y-5">
        {/* Champ Nom */}
        <div>
          <label className="block text-xs font-bold uppercase tracking-widest text-text-silver/40 mb-2">
            Nom complet <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <User size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-text-silver/40" />
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              onBlur={() => handleBlur('name')}
              disabled={!isEditing && isLoggedIn}
              placeholder="Jean Dupont"
              className={cn(
                "w-full pl-12 pr-4 py-4 glass rounded-2xl border-2 transition-all outline-none",
                touched.name && errors.name 
                  ? "border-red-500/50 focus:border-red-500" 
                  : touched.name && !errors.name && formData.name
                    ? "border-green-500/50 focus:border-green-500"
                    : "border-white/10 focus:border-accent-cyan",
                (!isEditing && isLoggedIn) && "opacity-50 cursor-not-allowed"
              )}
            />
            {touched.name && errors.name && (
              <div className="absolute right-4 top-1/2 -translate-y-1/2">
                <AlertCircle size={18} className="text-red-500" />
              </div>
            )}
            {touched.name && !errors.name && formData.name && (
              <div className="absolute right-4 top-1/2 -translate-y-1/2">
                <CheckCircle size={18} className="text-green-500" />
              </div>
            )}
          </div>
          {touched.name && errors.name && (
            <p className="text-xs text-red-500 mt-1 flex items-center gap-1">
              <AlertCircle size={12} /> {errors.name}
            </p>
          )}
        </div>

        {/* Champ Email (optionnel) */}
        <div>
          <label className="block text-xs font-bold uppercase tracking-widest text-text-silver/40 mb-2">
            Email <span className="text-text-silver/30">(optionnel)</span>
          </label>
          <div className="relative">
            <Mail size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-text-silver/40" />
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              onBlur={() => handleBlur('email')}
              disabled={!isEditing && isLoggedIn}
              placeholder="jean.dupont@email.com"
              className={cn(
                "w-full pl-12 pr-4 py-4 glass rounded-2xl border-2 transition-all outline-none",
                touched.email && errors.email 
                  ? "border-red-500/50 focus:border-red-500" 
                  : "border-white/10 focus:border-accent-cyan",
                (!isEditing && isLoggedIn) && "opacity-50 cursor-not-allowed"
              )}
            />
            {touched.email && errors.email && (
              <div className="absolute right-4 top-1/2 -translate-y-1/2">
                <AlertCircle size={18} className="text-red-500" />
              </div>
            )}
          </div>
          {touched.email && errors.email && (
            <p className="text-xs text-red-500 mt-1 flex items-center gap-1">
              <AlertCircle size={12} /> {errors.email}
            </p>
          )}
          <p className="text-xs text-text-silver/40 mt-1">
            Utile pour recevoir votre facture par email
          </p>
        </div>

        {/* Champ Téléphone */}
        <div>
          <label className="block text-xs font-bold uppercase tracking-widest text-text-silver/40 mb-2">
            Téléphone <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <Phone size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-text-silver/40" />
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              onBlur={() => handleBlur('phone')}
              disabled={!isEditing && isLoggedIn}
              placeholder="77 123 45 67 ou +221771234567"
              className={cn(
                "w-full pl-12 pr-4 py-4 glass rounded-2xl border-2 transition-all outline-none",
                touched.phone && errors.phone 
                  ? "border-red-500/50 focus:border-red-500" 
                  : touched.phone && !errors.phone && formData.phone
                    ? "border-green-500/50 focus:border-green-500"
                    : "border-white/10 focus:border-accent-cyan",
                (!isEditing && isLoggedIn) && "opacity-50 cursor-not-allowed"
              )}
            />
            {touched.phone && errors.phone && (
              <div className="absolute right-4 top-1/2 -translate-y-1/2">
                <AlertCircle size={18} className="text-red-500" />
              </div>
            )}
            {touched.phone && !errors.phone && formData.phone && (
              <div className="absolute right-4 top-1/2 -translate-y-1/2">
                <CheckCircle size={18} className="text-green-500" />
              </div>
            )}
          </div>
          {touched.phone && errors.phone && (
            <p className="text-xs text-red-500 mt-1 flex items-center gap-1">
              <AlertCircle size={12} /> {errors.phone}
            </p>
          )}
          <p className="text-xs text-text-silver/40 mt-1">
            Format accepté: 771234567 ou +221771234567
          </p>
        </div>

        {(isEditing || !isLoggedIn) && (
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleSave}
            disabled={!isFormValid()}
            className={cn(
              "w-full py-4 rounded-2xl font-black uppercase tracking-widest text-sm flex items-center justify-center gap-2 transition-all",
              isFormValid()
                ? "btn-primary"
                : "bg-white/5 text-text-silver/40 cursor-not-allowed"
            )}
          >
            <Save size={18} /> 
            {isFormValid() ? "Enregistrer mes informations" : "Veuillez remplir les champs obligatoires"}
          </motion.button>
        )}

        {/* Résumé des champs requis */}
        <div className="pt-2 border-t border-white/5">
          <p className="text-[10px] text-text-silver/30">
            <span className="text-red-500">*</span> Champs obligatoires
          </p>
        </div>
      </div>
    </motion.div>
  );
}

// Helper function cn (si pas déjà importée)
function cn(...classes: (string | boolean | undefined)[]) {
  return classes.filter(Boolean).join(' ');
}