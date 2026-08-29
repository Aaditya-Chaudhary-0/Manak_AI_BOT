import AppLayout from '../components/layout/AppLayout';
import HistoryList from '../components/history/HistoryList';
import { useApp } from '../context/AppContext';
import { History } from 'lucide-react';

export function HistoryPage() {
  const { history, removeHistoryItem, clearHistory } = useApp();

  return (
    <AppLayout
      pageTitle="History"
      pageSubtitle="Review your recent conversations, searches, and standard recommendations."
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
                    User Activity
                  </span>
                </div>
                <h1 className="text-xl sm:text-2xl font-bold text-gray-900 mt-1">
                  History
                </h1>
                <p className="text-xs sm:text-sm text-gray-600 mt-1 max-w-2xl leading-relaxed">
                  Review your recent conversations, searches and standard recommendations.
                </p>
              </div>

              <div className="hidden sm:flex p-3 rounded-xl bg-red-50 text-red-600 border border-red-100 shrink-0">
                <History className="w-6 h-6" />
              </div>
            </div>
          </div>

          {/* History List Component */}
          <HistoryList
            items={history}
            onRemoveItem={removeHistoryItem}
            onClearAll={clearHistory}
          />
        </div>
      </div>
    </AppLayout>
  );
}

export default HistoryPage;
