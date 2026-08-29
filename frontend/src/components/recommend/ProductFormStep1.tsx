import React from 'react';
import type { ProductFormData } from '../../data/mockRecommendationData';
import { CATEGORIES_LIST } from '../../data/mockStandardsData';
import { ArrowRight, Tag, Info } from 'lucide-react';

interface ProductFormStep1Props {
  formData: ProductFormData;
  onChange: (field: keyof ProductFormData, value: string) => void;
  onNext: () => void;
  errors: Partial<Record<keyof ProductFormData, string>>;
}

export function ProductFormStep1({
  formData,
  onChange,
  onNext,
  errors,
}: ProductFormStep1Props) {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onNext();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-2xs space-y-5">
        <div className="border-b border-gray-100 pb-3">
          <h3 className="text-base font-bold text-gray-900">
            Step 1: Product Identification
          </h3>
          <p className="text-xs text-gray-500 mt-0.5">
            Provide the product name, industry category, and physical description.
          </p>
        </div>

        {/* Product Name */}
        <div>
          <label
            htmlFor="product-name"
            className="block text-xs font-bold text-gray-800 uppercase tracking-wider mb-1.5"
          >
            Product Name <span className="text-red-600">*</span>
          </label>
          <input
            id="product-name"
            type="text"
            required
            value={formData.name}
            onChange={(e) => onChange('name', e.target.value)}
            placeholder="e.g. Self-Ballasted LED Bulb 9W, Ordinary Portland Cement 53 Grade"
            className={`w-full px-3.5 py-2.5 bg-white border rounded-lg text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all ${
              errors.name ? 'border-red-400 bg-red-50/20' : 'border-gray-300'
            }`}
          />
          {errors.name && (
            <p className="text-xs text-red-600 font-medium mt-1">{errors.name}</p>
          )}
        </div>

        {/* Category & Product Type (Grid) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label
              htmlFor="product-category"
              className="block text-xs font-bold text-gray-800 uppercase tracking-wider mb-1.5"
            >
              Industry Category <span className="text-red-600">*</span>
            </label>
            <div className="relative">
              <select
                id="product-category"
                required
                value={formData.category}
                onChange={(e) => onChange('category', e.target.value)}
                className={`w-full px-3.5 py-2.5 bg-white border rounded-lg text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 appearance-none transition-all ${
                  errors.category ? 'border-red-400 bg-red-50/20' : 'border-gray-300'
                }`}
              >
                <option value="">-- Select Industry Category --</option>
                {CATEGORIES_LIST.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
                <option value="Other">Other / General</option>
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-gray-500">
                <Tag className="w-4 h-4" />
              </div>
            </div>
            {errors.category && (
              <p className="text-xs text-red-600 font-medium mt-1">{errors.category}</p>
            )}
          </div>

          <div>
            <label
              htmlFor="product-type"
              className="block text-xs font-bold text-gray-800 uppercase tracking-wider mb-1.5"
            >
              Product Type / Sub-Type{' '}
              <span className="text-xs font-normal text-gray-400 lowercase">(optional)</span>
            </label>
            <input
              id="product-type"
              type="text"
              value={formData.productType || ''}
              onChange={(e) => onChange('productType', e.target.value)}
              placeholder="e.g. Consumer Appliance, Raw Material, Finished Article"
              className="w-full px-3.5 py-2.5 bg-white border border-gray-300 rounded-lg text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all"
            />
          </div>
        </div>

        {/* Product Description */}
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label
              htmlFor="product-description"
              className="block text-xs font-bold text-gray-800 uppercase tracking-wider"
            >
              Product Description & Specifications <span className="text-red-600">*</span>
            </label>
            <span className="text-[11px] text-gray-400">Min 10 characters</span>
          </div>
          <textarea
            id="product-description"
            required
            rows={4}
            value={formData.description}
            onChange={(e) => onChange('description', e.target.value)}
            placeholder="Describe the physical composition, key operating parameters, power ratings, capacity, or form factor of the product..."
            className={`w-full px-3.5 py-2.5 bg-white border rounded-lg text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all resize-y ${
              errors.description ? 'border-red-400 bg-red-50/20' : 'border-gray-300'
            }`}
          />
          {errors.description && (
            <p className="text-xs text-red-600 font-medium mt-1">{errors.description}</p>
          )}
        </div>

        <div className="bg-blue-50/70 border border-blue-200 rounded-lg p-3 flex items-start space-x-2.5 text-xs text-blue-900">
          <Info className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
          <p>
            The more precise your product description and technical ratings, the more accurately Manak AI can map your product to applicable BIS Standards and Quality Control Orders.
          </p>
        </div>
      </div>

      {/* Form Action */}
      <div className="flex items-center justify-end">
        <button
          type="submit"
          className="inline-flex items-center space-x-2 px-6 py-2.5 bg-red-600 hover:bg-red-700 text-white text-xs font-bold uppercase tracking-wider rounded-lg shadow-sm transition-colors cursor-pointer"
        >
          <span>Continue to Step 2</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </form>
  );
}

export default ProductFormStep1;
