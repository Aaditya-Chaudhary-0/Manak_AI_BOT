import { useMemo } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import AppLayout from '../components/layout/AppLayout';
import StandardBreadcrumbs from '../components/standards/StandardBreadcrumbs';
import StandardMetadataCard from '../components/standards/StandardMetadataCard';
import StandardScopeSection from '../components/standards/StandardScopeSection';
import StandardRequirementsSection from '../components/standards/StandardRequirementsSection';
import StandardClausesTable from '../components/standards/StandardClausesTable';
import StandardRelatedList from '../components/standards/StandardRelatedList';
import EvidenceCard from '../components/assistant/EvidenceCard';
import { MOCK_STANDARDS } from '../data/mockStandardsData';
import { ArrowLeft, Search, MessageSquare, ShieldCheck } from 'lucide-react';

export function StandardDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  // Find current standard by id or fallback to first
  const currentStandard = useMemo(() => {
    return MOCK_STANDARDS.find((s) => s.id === id) || MOCK_STANDARDS[0];
  }, [id]);

  // Find related standards
  const relatedStandards = useMemo(() => {
    if (!currentStandard || !currentStandard.relatedStandardIds) return [];
    return MOCK_STANDARDS.filter((s) =>
      currentStandard.relatedStandardIds.includes(s.id)
    );
  }, [currentStandard]);

  if (!currentStandard) {
    return (
      <AppLayout pageTitle="Standard Not Found">
        <div className="max-w-xl mx-auto py-20 px-4 text-center">
          <h2 className="text-xl font-bold text-gray-900 mb-2">
            Standard Not Found
          </h2>
          <p className="text-sm text-gray-500 mb-6">
            The requested standard document code could not be located in the demo catalogue.
          </p>
          <Link
            to="/app/standards"
            className="inline-flex items-center space-x-1.5 px-4 py-2 bg-red-600 text-white text-xs font-semibold rounded-lg hover:bg-red-700"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Return to Standards Catalogue</span>
          </Link>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout
      pageTitle={currentStandard.code}
      pageSubtitle="Bureau of Indian Standards Specification & Conformity Assessment"
    >
      <div className="min-h-full bg-gray-50/50 pb-20">
        {/* Breadcrumbs Navigation */}
        <StandardBreadcrumbs currentCode={currentStandard.code} />

        {/* Main Content Area */}
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-6 space-y-6">
          {/* 1. Header & Technical Metadata */}
          <StandardMetadataCard standard={currentStandard} />

          {/* 2. Scope and Relevance */}
          <StandardScopeSection
            scope={currentStandard.scope}
            relevanceReason={currentStandard.relevanceReason}
          />

          {/* 3. Key Technical Requirements */}
          <StandardRequirementsSection
            requirements={currentStandard.keyRequirements}
          />

          {/* 4. Important Clauses Table */}
          <StandardClausesTable
            clauses={currentStandard.importantClauses}
          />

          {/* 5. Official Source Evidence */}
          {currentStandard.evidence && currentStandard.evidence.length > 0 && (
            <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-2xs space-y-4">
              <div className="flex items-center space-x-2 border-b border-gray-100 pb-3">
                <ShieldCheck className="w-5 h-5 text-blue-600" />
                <h3 className="text-base font-bold text-gray-900">
                  Official Gazette & Regulatory Evidence
                </h3>
              </div>

              <div className="space-y-3">
                {currentStandard.evidence.map((ev, idx) => (
                  <EvidenceCard key={idx} evidence={ev} />
                ))}
              </div>
            </div>
          )}

          {/* 6. Related Standards */}
          {relatedStandards.length > 0 && (
            <StandardRelatedList relatedStandards={relatedStandards} />
          )}

          {/* 7. Contextual Next Step Guidance Card */}
          <div className="bg-gradient-to-r from-gray-900 to-gray-800 text-white rounded-2xl p-6 shadow-md flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-red-400">
                Next Step
              </span>
              <h4 className="text-base font-bold text-white mt-1">
                Have specific technical questions on {currentStandard.code}?
              </h4>
              <p className="text-xs text-gray-300 mt-1 max-w-xl">
                Ask Manak AI Assistant to analyze test methods, certification procedures, or QCO exemptions for your product.
              </p>
            </div>

            <div className="flex items-center space-x-2 shrink-0">
              <button
                onClick={() => navigate('/app/assistant')}
                className="inline-flex items-center space-x-1.5 px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-xs font-semibold rounded-lg shadow-2xs transition-colors"
              >
                <MessageSquare className="w-3.5 h-3.5" />
                <span>Ask AI Assistant</span>
              </button>
              <button
                onClick={() => navigate('/app/standards')}
                className="inline-flex items-center space-x-1.5 px-3 py-2 bg-white/10 hover:bg-white/20 text-white text-xs font-medium rounded-lg transition-colors"
              >
                <Search className="w-3.5 h-3.5" />
                <span>Search More</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}

export default StandardDetailPage;
