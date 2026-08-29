import { useState, useMemo } from 'react';
import {
  Search,
  CheckCircle2,
  AlertCircle,
  X,
} from 'lucide-react';
import AdminLayout from '../../layouts/AdminLayout';
import { MOCK_STANDARDS, type StandardDetail } from '../../data/mockStandardsData';

export function StandardsManagementPage() {
  const [standards] = useState<StandardDetail[]>(MOCK_STANDARDS);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [selectedVerification, setSelectedVerification] = useState<string>('all');

  // Modal State
  const [reviewStandard, setReviewStandard] = useState<StandardDetail | null>(null);

  // Extract unique categories
  const categories = useMemo(() => {
    const set = new Set(standards.map((s) => s.category));
    return Array.from(set);
  }, [standards]);

  // Filtered standards
  const filteredStandards = useMemo(() => {
    return standards.filter((s) => {
      const query = searchTerm.toLowerCase();
      const matchesSearch =
        s.code.toLowerCase().includes(query) ||
        s.title.toLowerCase().includes(query) ||
        s.scope.toLowerCase().includes(query) ||
        s.description.toLowerCase().includes(query);

      const matchesCat = selectedCategory === 'all' || s.category === selectedCategory;
      const matchesStatus = selectedStatus === 'all' || s.status === selectedStatus;

      // Simulated verification state mapping
      const verificationState =
        s.id === 'is-16102-1' ? 'Verified' : s.id === 'is-269' ? 'Needs Review' : 'Verified';

      const matchesVerif =
        selectedVerification === 'all' || verificationState === selectedVerification;

      return matchesSearch && matchesCat && matchesStatus && matchesVerif;
    });
  }, [standards, searchTerm, selectedCategory, selectedStatus, selectedVerification]);

  const handleMarkVerified = (_id: string) => {
    setReviewStandard(null);
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* PAGE HEADER */}
        <div>
          <div className="flex items-center space-x-2 text-xs text-gray-500 mb-1">
            <span>Admin</span>
            <span>/</span>
            <span className="text-gray-900 font-medium">Standards</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 tracking-tight">
            Standards Management
          </h1>
          <p className="text-sm text-gray-600 mt-1">
            Audit Bureau of Indian Standards catalog metadata, manage gazette amendments, and check verification statuses.
          </p>
        </div>

        {/* SEARCH & FILTERS BAR */}
        <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-2xs space-y-3">
          <div className="flex flex-col sm:flex-row gap-3">
            {/* Search Input */}
            <div className="relative flex-1">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search standard number (e.g. IS 16102), title, or keyword..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-4 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-600 focus:border-red-600 bg-white"
              />
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm('')}
                  className="absolute right-3 top-2.5 text-gray-400 hover:text-gray-600"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>

            {/* Dropdowns */}
            <div className="flex flex-wrap sm:flex-nowrap gap-2">
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="px-3 py-2 text-sm border border-gray-300 rounded-lg bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-red-600"
              >
                <option value="all">All Categories</option>
                {categories.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>

              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="px-3 py-2 text-sm border border-gray-300 rounded-lg bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-red-600"
              >
                <option value="all">All Statuses</option>
                <option value="Active">Active</option>
                <option value="Draft">Draft</option>
                <option value="Withdrawn">Withdrawn</option>
              </select>

              {(searchTerm || selectedCategory !== 'all' || selectedStatus !== 'all') && (
                <button
                  onClick={() => {
                    setSearchTerm('');
                    setSelectedCategory('all');
                    setSelectedStatus('all');
                    setSelectedVerification('all');
                  }}
                  className="px-3 py-2 text-xs font-semibold text-gray-600 hover:text-gray-900 bg-gray-100 rounded-lg"
                >
                  Reset
                </button>
              )}
            </div>
          </div>
        </div>

        {/* STANDARDS TABLE */}
        <div className="bg-white border border-gray-200 rounded-xl shadow-2xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  <th className="py-3.5 px-4">Standard No</th>
                  <th className="py-3.5 px-4">Standard Title</th>
                  <th className="py-3.5 px-4">Category</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-4">Verification</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 text-sm">
                {filteredStandards.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-8 text-center text-gray-500 text-sm">
                      No standards found matching your filter criteria.
                    </td>
                  </tr>
                ) : (
                  filteredStandards.map((std) => {
                    const isVerified = std.id !== 'is-269';
                    return (
                      <tr key={std.id} className="hover:bg-gray-50/80 transition-colors">
                        <td className="py-3.5 px-4 font-bold text-red-600 whitespace-nowrap">
                          {std.code}
                        </td>
                        <td className="py-3.5 px-4">
                          <p className="font-semibold text-gray-900 text-sm line-clamp-1">
                            {std.title}
                          </p>
                          <p className="text-gray-500 text-xs line-clamp-1 mt-0.5">
                            {std.scope}
                          </p>
                        </td>
                        <td className="py-3.5 px-4">
                          <span className="inline-flex px-2.5 py-1 text-xs font-medium bg-gray-100 text-gray-800 rounded-md">
                            {std.category}
                          </span>
                        </td>
                        <td className="py-3.5 px-4">
                          <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded text-xs font-semibold bg-green-50 text-green-700 border border-green-200">
                            <span className="w-1.5 h-1.5 rounded-full bg-green-600" />
                            <span>{std.status}</span>
                          </span>
                        </td>
                        <td className="py-3.5 px-4">
                          <span
                            className={`inline-flex items-center space-x-1 px-2.5 py-0.5 rounded text-xs font-semibold ${
                              isVerified
                                ? 'bg-blue-50 text-blue-700 border border-blue-200'
                                : 'bg-amber-50 text-amber-700 border border-amber-200'
                            }`}
                          >
                            {isVerified ? (
                              <CheckCircle2 className="h-3 w-3" />
                            ) : (
                              <AlertCircle className="h-3 w-3" />
                            )}
                            <span>{isVerified ? 'Verified' : 'Needs Review'}</span>
                          </span>
                        </td>
                        <td className="py-3.5 px-4 text-right">
                          <div className="flex items-center justify-end space-x-2">
                            <button
                              onClick={() => setReviewStandard(std)}
                              className="px-3 py-1.5 text-xs font-semibold text-red-600 hover:text-red-700 bg-red-50 hover:bg-red-100 border border-red-200 rounded-md"
                            >
                              Review Metadata
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
          <div className="px-4 py-3 bg-gray-50 border-t border-gray-200 text-xs text-gray-500 flex items-center justify-between">
            <span>Showing {filteredStandards.length} standards from BIS Mock Registry</span>
            <span>Aligned with IS 16102, IS 269, IS 1786, IS 14543</span>
          </div>
        </div>

        {/* REVIEW STANDARD MODAL */}
        {reviewStandard && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
            <div className="bg-white rounded-xl max-w-xl w-full p-6 shadow-xl border border-gray-200 relative space-y-4 max-h-[90vh] overflow-y-auto">
              <button
                onClick={() => setReviewStandard(null)}
                className="absolute right-4 top-4 text-gray-400 hover:text-gray-600"
              >
                <X className="h-5 w-5" />
              </button>

              <div>
                <span className="text-xs font-bold text-red-600 uppercase tracking-wider">
                  {reviewStandard.category} • {reviewStandard.standardType}
                </span>
                <h3 className="text-xl font-bold text-gray-900 mt-0.5">
                  {reviewStandard.code}: {reviewStandard.title}
                </h3>
                <p className="text-xs text-gray-500 mt-1">Year of Publication: {reviewStandard.year}</p>
              </div>

              <div className="p-3 bg-gray-50 border border-gray-200 rounded-lg space-y-2 text-xs">
                <span className="font-semibold text-gray-800 block">Scope Summary</span>
                <p className="text-gray-700 leading-relaxed">{reviewStandard.scope}</p>
              </div>

              <div className="space-y-2 text-xs">
                <span className="font-semibold text-gray-900 block">Key Requirements ({reviewStandard.keyRequirements.length})</span>
                <ul className="list-disc pl-4 space-y-1 text-gray-700">
                  {reviewStandard.keyRequirements.map((req) => (
                    <li key={req.id}>
                      <strong className="text-gray-900">{req.title}:</strong> {req.explanation}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg text-xs text-blue-900 space-y-1">
                <span className="font-bold flex items-center space-x-1">
                  <CheckCircle2 className="h-4 w-4 text-blue-600" />
                  <span>Regulatory Relevance Reason</span>
                </span>
                <p className="text-blue-800 leading-normal">{reviewStandard.relevanceReason}</p>
              </div>

              <div className="pt-4 border-t border-gray-100 flex items-center justify-between">
                <span className="text-xs text-gray-500">Status: {reviewStandard.status}</span>
                <div className="flex space-x-2">
                  <button
                    onClick={() => setReviewStandard(null)}
                    className="px-3 py-1.5 text-xs font-semibold text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => handleMarkVerified(reviewStandard.id)}
                    className="px-4 py-1.5 text-xs font-semibold text-white bg-red-600 hover:bg-red-700 rounded-md"
                  >
                    Approve Metadata & Mark Verified
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}

export default StandardsManagementPage;
