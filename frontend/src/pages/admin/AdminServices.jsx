import React, { useState, useEffect } from 'react';
import { Layers, Plus, Edit2, Trash2, Check, X, Sparkles } from 'lucide-react';
import api, { DEFAULT_SERVICES } from '../../services/api';

const AdminServices = () => {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingService, setEditingService] = useState(null);

  const [formData, setFormData] = useState({
    title: '',
    category: 'Video Editing',
    description: '',
    basePrice: 100,
    deliveryTime: '24 Hours',
    features: '',
    popular: false,
  });

  const fetchServices = async () => {
    setLoading(true);
    try {
      const res = await api.get('/services/admin');
      if (res.data?.data) {
        setServices(res.data.data);
      }
    } catch (err) {
      setServices(DEFAULT_SERVICES);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchServices();
  }, []);

  const handleOpenAdd = () => {
    setEditingService(null);
    setFormData({
      title: '',
      category: 'Video Editing',
      description: '',
      basePrice: 100,
      deliveryTime: '24 Hours',
      features: 'Full HD 1080p, Sound Effects, Revisions Included',
      popular: false,
    });
    setModalOpen(true);
  };

  const handleOpenEdit = (srv) => {
    setEditingService(srv);
    setFormData({
      title: srv.title,
      category: srv.category,
      description: srv.description,
      basePrice: srv.basePrice,
      deliveryTime: srv.deliveryTime,
      features: Array.isArray(srv.features) ? srv.features.join(', ') : srv.features,
      popular: srv.popular,
    });
    setModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        ...formData,
        basePrice: Number(formData.basePrice),
        features: formData.features.split(',').map((f) => f.trim()),
      };

      if (editingService) {
        await api.put(`/services/${editingService._id}`, payload);
      } else {
        await api.post('/services', payload);
      }

      setModalOpen(false);
      fetchServices();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to save service');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this service?')) return;
    try {
      await api.delete(`/services/${id}`);
      setServices(services.filter((s) => s._id !== id));
    } catch (err) {
      alert('Failed to delete service');
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-white flex items-center gap-2">
            <Layers className="w-7 h-7 text-brand-yellow" />
            <span>Manage Services & Pricing</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Add or update video packages, pricing rates, and features shown on dipueditx.in
          </p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="bg-brand-yellow hover:bg-brand-yellowHover text-black font-black text-xs sm:text-sm px-5 py-2.5 rounded-xl flex items-center gap-2 shadow-lg shadow-yellow-500/20 transition-all"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Service</span>
        </button>
      </div>

      {/* Services List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {services.map((srv) => (
          <div
            key={srv._id}
            className="bg-brand-card border border-brand-border rounded-3xl p-6 flex flex-col justify-between hover:border-brand-yellow/50 transition-all shadow-xl"
          >
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-bold text-slate-400 uppercase bg-slate-900 px-3 py-1 rounded-full">
                  {srv.category}
                </span>
                <span className="text-2xl font-black text-brand-yellow">
                  ₹{srv.basePrice}
                </span>
              </div>

              <h3 className="text-lg font-black text-white mb-2">
                {srv.title}
              </h3>
              <p className="text-xs text-slate-400 leading-relaxed mb-4">
                {srv.description}
              </p>

              <div className="text-xs text-slate-500 font-semibold mb-4">
                TAT: <span className="text-slate-300">{srv.deliveryTime}</span>
              </div>
            </div>

            <div className="pt-4 border-t border-brand-border flex items-center justify-between">
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                srv.popular ? 'bg-yellow-500/20 text-brand-yellow' : 'bg-slate-800 text-slate-400'
              }`}>
                {srv.popular ? '⭐ Featured' : 'Standard'}
              </span>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleOpenEdit(srv)}
                  className="p-2 rounded-xl bg-slate-800 text-slate-300 hover:text-white hover:bg-slate-700 transition-colors"
                  title="Edit"
                >
                  <Edit2 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleDelete(srv._id)}
                  className="p-2 rounded-xl bg-red-950/40 text-red-400 hover:bg-red-900/60 transition-colors"
                  title="Delete"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Add / Edit Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="relative w-full max-w-lg bg-brand-card border border-brand-border rounded-3xl p-6 sm:p-8 shadow-2xl">
            
            <button
              onClick={() => setModalOpen(false)}
              className="absolute top-5 right-5 w-8 h-8 rounded-full bg-slate-800 text-slate-400 hover:text-white flex items-center justify-center transition-colors"
            >
              <X className="w-4 h-4" />
            </button>

            <h3 className="text-xl font-black text-white mb-4">
              {editingService ? 'Edit Service' : 'Add New Service Package'}
            </h3>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">Title *</label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="e.g. 9:16 Shorts & Reels Editing"
                  className="w-full bg-slate-900 border border-brand-border rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-brand-yellow"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">Category</label>
                  <input
                    type="text"
                    required
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    placeholder="e.g. AI Video / Healthcare"
                    className="w-full bg-slate-900 border border-brand-border rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-brand-yellow"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">Price (₹ INR) *</label>
                  <input
                    type="number"
                    required
                    value={formData.basePrice}
                    onChange={(e) => setFormData({ ...formData, basePrice: e.target.value })}
                    className="w-full bg-slate-900 border border-brand-border rounded-xl px-3 py-2 text-xs text-white font-bold text-brand-yellow focus:outline-none focus:border-brand-yellow"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">Delivery Time</label>
                  <input
                    type="text"
                    value={formData.deliveryTime}
                    onChange={(e) => setFormData({ ...formData, deliveryTime: e.target.value })}
                    placeholder="e.g. 24 Hours"
                    className="w-full bg-slate-900 border border-brand-border rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-brand-yellow"
                  />
                </div>
                <div className="flex items-center gap-2 pt-6">
                  <input
                    type="checkbox"
                    id="popular"
                    checked={formData.popular}
                    onChange={(e) => setFormData({ ...formData, popular: e.target.checked })}
                    className="w-4 h-4 rounded text-brand-yellow focus:ring-0"
                  />
                  <label htmlFor="popular" className="text-xs font-bold text-slate-300 cursor-pointer">
                    Highlight as Popular
                  </label>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">Description</label>
                <textarea
                  rows={2}
                  required
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Short description of what the client gets..."
                  className="w-full bg-slate-900 border border-brand-border rounded-xl px-4 py-2 text-xs text-white focus:outline-none focus:border-brand-yellow"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">Features (comma separated)</label>
                <input
                  type="text"
                  value={formData.features}
                  onChange={(e) => setFormData({ ...formData, features: e.target.value })}
                  placeholder="1080p Full HD, Sound Effects, 2 Revisions"
                  className="w-full bg-slate-900 border border-brand-border rounded-xl px-4 py-2 text-xs text-white focus:outline-none focus:border-brand-yellow"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-brand-yellow hover:bg-brand-yellowHover text-black font-black text-sm rounded-xl transition-all"
              >
                {editingService ? 'Save Changes' : 'Create Service Package'}
              </button>
            </form>

          </div>
        </div>
      )}

    </div>
  );
};

export default AdminServices;

