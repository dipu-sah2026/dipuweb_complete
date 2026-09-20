import React from 'react';
import Hero from '../components/Hero';
import CountdownTimer from '../components/CountdownTimer';
import CategoryShowcase from '../components/CategoryShowcase';
import BeforeAfterSlider from '../components/BeforeAfterSlider';
import ServicesGrid from '../components/ServicesGrid';
import PricingCalculator from '../components/PricingCalculator';
import PortfolioGrid from '../components/PortfolioGrid';
import WhyChooseUs from '../components/WhyChooseUs';
import WorkflowProcess from '../components/WorkflowProcess';
import ReviewsSection from '../components/ReviewsSection';
import FAQSection from '../components/FAQSection';
import SocialProofToast from '../components/SocialProofToast';

const Home = () => {
  return (
    <div>
      <CountdownTimer />
      <Hero />
      <CategoryShowcase />
      <BeforeAfterSlider />
      <ServicesGrid showAll={false} />
      <PricingCalculator />
      <PortfolioGrid limit={6} />
      <WhyChooseUs />
      <WorkflowProcess />
      <ReviewsSection />
      <FAQSection />
      <SocialProofToast />
    </div>
  );
};

export default Home;

