import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ShieldCheck, LogIn, AlertCircle, ArrowLeft } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const AdminLogin = () => {
  const [email, setEmail] = useState('admin@dipueditx.in');
  const [password, setPassword] = useState('Admin@12345');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);
    try {
      const user = await login(email, password);
      if (user.role === 'admin') {
        navigate('/admin/dashboard');
      } else {
        setError('Access denied: Account does not have administrator rights.');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid admin credentials. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="py-20 bg-brand-dark min-h-screen flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-brand-card border-2 border-red-500/40 rounded-3xl p-8 shadow-2xl relative overflow-hidden">
        
        <div className="text-center mb-8">
          <div className="w-12 h-12 rounded-2xl bg-red-600/20 border border-red-500/40 text-red-400 flex items-center justify-center mx-auto mb-4">
            <ShieldCheck className="w-7 h-7" />
          </div>
          <h1 className="text-2xl font-black text-white">DipuEditX Admin CMS</h1>
          <p className="text-xs text-slate-400 mt-1">
            Master control panel for managing orders, services & leads
          </p>
        </div>

        {error && (
          <div className="mb-6 p-4 rounded-xl bg-red-950/70 border border-red-800 text-red-300 text-xs font-bold flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-300 mb-1">
              Admin Email
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-slate-900 border border-brand-border rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-red-500"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-300 mb-1">
              Admin Password
            </label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-slate-900 border border-brand-border rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-red-500"
            />
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full py-3.5 bg-red-600 hover:bg-red-500 text-white font-black text-sm rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-red-600/30 transition-all"
          >
            <LogIn className="w-4 h-4" />
            <span>{submitting ? 'Authenticating...' : 'Enter Admin Dashboard'}</span>
          </button>
        </form>

        <div className="mt-6 pt-6 border-t border-brand-border flex items-center justify-between text-xs text-slate-400">
          <Link to="/" className="hover:text-white flex items-center gap-1">
            <ArrowLeft className="w-3.5 h-3.5" />
            Back to Website
          </Link>
          
        </div>

      </div>
    </div>
  );
};

export default AdminLogin;

