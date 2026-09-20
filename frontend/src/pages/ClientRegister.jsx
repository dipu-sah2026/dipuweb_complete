import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Play, UserPlus, AlertCircle, ArrowRight, Sparkles } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const ClientRegister = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const notice = location.state?.notice;
  const redirectPath = location.state?.from || '/dashboard';
  const preselectedService = location.state?.preselectedService;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);
    try {
      await register(name, email, password, phone);
      navigate(redirectPath, { state: { preselectedService } });
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed. Please check inputs.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="py-16 bg-brand-dark min-h-[85vh] flex items-center justify-center px-4">
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
          <h2 className="text-2xl font-black text-white">Create Client Account</h2>
          <p className="text-xs text-slate-400 mt-1">
            Sign up to track your video projects, receive 24h deliveries & download files
          </p>
        </div>

        {/* Notice if redirected from Order page */}
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
              Full Name *
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Rahul Sharma"
              className="w-full bg-slate-900 border border-brand-border rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-brand-yellow"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-300 mb-1">
              Email Address *
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="e.g. rahul@gmail.com"
              className="w-full bg-slate-900 border border-brand-border rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-brand-yellow"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-300 mb-1">
              WhatsApp Mobile Number
            </label>
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="e.g. 7481968724"
              className="w-full bg-slate-900 border border-brand-border rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-brand-yellow"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-300 mb-1">
              Password (min 6 characters) *
            </label>
            <input
              type="password"
              required
              minLength={6}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full bg-slate-900 border border-brand-border rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-brand-yellow"
            />
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full py-3.5 bg-brand-yellow hover:bg-brand-yellowHover text-black font-black text-sm rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-yellow-500/20 transition-all"
          >
            <UserPlus className="w-4 h-4" />
            <span>{submitting ? 'Creating Account...' : 'Continue to Video Order'}</span>
          </button>
        </form>

        <div className="mt-6 pt-6 border-t border-brand-border text-center">
          <p className="text-xs text-slate-400">
            Already have an account?{' '}
            <Link
              to="/login"
              state={{ from: redirectPath, preselectedService }}
              className="text-brand-yellow font-bold hover:underline"
            >
              Log In Here
            </Link>
          </p>
        </div>

      </div>
    </div>
  );
};

export default ClientRegister;
