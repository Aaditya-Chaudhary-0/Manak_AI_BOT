import { ShieldCheck, ExternalLink, BookOpen } from 'lucide-react';
import type { EvidenceItem } from '../../data/mockAssistantData';

interface EvidenceCardProps {
  evidence: EvidenceItem;
}

export function EvidenceCard({ evidence }: EvidenceCardProps) {
  return (
    <div className="bg-blue-50/50 border border-blue-200 rounded-xl p-3.5 sm:p-4 transition-all">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center space-x-2">
          <div className="w-5 h-5 rounded-md bg-blue-100 text-[#1677B7] flex items-center justify-center">
            <ShieldCheck className="w-3.5 h-3.5" />
          </div>
          <span className="text-xs font-bold text-blue-900 tracking-wider uppercase">
            Official Source Verification
          </span>
        </div>
        <span className="text-[10px] font-semibold text-[#1677B7] bg-white px-2 py-0.5 rounded border border-blue-200 shadow-2xs">
          BIS Authority
        </span>
      </div>

      <div className="space-y-1.5 text-xs text-gray-800 mt-2">
        <div className="flex items-start space-x-2">
          <BookOpen className="w-3.5 h-3.5 text-[#1677B7] shrink-0 mt-0.5" />
          <div>
            <span className="font-semibold text-gray-900">{evidence.document}</span>
            {evidence.clause && (
              <span className="text-gray-500 ml-1">({evidence.clause})</span>
            )}
          </div>
        </div>

        <blockquote className="italic border-l-2 border-[#1677B7] pl-3 py-1 text-gray-700 bg-white/80 rounded-r-md">
          "{evidence.excerpt}"
        </blockquote>
      </div>

      <div className="mt-3 pt-2 border-t border-blue-100 flex items-center justify-between text-xs">
        <span className="text-[11px] text-gray-500">
          Indexed from official BIS gazette and technical database.
        </span>
        <a
          href={evidence.sourceUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center space-x-1 text-[#1677B7] hover:text-blue-900 font-semibold hover:underline ml-2 shrink-0"
        >
          <span>View Source</span>
          <ExternalLink className="w-3 h-3" />
        </a>
      </div>
    </div>
  );
}

export default EvidenceCard;
