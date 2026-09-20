import React from 'react';
import ServicesGrid from '../components/ServicesGrid';
import WhyChooseUs from '../components/WhyChooseUs';
import FAQSection from '../components/FAQSection';
import { Sparkles } from 'lucide-react';

const ServicesPage = () => {
  return (
    <div className="pt-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center pt-8 pb-4">
        <div className="inline-flex items-center gap-2 bg-yellow-500/10 text-brand-yellow px-4 py-1 rounded-full text-xs font-black uppercase tracking-wider mb-2">
          <Sparkles className="w-4 h-4" />
          <span>Affordable & High Quality Video Editing</span>
        </div>
        <h1 className="text-4xl sm:text-5xl font-black text-white">
          All Services & <span className="text-brand-yellow">Transparent Pricing</span>
        </h1>
        <p className="text-slate-400 text-sm sm:text-base max-w-2xl mx-auto mt-2">
          Basic video editing aur photorealistic AI videos starting at just ₹100. Choose your required service below to get started immediately.
        </p>
      </div>

      <ServicesGrid showAll={true} />
      <WhyChooseUs />
      <FAQSection />
    </div>
  );
};

export default ServicesPage;

