import React from 'react';
import { FileCheck } from 'lucide-react';

const TermsConditions = () => {
  return (
    <div className="py-16 bg-brand-dark min-h-[80vh]">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="mb-10 text-center">
          <div className="inline-flex items-center gap-2 bg-yellow-500/10 text-brand-yellow px-4 py-1 rounded-full text-xs font-bold uppercase mb-2">
            <FileCheck className="w-4 h-4" />
            <span>Service Agreement</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-white">Terms & Conditions</h1>
          <p className="text-xs text-slate-400 mt-1">Domain: dipueditx.in | Managed by Dipu Sah</p>
        </div>

        <div className="bg-brand-card border border-brand-border rounded-3xl p-6 sm:p-10 space-y-6 text-sm text-slate-300 leading-relaxed">
          <section className="space-y-2">
            <h2 className="text-lg font-bold text-white">1. Service Scope</h2>
            <p>
              DipuEditX provides digital AI video creation, reel/short editing, thumbnail design, and audio voiceover services as described in the service plans.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-lg font-bold text-white">2. Turnaround Time (TAT)</h2>
            <p>
              Standard video orders are delivered within 24 to 48 hours following valid payment UTR verification. Delays caused by incomplete scripts, corrupted raw files, or delayed client approvals are exempt from TAT timelines.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-lg font-bold text-white">3. Content Compliance</h2>
            <p>
              Clients agree not to submit footage, scripts, or audio containing hate speech, nudity, defamatory allegations, or illegal activities. DipuEditX reserves the right to decline prohibited orders.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-lg font-bold text-white">4. Commercial Usage</h2>
            <p>
              Once delivered and fully paid for, clients hold unrestricted rights to monetize and distribute the video across YouTube, Instagram, Facebook, TikTok, website landing pages, and broadcast TV.
            </p>
          </section>
        </div>

      </div>
    </div>
  );
};

export default TermsConditions;

