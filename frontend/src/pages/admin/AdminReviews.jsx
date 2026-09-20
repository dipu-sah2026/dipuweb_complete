import React, { useState, useEffect } from 'react';
import { Star, Plus, Trash2, CheckCircle2, XCircle, X, MessageSquarePlus } from 'lucide-react';
import api from '../../services/api';

const AdminReviews = () => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);

  const [formData, setFormData] = useState({
    clientName: '',
    roleOrCompany: 'YouTuber / Creator',
    serviceType: 'AI Video Editing',
    rating: 5,
    comment: '',
    approved: true,
  });

  const fetchReviews = async () => {
    setLoading(true);
    try {
      const res = await api.get('/reviews/admin');
      if (res.data?.data) {
        setReviews(res.data.data);
      }
    } catch (err) {
      console.log('Unable to fetch admin reviews');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, []);

  const handleToggleApprove = async (review) => {
    try {
      const updated = !review.approved;
      await api.patch(`/reviews/${review._id}`, { approved: updated });
      setReviews(reviews.map((r) => (r._id === review._id ? { ...r, approved: updated } : r)));
    } catch (err) {
      alert('Failed to update status');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this review permanently?')) return;
    try {
      await api.delete(`/reviews/${id}`);
      setReviews(reviews.filter((r) => r._id !== id));
    } catch (err) {
      alert('Failed to delete review');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post('/reviews', formData);
      setModalOpen(false);
      fetchReviews();
    } catch (err) {
      alert('Failed to create review');
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-white flex items-center gap-2">
            <Star className="w-7 h-7 text-brand-yellow fill-brand-yellow" />
            <span>Client Feedback & Testimonials CMS</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Approve visitor feedback or add verified client testimonials displayed on the homepage.
          </p>
        </div>

        <button
          onClick={() => setModalOpen(true)}
          className="bg-brand-yellow hover:bg-brand-yellowHover text-black font-black text-xs sm:text-sm px-5 py-2.5 rounded-xl flex items-center gap-2 shadow-lg shadow-yellow-500/20 transition-all"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Testimonial</span>
        </button>
      </div>

      {loading ? (
        <div className="p-12 text-center text-slate-500">Loading feedback...</div>
      ) : reviews.length === 0 ? (
        <div className="bg-brand-card border border-brand-border rounded-3xl p-12 text-center text-slate-400">
          No reviews available.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {reviews.map((rev) => (
            <div
              key={rev._id}
              className={`bg-brand-card border rounded-2xl p-5 flex flex-col justify-between transition-all ${
                rev.approved ? 'border-brand-border' : 'border-red-800/60 bg-red-950/20'
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-1">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-3.5 h-3.5 ${
                          i < rev.rating ? 'text-brand-yellow fill-brand-yellow' : 'text-slate-600'
                        }`}
                      />
                    ))}
                  </div>
                  <button
                    onClick={() => handleToggleApprove(rev)}
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1 ${
                      rev.approved
                        ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                        : 'bg-red-500/20 text-red-400 border border-red-500/40'
                    }`}
                  >
                    {rev.approved ? <CheckCircle2 className="w-3 h-3" /> : <XCircle className="w-3 h-3" />}
                    <span>{rev.approved ? 'Approved' : 'Hidden'}</span>
                  </button>
                </div>

                <p className="text-xs text-slate-300 italic mb-4">
                  "{rev.comment}"
                </p>
              </div>

              <div className="pt-3 border-t border-brand-border/60 flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-bold text-white">{rev.clientName}</h4>
                  <p className="text-[11px] text-slate-400">{rev.roleOrCompany}</p>
                </div>

                <button
                  onClick={() => handleDelete(rev._id)}
                  className="p-1.5 rounded-lg bg-red-950/40 text-red-400 hover:bg-red-900/60"
                  title="Delete"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="relative w-full max-w-md bg-brand-card border border-brand-border rounded-3xl p-6 sm:p-8 shadow-2xl">
            <button
              onClick={() => setModalOpen(false)}
              className="absolute top-5 right-5 w-8 h-8 rounded-full bg-slate-800 text-slate-400 hover:text-white flex items-center justify-center"
            >
              <X className="w-4 h-4" />
            </button>

            <h3 className="text-xl font-black text-white mb-4">Add Client Testimonial</h3>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">Client Name *</label>
                <input
                  type="text"
                  required
                  value={formData.clientName}
                  onChange={(e) => setFormData({ ...formData, clientName: e.target.value })}
                  placeholder="e.g. Dr. Amit Patel"
                  className="w-full bg-slate-900 border border-brand-border rounded-xl px-4 py-2 text-xs text-white focus:outline-none focus:border-brand-yellow"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">Role / Business</label>
                  <input
                    type="text"
                    value={formData.roleOrCompany}
                    onChange={(e) => setFormData({ ...formData, roleOrCompany: e.target.value })}
                    placeholder="e.g. Dental Clinic / YouTuber"
                    className="w-full bg-slate-900 border border-brand-border rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-brand-yellow"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">Rating</label>
                  <select
                    value={formData.rating}
                    onChange={(e) => setFormData({ ...formData, rating: Number(e.target.value) })}
                    className="w-full bg-slate-900 border border-brand-border rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-brand-yellow"
                  >
                    <option value={5}>⭐⭐⭐⭐⭐ (5 Stars)</option>
                    <option value={4}>⭐⭐⭐⭐ (4 Stars)</option>
                    <option value={3}>⭐⭐⭐ (3 Stars)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">Feedback Comment *</label>
                <textarea
                  rows={3}
                  required
                  value={formData.comment}
                  onChange={(e) => setFormData({ ...formData, comment: e.target.value })}
                  placeholder="Client words..."
                  className="w-full bg-slate-900 border border-brand-border rounded-xl px-4 py-2 text-xs text-white focus:outline-none focus:border-brand-yellow"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-brand-yellow hover:bg-brand-yellowHover text-black font-black text-sm rounded-xl"
              >
                Publish Testimonial
              </button>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};

export default AdminReviews;

