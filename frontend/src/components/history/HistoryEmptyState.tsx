import { useNavigate } from 'react-router-dom';
import { History, MessageSquare, Search, ListTree } from 'lucide-react';

interface HistoryEmptyStateProps {
  filterType?: string;
}

export function HistoryEmptyState({ filterType = 'all' }: HistoryEmptyStateProps) {
  const navigate = useNavigate();

  return (
    <div className="bg-white border border-gray-200 rounded-xl p-8 sm:p-12 text-center max-w-lg mx-auto shadow-2xs space-y-5">
      <div className="w-12 h-12 rounded-2xl bg-gray-50 text-gray-400 border border-gray-200 mx-auto flex items-center justify-center">
        <History className="w-6 h-6" />
      </div>

      <div>
        <h3 className="text-base font-bold text-gray-900 mb-1">
          {filterType === 'all' ? 'No activity yet' : `No ${filterType} history found`}
        </h3>
        <p className="text-xs text-gray-500 max-w-sm mx-auto leading-relaxed">
          Your recent searches, AI conversations, and standard recommendations will appear here for easy access.
        </p>
      </div>

      <div className="flex flex-wrap items-center justify-center gap-2 pt-2">
        <button
          type="button"
          onClick={() => navigate('/app/assistant')}
          className="inline-flex items-center space-x-1.5 px-3.5 py-2 bg-red-600 hover:bg-red-700 text-white text-xs font-semibold rounded-lg shadow-2xs transition-colors cursor-pointer"
        >
          <MessageSquare className="w-3.5 h-3.5" />
          <span>Ask Manak AI</span>
        </button>

        <button
          type="button"
          onClick={() => navigate('/app/standards')}
          className="inline-flex items-center space-x-1.5 px-3.5 py-2 bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 text-xs font-semibold rounded-lg transition-colors cursor-pointer"
        >
          <Search className="w-3.5 h-3.5 text-gray-500" />
          <span>Search Standards</span>
        </button>

        <button
          type="button"
          onClick={() => navigate('/app/recommend')}
          className="inline-flex items-center space-x-1.5 px-3.5 py-2 bg-gray-100 hover:bg-gray-200 text-gray-800 text-xs font-semibold rounded-lg transition-colors cursor-pointer"
        >
          <ListTree className="w-3.5 h-3.5" />
          <span>Find a Standard</span>
        </button>
      </div>
    </div>
  );
}

export default HistoryEmptyState;
