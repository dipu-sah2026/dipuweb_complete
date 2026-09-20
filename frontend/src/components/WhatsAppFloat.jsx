import React from 'react';
import { MessageCircle } from 'lucide-react';

const WhatsAppFloat = () => {
  return (
    <div className="fixed bottom-6 right-6 z-40 flex items-center gap-2 group">
      {/* Tooltip on hover */}
      <div className="hidden md:block opacity-0 group-hover:opacity-100 transition-opacity bg-slate-900 text-white text-xs font-bold py-1.5 px-3 rounded-xl border border-brand-border shadow-xl">
        Chat with Dipu Sah (7481968724)
      </div>

      <a
        href="https://wa.me/917481968724?text=Hello%20Dipu%2C%20I%20visited%20dipueditx.in%20and%20want%20to%20order%20video%20editing%20services!"
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Chat on WhatsApp"
        className="relative w-14 h-14 rounded-full bg-emerald-500 hover:bg-emerald-400 text-white flex items-center justify-center shadow-2xl shadow-emerald-500/50 hover:scale-110 transition-transform"
      >
        <span className="absolute w-full h-full rounded-full bg-emerald-400 animate-ping opacity-30" />
        <MessageCircle className="w-7 h-7 fill-white" />
      </a>
    </div>
  );
};

export default WhatsAppFloat;

