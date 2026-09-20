import React, { useState, useEffect } from 'react';
import { Clock, Flame } from 'lucide-react';
import { Link } from 'react-router-dom';

const CountdownTimer = () => {
  const [timeLeft, setTimeLeft] = useState({
    hours: 23,
    minutes: 42,
    seconds: 15,
  });

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev.seconds > 0) return { ...prev, seconds: prev.seconds - 1 };
        if (prev.minutes > 0) return { ...prev, minutes: 59, seconds: 59 };
        if (prev.hours > 0) return { ...prev, hours: prev.hours - 1, minutes: 59, seconds: 59 };
        return { hours: 24, minutes: 0, seconds: 0 };
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="bg-gradient-to-r from-red-950/70 via-slate-900 to-red-950/70 border-y border-red-500/30 py-3 px-4">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left">
        <div className="flex items-center gap-2">
          <Flame className="w-5 h-5 text-red-500 animate-bounce" />
          <span className="text-xs sm:text-sm font-black text-white">
            Special Launch Discount: Only ₹100 per video! Offer ends in:
          </span>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1 font-mono font-black text-xs text-white">
            <span className="bg-slate-900 border border-red-500/40 px-2 py-1 rounded text-brand-yellow">
              {String(timeLeft.hours).padStart(2, '0')}h
            </span>
            <span>:</span>
            <span className="bg-slate-900 border border-red-500/40 px-2 py-1 rounded text-brand-yellow">
              {String(timeLeft.minutes).padStart(2, '0')}m
            </span>
            <span>:</span>
            <span className="bg-slate-900 border border-red-500/40 px-2 py-1 rounded text-brand-yellow">
              {String(timeLeft.seconds).padStart(2, '0')}s
            </span>
          </div>

          <Link
            to="/order"
            className="bg-brand-yellow hover:bg-brand-yellowHover text-black text-xs font-black px-3.5 py-1.5 rounded-lg transition-transform hover:scale-105"
          >
            Claim Offer →
          </Link>
        </div>
      </div>
    </div>
  );
};

export default CountdownTimer;
