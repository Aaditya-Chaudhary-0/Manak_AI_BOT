import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import type { ProductFormData, RecommendationResult } from '../../data/mockRecommendationData';
import { 
  CheckCircle2, 
  Bookmark, 
  BookmarkCheck, 
  ArrowUpRight, 
  ShieldCheck, 
  RotateCcw, 
  Table, 
  LayoutGrid, 
  Sparkles,
  Info,
  HelpCircle,
  FileText
} from 'lucide-react';

interface RecommendationResultsViewProps {
  formData: ProductFormData;
  recommendations: RecommendationResult[];
  onStartNew: () => void;
}

export function RecommendationResultsView({
  formData,
  recommendations,
  onStartNew,
}: RecommendationResultsViewProps) {
  const navigate = useNavigate();
  const [savedMap, setSavedMap] = useState<Record<string, boolean>>({});
  const [viewMode, setViewMode] = useState<'cards' | 'table'>('cards');

  const toggleSave = (id: string) => {
    setSavedMap((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const getRelevanceBadge = (level: string) => {
    switch (level) {
      case 'High Relevance':
        return (
          <span className="inline-flex items-center space-x-1 text-xs font-bold text-green-700 bg-green-50 px-2.5 py-1 rounded-full border border-green-200">
            <span className="w-1.5 h-1.5 rounded-full bg-green-600"></span>
            <span>High Relevance</span>
          </span>
        );
      case 'Medium Relevance':
        return (
          <span className="inline-flex items-center space-x-1 text-xs font-bold text-amber-700 bg-amber-50 px-2.5 py-1 rounded-full border border-amber-200">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span>
            <span>Medium Relevance</span>
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center space-x-1 text-xs font-bold text-gray-700 bg-gray-100 px-2.5 py-1 rounded-full border border-gray-200">
            <span className="w-1.5 h-1.5 rounded-full bg-gray-500"></span>
            <span>Low Relevance</span>
          </span>
        );
    }
  };

  return (
    <div className="space-y-6">
      {/* Results Header */}
      <div className="bg-white border border-gray-200 rounded-xl p-5 sm:p-6 shadow-2xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center space-x-2">
              <span className="text-xs font-bold uppercase tracking-wider text-red-600">
                Matching Complete
              </span>
              <span className="text-gray-300">|</span>
              <span className="text-xs text-gray-500">
                Found {recommendations.length} Potentially Relevant Standard{recommendations.length !== 1 ? 's' : ''}
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mt-1">
              Potentially Relevant Standards
            </h2>
            <p className="text-xs text-gray-600 mt-1">
              Evaluated for: <strong className="text-gray-900">{formData.name}</strong> ({formData.category})
            </p>
          </div>

          <div className="flex items-center space-x-2 shrink-0">
            {/* View Mode Toggle (Desktop) */}
            <div className="hidden sm:inline-flex items-center bg-gray-100 p-1 rounded-lg border border-gray-200">
              <button
                type="button"
                onClick={() => setViewMode('cards')}
                className={`px-2.5 py-1 text-xs font-semibold rounded-md flex items-center space-x-1 transition-colors cursor-pointer ${
                  viewMode === 'cards'
                    ? 'bg-white text-gray-900 shadow-2xs'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <LayoutGrid className="w-3.5 h-3.5" />
                <span>Cards</span>
              </button>
              <button
                type="button"
                onClick={() => setViewMode('table')}
                className={`px-2.5 py-1 text-xs font-semibold rounded-md flex items-center space-x-1 transition-colors cursor-pointer ${
                  viewMode === 'table'
                    ? 'bg-white text-gray-900 shadow-2xs'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <Table className="w-3.5 h-3.5" />
                <span>Comparison</span>
              </button>
            </div>

            <button
              type="button"
              onClick={onStartNew}
              className="inline-flex items-center space-x-1.5 px-3.5 py-2 rounded-lg text-xs font-semibold bg-gray-100 hover:bg-gray-200 text-gray-800 transition-colors cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Start New Match</span>
            </button>
          </div>
        </div>
      </div>

      {/* View 1: Detailed Cards View */}
      {viewMode === 'cards' && (
        <div className="space-y-4">
          {recommendations.map((rec) => {
            const isSaved = !!savedMap[rec.id];
            const std = rec.standard;

            return (
              <div
                key={rec.id}
                className="bg-white border border-gray-200 hover:border-gray-300 rounded-xl p-5 sm:p-6 shadow-2xs transition-all space-y-4"
              >
                {/* Standard Code, Status & Relevance Badge */}
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                  <div>
                    <div className="flex items-center space-x-2 flex-wrap gap-y-1">
                      <span className="font-mono text-sm sm:text-base font-bold text-gray-900 bg-gray-100 px-3 py-1 rounded-lg border border-gray-200">
                        {std.code}
                      </span>
                      <span className="inline-flex items-center space-x-1 text-xs font-semibold text-green-700 bg-green-50 px-2.5 py-0.5 rounded-full border border-green-200">
                        <CheckCircle2 className="w-3 h-3" />
                        <span>{std.status}</span>
                      </span>
                      <span className="text-xs font-medium text-gray-500 bg-gray-50 px-2.5 py-0.5 rounded-full border border-gray-200">
                        {std.category} • {std.year}
                      </span>
                      {getRelevanceBadge(rec.relevanceLevel)}
                    </div>

                    <h3 className="text-base sm:text-lg font-bold text-gray-900 mt-2.5 leading-snug">
                      {std.title}
                    </h3>
                  </div>

                  {/* Bookmark Save Button */}
                  <button
                    type="button"
                    onClick={() => toggleSave(rec.id)}
                    className={`shrink-0 inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors cursor-pointer ${
                      isSaved
                        ? 'bg-red-50 text-red-700 border-red-200'
                        : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50 hover:text-gray-900'
                    }`}
                    title={isSaved ? 'Standard is saved' : 'Save standard to your bookmarks'}
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
                  </button>
                </div>

                {/* Why This Standard? Explanation Card */}
                <div className="bg-blue-50/60 border border-blue-200 rounded-xl p-4 space-y-2">
                  <div className="flex items-center space-x-2 text-xs font-bold text-blue-900 uppercase tracking-wider">
                    <Sparkles className="w-3.5 h-3.5 text-blue-700" />
                    <span>Why This Standard? (Demo Reasoning)</span>
                  </div>

                  <p className="text-xs text-gray-800 leading-relaxed font-medium">
                    {rec.whyRelevant}
                  </p>

                  <div className="pt-2 border-t border-blue-100/80">
                    <span className="text-[11px] font-bold text-gray-600 uppercase tracking-wider block mb-1">
                      Key Alignment Indicators:
                    </span>
                    <ul className="grid grid-cols-1 md:grid-cols-3 gap-1.5 text-xs text-gray-700">
                      {rec.alignedPoints.map((pt, idx) => (
                        <li key={idx} className="flex items-start space-x-1.5">
                          <span className="text-blue-600 font-bold">•</span>
                          <span>{pt}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Bottom Action Strip */}
                <div className="pt-3 border-t border-gray-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="text-xs text-gray-500 flex items-center space-x-1.5">
                    <ShieldCheck className="w-4 h-4 text-blue-600" />
                    <span>
                      Applicable Scheme: <strong className="text-gray-800">{rec.suggestedScheme}</strong>
                    </span>
                  </div>

                  <div className="flex items-center space-x-2 shrink-0 flex-wrap gap-y-2">
                    <Link
                      to={`/app/standards/${std.id}`}
                      className="inline-flex items-center space-x-1 text-xs font-semibold px-3.5 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-800 rounded-lg transition-colors"
                    >
                      <FileText className="w-3.5 h-3.5" />
                      <span>View Standard</span>
                      <ArrowUpRight className="w-3.5 h-3.5 text-gray-500" />
                    </Link>

                    <button
                      type="button"
                      onClick={() =>
                        navigate('/app/certification', {
                          state: {
                            product: formData,
                            selectedStandard: std,
                            relevance: rec.relevanceLevel,
                          },
                        })
                      }
                      className="inline-flex items-center space-x-1 text-xs font-semibold px-3.5 py-1.5 bg-red-600 hover:bg-red-700 text-white rounded-lg shadow-2xs transition-colors cursor-pointer"
                    >
                      <ShieldCheck className="w-3.5 h-3.5" />
                      <span>Check Certification Guidance</span>
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* View 2: Comparison Table View */}
      {viewMode === 'table' && (
        <div className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-2xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200 text-gray-500 font-bold uppercase tracking-wider">
                  <th className="p-3.5">Standard</th>
                  <th className="p-3.5">Relevance</th>
                  <th className="p-3.5">Status</th>
                  <th className="p-3.5">Category</th>
                  <th className="p-3.5">Scheme</th>
                  <th className="p-3.5">Why Relevant</th>
                  <th className="p-3.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {recommendations.map((rec) => {
                  const std = rec.standard;
                  return (
                    <tr key={rec.id} className="hover:bg-gray-50/70 transition-colors">
                      <td className="p-3.5 font-mono font-bold text-gray-900 whitespace-nowrap">
                        {std.code}
                      </td>
                      <td className="p-3.5 whitespace-nowrap">
                        {getRelevanceBadge(rec.relevanceLevel)}
                      </td>
                      <td className="p-3.5 whitespace-nowrap">
                        <span className="text-green-700 font-medium">{std.status}</span>
                      </td>
                      <td className="p-3.5 whitespace-nowrap text-gray-700">
                        {std.category}
                      </td>
                      <td className="p-3.5 whitespace-nowrap font-medium text-blue-800">
                        {rec.suggestedScheme}
                      </td>
                      <td className="p-3.5 text-gray-600 max-w-xs">
                        {rec.whyRelevant}
                      </td>
                      <td className="p-3.5 text-right whitespace-nowrap space-x-1.5">
                        <Link
                          to={`/app/standards/${std.id}`}
                          className="inline-block px-2.5 py-1 bg-gray-100 hover:bg-gray-200 text-gray-800 rounded font-medium"
                        >
                          View
                        </Link>
                        <button
                          type="button"
                          onClick={() =>
                            navigate('/app/certification', {
                              state: {
                                product: formData,
                                selectedStandard: std,
                                relevance: rec.relevanceLevel,
                              },
                            })
                          }
                          className="inline-block px-2.5 py-1 bg-red-600 hover:bg-red-700 text-white rounded font-medium cursor-pointer"
                        >
                          Certification
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Helpful Guidance Footer Card */}
      <div className="bg-gray-50 border border-gray-200 rounded-xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs text-gray-600">
        <div className="flex items-center space-x-2">
          <Info className="w-4 h-4 text-blue-600 shrink-0" />
          <span>
            Need help interpreting test methods or clause limits for these recommendations?
          </span>
        </div>
        <button
          type="button"
          onClick={() =>
            navigate('/app/assistant', {
              state: {
                initialQuery: `What are the testing and certification requirements for ${formData.name} under ${recommendations[0]?.standard.code || 'applicable standards'}?`,
              },
            })
          }
          className="inline-flex items-center space-x-1 text-red-600 hover:text-red-700 font-semibold shrink-0 cursor-pointer"
        >
          <HelpCircle className="w-3.5 h-3.5" />
          <span>Ask Manak AI Assistant</span>
        </button>
      </div>
    </div>
  );
}

export default RecommendationResultsView;
