import { CERTIFICATION_PROCESS_STEPS } from '../../data/mockRecommendationData';
import { ArrowRight, ArrowDown } from 'lucide-react';

export function CertificationFlowDiagram() {
  return (
    <div className="bg-white border border-gray-200 rounded-xl p-5 sm:p-6 shadow-2xs space-y-5">
      <div className="border-b border-gray-100 pb-3 flex flex-col sm:flex-row sm:items-center justify-between gap-1">
        <div>
          <h3 className="text-base font-bold text-gray-900">
            General BIS Certification Flow
          </h3>
          <p className="text-xs text-gray-500 mt-0.5">
            Standard high-level path from product identification to license grant.
          </p>
        </div>
        <span className="text-[11px] font-semibold text-blue-700 bg-blue-50 px-2.5 py-1 rounded-full border border-blue-200 w-fit">
          High-Level Architecture
        </span>
      </div>

      {/* Desktop Grid / Timeline */}
      <div className="hidden lg:grid grid-cols-6 gap-2 relative">
        {CERTIFICATION_PROCESS_STEPS.map((step, idx) => (
          <div
            key={step.stepNumber}
            className="flex flex-col bg-gray-50/80 border border-gray-200 rounded-xl p-3.5 relative group hover:border-red-300 hover:bg-red-50/20 transition-all justify-between"
          >
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="w-6 h-6 rounded-md bg-white border border-gray-200 font-mono text-xs font-bold text-red-600 flex items-center justify-center shadow-2xs">
                  {step.stepNumber}
                </span>
                {idx < CERTIFICATION_PROCESS_STEPS.length - 1 && (
                  <ArrowRight className="w-3.5 h-3.5 text-gray-300 group-hover:text-red-500 transition-colors" />
                )}
              </div>
              <h4 className="text-xs font-bold text-gray-900 leading-snug">
                {step.title}
              </h4>
            </div>
            <p className="text-[11px] text-gray-500 mt-2 leading-relaxed">
              {step.desc}
            </p>
          </div>
        ))}
      </div>

      {/* Mobile / Tablet Vertical Flow */}
      <div className="lg:hidden space-y-2">
        {CERTIFICATION_PROCESS_STEPS.map((step, idx) => (
          <div key={step.stepNumber} className="space-y-2">
            <div className="bg-gray-50/80 border border-gray-200 rounded-xl p-3.5 flex items-start space-x-3">
              <span className="w-6 h-6 rounded-md bg-white border border-gray-200 font-mono text-xs font-bold text-red-600 flex items-center justify-center shrink-0 mt-0.5 shadow-2xs">
                {step.stepNumber}
              </span>
              <div>
                <h4 className="text-xs font-bold text-gray-900">{step.title}</h4>
                <p className="text-xs text-gray-600 mt-0.5 leading-relaxed">{step.desc}</p>
              </div>
            </div>
            {idx < CERTIFICATION_PROCESS_STEPS.length - 1 && (
              <div className="flex justify-center">
                <ArrowDown className="w-4 h-4 text-gray-300" />
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default CertificationFlowDiagram;
