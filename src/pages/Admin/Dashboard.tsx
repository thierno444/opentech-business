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
  Filter,
  MoreVertical,
  ChevronRight,
  ArrowUpRight
} from 'lucide-react';
import { formatPrice, cn } from '../../lib/utils';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';

export default function Dashboard() {
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [activeTab, setActiveTab] = useState('products');
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();
  const token = localStorage.getItem('token');

  useEffect(() => {
    if (!token) navigate('/login');
    fetchData();
  }, [token]);

  const fetchData = async () => {
    try {
      const config = { headers: { Authorization: `Bearer ${token}` } };
      const [prodRes, orderRes] = await Promise.all([
        axios.get('/api/products'),
        axios.get('/api/orders', config)
      ]);
      setProducts(prodRes.data);
      setOrders(orderRes.data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteProduct = async (id: string) => {
    if (window.confirm('Supprimer ce produit ?')) {
      try {
        await axios.delete(`/api/products/${id}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        fetchData();
      } catch (err) {
        alert('Erreur lors de la suppression');
      }
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
    window.location.reload();
  };

  const stats = [
    { label: "Ventes Totales", value: formatPrice(orders.reduce((acc, o: any) => acc + o.totalAmount, 0)), icon: <DollarSign />, color: "accent-blue", trend: "+12.5%" },
    { label: "Commandes", value: orders.length, icon: <ShoppingBag />, color: "accent-cyan", trend: "+5.2%" },
    { label: "Produits", value: products.length, icon: <Package />, color: "accent-green", trend: "+2" },
    { label: "Clients", value: "124", icon: <Users />, color: "accent-orange", trend: "+18%" },
  ];

  const filteredProducts = products.filter((p: any) => 
    p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredOrders = orders.filter((o: any) => 
    o.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    o.customerEmail.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="pt-32 pb-24 px-6 min-h-screen bg-primary overflow-hidden relative">
      {/* Background Glows */}
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
                onClick={() => setActiveTab('products')}
                className={cn(
                  "px-8 py-4 rounded-2xl font-black text-sm uppercase tracking-widest transition-all flex items-center gap-3",
                  activeTab === 'products' ? "bg-accent-cyan text-primary glow-cyan" : "text-text-silver/40 hover:text-white"
                )}
              >
                <Package size={20} /> Produits
              </button>
              <button
                onClick={() => setActiveTab('orders')}
                className={cn(
                  "px-8 py-4 rounded-2xl font-black text-sm uppercase tracking-widest transition-all flex items-center gap-3",
                  activeTab === 'orders' ? "bg-accent-cyan text-primary glow-cyan" : "text-text-silver/40 hover:text-white"
                )}
              >
                <ShoppingBag size={20} /> Commandes
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

          {/* Table Area */}
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
                    {filteredProducts.map((p: any) => (
                      <tr key={p._id} className="group hover:bg-white/[0.02] transition-colors">
                        <td className="px-12 py-8">
                          <div className="flex items-center gap-6">
                            <div className="w-16 h-16 rounded-2xl overflow-hidden glass border-white/10">
                              <img src={p.image} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" referrerPolicy="no-referrer" />
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
                    ))}
                  </tbody>
                </motion.table>
              ) : (
                <motion.table
                  key="orders"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="w-full text-left"
                >
                  <thead className="bg-white/5 text-text-silver/40 text-xs uppercase font-black tracking-widest">
                    <tr>
                      <th className="px-12 py-6">Client</th>
                      <th className="px-12 py-6">Montant</th>
                      <th className="px-12 py-6">Statut</th>
                      <th className="px-12 py-6">Date</th>
                      <th className="px-12 py-6 text-right">Détails</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {filteredOrders.map((o: any) => (
                      <tr key={o._id} className="group hover:bg-white/[0.02] transition-colors">
                        <td className="px-12 py-8">
                          <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-full bg-accent-blue/20 flex items-center justify-center text-accent-blue font-black">
                              {o.customerName.charAt(0)}
                            </div>
                            <div>
                              <div className="font-black text-lg text-white">{o.customerName}</div>
                              <div className="text-sm text-text-silver/40">{o.customerEmail}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-12 py-8 font-black text-xl text-accent-cyan">{formatPrice(o.totalAmount)}</td>
                        <td className="px-12 py-8">
                          <span className={cn(
                            "px-6 py-2 rounded-full text-[10px] font-black uppercase tracking-widest border",
                            o.status === 'delivered' ? "bg-accent-green/10 text-accent-green border-accent-green/20" :
                            o.status === 'validated' ? "bg-accent-blue/10 text-accent-blue border-accent-blue/20" : 
                            "bg-accent-orange/10 text-accent-orange border-accent-orange/20"
                          )}>
                            {o.status}
                          </span>
                        </td>
                        <td className="px-12 py-8 text-sm font-bold text-text-silver/60">
                          {new Date(o.createdAt).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })}
                        </td>
                        <td className="px-12 py-8 text-right">
                          <button className="w-12 h-12 glass rounded-xl flex items-center justify-center text-text-silver/40 hover:text-white transition-all">
                            <ChevronRight size={20} />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </motion.table>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
}


