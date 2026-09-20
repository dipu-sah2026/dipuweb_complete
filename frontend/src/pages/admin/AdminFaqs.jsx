import React, { useState, useEffect } from 'react';
import { HelpCircle, Plus, Edit2, Trash2, Check, X, ArrowUpDown } from 'lucide-react';
import api from '../../services/api';

const AdminFaqs = () => {
  const [faqs, setFaqs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingFaq, setEditingFaq] = useState(null);

  const [formData, setFormData] = useState({
    question: '',
    answer: '',
    category: 'General',
    order: 0,
    active: true,
  });

  const fetchFaqs = async () => {
    setLoading(true);
    try {
      const res = await api.get('/faqs/admin');
      if (res.data?.data) {
        setFaqs(res.data.data);
      }
    } catch (err) {
      console.log('Unable to fetch faqs');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFaqs();
  }, []);

  const handleOpenAdd = () => {
    setEditingFaq(null);
    setFormData({
      question: '',
      answer: '',
      category: 'General',
      order: faqs.length + 1,
      active: true,
    });
    setModalOpen(true);
  };

  const handleOpenEdit = (faq) => {
    setEditingFaq(faq);
    setFormData({
      question: faq.question,
      answer: faq.answer,
      category: faq.category || 'General',
      order: faq.order || 0,
      active: faq.active !== undefined ? faq.active : true,
    });
    setModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingFaq) {
        await api.put(`/faqs/${editingFaq._id}`, formData);
      } else {
        await api.post('/faqs', formData);
      }
      setModalOpen(false);
      fetchFaqs();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to save FAQ');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this FAQ?')) return;
    try {
      await api.delete(`/faqs/${id}`);
      setFaqs(faqs.filter((f) => f._id !== id));
    } catch (err) {
      alert('Failed to delete FAQ');
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-white flex items-center gap-2">
            <HelpCircle className="w-7 h-7 text-brand-yellow" />
            <span>Manage FAQs CMS</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Add, update, or remove questions shown on the homepage and helpdesk.
          </p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="bg-brand-yellow hover:bg-brand-yellowHover text-black font-black text-xs sm:text-sm px-5 py-2.5 rounded-xl flex items-center gap-2 shadow-lg shadow-yellow-500/20 transition-all"
        >
          <Plus className="w-4 h-4" />
          <span>Add New FAQ</span>
        </button>
      </div>

      {loading ? (
        <div className="p-12 text-center text-slate-500">Loading FAQs...</div>
      ) : faqs.length === 0 ? (
        <div className="bg-brand-card border border-brand-border rounded-3xl p-12 text-center text-slate-400">
          No FAQs created yet.
        </div>
      ) : (
        <div className="space-y-3">
          {faqs.map((faq) => (
            <div
              key={faq._id}
              className="bg-brand-card border border-brand-border rounded-2xl p-5 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 hover:border-brand-yellow/40 transition-all"
            >
              <div className="space-y-1 flex-1">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-bold uppercase bg-slate-900 px-2.5 py-0.5 rounded text-brand-yellow border border-slate-800">
                    {faq.category || 'General'}
                  </span>
                  <span className="text-xs text-slate-500 font-mono">Order #{faq.order}</span>
                  {!faq.active && (
                    <span className="text-[10px] bg-red-950/60 text-red-400 px-2 py-0.5 rounded">Hidden</span>
                  )}
                </div>
                <h3 className="text-base font-bold text-white">{faq.question}</h3>
                <p className="text-xs text-slate-400 leading-relaxed">{faq.answer}</p>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <button
                  onClick={() => handleOpenEdit(faq)}
                  className="p-2 rounded-xl bg-slate-800 text-slate-300 hover:text-white hover:bg-slate-700 transition-colors"
                  title="Edit FAQ"
                >
                  <Edit2 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleDelete(faq._id)}
                  className="p-2 rounded-xl bg-red-950/40 text-red-400 hover:bg-red-900/60 transition-colors"
                  title="Delete FAQ"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add / Edit Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="relative w-full max-w-lg bg-brand-card border border-brand-border rounded-3xl p-6 sm:p-8 shadow-2xl">
            
            <button
              onClick={() => setModalOpen(false)}
              className="absolute top-5 right-5 w-8 h-8 rounded-full bg-slate-800 text-slate-400 hover:text-white flex items-center justify-center"
            >
              <X className="w-4 h-4" />
            </button>

            <h3 className="text-xl font-black text-white mb-4">
              {editingFaq ? 'Edit FAQ' : 'Add New FAQ'}
            </h3>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">Question *</label>
                <input
                  type="text"
                  required
                  value={formData.question}
                  onChange={(e) => setFormData({ ...formData, question: e.target.value })}
                  placeholder="e.g. How do I pay via UPI QR?"
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
                    <option value="General">General</option>
                    <option value="Pricing">Pricing</option>
                    <option value="Payment">Payment</option>
                    <option value="Delivery">Delivery</option>
                    <option value="Revisions">Revisions</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">Display Order</label>
                  <input
                    type="number"
                    value={formData.order}
                    onChange={(e) => setFormData({ ...formData, order: Number(e.target.value) })}
                    className="w-full bg-slate-900 border border-brand-border rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-brand-yellow"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">Answer *</label>
                <textarea
                  rows={4}
                  required
                  value={formData.answer}
                  onChange={(e) => setFormData({ ...formData, answer: e.target.value })}
                  placeholder="Detailed answer for the client..."
                  className="w-full bg-slate-900 border border-brand-border rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-brand-yellow"
                />
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="activeFaq"
                  checked={formData.active}
                  onChange={(e) => setFormData({ ...formData, active: e.target.checked })}
                  className="w-4 h-4 rounded text-brand-yellow"
                />
                <label htmlFor="activeFaq" className="text-xs font-bold text-slate-300 cursor-pointer">
                  Publish & show on public website
                </label>
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-brand-yellow hover:bg-brand-yellowHover text-black font-black text-sm rounded-xl transition-all"
              >
                {editingFaq ? 'Update FAQ' : 'Create FAQ'}
              </button>
            </form>

          </div>
        </div>
      )}

    </div>
  );
};

export default AdminFaqs;
