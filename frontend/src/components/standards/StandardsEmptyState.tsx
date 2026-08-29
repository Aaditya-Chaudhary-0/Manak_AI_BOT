import { SearchX, RotateCcw, HelpCircle } from 'lucide-react';

interface StandardsEmptyStateProps {
  onClearFilters: () => void;
  searchQuery?: string;
}

export function StandardsEmptyState({ onClearFilters, searchQuery }: StandardsEmptyStateProps) {
  return (
    <div className="bg-white border border-gray-200 rounded-2xl p-10 text-center max-w-xl mx-auto shadow-2xs">
      <div className="w-12 h-12 rounded-2xl bg-gray-100 text-gray-500 mx-auto flex items-center justify-center mb-4">
        <SearchX className="w-6 h-6" />
      </div>

      <h3 className="text-lg font-bold text-gray-900 mb-1">
        No standards found
      </h3>

      <p className="text-xs text-gray-500 mb-6 max-w-md mx-auto">
        {searchQuery ? (
          <>We couldn't find any Indian Standards matching <strong className="text-gray-800">"{searchQuery}"</strong> with the selected filters.</>
        ) : (
          <>No Indian Standards match the currently active filter combination.</>
        )}
      </p>

      <div className="bg-gray-50 border border-gray-200 rounded-xl p-4 text-left text-xs text-gray-700 mb-6 space-y-2">
        <div className="flex items-center space-x-1.5 font-bold text-gray-900">
          <HelpCircle className="w-4 h-4 text-blue-600" />
          <span>Search Suggestions:</span>
        </div>
        <ul className="list-disc list-inside space-y-1 pl-1 text-gray-600">
          <li>Check for typos or try broader keywords (e.g. "LED", "Cement", "Steel").</li>
          <li>Search directly by standard number prefix (e.g. "IS 16102", "IS 269").</li>
          <li>Try removing specific category or publication year filters.</li>
        </ul>
      </div>

      <button
        onClick={onClearFilters}
        className="inline-flex items-center space-x-1.5 px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-xs font-semibold rounded-lg shadow-2xs transition-colors"
      >
        <RotateCcw className="w-3.5 h-3.5" />
        <span>Clear All Filters & Search</span>
      </button>
    </div>
  );
}

export default StandardsEmptyState;
