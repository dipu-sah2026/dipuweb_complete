import React, { useState, useEffect } from 'react';
import { Film, Plus, Trash2, X, Play, Tag } from 'lucide-react';
import api, { DEFAULT_PORTFOLIO } from '../../services/api';

const AdminPortfolio = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);

  const [formData, setFormData] = useState({
    title: '',
    category: 'Doctor / Hospital',
    videoUrl: '',
    thumbnailUrl: '',
    aspectRatio: '9:16',
    description: '',
    toolsUsed: 'CapCut, Midjourney, VN',
  });

  const fetchPortfolio = async () => {
    setLoading(true);
    try {
      const res = await api.get('/portfolio');
      if (res.data?.data) {
        setItems(res.data.data);
      }
    } catch (err) {
      setItems(DEFAULT_PORTFOLIO);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPortfolio();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        ...formData,
        toolsUsed: formData.toolsUsed.split(',').map((t) => t.trim()),
      };

      await api.post('/portfolio', payload);
      setModalOpen(false);
      fetchPortfolio();
    } catch (err) {
      alert('Failed to add portfolio item');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to remove this project?')) return;
    try {
      await api.delete(`/portfolio/${id}`);
      setItems(items.filter((i) => i._id !== id));
    } catch (err) {
      alert('Failed to delete item');
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-white flex items-center gap-2">
            <Film className="w-7 h-7 text-brand-yellow" />
            <span>Manage Project Showcase</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Add or remove video editing samples, doctor explanation reels, and YouTube shorts.
          </p>
        </div>

        <button
          onClick={() => setModalOpen(true)}
          className="bg-brand-yellow hover:bg-brand-yellowHover text-black font-black text-xs sm:text-sm px-5 py-2.5 rounded-xl flex items-center gap-2 shadow-lg shadow-yellow-500/20 transition-all"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Video Project</span>
        </button>
      </div>

      {/* Grid of Showcase items */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {items.map((item) => (
          <div
            key={item._id}
            className="bg-brand-card border border-brand-border rounded-2xl overflow-hidden shadow-lg flex flex-col justify-between"
          >
            <div className="relative aspect-video bg-slate-900 overflow-hidden">
              <img
                src={item.thumbnailUrl || 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&q=80'}
                alt={item.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute top-2 left-2">
                <span className="bg-black/70 text-brand-yellow text-[10px] font-bold px-2 py-0.5 rounded border border-yellow-500/30">
                  {item.category}
                </span>
              </div>
            </div>

            <div className="p-4 flex-1 flex flex-col justify-between">
              <div>
                <h4 className="text-sm font-black text-white mb-1">
                  {item.title}
                </h4>
                <p className="text-xs text-slate-400 line-clamp-2">
                  {item.description || 'Custom video edited by Dipu Sah'}
                </p>
              </div>

              <div className="pt-3 mt-3 border-t border-brand-border flex items-center justify-between text-xs">
                <span className="text-slate-500 font-bold">{item.aspectRatio}</span>
                <button
                  onClick={() => handleDelete(item._id)}
                  className="p-1.5 rounded-lg bg-red-950/40 text-red-400 hover:bg-red-900/60 transition-colors"
                  title="Delete"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Add Project Modal */}
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
              Add New Video to Showcase
            </h3>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">Title *</label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="e.g. Kidney Stone Removal (Doctor AI Animation)"
                  className="w-full bg-slate-900 border border-brand-border rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-brand-yellow"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">Category</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full bg-slate-900 border border-brand-border rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-brand-yellow"
                  >
                    <option value="Doctor / Hospital">Doctor / Hospital</option>
                    <option value="School / Education">School / Education</option>
                    <option value="AI Realistic">AI Realistic</option>
                    <option value="YouTube Shorts / Reels">YouTube Shorts / Reels</option>
                    <option value="Travel & Lifestyle">Travel & Lifestyle</option>
                    <option value="Business / Brand">Business / Brand</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">Aspect Ratio</label>
                  <select
                    value={formData.aspectRatio}
                    onChange={(e) => setFormData({ ...formData, aspectRatio: e.target.value })}
                    className="w-full bg-slate-900 border border-brand-border rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-brand-yellow"
                  >
                    <option value="9:16">9:16 (Shorts / Reels)</option>
                    <option value="16:9">16:9 (Landscape / YouTube)</option>
                    <option value="1:1">1:1 (Square)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">Video Embed / Player URL *</label>
                <input
                  type="text"
                  required
                  value={formData.videoUrl}
                  onChange={(e) => setFormData({ ...formData, videoUrl: e.target.value })}
                  placeholder="https://www.youtube.com/embed/... or direct mp4 url"
                  className="w-full bg-slate-900 border border-brand-border rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-brand-yellow"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">Cover Thumbnail Image URL</label>
                <input
                  type="url"
                  value={formData.thumbnailUrl}
                  onChange={(e) => setFormData({ ...formData, thumbnailUrl: e.target.value })}
                  placeholder="https://images.unsplash.com/... or poster url"
                  className="w-full bg-slate-900 border border-brand-border rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-brand-yellow"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">Tools Used (comma separated)</label>
                <input
                  type="text"
                  value={formData.toolsUsed}
                  onChange={(e) => setFormData({ ...formData, toolsUsed: e.target.value })}
                  placeholder="CapCut Pro, Midjourney, ElevenLabs, VN"
                  className="w-full bg-slate-900 border border-brand-border rounded-xl px-4 py-2 text-xs text-white focus:outline-none focus:border-brand-yellow"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-brand-yellow hover:bg-brand-yellowHover text-black font-black text-sm rounded-xl transition-all"
              >
                Publish Project to Showcase
              </button>
            </form>

          </div>
        </div>
      )}

    </div>
  );
};

export default AdminPortfolio;

