import React, { useState, useEffect } from 'react';
import { Sparkles, X, CheckCircle } from 'lucide-react';

const mockSales = [
  { name: 'Dr. Vivek Sharma', location: 'Jaipur', service: 'Doctor AI Explainer Reel', time: '3 mins ago' },
  { name: 'Aman Verma', location: 'Delhi', service: 'YouTube Shorts 9:16 Edit', time: '7 mins ago' },
  { name: 'Pooja Kapoor', location: 'Mumbai', service: 'eCommerce Product Video Ad', time: '12 mins ago' },
  { name: 'Rahul Joshi', location: 'Bengaluru', service: 'AI Voiceover + Shorts', time: '18 mins ago' },
  { name: 'Kavita Singh', location: 'Patna', service: 'School Admission Promo', time: '25 mins ago' },
];

const SocialProofToast = () => {
  const [currentSale, setCurrentSale] = useState(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    // Show first toast after 4 seconds
    const initialTimer = setTimeout(() => {
      triggerToast();
    }, 4000);

    const interval = setInterval(() => {
      triggerToast();
    }, 18000); // Every 18 seconds

    return () => {
      clearTimeout(initialTimer);
      clearInterval(interval);
    };
  }, []);

  const triggerToast = () => {
    const randomItem = mockSales[Math.floor(Math.random() * mockSales.length)];
    setCurrentSale(randomItem);
    setVisible(true);

    // Hide after 5 seconds
    setTimeout(() => {
      setVisible(false);
    }, 5500);
  };

  if (!visible || !currentSale) return null;

  return (
    <div className="fixed bottom-6 left-6 z-40 max-w-xs sm:max-w-sm bg-slate-900/95 border border-brand-yellow/40 rounded-2xl p-3.5 shadow-2xl backdrop-blur-md animate-in fade-in slide-in-from-bottom-5 duration-300">
      <div className="flex items-start gap-3">
        <div className="w-8 h-8 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0 mt-0.5">
          <CheckCircle className="w-4 h-4" />
        </div>

        <div className="flex-1 pr-2">
          <p className="text-xs text-white font-bold">
            {currentSale.name} <span className="text-[11px] font-normal text-slate-400">({currentSale.location})</span>
          </p>
          <p className="text-[11px] text-brand-yellow font-semibold truncate">
            Booked: {currentSale.service}
          </p>
          <span className="text-[10px] text-slate-500 block mt-0.5">
            Verified order • {currentSale.time}
          </span>
        </div>

        <button
          onClick={() => setVisible(false)}
          className="text-slate-500 hover:text-white p-1"
          aria-label="Close notification"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};

export default SocialProofToast;

