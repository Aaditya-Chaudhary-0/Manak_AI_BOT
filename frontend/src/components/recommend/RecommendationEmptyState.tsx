import { EXAMPLE_PRODUCTS, type ExampleProduct } from '../../data/mockRecommendationData';
import { ListTree, Sparkles, ArrowRight, Lightbulb, CheckCircle2 } from 'lucide-react';

interface RecommendationEmptyStateProps {
  onSelectExample: (example: ExampleProduct) => void;
}

export function RecommendationEmptyState({ onSelectExample }: RecommendationEmptyStateProps) {
  return (
    <div className="bg-white border border-gray-200 rounded-xl p-6 sm:p-8 shadow-2xs space-y-6">
      <div className="text-center max-w-2xl mx-auto space-y-3">
        <div className="w-12 h-12 rounded-2xl bg-red-50 border border-red-100 text-red-600 mx-auto flex items-center justify-center shadow-2xs">
          <ListTree className="w-6 h-6" />
        </div>
        <h2 className="text-xl sm:text-2xl font-bold text-gray-900 tracking-tight">
          Find the Right BIS Standard for Your Product
        </h2>
        <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
          Describe your product specifications, category, and intended operational environment. Manak AI evaluates your parameters against Indian Standards (IS Codes) and Quality Control Orders.
        </p>
      </div>

      {/* Quick Fill Templates Section */}
      <div className="pt-4 border-t border-gray-100">
        <div className="flex items-center space-x-2 mb-3">
          <Lightbulb className="w-4 h-4 text-amber-600" />
          <span className="text-xs font-bold text-gray-800 uppercase tracking-wider">
            Quick Start: Click an Example Product to Pre-fill Form
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {EXAMPLE_PRODUCTS.map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => onSelectExample(item)}
              className="group p-3.5 bg-gray-50/80 hover:bg-red-50/30 border border-gray-200 hover:border-red-300 rounded-xl text-left transition-all shadow-2xs flex flex-col justify-between cursor-pointer"
            >
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-100 block w-fit mb-2">
                  {item.badge}
                </span>
                <h4 className="text-xs font-bold text-gray-900 group-hover:text-red-700 transition-colors">
                  {item.title}
                </h4>
                <p className="text-[11px] text-gray-500 mt-1 line-clamp-2">
                  {item.data.description}
                </p>
              </div>

              <div className="mt-3 pt-2 border-t border-gray-200/60 flex items-center justify-between text-[11px] font-semibold text-red-600">
                <span>Use Template</span>
                <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* How it works 3-step badge strip */}
      <div className="bg-gray-50 border border-gray-200 rounded-xl p-4 grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs text-gray-700">
        <div className="flex items-center space-x-2">
          <CheckCircle2 className="w-4 h-4 text-green-600 shrink-0" />
          <span>1. Enter product & intended use specs</span>
        </div>
        <div className="flex items-center space-x-2">
          <Sparkles className="w-4 h-4 text-blue-600 shrink-0" />
          <span>2. Semantic match against BIS index</span>
        </div>
        <div className="flex items-center space-x-2">
          <CheckCircle2 className="w-4 h-4 text-red-600 shrink-0" />
          <span>3. Get standard & certification path</span>
        </div>
      </div>
    </div>
  );
}

export default RecommendationEmptyState;
