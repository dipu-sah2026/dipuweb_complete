import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  Play, 
  Menu, 
  X, 
  PhoneCall, 
  User, 
  LogOut, 
  ShieldCheck,
  Zap,
  Sparkles
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { user, isAuthenticated, isAdmin, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const navLinks = [
    { label: 'Home', path: '/' },
    { label: 'Services', path: '/services' },
    { label: 'Showcase', path: '/portfolio' },
    { label: 'Track Order', path: '/track-order' },
    { label: 'Contact', path: '/contact' },
  ];

  return (
    <>
      {/* Sleek Slim Announcement Bar */}
      <div className="bg-gradient-to-r from-amber-500 via-yellow-400 to-amber-500 text-black py-1 px-4 text-xs font-bold text-center tracking-wide flex items-center justify-center gap-2">
        <Sparkles className="w-3.5 h-3.5 text-black animate-pulse" />
        <span>AI Video & Shorts Editing Starting @ Just ₹100! 24h Express Delivery</span>
        <Link to="/order" className="underline font-black hover:text-red-950 ml-1">
          Order Now
        </Link>
      </div>

      {/* Main Navbar */}
      <header className="sticky top-0 z-50 bg-slate-950/90 backdrop-blur-md border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            
            {/* Logo */}
            <Link to="/" className="flex items-center gap-2.5 shrink-0 group">
              <img
                src="/logo.png"
                alt="DipuEditX Logo"
                className="w-9 h-9 object-contain rounded-lg group-hover:scale-105 transition-transform"
              />
              <div className="flex flex-col">
                <span className="text-xl font-black tracking-tight text-white flex items-center gap-1.5 leading-none">
                  Dipu<span className="text-brand-yellow">EditX</span>
                  <span className="text-[9px] bg-red-600 text-white font-extrabold px-1.5 py-0.5 rounded uppercase tracking-wider">
                    AI
                  </span>
                </span>
                <span className="text-[10px] text-slate-400 font-medium tracking-wide mt-0.5">
                  Dipu Sah • Video Creator
                </span>
              </div>
            </Link>

            {/* Centered Clean Nav Links */}
            <nav className="hidden md:flex items-center gap-1 lg:gap-2">
              {navLinks.map((link) => {
                const isActive = location.pathname === link.path;
                return (
                  <Link
                    key={link.path}
                    to={link.path}
                    className={`px-3 py-1.5 rounded-lg text-xs lg:text-sm font-semibold transition-all ${
                      isActive
                        ? 'text-brand-yellow bg-yellow-500/10 font-bold'
                        : 'text-slate-300 hover:text-white hover:bg-slate-900'
                    }`}
                  >
                    {link.label}
                  </Link>
                );
              })}
            </nav>

            {/* Right Action Buttons */}
            <div className="hidden sm:flex items-center gap-2.5">
              
              {/* WhatsApp Quick CTA */}
              <a
                href="https://wa.me/917481968724?text=Hello%20Dipu%2C%20I%20want%20to%20order%20video%20editing"
                target="_blank"
                rel="noopener noreferrer"
                title="Chat with Dipu Sah on WhatsApp"
                className="flex items-center gap-1.5 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 px-3 py-1.5 rounded-xl text-xs font-bold transition-colors"
              >
                <PhoneCall className="w-3.5 h-3.5" />
                <span className="hidden xl:inline">WhatsApp:</span>
                <span>7481968724</span>
              </a>

              {/* Order @ ₹100 Button */}
              <Link
                to="/order"
                className="flex items-center gap-1.5 bg-brand-yellow hover:bg-brand-yellowHover text-black font-black px-4 py-2 rounded-xl text-xs sm:text-sm shadow-md shadow-yellow-500/20 transition-all hover:scale-[1.02]"
              >
                <Zap className="w-4 h-4 fill-black" />
                <span>Order @ ₹100</span>
              </Link>

              {/* User / Admin State */}
              {isAuthenticated ? (
                <div className="flex items-center gap-1.5 pl-1.5 border-l border-slate-800">
                  {isAdmin ? (
                    <Link
                      to="/admin/dashboard"
                      className="bg-red-950/60 hover:bg-red-900/60 text-red-300 border border-red-700/50 px-2.5 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1"
                      title="Open Admin Panel"
                    >
                      <ShieldCheck className="w-3.5 h-3.5 text-red-400" />
                      <span>Admin</span>
                    </Link>
                  ) : (
                    <Link
                      to="/dashboard"
                      className="bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-800 px-2.5 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1"
                    >
                      <User className="w-3.5 h-3.5 text-brand-yellow" />
                      <span>Account</span>
                    </Link>
                  )}

                  <button
                    onClick={handleLogout}
                    title="Sign Out"
                    className="p-1.5 text-slate-400 hover:text-red-400 hover:bg-slate-900 rounded-lg transition-colors"
                  >
                    <LogOut className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <Link
                  to="/login"
                  className="text-slate-300 hover:text-white px-2.5 py-1.5 text-xs font-semibold"
                >
                  Login
                </Link>
              )}

            </div>

            {/* Mobile Menu Toggle */}
            <div className="flex items-center gap-2 md:hidden">
              <Link
                to="/order"
                className="bg-brand-yellow text-black font-black px-3 py-1 rounded-lg text-xs"
              >
                ₹100
              </Link>
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="p-2 text-slate-300 hover:text-white bg-slate-900 border border-slate-800 rounded-lg"
                aria-label="Toggle Menu"
              >
                {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>

          </div>
        </div>

        {/* Mobile Dropdown */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-slate-950 border-b border-slate-800 px-4 py-4 space-y-2">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                onClick={() => setMobileMenuOpen(false)}
                className="block py-2 text-sm font-semibold text-slate-300 hover:text-brand-yellow"
              >
                {link.label}
              </Link>
            ))}

            <div className="pt-3 border-t border-slate-800 space-y-2">
              <a
                href="https://wa.me/917481968724?text=Hello%20Dipu%2C%20I%20want%20to%20order%20video%20editing"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 bg-emerald-600 text-white font-bold py-2 rounded-xl text-xs"
              >
                <PhoneCall className="w-4 h-4" />
                <span>WhatsApp: 7481968724</span>
              </a>

              {isAuthenticated ? (
                <div className="flex gap-2 pt-1">
                  <Link
                    to={isAdmin ? '/admin/dashboard' : '/dashboard'}
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex-1 text-center bg-slate-900 border border-slate-800 py-2 rounded-xl text-xs font-bold text-white"
                  >
                    {isAdmin ? 'Admin CMS' : 'My Dashboard'}
                  </Link>
                  <button
                    onClick={() => {
                      handleLogout();
                      setMobileMenuOpen(false);
                    }}
                    className="px-4 bg-red-950/50 text-red-400 py-2 rounded-xl text-xs font-bold"
                  >
                    Logout
                  </button>
                </div>
              ) : (
                <Link
                  to="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block text-center bg-slate-900 border border-slate-800 text-slate-200 py-2 rounded-xl text-xs font-bold"
                >
                  Client Login
                </Link>
              )}
            </div>
          </div>
        )}
      </header>
    </>
  );
};

export default Navbar;
