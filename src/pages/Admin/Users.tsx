import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { motion } from 'motion/react';
import { 
  Users, 
  UserPlus, 
  Trash2, 
  Shield, 
  User, 
  Mail, 
  Calendar,
  X,
  CheckCircle
} from 'lucide-react';
import { useNotification } from '../../context/NotificationContext';
import { useNavigate } from 'react-router-dom';
import { API_URL } from '../../config/api';  // ← AJOUT DE L'IMPORT

interface AdminUser {
  _id: string;
  email: string;
  role: 'admin' | 'user';
  createdAt: string;
}

export default function AdminUsers() {
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newAdmin, setNewAdmin] = useState({ email: '', password: '' });
  const [isCreating, setIsCreating] = useState(false);
  const { showSuccess, showError } = useNotification();
  const navigate = useNavigate();
  const token = localStorage.getItem('token');

  useEffect(() => {
    if (!token) {
      navigate('/login');
      return;
    }
    fetchUsers();
  }, [token]);

  const fetchUsers = async () => {
    try {
      const { data } = await axios.get(`${API_URL}/api/users`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setUsers(data);
    } catch (error) {
      console.error('Erreur chargement utilisateurs:', error);
      showError('Erreur lors du chargement des utilisateurs');
    } finally {
      setLoading(false);
    }
  };

  const handleAddAdmin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAdmin.email || !newAdmin.password) {
      showError('Veuillez remplir tous les champs');
      return;
    }

    setIsCreating(true);
    try {
      await axios.post(`${API_URL}/api/users/register`, {
        email: newAdmin.email,
        password: newAdmin.password,
        role: 'admin'
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      showSuccess('✅ Admin ajouté avec succès');
      setShowAddModal(false);
      setNewAdmin({ email: '', password: '' });
      fetchUsers();
    } catch (error: any) {
      showError(error.response?.data?.message || 'Erreur lors de l\'ajout');
    } finally {
      setIsCreating(false);
    }
  };

  const handleDeleteAdmin = async (userId: string, userEmail: string) => {
    if (userEmail === 'businessopentech@gmail.com') {
      showError('❌ Impossible de supprimer l\'admin principal');
      return;
    }

    if (window.confirm(`Supprimer l'admin ${userEmail} ?`)) {
      try {
        await axios.delete(`${API_URL}/api/users/${userId}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        showSuccess('✅ Admin supprimé avec succès');
        fetchUsers();
      } catch (error) {
        showError('Erreur lors de la suppression');
      }
    }
  };

  if (loading) {
    return (
      <div className="pt-32 pb-24 px-6 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-accent-cyan/20 border-t-accent-cyan rounded-full animate-spin mx-auto"></div>
          <p className="text-text-silver/60 mt-4">Chargement...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-32 pb-24 px-6 min-h-screen">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-12">
          <div>
            <h1 className="text-5xl font-black tracking-tighter">
              Gestion des <span className="text-gradient">Admins</span>
            </h1>
            <p className="text-text-silver/40 mt-2">
              Gérez les administrateurs de votre plateforme
            </p>
          </div>
          <button
            onClick={() => setShowAddModal(true)}
            className="btn-primary px-6 py-3 flex items-center gap-2"
          >
            <UserPlus size={20} /> Ajouter un admin
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="glass rounded-3xl p-6 border-white/5">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-accent-blue/20 rounded-2xl flex items-center justify-center">
                <Users size={24} className="text-accent-blue" />
              </div>
              <div>
                <p className="text-3xl font-black">{users.length}</p>
                <p className="text-text-silver/40 text-sm">Total admins</p>
              </div>
            </div>
          </div>
          <div className="glass rounded-3xl p-6 border-white/5">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-accent-cyan/20 rounded-2xl flex items-center justify-center">
                <Shield size={24} className="text-accent-cyan" />
              </div>
              <div>
                <p className="text-3xl font-black">Super Admin</p>
                <p className="text-text-silver/40 text-sm">Principal</p>
              </div>
            </div>
          </div>
          <div className="glass rounded-3xl p-6 border-white/5">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-accent-green/20 rounded-2xl flex items-center justify-center">
                <UserPlus size={24} className="text-accent-green" />
              </div>
              <div>
                <p className="text-3xl font-black">Illimité</p>
                <p className="text-text-silver/40 text-sm">Nombre d'admins</p>
              </div>
            </div>
          </div>
        </div>

        {/* Table des admins */}
        <div className="glass rounded-[40px] overflow-hidden border-white/5">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-white/5">
                <tr>
                  <th className="px-8 py-6 text-text-silver/40 text-xs uppercase font-black tracking-widest">Admin</th>
                  <th className="px-8 py-6 text-text-silver/40 text-xs uppercase font-black tracking-widest">Email</th>
                  <th className="px-8 py-6 text-text-silver/40 text-xs uppercase font-black tracking-widest">Rôle</th>
                  <th className="px-8 py-6 text-text-silver/40 text-xs uppercase font-black tracking-widest">Date</th>
                  <th className="px-8 py-6 text-right text-text-silver/40 text-xs uppercase font-black tracking-widest">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {users.map((user) => (
                  <tr key={user._id} className="group hover:bg-white/5 transition-colors">
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-accent-blue/20 flex items-center justify-center">
                          {user.email === 'businessopentech@gmail.com' ? (
                            <Shield size={18} className="text-accent-blue" />
                          ) : (
                            <User size={18} className="text-accent-cyan" />
                          )}
                        </div>
                        <span className="font-bold">
                          {user.email === 'businessopentech@gmail.com' ? 'Super Admin' : user.email.split('@')[0]}
                        </span>
                      </div>
                    </td>
                    <td className="px-8 py-6 text-text-silver/60">
                      <div className="flex items-center gap-2">
                        <Mail size={14} className="text-text-silver/40" />
                        {user.email}
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase ${
                        user.email === 'businessopentech@gmail.com' 
                          ? 'bg-accent-blue/20 text-accent-blue' 
                          : 'bg-accent-cyan/20 text-accent-cyan'
                      }`}>
                        {user.role === 'admin' ? 'Administrateur' : 'Utilisateur'}
                      </span>
                    </td>
                    <td className="px-8 py-6 text-text-silver/40 text-sm">
                      {new Date(user.createdAt).toLocaleDateString('fr-FR')}
                    </td>
                    <td className="px-8 py-6 text-right">
                      {user.email !== 'businessopentech@gmail.com' && (
                        <button
                          onClick={() => handleDeleteAdmin(user._id, user.email)}
                          className="p-2 text-red-500/40 hover:text-red-500 transition-colors"
                        >
                          <Trash2 size={18} />
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Modal Ajout Admin */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="glass rounded-[40px] max-w-md w-full"
          >
            <div className="p-8 border-b border-white/10">
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-black">Ajouter un admin</h2>
                <button
                  onClick={() => setShowAddModal(false)}
                  className="w-10 h-10 glass rounded-xl flex items-center justify-center"
                >
                  <X size={20} />
                </button>
              </div>
            </div>

            <form onSubmit={handleAddAdmin} className="p-8 space-y-6">
              <div>
                <label className="block text-sm font-bold mb-2">Email</label>
                <input
                  type="email"
                  required
                  value={newAdmin.email}
                  onChange={(e) => setNewAdmin({ ...newAdmin, email: e.target.value })}
                  placeholder="admin@exemple.com"
                  className="w-full px-6 py-4 glass rounded-2xl focus:border-accent-cyan outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-bold mb-2">Mot de passe</label>
                <input
                  type="password"
                  required
                  value={newAdmin.password}
                  onChange={(e) => setNewAdmin({ ...newAdmin, password: e.target.value })}
                  placeholder="••••••••"
                  className="w-full px-6 py-4 glass rounded-2xl focus:border-accent-cyan outline-none"
                />
              </div>

              <button
                type="submit"
                disabled={isCreating}
                className="btn-primary w-full py-4 flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {isCreating ? (
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <>
                    <UserPlus size={20} /> Ajouter l'administrateur
                  </>
                )}
              </button>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  );
}