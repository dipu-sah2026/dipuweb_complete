import React, { useState, useEffect } from 'react';
import { MessageCircle } from 'lucide-react';
import api from '../services/api';

const WhatsAppFloat = () => {
  const [phone, setPhone] = useState('7481968724');

  useEffect(() => {
    const fetchPhone = async () => {
      try {
        const res = await api.get('/settings');
        if (res.data?.data?.whatsappNumber) {
          setPhone(res.data.data.whatsappNumber.replace(/\D/g, ''));
        }
      } catch (err) {
        // Fallback to default
      }
    };
    fetchPhone();
  }, []);

  const cleanNumber = phone.startsWith('91') ? phone : `91${phone}`;

  return (
    <div className="fixed bottom-6 right-6 z-40 flex items-center pointer-events-none group">
      {/* Tooltip on hover (pointer-events-none so it never captures clicks or mouse hovers) */}
      <div className="hidden md:block opacity-0 group-hover:opacity-100 transition-all duration-200 pointer-events-none bg-slate-900/95 text-white text-xs font-bold py-1.5 px-3 rounded-xl border border-brand-border shadow-2xl mr-3 whitespace-nowrap">
        Chat on WhatsApp ({phone})
      </div>

      <a
        href={`https://wa.me/${cleanNumber}?text=Hello%20Dipu%2C%20I%20visited%20dipueditx.in%20and%20want%20to%20order%20video%20editing%20services!`}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Chat on WhatsApp"
        className="pointer-events-auto relative w-14 h-14 rounded-full bg-emerald-500 hover:bg-emerald-400 text-white flex items-center justify-center shadow-2xl shadow-emerald-500/50 hover:scale-110 transition-transform shrink-0"
      >
        <span className="absolute w-full h-full rounded-full bg-emerald-400 animate-ping opacity-30" />
        <MessageCircle className="w-7 h-7 fill-white" />
      </a>
    </div>
  );
};

export default WhatsAppFloat;

