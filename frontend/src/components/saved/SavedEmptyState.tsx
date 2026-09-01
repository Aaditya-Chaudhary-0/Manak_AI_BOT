import { useNavigate } from 'react-router-dom';
import { Bookmark, Search, ListTree } from 'lucide-react';

interface SavedEmptyStateProps {
  filterType?: string;
}

export function SavedEmptyState({ filterType = 'all' }: SavedEmptyStateProps) {
  const navigate = useNavigate();

  return (
    <div className="bg-white border border-gray-200 rounded-xl p-8 sm:p-12 text-center max-w-lg mx-auto shadow-2xs space-y-5">
      <div className="w-12 h-12 rounded-2xl bg-gray-50 text-gray-400 border border-gray-200 mx-auto flex items-center justify-center">
        <Bookmark className="w-6 h-6" />
      </div>

      <div>
        <h3 className="text-base font-bold text-gray-900 mb-1">
          {filterType === 'all' ? 'No saved items yet' : `No saved ${filterType} found`}
        </h3>
        <p className="text-xs text-gray-500 max-w-sm mx-auto leading-relaxed">
          Save important standards and product recommendation results to quickly access them anytime.
        </p>
      </div>

      <div className="flex flex-wrap items-center justify-center gap-2 pt-2">
        <button
          type="button"
          onClick={() => navigate('/app/standards')}
          className="inline-flex items-center space-x-1.5 px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-xs font-semibold rounded-lg shadow-2xs transition-colors cursor-pointer"
        >
          <Search className="w-3.5 h-3.5" />
          <span>Explore Standards Catalogue</span>
        </button>

        <button
          type="button"
          onClick={() => navigate('/app/recommend')}
          className="inline-flex items-center space-x-1.5 px-4 py-2 bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 text-xs font-semibold rounded-lg transition-colors cursor-pointer"
        >
          <ListTree className="w-3.5 h-3.5 text-gray-500" />
          <span>Find Relevant Standard</span>
        </button>
      </div>
    </div>
  );
}

export default SavedEmptyState;
