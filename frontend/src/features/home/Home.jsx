import React from 'react';
import Hero from './components/Hero';
import WhatWeDo from './components/WhatWeDo';
import WasteTypes from './components/WasteTypes';
import HowItWorks from './components/HowItWorks';
import MarketplacePreview from './components/MarketplacePreview';
import BenefitsSection from './components/BenefitsSection';
import ImpactSection from './components/ImpactSection';
import FeaturedPartners from './components/FeaturedPartners';
import JoinNetwork from './components/JoinNetwork';
import './Home.css';

export const Home = () => {
  return (
    <div className="flex flex-col min-h-screen bg-[#FAF9F3]">
      {/* 1. Hero Section + 2. Trust Indicators */}
      <Hero />

      {/* 3. What Kisan Connect Does */}
      <WhatWeDo />

      {/* 4. Types of Agricultural Waste */}
      <WasteTypes />

      {/* 5. How the Platform Works */}
      <HowItWorks />

      {/* 6. Recycling Opportunities */}
      <MarketplacePreview />

      {/* 7. Benefits for Farmers */}
      <BenefitsSection />

      {/* 8. Environmental Impact */}
      <ImpactSection />

      {/* 9. Recycling Partner Showcase */}
      <FeaturedPartners />

      {/* 10. Final Call-to-Action */}
      <JoinNetwork />
    </div>
  );
};

export default Home;
