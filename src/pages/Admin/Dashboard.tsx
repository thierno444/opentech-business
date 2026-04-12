import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  Plus, 
  Edit, 
  Trash2, 
  Package, 
  ShoppingBag, 
  LogOut, 
  TrendingUp, 
  Users, 
  DollarSign,
  Search,
  Eye,
  XCircle,
  CheckSquare,
  Square
} from 'lucide-react';
import { formatPrice, cn } from '../../lib/utils';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { useNotification } from '../../context/NotificationContext';

// Composant Clock
function Clock({ size }: { size: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10"/>
      <polyline points="12 6 12 12 16 14"/>
    </svg>
  );
}

export default function Dashboard() {
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [activeTab, setActiveTab] = useState('products');
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showOrderModal, setShowOrderModal] = useState(false);
  const [selectedOrders, setSelectedOrders] = useState<string[]>([]);
  const [isDeleting, setIsDeleting] = useState(false);
  const navigate = useNavigate();
  const token = localStorage.getItem('token');
  const { showSuccess, showError } = useNotification();

  const API_URL = import.meta.env.DEV ? 'http://localhost:5000' : '';

  useEffect(() => {
    if (!token) {
      navigate('/login');
      return;
    }
    fetchData();
  }, [token]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const config = { headers: { Authorization: `Bearer ${token}` } };
      
      const [prodRes, orderRes] = await Promise.all([
        axios.get(`${API_URL}/api/products`),
        axios.get(`${API_URL}/api/orders`, config)
      ]);
      
      console.log('📦 Produits chargés:', prodRes.data.length);
      console.log('📋 Commandes chargées:', orderRes.data.length);
      
      setProducts(prodRes.data);
      setOrders(orderRes.data);
    } catch (err: any) {
      console.error('❌ Erreur chargement:', err);
      if (err.response?.status === 401) {
        localStorage.removeItem('token');
        navigate('/login');
      } else if (err.code === 'ERR_NETWORK') {
        showError(`Impossible de contacter le serveur sur ${API_URL}`);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateOrderStatus = async (orderId: string, newStatus: string) => {
    try {
      await axios.put(`${API_URL}/api/orders/${orderId}`, 
        { status: newStatus },
        { headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' } }
      );
      await fetchData();
      const statusText = newStatus === 'validated' ? 'Validée' : newStatus === 'delivered' ? 'Livrée' : 'En attente';
      showSuccess(`✅ Statut mis à jour : ${statusText}`);
    } catch (err) {
      console.error('Erreur mise à jour statut:', err);
      showError('❌ Erreur lors de la mise à jour du statut');
    }
  };

  const handleDeleteProduct = async (id: string) => {
    if (window.confirm('Supprimer ce produit ?')) {
      try {
        await axios.delete(`${API_URL}/api/products/${id}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        await fetchData();
        showSuccess('✅ Produit supprimé avec succès');
      } catch (err) {
        showError('❌ Erreur lors de la suppression');
      }
    }
  };

  // Suppression unique d'une commande
  const handleDeleteOrder = async (orderId: string) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer cette commande ?')) {
      try {
        await axios.delete(`${API_URL}/api/orders/${orderId}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        await fetchData();
        // Retirer la commande de la sélection si elle y était
        setSelectedOrders(prev => prev.filter(id => id !== orderId));
        showSuccess('✅ Commande supprimée avec succès');
      } catch (err) {
        console.error('Erreur suppression:', err);
        showError('❌ Erreur lors de la suppression');
      }
    }
  };

  // Suppression multiple de commandes
  const handleDeleteMultipleOrders = async () => {
    if (selectedOrders.length === 0) {
      showError('Sélectionnez au moins une commande à supprimer');
      return;
    }
    
    if (window.confirm(`Supprimer ${selectedOrders.length} commande(s) ? Cette action est irréversible.`)) {
      setIsDeleting(true);
      try {
        await axios.post(`${API_URL}/api/orders/delete-multiple`, 
          { orderIds: selectedOrders },
          { headers: { Authorization: `Bearer ${token}` } }
        );
        await fetchData();
        showSuccess(`✅ ${selectedOrders.length} commande(s) supprimée(s) avec succès`);
        setSelectedOrders([]);
      } catch (err) {
        console.error('Erreur suppression multiple:', err);
        showError('❌ Erreur lors de la suppression multiple');
      } finally {
        setIsDeleting(false);
      }
    }
  };

  // Sélectionner/Désélectionner toutes les commandes
  const toggleSelectAll = () => {
    if (selectedOrders.length === filteredOrders.length && filteredOrders.length > 0) {
      setSelectedOrders([]);
    } else {
      setSelectedOrders(filteredOrders.map((o: any) => o._id));
    }
  };

  // Sélectionner/Désélectionner une commande
  const toggleSelectOrder = (orderId: string) => {
    if (selectedOrders.includes(orderId)) {
      setSelectedOrders(selectedOrders.filter(id => id !== orderId));
    } else {
      setSelectedOrders([...selectedOrders, orderId]);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
    showSuccess('👋 Déconnexion réussie');
  };

  const viewOrderDetails = (order: any) => {
    setSelectedOrder(order);
    setShowOrderModal(true);
  };

  const stats = [
    { 
      label: "Ventes Totales", 
      value: formatPrice(orders.reduce((acc, o: any) => acc + (o.totalAmount || 0), 0)), 
      icon: <DollarSign />, 
      trend: orders.length > 0 ? "+12.5%" : "0%" 
    },
    { 
      label: "Commandes", 
      value: orders.length, 
      icon: <ShoppingBag />, 
      trend: orders.length > 0 ? `+${orders.length}` : "0" 
    },
    { 
      label: "Produits", 
      value: products.length, 
      icon: <Package />, 
      trend: "+2" 
    },
    { 
      label: "Clients", 
      value: new Set(orders.map((o: any) => o.customerEmail)).size || "0", 
      icon: <Users />, 
      trend: orders.length > 0 ? "+18%" : "0%" 
    },
  ];

  const filteredProducts = products.filter((p: any) => 
    p.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.category?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredOrders = orders.filter((o: any) => 
    o.customerName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    o.customerEmail?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    o.customerPhone?.includes(searchQuery)
  );

  const getStatusColor = (status: string) => {
    switch(status) {
      case 'delivered': return 'bg-green-500/10 text-green-500 border-green-500/20';
      case 'validated': return 'bg-blue-500/10 text-blue-500 border-blue-500/20';
      case 'pending': return 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20';
      default: return 'bg-gray-500/10 text-gray-500 border-gray-500/20';
    }
  };

  const getStatusText = (status: string) => {
    switch(status) {
      case 'delivered': return 'Livrée';
      case 'validated': return 'Validée';
      case 'pending': return 'En attente';
      default: return status;
    }
  };

  return (
    <div className="pt-32 pb-24 px-6 min-h-screen bg-primary overflow-hidden relative">
      <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-accent-blue/5 rounded-full blur-[150px] pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[800px] h-[800px] bg-accent-cyan/5 rounded-full blur-[150px] pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Header */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-8 mb-16">
          <div className="space-y-2">
            <h1 className="text-5xl font-black tracking-tighter">Admin <span className="text-gradient">Console</span></h1>
            <p className="text-text-silver/40 font-medium">Bienvenue, Thierno. Voici l'état de votre business aujourd'hui.</p>
          </div>
          <div className="flex flex-wrap gap-4">
            <button
              onClick={() => navigate('/admin/product/new')}
              className="btn-primary px-8 py-4 text-lg flex items-center gap-3"
            >
              <Plus size={24} /> Nouveau Produit
            </button>
            <button
              onClick={handleLogout}
              className="px-8 py-4 glass rounded-2xl border-white/10 text-white font-bold flex items-center gap-3 hover:bg-red-500/20 hover:border-red-500/30 transition-all"
            >
              <LogOut size={24} /> Déconnexion
            </button>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {stats.map((stat, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="glass p-8 rounded-[40px] border-white/5 relative group overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-24 h-24 bg-white/5 rounded-bl-[60px] flex items-center justify-center text-text-silver/20 group-hover:text-white/10 transition-colors">
                {React.cloneElement(stat.icon as React.ReactElement, { size: 40 })}
              </div>
              <div className="space-y-4">
                <div className="flex items-center gap-2 text-accent-green text-sm font-black">
                  <TrendingUp size={16} /> {stat.trend}
                </div>
                <div>
                  <h4 className="text-text-silver/40 text-sm font-black uppercase tracking-widest">{stat.label}</h4>
                  <div className="text-3xl font-black mt-1">{stat.value}</div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Main Content Area */}
        <div className="glass rounded-[60px] border-white/5 overflow-hidden">
          {/* Tabs & Search */}
          <div className="p-8 md:p-12 border-b border-white/5 flex flex-col md:flex-row justify-between items-center gap-8">
            <div className="flex p-2 glass rounded-3xl border-white/10">
              <button
                onClick={() => {
                  setActiveTab('products');
                  setSelectedOrders([]);
                }}
                className={cn(
                  "px-8 py-4 rounded-2xl font-black text-sm uppercase tracking-widest transition-all flex items-center gap-3",
                  activeTab === 'products' ? "bg-accent-cyan text-primary glow-cyan" : "text-text-silver/40 hover:text-white"
                )}
              >
                <Package size={20} /> Produits ({products.length})
              </button>
              <button
                onClick={() => {
                  setActiveTab('orders');
                  setSelectedOrders([]);
                }}
                className={cn(
                  "px-8 py-4 rounded-2xl font-black text-sm uppercase tracking-widest transition-all flex items-center gap-3",
                  activeTab === 'orders' ? "bg-accent-cyan text-primary glow-cyan" : "text-text-silver/40 hover:text-white"
                )}
              >
                <ShoppingBag size={20} /> Commandes ({orders.length})
              </button>
            </div>

            <div className="relative w-full md:w-96">
              <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-text-silver/40" size={20} />
              <input
                type="text"
                placeholder={`Rechercher un ${activeTab === 'products' ? 'produit' : 'client'}...`}
                className="w-full pl-16 pr-8 py-5 glass rounded-3xl border-white/10 focus:border-accent-cyan outline-none transition-all"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>

          {/* Loading State */}
          {loading ? (
            <div className="flex items-center justify-center py-32">
              <div className="text-center space-y-4">
                <div className="w-16 h-16 border-4 border-accent-cyan/20 border-t-accent-cyan rounded-full animate-spin mx-auto"></div>
                <p className="text-text-silver/60">Chargement des données...</p>
              </div>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <AnimatePresence mode="wait">
                {activeTab === 'products' ? (
                  <motion.table
                    key="products"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="w-full text-left"
                  >
                    <thead className="bg-white/5 text-text-silver/40 text-xs uppercase font-black tracking-widest">
                      <tr>
                        <th className="px-12 py-6">Produit</th>
                        <th className="px-12 py-6">Catégorie</th>
                        <th className="px-12 py-6">Prix</th>
                        <th className="px-12 py-6">Stock</th>
                        <th className="px-12 py-6 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                      {filteredProducts.length === 0 ? (
                        <tr>
                          <td colSpan={5} className="px-12 py-32 text-center text-text-silver/40">
                            Aucun produit trouvé
                          </td>
                        </tr>
                      ) : (
                        filteredProducts.map((p: any) => (
                          <tr key={p._id} className="group hover:bg-white/[0.02] transition-colors">
                            <td className="px-12 py-8">
                              <div className="flex items-center gap-6">
                                <div className="w-16 h-16 rounded-2xl overflow-hidden glass border-white/10">
                                  <img src={p.images?.[0] || p.image} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" referrerPolicy="no-referrer" />
                                </div>
                                <div>
                                  <div className="font-black text-lg text-white">{p.name}</div>
                                  <div className="text-xs text-text-silver/40 font-bold uppercase tracking-widest mt-1">ID: {p._id.slice(-6)}</div>
                                </div>
                              </div>
                            </td>
                            <td className="px-12 py-8">
                              <span className="px-4 py-1 rounded-full glass border-white/10 text-xs font-black uppercase tracking-widest text-accent-cyan">
                                {p.category}
                              </span>
                            </td>
                            <td className="px-12 py-8 font-black text-xl text-white">{formatPrice(p.price)}</td>
                            <td className="px-12 py-8">
                              <div className="flex items-center gap-2">
                                <div className="w-2 h-2 rounded-full bg-accent-green glow-green" />
                                <span className="text-sm font-bold text-text-silver/60">En Stock</span>
                              </div>
                            </td>
                            <td className="px-12 py-8 text-right">
                              <div className="flex justify-end gap-3 opacity-0 group-hover:opacity-100 transition-opacity">
                                <button
                                  onClick={() => navigate(`/admin/product/edit/${p._id}`)}
                                  className="w-12 h-12 glass rounded-xl flex items-center justify-center text-accent-blue hover:bg-accent-blue hover:text-white transition-all"
                                >
                                  <Edit size={20} />
                                </button>
                                <button
                                  onClick={() => handleDeleteProduct(p._id)}
                                  className="w-12 h-12 glass rounded-xl flex items-center justify-center text-red-500 hover:bg-red-500 hover:text-white transition-all"
                                >
                                  <Trash2 size={20} />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </motion.table>
                ) : (
                  <motion.div
                    key="orders"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                  >
                    {/* Barre d'actions pour suppression multiple */}
                    {selectedOrders.length > 0 && (
                      <div className="sticky top-0 z-10 bg-accent-red/10 border-b border-red-500/20 p-4 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <CheckSquare size={18} className="text-accent-cyan" />
                          <span className="text-sm font-medium">{selectedOrders.length} commande(s) sélectionnée(s)</span>
                        </div>
                        <button
                          onClick={handleDeleteMultipleOrders}
                          disabled={isDeleting}
                          className="px-4 py-2 bg-red-500/20 text-red-500 rounded-xl text-sm font-bold flex items-center gap-2 hover:bg-red-500/30 transition-all disabled:opacity-50"
                        >
                          {isDeleting ? (
                            <div className="w-4 h-4 border-2 border-red-500/30 border-t-red-500 rounded-full animate-spin" />
                          ) : (
                            <Trash2 size={14} />
                          )}
                          Supprimer la sélection
                        </button>
                      </div>
                    )}
                    
                    <table className="w-full text-left">
                      <thead className="bg-white/5 text-text-silver/40 text-xs uppercase font-black tracking-widest sticky top-0">
                        <tr>
                          <th className="px-4 py-6 w-12">
                            <button 
                              onClick={toggleSelectAll} 
                              className="hover:text-white transition-colors"
                              disabled={filteredOrders.length === 0}
                            >
                              {selectedOrders.length === filteredOrders.length && filteredOrders.length > 0 ? (
                                <CheckSquare size={18} className="text-accent-cyan" />
                              ) : (
                                <Square size={18} className="text-text-silver/40" />
                              )}
                            </button>
                          </th>
                          <th className="px-12 py-6">Client</th>
                          <th className="px-12 py-6">Montant</th>
                          <th className="px-12 py-6">Statut</th>
                          <th className="px-12 py-6">Date</th>
                          <th className="px-12 py-6 text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-white/5">
                        {filteredOrders.length === 0 ? (
                          <tr>
                            <td colSpan={6} className="px-12 py-32 text-center">
                              <div className="space-y-4">
                                <ShoppingBag size={48} className="mx-auto text-text-silver/20" />
                                <p className="text-text-silver/40">Aucune commande pour le moment</p>
                                <p className="text-sm text-text-silver/30">Cliquez sur "Commander via WhatsApp" dans la boutique</p>
                              </div>
                            </td>
                          </tr>
                        ) : (
                          filteredOrders.map((o: any) => (
                            <tr key={o._id} className="group hover:bg-white/[0.02] transition-colors">
                              <td className="px-4 py-8">
                                <button onClick={() => toggleSelectOrder(o._id)}>
                                  {selectedOrders.includes(o._id) ? (
                                    <CheckSquare size={18} className="text-accent-cyan" />
                                  ) : (
                                    <Square size={18} className="text-text-silver/40 hover:text-white transition-colors" />
                                  )}
                                </button>
                              </td>
                              <td className="px-12 py-8">
                                <div className="flex items-center gap-4">
                                  <div className="w-12 h-12 rounded-full bg-accent-blue/20 flex items-center justify-center text-accent-blue font-black text-lg">
                                    {o.customerName?.charAt(0).toUpperCase() || '?'}
                                  </div>
                                  <div>
                                    <div className="font-black text-lg text-white">{o.customerName || 'Anonyme'}</div>
                                    <div className="text-sm text-text-silver/40">{o.customerEmail || o.customerPhone}</div>
                                  </div>
                                </div>
                              </td>
                              <td className="px-12 py-8 font-black text-xl text-accent-cyan">{formatPrice(o.totalAmount)}</td>
                              <td className="px-12 py-8">
                                <select
                                  value={o.status}
                                  onChange={(e) => handleUpdateOrderStatus(o._id, e.target.value)}
                                  className={cn(
                                    "px-4 py-2 rounded-full text-xs font-black uppercase tracking-widest border cursor-pointer transition-all",
                                    getStatusColor(o.status)
                                  )}
                                >
                                  <option value="pending">⏳ En attente</option>
                                  <option value="validated">✓ Validée</option>
                                  <option value="delivered">🚚 Livrée</option>
                                </select>
                              </td>
                              <td className="px-12 py-8 text-sm font-bold text-text-silver/60">
                                {new Date(o.createdAt).toLocaleDateString('fr-FR', { 
                                  day: 'numeric', 
                                  month: 'short', 
                                  year: 'numeric',
                                  hour: '2-digit',
                                  minute: '2-digit'
                                })}
                              </td>
                              <td className="px-12 py-8 text-right">
                                <div className="flex justify-end gap-2">
                                  <button
                                    onClick={() => viewOrderDetails(o)}
                                    className="w-10 h-10 glass rounded-xl flex items-center justify-center text-text-silver/40 hover:text-accent-cyan transition-all"
                                    title="Voir détails"
                                  >
                                    <Eye size={18} />
                                  </button>
                                  <button
                                    onClick={() => handleDeleteOrder(o._id)}
                                    className="w-10 h-10 glass rounded-xl flex items-center justify-center text-red-500/40 hover:text-red-500 hover:bg-red-500/10 transition-all"
                                    title="Supprimer"
                                  >
                                    <Trash2 size={18} />
                                  </button>
                                </div>
                              </td>
                            </tr>
                          ))
                        )}
                      </tbody>
                    </table>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          )}
        </div>
      </div>

      {/* Modal Détails Commande */}
      <AnimatePresence>
        {showOrderModal && selectedOrder && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4"
            onClick={() => setShowOrderModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="glass rounded-[40px] max-w-2xl w-full max-h-[80vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="sticky top-0 bg-primary/95 backdrop-blur-xl p-8 border-b border-white/10">
                <div className="flex justify-between items-start">
                  <div>
                    <h2 className="text-2xl font-black">Détails de la commande</h2>
                    <p className="text-sm text-text-silver/40 mt-1">ID: {selectedOrder._id}</p>
                  </div>
                  <button
                    onClick={() => setShowOrderModal(false)}
                    className="w-10 h-10 glass rounded-xl flex items-center justify-center hover:bg-red-500/20 transition-colors"
                  >
                    <XCircle size={20} />
                  </button>
                </div>
              </div>
              
              <div className="p-8 space-y-6">
                <div className="space-y-3">
                  <h3 className="text-sm font-black uppercase tracking-widest text-accent-cyan">Informations client</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-text-silver/40 text-xs">Nom complet</p>
                      <p className="font-bold">{selectedOrder.customerName}</p>
                    </div>
                    <div>
                      <p className="text-text-silver/40 text-xs">Email</p>
                      <p>{selectedOrder.customerEmail || 'Non renseigné'}</p>
                    </div>
                    <div>
                      <p className="text-text-silver/40 text-xs">Téléphone</p>
                      <p>{selectedOrder.customerPhone}</p>
                    </div>
                    <div>
                      <p className="text-text-silver/40 text-xs">Statut</p>
                      <p className={cn("inline-block px-2 py-1 rounded-full text-xs font-bold", getStatusColor(selectedOrder.status))}>
                        {getStatusText(selectedOrder.status)}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <h3 className="text-sm font-black uppercase tracking-widest text-accent-cyan">Produits commandés</h3>
                  <div className="space-y-2">
                    {selectedOrder.items?.map((item: any, idx: number) => (
                      <div key={idx} className="flex justify-between items-center p-4 glass rounded-xl">
                        <div>
                          <p className="font-bold">{item.name}</p>
                          <p className="text-sm text-text-silver/60">Quantité: {item.quantity} × {formatPrice(item.price)}</p>
                        </div>
                        <p className="font-bold text-accent-cyan">{formatPrice(item.price * item.quantity)}</p>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="space-y-3">
                  <h3 className="text-sm font-black uppercase tracking-widest text-accent-cyan">Récapitulatif</h3>
                  <div className="flex justify-between items-center pt-4 border-t border-white/10">
                    <p className="text-xl font-black">Total</p>
                    <p className="text-2xl font-black text-accent-cyan">{formatPrice(selectedOrder.totalAmount)}</p>
                  </div>
                  {selectedOrder.message && (
                    <div className="mt-4 p-4 glass rounded-xl">
                      <p className="text-text-silver/40 text-xs mb-1">Message du client</p>
                      <p className="text-sm">{selectedOrder.message}</p>
                    </div>
                  )}
                  <div className="mt-4 p-4 glass rounded-xl">
                    <p className="text-text-silver/40 text-xs mb-1">Date de commande</p>
                    <p className="text-sm">{new Date(selectedOrder.createdAt).toLocaleString('fr-FR')}</p>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}