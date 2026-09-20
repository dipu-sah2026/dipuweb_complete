import React from 'react';
import FAQSection from '../components/FAQSection';
import { HelpCircle, ShieldCheck, RefreshCw, Clock, PhoneCall } from 'lucide-react';

const HelpdeskPage = () => {
  return (
    <div className="py-12 bg-brand-dark min-h-[85vh]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Top Banner */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <div className="inline-flex items-center gap-2 bg-yellow-500/10 border border-yellow-500/30 text-brand-yellow px-4 py-1 rounded-full text-xs font-black uppercase tracking-wider mb-2">
            <HelpCircle className="w-4 h-4" />
            <span>24/7 Client Support</span>
          </div>
          <h1 className="text-4xl sm:text-5xl font-black text-white">
            DipuEditX <span className="text-brand-yellow">Helpdesk</span>
          </h1>
          <p className="text-slate-400 text-sm sm:text-base mt-2">
            Payment confirmation, revision guidelines, delivery timelines, aur direct assistance.
          </p>
        </div>

        {/* 3 Support Highlight Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="bg-brand-card border border-brand-border rounded-3xl p-6 space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-amber-500/10 text-brand-yellow flex items-center justify-center">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-black text-white">Payment & UTR Help</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Agar aapne payment kar di hai aur status pending hai, to WhatsApp (+91 7481968724) par payment screenshot aur 12-digit UTR send karein for instant manual approval.
            </p>
          </div>

          <div className="bg-brand-card border border-brand-border rounded-3xl p-6 space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-cyan-500/10 text-cyan-400 flex items-center justify-center">
              <RefreshCw className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-black text-white">Revision Policy</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Video deliver hone ke baad agar aapko text spelling, cut, music, ya avatar me badlav chahiye, to 48 ghante ke andar request karein. Minor tweaks are completely free!
            </p>
          </div>

          <div className="bg-brand-card border border-brand-border rounded-3xl p-6 space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center">
              <Clock className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-black text-white">24-Hour Express TAT</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Hamara turnaround time standard 24 hours hai. Emergency urgent orders ke liye 6-hour super express delivery bhi available hai (WhatsApp par batayein).
            </p>
          </div>
        </div>

        {/* FAQ Accordion embedded */}
        <FAQSection />

      </div>
    </div>
  );
};

export default HelpdeskPage;

