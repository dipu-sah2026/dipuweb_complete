import React from 'react';
import { 
  Sparkles, 
  Clock, 
  CircleDollarSign, 
  CheckCircle, 
  Layers, 
  ShieldCheck, 
  PhoneCall, 
  ArrowRight 
} from 'lucide-react';
import { Link } from 'react-router-dom';

const WhyChooseUs = () => {
  return (
    <section className="py-20 bg-gradient-to-b from-brand-dark via-[#090e1d] to-brand-dark relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Main 2-Column Banner Box */}
        <div className="rounded-3xl bg-gradient-to-br from-brand-card via-slate-900 to-brand-card border-2 border-brand-yellow/30 p-8 sm:p-12 shadow-2xl relative overflow-hidden">
          
          {/* Subtle Ambient Glow */}
          <div className="absolute top-0 right-0 w-80 h-80 bg-brand-yellow/10 blur-[100px] pointer-events-none rounded-full" />
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            
            {/* Left Col: Features from Flyer */}
            <div className="space-y-6">
              <div className="inline-flex items-center gap-2 bg-red-600 text-white text-xs font-black uppercase tracking-wider px-3.5 py-1.5 rounded-xl shadow-lg">
                <span>🔥 क्यों चुनें हमें? (Why Choose Dipu Sah)</span>
              </div>

              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white leading-tight">
                Quality • Creativity <br />
                <span className="text-brand-yellow">Your Vision • Our Editing</span>
              </h2>

              <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
                DipuEditX par hum sirf video edit nahi karte, balki aapke audience ko engage karne ke liye psychological hooks, viral sound effects, aur hyper-realistic AI visuals use karte hain.
              </p>

              {/* 4 Core Pillars from Flyer */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                <div className="flex items-start gap-3 p-4 rounded-2xl bg-slate-950/60 border border-brand-border">
                  <div className="w-10 h-10 rounded-xl bg-cyan-500/10 text-cyan-400 flex items-center justify-center shrink-0">
                    <Sparkles className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-white font-bold text-sm">High Quality Video</h4>
                    <p className="text-xs text-slate-400 mt-0.5">Full HD 1080p & 4K Ultra crisp rendering</p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-4 rounded-2xl bg-slate-950/60 border border-brand-border">
                  <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center shrink-0">
                    <Clock className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-white font-bold text-sm">Fast Delivery</h4>
                    <p className="text-xs text-slate-400 mt-0.5">Express 24-hour delivery on all shorts & reels</p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-4 rounded-2xl bg-slate-950/60 border border-brand-border">
                  <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center shrink-0">
                    <CircleDollarSign className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-white font-bold text-sm">Affordable Price</h4>
                    <p className="text-xs text-slate-400 mt-0.5">Starting at only ₹100 per video. Best in market</p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-4 rounded-2xl bg-slate-950/60 border border-brand-border">
                  <div className="w-10 h-10 rounded-xl bg-purple-500/10 text-purple-400 flex items-center justify-center shrink-0">
                    <CheckCircle className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-white font-bold text-sm">100% Satisfaction</h4>
                    <p className="text-xs text-slate-400 mt-0.5">Free revisions if you need tweaks in captions/cuts</p>
                  </div>
                </div>
              </div>

              {/* Tagline Callout */}
              <div className="pt-2 text-brand-yellow font-extrabold text-sm sm:text-base flex items-center gap-2">
                <span>⏱️ जल्दी बनवाएं अपने Video को Next Level पर!</span>
              </div>
            </div>

            {/* Right Col: "Use For" Checklist & Direct WhatsApp Contact */}
            <div className="bg-slate-950/90 rounded-3xl p-6 sm:p-8 border border-brand-border/80 space-y-6">
              <div>
                <span className="text-xs uppercase tracking-wider font-bold text-slate-400 block mb-1">
                  Ready-To-Use Formats
                </span>
                <h3 className="text-2xl font-black text-white">
                  Use Our Videos For:
                </h3>
              </div>

              <div className="space-y-3">
                {[
                  'Website / Web Application Demos',
                  'Mobile App Explainer & Walkthroughs',
                  'Doctor, Clinic & Hospital Health Videos',
                  'School & College Admission Promos',
                  'Business, Brand & eCommerce Social Ads',
                  'YouTube Shorts, Instagram Reels & Facebook (9:16)',
                ].map((item, idx) => (
                  <div key={idx} className="flex items-center gap-3 text-slate-200 text-sm font-semibold">
                    <div className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
                      <CheckCircle className="w-3.5 h-3.5" />
                    </div>
                    <span>{item}</span>
                  </div>
                ))}
              </div>

              {/* Direct WhatsApp Box */}
              <div className="pt-4 border-t border-slate-800">
                <div className="bg-emerald-950/40 border border-emerald-500/40 rounded-2xl p-4 flex flex-col sm:flex-row items-center justify-between gap-4">
                  <div>
                    <span className="text-[11px] font-bold text-emerald-400 uppercase tracking-wider">
                      Direct WhatsApp Support
                    </span>
                    <p className="text-xl font-black text-white">7481968724</p>
                  </div>

                  <a
                    href="https://wa.me/917481968724?text=Hello%20Dipu%2C%20I%20want%20to%20order%20a%20video!"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full sm:w-auto bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xs px-5 py-3 rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-emerald-600/20"
                  >
                    <PhoneCall className="w-4 h-4" />
                    <span>Message Now</span>
                  </a>
                </div>
              </div>

            </div>

          </div>

        </div>

      </div>
    </section>
  );
};

export default WhyChooseUs;

