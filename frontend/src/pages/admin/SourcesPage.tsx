import { useState } from 'react';
import {
  CheckCircle2,
  AlertCircle,
  FileText,
  X,
  Search,
} from 'lucide-react';
import AdminLayout from '../../layouts/AdminLayout';
import {
  INITIAL_ADMIN_SOURCES,
  type AdminSourceItem,
} from '../../data/mockAdminData';
import { motion, AnimatePresence } from 'framer-motion';
import { modalVariants } from '../../styles/animation';

export function SourcesPage() {
  const [sources, setSources] = useState<AdminSourceItem[]>(INITIAL_ADMIN_SOURCES);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState<string>('all');
  const [activeSourceModal, setActiveSourceModal] = useState<AdminSourceItem | null>(null);

  const filteredSources = sources.filter((s) => {
    const matchesSearch =
      s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.referenceNo.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.publishingAuthority.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesType = selectedType === 'all' || s.type === selectedType;

    return matchesSearch && matchesType;
  });

  const handleUpdateStatus = (id: string, newStatus: 'Verified' | 'Needs Review') => {
    setSources((prev) =>
      prev.map((item) =>
        item.id === id
          ? {
              ...item,
              status: newStatus,
              verificationState: newStatus === 'Verified' ? 'Approved' : 'Review Required',
            }
          : item
      )
    );
    setActiveSourceModal(null);
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* PAGE HEADER */}
        <div>
          <div className="flex items-center space-x-2 text-xs text-gray-500 mb-1">
            <span>Admin</span>
            <span>/</span>
            <span className="text-gray-900 font-medium">Sources & Evidence</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 tracking-tight">
            Sources & Evidence Management
          </h1>
          <p className="text-sm text-gray-600 mt-1">
            Inspect legal gazette notifications, regulatory mandates, clause citations, and evidence documents.
          </p>
        </div>

        {/* SEARCH & FILTERS */}
        <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-2xs space-y-3">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search source name, gazette reference, or publishing authority..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-4 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-600 focus:border-red-600 bg-white"
              />
            </div>
            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className="px-3 py-2 text-sm border border-gray-300 rounded-lg bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-red-600"
            >
              <option value="all">All Source Types</option>
              <option value="Gazette Notification">Gazette Notification</option>
              <option value="Regulatory Circular">Regulatory Circular</option>
              <option value="Technical Manual">Technical Manual</option>
              <option value="Standard Clause">Standard Clause</option>
            </select>
          </div>
        </div>

        {/* SOURCES TABLE */}
        <div className="bg-white border border-gray-200 rounded-xl shadow-2xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  <th className="py-3.5 px-4">Source Title</th>
                  <th className="py-3.5 px-4">Type & Reference</th>
                  <th className="py-3.5 px-4">Publishing Body</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-4">Last Reviewed</th>
                  <th className="py-3.5 px-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 text-sm">
                {filteredSources.map((src) => (
                  <tr key={src.id} className="hover:bg-gray-50/80 transition-colors">
                    <td className="py-3.5 px-4">
                      <p className="font-semibold text-gray-900 text-sm line-clamp-1">
                        {src.name}
                      </p>
                      <p className="text-xs text-gray-500 line-clamp-1 mt-0.5">
                        {src.clauseSummary}
                      </p>
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="inline-flex px-2 py-0.5 text-xs font-medium bg-blue-50 text-blue-700 rounded border border-blue-200">
                        {src.type}
                      </span>
                      <p className="text-xs font-mono text-gray-600 mt-1">{src.referenceNo}</p>
                    </td>
                    <td className="py-3.5 px-4 text-xs text-gray-700 font-medium">
                      {src.publishingAuthority}
                    </td>
                    <td className="py-3.5 px-4">
                      <span
                        className={`inline-flex items-center space-x-1 px-2.5 py-0.5 rounded text-xs font-semibold ${
                          src.status === 'Verified'
                            ? 'bg-green-50 text-green-700 border border-green-200'
                            : src.status === 'Needs Review'
                            ? 'bg-amber-50 text-amber-700 border border-amber-200'
                            : 'bg-gray-100 text-gray-700 border border-gray-200'
                        }`}
                      >
                        {src.status === 'Verified' ? (
                          <CheckCircle2 className="h-3 w-3" />
                        ) : (
                          <AlertCircle className="h-3 w-3" />
                        )}
                        <span>{src.status}</span>
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-xs text-gray-600 whitespace-nowrap">
                      {src.lastReviewed}
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <button
                        onClick={() => setActiveSourceModal(src)}
                        className="px-3 py-1.5 text-xs font-semibold text-red-600 hover:text-red-700 bg-red-50 hover:bg-red-100 border border-red-200 rounded-md"
                      >
                        Inspect Evidence
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* EVIDENCE INSPECTION MODAL */}
        <AnimatePresence>
          {activeSourceModal && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
              <motion.div 
                variants={modalVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                className="bg-white rounded-2xl max-w-xl w-full p-6 shadow-2xl border border-gray-200 relative space-y-4 max-h-[90vh] overflow-y-auto"
              >
                <button
                  onClick={() => setActiveSourceModal(null)}
                  className="absolute right-4 top-4 text-gray-400 hover:text-gray-600 p-1 rounded-lg hover:bg-gray-100 transition-colors"
                  aria-label="Close evidence modal"
                >
                  <X className="h-5 w-5" />
                </button>

                <div>
                  <div className="flex items-center space-x-2">
                    <span className="text-xs font-bold px-2 py-0.5 bg-blue-100 text-[#1677B7] rounded">
                      {activeSourceModal.type}
                    </span>
                    <span className="text-xs text-gray-500 font-mono">
                      Ref: {activeSourceModal.referenceNo}
                    </span>
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 mt-1">
                    {activeSourceModal.name}
                  </h3>
                  <p className="text-xs text-gray-600">
                    Authority: {activeSourceModal.publishingAuthority}
                  </p>
                </div>

                <div className="p-3 bg-gray-50 border border-gray-200 rounded-xl space-y-1 text-xs">
                  <span className="font-semibold text-gray-800 block">Clause Summary</span>
                  <p className="text-gray-700">{activeSourceModal.clauseSummary}</p>
                </div>

                <div className="p-3 bg-blue-50/50 border border-blue-200 rounded-xl space-y-1.5 text-xs text-blue-950">
                  <span className="font-bold text-blue-900 block flex items-center space-x-1">
                    <FileText className="h-4 w-4 text-[#1677B7]" />
                    <span>Full Citation Excerpt</span>
                  </span>
                  <p className="font-mono text-xs leading-relaxed bg-white/80 p-2.5 rounded-lg border border-blue-100 text-gray-800">
                    "{activeSourceModal.fullExcerpt}"
                  </p>
                </div>

                <div className="pt-4 border-t border-gray-100 flex items-center justify-between">
                  <span className="text-xs text-gray-500">State: {activeSourceModal.verificationState}</span>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleUpdateStatus(activeSourceModal.id, 'Needs Review')}
                      className="px-3 py-1.5 text-xs font-semibold text-amber-700 bg-amber-50 hover:bg-amber-100 border border-amber-200 rounded-lg transition-colors cursor-pointer"
                    >
                      Flag Needs Review
                    </button>
                    <button
                      onClick={() => handleUpdateStatus(activeSourceModal.id, 'Verified')}
                      className="px-4 py-1.5 text-xs font-semibold text-white bg-[#D7193F] hover:bg-[#BE1435] rounded-lg transition-colors cursor-pointer"
                    >
                      Approve Source
                    </button>
                  </div>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>
      </div>
    </AdminLayout>
  );
}

export default SourcesPage;
