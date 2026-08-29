import type { ProductFormData } from '../../data/mockRecommendationData';
import { ArrowLeft, Edit3, Search, Sparkles, CheckCircle2, Shield } from 'lucide-react';

interface ProductReviewStep3Props {
  formData: ProductFormData;
  onEditStep: (stepNumber: number) => void;
  onSubmitMatch: () => void;
  isLoading: boolean;
}

export function ProductReviewStep3({
  formData,
  onEditStep,
  onSubmitMatch,
  isLoading,
}: ProductReviewStep3Props) {
  return (
    <div className="space-y-6">
      {/* Review Card */}
      <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-2xs space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-gray-100 pb-4">
          <div>
            <h3 className="text-base font-bold text-gray-900">
              Step 3: Review Product Details
            </h3>
            <p className="text-xs text-gray-500 mt-0.5">
              Verify your information before running the BIS Standard Matcher engine.
            </p>
          </div>
          <span className="inline-flex items-center space-x-1 text-xs font-semibold text-blue-700 bg-blue-50 px-2.5 py-1 rounded-full border border-blue-200">
            <CheckCircle2 className="w-3.5 h-3.5 text-blue-600" />
            <span>Ready for Matching</span>
          </span>
        </div>

        {/* Section 1: Core Product Summary */}
        <div className="bg-gray-50/80 border border-gray-100 rounded-xl p-4 space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider">
              1. Product Identification
            </h4>
            <button
              type="button"
              onClick={() => onEditStep(1)}
              className="inline-flex items-center space-x-1 text-xs text-red-600 hover:text-red-700 font-semibold cursor-pointer"
            >
              <Edit3 className="w-3.5 h-3.5" />
              <span>Edit Details</span>
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <span className="text-gray-400 font-medium block">Product Name</span>
              <span className="text-sm font-bold text-gray-900">{formData.name}</span>
            </div>
            <div>
              <span className="text-gray-400 font-medium block">Industry Category</span>
              <span className="inline-block mt-0.5 px-2.5 py-0.5 rounded-md bg-white border border-gray-200 font-semibold text-gray-800">
                {formData.category}
              </span>
            </div>
            {formData.productType && (
              <div className="sm:col-span-2">
                <span className="text-gray-400 font-medium block">Product Type</span>
                <span className="font-semibold text-gray-800">{formData.productType}</span>
              </div>
            )}
            <div className="sm:col-span-2">
              <span className="text-gray-400 font-medium block">Description & Specs</span>
              <p className="text-gray-700 mt-0.5 leading-relaxed bg-white p-3 rounded-lg border border-gray-200">
                {formData.description}
              </p>
            </div>
          </div>
        </div>

        {/* Section 2: Requirements & Use */}
        <div className="bg-gray-50/80 border border-gray-100 rounded-xl p-4 space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider">
              2. Operational Requirements & Context
            </h4>
            <button
              type="button"
              onClick={() => onEditStep(2)}
              className="inline-flex items-center space-x-1 text-xs text-red-600 hover:text-red-700 font-semibold cursor-pointer"
            >
              <Edit3 className="w-3.5 h-3.5" />
              <span>Edit Details</span>
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div className="sm:col-span-2">
              <span className="text-gray-400 font-medium block">Intended Use</span>
              <p className="text-gray-700 mt-0.5 leading-relaxed bg-white p-3 rounded-lg border border-gray-200">
                {formData.intendedUse}
              </p>
            </div>
            {formData.targetMarket && (
              <div>
                <span className="text-gray-400 font-medium block">Target Market</span>
                <span className="font-semibold text-gray-800">{formData.targetMarket}</span>
              </div>
            )}
            {formData.materialComposition && (
              <div>
                <span className="text-gray-400 font-medium block">Material / Composition</span>
                <span className="font-semibold text-gray-800">{formData.materialComposition}</span>
              </div>
            )}
            {formData.manufacturingLocation && (
              <div>
                <span className="text-gray-400 font-medium block">Manufacturing Location</span>
                <span className="font-semibold text-gray-800">{formData.manufacturingLocation}</span>
              </div>
            )}
            {formData.specialRequirements && (
              <div>
                <span className="text-gray-400 font-medium block">Special Compliance Goals</span>
                <span className="font-semibold text-gray-800">{formData.specialRequirements}</span>
              </div>
            )}
          </div>
        </div>

        {/* Demo Disclaimer notice */}
        <div className="p-3 bg-blue-50/70 border border-blue-200 rounded-lg flex items-start space-x-2 text-xs text-blue-900">
          <Shield className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
          <p>
            Standard recommendations are generated based on the demo index catalogue. Always verify the current scope and Quality Control Orders on the official BIS portal before legal or certification filing.
          </p>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex items-center justify-between">
        <button
          type="button"
          disabled={isLoading}
          onClick={() => onEditStep(2)}
          className="inline-flex items-center space-x-2 px-4 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-800 text-xs font-bold uppercase tracking-wider rounded-lg transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Step 2</span>
        </button>

        <button
          type="button"
          disabled={isLoading}
          onClick={onSubmitMatch}
          className="inline-flex items-center space-x-2 px-8 py-3 bg-red-600 hover:bg-red-700 text-white text-xs font-bold uppercase tracking-wider rounded-lg shadow-md transition-all cursor-pointer hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? (
            <>
              <Sparkles className="w-4 h-4 animate-spin" />
              <span>Analyzing Product...</span>
            </>
          ) : (
            <>
              <Search className="w-4 h-4" />
              <span>Find Relevant Standards</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
}

export default ProductReviewStep3;
