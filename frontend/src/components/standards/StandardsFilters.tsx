import { Filter, RotateCcw } from 'lucide-react';
import { 
  CATEGORIES_LIST, 
  STATUS_LIST, 
  STANDARD_TYPE_LIST, 
  YEARS_LIST 
} from '../../data/mockStandardsData';

export interface FilterState {
  category: string[];
  status: string[];
  standardType: string[];
  year: number[];
}

interface StandardsFiltersProps {
  filters: FilterState;
  onFilterChange: (newFilters: FilterState) => void;
  onResetFilters: () => void;
  activeFilterCount: number;
}

export function StandardsFilters({
  filters,
  onFilterChange,
  onResetFilters,
  activeFilterCount,
}: StandardsFiltersProps) {
  const toggleArrayItem = <T,>(list: T[], item: T): T[] => {
    return list.includes(item) ? list.filter((i) => i !== item) : [...list, item];
  };

  const handleCategoryToggle = (cat: string) => {
    onFilterChange({
      ...filters,
      category: toggleArrayItem(filters.category, cat),
    });
  };

  const handleStatusToggle = (st: string) => {
    onFilterChange({
      ...filters,
      status: toggleArrayItem(filters.status, st),
    });
  };

  const handleTypeToggle = (type: string) => {
    onFilterChange({
      ...filters,
      standardType: toggleArrayItem(filters.standardType, type),
    });
  };

  const handleYearToggle = (yr: number) => {
    onFilterChange({
      ...filters,
      year: toggleArrayItem(filters.year, yr),
    });
  };

  return (
    <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-2xs space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-gray-100 pb-3">
        <div className="flex items-center space-x-2">
          <Filter className="w-4 h-4 text-gray-500" />
          <span className="text-xs font-bold text-gray-900 uppercase tracking-wider">
            Filters {activeFilterCount > 0 && `(${activeFilterCount})`}
          </span>
        </div>
        {activeFilterCount > 0 && (
          <button
            onClick={onResetFilters}
            className="inline-flex items-center space-x-1 text-xs text-red-600 hover:text-red-700 font-medium"
          >
            <RotateCcw className="w-3 h-3" />
            <span>Reset</span>
          </button>
        )}
      </div>

      {/* 1. Category */}
      <div className="space-y-2">
        <h4 className="text-xs font-bold text-gray-800 uppercase tracking-wider">
          Category
        </h4>
        <div className="space-y-1.5">
          {CATEGORIES_LIST.map((cat) => {
            const isChecked = filters.category.includes(cat);
            return (
              <label
                key={cat}
                className="flex items-center space-x-2 text-xs text-gray-700 hover:text-gray-900 cursor-pointer select-none"
              >
                <input
                  type="checkbox"
                  checked={isChecked}
                  onChange={() => handleCategoryToggle(cat)}
                  className="rounded border-gray-300 text-red-600 focus:ring-red-500 w-3.5 h-3.5"
                />
                <span className={isChecked ? 'font-semibold text-gray-900' : ''}>
                  {cat}
                </span>
              </label>
            );
          })}
        </div>
      </div>

      {/* 2. Regulatory Standard Type */}
      <div className="space-y-2 border-t border-gray-100 pt-3">
        <h4 className="text-xs font-bold text-gray-800 uppercase tracking-wider">
          Regulatory Type
        </h4>
        <div className="space-y-1.5">
          {STANDARD_TYPE_LIST.map((type) => {
            const isChecked = filters.standardType.includes(type);
            return (
              <label
                key={type}
                className="flex items-center space-x-2 text-xs text-gray-700 hover:text-gray-900 cursor-pointer select-none"
              >
                <input
                  type="checkbox"
                  checked={isChecked}
                  onChange={() => handleTypeToggle(type)}
                  className="rounded border-gray-300 text-red-600 focus:ring-red-500 w-3.5 h-3.5"
                />
                <span className={isChecked ? 'font-semibold text-gray-900' : ''}>
                  {type}
                </span>
              </label>
            );
          })}
        </div>
      </div>

      {/* 3. Status */}
      <div className="space-y-2 border-t border-gray-100 pt-3">
        <h4 className="text-xs font-bold text-gray-800 uppercase tracking-wider">
          Status
        </h4>
        <div className="space-y-1.5">
          {STATUS_LIST.map((st) => {
            const isChecked = filters.status.includes(st);
            return (
              <label
                key={st}
                className="flex items-center space-x-2 text-xs text-gray-700 hover:text-gray-900 cursor-pointer select-none"
              >
                <input
                  type="checkbox"
                  checked={isChecked}
                  onChange={() => handleStatusToggle(st)}
                  className="rounded border-gray-300 text-red-600 focus:ring-red-500 w-3.5 h-3.5"
                />
                <span className={isChecked ? 'font-semibold text-gray-900' : ''}>
                  {st}
                </span>
              </label>
            );
          })}
        </div>
      </div>

      {/* 4. Publication Year */}
      <div className="space-y-2 border-t border-gray-100 pt-3">
        <h4 className="text-xs font-bold text-gray-800 uppercase tracking-wider">
          Publication Year
        </h4>
        <div className="grid grid-cols-2 gap-1.5">
          {YEARS_LIST.map((yr) => {
            const isChecked = filters.year.includes(yr);
            return (
              <label
                key={yr}
                className={`flex items-center justify-center px-2 py-1 rounded text-xs cursor-pointer border select-none transition-colors ${
                  isChecked
                    ? 'bg-red-50 text-red-700 font-semibold border-red-300'
                    : 'bg-gray-50 text-gray-600 border-gray-200 hover:bg-gray-100'
                }`}
              >
                <input
                  type="checkbox"
                  checked={isChecked}
                  onChange={() => handleYearToggle(yr)}
                  className="sr-only"
                />
                <span>{yr}</span>
              </label>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default StandardsFilters;
