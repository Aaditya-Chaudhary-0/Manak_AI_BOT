import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import type { SavedRecommendationItem } from '../../data/mockUserData';
import { MOCK_STANDARDS, type StandardDetail } from '../../data/mockStandardsData';
import StandardCard from '../assistant/StandardCard';
import type { StandardItem } from '../../data/mockAssistantData';
import { 
  BookmarkCheck, 
  ArrowUpRight, 
  ListTree, 
  FileText
} from 'lucide-react';
import SavedEmptyState from './SavedEmptyState';
import { motion, AnimatePresence } from 'framer-motion';

interface SavedListProps {
  savedStandardIds: string[];
  savedRecommendations: SavedRecommendationItem[];
  onRemoveStandard: (id: string) => void;
  onRemoveRecommendation: (id: string) => void;
}

export function SavedList({
  savedStandardIds,
  savedRecommendations,
  onRemoveStandard,
  onRemoveRecommendation,
}: SavedListProps) {
  const [selectedTab, setSelectedTab] = useState<'all' | 'standards' | 'recommendations'>('all');
  const [feedbackToast, setFeedbackToast] = useState<string | null>(null);

  // Retrieve full StandardDetail objects from mockStandardsData
  const savedStandardsList = useMemo(() => {
    return MOCK_STANDARDS.filter((std) => savedStandardIds.includes(std.id));
  }, [savedStandardIds]);

  const showToast = (msg: string) => {
    setFeedbackToast(msg);
    setTimeout(() => setFeedbackToast(null), 2500);
  };

  const handleUnsaveStandard = (stdId: string) => {
    onRemoveStandard(stdId);
    showToast('Removed from Saved Standards');
  };

  const handleUnsaveRec = (recId: string) => {
    onRemoveRecommendation(recId);
    showToast('Removed from Saved Recommendations');
  };

  const totalCount = savedStandardsList.length + savedRecommendations.length;

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
    <div className="space-y-6">
      {/* Toast Banner */}
      {feedbackToast && (
        <div className="bg-gray-900 text-white text-xs font-semibold px-4 py-2.5 rounded-xl shadow-lg flex items-center justify-between animate-fade-in">
          <span>{feedbackToast}</span>
          <span className="text-[10px] text-gray-400">Updated</span>
        </div>
      )}

      {/* Top Filter Bar */}
      <div className="bg-white border border-gray-200 rounded-xl p-4 sm:p-5 shadow-2xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center space-x-1 overflow-x-auto pb-1 sm:pb-0">
            <button
              type="button"
              onClick={() => setSelectedTab('all')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer ${
                selectedTab === 'all'
                  ? 'bg-red-600 text-white shadow-2xs'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              All Saved ({totalCount})
            </button>
            <button
              type="button"
              onClick={() => setSelectedTab('standards')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer ${
                selectedTab === 'standards'
                  ? 'bg-red-600 text-white shadow-2xs'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              Standards ({savedStandardsList.length})
            </button>
            <button
              type="button"
              onClick={() => setSelectedTab('recommendations')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer ${
                selectedTab === 'recommendations'
                  ? 'bg-red-600 text-white shadow-2xs'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              Recommendations ({savedRecommendations.length})
            </button>
          </div>

          <span className="text-xs text-gray-500 font-medium">
            Saved items remain cached locally
          </span>
        </div>
      </div>

      {/* Content Rendering */}
      {totalCount === 0 ||
      (selectedTab === 'standards' && savedStandardsList.length === 0) ||
      (selectedTab === 'recommendations' && savedRecommendations.length === 0) ? (
        <SavedEmptyState filterType={selectedTab} />
      ) : (
        <div className="space-y-6">
          {/* Section 1: Standards */}
          {(selectedTab === 'all' || selectedTab === 'standards') &&
            savedStandardsList.length > 0 && (
              <div className="space-y-3">
                {selectedTab === 'all' && (
                  <div className="flex items-center space-x-2">
                    <FileText className="w-4 h-4 text-blue-600" />
                    <h3 className="text-xs font-bold text-gray-900 uppercase tracking-wider">
                      Saved Standards ({savedStandardsList.length})
                    </h3>
                  </div>
                )}

                <div className="space-y-3">
                  <AnimatePresence>
                    {savedStandardsList.map((std) => (
                      <motion.div 
                        key={std.id} 
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0, scale: 0.95 }}
                        transition={{ duration: 0.2 }}
                        className="relative group"
                      >
                        <StandardCard
                          standard={mapDetailToCardItem(std)}
                          onSaveToggle={(id) => handleUnsaveStandard(id)}
                        />
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>
              </div>
            )}

          {/* Section 2: Saved Product Recommendations */}
          {(selectedTab === 'all' || selectedTab === 'recommendations') &&
            savedRecommendations.length > 0 && (
              <div className="space-y-3">
                {selectedTab === 'all' && (
                  <div className="flex items-center space-x-2 pt-2">
                    <ListTree className="w-4 h-4 text-red-600" />
                    <h3 className="text-xs font-bold text-gray-900 uppercase tracking-wider">
                      Saved Product Recommendations ({savedRecommendations.length})
                    </h3>
                  </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <AnimatePresence>
                    {savedRecommendations.map((rec) => (
                      <motion.div
                        key={rec.id}
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.9 }}
                        transition={{ duration: 0.2 }}
                        className="bg-white border border-gray-200 hover:border-gray-300 rounded-xl p-5 shadow-2xs transition-all flex flex-col justify-between space-y-4"
                      >
                        <div className="space-y-2">
                          <div className="flex items-start justify-between gap-2">
                            <span className="text-[10px] font-bold uppercase tracking-wider text-red-700 bg-red-50 px-2 py-0.5 rounded border border-red-200">
                              {rec.category}
                            </span>
                            <motion.button
                              whileTap={{ scale: 0.95 }}
                              type="button"
                              onClick={() => handleUnsaveRec(rec.id)}
                              className="inline-flex items-center space-x-1 text-xs font-medium text-red-600 hover:text-red-700 bg-red-50/50 hover:bg-red-50 px-2.5 py-1 rounded-md border border-red-200 transition-colors cursor-pointer"
                              title="Remove from saved"
                            >
                              <BookmarkCheck className="w-3.5 h-3.5 fill-red-600 text-red-600" />
                              <span>Saved</span>
                            </motion.button>
                          </div>

                          <h4 className="text-sm font-bold text-gray-900">
                            {rec.productName}
                          </h4>

                          <div className="bg-gray-50/80 rounded-lg p-3 border border-gray-100 text-xs space-y-1">
                            <div className="flex items-center justify-between">
                              <span className="font-mono font-bold text-gray-900">
                                {rec.standardCode}
                              </span>
                              <span className="text-[11px] font-semibold text-green-700 bg-green-50 px-2 py-0.5 rounded border border-green-200">
                                {rec.relevanceLevel}
                              </span>
                            </div>
                            <p className="text-gray-600 line-clamp-1">
                              {rec.standardTitle}
                            </p>
                          </div>
                        </div>

                        <div className="pt-3 border-t border-gray-100 flex items-center justify-between">
                          <span className="text-[11px] text-gray-400">
                            Saved {rec.savedAt}
                          </span>
                          <div className="flex items-center space-x-2">
                            <Link
                              to={`/app/standards/${rec.standardId}`}
                              className="inline-flex items-center space-x-1 text-xs font-semibold text-blue-700 hover:text-blue-900"
                            >
                              <span>Standard</span>
                              <ArrowUpRight className="w-3.5 h-3.5" />
                            </Link>
                            <span className="text-gray-300">|</span>
                            <Link
                              to="/app/recommend"
                              className="inline-flex items-center space-x-1 text-xs font-semibold text-red-600 hover:text-red-700"
                            >
                              <span>Matcher</span>
                            </Link>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>
              </div>
            )}
        </div>
      )}
    </div>
  );
}

export default SavedList;
