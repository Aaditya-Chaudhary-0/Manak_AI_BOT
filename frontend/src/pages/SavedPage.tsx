import AppLayout from '../components/layout/AppLayout';
import SavedList from '../components/saved/SavedList';
import { useApp } from '../context/AppContext';
import { Bookmark } from 'lucide-react';

export function SavedPage() {
  const {
    savedStandards,
    savedRecommendations,
    toggleSaveStandard,
    removeSavedRecommendation,
  } = useApp();

  return (
    <AppLayout
      pageTitle="Saved Standards & Recommendations"
      pageSubtitle="Keep important standards and recommendations within easy reach."
    >
      <div className="min-h-full bg-gray-50/50 pb-20">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-6 sm:py-8 space-y-6">
          {/* Header Banner */}
          <div className="bg-white border border-gray-200 rounded-xl p-5 sm:p-6 shadow-2xs">
            <div className="flex items-start justify-between gap-4">
              <div>
                <div className="flex items-center space-x-2">
                  <span className="w-2 h-2 rounded-full bg-red-600"></span>
                  <span className="text-xs font-bold text-gray-900 uppercase tracking-wider">
                    Bookmarks & Repositories
                  </span>
                </div>
                <h1 className="text-xl sm:text-2xl font-bold text-gray-900 mt-1">
                  Saved
                </h1>
                <p className="text-xs sm:text-sm text-gray-600 mt-1 max-w-2xl leading-relaxed">
                  Keep important standards and recommendations within easy reach.
                </p>
              </div>

              <div className="hidden sm:flex p-3 rounded-xl bg-red-50 text-red-600 border border-red-100 shrink-0">
                <Bookmark className="w-6 h-6" />
              </div>
            </div>
          </div>

          {/* Saved List Component */}
          <SavedList
            savedStandardIds={savedStandards}
            savedRecommendations={savedRecommendations}
            onRemoveStandard={toggleSaveStandard}
            onRemoveRecommendation={removeSavedRecommendation}
          />
        </div>
      </div>
    </AppLayout>
  );
}

export default SavedPage;
