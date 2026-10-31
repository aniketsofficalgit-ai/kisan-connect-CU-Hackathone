import React, { useState, useEffect } from 'react';
import { Wheat, Sprout, Leaf, PawPrint, Recycle, Trees } from 'lucide-react';
import wasteService from '../waste-management/wasteService';
import { useLanguage } from '../../context/LanguageContext';

const ICON_MAP = {
  Wheat: Wheat,
  Sprout: Sprout,
  Leaf: Leaf,
  PawPrint: PawPrint,
  Recycle: Recycle,
  Trees: Trees
};

export const WasteCategories = ({ onSelectCategory }) => {
  const { language } = useLanguage();
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    const fetchCats = async () => {
      try {
        const data = await wasteService.getCategories();
        setCategories(data || []);
      } catch (e) {
        console.error(e);
      }
    };
    fetchCats();
  }, []);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {categories.map((cat) => {
        const IconComponent = ICON_MAP[cat.icon] || Sprout;
        return (
          <div
            key={cat.id}
            onClick={() => onSelectCategory && onSelectCategory(cat.name)}
            className="p-7 rounded-3xl bg-white border border-[#E2ECE0] hover:border-[#68A66A] shadow-sm hover:shadow-md transition-all cursor-pointer flex flex-col justify-between group"
          >
            <div>
              <div className="w-14 h-14 rounded-2xl bg-[#E8F1E5] text-[#347A46] flex items-center justify-center mb-5 group-hover:bg-[#347A46] group-hover:text-white transition-colors">
                <IconComponent size={26} />
              </div>
              <h3 className="font-heading font-black text-lg text-[#20392A] mb-2 group-hover:text-[#347A46] transition-colors">
                {language === 'hi' ? cat.name_hi : cat.name}
              </h3>
              <p className="text-xs sm:text-sm text-[#56715E] line-clamp-3 leading-relaxed mb-5 font-sans">
                {language === 'hi' ? cat.description_hi : cat.description}
              </p>
            </div>

            <div className="pt-4 border-t border-[#E2ECE0] text-xs font-sans">
              <span className="text-gray-400 block text-[10px] uppercase font-heading font-bold mb-1">
                {language === 'hi' ? 'अनुशंसित उपयोग:' : 'Recommended Valorization:'}
              </span>
              <span className="font-semibold text-[#347A46]">{cat.recommended_uses}</span>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default WasteCategories;
