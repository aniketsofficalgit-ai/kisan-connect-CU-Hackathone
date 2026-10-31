import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Leaf, Flame, Recycle, Sprout } from 'lucide-react';

const PILLARS = [
  {
    id: 'crop-residue',
    title: 'Crop Residue & Stubble',
    subtitle: 'From smoke in the sky to clean fuel and mushroom substrate',
    image: 'https://images.unsplash.com/photo-1500595046743-cd271d694d30?auto=format&fit=crop&w=800&q=80',
    outcome: 'Biomass Briquettes & Compost',
    rate: '?220 - ?280 / qtl',
    description: 'Paddy straw and wheat stubble are collected by automated balers, compressed into densified fuel pellets for thermal boilers or decomposed into rich soil humus using PUSA microbial sprays.'
  },
  {
    id: 'organic-waste',
    title: 'Organic Farm Waste',
    subtitle: 'Discarded fruit, vegetables and horticulture cuttings',
    image: 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&w=800&q=80',
    outcome: 'Vermicompost & Bio-fertilizer',
    rate: '?140 - ?180 / qtl',
    description: 'Decomposed crop remains and horticulture waste are processed through vermiculture pits to generate black gold organic fertilizer, cutting urea fertilizer expenditure by up to 35%.'
  },
  {
    id: 'biomass',
    title: 'Biomass & Husk Valorization',
    subtitle: 'Rice husk, mustard stalk and sugarcane trash',
    image: 'https://images.unsplash.com/photo-1589923188900-85dae523342b?auto=format&fit=crop&w=800&q=80',
    outcome: 'Clean Renewable Electricity',
    rate: 'Long-term Power Contracts',
    description: 'Agricultural husks possess calorific values above 3,400 kcal/kg, enabling biomass power plants to generate green electricity while displacing fossil coal.'
  },
  {
    id: 'plastic',
    title: 'Agricultural Plastic Recycling',
    subtitle: 'Drip lines, mulching film, seed & fertilizer sacks',
    image: 'https://images.unsplash.com/photo-1605600659873-d808a13e4d2a?auto=format&fit=crop&w=800&q=80',
    outcome: 'CPCB Polymer Re-extrusion',
    rate: '?18 - ?26 / kg',
    description: 'Discarded HDPE lateral tubes and polyethylene films are gathered and cleaned at authorized recycling centers, preventing poisonous open combustion and soil microplastic buildup.'
  }
];

export const WastePillars = () => {
  return (
    <section className="py-20 bg-[#F7F9F4] border-b border-[#DDE7DC]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="max-w-3xl mb-14">
          <span className="text-xs font-extrabold text-[#4F9D69] uppercase tracking-wider block mb-2">
            Valorization Pathways
          </span>
          <h2 className="text-3xl sm:text-5xl font-extrabold text-[#2F7D4A] tracking-tight">
            What Happens to Farm Waste?
          </h2>
          <p className="text-base sm:text-lg text-[#566359] mt-3 leading-relaxed">
            Every byproduct leaving your farm has a certified industrial recycling route. Here is how agricultural residues transform into clean energy, organic soil nutrients, and new products.
          </p>
        </div>

        {/* 4 Large Visual Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {PILLARS.map((item) => (
            <div
              key={item.id}
              className="group relative rounded-3xl overflow-hidden border border-[#DDE7DC] bg-white shadow-xs hover:shadow-xl transition-all duration-300 flex flex-col justify-between"
            >
              {/* Image with subtle hover zoom */}
              <div className="relative h-64 sm:h-72 w-full overflow-hidden bg-gray-100">
                <img
                  src={item.image}
                  alt={item.title}
                  className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent"></div>

                <div className="absolute top-4 left-4">
                  <span className="px-3 py-1 rounded-full bg-white/90 backdrop-blur-md text-[#2F7D4A] font-bold text-xs shadow-xs">
                    {item.outcome}
                  </span>
                </div>

                <div className="absolute bottom-4 left-4 right-4 text-white">
                  <span className="text-xs font-semibold text-[#E8B94F] block">Typical Farm Value: {item.rate}</span>
                  <h3 className="text-xl sm:text-2xl font-extrabold mt-0.5">{item.title}</h3>
                </div>
              </div>

              {/* Card Body */}
              <div className="p-6 space-y-3">
                <p className="text-xs font-bold text-[#4F9D69] uppercase tracking-wider">{item.subtitle}</p>
                <p className="text-xs sm:text-sm text-[#566359] leading-relaxed">
                  {item.description}
                </p>

                <div className="pt-3 border-t border-[#DDE7DC] flex items-center justify-between">
                  <Link
                    to="/recycling-education"
                    className="text-xs font-bold text-[#2F7D4A] hover:text-[#4F9D69] inline-flex items-center gap-1.5 transition-colors"
                  >
                    View Practical Recycling Guide <ArrowRight size={14} />
                  </Link>

                  <Link
                    to="/find-partners"
                    className="text-xs font-bold text-[#4F9D69] hover:underline"
                  >
                    Find Buyers &rarr;
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default WastePillars;
