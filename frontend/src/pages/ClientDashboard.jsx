import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Package, 
  Download, 
  Clock, 
  CheckCircle2, 
  AlertCircle, 
  Plus, 
  PhoneCall, 
  ExternalLink,
  Film,
  User,
  RotateCcw,
  FileText,
  Printer,
  X,
  Send,
  Sparkles
} from 'lucide-react';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';

const ClientDashboard = () => {
  const { user } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  // Revision Modal state
  const [revisionOrder, setRevisionOrder] = useState(null);
  const [revisionNotes, setRevisionNotes] = useState('');
  const [revisionSubmitting, setRevisionSubmitting] = useState(false);
  const [revisionSuccess, setRevisionSuccess] = useState('');

  // Invoice Modal state
  const [invoiceOrder, setInvoiceOrder] = useState(null);

  const fetchMyOrders = async () => {
    try {
      const res = await api.get('/orders/my-orders');
      if (res.data?.data) {
        setOrders(res.data.data);
      }
    } catch (err) {
      console.log('Unable to fetch orders or offline');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMyOrders();
  }, []);

  const handleOpenRevision = (order) => {
    setRevisionOrder(order);
    setRevisionNotes(order.revisionNotes || '');
    setRevisionSuccess('');
  };

  const handleSubmitRevision = async (e) => {
    e.preventDefault();
    if (!revisionNotes.trim()) return;
    setRevisionSubmitting(true);
    try {
      await api.post(`/orders/${revisionOrder._id}/revision`, { revisionNotes });
      setRevisionSuccess('Revision request submitted! Dipu Sah has been alerted.');
      fetchMyOrders();
      setTimeout(() => {
        setRevisionOrder(null);
        setRevisionSuccess('');
      }, 2000);
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to submit revision');
    } finally {
      setRevisionSubmitting(false);
    }
  };

  return (
    <div className="py-12 bg-brand-dark min-h-[85vh]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Welcome Banner */}
        <div className="bg-brand-card border border-brand-border rounded-3xl p-6 sm:p-8 mb-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 shadow-xl">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-yellow-500/10 border border-brand-yellow/30 flex items-center justify-center text-brand-yellow font-black text-xl">
              <User className="w-7 h-7" />
            </div>
            <div>
              <span className="text-xs font-bold text-slate-400">Client Portal</span>
              <h1 className="text-2xl sm:text-3xl font-black text-white">
                {user?.name || 'Valued Creator'}
              </h1>
              <p className="text-xs text-slate-400 mt-0.5">{user?.email}</p>
            </div>
          </div>

          <div className="flex flex-wrap gap-3">
            <Link
              to="/order"
              className="bg-brand-yellow hover:bg-brand-yellowHover text-black font-black text-xs sm:text-sm px-5 py-3 rounded-xl flex items-center gap-2 shadow-lg shadow-yellow-500/20 transition-all"
            >
              <Plus className="w-4 h-4" />
              <span>Book Another Video (₹100)</span>
            </Link>

            <a
              href="https://wa.me/917481968724?text=Hi%20Dipu%2C%20I%20have%20an%20inquiry%20regarding%20my%20orders"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-400 border border-emerald-500/30 font-bold text-xs sm:text-sm px-4 py-3 rounded-xl flex items-center gap-2"
            >
              <PhoneCall className="w-4 h-4" />
              <span>WhatsApp Dipu</span>
            </a>
          </div>
        </div>

        {/* Orders List Section */}
        <div className="space-y-4">
          <h2 className="text-xl font-black text-white flex items-center gap-2">
            <Package className="w-5 h-5 text-brand-yellow" />
            <span>My Video Projects & Orders ({orders.length})</span>
          </h2>

          {loading ? (
            <div className="p-12 text-center text-slate-500">Loading your orders...</div>
          ) : orders.length === 0 ? (
            <div className="bg-brand-card border border-brand-border rounded-3xl p-12 text-center space-y-4">
              <Film className="w-12 h-12 text-slate-600 mx-auto" />
              <h3 className="text-lg font-bold text-white">No Orders Placed Yet</h3>
              <p className="text-xs text-slate-400 max-w-md mx-auto">
                Ready to create high-retention reels or AI videos? Book your first professional video starting at only ₹100!
              </p>
              <Link
                to="/order"
                className="inline-flex items-center gap-2 bg-brand-yellow text-black font-black px-6 py-3 rounded-xl text-xs"
              >
                <span>Order Video Now →</span>
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-5">
              {orders.map((ord) => (
                <div
                  key={ord._id}
                  className="bg-brand-card border border-brand-border rounded-3xl p-6 flex flex-col space-y-4 hover:border-brand-yellow/40 transition-all shadow-md"
                >
                  <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 pb-3 border-b border-brand-border/60">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-mono font-black text-brand-yellow">
                          #{ord.orderId}
                        </span>
                        <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-black uppercase tracking-wider ${
                          ord.status === 'Completed'
                            ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                            : ord.status === 'In Production'
                            ? 'bg-blue-500/20 text-blue-400 border border-blue-500/40'
                            : ord.status === 'Revision Requested'
                            ? 'bg-purple-500/20 text-purple-400 border border-purple-500/40'
                            : 'bg-amber-500/20 text-amber-400 border border-amber-500/40'
                        }`}>
                          {ord.status}
                        </span>
                      </div>
                      <h3 className="text-lg font-black text-white">{ord.serviceTitle}</h3>
                    </div>

                    <div className="flex items-center gap-4">
                      <span className="text-xl font-black text-emerald-400">₹{ord.amount}</span>
                      <button
                        onClick={() => setInvoiceOrder(ord)}
                        className="px-3 py-1.5 bg-slate-900 hover:bg-slate-800 border border-brand-border text-brand-yellow text-xs font-bold rounded-xl flex items-center gap-1.5"
                      >
                        <FileText className="w-3.5 h-3.5" />
                        <span>Invoice</span>
                      </button>
                    </div>
                  </div>

                  {/* Details Grid */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs text-slate-400">
                    <div>
                      <span className="text-slate-500 block font-semibold">Aspect Ratio:</span>
                      <span className="text-white font-bold">{ord.aspectRatio}</span>
                    </div>
                    <div>
                      <span className="text-slate-500 block font-semibold">Delivery Speed:</span>
                      <span className="text-white font-bold">{ord.deliverySpeed || 'Standard 24h'}</span>
                    </div>
                    <div>
                      <span className="text-slate-500 block font-semibold">Payment UTR:</span>
                      <span className="text-slate-200 font-mono font-bold">{ord.utrNumber}</span>
                    </div>
                    <div>
                      <span className="text-slate-500 block font-semibold">Date Ordered:</span>
                      <span className="text-slate-200">{new Date(ord.createdAt).toLocaleDateString('en-IN')}</span>
                    </div>
                  </div>

                  {/* Actions & Deliverables */}
                  <div className="pt-2 flex flex-wrap items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                      {ord.status === 'Completed' && ord.deliveryLink ? (
                        <a
                          href={ord.deliveryLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-2 bg-emerald-500 hover:bg-emerald-400 text-black font-black text-xs px-5 py-2.5 rounded-xl shadow-lg transition-all"
                        >
                          <Download className="w-4 h-4" />
                          <span>Download Final Video Files</span>
                        </a>
                      ) : (
                        <span className="text-xs text-amber-400 font-bold flex items-center gap-1.5">
                          <Clock className="w-4 h-4" />
                          Estimated Delivery: Under 24 Hours
                        </span>
                      )}

                      {/* Request Revision Button for completed orders */}
                      {ord.status === 'Completed' && (
                        <button
                          onClick={() => handleOpenRevision(ord)}
                          className="px-4 py-2.5 bg-slate-900 hover:bg-slate-800 border border-brand-border text-slate-300 hover:text-white rounded-xl text-xs font-bold flex items-center gap-1.5"
                        >
                          <RotateCcw className="w-3.5 h-3.5" />
                          <span>Request Revision</span>
                        </button>
                      )}
                    </div>

                    <Link
                      to={`/track-order?id=${ord.orderId}`}
                      className="text-xs text-brand-yellow hover:underline flex items-center gap-1 font-bold"
                    >
                      <span>Track Order</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>

      {/* Revision Request Modal */}
      {revisionOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="relative w-full max-w-md bg-brand-card border border-brand-border rounded-3xl p-6 sm:p-8 shadow-2xl">
            <button
              onClick={() => setRevisionOrder(null)}
              className="absolute top-5 right-5 w-8 h-8 rounded-full bg-slate-800 text-slate-400 hover:text-white flex items-center justify-center"
            >
              <X className="w-4 h-4" />
            </button>

            <h3 className="text-xl font-black text-white mb-1">Request Video Revision</h3>
            <p className="text-xs text-slate-400 mb-4">
              Order #{revisionOrder.orderId}: Describe changes required (captions, cuts, audio, transitions).
            </p>

            {revisionSuccess ? (
              <div className="p-4 bg-emerald-950/60 border border-emerald-500 text-emerald-300 rounded-xl text-center text-xs font-bold">
                {revisionSuccess}
              </div>
            ) : (
              <form onSubmit={handleSubmitRevision} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">Revision Instructions *</label>
                  <textarea
                    rows={4}
                    required
                    value={revisionNotes}
                    onChange={(e) => setRevisionNotes(e.target.value)}
                    placeholder="e.g. Change text font at 0:15, lower background music volume by 20%..."
                    className="w-full bg-slate-900 border border-brand-border rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-brand-yellow"
                  />
                </div>

                <button
                  type="submit"
                  disabled={revisionSubmitting}
                  className="w-full py-3 bg-brand-yellow hover:bg-brand-yellowHover text-black font-black text-sm rounded-xl flex items-center justify-center gap-2"
                >
                  <Send className="w-4 h-4" />
                  <span>{revisionSubmitting ? 'Submitting...' : 'Submit Revision'}</span>
                </button>
              </form>
            )}
          </div>
        </div>
      )}

      {/* Invoice Modal */}
      {invoiceOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-sm p-4">
          <div className="relative w-full max-w-lg bg-slate-900 border border-brand-border rounded-3xl p-6 sm:p-8 shadow-2xl">
            <button
              onClick={() => setInvoiceOrder(null)}
              className="absolute top-5 right-5 w-8 h-8 rounded-full bg-slate-800 text-slate-400 hover:text-white flex items-center justify-center"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="border-b border-slate-800 pb-4 mb-4 flex justify-between items-start">
              <div>
                <h3 className="text-xl font-black text-white">DipuEditX</h3>
                <p className="text-xs text-slate-400">Official Invoice Receipt</p>
              </div>
              <div className="text-right">
                <span className="text-xs font-mono font-bold text-slate-400">{invoiceOrder.invoiceNumber || `INV-${invoiceOrder.orderId}`}</span>
                <p className="text-[11px] text-slate-500 mt-0.5">{new Date(invoiceOrder.createdAt).toLocaleDateString('en-IN')}</p>
              </div>
            </div>

            <div className="text-xs text-slate-300 space-y-1 mb-4">
              <p><strong className="text-slate-400">Billed To:</strong> {invoiceOrder.clientName}</p>
              <p><strong className="text-slate-400">Email:</strong> {invoiceOrder.clientEmail}</p>
              <p><strong className="text-slate-400">Phone:</strong> {invoiceOrder.clientPhone}</p>
              <p><strong className="text-slate-400">UTR / Ref:</strong> {invoiceOrder.utrNumber}</p>
            </div>

            <div className="bg-slate-950 rounded-xl p-3 mb-4 text-xs space-y-1">
              <div className="flex justify-between font-bold text-white">
                <span>{invoiceOrder.serviceTitle} ({invoiceOrder.aspectRatio})</span>
                <span>₹{invoiceOrder.amount}</span>
              </div>
              <div className="flex justify-between text-slate-400 text-[11px]">
                <span>Speed: {invoiceOrder.deliverySpeed || 'Standard 24h'}</span>
                <span>Status: {invoiceOrder.status}</span>
              </div>
            </div>

            <div className="pt-2 flex gap-2">
              <button
                onClick={() => window.print()}
                className="flex-1 py-2.5 bg-brand-yellow text-black font-black text-xs rounded-xl flex items-center justify-center gap-1.5"
              >
                <Printer className="w-4 h-4" />
                <span>Print Invoice</span>
              </button>
              <button
                onClick={() => setInvoiceOrder(null)}
                className="px-4 py-2.5 bg-slate-800 text-slate-300 text-xs font-bold rounded-xl"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default ClientDashboard;
