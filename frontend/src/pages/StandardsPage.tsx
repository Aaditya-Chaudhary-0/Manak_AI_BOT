import { useState, useMemo } from 'react';
import AppLayout from '../components/layout/AppLayout';
import StandardsSearchHeader from '../components/standards/StandardsSearchHeader';
import StandardsFilters from '../components/standards/StandardsFilters';
import type { FilterState } from '../components/standards/StandardsFilters';
import MobileFilterDrawer from '../components/standards/MobileFilterDrawer';
import StandardsSortBar from '../components/standards/StandardsSortBar';
import type { SortOption } from '../components/standards/StandardsSortBar';
import StandardsEmptyState from '../components/standards/StandardsEmptyState';
import StandardsLoadingState from '../components/standards/StandardsLoadingState';
import StandardCard from '../components/assistant/StandardCard';
import { MOCK_STANDARDS } from '../data/mockStandardsData';
import type { StandardDetail } from '../data/mockStandardsData';
import type { StandardItem } from '../data/mockAssistantData';

export function StandardsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [submittedQuery, setSubmittedQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);
  const [sortOption, setSortOption] = useState<SortOption>('relevance');

  const [filters, setFilters] = useState<FilterState>({
    category: [],
    status: [],
    standardType: [],
    year: [],
  });

  // Calculate active filter count
  const activeFilterCount = useMemo(() => {
    return (
      filters.category.length +
      filters.status.length +
      filters.standardType.length +
      filters.year.length
    );
  }, [filters]);

  const handleSearchSubmit = (query: string) => {
    setSubmittedQuery(query);
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
    }, 250);
  };

  const handleResetFilters = () => {
    setFilters({
      category: [],
      status: [],
      standardType: [],
      year: [],
    });
    setSearchQuery('');
    setSubmittedQuery('');
  };

  const handleRemoveFilter = (key: keyof FilterState, value: string | number) => {
    setFilters((prev) => ({
      ...prev,
      [key]: (prev[key] as (string | number)[]).filter((item) => item !== value),
    }));
  };

  // Filter & Sort results
  const filteredStandards = useMemo(() => {
    let list = [...MOCK_STANDARDS];

    // 1. Text Search Filter
    if (submittedQuery.trim()) {
      const q = submittedQuery.toLowerCase().trim();
      list = list.filter(
        (std) =>
          std.code.toLowerCase().includes(q) ||
          std.title.toLowerCase().includes(q) ||
          std.description.toLowerCase().includes(q) ||
          std.category.toLowerCase().includes(q) ||
          std.relevanceReason.toLowerCase().includes(q)
      );
    }

    // 2. Category Filter
    if (filters.category.length > 0) {
      list = list.filter((std) => filters.category.includes(std.category));
    }

    // 3. Status Filter
    if (filters.status.length > 0) {
      list = list.filter((std) => filters.status.includes(std.status));
    }

    // 4. Regulatory Type Filter
    if (filters.standardType.length > 0) {
      list = list.filter((std) => filters.standardType.includes(std.standardType));
    }

    // 5. Year Filter
    if (filters.year.length > 0) {
      list = list.filter((std) => filters.year.includes(std.year));
    }

    // 6. Sorting
    if (sortOption === 'year-desc') {
      list.sort((a, b) => b.year - a.year);
    } else if (sortOption === 'code-asc') {
      list.sort((a, b) => a.code.localeCompare(b.code));
    }

    return list;
  }, [submittedQuery, filters, sortOption]);

  // Convert StandardDetail to StandardItem for StandardCard reuse
  const mapDetailToCardItem = (std: StandardDetail): StandardItem => ({
    id: std.id,
    code: std.code,
    title: std.title,
    status: std.status,
    relevanceReason: std.relevanceReason,
    category: `${std.category} • ${std.year}`,
    link: `/app/standards/${std.id}`,
  });

  return (
    <AppLayout
      pageTitle="BIS Standards Search"
      pageSubtitle="Browse, filter, and inspect Bureau of Indian Standards catalogue"
    >
      <div className="min-h-full bg-gray-50/50 pb-16">
        {/* Search Bar & Suggestions Header */}
        <StandardsSearchHeader
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          onSearchSubmit={handleSearchSubmit}
        />

        {/* Content Container: Left Filters + Right Results */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Desktop Filters Sidebar */}
            <aside className="hidden lg:block lg:col-span-1">
              <div className="sticky top-20">
                <StandardsFilters
                  filters={filters}
                  onFilterChange={setFilters}
                  onResetFilters={handleResetFilters}
                  activeFilterCount={activeFilterCount}
                />
              </div>
            </aside>

            {/* Main Results Column */}
            <section className="lg:col-span-3 space-y-5">
              {/* Summary and Sort Header */}
              <StandardsSortBar
                totalCount={filteredStandards.length}
                sortOption={sortOption}
                onSortChange={setSortOption}
                onOpenMobileFilters={() => setIsMobileFilterOpen(true)}
                filters={filters}
                onRemoveFilter={handleRemoveFilter}
                activeFilterCount={activeFilterCount}
              />

              {/* Results / Empty / Loading States */}
              {isLoading ? (
                <StandardsLoadingState />
              ) : filteredStandards.length === 0 ? (
                <StandardsEmptyState
                  onClearFilters={handleResetFilters}
                  searchQuery={submittedQuery}
                />
              ) : (
                <div className="space-y-3.5">
                  {filteredStandards.map((std) => (
                    <StandardCard
                      key={std.id}
                      standard={mapDetailToCardItem(std)}
                    />
                  ))}
                </div>
              )}
            </section>
          </div>
        </div>

        {/* Mobile Slide-Over Filter Drawer */}
        <MobileFilterDrawer
          isOpen={isMobileFilterOpen}
          onClose={() => setIsMobileFilterOpen(false)}
          filters={filters}
          onFilterChange={setFilters}
          onResetFilters={handleResetFilters}
          activeFilterCount={activeFilterCount}
        />
      </div>
    </AppLayout>
  );
}

export default StandardsPage;
