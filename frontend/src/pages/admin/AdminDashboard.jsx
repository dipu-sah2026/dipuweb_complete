import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  ShoppingCart, 
  Clock, 
  CheckCircle2, 
  CircleDollarSign, 
  Film, 
  ArrowRight, 
  PhoneCall, 
  AlertCircle 
} from 'lucide-react';
import api from '../../services/api';

const AdminDashboard = () => {
  const [metrics, setMetrics] = useState({
    totalOrders: 0,
    pendingOrders: 0,
    inProductionOrders: 0,
    completedOrders: 0,
    totalRevenue: 0,
  });
  const [recentOrders, setRecentOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [mRes, oRes] = await Promise.all([
          api.get('/orders/metrics'),
          api.get('/orders?limit=5'),
        ]);

        if (mRes.data?.data) setMetrics(mRes.data.data);
        if (oRes.data?.data) setRecentOrders(oRes.data.data);
      } catch (err) {
        console.log('Using initial dashboard state');
      } finally {
        setLoading(false);
      }
    };
    fetchDashboardData();
  }, []);

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-white">
            Agency Performance & Leads
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Real-time statistics for dipueditx.in • Managed by Dipu Sah
          </p>
        </div>

        <Link
          to="/admin/orders"
          className="inline-flex items-center gap-2 bg-brand-yellow hover:bg-brand-yellowHover text-black font-black text-xs sm:text-sm px-5 py-2.5 rounded-xl shadow-lg shadow-yellow-500/20 transition-all"
        >
          <ShoppingCart className="w-4 h-4" />
          <span>View All Client Leads</span>
        </Link>
      </div>

      {/* Metrics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        
        <div className="bg-brand-card border border-brand-border rounded-2xl p-5 space-y-2">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-bold uppercase tracking-wider">Total Leads</span>
            <ShoppingCart className="w-4 h-4 text-brand-yellow" />
          </div>
          <p className="text-3xl font-black text-white">{metrics.totalOrders}</p>
          <span className="text-[11px] text-slate-500">Orders submitted via UPI</span>
        </div>

        <div className="bg-brand-card border border-amber-500/30 rounded-2xl p-5 space-y-2">
          <div className="flex items-center justify-between text-amber-400">
            <span className="text-xs font-bold uppercase tracking-wider">Pending UTR</span>
            <Clock className="w-4 h-4 text-amber-400" />
          </div>
          <p className="text-3xl font-black text-amber-400">{metrics.pendingOrders}</p>
          <span className="text-[11px] text-amber-500/80">Needs payment check</span>
        </div>

        <div className="bg-brand-card border border-blue-500/30 rounded-2xl p-5 space-y-2">
          <div className="flex items-center justify-between text-blue-400">
            <span className="text-xs font-bold uppercase tracking-wider">In Production</span>
            <Film className="w-4 h-4 text-blue-400" />
          </div>
          <p className="text-3xl font-black text-blue-400">{metrics.inProductionOrders}</p>
          <span className="text-[11px] text-blue-400/80">Currently being edited</span>
        </div>

        <div className="bg-brand-card border border-emerald-500/30 rounded-2xl p-5 space-y-2">
          <div className="flex items-center justify-between text-emerald-400">
            <span className="text-xs font-bold uppercase tracking-wider">Completed</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          </div>
          <p className="text-3xl font-black text-emerald-400">{metrics.completedOrders}</p>
          <span className="text-[11px] text-emerald-500/80">Delivered to clients</span>
        </div>

        <div className="bg-brand-card border border-yellow-500/40 rounded-2xl p-5 space-y-2 glow-yellow">
          <div className="flex items-center justify-between text-brand-yellow">
            <span className="text-xs font-bold uppercase tracking-wider">Verified Revenue</span>
            <CircleDollarSign className="w-4 h-4 text-brand-yellow" />
          </div>
          <p className="text-3xl font-black text-brand-yellow">₹{metrics.totalRevenue}</p>
          <span className="text-[11px] text-yellow-500/80">Processed via UPI</span>
        </div>

      </div>

      {/* Quick Launchpad Buttons */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Link
          to="/admin/orders"
          className="bg-brand-card hover:bg-brand-cardLight border border-brand-border rounded-2xl p-4 flex items-center justify-between group transition-all"
        >
          <div>
            <h3 className="text-sm font-bold text-white group-hover:text-brand-yellow">Open CRM Leads</h3>
            <p className="text-xs text-slate-400">Verify UTRs and chat with clients</p>
          </div>
          <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-brand-yellow group-hover:translate-x-1 transition-all" />
        </Link>

        <Link
          to="/admin/services"
          className="bg-brand-card hover:bg-brand-cardLight border border-brand-border rounded-2xl p-4 flex items-center justify-between group transition-all"
        >
          <div>
            <h3 className="text-sm font-bold text-white group-hover:text-brand-yellow">Manage Services & Pricing</h3>
            <p className="text-xs text-slate-400">Update ₹100 rates or add new packages</p>
          </div>
          <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-brand-yellow group-hover:translate-x-1 transition-all" />
        </Link>

        <Link
          to="/admin/settings"
          className="bg-brand-card hover:bg-brand-cardLight border border-brand-border rounded-2xl p-4 flex items-center justify-between group transition-all"
        >
          <div>
            <h3 className="text-sm font-bold text-white group-hover:text-brand-yellow">Payment & Agency Settings</h3>
            <p className="text-xs text-slate-400">Update UPI ID, WhatsApp, & email alerts</p>
          </div>
          <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-brand-yellow group-hover:translate-x-1 transition-all" />
        </Link>
      </div>

      {/* Recent Incoming Leads Table */}
      <div className="bg-brand-card border border-brand-border rounded-3xl p-6 shadow-xl">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-lg font-black text-white">Recent Incoming Orders & Leads</h2>
            <p className="text-xs text-slate-400">Click to contact client or verify payment</p>
          </div>
          <Link to="/admin/orders" className="text-xs font-bold text-brand-yellow hover:underline">
            View All →
          </Link>
        </div>

        {recentOrders.length === 0 ? (
          <div className="py-10 text-center text-slate-500 text-sm">
            No orders received yet. Once clients submit orders via the website, they will appear here.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs sm:text-sm">
              <thead className="bg-slate-900/80 text-slate-400 uppercase text-[11px] font-bold">
                <tr>
                  <th className="p-3">Order ID</th>
                  <th className="p-3">Client</th>
                  <th className="p-3">Service</th>
                  <th className="p-3">Amount</th>
                  <th className="p-3">UTR Number</th>
                  <th className="p-3">Status</th>
                  <th className="p-3">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-brand-border/60">
                {recentOrders.map((ord) => (
                  <tr key={ord._id} className="hover:bg-slate-900/50">
                    <td className="p-3 font-mono font-bold text-brand-yellow">
                      {ord.orderId}
                    </td>
                    <td className="p-3">
                      <p className="font-bold text-white">{ord.clientName}</p>
                      <p className="text-xs text-slate-400">{ord.clientPhone}</p>
                    </td>
                    <td className="p-3 text-slate-300 font-medium">
                      {ord.serviceTitle}
                    </td>
                    <td className="p-3 font-bold text-emerald-400">
                      ₹{ord.amount}
                    </td>
                    <td className="p-3 font-mono text-slate-300 font-semibold">
                      {ord.utrNumber}
                    </td>
                    <td className="p-3">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                        ord.status === 'Completed'
                          ? 'bg-emerald-500/20 text-emerald-400'
                          : ord.status === 'In Production'
                          ? 'bg-blue-500/20 text-blue-400'
                          : 'bg-amber-500/20 text-amber-400'
                      }`}>
                        {ord.status}
                      </span>
                    </td>
                    <td className="p-3">
                      <a
                        href={`https://wa.me/91${ord.clientPhone.replace(/\D/g, '')}?text=Hello%20${encodeURIComponent(ord.clientName)}%2C%20I%20am%20Dipu%20Sah%20from%20DipuEditX.%20I%20received%20your%20Order%20${ord.orderId}!`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 bg-emerald-600/20 text-emerald-400 hover:bg-emerald-600/30 px-2.5 py-1 rounded-lg text-xs font-bold"
                      >
                        <PhoneCall className="w-3 h-3" />
                        <span>WhatsApp</span>
                      </a>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

    </div>
  );
};

export default AdminDashboard;

