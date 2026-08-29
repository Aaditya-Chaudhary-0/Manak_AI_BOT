import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Bookmark, BookmarkCheck, ArrowUpRight, CheckCircle2 } from 'lucide-react';
import type { StandardItem } from '../../data/mockAssistantData';
import { useApp } from '../../context/AppContext';
import { motion } from 'framer-motion';


interface StandardCardProps {
  standard: StandardItem;
  onSaveToggle?: (standardId: string, isSaved: boolean) => void;
}

export function StandardCard({ standard, onSaveToggle }: StandardCardProps) {
  const { isStandardSaved, toggleSaveStandard } = useApp();
  const isSavedInContext = isStandardSaved ? isStandardSaved(standard.id) : false;
  const [localSaved, setLocalSaved] = useState(isSavedInContext);

  useEffect(() => {
    setLocalSaved(isSavedInContext);
  }, [isSavedInContext]);

  const handleSave = () => {
    if (toggleSaveStandard) {
      toggleSaveStandard(standard.id);
    }
    const nextState = !localSaved;
    setLocalSaved(nextState);
    if (onSaveToggle) {
      onSaveToggle(standard.id, nextState);
    }
  };

  const isSaved = localSaved;

  const detailLink = standard.link && standard.link !== '/app/standards'
    ? standard.link
    : `/app/standards/${standard.id}`;

  return (
    <div className="bg-white border border-gray-200 rounded-xl p-4 hover:border-blue-200 hover:-translate-y-1 hover:shadow-md transition-all duration-200 ease-out shadow-sm">
      <div className="flex items-start justify-between gap-3">
        <div>
          <div className="flex items-center space-x-2 flex-wrap gap-y-1">
            <span className="font-mono text-sm font-bold text-gray-900 bg-gray-100 px-2 py-0.5 rounded border border-gray-200">
              {standard.code}
            </span>
            <span className="inline-flex items-center space-x-1 text-[11px] font-medium text-green-700 bg-green-50 px-2 py-0.5 rounded border border-green-200">
              <CheckCircle2 className="w-3 h-3" />
              <span>{standard.status}</span>
            </span>
            {standard.category && (
              <span className="text-[11px] font-medium text-gray-500 bg-gray-50 px-2 py-0.5 rounded border border-gray-100">
                {standard.category}
              </span>
            )}
          </div>
          <h4 className="font-semibold text-gray-900 text-sm mt-2 leading-snug">
            {standard.title}
          </h4>
        </div>

        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={handleSave}
          className={`shrink-0 inline-flex items-center space-x-1 px-2.5 py-1 rounded-md text-xs font-medium border transition-colors ${
            isSaved
              ? 'bg-red-50 text-red-700 border-red-200'
              : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50 hover:text-gray-900'
          }`}
          title={isSaved ? 'Standard is saved' : 'Save standard to your bookmarks'}
          aria-label={isSaved ? 'Saved standard' : 'Save standard'}
        >
          {isSaved ? (
            <>
              <BookmarkCheck className="w-3.5 h-3.5 text-red-600 fill-red-600" />
              <span className="font-semibold text-red-600">Saved</span>
            </>
          ) : (
            <>
              <Bookmark className="w-3.5 h-3.5 text-gray-500" />
              <span>Save</span>
            </>
          )}
        </motion.button>
      </div>

      <div className="mt-2.5 bg-gray-50/70 rounded-lg p-2.5 border border-gray-100 text-xs text-gray-700">
        <span className="font-medium text-gray-900">Why relevant: </span>
        <span>{standard.relevanceReason}</span>
      </div>

      <div className="mt-3 pt-2.5 border-t border-gray-100 flex items-center justify-between">
        <span className="text-[11px] text-gray-400">
          Indian Standard Specification
        </span>
        <Link
          to={detailLink}
          className="inline-flex items-center space-x-1 text-xs font-semibold text-blue-700 hover:text-blue-900 group"
        >
          <span>View Standard Details</span>
          <ArrowUpRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
        </Link>
      </div>
    </div>
  );
}

export default StandardCard;
