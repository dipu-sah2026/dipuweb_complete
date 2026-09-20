import React from 'react';
import PortfolioGrid from '../components/PortfolioGrid';
import { Film } from 'lucide-react';

const PortfolioPage = () => {
  return (
    <div className="pt-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center pt-8 pb-4">
        <div className="inline-flex items-center gap-2 bg-yellow-500/10 text-brand-yellow px-4 py-1 rounded-full text-xs font-black uppercase tracking-wider mb-2">
          <Film className="w-4 h-4" />
          <span>Dipu Sah Portfolio</span>
        </div>
        <h1 className="text-4xl sm:text-5xl font-black text-white">
          Creative <span className="text-brand-yellow">Video Showcase</span>
        </h1>
        <p className="text-slate-400 text-sm sm:text-base max-w-2xl mx-auto mt-2">
          Doctor explanation reels, school promotions, realistic AI sci-fi, and high-retention YouTube shorts. Click on any video to play.
        </p>
      </div>

      <PortfolioGrid limit={null} />
    </div>
  );
};

export default PortfolioPage;

