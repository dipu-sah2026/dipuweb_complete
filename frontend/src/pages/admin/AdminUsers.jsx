import React, { useState, useEffect } from 'react';
import { Users, PhoneCall, Mail, Search, Calendar, Package } from 'lucide-react';
import api from '../../services/api';

const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const res = await api.get('/users');
      if (res.data?.data) {
        setUsers(res.data.data);
      }
    } catch (err) {
      console.log('Unable to fetch users');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const filteredUsers = users.filter((u) => {
    if (!search) return true;
    const term = search.toLowerCase();
    return (
      u.name?.toLowerCase().includes(term) ||
      u.email?.toLowerCase().includes(term) ||
      u.phone?.toLowerCase().includes(term)
    );
  });

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-white flex items-center gap-2">
            <Users className="w-7 h-7 text-brand-yellow" />
            <span>Registered Clients & Accounts</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Total {users.length} registered clients with project histories.
          </p>
        </div>

        <div className="relative w-full sm:w-72">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name, email, phone..."
            className="w-full bg-brand-card border border-brand-border rounded-xl pl-10 pr-4 py-2 text-xs text-white focus:outline-none focus:border-brand-yellow"
          />
        </div>
      </div>

      {loading ? (
        <div className="p-12 text-center text-slate-500">Loading registered clients...</div>
      ) : filteredUsers.length === 0 ? (
        <div className="bg-brand-card border border-brand-border rounded-3xl p-12 text-center text-slate-400">
          No registered clients found.
        </div>
      ) : (
        <div className="bg-brand-card border border-brand-border rounded-3xl overflow-hidden shadow-xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs sm:text-sm">
              <thead className="bg-slate-900/80 text-slate-400 uppercase text-[11px] font-bold border-b border-brand-border">
                <tr>
                  <th className="p-4">Client Name</th>
                  <th className="p-4">Contact Info</th>
                  <th className="p-4">Total Orders</th>
                  <th className="p-4">Joined Date</th>
                  <th className="p-4 text-right">Direct Contact</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-brand-border/60">
                {filteredUsers.map((u) => {
                  const cleanPhone = (u.phone || '').replace(/\D/g, '');
                  return (
                    <tr key={u._id} className="hover:bg-slate-900/40 transition-colors">
                      <td className="p-4">
                        <p className="font-bold text-white text-sm">{u.name}</p>
                        <span className="text-[10px] text-brand-yellow uppercase font-mono">Client Account</span>
                      </td>
                      <td className="p-4">
                        <p className="text-slate-300">{u.email}</p>
                        <p className="text-xs text-slate-500 font-mono">{u.phone || 'No phone'}</p>
                      </td>
                      <td className="p-4">
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-slate-900 text-brand-yellow border border-brand-border">
                          <Package className="w-3.5 h-3.5" />
                          <span>{u.orderCount || 0} Orders</span>
                        </span>
                      </td>
                      <td className="p-4 text-xs text-slate-400">
                        {new Date(u.createdAt).toLocaleDateString('en-IN')}
                      </td>
                      <td className="p-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          {cleanPhone && (
                            <a
                              href={`https://wa.me/91${cleanPhone}?text=Hello%20${encodeURIComponent(u.name)}%2C%20I%20am%20Dipu%20Sah%20from%20DipuEditX!`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="p-2 rounded-xl bg-emerald-600/20 text-emerald-400 hover:bg-emerald-600/30"
                              title="Chat on WhatsApp"
                            >
                              <PhoneCall className="w-3.5 h-3.5" />
                            </a>
                          )}
                          <a
                            href={`mailto:${u.email}`}
                            className="p-2 rounded-xl bg-slate-800 text-slate-300 hover:text-white"
                            title="Send Email"
                          >
                            <Mail className="w-3.5 h-3.5" />
                          </a>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

    </div>
  );
};

export default AdminUsers;

