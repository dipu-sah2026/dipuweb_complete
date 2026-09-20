import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Play, 
  Sparkles, 
  Flame, 
  CheckCircle2, 
  ArrowRight, 
  PhoneCall, 
  Video, 
  Layers, 
  Zap 
} from 'lucide-react';
import api from '../services/api';

const Hero = () => {
  const [startingPrice, setStartingPrice] = useState(100);
  const [phone, setPhone] = useState('7481968724');

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const res = await api.get('/settings');
        if (res.data?.data) {
          if (res.data.data.startingPrice) setStartingPrice(res.data.data.startingPrice);
          if (res.data.data.whatsappNumber) setPhone(res.data.data.whatsappNumber.replace(/\D/g, ''));
        }
      } catch (err) {
        // Fallback to default
      }
    };
    fetchSettings();
  }, []);

  const cleanPhone = phone.startsWith('91') ? phone : `91${phone}`;
  return (
    <section className="relative pt-8 pb-20 md:pt-14 md:pb-28 overflow-hidden bg-gradient-to-b from-brand-dark via-[#0a0f1d] to-brand-dark">
      
      {/* Background Decorative Glow Orbs */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-gradient-to-r from-blue-600/15 via-cyan-500/15 to-yellow-500/15 blur-[120px] pointer-events-none rounded-full" />
      <div className="absolute top-10 right-10 w-72 h-72 bg-red-600/10 blur-[100px] pointer-events-none rounded-full" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Top Tag & Identity */}
        <div className="text-center max-w-4xl mx-auto space-y-4">
          
          <div className="inline-flex items-center gap-2 bg-brand-cardLight/80 border border-brand-yellow/40 rounded-full px-4 py-1.5 text-xs sm:text-sm font-bold text-brand-yellow shadow-lg shadow-yellow-500/10 backdrop-blur-md">
            <Sparkles className="w-4 h-4 text-brand-yellow animate-pulse" />
            <span>Dipu Sah • Video Editor & AI Video Creator</span>
            <span className="bg-red-600 text-white text-[10px] uppercase px-2 py-0.5 rounded-full font-extrabold ml-1">
              Live
            </span>
          </div>

          {/* Main Headline from Flyer */}
          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black tracking-tight text-white leading-tight">
            Your Idea, <span className="text-brand-yellow">My Editing</span> <br className="hidden sm:inline" />
            & <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-sky-300 to-blue-500">AI Magic</span>
          </h1>

          {/* Subheading from Flyer */}
          <div className="inline-block bg-gradient-to-r from-red-600 to-amber-600 text-white font-black text-lg sm:text-2xl px-5 py-2 rounded-2xl shadow-xl shadow-red-600/20 transform -rotate-1">
            🎬 AI VIDEO & VIDEO EDITING SERVICES
          </div>

          {/* Target Sectors Hindi Tagline */}
          <p className="text-base sm:text-xl text-slate-300 font-medium max-w-2xl mx-auto leading-relaxed pt-2">
            <span className="text-brand-yellow font-bold">Website • App • Doctor • School • Business</span> ke liye Professional AI Videos banwaye! High Retention Shorts & Reels (9:16).
          </p>

          {/* HUGE PRICING CALLOUT BADGE */}
          <div className="pt-2">
            <div className="inline-flex flex-col sm:flex-row items-center gap-3 bg-gradient-to-r from-red-950/80 via-brand-card to-red-950/80 border-2 border-red-500/60 px-6 py-3.5 rounded-2xl glow-red">
              <div className="flex items-center gap-2">
                <Flame className="w-6 h-6 text-red-500 animate-bounce" />
                <span className="text-white font-extrabold text-lg sm:text-xl">Super Affordable:</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-3xl sm:text-4xl font-black text-brand-yellow drop-shadow-md">
                  Only ₹{startingPrice}
                </span>
                <span className="text-xs sm:text-sm text-slate-300 font-semibold leading-tight text-left">
                  Per Video <br />
                  <span className="text-red-400 font-bold">(Basic Video Editing / AI Video)</span>
                </span>
              </div>
            </div>
          </div>

          {/* Action CTAs */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <Link
              to="/order"
              className="w-full sm:w-auto flex items-center justify-center gap-3 bg-brand-yellow hover:bg-brand-yellowHover text-black font-black text-base px-8 py-4 rounded-2xl shadow-xl shadow-yellow-500/30 transition-all transform hover:-translate-y-1"
            >
              <Zap className="w-5 h-5 fill-black" />
              <span>Order Video Now (₹{startingPrice})</span>
              <ArrowRight className="w-5 h-5" />
            </Link>

            <a
              href={`https://wa.me/${cleanPhone}?text=Hello%20Dipu%2C%20I%20saw%20your%20website%20dipueditx.in%20and%20want%20to%20order%20AI%20video%20editing%20services!`}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto flex items-center justify-center gap-3 bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-base px-7 py-4 rounded-2xl shadow-xl shadow-emerald-600/30 transition-all transform hover:-translate-y-1"
            >
              <PhoneCall className="w-5 h-5" />
              <span>WhatsApp: {phone}</span>
            </a>

            <Link
              to="/portfolio"
              className="w-full sm:w-auto flex items-center justify-center gap-2 bg-brand-cardLight/70 hover:bg-brand-cardLight text-slate-200 border border-brand-border font-bold text-base px-6 py-4 rounded-2xl transition-all"
            >
              <Play className="w-4 h-4 fill-slate-200" />
              <span>View Samples</span>
            </Link>
          </div>

          {/* Quick Checklist Proof */}
          <div className="flex flex-wrap items-center justify-center gap-6 pt-6 text-xs sm:text-sm text-slate-300 font-semibold">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>High Quality HD/4K</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>24-Hour Express Delivery</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>Easy UPI QR Payment</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>100% Client Satisfaction</span>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
};

export default Hero;

