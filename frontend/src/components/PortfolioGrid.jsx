import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Play, 
  X, 
  ExternalLink, 
  Sparkles, 
  Smartphone, 
  Film, 
  Tag, 
  Zap, 
  Check 
} from 'lucide-react';
import api, { DEFAULT_PORTFOLIO } from '../services/api';

const categories = [
  'All',
  'Doctor / Hospital',
  'School / Education',
  'AI Realistic',
  'YouTube Shorts / Reels',
  'Travel & Lifestyle'
];

const PortfolioGrid = ({ limit }) => {
  const [portfolio, setPortfolio] = useState(DEFAULT_PORTFOLIO);
  const [activeCategory, setActiveCategory] = useState('All');
  const [selectedVideo, setSelectedVideo] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPortfolio = async () => {
      try {
        const res = await api.get('/portfolio');
        if (res.data?.data && res.data.data.length > 0) {
          setPortfolio(res.data.data);
        }
      } catch (err) {
        console.log('Using default portfolio data');
      }
    };
    fetchPortfolio();
  }, []);

  const filteredItems = activeCategory === 'All'
    ? portfolio
    : portfolio.filter((item) => item.category === activeCategory);

  const displayItems = limit ? filteredItems.slice(0, limit) : filteredItems;

  return (
    <section className="py-20 bg-slate-950/80 border-t border-brand-border/40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 text-brand-yellow font-black text-xs uppercase tracking-widest bg-yellow-500/10 border border-yellow-500/20 px-3.5 py-1 rounded-full mb-3">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Creative Video for Better Tomorrow</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-black text-white">
            Recent <span className="text-brand-yellow">Project Showcase</span>
          </h2>
          <p className="text-slate-400 text-sm sm:text-base mt-2">
            AI Magic & High Retention Editing Samples created by Dipu Sah
          </p>
        </div>

        {/* Category Filters */}
        <div className="flex flex-wrap items-center justify-center gap-2 mb-12">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all ${
                activeCategory === cat
                  ? 'bg-brand-yellow text-black shadow-lg shadow-yellow-500/20 scale-105'
                  : 'bg-brand-card hover:bg-brand-cardLight text-slate-300 border border-brand-border'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Portfolio Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {displayItems.map((item) => (
            <div
              key={item._id}
              onClick={() => setSelectedVideo(item)}
              className="group relative bg-brand-card border border-brand-border rounded-2xl overflow-hidden hover:border-brand-yellow/60 transition-all cursor-pointer shadow-lg hover:-translate-y-1.5"
            >
              {/* Thumbnail Container */}
              <div className="relative aspect-[9/12] sm:aspect-[9/13] overflow-hidden bg-slate-900">
                <img
                  src={item.thumbnailUrl || 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&q=80'}
                  alt={item.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-90 group-hover:opacity-100"
                />

                {/* Dark Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />

                {/* Top Badges */}
                <div className="absolute top-3 left-3 right-3 flex items-center justify-between">
                  <span className="bg-black/70 backdrop-blur-md text-brand-yellow border border-yellow-500/30 text-[11px] font-bold px-2.5 py-1 rounded-lg flex items-center gap-1">
                    <Tag className="w-3 h-3" />
                    {item.category}
                  </span>
                  <span className="bg-red-600/90 text-white font-extrabold text-[10px] px-2 py-0.5 rounded uppercase tracking-wider flex items-center gap-1">
                    <Smartphone className="w-3 h-3" />
                    {item.aspectRatio || '9:16'}
                  </span>
                </div>

                {/* Center Play Button with Neon Glow */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-16 h-16 rounded-full bg-brand-yellow/90 text-black flex items-center justify-center shadow-xl shadow-yellow-500/40 group-hover:scale-110 group-hover:bg-brand-yellow transition-all">
                    <Play className="w-8 h-8 fill-black ml-1" />
                  </div>
                </div>

                {/* Bottom Title & Tools */}
                <div className="absolute bottom-4 left-4 right-4 space-y-2">
                  <h3 className="text-base sm:text-lg font-black text-white leading-snug group-hover:text-brand-yellow transition-colors">
                    {item.title}
                  </h3>
                  
                  {item.toolsUsed && (
                    <div className="flex flex-wrap gap-1.5">
                      {item.toolsUsed.map((tool, tIdx) => (
                        <span
                          key={tIdx}
                          className="text-[10px] font-semibold bg-white/10 backdrop-blur-md text-slate-200 px-2 py-0.5 rounded"
                        >
                          {tool}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>

      {/* Video Modal Popup Player */}
      {selectedVideo && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-4">
          <div className="relative w-full max-w-3xl bg-brand-card border border-brand-border rounded-3xl overflow-hidden shadow-2xl animate-in fade-in zoom-in-95 duration-200">
            
            {/* Modal Header */}
            <div className="flex items-center justify-between p-4 sm:p-5 border-b border-brand-border bg-slate-900/80">
              <div>
                <span className="text-xs font-bold text-brand-yellow uppercase tracking-wider">
                  {selectedVideo.category}
                </span>
                <h3 className="text-lg sm:text-xl font-black text-white">
                  {selectedVideo.title}
                </h3>
              </div>
              <button
                onClick={() => setSelectedVideo(null)}
                className="w-9 h-9 rounded-full bg-slate-800 text-slate-300 hover:text-white hover:bg-slate-700 flex items-center justify-center transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Video Player Embed */}
            <div className="relative aspect-video bg-black flex items-center justify-center">
              {selectedVideo.videoUrl.includes('youtube') || selectedVideo.videoUrl.includes('youtu.be') ? (
                <iframe
                  src={`${selectedVideo.videoUrl}?autoplay=1`}
                  title={selectedVideo.title}
                  className="w-full h-full"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              ) : (
                <video
                  src={selectedVideo.videoUrl}
                  controls
                  autoPlay
                  className="w-full h-full object-contain"
                />
              )}
            </div>

            {/* Modal Footer & Order CTA */}
            <div className="p-5 bg-brand-dark flex flex-col sm:flex-row items-center justify-between gap-4">
              <div>
                <p className="text-xs text-slate-400 max-w-md">
                  {selectedVideo.description || 'Professional AI video crafted with high-impact visuals, clear audio, and retention-focused transitions.'}
                </p>
                <div className="flex gap-2 mt-2">
                  <span className="text-[11px] font-bold text-brand-yellow bg-yellow-500/10 px-2 py-0.5 rounded">
                    Delivery in 24h
                  </span>
                  <span className="text-[11px] font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded">
                    Price: ₹100
                  </span>
                </div>
              </div>

              <button
                onClick={() => {
                  setSelectedVideo(null);
                  navigate('/order', {
                    state: {
                      preselectedService: {
                        title: `Custom Video: ${selectedVideo.title}`,
                        basePrice: 100,
                        category: selectedVideo.category,
                      },
                    },
                  });
                }}
                className="w-full sm:w-auto bg-brand-yellow hover:bg-brand-yellowHover text-black font-black text-sm px-6 py-3 rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-yellow-500/20 transition-all"
              >
                <Zap className="w-4 h-4 fill-black" />
                <span>Order Similar Video (₹100)</span>
              </button>
            </div>

          </div>
        </div>
      )}
    </section>
  );
};

export default PortfolioGrid;

