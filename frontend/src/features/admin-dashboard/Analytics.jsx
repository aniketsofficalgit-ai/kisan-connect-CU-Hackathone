import React from 'react';
import {
  Wind, TreePine, Coins, ShieldAlert, BarChart3, TrendingUp,
  Award, CheckCircle2, Leaf
} from 'lucide-react';

export const Analytics = ({ metrics }) => {
  return (
    <div className="space-y-6">
      <div className="bg-white rounded-3xl border border-[#EAF3E8] shadow-sm p-6 sm:p-8 space-y-6">
        <div className="pb-4 border-b border-[#EAF3E8]">
          <h3 className="font-heading font-black text-lg text-[#26372C] flex items-center gap-2">
            <BarChart3 size={20} className="text-[#2F7D4A]" /> Environmental & Economic Verification
          </h3>
          <p className="text-xs text-gray-500 mt-0.5 font-sans">
            Transparent ecological calculations based on verified completed collection runs
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 rounded-3xl bg-[#F7F9F4] border border-[#EAF3E8]">
            <div className="w-10 h-10 rounded-2xl bg-[#2F7D4A] text-[#E8B94F] flex items-center justify-center mb-3">
              <Wind size={20} />
            </div>
            <span className="text-[11px] font-heading font-bold text-gray-500 uppercase tracking-wider block">
              Net CO₂ Averted
            </span>
            <p className="text-3xl font-heading font-black text-[#2F7D4A] mt-1">
              {metrics?.co2_saved_tonnes || 0} Tonnes
            </p>
            <p className="text-xs text-gray-600 mt-2 leading-relaxed font-sans">
              Calculated using standard IPCC agricultural residue coefficient (1.5t CO₂ avoided per tonne of collected straw).
            </p>
          </div>

          <div className="p-6 rounded-3xl bg-[#F7F9F4] border border-[#EAF3E8]">
            <div className="w-10 h-10 rounded-2xl bg-[#4F9D69] text-white flex items-center justify-center mb-3">
              <ShieldAlert size={20} />
            </div>
            <span className="text-[11px] font-heading font-bold text-gray-500 uppercase tracking-wider block">
              Stubble Land Cleared
            </span>
            <p className="text-3xl font-heading font-black text-[#26372C] mt-1">
              {metrics?.stubble_acres_saved || 0} Acres
            </p>
            <p className="text-xs text-gray-600 mt-2 leading-relaxed font-sans">
              Safely recovered without open burning, eliminating PM2.5 and PM10 spike hazards in neighboring rural districts.
            </p>
          </div>

          <div className="p-6 rounded-3xl bg-[#F7F9F4] border border-[#EAF3E8]">
            <div className="w-10 h-10 rounded-2xl bg-[#E8B94F] text-[#26372C] flex items-center justify-center mb-3">
              <Coins size={20} />
            </div>
            <span className="text-[11px] font-heading font-bold text-gray-500 uppercase tracking-wider block">
              Farmer Income Generated
            </span>
            <p className="text-3xl font-heading font-black text-[#2F7D4A] mt-1">
              ₹{metrics?.total_farmer_payout?.toLocaleString('en-IN') || 0}
            </p>
            <p className="text-xs text-gray-600 mt-2 leading-relaxed font-sans">
              Direct compensation paid to agricultural producers by recycling mills and biomass power units.
            </p>
          </div>
        </div>

        {/* Breakdown Table */}
        <div className="pt-4 border-t border-[#EAF3E8]">
          <h4 className="text-xs font-heading font-bold text-[#26372C] uppercase tracking-wider mb-3">
            Valorization Stream Performance
          </h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-sans">
            <div className="p-5 rounded-2xl border border-[#EAF3E8] bg-[#FAFBF9] space-y-1">
              <span className="font-heading font-bold text-[#26372C] block text-sm">Biomass & Stubble Briquetting</span>
              <p className="text-gray-600 leading-relaxed">
                Primary sink for paddy straw & wheat husk. Displaces coal fuel in industrial boilers with 80% lower net carbon emissions.
              </p>
            </div>
            <div className="p-5 rounded-2xl border border-[#EAF3E8] bg-[#FAFBF9] space-y-1">
              <span className="font-heading font-bold text-[#26372C] block text-sm">Mechanical Plastic Upcycling</span>
              <p className="text-gray-600 leading-relaxed">
                Agricultural drip lines & nursery mulch films re-pelletized and extruded into non-pressure agricultural conduit.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Analytics;
