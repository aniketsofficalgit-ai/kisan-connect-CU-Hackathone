import React from 'react';
import { ShieldCheck, Heart, Award, Users, Sprout, Leaf, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export const AboutUs = () => {
  return (
    <section id="about" className="py-20 bg-white border-b border-[#DDE7DC]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Section Header */}
        <div className="max-w-3xl">
          <span className="text-xs font-heading font-extrabold text-[#4F9D69] uppercase tracking-wider block mb-2">
            Mission & Identity
          </span>
          <h2 className="text-3xl sm:text-5xl font-heading font-extrabold text-[#2F7D4A] tracking-tight">
            About Kisan Connect
          </h2>
          <p className="text-base sm:text-lg text-[#536759] mt-3 font-sans leading-relaxed">
            Built by <strong>Team Clover Guardian</strong> to eradicate open stubble burning and transform India's 500+ million tonnes of annual agricultural residues into sustainable wealth.
          </p>
        </div>

        {/* 3 Value Pillars */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="p-8 rounded-3xl bg-[#F7F9F4] border border-[#DDE7DC] space-y-4 hover:border-[#4F9D69] transition-all">
            <div className="w-12 h-12 rounded-2xl bg-[#EAF3E8] text-[#2F7D4A] flex items-center justify-center">
              <Sprout size={24} />
            </div>
            <h3 className="font-heading font-bold text-xl text-[#26372C]">Our Vision</h3>
            <p className="text-xs sm:text-sm text-[#536759] leading-relaxed font-sans">
              A clean rural India where no farmer is forced to burn crop residues due to lack of machinery or market access. Every quintal of straw, manure, or agro-plastic finds a certified recycling buyer.
            </p>
          </div>

          <div className="p-8 rounded-3xl bg-[#F7F9F4] border border-[#DDE7DC] space-y-4 hover:border-[#4F9D69] transition-all">
            <div className="w-12 h-12 rounded-2xl bg-[#EAF3E8] text-[#2F7D4A] flex items-center justify-center">
              <ShieldCheck size={24} />
            </div>
            <h3 className="font-heading font-bold text-xl text-[#26372C]">Verified Ecosystem</h3>
            <p className="text-xs sm:text-sm text-[#536759] leading-relaxed font-sans">
              Zero fake availability. Every biomass power plant, pelleting facility, and plastic upcycler in our directory is physically verified with government registration and transparent procurement pricing.
            </p>
          </div>

          <div className="p-8 rounded-3xl bg-[#F7F9F4] border border-[#DDE7DC] space-y-4 hover:border-[#4F9D69] transition-all">
            <div className="w-12 h-12 rounded-2xl bg-[#EAF3E8] text-[#2F7D4A] flex items-center justify-center">
              <Users size={24} />
            </div>
            <h3 className="font-heading font-bold text-xl text-[#26372C]">Team Clover Guardian</h3>
            <p className="text-xs sm:text-sm text-[#536759] leading-relaxed font-sans">
              Engineered with dedication by <strong>Prakhar, Ayush, Raj, and Aniket Dubey</strong>. Designed with a human-first approach for actual Indian farmers with zero technical friction.
            </p>
          </div>
        </div>

        {/* Callout Strip */}
        <div className="p-6 sm:p-8 rounded-3xl bg-[#EAF3E8] border border-[#DDE7DC] flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-[#2F7D4A] text-white flex items-center justify-center shrink-0">
              <Award size={24} className="text-[#E8B94F]" />
            </div>
            <div>
              <h4 className="font-heading font-bold text-base text-[#2F7D4A]">
                Aligned with National Clean Air Programme (NCAP)
              </h4>
              <p className="text-xs text-[#536759] mt-0.5 font-sans">
                Supporting CPCB guidelines, PUSA bio-decomposers, and mechanized ex-situ paddy straw management.
              </p>
            </div>
          </div>

          <Link
            to="/about"
            className="btn-primary text-xs py-2.5 px-5 font-heading font-bold shrink-0"
          >
            Learn More About Us <ArrowRight size={14} />
          </Link>
        </div>
      </div>
    </section>
  );
};

export default AboutUs;
  );
};

export default AboutUs;
