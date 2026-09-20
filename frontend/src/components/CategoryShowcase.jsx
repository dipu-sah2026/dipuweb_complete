import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Laptop, 
  Stethoscope, 
  GraduationCap, 
  Building2, 
  Smartphone, 
  ArrowRight,
  Sparkles
} from 'lucide-react';

const categories = [
  {
    title: 'Website / App',
    subtitle: 'SaaS & Mobile Demos',
    icon: Laptop,
    gradient: 'from-blue-600/30 via-blue-900/10 to-transparent',
    border: 'border-blue-500/40',
    iconColor: 'text-blue-400',
    desc: 'Showcase your mobile app UI, website features, and software walkthroughs with smooth 3D zooms and kinetic mockups.',
    price: 'From ₹100',
  },
  {
    title: 'Doctor / Hospital',
    subtitle: 'Medical Awareness & Clinics',
    icon: Stethoscope,
    gradient: 'from-teal-600/30 via-teal-900/10 to-transparent',
    border: 'border-teal-500/40',
    iconColor: 'text-teal-400',
    desc: 'Kidney stones, dental care, cardiology & health guidance explained through 3D medical anatomy visuals and doctor voiceovers.',
    price: 'From ₹199',
  },
  {
    title: 'School / College',
    subtitle: 'Admissions & Campus Tours',
    icon: GraduationCap,
    gradient: 'from-amber-600/30 via-amber-900/10 to-transparent',
    border: 'border-amber-500/40',
    iconColor: 'text-amber-400',
    desc: 'Boost student admissions with high-energy campus tours, topper results, and educational social reels.',
    price: 'From ₹199',
  },
  {
    title: 'Business / Brand',
    subtitle: 'High-Converting Video Ads',
    icon: Building2,
    gradient: 'from-purple-600/30 via-purple-900/10 to-transparent',
    border: 'border-purple-500/40',
    iconColor: 'text-purple-400',
    desc: 'Product promo reels, eCommerce sales hooks, and corporate branding videos designed to convert viewers into paying customers.',
    price: 'From ₹249',
  },
  {
    title: 'YouTube Shorts & Reels',
    subtitle: 'Viral 9:16 Retention Edits',
    icon: Smartphone,
    gradient: 'from-red-600/30 via-red-900/10 to-transparent',
    border: 'border-red-500/40',
    iconColor: 'text-red-400',
    desc: 'Alex Hormozi style animated captions, sound effects, emojis, and visual memes ensuring high retention.',
    price: 'From ₹100',
  },
];

const CategoryShowcase = () => {
  return (
    <section className="py-16 bg-slate-950/60 border-y border-brand-border/40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-1.5 text-xs uppercase tracking-widest text-brand-yellow font-extrabold mb-2">
            <Sparkles className="w-4 h-4" />
            <span>Target Industries</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-black text-white">
            Kiske Liye Videos Banate Hain?
          </h2>
          <p className="text-slate-400 text-sm sm:text-base mt-2">
            Har industry ke liye custom tailored AI scripts, visuals, aur retention editing
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          {categories.map((cat, idx) => {
            const Icon = cat.icon;
            return (
              <div
                key={idx}
                className={`relative rounded-2xl bg-gradient-to-b ${cat.gradient} bg-brand-card p-5 border ${cat.border} hover:scale-[1.03] transition-all flex flex-col justify-between group shadow-lg`}
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className={`w-11 h-11 rounded-xl bg-slate-900/80 border border-slate-700/60 flex items-center justify-center ${cat.iconColor}`}>
                      <Icon className="w-6 h-6" />
                    </div>
                    <span className="text-xs font-black text-brand-yellow bg-brand-cardLight/80 border border-brand-yellow/30 px-2 py-0.5 rounded-full">
                      {cat.price}
                    </span>
                  </div>

                  <h3 className="text-lg font-black text-white group-hover:text-brand-yellow transition-colors">
                    {cat.title}
                  </h3>
                  <p className="text-xs font-semibold text-slate-400 mb-2">
                    {cat.subtitle}
                  </p>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    {cat.desc}
                  </p>
                </div>

                <div className="pt-5 mt-4 border-t border-slate-800/80">
                  <Link
                    to="/order"
                    className="inline-flex items-center gap-1 text-xs font-bold text-white group-hover:text-brand-yellow transition-colors"
                  >
                    <span>Order for {cat.title}</span>
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};

export default CategoryShowcase;

