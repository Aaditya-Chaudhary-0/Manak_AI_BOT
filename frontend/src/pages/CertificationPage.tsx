import { useLocation, useNavigate, Link } from 'react-router-dom';
import AppLayout from '../components/layout/AppLayout';
import CertificationContextBanner from '../components/certification/CertificationContextBanner';
import CertificationFlowDiagram from '../components/certification/CertificationFlowDiagram';
import CertificationSchemesGrid from '../components/certification/CertificationSchemesGrid';
import CertificationDisclaimer from '../components/certification/CertificationDisclaimer';
import type { ProductFormData } from '../data/mockRecommendationData';
import type { StandardDetail } from '../data/mockStandardsData';
import { 
  ShieldCheck, 
  MessageSquare, 
  Search, 
  FileText, 
  HelpCircle,
  CheckCircle2
} from 'lucide-react';

interface CertificationLocationState {
  product?: ProductFormData;
  selectedStandard?: StandardDetail;
  relevance?: string;
}

export function CertificationPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const state = (location.state as CertificationLocationState) || {};

  const product = state.product;
  const standard = state.selectedStandard;
  const relevance = state.relevance;

  const handleAskAssistant = () => {
    let initialQuery = 'Help me understand the general BIS certification process and schemes.';
    if (product && standard) {
      initialQuery = `What are the exact certification requirements, scheme procedures, and test parameters for ${product.name} under ${standard.code}?`;
    } else if (standard) {
      initialQuery = `What certification scheme and Quality Control Orders apply to ${standard.code}?`;
    } else if (product) {
      initialQuery = `What certification path should I follow for my product: ${product.name}?`;
    }

    navigate('/app/assistant', { state: { initialQuery } });
  };

  return (
    <AppLayout
      pageTitle="BIS Certification Guidance"
      pageSubtitle="Understand the general certification path and key concepts associated with your product."
    >
      <div className="min-h-full bg-gray-50/50 pb-20">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-6 sm:py-8 space-y-6">
          {/* Header Banner */}
          <div className="bg-white border border-gray-200 rounded-xl p-5 sm:p-6 shadow-2xs">
            <div className="flex items-start justify-between gap-4">
              <div>
                <div className="flex items-center space-x-2">
                  <span className="w-2 h-2 rounded-full bg-blue-600"></span>
                  <span className="text-xs font-bold text-gray-900 uppercase tracking-wider">
                    Conformity Assessment & Schemes
                  </span>
                </div>
                <h1 className="text-xl sm:text-2xl font-bold text-gray-900 mt-1">
                  BIS Certification Guidance
                </h1>
                <p className="text-xs sm:text-sm text-gray-600 mt-1 max-w-2xl leading-relaxed">
                  Understand the general certification path and key concepts associated with your product.
                </p>
              </div>

              <div className="hidden sm:flex p-3 rounded-xl bg-blue-50 text-blue-700 border border-blue-100 shrink-0">
                <ShieldCheck className="w-6 h-6" />
              </div>
            </div>
          </div>

          {/* 1. Context Banner (If navigated from Matcher or Standard) */}
          <CertificationContextBanner
            product={product}
            standard={standard}
            relevance={relevance}
          />

          {/* 2. Official Source Disclaimer */}
          <CertificationDisclaimer />

          {/* 3. High-Level Certification Flow */}
          <CertificationFlowDiagram />

          {/* 4. Core Schemes & Concepts */}
          <CertificationSchemesGrid />

          {/* 5. Contextual Product Action Strip */}
          <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-2xs space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-100 pb-4">
              <div>
                <h3 className="text-base font-bold text-gray-900">
                  {product ? `Next Steps for ${product.name}` : 'Explore Standards & Ask AI'}
                </h3>
                <p className="text-xs text-gray-500 mt-0.5">
                  Connect your certification planning with the standards catalogue and AI assistant.
                </p>
              </div>

              <div className="flex items-center space-x-2 flex-wrap gap-y-2">
                {standard && (
                  <Link
                    to={`/app/standards/${standard.id}`}
                    className="inline-flex items-center space-x-1.5 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-800 text-xs font-semibold rounded-lg transition-colors"
                  >
                    <FileText className="w-4 h-4" />
                    <span>View Standard Details</span>
                  </Link>
                )}

                <button
                  type="button"
                  onClick={() => navigate('/app/standards')}
                  className="inline-flex items-center space-x-1.5 px-4 py-2 bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 text-xs font-semibold rounded-lg shadow-2xs transition-colors cursor-pointer"
                >
                  <Search className="w-4 h-4 text-gray-500" />
                  <span>Explore Standards</span>
                </button>

                <button
                  type="button"
                  onClick={handleAskAssistant}
                  className="inline-flex items-center space-x-1.5 px-5 py-2 bg-red-600 hover:bg-red-700 text-white text-xs font-semibold rounded-lg shadow-2xs transition-colors cursor-pointer"
                >
                  <MessageSquare className="w-4 h-4" />
                  <span>Ask Manak AI</span>
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-gray-600 pt-1">
              <div className="flex items-start space-x-2 bg-gray-50 p-3 rounded-lg border border-gray-100">
                <CheckCircle2 className="w-4 h-4 text-green-600 shrink-0 mt-0.5" />
                <div>
                  <span className="font-semibold text-gray-900 block">In-House Lab Readiness</span>
                  <span>Ensure your factory has calibrated test equipment according to standard clauses before audit.</span>
                </div>
              </div>

              <div className="flex items-start space-x-2 bg-gray-50 p-3 rounded-lg border border-gray-100">
                <HelpCircle className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                <div>
                  <span className="font-semibold text-gray-900 block">Need Detailed Checklist?</span>
                  <span>Ask the AI Assistant for the Scheme of Inspection and Testing (SIT) sampling frequency.</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}

export default CertificationPage;
