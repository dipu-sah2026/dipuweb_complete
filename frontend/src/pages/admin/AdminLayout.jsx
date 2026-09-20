import React from 'react';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, 
  ShoppingCart, 
  Layers, 
  Film, 
  Settings, 
  LogOut, 
  ExternalLink, 
  ShieldCheck,
  Play,
  HelpCircle,
  Star,
  Tag,
  Users
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

class AdminErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Admin UI Error caught by ErrorBoundary:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="bg-brand-card border border-red-500/40 rounded-3xl p-8 max-w-xl mx-auto my-12 text-center shadow-2xl">
          <div className="w-12 h-12 rounded-2xl bg-red-500/20 border border-red-500/30 flex items-center justify-center mx-auto mb-4 text-red-400 font-bold text-xl">
            ⚠️
          </div>
          <h2 className="text-xl font-black text-white mb-2">Section Load Error</h2>
          <p className="text-xs text-slate-400 mb-4 font-mono bg-slate-900 p-3 rounded-xl border border-slate-800 break-words text-left">
            {this.state.error?.message || 'An unexpected rendering error occurred'}
          </p>
          <button
            onClick={() => {
              this.setState({ hasError: false, error: null });
              window.location.reload();
            }}
            className="px-5 py-2.5 bg-brand-yellow hover:bg-brand-yellowHover text-black font-black text-xs rounded-xl shadow transition-all"
          >
            Refresh Page
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}

const AdminLayout = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate('/admin/login');
  };

  const navItems = [
    { label: 'Overview', path: '/admin/dashboard', icon: LayoutDashboard },
    { label: 'Leads & Orders', path: '/admin/orders', icon: ShoppingCart },
    { label: 'Services & Pricing', path: '/admin/services', icon: Layers },
    { label: 'Project Showcase', path: '/admin/portfolio', icon: Film },
    { label: 'FAQs CMS', path: '/admin/faqs', icon: HelpCircle },
    { label: 'Reviews CMS', path: '/admin/reviews', icon: Star },
    { label: 'Coupons CMS', path: '/admin/coupons', icon: Tag },
    { label: 'Registered Clients', path: '/admin/users', icon: Users },
    { label: 'Site & UPI Settings', path: '/admin/settings', icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col md:flex-row">
      
      {/* Sidebar */}
      <aside className="w-full md:w-64 bg-brand-dark border-r border-brand-border/80 flex flex-col justify-between shrink-0">
        <div>
          {/* Admin Header */}
          <div className="p-6 border-b border-brand-border/80">
            <Link to="/" className="flex items-center gap-2 mb-2">
              <div className="w-8 h-8 rounded-lg bg-brand-yellow flex items-center justify-center text-black font-black">
                <Play className="w-4 h-4 fill-black" />
              </div>
              <span className="text-lg font-black text-white">
                Dipu<span className="text-brand-yellow">EditX</span>
              </span>
            </Link>
            <span className="inline-flex items-center gap-1 text-[10px] bg-red-600/20 text-red-400 border border-red-500/30 px-2 py-0.5 rounded font-black uppercase tracking-wider">
              <ShieldCheck className="w-3 h-3" />
              Admin Master CMS
            </span>
          </div>

          {/* Navigation Links */}
          <nav className="p-3 space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all ${
                    isActive
                      ? 'bg-brand-yellow text-black shadow-lg shadow-yellow-500/20'
                      : 'text-slate-400 hover:text-white hover:bg-brand-card'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Bottom User info & External website */}
        <div className="p-4 border-t border-brand-border/80 space-y-2">
          <Link
            to="/"
            target="_blank"
            className="flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold text-slate-400 hover:text-brand-yellow hover:bg-brand-card transition-colors"
          >
            <span>Live Website</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </Link>

          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-bold text-red-400 hover:bg-red-950/40 transition-colors"
          >
            <LogOut className="w-4 h-4" />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto min-h-screen bg-slate-950 p-6 sm:p-10">
        <AdminErrorBoundary>
          <Outlet />
        </AdminErrorBoundary>
      </main>

    </div>
  );
};

export default AdminLayout;
