import React from 'react';
import {
  X, BookOpen, AlertTriangle, CheckCircle2, TrendingUp,
  Leaf, ShieldAlert, ArrowRight, Sprout
} from 'lucide-react';
import { Link } from 'react-router-dom';

export const RecyclingDetails = ({ guide, onClose }) => {
  if (!guide) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6 sm:p-8 shadow-2xl border border-[#E2ECE0] space-y-6">
        <div className="flex items-start justify-between gap-4 pb-4 border-b border-[#E2ECE0]">
          <div>
            <span className="text-[11px] font-heading font-bold text-[#347A46] bg-[#E8F1E5] px-3.5 py-1 rounded-full uppercase tracking-wider inline-block mb-2">
              {guide.waste_category}
            </span>
            <h2 className="text-2xl font-heading font-black text-[#20392A] leading-tight">
              {guide.title}
            </h2>
            <p className="text-xs text-[#56715E] mt-1 font-sans">
              Method: <strong className="text-[#20392A]">{guide.reuse_method}</strong>
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-[#FAF9F3] text-gray-400 hover:text-[#20392A] transition-colors cursor-pointer"
            aria-label="Close"
          >
            <X size={20} />
          </button>
        </div>

        {/* Summary */}
        <div>
          <h3 className="text-xs font-heading font-bold text-[#20392A] uppercase tracking-wider mb-2">
            Overview & Scientific Principles
          </h3>
          <p className="text-xs sm:text-sm text-[#56715E] leading-relaxed bg-[#FAF9F3] p-5 rounded-2xl border border-[#E2ECE0] font-sans">
            {guide.summary}
          </p>
        </div>

        {/* Practical Instructions */}
        <div>
          <h3 className="text-xs font-heading font-bold text-[#347A46] uppercase tracking-wider mb-2.5 flex items-center gap-1.5">
            <CheckCircle2 size={16} className="text-[#68A66A]" /> Step-by-Step Field Instructions
          </h3>
          <div className="whitespace-pre-line text-xs sm:text-sm text-[#20392A] space-y-2 bg-[#FAF9F3] p-5 rounded-2xl border border-[#E2ECE0] leading-relaxed font-sans">
            {guide.instructions}
          </div>
        </div>

        {/* Safety Guidelines */}
        <div>
          <h3 className="text-xs font-heading font-bold text-amber-900 uppercase tracking-wider mb-2 flex items-center gap-1.5">
            <AlertTriangle size={16} className="text-amber-600" /> Essential Safety Precautions
          </h3>
          <p className="text-xs text-amber-900 bg-amber-50 p-4 rounded-2xl border border-amber-200 leading-relaxed font-sans">
            {guide.safety_guidelines}
          </p>
        </div>

        {/* Environmental Benefits & Earnings */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-sans">
          <div className="p-5 rounded-2xl bg-[#FAF9F3] border border-[#E2ECE0]">
            <span className="font-heading font-bold text-[#347A46] block mb-1.5 flex items-center gap-1.5 text-[11px] uppercase tracking-wider">
              <Leaf size={15} className="text-[#68A66A]" /> Environmental Benefits
            </span>
            <p className="text-[#56715E] leading-relaxed">{guide.environmental_benefits}</p>
          </div>

          <div className="p-5 rounded-2xl bg-[#FAF9F3] border border-[#E2ECE0]">
            <span className="font-heading font-bold text-[#347A46] block mb-1.5 flex items-center gap-1.5 text-[11px] uppercase tracking-wider">
              <TrendingUp size={15} className="text-[#68A66A]" /> Potential Income Value
            </span>
            <p className="text-[#347A46] font-heading font-extrabold text-sm">{guide.estimated_value_potential}</p>
          </div>
        </div>

        <div className="pt-4 border-t border-[#E2ECE0] flex items-center justify-between gap-3">
          <Link
            to="/add-waste"
            onClick={onClose}
            className="btn-primary text-xs py-3 px-6 font-heading font-bold rounded-full"
          >
            List This Waste on Marketplace &rarr;
          </Link>
          <button
            onClick={onClose}
            className="btn-outline text-xs py-2.5 px-5 rounded-full font-heading font-bold border-[#E2ECE0] text-[#56715E] hover:bg-[#FAF9F3]"
          >
            Close Guide
          </button>
        </div>
      </div>
    </div>
  );
};

export default RecyclingDetails;
