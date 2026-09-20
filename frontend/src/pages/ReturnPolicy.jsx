import React from 'react';
import { RotateCcw } from 'lucide-react';

const ReturnPolicy = () => {
  return (
    <div className="py-16 bg-brand-dark min-h-[80vh]">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="mb-10 text-center">
          <div className="inline-flex items-center gap-2 bg-yellow-500/10 text-brand-yellow px-4 py-1 rounded-full text-xs font-bold uppercase mb-2">
            <RotateCcw className="w-4 h-4" />
            <span>Revision & Refund Standards</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-white">Return & Refund Policy</h1>
          <p className="text-xs text-slate-400 mt-1">Domain: dipueditx.in | Transparent Client Protection</p>
        </div>

        <div className="bg-brand-card border border-brand-border rounded-3xl p-6 sm:p-10 space-y-6 text-sm text-slate-300 leading-relaxed">
          <section className="space-y-2">
            <h2 className="text-lg font-bold text-white">1. Nature of Customized Digital Services</h2>
            <p>
              Video editing and AI generation are custom digital labor services tailored specifically to your prompt, footage, and business instructions. Because processing compute and editing hours cannot be physically returned, standard monetary refunds are not granted once editing production has started.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-lg font-bold text-white">2. Free Revision Guarantee</h2>
            <p>
              To ensure 100% customer satisfaction, we provide <strong>free revisions</strong> on every order for:
            </p>
            <ul className="list-disc pl-5 space-y-1 text-slate-300">
              <li>Subtitle/caption typos, text corrections, and color timing adjustments</li>
              <li>Pacing, cuts, transitions, sound effects, or background audio volume balancing</li>
              <li>Fixing any deviation from your original script guidelines</li>
            </ul>
          </section>

          <section className="space-y-2">
            <h2 className="text-lg font-bold text-white">3. Non-Delivery Refund</h2>
            <p>
              In the unlikely event that DipuEditX fails to deliver your video within 72 hours without prior mutual agreement or technical justification, you are eligible for a 100% refund back to your originating UPI account.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-lg font-bold text-white">4. Refund Request Procedure</h2>
            <p>
              To claim a refund or discuss revision adjustments, message Dipu Sah on WhatsApp at <strong>+91 7481968724</strong> or email <strong>contact@dipueditx.in</strong> quoting your Order ID.
            </p>
          </section>
        </div>

      </div>
    </div>
  );
};

export default ReturnPolicy;

