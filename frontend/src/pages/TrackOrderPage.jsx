import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { Search, Package, Clock, CheckCircle2, AlertCircle, Download, PhoneCall, ArrowRight } from 'lucide-react';
import api from '../services/api';

const statusSteps = [
  'Pending Verification',
  'Payment Verified',
  'In Production',
  'Completed',
];

const TrackOrderPage = () => {
  const [searchParams] = useSearchParams();
  const [identifier, setIdentifier] = useState(searchParams.get('id') || '');
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const fetchOrder = async (idToSearch) => {
    if (!idToSearch) return;
    setLoading(true);
    setError('');
    try {
      const res = await api.get(`/orders/track/${encodeURIComponent(idToSearch.trim())}`);
      setOrder(res.data.data);
    } catch (err) {
      setOrder(null);
      setError('Order not found with provided ID or UTR. Please check spelling or contact Dipu Sah.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const queryId = searchParams.get('id');
    if (queryId) {
      setIdentifier(queryId);
      fetchOrder(queryId);
    }
  }, [searchParams]);

  const handleSearch = (e) => {
    e.preventDefault();
    fetchOrder(identifier);
  };

  const getStepIndex = (status) => {
    switch (status) {
      case 'Pending Verification':
        return 0;
      case 'Payment Verified':
        return 1;
      case 'In Production':
        return 2;
      case 'Completed':
        return 3;
      default:
        return 0;
    }
  };

  return (
    <div className="py-16 bg-brand-dark min-h-[80vh]">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center mb-10">
          <span className="text-brand-yellow font-black text-xs uppercase tracking-widest bg-yellow-500/10 px-3.5 py-1 rounded-full border border-yellow-500/20">
            Real-Time Tracking
          </span>
          <h1 className="text-3xl sm:text-5xl font-black text-white mt-3">
            Track Your <span className="text-brand-yellow">Video Order</span>
          </h1>
          <p className="text-slate-400 text-xs sm:text-sm mt-2">
            Enter your Order ID (e.g. DPX-10294) or 12-digit UPI UTR number
          </p>
        </div>

        {/* Search Input Card */}
        <form onSubmit={handleSearch} className="bg-brand-card border border-brand-border rounded-2xl p-3 sm:p-4 shadow-xl flex flex-col sm:flex-row gap-3 mb-10">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input
              type="text"
              required
              value={identifier}
              onChange={(e) => setIdentifier(e.target.value)}
              placeholder="Enter DPX-XXXXX or 12-digit UTR Number"
              className="w-full bg-slate-900 border border-brand-border rounded-xl pl-12 pr-4 py-3 text-sm text-white font-mono font-bold focus:outline-none focus:border-brand-yellow"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="bg-brand-yellow hover:bg-brand-yellowHover text-black font-black text-sm px-6 py-3 rounded-xl transition-all flex items-center justify-center gap-2"
          >
            <Search className="w-4 h-4" />
            <span>{loading ? 'Searching...' : 'Track Status'}</span>
          </button>
        </form>

        {/* Error Notice */}
        {error && (
          <div className="bg-red-950/40 border border-red-800 text-red-300 rounded-2xl p-4 text-center text-sm flex items-center justify-center gap-2 mb-8">
            <AlertCircle className="w-4 h-4" />
            <span>{error}</span>
          </div>
        )}

        {/* Order Details Display */}
        {order && (
          <div className="bg-brand-card border border-brand-border rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6 animate-in fade-in">
            
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-brand-border">
              <div>
                <span className="text-xs font-bold text-slate-400">Order Reference</span>
                <h3 className="text-2xl font-mono font-black text-brand-yellow">
                  {order.orderId}
                </h3>
                <p className="text-xs text-slate-400 mt-1">Client: {order.clientName}</p>
              </div>

              <div className="text-left sm:text-right">
                <span className="text-xs font-bold text-slate-400">Current Status</span>
                <div className="mt-1">
                  <span className={`inline-block px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider ${
                    order.status === 'Completed'
                      ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                      : order.status === 'In Production'
                      ? 'bg-blue-500/20 text-blue-400 border border-blue-500/40'
                      : 'bg-amber-500/20 text-amber-400 border border-amber-500/40'
                  }`}>
                    {order.status}
                  </span>
                </div>
              </div>
            </div>

            {/* Stepper Progress Bar */}
            <div>
              <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4">Production Timeline</h4>
              <div className="grid grid-cols-4 gap-2 text-center">
                {statusSteps.map((step, idx) => {
                  const currentIdx = getStepIndex(order.status);
                  const isDone = idx <= currentIdx;
                  return (
                    <div key={idx} className="space-y-2">
                      <div className={`h-2 rounded-full transition-all ${
                        isDone ? 'bg-brand-yellow shadow-md shadow-yellow-500/30' : 'bg-slate-800'
                      }`} />
                      <span className={`text-[10px] sm:text-xs font-bold block ${
                        isDone ? 'text-white' : 'text-slate-600'
                      }`}>
                        {step}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Service Specs */}
            <div className="bg-slate-900/80 rounded-2xl p-4 grid grid-cols-2 sm:grid-cols-3 gap-4 text-xs">
              <div>
                <span className="text-slate-500 block font-semibold">Service</span>
                <span className="text-white font-bold">{order.serviceTitle}</span>
              </div>
              <div>
                <span className="text-slate-500 block font-semibold">Aspect Ratio</span>
                <span className="text-white font-bold">{order.aspectRatio}</span>
              </div>
              <div>
                <span className="text-slate-500 block font-semibold">Amount</span>
                <span className="text-emerald-400 font-bold">₹{order.amount}</span>
              </div>
            </div>

            {/* Completed Delivery Link Download */}
            {order.status === 'Completed' && order.deliveryLink && (
              <div className="bg-emerald-950/40 border-2 border-emerald-500/60 rounded-2xl p-5 text-center space-y-3">
                <CheckCircle2 className="w-8 h-8 text-emerald-400 mx-auto" />
                <h4 className="text-lg font-black text-white">Your Video is Ready for Download!</h4>
                <a
                  href={order.deliveryLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 bg-emerald-500 hover:bg-emerald-400 text-black font-black text-sm px-6 py-3 rounded-xl shadow-lg transition-all"
                >
                  <Download className="w-4 h-4" />
                  <span>Download Final Video Files</span>
                </a>
              </div>
            )}

            {/* WhatsApp Assistance */}
            <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-4">
              <span className="text-xs text-slate-400">Need immediate help with your order?</span>
              <a
                href={`https://wa.me/917481968724?text=Hi%20Dipu%2C%20I%20am%20checking%20status%20for%20Order%20${order.orderId}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-xs font-bold text-emerald-400 hover:underline"
              >
                <PhoneCall className="w-3.5 h-3.5" />
                <span>Chat with Dipu on WhatsApp</span>
              </a>
            </div>

          </div>
        )}

      </div>
    </div>
  );
};

export default TrackOrderPage;

