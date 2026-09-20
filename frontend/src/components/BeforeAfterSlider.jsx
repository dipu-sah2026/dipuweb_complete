import React, { useState } from 'react';
import { Sparkles, Sliders } from 'lucide-react';

const BeforeAfterSlider = () => {
  const [sliderPosition, setSliderPosition] = useState(50);

  const handleSliderChange = (e) => {
    setSliderPosition(e.target.value);
  };

  return (
    <section className="py-16 bg-slate-950/70 border-t border-brand-border/40">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="text-center max-w-2xl mx-auto mb-10">
          <span className="text-brand-yellow font-black text-xs uppercase tracking-widest bg-yellow-500/10 px-3.5 py-1 rounded-full border border-yellow-500/20">
            Visual Quality Comparison
          </span>
          <h2 className="text-3xl sm:text-4xl font-black text-white mt-3">
            Raw Footage vs <span className="text-brand-yellow">Dipu's Magic</span>
          </h2>
          <p className="text-slate-400 text-xs sm:text-sm mt-2">
            Drag the slider to see the difference between raw clip and our high-retention color graded reel!
          </p>
        </div>

        {/* Interactive Comparison Container */}
        <div className="relative max-w-3xl mx-auto aspect-[16/9] rounded-3xl overflow-hidden shadow-2xl border-2 border-brand-yellow/40 select-none">
          
          {/* AFTER Image (Full Edited) */}
          <img
            src="https://images.unsplash.com/photo-1579684385127-1ef15d508118?w=1200&q=85"
            alt="After Editing"
            className="absolute inset-0 w-full h-full object-cover filter contrast-125 saturate-150 brightness-110"
          />
          <div className="absolute top-4 right-4 bg-emerald-500/90 text-black text-xs font-black px-3 py-1 rounded-lg uppercase tracking-wider shadow">
            After: AI Magic & 4K Retouch
          </div>

          {/* BEFORE Image (Raw / Flat) - clipped by slider */}
          <div
            className="absolute inset-0 overflow-hidden"
            style={{ width: `${sliderPosition}%` }}
          >
            <img
              src="https://images.unsplash.com/photo-1579684385127-1ef15d508118?w=1200&q=85"
              alt="Before Editing"
              className="absolute inset-0 w-full h-full object-cover filter grayscale contrast-75 brightness-75 max-w-none"
              style={{ width: '100%', height: '100%' }}
            />
            <div className="absolute top-4 left-4 bg-slate-900/90 text-slate-300 text-xs font-black px-3 py-1 rounded-lg uppercase tracking-wider border border-slate-700">
              Before: Raw & Dull
            </div>
          </div>

          {/* Slider Divider Line */}
          <div
            className="absolute top-0 bottom-0 w-1 bg-brand-yellow shadow-[0_0_15px_rgba(250,204,21,0.8)]"
            style={{ left: `${sliderPosition}%` }}
          >
            <div className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-8 h-8 rounded-full bg-brand-yellow text-black flex items-center justify-center shadow-xl cursor-ew-resize">
              <Sliders className="w-4 h-4" />
            </div>
          </div>

          {/* Hidden Range Input */}
          <input
            type="range"
            min="0"
            max="100"
            value={sliderPosition}
            onChange={handleSliderChange}
            aria-label="Drag before after slider"
            className="absolute inset-0 w-full h-full opacity-0 cursor-ew-resize z-20"
          />
        </div>

        <div className="flex justify-center gap-6 mt-4 text-xs font-bold text-slate-400">
          <span>👈 Drag Left for Raw</span>
          <span>👉 Drag Right for AI Magic</span>
        </div>

      </div>
    </section>
  );
};

export default BeforeAfterSlider;
