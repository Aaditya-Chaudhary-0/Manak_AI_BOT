import { useState } from 'react';
import AppLayout from '../components/layout/AppLayout';
import ProductStepIndicator from '../components/recommend/ProductStepIndicator';
import ProductFormStep1 from '../components/recommend/ProductFormStep1';
import ProductFormStep2 from '../components/recommend/ProductFormStep2';
import ProductReviewStep3 from '../components/recommend/ProductReviewStep3';
import RecommendationResultsView from '../components/recommend/RecommendationResultsView';
import RecommendationEmptyState from '../components/recommend/RecommendationEmptyState';
import RecommendationNoMatchState from '../components/recommend/RecommendationNoMatchState';
import {
  type ProductFormData,
  type RecommendationResult,
  type ExampleProduct,
  getMockRecommendationsForProduct,
} from '../data/mockRecommendationData';
import { Loader2, ListTree } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const INITIAL_FORM_DATA: ProductFormData = {
  name: '',
  category: '',
  description: '',
  intendedUse: '',
  targetMarket: '',
  materialComposition: '',
  productType: '',
  manufacturingLocation: '',
  specialRequirements: '',
};

export function RecommendPage() {
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [formData, setFormData] = useState<ProductFormData>(INITIAL_FORM_DATA);
  const [errors, setErrors] = useState<Partial<Record<keyof ProductFormData, string>>>({});
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [loadingText, setLoadingText] = useState<string>('Understanding product...');
  const [hasSearched, setHasSearched] = useState<boolean>(false);
  const [recommendations, setRecommendations] = useState<RecommendationResult[]>([]);

  // Form Field Update Handler
  const handleFieldChange = (field: keyof ProductFormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  // Step 1 Validation
  const validateStep1 = (): boolean => {
    const errs: Partial<Record<keyof ProductFormData, string>> = {};
    if (!formData.name.trim()) {
      errs.name = 'Product name is required';
    }
    if (!formData.category) {
      errs.category = 'Please select a product category';
    }
    if (!formData.description.trim()) {
      errs.description = 'Product description is required';
    } else if (formData.description.trim().length < 10) {
      errs.description = 'Please provide at least 10 characters of description';
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  // Step 2 Validation
  const validateStep2 = (): boolean => {
    const errs: Partial<Record<keyof ProductFormData, string>> = {};
    if (!formData.intendedUse.trim()) {
      errs.intendedUse = 'Intended use description is required';
    } else if (formData.intendedUse.trim().length < 5) {
      errs.intendedUse = 'Please provide at least 5 characters for intended use';
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  // Navigation between steps
  const handleNextFromStep1 = () => {
    if (validateStep1()) {
      setCurrentStep(2);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleNextFromStep2 = () => {
    if (validateStep2()) {
      setCurrentStep(3);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleBackToStep1 = () => {
    setCurrentStep(1);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleEditStep = (stepNumber: number) => {
    setCurrentStep(stepNumber);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Quick-fill example product
  const handleSelectExample = (example: ExampleProduct) => {
    setFormData(example.data);
    setErrors({});
    setCurrentStep(3);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Run matching simulation with staged loading messages
  const handleFindRelevantStandards = () => {
    setIsLoading(true);
    setLoadingText('Understanding product parameters...');

    setTimeout(() => {
      setLoadingText('Finding potentially relevant standards...');
    }, 400);

    setTimeout(() => {
      setLoadingText('Preparing recommendations and scheme guidance...');
    }, 800);

    setTimeout(() => {
      const results = getMockRecommendationsForProduct(formData);
      setRecommendations(results);
      setIsLoading(false);
      setHasSearched(true);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }, 1100);
  };

  // Start over / reset
  const handleStartNew = () => {
    setFormData(INITIAL_FORM_DATA);
    setErrors({});
    setCurrentStep(1);
    setHasSearched(false);
    setRecommendations([]);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <AppLayout
      pageTitle="Find the Right BIS Standard"
      pageSubtitle="Tell us about your product and get potentially relevant BIS standards based on the information you provide."
    >
      <div className="min-h-full bg-gray-50/50 pb-20">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-6 sm:py-8 space-y-6">
          {/* Header Banner */}
          <div className="bg-white border border-gray-200 rounded-xl p-5 sm:p-6 shadow-2xs">
            <div className="flex items-start justify-between gap-4">
              <div>
                <div className="flex items-center space-x-2">
                  <span className="w-2 h-2 rounded-full bg-red-600"></span>
                  <span className="text-xs font-bold text-gray-900 uppercase tracking-wider">
                    Product → BIS Standard Matcher
                  </span>
                </div>
                <h1 className="text-xl sm:text-2xl font-bold text-gray-900 mt-1">
                  Find the Right BIS Standard
                </h1>
                <p className="text-xs sm:text-sm text-gray-600 mt-1 max-w-2xl leading-relaxed">
                  Tell us about your product and get potentially relevant BIS standards based on the information you provide.
                </p>
              </div>

              <div className="hidden sm:flex p-3 rounded-xl bg-red-50 text-red-600 border border-red-100 shrink-0">
                <ListTree className="w-6 h-6" />
              </div>
            </div>
          </div>

          {/* If Results have been calculated */}
          {hasSearched ? (
            recommendations.length > 0 ? (
              <RecommendationResultsView
                formData={formData}
                recommendations={recommendations}
                onStartNew={handleStartNew}
              />
            ) : (
              <RecommendationNoMatchState
                productName={formData.name}
                onEditProduct={() => setHasSearched(false)}
              />
            )
          ) : (
            <>
              {/* If on Step 1 and form is completely empty, show Quick Start Empty State template helper */}
              {!formData.name && !formData.category && currentStep === 1 && (
                <RecommendationEmptyState onSelectExample={handleSelectExample} />
              )}

              {/* Progress Indicator */}
              <ProductStepIndicator
                currentStep={currentStep}
                onStepClick={handleEditStep}
                canNavigateToStep={(step) => {
                  if (step === 1) return true;
                  if (step === 2) return validateStep1();
                  if (step === 3) return validateStep1() && validateStep2();
                  return false;
                }}
              />

              {/* Loading State Overlay */}
              {isLoading ? (
                <div className="bg-white border border-gray-200 rounded-xl p-12 text-center shadow-2xs space-y-4 max-w-md mx-auto">
                  <div className="w-12 h-12 rounded-2xl bg-red-50 text-red-600 border border-red-100 flex items-center justify-center mx-auto">
                    <Loader2 className="w-6 h-6 animate-spin text-red-600" />
                  </div>
                  <div className="space-y-1">
                    <h3 className="text-sm font-bold text-gray-900">
                      Analyzing Product Details
                    </h3>
                    <p className="text-xs text-blue-700 font-medium animate-pulse">
                      {loadingText}
                    </p>
                  </div>
                  <div className="space-y-2 pt-2">
                    <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                      <div className="h-full bg-red-600 rounded-full w-2/3 animate-pulse"></div>
                    </div>
                  </div>
                </div>
              ) : (
                /* Multi-Step Forms */
                <AnimatePresence mode="wait">
                  {currentStep === 1 && (
                    <motion.div
                      key="step1"
                      initial={{ opacity: 0, x: 10 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -10 }}
                      transition={{ duration: 0.2 }}
                    >
                      <ProductFormStep1
                        formData={formData}
                        onChange={handleFieldChange}
                        onNext={handleNextFromStep1}
                        errors={errors}
                      />
                    </motion.div>
                  )}

                  {currentStep === 2 && (
                    <motion.div
                      key="step2"
                      initial={{ opacity: 0, x: 10 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -10 }}
                      transition={{ duration: 0.2 }}
                    >
                      <ProductFormStep2
                        formData={formData}
                        onChange={handleFieldChange}
                        onNext={handleNextFromStep2}
                        onBack={handleBackToStep1}
                        errors={errors}
                      />
                    </motion.div>
                  )}

                  {currentStep === 3 && (
                    <motion.div
                      key="step3"
                      initial={{ opacity: 0, x: 10 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -10 }}
                      transition={{ duration: 0.2 }}
                    >
                      <ProductReviewStep3
                        formData={formData}
                        onEditStep={handleEditStep}
                        onSubmitMatch={handleFindRelevantStandards}
                        isLoading={isLoading}
                      />
                    </motion.div>
                  )}
                </AnimatePresence>
              )}
            </>
          )}
        </div>
      </div>
    </AppLayout>
  );
}

export default RecommendPage;
