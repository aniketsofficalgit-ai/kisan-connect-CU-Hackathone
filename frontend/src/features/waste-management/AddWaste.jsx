import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ArrowLeft, ArrowRight, CheckCircle2, Upload, MapPin, Tag,
  Sprout, Wheat, Flame, Recycle, Trees, Leaf, AlertCircle, Sparkles
} from 'lucide-react';
import wasteService from './wasteService';
import { useAuth } from '../../context/AuthContext';
import './WasteManagement.css';

const CATEGORY_VISUALS = [
  {
    slug: 'crop_residue',
    name: 'Crop Residue & Stubble',
    name_hi: 'फसल अवशेष और पराली',
    desc: 'Paddy straw, wheat stubble, cotton stalks, sugarcane trash',
    icon: Wheat,
    image: 'https://images.unsplash.com/photo-1595974482597-4b8da8879bc5?auto=format&fit=crop&w=400&q=80'
  },
  {
    slug: 'straw_husk',
    name: 'Straw and Husk (Bhusa)',
    name_hi: 'भूसा और छिलका',
    desc: 'Rice husk, wheat straw turi, mustard husk, groundnut shells',
    icon: Sprout,
    image: 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&w=400&q=80'
  },
  {
    slug: 'organic_waste',
    name: 'Organic Farm Waste',
    name_hi: 'जैविक कृषि अपशिष्ट',
    desc: 'Rotten produce, spoiled fruits & veggies, green leaves',
    icon: Leaf,
    image: 'https://images.unsplash.com/photo-1589923188900-85dae523342b?auto=format&fit=crop&w=400&q=80'
  },
  {
    slug: 'animal_manure',
    name: 'Animal Manure (Gobar)',
    name_hi: 'गोबर और पशु खाद',
    desc: 'Dairy cow dung, buffalo slurry, poultry litter',
    icon: Sprout,
    image: 'https://images.unsplash.com/photo-1500595046743-cd271d694d30?auto=format&fit=crop&w=400&q=80'
  },
  {
    slug: 'agricultural_plastic',
    name: 'Agricultural Plastics',
    name_hi: 'कृषि प्लास्टिक व मल्चिंग',
    desc: 'Drip lines, HDPE pipes, mulch films, empty fertilizer sacks',
    icon: Recycle,
    image: 'https://images.unsplash.com/photo-1605600659873-d808a13e4d2a?auto=format&fit=crop&w=400&q=80'
  },
  {
    slug: 'other_waste',
    name: 'Other Farm Byproducts',
    name_hi: 'अन्य कृषि अपशिष्ट',
    desc: 'Coconut coir pith, banana pseudostems, spent mushroom beds',
    icon: Trees,
    image: 'https://images.unsplash.com/photo-1500595046743-cd271d694d30?auto=format&fit=crop&w=400&q=80'
  }
];

export const AddWaste = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 6;

  const [categories, setCategories] = useState([]);
  const [formData, setFormData] = useState({
    category_id: '',
    category_slug: 'crop_residue',
    title: '',
    quantity: '',
    unit: 'quintal',
    expected_price: '',
    image_url: '',
    description: '',
    village_district: user?.farmer_profile?.village ? `${user.farmer_profile.village}, ${user.farmer_profile.district}` : 'Ludhiana, Punjab',
    location_address: user?.farmer_profile?.address || '',
    pickup_available: true
  });

  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState('');
  const [uploadingImage, setUploadingImage] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    const fetchCats = async () => {
      try {
        const cats = await wasteService.getCategories();
        setCategories(cats || []);
        if (cats.length > 0) {
          setFormData(prev => ({
            ...prev,
            category_id: cats[0].id,
            category_slug: cats[0].slug
          }));
        }
      } catch (e) {
        console.error(e);
      }
    };
    fetchCats();
  }, []);

  const handleSelectCategory = (catVisual) => {
    const match = categories.find(c => c.slug === catVisual.slug);
    setFormData(prev => ({
      ...prev,
      category_slug: catVisual.slug,
      category_id: match ? match.id : prev.category_id,
      title: prev.title || `${catVisual.name} Batch`
    }));
    setCurrentStep(2);
  };

  const handleImageFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setSelectedFile(file);
    setPreviewUrl(URL.createObjectURL(file));

    try {
      setUploadingImage(true);
      const res = await wasteService.uploadImage(file);
      setFormData(prev => ({ ...prev, image_url: res.image_url }));
    } catch (err) {
      console.warn("Upload fallback:", err);
    } finally {
      setUploadingImage(false);
    }
  };

  const handleNext = () => {
    setError('');
    if (currentStep === 2) {
      if (!formData.title || !formData.quantity) {
        setError('Please enter waste title and available quantity.');
        return;
      }
    }
    if (currentStep === 4) {
      if (!formData.village_district) {
        setError('Please enter your farm village and district.');
        return;
      }
    }
    setCurrentStep(prev => Math.min(totalSteps, prev + 1));
  };

  const handleBack = () => {
    setError('');
    setCurrentStep(prev => Math.max(1, prev - 1));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');

    try {
      await wasteService.createListing(formData);
      setSuccess(true);
      setTimeout(() => {
        navigate('/farmer-dashboard');
      }, 1500);
    } catch (err) {
      setError(err.response?.data?.error || "Failed to create listing. Please check required fields.");
    } finally {
      setSubmitting(false);
    }
  };

  const stepLabels = [
    'Category',
    'Quantity',
    'Photo',
    'Location',
    'Pickup',
    'Review'
  ];

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Back button */}
      <div>
        <button
          onClick={() => navigate(-1)}
          className="text-xs font-bold text-[#56715E] hover:text-[#347A46] inline-flex items-center gap-2 mb-2 transition-colors cursor-pointer"
        >
          <ArrowLeft size={16} /> Back to Dashboard
        </button>
        <h1 className="text-2xl sm:text-4xl font-extrabold text-[#347A46] tracking-tight">
          List Your Agricultural Waste
        </h1>
        <p className="text-xs sm:text-sm text-[#56715E] mt-1.5 leading-relaxed">
          Step-by-step guided listing for certified biomass, organic compost, and plastic buyers.
        </p>
      </div>

      {/* Step Progress Bar */}
      <div className="bg-white p-5 sm:p-6 rounded-3xl border border-[#E2ECE0] shadow-sm">
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-bold uppercase tracking-wider text-[#347A46]">
            Step {currentStep} of {totalSteps}: {stepLabels[currentStep - 1]}
          </span>
          <span className="text-xs font-extrabold text-[#68A66A]">
            {Math.round((currentStep / totalSteps) * 100)}% Completed
          </span>
        </div>
        <div className="w-full bg-[#E8F1E5] h-2.5 rounded-full overflow-hidden">
          <div
            className="bg-[#347A46] h-full rounded-full transition-all duration-300"
            style={{ width: `${(currentStep / totalSteps) * 100}%` }}
          ></div>
        </div>
      </div>

      {error && (
        <div className="p-4 bg-red-50 border border-red-200 text-red-800 rounded-2xl text-xs font-bold flex items-center gap-2.5">
          <AlertCircle size={18} /> {error}
        </div>
      )}

      {success && (
        <div className="p-5 bg-emerald-50 border border-emerald-200 text-emerald-900 rounded-2xl text-sm font-bold flex items-center gap-3.5">
          <CheckCircle2 size={26} className="text-[#347A46]" />
          <div>
            <span>Listing published successfully!</span>
            <span className="block text-xs font-normal text-emerald-800 mt-0.5">Redirecting to your farmer dashboard...</span>
          </div>
        </div>
      )}

      {/* STEP 1: Select Waste Category */}
      {currentStep === 1 && (
        <div className="space-y-6">
          <div className="text-center sm:text-left">
            <h2 className="text-xl font-extrabold text-[#20392A]">Step 1: Choose Waste Category</h2>
            <p className="text-xs text-[#56715E] mt-1">Click the card that best matches what you want to sell or recycle</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {CATEGORY_VISUALS.map((cat) => {
              const isSelected = formData.category_slug === cat.slug;
              return (
                <div
                  key={cat.slug}
                  onClick={() => handleSelectCategory(cat)}
                  className={`p-5 rounded-3xl border-2 transition-all cursor-pointer flex flex-col justify-between ${
                    isSelected
                      ? 'border-[#347A46] bg-[#E8F1E5] shadow-md'
                      : 'border-[#E2ECE0] bg-white hover:border-[#68A66A]'
                  }`}
                >
                  <div className="h-32 rounded-2xl overflow-hidden mb-4 bg-gray-100">
                    <img src={cat.image} alt={cat.name} className="w-full h-full object-cover" />
                  </div>
                  <div>
                    <h3 className="font-extrabold text-base text-[#20392A] leading-snug">{cat.name}</h3>
                    <span className="text-[11px] font-bold text-[#68A66A] block mt-1">{cat.name_hi}</span>
                    <p className="text-xs text-[#56715E] mt-2 leading-relaxed">{cat.desc}</p>
                  </div>
                  <div className="pt-3 mt-4 border-t border-[#E2ECE0] text-right">
                    <span className="text-xs font-bold text-[#347A46]">Select & Continue &rarr;</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* STEP 2: Quantity, Unit & Expected Price */}
      {currentStep === 2 && (
        <div className="bg-white p-6 sm:p-10 rounded-3xl border border-[#E2ECE0] shadow-sm space-y-6">
          <div>
            <h2 className="text-xl font-extrabold text-[#20392A]">Step 2: Quantity & Valuation</h2>
            <p className="text-xs text-[#56715E] mt-1">Provide approximate weight and title for this batch</p>
          </div>

          <div className="space-y-5">
            <div>
              <label className="block text-xs font-bold text-[#20392A] uppercase tracking-wider mb-2">
                Listing Title / Crop Residue Description *
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="e.g. Dry Basmati Paddy Straw (Baled)"
                className="w-full p-3.5 bg-[#FAF9F3] border border-[#E2ECE0] rounded-2xl text-sm focus:outline-none focus:border-[#347A46] text-[#20392A]"
                required
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-[#20392A] uppercase tracking-wider mb-2">
                  Available Quantity *
                </label>
                <input
                  type="number"
                  value={formData.quantity}
                  onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
                  placeholder="e.g. 120"
                  step="any"
                  className="w-full p-3.5 bg-[#FAF9F3] border border-[#E2ECE0] rounded-2xl text-sm focus:outline-none focus:border-[#347A46] text-[#20392A]"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#20392A] uppercase tracking-wider mb-2">
                  Measurement Unit *
                </label>
                <select
                  value={formData.unit}
                  onChange={(e) => setFormData({ ...formData, unit: e.target.value })}
                  className="w-full p-3.5 bg-[#FAF9F3] border border-[#E2ECE0] rounded-2xl text-sm font-medium focus:outline-none focus:border-[#347A46] text-[#20392A]"
                >
                  <option value="quintal">Quintal (100 kg) &bull; Standard for straw/husk</option>
                  <option value="tonne">Tonne (1000 kg) &bull; Bulk manure & industry</option>
                  <option value="kg">Kilogram (kg) &bull; Plastics & drip pipes</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-[#20392A] uppercase tracking-wider mb-2">
                Expected Price (₹ optional)
              </label>
              <input
                type="number"
                value={formData.expected_price}
                onChange={(e) => setFormData({ ...formData, expected_price: e.target.value })}
                placeholder="e.g. 240 (per unit)"
                className="w-full p-3.5 bg-[#FAF9F3] border border-[#E2ECE0] rounded-2xl text-sm focus:outline-none focus:border-[#347A46] text-[#20392A]"
              />
              <span className="text-[11px] text-[#56715E] mt-1.5 block">Leave blank if you prefer partner quotes.</span>
            </div>
          </div>
        </div>
      )}

      {/* STEP 3: Photograph Upload */}
      {currentStep === 3 && (
        <div className="bg-white p-6 sm:p-10 rounded-3xl border border-[#E2ECE0] shadow-sm space-y-6">
          <div>
            <h2 className="text-xl font-extrabold text-[#20392A]">Step 3: Upload Waste Photograph</h2>
            <p className="text-xs text-[#56715E] mt-1">Photos help balers and collectors inspect moisture and purity</p>
          </div>

          <div className="border-2 border-dashed border-[#C8D8C5] rounded-3xl p-8 text-center bg-[#FAF9F3] hover:border-[#347A46] transition-colors">
            {previewUrl ? (
              <div className="space-y-4">
                <img src={previewUrl} alt="Preview" className="max-h-60 mx-auto rounded-2xl shadow-sm object-cover" />
                <button
                  type="button"
                  onClick={() => { setPreviewUrl(''); setSelectedFile(null); }}
                  className="text-xs font-bold text-red-600 hover:underline"
                >
                  Remove & Choose Another Photo
                </button>
              </div>
            ) : (
              <label className="cursor-pointer block space-y-3">
                <div className="w-16 h-16 rounded-2xl bg-[#E8F1E5] text-[#347A46] flex items-center justify-center mx-auto">
                  <Upload size={28} />
                </div>
                <span className="text-sm font-extrabold text-[#347A46] block">Click to upload photo from your phone or device</span>
                <span className="text-xs text-[#56715E] block">JPG, PNG, WEBP (Clear daylight photo recommended)</span>
                <input type="file" accept="image/*" onChange={handleImageFileChange} className="hidden" />
              </label>
            )}
            {uploadingImage && (
              <p className="text-xs font-bold text-[#68A66A] mt-2 animate-pulse">Uploading photo...</p>
            )}
          </div>
        </div>
      )}

      {/* STEP 4: Farm Location */}
      {currentStep === 4 && (
        <div className="bg-white p-6 sm:p-10 rounded-3xl border border-[#E2ECE0] shadow-sm space-y-6">
          <div>
            <h2 className="text-xl font-extrabold text-[#20392A]">Step 4: Farm Location Details</h2>
            <p className="text-xs text-[#56715E] mt-1">Where can the collection truck or baler driver reach you?</p>
          </div>

          <div className="space-y-5">
            <div>
              <label className="block text-xs font-bold text-[#20392A] uppercase tracking-wider mb-2">
                Village & District *
              </label>
              <input
                type="text"
                value={formData.village_district}
                onChange={(e) => setFormData({ ...formData, village_district: e.target.value })}
                placeholder="e.g. Village Jhammat, Ludhiana, Punjab"
                className="w-full p-3.5 bg-[#FAF9F3] border border-[#E2ECE0] rounded-2xl text-sm focus:outline-none focus:border-[#347A46] text-[#20392A]"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-[#20392A] uppercase tracking-wider mb-2">
                Farm Gate Address & Landmark
              </label>
              <input
                type="text"
                value={formData.location_address}
                onChange={(e) => setFormData({ ...formData, location_address: e.target.value })}
                placeholder="e.g. Near Canal Road, Behind Grain Mandi Field 4"
                className="w-full p-3.5 bg-[#FAF9F3] border border-[#E2ECE0] rounded-2xl text-sm focus:outline-none focus:border-[#347A46] text-[#20392A]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-[#20392A] uppercase tracking-wider mb-2">
                Special Storage / Handling Notes
              </label>
              <textarea
                rows="3"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Mention whether residue is in covered shed or open field, baling status, or access road instructions."
                className="w-full p-3.5 bg-[#FAF9F3] border border-[#E2ECE0] rounded-2xl text-sm focus:outline-none focus:border-[#347A46] text-[#20392A]"
              ></textarea>
            </div>
          </div>
        </div>
      )}

      {/* STEP 5: Pickup Availability */}
      {currentStep === 5 && (
        <div className="bg-white p-6 sm:p-10 rounded-3xl border border-[#E2ECE0] shadow-sm space-y-6">
          <div>
            <h2 className="text-xl font-extrabold text-[#20392A]">Step 5: Road Access & Logistics</h2>
            <p className="text-xs text-[#56715E] mt-1">Confirm vehicle accessibility for balers and transport trailers</p>
          </div>

          <div className="p-6 rounded-2xl bg-[#E8F1E5] border border-[#C8D8C5] space-y-4">
            <div className="flex items-start gap-3.5">
              <input
                type="checkbox"
                id="pickup_access"
                checked={formData.pickup_available}
                onChange={(e) => setFormData({ ...formData, pickup_available: e.target.checked })}
                className="mt-1 w-5 h-5 text-[#347A46] rounded border-gray-300 focus:ring-[#347A46]"
              />
              <label htmlFor="pickup_access" className="text-xs sm:text-sm text-[#20392A] cursor-pointer">
                <strong className="block font-extrabold text-[#347A46] text-sm sm:text-base">
                  Heavy Tractor & Truck Access Available
                </strong>
                The field or farm gate has accessible road connectivity for 10-16 ton trailers, tractor balers, or tipper trucks.
              </label>
            </div>
          </div>
        </div>
      )}

      {/* STEP 6: Review & Submit */}
      {currentStep === 6 && (
        <div className="bg-white p-6 sm:p-10 rounded-3xl border border-[#E2ECE0] shadow-sm space-y-6">
          <div>
            <h2 className="text-xl font-extrabold text-[#20392A]">Step 6: Review Your Listing</h2>
            <p className="text-xs text-[#56715E] mt-1">Verify your details before making it visible to buyers</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div className="p-5 rounded-2xl bg-[#FAF9F3] border border-[#E2ECE0]">
              <span className="text-[#56715E] font-bold block mb-1">Waste Item & Category</span>
              <span className="font-extrabold text-sm text-[#347A46]">{formData.title}</span>
              <span className="text-[11px] text-[#68A66A] block font-semibold mt-0.5">{formData.category_slug}</span>
            </div>

            <div className="p-5 rounded-2xl bg-[#FAF9F3] border border-[#E2ECE0]">
              <span className="text-[#56715E] font-bold block mb-1">Quantity & Expected Price</span>
              <span className="font-extrabold text-sm text-[#347A46]">{formData.quantity} {formData.unit}</span>
              <span className="text-[11px] text-[#68A66A] block font-semibold mt-0.5">
                {formData.expected_price ? `₹${formData.expected_price} per ${formData.unit}` : 'Open to offers'}
              </span>
            </div>

            <div className="p-5 rounded-2xl bg-[#FAF9F3] border border-[#E2ECE0]">
              <span className="text-[#56715E] font-bold block mb-1">Location & Gate Access</span>
              <span className="font-bold text-[#20392A]">{formData.village_district}</span>
              <span className="text-[11px] text-[#56715E] block mt-0.5">{formData.location_address || 'Farm Gate'}</span>
            </div>

            <div className="p-5 rounded-2xl bg-[#FAF9F3] border border-[#E2ECE0]">
              <span className="text-[#56715E] font-bold block mb-1">Road Accessibility</span>
              <span className="font-bold text-[#347A46]">
                {formData.pickup_available ? 'Verified Truck Access' : 'Manual Loading'}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Step Navigation Controls */}
      <div className="pt-4 flex items-center justify-between gap-4">
        {currentStep > 1 ? (
          <button
            type="button"
            onClick={handleBack}
            className="btn-outline text-xs sm:text-sm py-3 px-6 rounded-full border-[#E2ECE0] text-[#56715E] hover:bg-[#FAF9F3]"
          >
            &larr; Back
          </button>
        ) : <div></div>}

        {currentStep < totalSteps ? (
          <button
            type="button"
            onClick={handleNext}
            className="btn-primary text-xs sm:text-sm py-3 px-8 shadow-sm font-bold rounded-full"
          >
            Continue to Step {currentStep + 1} &rarr;
          </button>
        ) : (
          <button
            type="button"
            onClick={handleSubmit}
            disabled={submitting}
            className="btn-primary text-white text-xs sm:text-sm py-3.5 px-9 font-extrabold shadow-md rounded-full"
          >
            {submitting ? 'Publishing to Marketplace...' : 'Confirm & Publish Waste Listing'}
          </button>
        )}
      </div>
    </div>
  );
};

export default AddWaste;
