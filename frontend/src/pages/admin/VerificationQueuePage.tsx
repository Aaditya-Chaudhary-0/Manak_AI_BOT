import { useState } from 'react';
import {
  ShieldCheck,
  X,
  AlertCircle,
} from 'lucide-react';
import AdminLayout from '../../layouts/AdminLayout';
import {
  INITIAL_VERIFICATION_QUEUE,
  type VerificationQueueItem,
} from '../../data/mockAdminData';
import { motion, AnimatePresence } from 'framer-motion';
import { modalVariants } from '../../styles/animation';

export function VerificationQueuePage() {
  const [queue, setQueue] = useState<VerificationQueueItem[]>(INITIAL_VERIFICATION_QUEUE);
  const [activeItem, setActiveItem] = useState<VerificationQueueItem | null>(null);
  const [confirmDialog, setConfirmDialog] = useState<{
    item: VerificationQueueItem;
    action: 'Approved' | 'Needs Review' | 'Rejected';
  } | null>(null);

  const handleActionClick = (
    item: VerificationQueueItem,
    action: 'Approved' | 'Needs Review' | 'Rejected'
  ) => {
    setConfirmDialog({ item, action });
  };

  const handleConfirmAction = () => {
    if (!confirmDialog) return;
    const { item, action } = confirmDialog;

    setQueue((prev) =>
      prev.map((q) => (q.id === item.id ? { ...q, status: action } : q))
    );
    setConfirmDialog(null);
    setActiveItem(null);
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* PAGE HEADER */}
        <div>
          <div className="flex items-center space-x-2 text-xs text-gray-500 mb-1">
            <span>Admin</span>
            <span>/</span>
            <span className="text-gray-900 font-medium">Verification Queue</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 tracking-tight">
            Verification Queue
          </h1>
          <p className="text-sm text-gray-600 mt-1">
            Review standards updates, gazette references, and compliance evidence ingested into MANAK AI.
          </p>
        </div>

        {/* QUEUE TABLE */}
        <div className="bg-white border border-gray-200 rounded-xl shadow-2xs overflow-hidden">
          <div className="px-4 py-3 bg-gray-50 border-b border-gray-200 flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <ShieldCheck className="h-5 w-5 text-red-600" />
              <h2 className="text-sm font-bold text-gray-900">
                Pending Verification Items ({queue.filter((q) => q.status === 'Pending').length})
              </h2>
            </div>
            <span className="text-xs text-gray-500">
              Sorted by Priority & Submission Date
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  <th className="py-3.5 px-4">Item Details</th>
                  <th className="py-3.5 px-4">Type</th>
                  <th className="py-3.5 px-4">Added</th>
                  <th className="py-3.5 px-4">Priority</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 text-sm">
                {queue.map((item) => (
                  <tr key={item.id} className="hover:bg-gray-50/80 transition-colors">
                    <td className="py-3.5 px-4">
                      <p className="font-bold text-gray-900 text-sm">{item.itemTitle}</p>
                      <p className="text-xs text-gray-500 mt-0.5">
                        Ref: {item.referenceDoc} • Submitted by: {item.submittedBy}
                      </p>
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="inline-flex px-2.5 py-0.5 text-xs font-semibold bg-gray-100 text-gray-800 rounded">
                        {item.itemType}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-xs text-gray-600 whitespace-nowrap">
                      {item.addedDate}
                    </td>
                    <td className="py-3.5 px-4">
                      <span
                        className={`inline-flex px-2.5 py-0.5 text-xs font-semibold rounded ${
                          item.priority === 'High'
                            ? 'bg-red-50 text-red-700 border border-red-200'
                            : item.priority === 'Medium'
                            ? 'bg-amber-50 text-amber-700 border border-amber-200'
                            : 'bg-blue-50 text-blue-700 border border-blue-200'
                        }`}
                      >
                        {item.priority}
                      </span>
                    </td>
                    <td className="py-3.5 px-4">
                      <span
                        className={`inline-flex items-center space-x-1 px-2.5 py-0.5 rounded text-xs font-semibold ${
                          item.status === 'Approved'
                            ? 'bg-green-50 text-green-700 border border-green-200'
                            : item.status === 'Rejected'
                            ? 'bg-red-50 text-red-700 border border-red-200'
                            : item.status === 'Needs Review'
                            ? 'bg-amber-50 text-amber-700 border border-amber-200'
                            : 'bg-blue-50 text-blue-700 border border-blue-200'
                        }`}
                      >
                        <span>{item.status}</span>
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <button
                        onClick={() => setActiveItem(item)}
                        className="px-3 py-1.5 text-xs font-semibold text-white bg-red-600 hover:bg-red-700 rounded-md transition-colors"
                      >
                        Review Item
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* ITEM DETAILS MODAL */}
        <AnimatePresence>
          {activeItem && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
              <motion.div 
                variants={modalVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-gray-200 relative space-y-4 max-h-[90vh] overflow-y-auto"
              >
                <button
                  onClick={() => setActiveItem(null)}
                  className="absolute right-4 top-4 text-gray-400 hover:text-gray-600 p-1 rounded-lg hover:bg-gray-100 transition-colors"
                  aria-label="Close verification detail"
                >
                  <X className="h-5 w-5" />
                </button>

                <div>
                  <div className="flex items-center space-x-2">
                    <span className="text-xs font-bold px-2 py-0.5 bg-red-100 text-[#D7193F] rounded">
                      {activeItem.itemType} Verification
                    </span>
                    <span className="text-xs text-gray-500 font-semibold">
                      Priority: {activeItem.priority}
                    </span>
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 mt-1">
                    {activeItem.itemTitle}
                  </h3>
                  <p className="text-xs text-gray-500">
                    Reference Document: {activeItem.referenceDoc}
                  </p>
                </div>

                <div className="p-3 bg-gray-50 border border-gray-200 rounded-xl text-xs space-y-1">
                  <span className="font-semibold text-gray-800 block">Ingested Clause Excerpt</span>
                  <p className="text-gray-700 leading-relaxed font-mono bg-white p-2 rounded-lg border border-gray-200">
                    "{activeItem.clauseExcerpt}"
                  </p>
                </div>

                {activeItem.notes && (
                  <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-900 space-y-0.5">
                    <span className="font-semibold block">Audit Notes</span>
                    <p className="text-amber-800">{activeItem.notes}</p>
                  </div>
                )}

                <div className="space-y-1 text-xs text-gray-600 pt-2 border-t border-gray-100">
                  <div className="flex justify-between">
                    <span>Submitted By:</span>
                    <span className="font-semibold text-gray-900">{activeItem.submittedBy}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Submission Date:</span>
                    <span className="font-semibold text-gray-900">{activeItem.addedDate}</span>
                  </div>
                </div>

                <div className="pt-4 border-t border-gray-100 flex items-center justify-between gap-2">
                  <button
                    onClick={() => handleActionClick(activeItem, 'Rejected')}
                    className="px-3 py-1.5 text-xs font-semibold text-[#D7193F] bg-red-50 hover:bg-red-100 border border-red-200 rounded-lg transition-colors cursor-pointer"
                  >
                    Reject Item
                  </button>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleActionClick(activeItem, 'Needs Review')}
                      className="px-3 py-1.5 text-xs font-semibold text-amber-800 bg-amber-50 hover:bg-amber-100 border border-amber-200 rounded-lg transition-colors cursor-pointer"
                    >
                      Request Review
                    </button>
                    <button
                      onClick={() => handleActionClick(activeItem, 'Approved')}
                      className="px-4 py-1.5 text-xs font-semibold text-white bg-[#0E8A43] hover:bg-green-700 rounded-lg transition-colors cursor-pointer"
                    >
                      Approve Item
                    </button>
                  </div>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>

        {/* CONFIRMATION DIALOG */}
        <AnimatePresence>
          {confirmDialog && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
              <motion.div 
                variants={modalVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                className="bg-white rounded-2xl max-w-sm w-full p-5 shadow-2xl border border-gray-200 space-y-4"
              >
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-blue-100 text-[#1677B7] rounded-full">
                    <AlertCircle className="h-5 w-5" />
                  </div>
                  <h3 className="text-base font-bold text-gray-900">
                    Confirm Verification Status
                  </h3>
                </div>
                <p className="text-xs text-gray-600 leading-relaxed">
                  Are you sure you want to mark <strong className="text-gray-900">{confirmDialog.item.itemTitle}</strong> as{' '}
                  <strong className="text-gray-900">{confirmDialog.action}</strong>?
                </p>
                <div className="flex items-center justify-end space-x-2 pt-2 border-t border-gray-100">
                  <button
                    onClick={() => setConfirmDialog(null)}
                    className="px-3 py-1.5 text-xs font-semibold text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleConfirmAction}
                    className="px-3 py-1.5 text-xs font-semibold text-white bg-[#D7193F] hover:bg-[#BE1435] rounded-lg transition-colors cursor-pointer"
                  >
                    Confirm Action
                  </button>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>
      </div>
    </AdminLayout>
  );
}

export default VerificationQueuePage;
