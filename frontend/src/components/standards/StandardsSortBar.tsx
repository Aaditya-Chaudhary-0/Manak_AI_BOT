import { SlidersHorizontal, ArrowUpDown, X } from 'lucide-react';
import type { FilterState } from './StandardsFilters';

export type SortOption = 'relevance' | 'year-desc' | 'code-asc';

interface StandardsSortBarProps {
  totalCount: number;
  sortOption: SortOption;
  onSortChange: (option: SortOption) => void;
  onOpenMobileFilters: () => void;
  filters: FilterState;
  onRemoveFilter: (key: keyof FilterState, value: string | number) => void;
  activeFilterCount: number;
}

export function StandardsSortBar({
  totalCount,
  sortOption,
  onSortChange,
  onOpenMobileFilters,
  filters,
  onRemoveFilter,
  activeFilterCount,
}: StandardsSortBarProps) {
  return (
    <div className="space-y-3">
      {/* Top summary row */}
      <div className="flex items-center justify-between flex-wrap gap-2">
        <div className="flex items-center space-x-2">
          <span className="text-sm font-bold text-gray-900">
            {totalCount} standard{totalCount !== 1 ? 's' : ''} found
          </span>
          <span className="text-[11px] text-gray-400 font-medium">
            (Demo catalogue index)
          </span>
        </div>

        <div className="flex items-center space-x-2">
          {/* Mobile Filter Button */}
          <button
            onClick={onOpenMobileFilters}
            className="lg:hidden inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 shadow-2xs"
          >
            <SlidersHorizontal className="w-3.5 h-3.5 text-gray-500" />
            <span>Filters</span>
            {activeFilterCount > 0 && (
              <span className="bg-red-600 text-white text-[10px] px-1.5 py-0.2 rounded-full font-bold">
                {activeFilterCount}
              </span>
            )}
          </button>

          {/* Sort Dropdown */}
          <div className="flex items-center space-x-1.5 bg-white border border-gray-300 rounded-lg px-2.5 py-1 text-xs shadow-2xs">
            <ArrowUpDown className="w-3.5 h-3.5 text-gray-400" />
            <span className="text-gray-500 font-medium hidden sm:inline">Sort:</span>
            <select
              value={sortOption}
              onChange={(e) => onSortChange(e.target.value as SortOption)}
              className="bg-transparent text-gray-900 font-semibold focus:outline-none cursor-pointer text-xs"
              aria-label="Sort standards results"
            >
              <option value="relevance">Relevance</option>
              <option value="year-desc">Publication Year (Newest)</option>
              <option value="code-asc">Standard Number (A-Z)</option>
            </select>
          </div>
        </div>
      </div>

      {/* Active Filter Chips */}
      {activeFilterCount > 0 && (
        <div className="flex items-center flex-wrap gap-1.5 pt-1">
          <span className="text-[11px] text-gray-400 font-medium">Active:</span>

          {filters.category.map((cat) => (
            <span
              key={cat}
              className="inline-flex items-center space-x-1 bg-gray-100 text-gray-800 text-xs px-2 py-0.5 rounded-md border border-gray-200"
            >
              <span>{cat}</span>
              <button
                onClick={() => onRemoveFilter('category', cat)}
                className="hover:text-red-600 p-0.5"
                aria-label={`Remove filter ${cat}`}
              >
                <X className="w-3 h-3" />
              </button>
            </span>
          ))}

          {filters.standardType.map((st) => (
            <span
              key={st}
              className="inline-flex items-center space-x-1 bg-blue-50 text-blue-800 text-xs px-2 py-0.5 rounded-md border border-blue-200"
            >
              <span>{st}</span>
              <button
                onClick={() => onRemoveFilter('standardType', st)}
                className="hover:text-red-600 p-0.5"
                aria-label={`Remove filter ${st}`}
              >
                <X className="w-3 h-3" />
              </button>
            </span>
          ))}

          {filters.status.map((st) => (
            <span
              key={st}
              className="inline-flex items-center space-x-1 bg-green-50 text-green-800 text-xs px-2 py-0.5 rounded-md border border-green-200"
            >
              <span>Status: {st}</span>
              <button
                onClick={() => onRemoveFilter('status', st)}
                className="hover:text-red-600 p-0.5"
                aria-label={`Remove filter ${st}`}
              >
                <X className="w-3 h-3" />
              </button>
            </span>
          ))}

          {filters.year.map((yr) => (
            <span
              key={yr}
              className="inline-flex items-center space-x-1 bg-gray-100 text-gray-800 text-xs px-2 py-0.5 rounded-md border border-gray-200"
            >
              <span>Year: {yr}</span>
              <button
                onClick={() => onRemoveFilter('year', yr)}
                className="hover:text-red-600 p-0.5"
                aria-label={`Remove filter ${yr}`}
              >
                <X className="w-3 h-3" />
              </button>
            </span>
          ))}
        </div>
      )}
    </div>
  );
}

export default StandardsSortBar;
