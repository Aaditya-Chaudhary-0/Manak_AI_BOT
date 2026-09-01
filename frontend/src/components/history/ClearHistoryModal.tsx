import { AlertTriangle, Trash2, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { modalVariants } from '../../styles/animation';

interface ClearHistoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

export function ClearHistoryModal({
  isOpen,
  onClose,
  onConfirm,
}: ClearHistoryModalProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <div
          className="fixed inset-0 bg-gray-900/50 backdrop-blur-2xs z-50 flex items-center justify-center p-4"
          onClick={onClose}
          role="dialog"
          aria-modal="true"
          aria-labelledby="clear-history-title"
        >
          <motion.div
            variants={modalVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="bg-white border border-gray-200 rounded-2xl shadow-2xl max-w-md w-full p-6 space-y-5"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-xl bg-red-50 text-[#D7193F] border border-red-100 flex items-center justify-center shrink-0">
                  <AlertTriangle className="w-5 h-5" />
                </div>
                <div>
                  <h3 id="clear-history-title" className="text-base font-bold text-gray-900">
                    Clear all history?
                  </h3>
                  <p className="text-xs text-gray-500 mt-0.5">
                    This action cannot be undone.
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={onClose}
                className="text-gray-400 hover:text-gray-600 p-1 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer"
                aria-label="Close modal"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="text-xs text-gray-600 leading-relaxed bg-[#F7F8FA] p-3.5 rounded-xl border border-gray-200">
              This action will remove your locally stored demo history, including recent AI conversations, standards searches, and product recommendation sessions.
            </p>

            <div className="flex items-center justify-end space-x-2 pt-2 border-t border-gray-100">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-800 text-xs font-semibold rounded-lg transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => {
                  onConfirm();
                  onClose();
                }}
                className="inline-flex items-center space-x-1.5 px-4 py-2 bg-[#D7193F] hover:bg-[#BE1435] text-white text-xs font-semibold rounded-lg shadow-2xs transition-colors cursor-pointer"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Clear History</span>
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}

export default ClearHistoryModal;
