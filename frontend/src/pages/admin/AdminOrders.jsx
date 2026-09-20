import React, { useState, useEffect } from 'react';
import { 
  ShoppingCart, 
  Search, 
  Filter, 
  PhoneCall, 
  Mail, 
  ExternalLink, 
  Trash2, 
  CheckCircle, 
  Clock, 
  Link as LinkIcon, 
  Save, 
  Download,
  FileText,
  Printer,
  X,
  MessageSquare,
  AlertCircle
} from 'lucide-react';
import api from '../../services/api';

const AdminOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [updatingId, setUpdatingId] = useState(null);
  const [deliveryLinks, setDeliveryLinks] = useState({});
  const [selectedInvoiceOrder, setSelectedInvoiceOrder] = useState(null);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      let url = `/orders?limit=100`;
      if (statusFilter !== 'All') url += `&status=${encodeURIComponent(statusFilter)}`;
      if (search) url += `&search=${encodeURIComponent(search)}`;

      const res = await api.get(url);
      if (res.data?.data) {
        setOrders(res.data.data);
        const initialLinks = {};
        res.data.data.forEach((o) => {
          initialLinks[o._id] = o.deliveryLink || '';
        });
        setDeliveryLinks(initialLinks);
      }
    } catch (err) {
      console.log('Unable to fetch orders');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [statusFilter]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchOrders();
  };

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      await api.patch(`/orders/${orderId}`, { status: newStatus });
      setOrders(orders.map((o) => (o._id === orderId ? { ...o, status: newStatus } : o)));
    } catch (err) {
      alert('Failed to update status');
    }
  };

  const handleSaveDeliveryLink = async (orderId) => {
    setUpdatingId(orderId);
    try {
      const link = deliveryLinks[orderId] || '';
      await api.patch(`/orders/${orderId}`, {
        deliveryLink: link,
        status: link ? 'Completed' : undefined,
      });
      alert('Delivery link saved successfully!');
      fetchOrders();
    } catch (err) {
      alert('Failed to save delivery link');
    } finally {
      setUpdatingId(null);
    }
  };

  const handleExportCsv = async () => {
    try {
      window.open(`${api.defaults.baseURL}/orders/export-csv`, '_blank');
    } catch (err) {
      alert('Failed to export CSV');
    }
  };

  const handleDeleteOrder = async (orderId) => {
    if (!window.confirm('Are you sure you want to remove this lead/order?')) return;
    try {
      await api.delete(`/orders/${orderId}`);
      setOrders(orders.filter((o) => o._id !== orderId));
    } catch (err) {
      alert('Failed to delete order');
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      
      {/* Header & CSV Export */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-white flex items-center gap-2">
            <ShoppingCart className="w-7 h-7 text-brand-yellow" />
            <span>Client Leads & Orders CRM</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Manage UTR payments, direct WhatsApp messaging, invoices & Google Drive delivery links.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleExportCsv}
            className="bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-400 border border-emerald-500/40 px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all"
          >
            <Download className="w-4 h-4" />
            <span>Export to Excel / CSV</span>
          </button>
          <button
            onClick={fetchOrders}
            className="bg-brand-card hover:bg-brand-cardLight text-slate-300 border border-brand-border px-4 py-2 rounded-xl text-xs font-bold transition-all"
          >
            Refresh
          </button>
        </div>
      </div>

      {/* Filters & Search Bar */}
      <div className="bg-brand-card border border-brand-border rounded-2xl p-4 flex flex-col md:flex-row items-center justify-between gap-4">
        
        <form onSubmit={handleSearchSubmit} className="relative w-full md:w-96">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by ID, Name, Phone, UTR..."
            className="w-full bg-slate-900 border border-brand-border rounded-xl pl-10 pr-4 py-2 text-xs sm:text-sm text-white focus:outline-none focus:border-brand-yellow"
          />
        </form>

        <div className="flex items-center gap-2 w-full md:w-auto overflow-x-auto">
          <Filter className="w-4 h-4 text-slate-400 shrink-0" />
          {['All', 'Pending Verification', 'Payment Verified', 'In Production', 'Revision Requested', 'Completed'].map((st) => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap transition-all ${
                statusFilter === st
                  ? 'bg-brand-yellow text-black'
                  : 'bg-slate-900 text-slate-400 hover:text-white border border-brand-border'
              }`}
            >
              {st}
            </button>
          ))}
        </div>

      </div>

      {/* Orders Cards List */}
      {loading ? (
        <div className="p-16 text-center text-slate-500">Loading orders...</div>
      ) : orders.length === 0 ? (
        <div className="bg-brand-card border border-brand-border rounded-3xl p-12 text-center text-slate-400">
          No orders found matching the filter.
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((ord) => {
            const cleanPhone = ord.clientPhone.replace(/\D/g, '');
            const whatsappVerifiedMsg = `Hello ${ord.clientName}! I am Dipu Sah from DipuEditX (dipueditx.in).\n\nYour payment of ₹${ord.amount} (UTR: ${ord.utrNumber}) for Order #${ord.orderId} is VERIFIED!\n\nI am starting your ${ord.serviceTitle} now. Estimated delivery: 24h!`;

            const whatsappDeliveredMsg = `Hello ${ord.clientName}! Your video for Order #${ord.orderId} (${ord.serviceTitle}) is READY!\n\nDownload Link: ${ord.deliveryLink || ''}\n\nPlease check and let me know if you need any revisions!`;

            return (
              <div
                key={ord._id}
                className="bg-brand-card border border-brand-border rounded-3xl p-6 shadow-xl space-y-4 hover:border-brand-yellow/30 transition-all"
              >
                {/* Top Row: ID, Client, Amount, Date */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-brand-border">
                  <div className="flex flex-wrap items-center gap-3">
                    <span className="font-mono font-black text-brand-yellow text-base">
                      #{ord.orderId}
                    </span>
                    <span className="text-sm font-bold text-white">
                      {ord.clientName}
                    </span>
                    <span className="text-xs text-slate-400">
                      ({ord.clientEmail})
                    </span>
                    {ord.invoiceNumber && (
                      <span className="text-[10px] font-mono text-slate-500 bg-slate-900 px-2 py-0.5 rounded">
                        {ord.invoiceNumber}
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-4">
                    <span className="text-lg font-black text-emerald-400">
                      ₹{ord.amount}
                    </span>
                    {ord.discountAmount > 0 && (
                      <span className="text-xs text-amber-400 font-semibold">
                        (-₹{ord.discountAmount} {ord.couponCode})
                      </span>
                    )}
                    <span className="text-xs text-slate-500">
                      {new Date(ord.createdAt).toLocaleString('en-IN')}
                    </span>
                  </div>
                </div>

                {/* Middle Row: Service Details, UTR, Instructions */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-xs">
                  <div className="bg-slate-900/80 p-3 rounded-xl space-y-1">
                    <span className="text-slate-500 uppercase tracking-wider font-bold">Service Ordered</span>
                    <p className="font-bold text-white">{ord.serviceTitle}</p>
                    <p className="text-slate-400">Ratio: {ord.aspectRatio} • {ord.deliverySpeed || 'Standard'}</p>
                    {ord.addons && ord.addons.length > 0 && (
                      <p className="text-[10px] text-brand-yellow">Add-ons: {ord.addons.join(', ')}</p>
                    )}
                  </div>

                  <div className="bg-slate-900/80 p-3 rounded-xl space-y-1 border border-brand-yellow/20">
                    <span className="text-brand-yellow uppercase tracking-wider font-bold">Payment UTR Ref</span>
                    <p className="font-mono font-bold text-white text-sm">{ord.utrNumber}</p>
                    {ord.paymentScreenshot ? (
                      <a
                        href={ord.paymentScreenshot}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[10px] text-cyan-400 underline block"
                      >
                        View Screenshot Proof
                      </a>
                    ) : (
                      <span className="text-[10px] text-emerald-400 block font-semibold">Verify in UPI app</span>
                    )}
                  </div>

                  <div className="bg-slate-900/80 p-3 rounded-xl space-y-1">
                    <span className="text-slate-500 uppercase tracking-wider font-bold">Raw Footage / Drive</span>
                    {ord.rawFilesLink ? (
                      <a
                        href={ord.rawFilesLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-cyan-400 hover:underline flex items-center gap-1 font-bold truncate block"
                      >
                        <LinkIcon className="w-3 h-3 shrink-0" />
                        <span className="truncate">{ord.rawFilesLink}</span>
                      </a>
                    ) : (
                      <span className="text-slate-500 italic">No raw link provided</span>
                    )}
                  </div>

                  <div className="bg-slate-900/80 p-3 rounded-xl space-y-1">
                    <span className="text-slate-500 uppercase tracking-wider font-bold">Client Inquiries</span>
                    <div className="flex gap-2 pt-1">
                      <button
                        onClick={() => setSelectedInvoiceOrder(ord)}
                        className="p-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-xs flex items-center gap-1"
                        title="Print Invoice"
                      >
                        <Printer className="w-3.5 h-3.5" />
                        <span>Invoice</span>
                      </button>
                    </div>
                  </div>
                </div>

                {/* Script Notes if provided */}
                {ord.scriptNotes && (
                  <div className="bg-slate-950 p-3 rounded-xl border border-brand-border text-xs">
                    <span className="text-slate-400 font-bold block mb-1">Client Script / Requirements:</span>
                    <p className="text-slate-200 whitespace-pre-wrap">{ord.scriptNotes}</p>
                  </div>
                )}

                {/* Revision Notes if requested */}
                {ord.revisionNotes && (
                  <div className="bg-amber-950/40 p-3 rounded-xl border border-amber-500/50 text-xs">
                    <span className="text-amber-400 font-bold flex items-center gap-1 mb-1">
                      <AlertCircle className="w-3.5 h-3.5" />
                      Client Requested Revision:
                    </span>
                    <p className="text-slate-200">{ord.revisionNotes}</p>
                  </div>
                )}

                {/* Bottom Row: Status Dropdown, Delivery Link Input, Action Buttons */}
                <div className="pt-2 flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4">
                  
                  {/* Status Dropdown */}
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-slate-400">Status:</span>
                    <select
                      value={ord.status}
                      onChange={(e) => handleStatusChange(ord._id, e.target.value)}
                      className={`text-xs font-bold px-3 py-2 rounded-xl border focus:outline-none ${
                        ord.status === 'Completed'
                          ? 'bg-emerald-950 text-emerald-300 border-emerald-500/50'
                          : ord.status === 'In Production'
                          ? 'bg-blue-950 text-blue-300 border-blue-500/50'
                          : ord.status === 'Revision Requested'
                          ? 'bg-purple-950 text-purple-300 border-purple-500/50'
                          : 'bg-amber-950 text-amber-300 border-amber-500/50'
                      }`}
                    >
                      <option value="Pending Verification">Pending Verification</option>
                      <option value="Payment Verified">Payment Verified</option>
                      <option value="In Production">In Production</option>
                      <option value="Revision Requested">Revision Requested</option>
                      <option value="Completed">Completed (Delivered)</option>
                      <option value="Cancelled">Cancelled</option>
                    </select>
                  </div>

                  {/* Delivery URL input */}
                  <div className="flex-1 max-w-md flex items-center gap-2">
                    <input
                      type="url"
                      placeholder="Paste final Google Drive / download link..."
                      value={deliveryLinks[ord._id] || ''}
                      onChange={(e) =>
                        setDeliveryLinks({ ...deliveryLinks, [ord._id]: e.target.value })
                      }
                      className="w-full bg-slate-900 border border-brand-border rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
                    />
                    <button
                      onClick={() => handleSaveDeliveryLink(ord._id)}
                      disabled={updatingId === ord._id}
                      className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold px-3 py-2 rounded-xl text-xs flex items-center gap-1 shrink-0"
                    >
                      <Save className="w-3.5 h-3.5" />
                      <span>{updatingId === ord._id ? 'Saving...' : 'Deliver'}</span>
                    </button>
                  </div>

                  {/* CRM Quick Actions (WhatsApp templates, Mail, Delete) */}
                  <div className="flex items-center gap-2">
                    {/* 1-Click WhatsApp Chat */}
                    <a
                      href={`https://wa.me/91${cleanPhone}?text=${encodeURIComponent(
                        ord.deliveryLink ? whatsappDeliveredMsg : whatsappVerifiedMsg
                      )}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs px-3.5 py-2 rounded-xl transition-all shadow-md shadow-emerald-600/20"
                    >
                      <PhoneCall className="w-3.5 h-3.5" />
                      <span>{ord.deliveryLink ? 'Send Deliver Link' : 'Confirm on WhatsApp'}</span>
                    </a>

                    {/* 1-Click Mail */}
                    <a
                      href={`mailto:${ord.clientEmail}?subject=Regarding%20your%20Order%20${ord.orderId}&body=${encodeURIComponent(whatsappVerifiedMsg)}`}
                      className="p-2 rounded-xl bg-slate-800 text-slate-300 hover:text-white hover:bg-slate-700 transition-colors"
                      title="Email Client"
                    >
                      <Mail className="w-4 h-4" />
                    </a>

                    {/* Delete Lead */}
                    <button
                      onClick={() => handleDeleteOrder(ord._id)}
                      className="p-2 rounded-xl bg-red-950/40 text-red-400 hover:bg-red-900/60 transition-colors"
                      title="Delete Lead"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                </div>

              </div>
            );
          })}
        </div>
      )}

      {/* Admin View Invoice Modal */}
      {selectedInvoiceOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="relative w-full max-w-lg bg-slate-900 border border-brand-border rounded-3xl p-6 sm:p-8 shadow-2xl">
            <button
              onClick={() => setSelectedInvoiceOrder(null)}
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
                <span className="text-xs font-mono font-bold text-slate-400">{selectedInvoiceOrder.invoiceNumber || `INV-${selectedInvoiceOrder.orderId}`}</span>
                <p className="text-[11px] text-slate-500 mt-0.5">{new Date(selectedInvoiceOrder.createdAt).toLocaleDateString('en-IN')}</p>
              </div>
            </div>

            <div className="text-xs text-slate-300 space-y-1 mb-4">
              <p><strong className="text-slate-400">Client:</strong> {selectedInvoiceOrder.clientName}</p>
              <p><strong className="text-slate-400">Email:</strong> {selectedInvoiceOrder.clientEmail}</p>
              <p><strong className="text-slate-400">Phone:</strong> {selectedInvoiceOrder.clientPhone}</p>
              <p><strong className="text-slate-400">UTR:</strong> {selectedInvoiceOrder.utrNumber}</p>
            </div>

            <div className="bg-slate-950 rounded-xl p-3 mb-4 text-xs space-y-1">
              <div className="flex justify-between font-bold text-white">
                <span>{selectedInvoiceOrder.serviceTitle}</span>
                <span>₹{selectedInvoiceOrder.amount}</span>
              </div>
              <div className="flex justify-between text-slate-400 text-[11px]">
                <span>Status: {selectedInvoiceOrder.status}</span>
                <span>Speed: {selectedInvoiceOrder.deliverySpeed || 'Standard 24h'}</span>
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
                onClick={() => setSelectedInvoiceOrder(null)}
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

export default AdminOrders;
