import React from 'react';
import type { ProductFormData } from '../../data/mockRecommendationData';
import { ArrowLeft, ArrowRight } from 'lucide-react';

interface ProductFormStep2Props {
  formData: ProductFormData;
  onChange: (field: keyof ProductFormData, value: string) => void;
  onNext: () => void;
  onBack: () => void;
  errors: Partial<Record<keyof ProductFormData, string>>;
}

export function ProductFormStep2({
  formData,
  onChange,
  onNext,
  onBack,
  errors,
}: ProductFormStep2Props) {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onNext();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-2xs space-y-5">
        <div className="border-b border-gray-100 pb-3">
          <h3 className="text-base font-bold text-gray-900">
            Step 2: Requirements & Operational Use
          </h3>
          <p className="text-xs text-gray-500 mt-0.5">
            Specify where the product will be used, target market, materials, and compliance goals.
          </p>
        </div>

        {/* Intended Use (Required) */}
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label
              htmlFor="intended-use"
              className="block text-xs font-bold text-gray-800 uppercase tracking-wider"
            >
              Intended Use & Operational Environment <span className="text-red-600">*</span>
            </label>
            <span className="text-[11px] text-gray-400">Min 5 characters</span>
          </div>
          <textarea
            id="intended-use"
            required
            rows={3}
            value={formData.intendedUse}
            onChange={(e) => onChange('intendedUse', e.target.value)}
            placeholder="e.g. Indoor residential illumination under 220-240V AC; or heavy-duty structural concrete reinforcement for seismic zones..."
            className={`w-full px-3.5 py-2.5 bg-white border rounded-lg text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all resize-y ${
              errors.intendedUse ? 'border-red-400 bg-red-50/20' : 'border-gray-300'
            }`}
          />
          {errors.intendedUse && (
            <p className="text-xs text-red-600 font-medium mt-1">{errors.intendedUse}</p>
          )}
        </div>

        {/* Optional 2x2 Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Target Market */}
          <div>
            <label
              htmlFor="target-market"
              className="block text-xs font-bold text-gray-800 uppercase tracking-wider mb-1.5"
            >
              Target Market <span className="text-xs font-normal text-gray-400 lowercase">(optional)</span>
            </label>
            <input
              id="target-market"
              type="text"
              value={formData.targetMarket || ''}
              onChange={(e) => onChange('targetMarket', e.target.value)}
              placeholder="e.g. Indian Domestic Retail, Commercial, GeM Tender"
              className="w-full px-3.5 py-2.5 bg-white border border-gray-300 rounded-lg text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all"
            />
          </div>

          {/* Material / Composition */}
          <div>
            <label
              htmlFor="material-composition"
              className="block text-xs font-bold text-gray-800 uppercase tracking-wider mb-1.5"
            >
              Material / Composition <span className="text-xs font-normal text-gray-400 lowercase">(optional)</span>
            </label>
            <input
              id="material-composition"
              type="text"
              value={formData.materialComposition || ''}
              onChange={(e) => onChange('materialComposition', e.target.value)}
              placeholder="e.g. Polycarbonate, Micro-alloyed steel, Low-carbon"
              className="w-full px-3.5 py-2.5 bg-white border border-gray-300 rounded-lg text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all"
            />
          </div>

          {/* Manufacturing Location */}
          <div>
            <label
              htmlFor="manufacturing-location"
              className="block text-xs font-bold text-gray-800 uppercase tracking-wider mb-1.5"
            >
              Manufacturing Location <span className="text-xs font-normal text-gray-400 lowercase">(optional)</span>
            </label>
            <input
              id="manufacturing-location"
              type="text"
              value={formData.manufacturingLocation || ''}
              onChange={(e) => onChange('manufacturingLocation', e.target.value)}
              placeholder="e.g. Domestic Factory (India), Imported (FMCS Scheme)"
              className="w-full px-3.5 py-2.5 bg-white border border-gray-300 rounded-lg text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all"
            />
          </div>

          {/* Special Requirements */}
          <div>
            <label
              htmlFor="special-requirements"
              className="block text-xs font-bold text-gray-800 uppercase tracking-wider mb-1.5"
            >
              Special Regulatory / Testing Goals <span className="text-xs font-normal text-gray-400 lowercase">(optional)</span>
            </label>
            <input
              id="special-requirements"
              type="text"
              value={formData.specialRequirements || ''}
              onChange={(e) => onChange('specialRequirements', e.target.value)}
              placeholder="e.g. High efficiency, CRS self-declaration, ISI mark"
              className="w-full px-3.5 py-2.5 bg-white border border-gray-300 rounded-lg text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all"
            />
          </div>
        </div>
      </div>

      {/* Form Navigation Buttons */}
      <div className="flex items-center justify-between">
        <button
          type="button"
          onClick={onBack}
          className="inline-flex items-center space-x-2 px-4 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-800 text-xs font-bold uppercase tracking-wider rounded-lg transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Step 1</span>
        </button>

        <button
          type="submit"
          className="inline-flex items-center space-x-2 px-6 py-2.5 bg-red-600 hover:bg-red-700 text-white text-xs font-bold uppercase tracking-wider rounded-lg shadow-sm transition-colors cursor-pointer"
        >
          <span>Review Product Summary</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </form>
  );
}

export default ProductFormStep2;
