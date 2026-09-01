import { useNavigate } from 'react-router-dom';
import { SearchX, Edit3, Search, MessageSquare, HelpCircle } from 'lucide-react';

interface RecommendationNoMatchStateProps {
  productName: string;
  onEditProduct: () => void;
}

export function RecommendationNoMatchState({
  productName,
  onEditProduct,
}: RecommendationNoMatchStateProps) {
  const navigate = useNavigate();

  return (
    <div className="bg-white border border-gray-200 rounded-xl p-8 text-center max-w-2xl mx-auto shadow-2xs space-y-6">
      <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 border border-amber-200 mx-auto flex items-center justify-center">
        <SearchX className="w-6 h-6" />
      </div>

      <div>
        <h3 className="text-xl font-bold text-gray-900 mb-1.5">
          No close match found in the current demo dataset
        </h3>
        <p className="text-xs text-gray-600 max-w-md mx-auto leading-relaxed">
          We could not find an exact match for <strong className="text-gray-900">"{productName}"</strong> in our loaded catalogue of Indian Standards.
        </p>
      </div>

      {/* Helpful suggestions box */}
      <div className="bg-gray-50 border border-gray-200 rounded-xl p-4 text-left text-xs text-gray-700 space-y-2">
        <div className="flex items-center space-x-1.5 font-bold text-gray-900">
          <HelpCircle className="w-4 h-4 text-blue-600" />
          <span>Recommended Next Actions:</span>
        </div>
        <ul className="list-disc list-inside space-y-1 pl-1 text-gray-600">
          <li>Try adding more specific electrical ratings, materials, or manufacturing descriptions.</li>
          <li>Ensure the selected category (e.g. Electrical, Construction, Food & Water) accurately matches the product.</li>
          <li>Search the broader BIS standards repository directly using keywords.</li>
          <li>Ask the Manak AI Assistant for general guidance on your product category.</li>
        </ul>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
        <button
          type="button"
          onClick={onEditProduct}
          className="inline-flex items-center space-x-1.5 px-4 py-2.5 bg-red-600 hover:bg-red-700 text-white text-xs font-bold uppercase tracking-wider rounded-lg shadow-sm transition-colors cursor-pointer"
        >
          <Edit3 className="w-4 h-4" />
          <span>Edit Product Details</span>
        </button>

        <button
          type="button"
          onClick={() => navigate('/app/standards')}
          className="inline-flex items-center space-x-1.5 px-4 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-800 text-xs font-bold uppercase tracking-wider rounded-lg transition-colors cursor-pointer"
        >
          <Search className="w-4 h-4" />
          <span>Browse All Standards</span>
        </button>

        <button
          type="button"
          onClick={() =>
            navigate('/app/assistant', {
              state: {
                initialQuery: `What BIS standards or Quality Control Orders apply to ${productName}?`,
              },
            })
          }
          className="inline-flex items-center space-x-1.5 px-4 py-2.5 bg-blue-50 hover:bg-blue-100 text-blue-800 border border-blue-200 text-xs font-bold uppercase tracking-wider rounded-lg transition-colors cursor-pointer"
        >
          <MessageSquare className="w-4 h-4 text-blue-600" />
          <span>Ask Manak AI</span>
        </button>
      </div>
    </div>
  );
}

export default RecommendationNoMatchState;
