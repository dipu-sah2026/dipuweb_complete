import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Sparkles, 
  Clapperboard, 
  Mic, 
  Image, 
  Palette, 
  Check, 
  ArrowRight, 
  Clock, 
  Zap,
  Flame,
  Stethoscope,
  GraduationCap,
  Building2
} from 'lucide-react';
import api, { DEFAULT_SERVICES } from '../services/api';

const iconMap = {
  Sparkles,
  Clapperboard,
  Mic,
  Image,
  Palette,
  Stethoscope,
  GraduationCap,
  Building2,
};

const ServicesGrid = ({ showAll = false }) => {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const res = await api.get('/services');
        if (res.data && Array.isArray(res.data.data)) {
          setServices(res.data.data);
        }
      } catch (err) {
        console.log('Services fetch error, using fallback');
        setServices(DEFAULT_SERVICES);
      } finally {
        setLoading(false);
      }
    };
    fetchServices();
  }, []);

  const displayServices = showAll ? services : services.slice(0, 6);

  const handleOrderService = (service) => {
    navigate('/order', { state: { preselectedService: service } });
  };

  if (loading) {
    return null;
  }

  if (services.length === 0 && !showAll) {
    return null;
  }

  if (services.length === 0 && showAll) {
    return (
      <div className="max-w-md mx-auto my-16 text-center p-8 bg-slate-900/60 rounded-3xl border border-dashed border-slate-800">
        <Sparkles className="w-12 h-12 text-slate-600 mx-auto mb-3" />
        <h3 className="text-lg font-bold text-white mb-1">No Services Available</h3>
        <p className="text-xs text-slate-400">Services created in the Admin Panel will appear here.</p>
      </div>
    );
  }

  return (
    <section className="py-20 bg-brand-dark relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <div className="inline-flex items-center gap-2 bg-yellow-500/10 border border-yellow-500/30 text-brand-yellow px-4 py-1 rounded-full text-xs font-black uppercase tracking-wider mb-3">
            <Flame className="w-4 h-4 text-brand-yellow" />
            <span>हम क्या-क्या बनाते हैं?</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
            Our Core <span className="text-brand-yellow">Editing & AI Services</span>
          </h2>
          <p className="text-slate-400 text-sm sm:text-base mt-3">
            Only ₹100 se shuru hone wali best-in-class video editing services. No hidden charges, express delivery.
          </p>
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {displayServices.map((srv) => {
            const IconComponent = iconMap[srv.iconName] || Clapperboard;
            return (
              <div
                key={srv._id || srv.slug}
                className={`relative rounded-3xl bg-brand-card border ${
                  srv.popular ? 'border-brand-yellow glow-yellow' : 'border-brand-border'
                } p-7 flex flex-col justify-between hover:border-brand-yellow/60 transition-all duration-300 group`}
              >
                {srv.popular && (
                  <div className="absolute -top-3.5 right-6 bg-brand-yellow text-black font-black text-[11px] uppercase tracking-wider px-3 py-1 rounded-full shadow-md flex items-center gap-1">
                    <Zap className="w-3 h-3 fill-black" />
                    <span>Most Popular</span>
                  </div>
                )}

                <div>
                  {/* Icon & Category */}
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 rounded-2xl bg-brand-cardLight border border-brand-border flex items-center justify-center text-brand-yellow group-hover:scale-110 transition-transform">
                      <IconComponent className="w-6 h-6" />
                    </div>
                    <span className="text-xs font-bold text-slate-400 bg-slate-900 px-3 py-1 rounded-full border border-slate-800">
                      {srv.category}
                    </span>
                  </div>

                  {/* Title & Description */}
                  <h3 className="text-xl font-black text-white mb-2 group-hover:text-brand-yellow transition-colors">
                    {srv.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-400 leading-relaxed mb-6">
                    {srv.description}
                  </p>

                  {/* Pricing Display */}
                  <div className="bg-brand-cardLight/80 border border-brand-border rounded-2xl p-4 mb-6">
                    <div className="flex items-baseline justify-between">
                      <div>
                        <span className="text-xs text-slate-400 font-semibold block">Starting At</span>
                        <span className="text-3xl font-black text-brand-yellow">₹{srv.basePrice}</span>
                        <span className="text-xs text-slate-400 font-medium ml-1">/ video</span>
                      </div>
                      <div className="text-right">
                        <span className="text-xs text-slate-400 font-semibold flex items-center gap-1">
                          <Clock className="w-3.5 h-3.5 text-cyan-400" />
                          {srv.deliveryTime}
                        </span>
                        <span className="text-[11px] text-emerald-400 font-bold">Fast Delivery</span>
                      </div>
                    </div>
                  </div>

                  {/* Features List */}
                  <ul className="space-y-2.5 mb-8">
                    {srv.features?.map((feat, fIdx) => (
                      <li key={fIdx} className="flex items-start gap-2.5 text-xs sm:text-sm text-slate-300">
                        <div className="w-4 h-4 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0 mt-0.5">
                          <Check className="w-3 h-3" />
                        </div>
                        <span>{feat}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Order Button */}
                <button
                  onClick={() => handleOrderService(srv)}
                  className={`w-full py-3.5 px-4 rounded-xl font-black text-sm flex items-center justify-center gap-2 transition-all ${
                    srv.popular
                      ? 'bg-brand-yellow hover:bg-brand-yellowHover text-black shadow-lg shadow-yellow-500/20'
                      : 'bg-brand-cardLight hover:bg-slate-800 text-white border border-brand-border'
                  }`}
                >
                  <span>Book This Service (₹{srv.basePrice})</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            );
          })}
        </div>

        {!showAll && (
          <div className="text-center mt-12">
            <Link
              to="/services"
              className="inline-flex items-center gap-2 bg-brand-cardLight hover:bg-slate-800 text-brand-yellow border border-brand-border px-6 py-3 rounded-xl font-bold text-sm transition-all"
            >
              <span>View All 8+ Video & Design Services</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        )}

      </div>
    </section>
  );
};

export default ServicesGrid;

