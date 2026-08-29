import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Bookmark, 
  BookmarkCheck, 
  Share2, 
  ArrowLeft, 
  CheckCircle2, 
  FileText, 
  Calendar, 
  Layers, 
  Globe2, 
  Building2, 
  Tag, 
  Scale, 
  Check
} from 'lucide-react';
import type { StandardDetail } from '../../data/mockStandardsData';

interface StandardMetadataCardProps {
  standard: StandardDetail;
}

export function StandardMetadataCard({ standard }: StandardMetadataCardProps) {
  const navigate = useNavigate();
  const [isSaved, setIsSaved] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleCopyLink = () => {
    navigator.clipboard?.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-2xs space-y-6">
      {/* Top Header & Actions */}
      <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 border-b border-gray-100 pb-5">
        <div className="space-y-2">
          <div className="flex items-center space-x-2 flex-wrap gap-y-1">
            <span className="font-mono text-base font-bold text-gray-900 bg-gray-100 px-3 py-1 rounded-lg border border-gray-200">
              {standard.code}
            </span>
            <span className="inline-flex items-center space-x-1 text-xs font-semibold text-green-700 bg-green-50 px-2.5 py-1 rounded-full border border-green-200">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>{standard.status}</span>
            </span>
            <span className="inline-flex items-center space-x-1 text-xs font-medium text-blue-700 bg-blue-50 px-2.5 py-1 rounded-full border border-blue-200">
              <Scale className="w-3.5 h-3.5" />
              <span>{standard.standardType}</span>
            </span>
          </div>

          <h2 className="text-xl sm:text-2xl font-bold text-gray-900 leading-tight">
            {standard.title}
          </h2>

          <p className="text-sm text-gray-600 leading-relaxed max-w-3xl">
            {standard.description}
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center space-x-2 shrink-0 flex-wrap gap-y-2">
          <button
            onClick={() => setIsSaved(!isSaved)}
            className={`inline-flex items-center space-x-1.5 px-3.5 py-2 rounded-lg text-xs font-semibold border transition-colors shadow-2xs ${
              isSaved
                ? 'bg-red-50 text-red-700 border-red-200'
                : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
            }`}
          >
            {isSaved ? (
              <>
                <BookmarkCheck className="w-4 h-4 text-red-600 fill-red-600" />
                <span className="text-red-700">Saved</span>
              </>
            ) : (
              <>
                <Bookmark className="w-4 h-4 text-gray-500" />
                <span>Save Standard</span>
              </>
            )}
          </button>

          <button
            onClick={handleCopyLink}
            className="inline-flex items-center space-x-1.5 px-3.5 py-2 rounded-lg text-xs font-semibold bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 shadow-2xs transition-colors"
            title="Copy link to standard"
          >
            {copied ? (
              <>
                <Check className="w-4 h-4 text-green-600" />
                <span className="text-green-700">Link Copied</span>
              </>
            ) : (
              <>
                <Share2 className="w-4 h-4 text-gray-500" />
                <span>Share</span>
              </>
            )}
          </button>

          <button
            onClick={() => navigate('/app/standards')}
            className="inline-flex items-center space-x-1.5 px-3.5 py-2 rounded-lg text-xs font-semibold bg-gray-100 hover:bg-gray-200 text-gray-800 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Search</span>
          </button>
        </div>
      </div>

      {/* Metadata Specification Grid */}
      <div>
        <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">
          Document Specification & Technical Metadata
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          <div className="bg-gray-50/80 border border-gray-100 rounded-xl p-3 flex items-start space-x-2.5">
            <Calendar className="w-4 h-4 text-blue-600 mt-0.5 shrink-0" />
            <div className="text-xs">
              <span className="text-gray-400 block font-medium">Publication Year</span>
              <span className="font-semibold text-gray-900">{standard.metadata.publicationYear}</span>
            </div>
          </div>

          <div className="bg-gray-50/80 border border-gray-100 rounded-xl p-3 flex items-start space-x-2.5">
            <Layers className="w-4 h-4 text-blue-600 mt-0.5 shrink-0" />
            <div className="text-xs">
              <span className="text-gray-400 block font-medium">Category / Domain</span>
              <span className="font-semibold text-gray-900">{standard.category}</span>
            </div>
          </div>

          <div className="bg-gray-50/80 border border-gray-100 rounded-xl p-3 flex items-start space-x-2.5">
            <FileText className="w-4 h-4 text-blue-600 mt-0.5 shrink-0" />
            <div className="text-xs">
              <span className="text-gray-400 block font-medium">Document Type</span>
              <span className="font-semibold text-gray-900">{standard.metadata.documentType}</span>
            </div>
          </div>

          <div className="bg-gray-50/80 border border-gray-100 rounded-xl p-3 flex items-start space-x-2.5">
            <Building2 className="w-4 h-4 text-blue-600 mt-0.5 shrink-0" />
            <div className="text-xs">
              <span className="text-gray-400 block font-medium">Technical Committee</span>
              <span className="font-semibold text-gray-900">{standard.metadata.technicalCommittee}</span>
            </div>
          </div>

          <div className="bg-gray-50/80 border border-gray-100 rounded-xl p-3 flex items-start space-x-2.5">
            <Tag className="w-4 h-4 text-blue-600 mt-0.5 shrink-0" />
            <div className="text-xs">
              <span className="text-gray-400 block font-medium">ICS Classification</span>
              <span className="font-semibold text-gray-900">{standard.metadata.icsCode}</span>
            </div>
          </div>

          <div className="bg-gray-50/80 border border-gray-100 rounded-xl p-3 flex items-start space-x-2.5">
            <Globe2 className="w-4 h-4 text-blue-600 mt-0.5 shrink-0" />
            <div className="text-xs">
              <span className="text-gray-400 block font-medium">Language</span>
              <span className="font-semibold text-gray-900">{standard.metadata.language}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default StandardMetadataCard;
