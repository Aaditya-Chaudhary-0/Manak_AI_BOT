import { X, Check } from 'lucide-react';
import { StandardsFilters } from './StandardsFilters';
import type { FilterState } from './StandardsFilters';

interface MobileFilterDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  filters: FilterState;
  onFilterChange: (newFilters: FilterState) => void;
  onResetFilters: () => void;
  activeFilterCount: number;
}

export function MobileFilterDrawer({
  isOpen,
  onClose,
  filters,
  onFilterChange,
  onResetFilters,
  activeFilterCount,
}: MobileFilterDrawerProps) {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-gray-900/40 z-50 lg:hidden flex justify-end backdrop-blur-xs"
      onClick={onClose}
    >
      <div
        className="w-80 max-w-full bg-white h-full shadow-2xl flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-4 border-b border-gray-200 flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider">
              Filter Standards
            </h3>
            {activeFilterCount > 0 && (
              <span className="text-xs text-gray-500">
                {activeFilterCount} filter{activeFilterCount > 1 ? 's' : ''} applied
              </span>
            )}
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-md text-gray-400 hover:text-gray-700 hover:bg-gray-100"
            aria-label="Close filters"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-4">
          <StandardsFilters
            filters={filters}
            onFilterChange={onFilterChange}
            onResetFilters={onResetFilters}
            activeFilterCount={activeFilterCount}
          />
        </div>

        <div className="p-4 border-t border-gray-200 bg-gray-50 flex items-center space-x-2">
          <button
            onClick={onClose}
            className="flex-1 bg-red-600 hover:bg-red-700 text-white font-semibold py-2.5 px-4 rounded-lg text-xs flex items-center justify-center space-x-1 shadow-2xs"
          >
            <Check className="w-4 h-4" />
            <span>Apply Filters</span>
          </button>
        </div>
      </div>
    </div>
  );
}

export default MobileFilterDrawer;
