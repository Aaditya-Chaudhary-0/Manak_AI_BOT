import { useState, useRef, useEffect } from 'react';
import { Search, X, TrendingUp } from 'lucide-react';
import { SEARCH_SUGGESTIONS } from '../../data/mockStandardsData';

interface StandardsSearchHeaderProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onSearchSubmit: (query: string) => void;
}

export function StandardsSearchHeader({
  searchQuery,
  onSearchChange,
  onSearchSubmit,
}: StandardsSearchHeaderProps) {
  const [isFocused, setIsFocused] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Close suggestions when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsFocused(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleClear = () => {
    onSearchChange('');
    onSearchSubmit('');
  };

  const handleSelectSuggestion = (suggestion: string) => {
    onSearchChange(suggestion);
    onSearchSubmit(suggestion);
    setIsFocused(false);
  };

  return (
    <div className="bg-white border-b border-gray-200 px-4 sm:px-6 py-6" ref={containerRef}>
      <div className="max-w-4xl mx-auto">
        <div className="mb-4 text-center sm:text-left">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 tracking-tight">
            BIS Standards Catalogue
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Find Indian Standards, specifications, and regulatory Quality Control Orders (QCO) relevant to your product.
          </p>
        </div>

        {/* Search Bar */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            onSearchSubmit(searchQuery);
            setIsFocused(false);
          }}
          className="relative flex items-center bg-white border border-gray-300 rounded-xl shadow-xs focus-within:border-blue-600 focus-within:ring-2 focus-within:ring-blue-100 transition-all p-1.5"
        >
          <div className="pl-3 text-gray-400">
            <Search className="w-5 h-5" />
          </div>

          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            onFocus={() => setIsFocused(true)}
            placeholder="Search by standard number (e.g. IS 16102, IS 269), title, product or keyword..."
            className="flex-1 py-2 px-3 text-sm sm:text-base text-gray-900 placeholder:text-gray-400 bg-transparent focus:outline-none"
            aria-label="Search BIS standards"
          />

          {searchQuery && (
            <button
              type="button"
              onClick={handleClear}
              className="p-1.5 text-gray-400 hover:text-gray-600 rounded-md hover:bg-gray-100 mr-1"
              aria-label="Clear search"
            >
              <X className="w-4 h-4" />
            </button>
          )}

          <button
            type="submit"
            className="bg-red-600 hover:bg-red-700 text-white text-xs sm:text-sm font-semibold px-5 py-2.5 rounded-lg transition-colors shadow-2xs"
          >
            Search
          </button>
        </form>

        {/* Suggestions Dropdown / Quick Links */}
        {isFocused && (
          <div className="mt-2 bg-white border border-gray-200 rounded-xl shadow-lg p-3 z-30 relative animate-in fade-in duration-100">
            <div className="flex items-center space-x-1 text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2 px-1">
              <TrendingUp className="w-3.5 h-3.5 text-gray-500" />
              <span>Popular Searches</span>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {SEARCH_SUGGESTIONS.map((sugg) => (
                <button
                  key={sugg}
                  type="button"
                  onClick={() => handleSelectSuggestion(sugg)}
                  className="px-2.5 py-1 text-xs font-medium text-gray-700 bg-gray-50 hover:bg-red-50 hover:text-red-700 border border-gray-200 hover:border-red-200 rounded-lg transition-colors"
                >
                  {sugg}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Quick Suggestion Chips below search when not focused */}
        {!isFocused && (
          <div className="mt-3 flex items-center space-x-2 overflow-x-auto pb-1 text-xs scrollbar-none">
            <span className="text-gray-400 font-medium shrink-0">Try searching:</span>
            {SEARCH_SUGGESTIONS.slice(0, 5).map((sugg) => (
              <button
                key={sugg}
                onClick={() => handleSelectSuggestion(sugg)}
                className="whitespace-nowrap px-2 py-0.5 text-gray-600 hover:text-blue-700 bg-gray-100 hover:bg-blue-50 rounded text-[11px] font-medium border border-gray-200 transition-colors"
              >
                {sugg}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default StandardsSearchHeader;
