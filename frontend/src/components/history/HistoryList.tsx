import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import type { HistoryItem } from '../../data/mockUserData';
import { 
  MessageSquare, 
  Search, 
  ListTree, 
  Trash2, 
  Clock, 
  ArrowUpRight, 
  X
} from 'lucide-react';
import ClearHistoryModal from './ClearHistoryModal';
import HistoryEmptyState from './HistoryEmptyState';

interface HistoryListProps {
  items: HistoryItem[];
  onRemoveItem: (id: string) => void;
  onClearAll: () => void;
}

export function HistoryList({
  items,
  onRemoveItem,
  onClearAll,
}: HistoryListProps) {
  const navigate = useNavigate();
  const [selectedTab, setSelectedTab] = useState<'all' | 'conversation' | 'search' | 'recommendation'>('all');
  const [isClearModalOpen, setIsClearModalOpen] = useState(false);

  const filteredItems = useMemo(() => {
    if (selectedTab === 'all') return items;
    return items.filter((item) => item.type === selectedTab);
  }, [items, selectedTab]);

  const counts = useMemo(() => {
    return {
      all: items.length,
      conversation: items.filter((i) => i.type === 'conversation').length,
      search: items.filter((i) => i.type === 'search').length,
      recommendation: items.filter((i) => i.type === 'recommendation').length,
    };
  }, [items]);

  const handleOpenItem = (item: HistoryItem) => {
    if (item.type === 'conversation') {
      navigate('/app/assistant', {
        state: { initialQuery: item.subtitle || item.title },
      });
    } else if (item.type === 'search') {
      navigate('/app/standards', {
        state: { initialSearchQuery: item.payload?.query || item.title },
      });
    } else if (item.type === 'recommendation') {
      navigate('/app/recommend');
    }
  };

  const getTypeBadge = (type: HistoryItem['type']) => {
    switch (type) {
      case 'conversation':
        return (
          <span className="inline-flex items-center space-x-1 text-[10px] font-bold uppercase tracking-wider text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
            <MessageSquare className="w-3 h-3" />
            <span>AI Chat</span>
          </span>
        );
      case 'search':
        return (
          <span className="inline-flex items-center space-x-1 text-[10px] font-bold uppercase tracking-wider text-green-700 bg-green-50 px-2 py-0.5 rounded border border-green-200">
            <Search className="w-3 h-3" />
            <span>Search</span>
          </span>
        );
      case 'recommendation':
        return (
          <span className="inline-flex items-center space-x-1 text-[10px] font-bold uppercase tracking-wider text-red-700 bg-red-50 px-2 py-0.5 rounded border border-red-200">
            <ListTree className="w-3 h-3" />
            <span>Matcher</span>
          </span>
        );
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Filter Tabs & Action Strip */}
      <div className="bg-white border border-gray-200 rounded-xl p-4 sm:p-5 shadow-2xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          {/* Segmented Filter Controls */}
          <div className="flex items-center space-x-1 overflow-x-auto pb-1 sm:pb-0 scrollbar-hide">
            <button
              type="button"
              onClick={() => setSelectedTab('all')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer ${
                selectedTab === 'all'
                  ? 'bg-red-600 text-white shadow-2xs'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              All Activity ({counts.all})
            </button>
            <button
              type="button"
              onClick={() => setSelectedTab('conversation')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer ${
                selectedTab === 'conversation'
                  ? 'bg-red-600 text-white shadow-2xs'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              AI Chats ({counts.conversation})
            </button>
            <button
              type="button"
              onClick={() => setSelectedTab('search')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer ${
                selectedTab === 'search'
                  ? 'bg-red-600 text-white shadow-2xs'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              Searches ({counts.search})
            </button>
            <button
              type="button"
              onClick={() => setSelectedTab('recommendation')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer ${
                selectedTab === 'recommendation'
                  ? 'bg-red-600 text-white shadow-2xs'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              Recommendations ({counts.recommendation})
            </button>
          </div>

          {/* Clear All Action */}
          {items.length > 0 && (
            <button
              type="button"
              onClick={() => setIsClearModalOpen(true)}
              className="inline-flex items-center space-x-1 text-xs font-semibold text-red-600 hover:text-red-700 hover:bg-red-50 px-2.5 py-1.5 rounded-lg transition-colors cursor-pointer shrink-0 w-fit"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Clear History</span>
            </button>
          )}
        </div>
      </div>

      {/* History Items List */}
      {filteredItems.length === 0 ? (
        <HistoryEmptyState filterType={selectedTab} />
      ) : (
        <div className="space-y-3">
          {filteredItems.map((item) => (
            <div
              key={item.id}
              className="bg-white border border-gray-200 hover:border-gray-300 rounded-xl p-4 sm:p-5 shadow-2xs transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4 group"
            >
              <div className="flex items-start space-x-3.5 min-w-0">
                <div className="mt-0.5 shrink-0">
                  {item.type === 'conversation' && (
                    <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center border border-blue-100">
                      <MessageSquare className="w-4 h-4" />
                    </div>
                  )}
                  {item.type === 'search' && (
                    <div className="w-8 h-8 rounded-lg bg-green-50 text-green-600 flex items-center justify-center border border-green-100">
                      <Search className="w-4 h-4" />
                    </div>
                  )}
                  {item.type === 'recommendation' && (
                    <div className="w-8 h-8 rounded-lg bg-red-50 text-red-600 flex items-center justify-center border border-red-100">
                      <ListTree className="w-4 h-4" />
                    </div>
                  )}
                </div>

                <div className="min-w-0 space-y-1">
                  <div className="flex items-center space-x-2 flex-wrap gap-y-1">
                    {getTypeBadge(item.type)}
                    {item.category && (
                      <span className="text-[11px] font-medium text-gray-500 bg-gray-50 px-2 py-0.5 rounded border border-gray-200">
                        {item.category}
                      </span>
                    )}
                    <span className="text-[11px] text-gray-400 flex items-center space-x-1">
                      <Clock className="w-3 h-3" />
                      <span>{item.timestamp}</span>
                    </span>
                  </div>

                  <h4 className="text-sm font-bold text-gray-900 leading-snug">
                    {item.title}
                  </h4>

                  {item.subtitle && (
                    <p className="text-xs text-gray-500 line-clamp-1">
                      {item.subtitle}
                    </p>
                  )}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center space-x-2 shrink-0 self-end sm:self-center">
                <button
                  type="button"
                  onClick={() => handleOpenItem(item)}
                  className="inline-flex items-center space-x-1 text-xs font-semibold px-3 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-800 rounded-lg transition-colors cursor-pointer"
                >
                  <span>
                    {item.type === 'conversation'
                      ? 'Open Chat'
                      : item.type === 'search'
                      ? 'Search Again'
                      : 'View Matcher'}
                  </span>
                  <ArrowUpRight className="w-3.5 h-3.5 text-gray-500" />
                </button>

                <button
                  type="button"
                  onClick={() => onRemoveItem(item.id)}
                  className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-gray-100 rounded-lg transition-colors cursor-pointer"
                  title="Remove from history"
                  aria-label="Remove item"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Confirmation Modal */}
      <ClearHistoryModal
        isOpen={isClearModalOpen}
        onClose={() => setIsClearModalOpen(false)}
        onConfirm={onClearAll}
      />
    </div>
  );
}

export default HistoryList;
