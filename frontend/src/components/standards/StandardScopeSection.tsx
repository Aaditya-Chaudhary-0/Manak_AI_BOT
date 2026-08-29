import { BookOpenCheck, Info } from 'lucide-react';

interface StandardScopeSectionProps {
  scope: string;
  relevanceReason: string;
}

export function StandardScopeSection({ scope, relevanceReason }: StandardScopeSectionProps) {
  return (
    <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-2xs space-y-4">
      <div className="flex items-center space-x-2 border-b border-gray-100 pb-3">
        <BookOpenCheck className="w-5 h-5 text-blue-600" />
        <h3 className="text-base font-bold text-gray-900">
          Scope & Regulatory Applicability
        </h3>
      </div>

      <div className="text-sm text-gray-800 leading-relaxed space-y-3">
        <p className="bg-gray-50 p-4 rounded-xl border border-gray-100 font-normal">
          {scope}
        </p>

        <div className="flex items-start space-x-2.5 p-3.5 bg-blue-50/60 border border-blue-200 rounded-xl text-xs text-blue-900">
          <Info className="w-4 h-4 text-blue-700 shrink-0 mt-0.5" />
          <div>
            <span className="font-bold">Compliance Significance: </span>
            <span>{relevanceReason}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default StandardScopeSection;
