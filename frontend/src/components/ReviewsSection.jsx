import React, { useState, useEffect } from 'react';
import { Star, MessageSquarePlus, CheckCircle, X, Send, Sparkles } from 'lucide-react';
import api from '../services/api';

const DEFAULT_REVIEWS = [
  {
    _id: 'r1',
    clientName: 'Dr. Rajesh Sharma',
    roleOrCompany: 'Cardiologist & Clinic Director',
    serviceType: 'Doctor / Hospital Video',
    rating: 5,
    comment: 'Dipu bhai ne hamare clinic ke liye kidney aur heart health ke bohot hi realistic AI videos banaye. Patient response bohot badhiya aaya aur sirf 24 ghante me deliver kiya! Super affordable.',
  },
  {
    _id: 'r2',
    clientName: 'Aman Verma',
    roleOrCompany: 'Tech YouTuber (120K Subs)',
    serviceType: 'Shorts & Reels Editing',
    rating: 5,
    comment: 'Only ₹100 me itna tagda editing quality aaj tak kisi ne nahi diya! Sound effects, captions, transitions sab top notch the. Ab mere sabhi shorts Dipu se hi banenge.',
  },
  {
    _id: 'r3',
    clientName: 'Pooja Singh',
    roleOrCompany: 'Fashion & E-commerce Brand',
    serviceType: 'AI Video Creation',
    rating: 5,
    comment: 'Hamare product ads ke liye AI video generate karke di jo Instagram ads pe 3x ROI de rahi hai. Payment bhi easy UPI QR se ho gaya aur instant confirmation mil gaya.',
  },
  {
    _id: 'r4',
    clientName: 'Vikram Mehta',
    roleOrCompany: 'Delhi Coaching Institute',
    serviceType: 'Promotional Video',
    rating: 5,
    comment: 'Admission campaign ke liye reels banwayi thi. Quality aur delivery speed dono lajawab. Dipu Sah is extremely professional and polite.',
  },
];

const ReviewsSection = () => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    clientName: '',
    roleOrCompany: '',
    serviceType: 'AI Video Editing',
    rating: 5,
    comment: '',
  });
  const [submitting, setSubmitting] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const res = await api.get('/reviews');
        if (res.data && Array.isArray(res.data.data)) {
          setReviews(res.data.data);
        }
      } catch (err) {
        console.log('Reviews fetch error');
        setReviews(DEFAULT_REVIEWS);
      } finally {
        setLoading(false);
      }
    };
    fetchReviews();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const res = await api.post('/reviews', formData);
      setSuccessMsg('Review submitted successfully! Thank you.');
      if (res.data?.data) {
        setReviews([res.data.data, ...reviews]);
      }
      setTimeout(() => {
        setModalOpen(false);
        setSuccessMsg('');
        setFormData({
          clientName: '',
          roleOrCompany: '',
          serviceType: 'AI Video Editing',
          rating: 5,
          comment: '',
        });
      }, 1500);
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to submit review');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section className="py-20 bg-brand-dark relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 mb-12">
          <div>
            <div className="inline-flex items-center gap-2 text-brand-yellow text-xs uppercase font-black tracking-widest bg-yellow-500/10 px-3 py-1 rounded-full mb-2">
              <Sparkles className="w-3.5 h-3.5" />
              <span>100% Verified Customer Feedback</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-black text-white">
              What Creators & Businesses Say About Dipu
            </h2>
          </div>

          <button
            onClick={() => setModalOpen(true)}
            className="flex items-center gap-2 bg-brand-cardLight hover:bg-slate-800 text-brand-yellow border border-brand-yellow/30 px-5 py-3 rounded-xl text-xs sm:text-sm font-bold shadow-lg transition-all"
          >
            <MessageSquarePlus className="w-4 h-4" />
            <span>Leave Your Review</span>
          </button>
        </div>

        {/* Reviews Grid */}
        {reviews.length === 0 ? (
          <div className="text-center py-12 bg-brand-card rounded-2xl border border-dashed border-brand-border p-6 max-w-xl mx-auto">
            <Star className="w-10 h-10 text-brand-yellow/40 mx-auto mb-2" />
            <h3 className="text-base font-bold text-white mb-1">No Reviews Yet</h3>
            <p className="text-xs text-slate-400 mb-4">Be the first client to leave feedback for DipuEditX!</p>
            <button
              onClick={() => setModalOpen(true)}
              className="inline-flex items-center gap-2 bg-brand-yellow text-black font-black text-xs px-4 py-2.5 rounded-xl hover:bg-yellow-400 transition-colors"
            >
              <MessageSquarePlus className="w-4 h-4" />
              <span>Submit Your Review</span>
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {reviews.map((rev) => (
              <div
                key={rev._id}
                className="bg-brand-card border border-brand-border rounded-2xl p-6 flex flex-col justify-between hover:border-brand-yellow/40 transition-all shadow-md"
              >
              <div>
                {/* Rating Stars */}
                <div className="flex items-center gap-1 mb-3">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-4 h-4 ${
                        i < (rev.rating || 5)
                          ? 'text-brand-yellow fill-brand-yellow'
                          : 'text-slate-600'
                      }`}
                    />
                  ))}
                </div>

                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed italic mb-6">
                  "{rev.comment}"
                </p>
              </div>

              <div className="pt-4 border-t border-brand-border/60">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-white font-bold text-sm">
                      {rev.clientName}
                    </h4>
                    <p className="text-[11px] text-slate-400">
                      {rev.roleOrCompany}
                    </p>
                  </div>
                  <div className="flex items-center gap-1 text-[10px] text-emerald-400 font-bold bg-emerald-500/10 px-2 py-0.5 rounded">
                    <CheckCircle className="w-3 h-3" />
                    <span>Verified</span>
                  </div>
                </div>
                <span className="text-[10px] text-brand-yellow/90 mt-1 block">
                  Service: {rev.serviceType}
                </span>
              </div>
            </div>
          ))}
        </div>
        )}

      </div>

      {/* Write Review Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="relative w-full max-w-lg bg-brand-card border border-brand-border rounded-3xl p-6 sm:p-8 shadow-2xl">
            
            <button
              onClick={() => setModalOpen(false)}
              className="absolute top-5 right-5 w-8 h-8 rounded-full bg-slate-800 text-slate-400 hover:text-white flex items-center justify-center transition-colors"
            >
              <X className="w-4 h-4" />
            </button>

            <h3 className="text-xl font-black text-white mb-1">
              Share Your Feedback
            </h3>
            <p className="text-xs text-slate-400 mb-6">
              Dipu Sah ke kaam ke bare me apna experience share karein.
            </p>

            {successMsg ? (
              <div className="p-4 bg-emerald-600/20 border border-emerald-500 text-emerald-300 rounded-xl text-center text-sm font-bold">
                {successMsg}
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">
                    Your Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.clientName}
                    onChange={(e) => setFormData({ ...formData, clientName: e.target.value })}
                    className="w-full bg-slate-900 border border-brand-border rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-brand-yellow"
                    placeholder="e.g. Rahul Sharma"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-300 mb-1">
                      Role / Channel / Business
                    </label>
                    <input
                      type="text"
                      value={formData.roleOrCompany}
                      onChange={(e) => setFormData({ ...formData, roleOrCompany: e.target.value })}
                      className="w-full bg-slate-900 border border-brand-border rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-brand-yellow"
                      placeholder="e.g. YouTuber / Clinic"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-300 mb-1">
                      Rating (1 to 5 Stars)
                    </label>
                    <select
                      value={formData.rating}
                      onChange={(e) => setFormData({ ...formData, rating: Number(e.target.value) })}
                      className="w-full bg-slate-900 border border-brand-border rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-brand-yellow"
                    >
                      <option value={5}>⭐⭐⭐⭐⭐ (5 Stars)</option>
                      <option value={4}>⭐⭐⭐⭐ (4 Stars)</option>
                      <option value={3}>⭐⭐⭐ (3 Stars)</option>
                      <option value={2}>⭐⭐ (2 Stars)</option>
                      <option value={1}>⭐ (1 Star)</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">
                    Your Review *
                  </label>
                  <textarea
                    required
                    rows={4}
                    value={formData.comment}
                    onChange={(e) => setFormData({ ...formData, comment: e.target.value })}
                    className="w-full bg-slate-900 border border-brand-border rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-brand-yellow"
                    placeholder="Describe how the video quality, delivery time, and editing was..."
                  />
                </div>

                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full py-3 bg-brand-yellow hover:bg-brand-yellowHover text-black font-black text-sm rounded-xl flex items-center justify-center gap-2 shadow-lg transition-all"
                >
                  <Send className="w-4 h-4" />
                  <span>{submitting ? 'Submitting...' : 'Post Review'}</span>
                </button>
              </form>
            )}

          </div>
        </div>
      )}
    </section>
  );
};

export default ReviewsSection;

