import React from 'react';
import { Link } from 'react-router-dom';
import { Wheat, Sprout, Flame, Recycle, ArrowRight } from 'lucide-react';

const FEATURES = [
  {
    id: 'crop_residue',
    title: 'Crop Residue Collection',
    title_hi: 'फसल अवशेष और पराली संग्रह',
    icon: Wheat,
    color: 'text-amber-600',
    bgColor: 'bg-amber-50',
    borderColor: 'border-amber-200',
    description: 'Direct farm-gate baling of paddy straw, wheat stubble, and mustard stalks for biomass industries, eliminating burning completely.',
    benefits: ['Zero burning penalty', 'Up to ₹280/quintal income', 'Preserves soil microbiome']
  },
  {
    id: 'organic_waste',
    title: 'Organic Waste to Compost',
    title_hi: 'जैविक अपशिष्ट से समृद्ध खाद',
    icon: Sprout,
    color: 'text-emerald-600',
    bgColor: 'bg-emerald-50',
    borderColor: 'border-emerald-200',
    description: 'Transform rotten produce, horticulture trimmings, and crop leaves into black gold vermicompost and liquid bio-fertilizer.',
    benefits: ['Reduces chemical urea need', 'Enriches soil organic carbon', 'Supplies local compost plants']
  },
  {
    id: 'biomass_energy',
    title: 'Biomass & Waste-to-Energy',
    title_hi: 'बायोमास और अपशिष्ट से ऊर्जा',
    icon: Flame,
    color: 'text-orange-600',
    bgColor: 'bg-orange-50',
    borderColor: 'border-orange-200',
    description: 'Densified briquettes and pellets manufactured from agricultural husk and straw provide clean thermal power plant fuel.',
    benefits: ['Displaces fossil coal', 'Continuous factory demand', 'Fixed seasonal contract rates']
  },
  {
    id: 'plastic_recycling',
    title: 'Agricultural Plastic Recycling',
    title_hi: 'कृषि प्लास्टिक पुनर्चक्रण',
    icon: Recycle,
    color: 'text-teal-600',
    bgColor: 'bg-teal-50',
    borderColor: 'border-teal-200',
    description: 'Authorized CPCB recycling channel for drip irrigation lines, black mulch film, nursery bags, and chemical containers.',
    benefits: ['₹18 - ₹26 per kg scrap value', 'Prevents groundwater toxic leaks', 'Recycled into drainage pipes']
  }
];

export const FeatureCards = () => {
  return (
    <section className="py-16 sm:py-24 bg-[#F4F9F5]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-xs font-extrabold text-[#1E4D2B] uppercase tracking-wider bg-green-100 px-3 py-1 rounded-full">
            Sustainable Solutions
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 mt-3 tracking-tight">
            Four Core Pillars of Farm Waste Transformation
          </h2>
          <p className="text-base text-gray-600 mt-3">
            Every type of agricultural byproduct has a specialized recycling and monetization pathway on Kisan Connect.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {FEATURES.map((item) => {
            const Icon = item.icon;
            return (
              <div key={item.id} className="feature-card">
                <div className={`w-12 h-12 rounded-xl ${item.bgColor} ${item.color} flex items-center justify-center mb-5`}>
                  <Icon size={26} />
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">
                  {item.title}
                </h3>
                <p className="text-xs text-gray-600 leading-relaxed mb-4 flex-1">
                  {item.description}
                </p>

                <div className="space-y-1.5 pt-3 border-t border-gray-100 mb-5">
                  {item.benefits.map((b, idx) => (
                    <div key={idx} className="flex items-center gap-1.5 text-[11px] text-gray-700 font-medium">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#1E4D2B]"></span>
                      <span>{b}</span>
                    </div>
                  ))}
                </div>

                <Link
                  to="/recycling-education"
                  className="inline-flex items-center gap-1 text-xs font-bold text-[#1E4D2B] hover:text-[#2D6A4F] mt-auto"
                >
                  Explore Guide & Process <ArrowRight size={13} />
                </Link>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default FeatureCards;
