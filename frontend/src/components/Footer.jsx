import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Play, 
  Phone, 
  Mail, 
  Clock, 
  CheckCircle, 
  Youtube, 
  Instagram, 
  Facebook, 
  ShieldAlert,
  Sparkles
} from 'lucide-react';
import api, { DEFAULT_SETTINGS } from '../services/api';

const Footer = () => {
  const [settings, setSettings] = useState(DEFAULT_SETTINGS);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const res = await api.get('/settings');
        if (res.data?.data) {
          setSettings(res.data.data);
        }
      } catch (err) {
        // Fallback to DEFAULT_SETTINGS
      }
    };
    fetchSettings();
  }, []);
  return (
    <footer className="bg-slate-950 border-t border-brand-border pt-16 pb-8 text-slate-400">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Top Feature Bar */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 pb-12 border-b border-brand-border/60">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-brand-yellow/10 border border-brand-yellow/30 flex items-center justify-center text-brand-yellow font-bold">
              ₹
            </div>
            <div>
              <p className="text-white font-bold text-sm">₹100 Starting Price</p>
              <p className="text-xs text-slate-500">Most affordable video agency</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400 font-bold">
              <Clock className="w-5 h-5" />
            </div>
            <div>
              <p className="text-white font-bold text-sm">24-Hour Express Delivery</p>
              <p className="text-xs text-slate-500">Fast turnaround on all edits</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 font-bold">
              <CheckCircle className="w-5 h-5" />
            </div>
            <div>
              <p className="text-white font-bold text-sm">100% Satisfaction</p>
              <p className="text-xs text-slate-500">Free revisions on custom orders</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-purple-500/10 border border-purple-500/30 flex items-center justify-center text-purple-400 font-bold">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <p className="text-white font-bold text-sm">AI Magic + Pro Editing</p>
              <p className="text-xs text-slate-500">Midjourney, Kling, CapCut, VN</p>
            </div>
          </div>
        </div>

        {/* Main Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 py-12 border-b border-brand-border/60">
          
          {/* Brand Col */}
          <div className="lg:col-span-2 space-y-4">
            <Link to="/" className="flex items-center gap-2.5">
              <img
                src="/logo.png"
                alt="DipuEditX Logo"
                className="w-9 h-9 object-contain"
              />
              <span className="text-xl font-black text-white tracking-tight">
                Dipu<span className="text-brand-yellow">EditX</span>
              </span>
            </Link>
            <p className="text-sm text-slate-300 font-semibold">
              Dipu Sah • Video Editor & AI Video Creator
            </p>
            <p className="text-xs leading-relaxed text-slate-400 max-w-sm">
              "Your Idea, My Editing & AI Magic". We craft viral Instagram Reels, YouTube Shorts, Doctor/Healthcare educational videos, School promotions, and Business Ads engineered to boost engagement and sales.
            </p>

            {/* Software Badges from flyer */}
            <div className="pt-2">
              <p className="text-xs uppercase tracking-wider text-slate-500 font-bold mb-2">
                Tools & Software Stack:
              </p>
              <div className="flex flex-wrap gap-2 text-xs font-semibold">
                <span className="px-2.5 py-1 rounded bg-brand-card border border-brand-border text-slate-300">CapCut Pro</span>
                <span className="px-2.5 py-1 rounded bg-brand-card border border-brand-border text-slate-300">VN Editor</span>
                <span className="px-2.5 py-1 rounded bg-brand-card border border-brand-border text-slate-300">Clipchamp</span>
                <span className="px-2.5 py-1 rounded bg-brand-card border border-brand-border text-slate-300">Premiere Pro</span>
                <span className="px-2.5 py-1 rounded bg-brand-card border border-brand-border text-yellow-400">AI Generators</span>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-3">
            <h4 className="text-white font-bold text-sm tracking-wider uppercase">Navigation</h4>
            <ul className="space-y-2 text-sm">
              <li><Link to="/" className="hover:text-brand-yellow transition-colors">Home</Link></li>
              <li><Link to="/services" className="hover:text-brand-yellow transition-colors">All Services (₹100)</Link></li>
              <li><Link to="/portfolio" className="hover:text-brand-yellow transition-colors">Video Showcase</Link></li>
              <li><Link to="/order" className="hover:text-brand-yellow transition-colors">Book a Video</Link></li>
              <li><Link to="/track-order" className="hover:text-brand-yellow transition-colors">Track Order Status</Link></li>
              <li><Link to="/helpdesk" className="hover:text-brand-yellow transition-colors">Helpdesk & FAQ</Link></li>
            </ul>
          </div>

          {/* Sectors / Services */}
          <div className="space-y-3">
            <h4 className="text-white font-bold text-sm tracking-wider uppercase">Video Categories</h4>
            <ul className="space-y-2 text-sm">
              <li><Link to="/services" className="hover:text-brand-yellow transition-colors">AI Video Creation</Link></li>
              <li><Link to="/services" className="hover:text-brand-yellow transition-colors">Doctor & Hospital Videos</Link></li>
              <li><Link to="/services" className="hover:text-brand-yellow transition-colors">School & College Promos</Link></li>
              <li><Link to="/services" className="hover:text-brand-yellow transition-colors">Business & Brand Ads</Link></li>
              <li><Link to="/services" className="hover:text-brand-yellow transition-colors">Shorts & Reels (9:16)</Link></li>
              <li><Link to="/services" className="hover:text-brand-yellow transition-colors">Thumbnail & Banner Design</Link></li>
            </ul>
          </div>

          {/* Contact & Support */}
          <div className="space-y-3">
            <h4 className="text-white font-bold text-sm tracking-wider uppercase">Contact Dipu</h4>
            <div className="space-y-2 text-sm">
              <a 
                href={`https://wa.me/${(settings.whatsappNumber || '7481968724').replace(/\D/g, '')}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-emerald-400 hover:text-emerald-300 font-semibold"
              >
                <Phone className="w-4 h-4" />
                <span>+91 {settings.whatsappNumber || '7481968724'} (WhatsApp)</span>
              </a>
              <div className="flex items-center gap-2 text-slate-400">
                <Mail className="w-4 h-4 text-brand-yellow" />
                <span>{settings.contactEmail || 'contact@dipueditx.in'}</span>
              </div>
              <p className="text-xs text-slate-500 pt-1">
                Domain: <strong className="text-slate-300">dipueditx.in</strong>
              </p>
            </div>

            {/* Social Channels */}
            <div className="pt-3">
              <p className="text-xs uppercase text-slate-500 font-bold mb-2">Connect with us:</p>
              <div className="flex gap-2">
                <a 
                  href={settings.socialLinks?.youtube || 'https://youtube.com'} 
                  target="_blank" 
                  rel="noreferrer" 
                  className="w-9 h-9 rounded-lg bg-red-600/20 text-red-500 hover:bg-red-600 hover:text-white flex items-center justify-center transition-colors"
                >
                  <Youtube className="w-4 h-4" />
                </a>
                <a 
                  href={settings.socialLinks?.instagram || 'https://instagram.com'} 
                  target="_blank" 
                  rel="noreferrer" 
                  className="w-9 h-9 rounded-lg bg-pink-600/20 text-pink-400 hover:bg-pink-600 hover:text-white flex items-center justify-center transition-colors"
                >
                  <Instagram className="w-4 h-4" />
                </a>
                <a 
                  href={settings.socialLinks?.facebook || 'https://facebook.com'} 
                  target="_blank" 
                  rel="noreferrer" 
                  className="w-9 h-9 rounded-lg bg-blue-600/20 text-blue-400 hover:bg-blue-600 hover:text-white flex items-center justify-center transition-colors"
                >
                  <Facebook className="w-4 h-4" />
                </a>
              </div>
            </div>
          </div>

        </div>

        {/* Bottom Copyright, Legal & Developer Credits */}
        <div className="pt-8 pr-0 md:pr-16 lg:pr-20 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-slate-500 text-center md:text-left relative z-10">
          {/* Left: Copyright */}
          <p>© {new Date().getFullYear()} DipuEditX (dipueditx.in). All rights reserved. Managed by Dipu Sah.</p>
          
          {/* Middle: Legal Links */}
          <div className="flex flex-wrap items-center justify-center gap-4">
            <Link to="/privacy-policy" className="hover:text-slate-300 transition-colors">Privacy Policy</Link>
            <Link to="/terms-conditions" className="hover:text-slate-300 transition-colors">Terms of Service</Link>
            <Link to="/return-policy" className="hover:text-slate-300 transition-colors">Return & Refund Policy</Link>
            <Link to="/admin/login" className="text-slate-600 hover:text-slate-400 transition-colors">Admin</Link>
          </div>

          {/* Right: Developer Credit */}
          <p className="text-slate-400 font-medium relative z-20">
            Developed by{' '}
            <a
              href="https://easyuverse.shop"
              target="_blank"
              rel="noopener noreferrer"
              className="text-brand-yellow hover:underline font-bold inline-block"
            >
              easyuverse.shop
            </a>
          </p>
        </div>

      </div>
    </footer>
  );
};

export default Footer;

