import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Play, LogIn, AlertCircle, ArrowRight, Sparkles } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const ClientLogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const redirectPath = location.state?.from || '/dashboard';
  const preselectedService = location.state?.preselectedService;
  const notice = location.state?.notice;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);
    try {
      const user = await login(email, password);
      if (user.role === 'admin') {
        navigate('/admin/dashboard');
      } else {
        navigate(redirectPath, { state: { preselectedService } });
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed. Please verify email and password.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="py-20 bg-brand-dark min-h-[85vh] flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-brand-card border border-brand-border rounded-3xl p-8 shadow-2xl">
        
        <div className="text-center mb-6">
          <Link to="/" className="inline-flex items-center gap-2 mb-4">
            <div className="w-10 h-10 rounded-xl bg-brand-yellow flex items-center justify-center text-black font-black">
              <Play className="w-6 h-6 fill-black" />
            </div>
            <span className="text-2xl font-black text-white">
              Dipu<span className="text-brand-yellow">EditX</span>
            </span>
          </Link>
          <h2 className="text-2xl font-black text-white">Client Portal Login</h2>
          <p className="text-xs text-slate-400 mt-1">
            Access your placed video orders, status, and download links
          </p>
        </div>

        {notice && (
          <div className="mb-6 p-3.5 rounded-2xl bg-yellow-500/10 border border-yellow-500/30 text-brand-yellow text-xs font-bold flex items-center gap-2">
            <Sparkles className="w-4 h-4 shrink-0" />
            <span>{notice}</span>
          </div>
        )}

        {error && (
          <div className="mb-6 p-4 rounded-xl bg-red-950/50 border border-red-800 text-red-300 text-xs font-bold flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-300 mb-1">
              Email Address
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="e.g. client@gmail.com"
              className="w-full bg-slate-900 border border-brand-border rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-brand-yellow"
            />
          </div>

          <div>
            <div className="flex justify-between items-center mb-1">
              <label className="text-xs font-bold text-slate-300">
                Password
              </label>
            </div>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full bg-slate-900 border border-brand-border rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-brand-yellow"
            />
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full py-3.5 bg-brand-yellow hover:bg-brand-yellowHover text-black font-black text-sm rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-yellow-500/20 transition-all"
          >
            <LogIn className="w-4 h-4" />
            <span>{submitting ? 'Logging In...' : 'Sign In to Dashboard'}</span>
          </button>
        </form>

        <div className="mt-6 pt-6 border-t border-brand-border text-center space-y-3">
          <p className="text-xs text-slate-400">
            Don't have an account yet?{' '}
            <Link
              to="/register"
              state={{ from: redirectPath, preselectedService }}
              className="text-brand-yellow font-bold hover:underline"
            >
              Create Client Account
            </Link>
          </p>
          <p className="text-[11px] text-slate-500">
            Need to track without logging in?{' '}
            <Link to="/track-order" className="text-cyan-400 hover:underline">
              Track by UTR or Order ID →
            </Link>
          </p>
        </div>

      </div>
    </div>
  );
};

export default ClientLogin;
