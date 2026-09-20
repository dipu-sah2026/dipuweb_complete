import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Calculator, Zap, Check, ArrowRight } from 'lucide-react';

const PricingCalculator = () => {
  const [videoCount, setVideoCount] = useState(5);
  const [includeVoice, setIncludeVoice] = useState(false);
  const [includeThumbnail, setIncludeThumbnail] = useState(true);
  const [include4k, setInclude4k] = useState(false);
  const navigate = useNavigate();

  const basePricePerVideo = 100;
  const rawBase = videoCount * basePricePerVideo;

  // Add-ons
  const voiceTotal = includeVoice ? videoCount * 99 : 0;
  const thumbTotal = includeThumbnail ? videoCount * 49 : 0;
  const fourkTotal = include4k ? videoCount * 49 : 0;

  const grossTotal = rawBase + voiceTotal + thumbTotal + fourkTotal;

  // Volume discount: 5+ videos = 10%, 10+ videos = 20%
  let discountPercent = 0;
  if (videoCount >= 10) discountPercent = 20;
  else if (videoCount >= 5) discountPercent = 10;

  const discountAmount = Math.round((grossTotal * discountPercent) / 100);
  const finalPrice = grossTotal - discountAmount;

  const handleBookBundle = () => {
    navigate('/order', {
      state: {
        preselectedService: {
          title: `Custom Bundle (${videoCount} Videos)`,
          basePrice: basePricePerVideo,
          category: 'Bundle Pack',
        },
      },
    });
  };

  return (
    <section className="py-16 bg-brand-dark relative">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="bg-brand-card border-2 border-brand-yellow/30 rounded-3xl p-6 sm:p-10 shadow-2xl relative overflow-hidden">
          <div className="text-center max-w-2xl mx-auto mb-8">
            <span className="text-brand-yellow font-black text-xs uppercase tracking-widest bg-yellow-500/10 px-3.5 py-1 rounded-full border border-yellow-500/20">
              Interactive Tool
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-white mt-3">
              Bundle Pricing <span className="text-brand-yellow">Calculator</span>
            </h2>
            <p className="text-slate-400 text-xs sm:text-sm mt-1">
              Select your video volume and add-ons to see your instant bundle savings!
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
            
            {/* Sliders and Options (7 cols) */}
            <div className="md:col-span-7 space-y-5">
              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="text-xs font-bold text-slate-300">
                    Number of Videos to Edit:
                  </label>
                  <span className="text-xl font-black text-brand-yellow">
                    {videoCount} Videos
                  </span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="20"
                  value={videoCount}
                  onChange={(e) => setVideoCount(Number(e.target.value))}
                  className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-yellow-400"
                />
                <div className="flex justify-between text-[10px] text-slate-500 mt-1">
                  <span>1 Video (₹100)</span>
                  <span className="text-brand-yellow font-bold">5+ Videos (10% OFF)</span>
                  <span className="text-emerald-400 font-bold">10+ Videos (20% OFF)</span>
                </div>
              </div>

              {/* Addons checkboxes */}
              <div className="space-y-2 pt-2 border-t border-slate-800">
                <span className="text-xs font-bold text-slate-400 block mb-1">Select Custom Add-ons:</span>
                
                <div
                  onClick={() => setIncludeThumbnail(!includeThumbnail)}
                  className={`p-3 rounded-xl border flex items-center justify-between cursor-pointer transition-all ${
                    includeThumbnail ? 'bg-yellow-500/10 border-brand-yellow/60' : 'bg-slate-900 border-brand-border'
                  }`}
                >
                  <div className="flex items-center gap-2 text-xs font-bold text-slate-200">
                    <input type="checkbox" checked={includeThumbnail} onChange={() => {}} className="rounded text-brand-yellow" />
                    <span>Viral YouTube / Reel Thumbnails</span>
                  </div>
                  <span className="text-xs font-bold text-brand-yellow">+₹49 / vid</span>
                </div>

                <div
                  onClick={() => setIncludeVoice(!includeVoice)}
                  className={`p-3 rounded-xl border flex items-center justify-between cursor-pointer transition-all ${
                    includeVoice ? 'bg-yellow-500/10 border-brand-yellow/60' : 'bg-slate-900 border-brand-border'
                  }`}
                >
                  <div className="flex items-center gap-2 text-xs font-bold text-slate-200">
                    <input type="checkbox" checked={includeVoice} onChange={() => {}} className="rounded text-brand-yellow" />
                    <span>AI Realistic Studio Voiceover</span>
                  </div>
                  <span className="text-xs font-bold text-brand-yellow">+₹99 / vid</span>
                </div>

                <div
                  onClick={() => setInclude4k(!include4k)}
                  className={`p-3 rounded-xl border flex items-center justify-between cursor-pointer transition-all ${
                    include4k ? 'bg-yellow-500/10 border-brand-yellow/60' : 'bg-slate-900 border-brand-border'
                  }`}
                >
                  <div className="flex items-center gap-2 text-xs font-bold text-slate-200">
                    <input type="checkbox" checked={include4k} onChange={() => {}} className="rounded text-brand-yellow" />
                    <span>4K Ultra HD Export Quality</span>
                  </div>
                  <span className="text-xs font-bold text-brand-yellow">+₹49 / vid</span>
                </div>
              </div>
            </div>

            {/* Total Display (5 cols) */}
            <div className="md:col-span-5 bg-slate-900/90 border border-brand-border rounded-2xl p-6 text-center space-y-4">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">Estimated Price</span>
              
              <div>
                <span className="text-4xl font-black text-brand-yellow">₹{finalPrice}</span>
                {discountAmount > 0 && (
                  <p className="text-xs text-emerald-400 font-bold mt-1">
                    🎉 You Save ₹{discountAmount} ({discountPercent}% Volume Discount)
                  </p>
                )}
              </div>

              <div className="bg-slate-950 p-3 rounded-xl text-xs space-y-1 text-slate-400 text-left">
                <div className="flex justify-between">
                  <span>Base ({videoCount}x ₹100):</span>
                  <span className="text-white font-bold">₹{rawBase}</span>
                </div>
                <div className="flex justify-between">
                  <span>Add-ons:</span>
                  <span className="text-white font-bold">₹{voiceTotal + thumbTotal + fourkTotal}</span>
                </div>
              </div>

              <button
                onClick={handleBookBundle}
                className="w-full py-3.5 bg-brand-yellow hover:bg-brand-yellowHover text-black font-black text-sm rounded-xl flex items-center justify-center gap-2 shadow-xl shadow-yellow-500/20 transition-all"
              >
                <Zap className="w-4 h-4 fill-black" />
                <span>Book This Bundle (₹{finalPrice})</span>
              </button>
            </div>

          </div>
        </div>

      </div>
    </section>
  );
};

export default PricingCalculator;
