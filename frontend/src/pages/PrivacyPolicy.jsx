import React from 'react';
import { ShieldCheck } from 'lucide-react';

const PrivacyPolicy = () => {
  return (
    <div className="py-16 bg-brand-dark min-h-[80vh]">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="mb-10 text-center">
          <div className="inline-flex items-center gap-2 bg-yellow-500/10 text-brand-yellow px-4 py-1 rounded-full text-xs font-bold uppercase mb-2">
            <ShieldCheck className="w-4 h-4" />
            <span>Official Policy</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-white">Privacy Policy</h1>
          <p className="text-xs text-slate-400 mt-1">Domain: dipueditx.in | Last Updated: September 2026</p>
        </div>

        <div className="bg-brand-card border border-brand-border rounded-3xl p-6 sm:p-10 space-y-6 text-sm text-slate-300 leading-relaxed">
          <section className="space-y-2">
            <h2 className="text-lg font-bold text-white">1. Information We Collect</h2>
            <p>
              When you place an order or contact us on <strong>dipueditx.in</strong>, we collect personal details including your Name, WhatsApp Mobile Number, Email Address, Video Requirements/Scripts, and UPI Transaction Reference (UTR Number) to verify payment and deliver video assets.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-lg font-bold text-white">2. Confidentiality of Raw Footage & Scripts</h2>
            <p>
              All video clips, photos, patient medical data, student details, and business scripts provided by you remain 100% confidential. We do not sell, rent, or distribute your private project files to any third party.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-lg font-bold text-white">3. Payment Security</h2>
            <p>
              Payments on our website are conducted directly peer-to-peer via authenticated Unified Payments Interface (UPI) applications (Google Pay, PhonePe, Paytm, BHIM). We do not store or process your bank account passwords, debit card numbers, or UPI PINs.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-lg font-bold text-white">4. Showcase Rights</h2>
            <p>
              We reserve the right to feature selected non-sensitive finished videos in our portfolio showcase to demonstrate editing capability. If you require strict non-disclosure (NDA), please mention it in your order instructions.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-lg font-bold text-white">5. Contact Information</h2>
            <p>
              For privacy-related inquiries, contact Dipu Sah directly at <strong className="text-white">contact@dipueditx.in</strong> or WhatsApp at <strong className="text-white">+91 7481968724</strong>.
            </p>
          </section>
        </div>

      </div>
    </div>
  );
};

export default PrivacyPolicy;

