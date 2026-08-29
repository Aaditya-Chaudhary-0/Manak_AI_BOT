import { CERTIFICATION_SCHEMES } from '../../data/mockRecommendationData';
import { ArrowRight, CheckCircle2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

export function CertificationSchemesGrid() {
  const navigate = useNavigate();

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-base font-bold text-gray-900">
            Core BIS Certification Concepts & Schemes
          </h3>
          <p className="text-xs text-gray-500 mt-0.5">
            Key regulatory paths governing product conformity assessment in India.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <AnimatePresence>
          {CERTIFICATION_SCHEMES.map((scheme, i) => (
            <motion.div
              key={scheme.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: i * 0.05 }}
              className="bg-white border border-gray-200 hover:border-blue-200 hover:-translate-y-1 hover:shadow-md rounded-xl p-5 shadow-2xs transition-all duration-200 ease-out flex flex-col justify-between space-y-4"
            >
            <div className="space-y-3">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-100">
                    {scheme.badge}
                  </span>
                  <h4 className="text-sm font-bold text-gray-900 mt-1.5 leading-snug">
                    {scheme.title}
                  </h4>
                </div>
                <span className="font-mono text-xs font-semibold text-gray-500 bg-gray-50 px-2 py-1 rounded border border-gray-200 shrink-0">
                  {scheme.shortCode}
                </span>
              </div>

              {/* What it is */}
              <div className="space-y-1">
                <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider block">
                  What it is:
                </span>
                <p className="text-xs text-gray-700 leading-relaxed">
                  {scheme.whatIsIt}
                </p>
              </div>

              {/* When relevant */}
              <div className="space-y-1">
                <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider block">
                  When it may be relevant:
                </span>
                <p className="text-xs text-gray-700 leading-relaxed">
                  {scheme.whenRelevant}
                </p>
              </div>

              {/* Next Action guidance */}
              <div className="bg-gray-50 rounded-lg p-3 border border-gray-100 space-y-1">
                <span className="text-[10px] font-bold text-red-700 uppercase tracking-wider flex items-center space-x-1">
                  <CheckCircle2 className="w-3 h-3 text-red-600" />
                  <span>Next Action / Readiness:</span>
                </span>
                <p className="text-xs text-gray-800 leading-relaxed">
                  {scheme.nextAction}
                </p>
              </div>
            </div>

            {/* Card Action */}
            <div className="pt-3 border-t border-gray-100 flex items-center justify-between">
              <span className="text-[11px] text-gray-400 font-medium truncate max-w-[200px]">
                {scheme.officialRef}
              </span>

              <button
                type="button"
                onClick={() =>
                  navigate('/app/assistant', {
                    state: {
                      initialQuery: `Explain the step-by-step application and audit procedures for ${scheme.title}.`,
                    },
                  })
                }
                className="inline-flex items-center space-x-1 text-xs font-semibold text-red-600 hover:text-red-700 cursor-pointer"
              >
                <span>Ask AI About This</span>
                <ArrowRight className="w-3 h-3" />
              </button>
            </div>
          </motion.div>
        ))}
        </AnimatePresence>
      </div>
    </div>
  );
}

export default CertificationSchemesGrid;
