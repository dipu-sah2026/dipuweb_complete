import React from 'react';
import { FileText, QrCode, Sparkles, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const steps = [
  {
    step: '01',
    title: 'Select Service & Script',
    desc: 'Apna manpasand package select karein (AI Video ya Shorts Editing @ ₹100), aur script ya Google Drive raw footage link enter karein.',
    icon: FileText,
    badge: 'Step 1',
  },
  {
    step: '02',
    title: 'Scan UPI QR & Enter UTR',
    desc: 'Dipu Sah ka official UPI QR code scan karein (GPay, PhonePe, Paytm), payment complete karein aur 12-digit UTR number enter karein.',
    icon: QrCode,
    badge: 'Step 2',
  },
  {
    step: '03',
    title: '24h Delivery & Revisions',
    desc: 'Dipu Sah turant aapke project par kaam start karenge aur 24 ghante me full HD video aapke dashboard aur email par deliver karenge.',
    icon: Sparkles,
    badge: 'Step 3',
  },
];

const WorkflowProcess = () => {
  return (
    <section className="py-20 bg-slate-950/60 border-t border-brand-border/40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="text-center max-w-3xl mx-auto mb-14">
          <span className="text-brand-yellow font-black text-xs uppercase tracking-widest bg-yellow-500/10 px-3 py-1 rounded-full border border-yellow-500/20">
            How It Works
          </span>
          <h2 className="text-3xl sm:text-5xl font-black text-white mt-3">
            Simple 3-Step <span className="text-brand-yellow">Ordering Process</span>
          </h2>
          <p className="text-slate-400 text-sm sm:text-base mt-2">
            Aasan, fast aur transparent video booking experience
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
          {steps.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div
                key={idx}
                className="relative bg-brand-card border border-brand-border rounded-3xl p-8 flex flex-col justify-between hover:border-brand-yellow/50 transition-all group"
              >
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <span className="text-4xl font-black text-slate-800 group-hover:text-brand-yellow/30 transition-colors">
                      {item.step}
                    </span>
                    <div className="w-12 h-12 rounded-2xl bg-brand-cardLight border border-brand-border flex items-center justify-center text-brand-yellow group-hover:scale-110 transition-transform">
                      <Icon className="w-6 h-6" />
                    </div>
                  </div>

                  <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                    {item.badge}
                  </span>
                  <h3 className="text-xl font-black text-white mb-3 group-hover:text-brand-yellow transition-colors">
                    {item.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
                    {item.desc}
                  </p>
                </div>

                <div className="pt-6 mt-6 border-t border-slate-800/80">
                  <div className="w-full h-1 bg-gradient-to-r from-brand-yellow/30 to-transparent rounded-full" />
                </div>
              </div>
            );
          })}
        </div>

        <div className="text-center mt-12">
          <Link
            to="/order"
            className="inline-flex items-center gap-2 bg-brand-yellow hover:bg-brand-yellowHover text-black font-black px-8 py-3.5 rounded-xl text-sm shadow-xl shadow-yellow-500/20 transition-all"
          >
            <span>Start Your Video Now (₹100)</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

      </div>
    </section>
  );
};

export default WorkflowProcess;

