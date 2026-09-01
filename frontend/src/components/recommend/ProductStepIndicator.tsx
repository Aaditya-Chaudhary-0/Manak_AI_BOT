import { Check } from 'lucide-react';

interface ProductStepIndicatorProps {
  currentStep: number; // 1, 2, or 3
  onStepClick?: (step: number) => void;
  canNavigateToStep?: (step: number) => boolean;
}

export function ProductStepIndicator({
  currentStep,
  onStepClick,
  canNavigateToStep,
}: ProductStepIndicatorProps) {
  const steps = [
    { number: 1, title: 'Product Details', subtitle: 'Basic specifications' },
    { number: 2, title: 'Use & Requirements', subtitle: 'Environment & context' },
    { number: 3, title: 'Review & Match', subtitle: 'Verify & find standards' },
  ];

  return (
    <div className="w-full bg-white border border-gray-200 rounded-xl p-4 shadow-2xs mb-6">
      {/* Desktop Horizontal Stepper */}
      <div className="hidden sm:grid grid-cols-3 gap-2">
        {steps.map((step) => {
          const isCompleted = currentStep > step.number;
          const isCurrent = currentStep === step.number;
          const isClickable = canNavigateToStep ? canNavigateToStep(step.number) : isCompleted;

          return (
            <button
              key={step.number}
              type="button"
              disabled={!isClickable && !isCurrent}
              onClick={() => isClickable && onStepClick && onStepClick(step.number)}
              className={`flex items-center space-x-3 p-2.5 rounded-lg text-left transition-colors ${
                isCurrent
                  ? 'bg-red-50/80 border border-red-200'
                  : isCompleted
                  ? 'hover:bg-gray-50 cursor-pointer'
                  : 'opacity-50 cursor-not-allowed'
              }`}
            >
              <div
                className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold shrink-0 transition-colors ${
                  isCompleted
                    ? 'bg-red-600 text-white'
                    : isCurrent
                    ? 'bg-red-600 text-white ring-4 ring-red-100'
                    : 'bg-gray-100 text-gray-500 border border-gray-200'
                }`}
              >
                {isCompleted ? <Check className="w-4 h-4" /> : step.number}
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center space-x-1.5">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-gray-400">
                    Step {step.number}
                  </span>
                </div>
                <p
                  className={`text-xs font-semibold truncate ${
                    isCurrent ? 'text-red-900' : isCompleted ? 'text-gray-900' : 'text-gray-500'
                  }`}
                >
                  {step.title}
                </p>
              </div>
            </button>
          );
        })}
      </div>

      {/* Mobile Compact Stepper */}
      <div className="sm:hidden flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <span className="w-6 h-6 rounded-full bg-red-600 text-white flex items-center justify-center text-xs font-bold">
            {currentStep}
          </span>
          <div>
            <span className="text-[11px] font-medium text-gray-400 uppercase tracking-wider block">
              Step {currentStep} of 3
            </span>
            <span className="text-xs font-bold text-gray-900">
              {steps[currentStep - 1]?.title}
            </span>
          </div>
        </div>

        {/* Mini Step Dots */}
        <div className="flex items-center space-x-1.5">
          {steps.map((step) => (
            <div
              key={step.number}
              className={`h-2 rounded-full transition-all ${
                step.number === currentStep
                  ? 'w-6 bg-red-600'
                  : step.number < currentStep
                  ? 'w-2 bg-red-300'
                  : 'w-2 bg-gray-200'
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

export default ProductStepIndicator;
