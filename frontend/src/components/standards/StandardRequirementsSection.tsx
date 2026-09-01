import { CheckCircle, ShieldAlert } from 'lucide-react';
import type { KeyRequirement } from '../../data/mockStandardsData';

interface StandardRequirementsSectionProps {
  requirements: KeyRequirement[];
}

export function StandardRequirementsSection({ requirements }: StandardRequirementsSectionProps) {
  if (!requirements || requirements.length === 0) return null;

  return (
    <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-2xs space-y-4">
      <div className="flex items-center justify-between border-b border-gray-100 pb-3">
        <div className="flex items-center space-x-2">
          <CheckCircle className="w-5 h-5 text-red-600" />
          <h3 className="text-base font-bold text-gray-900">
            Key Technical Requirements
          </h3>
        </div>
        <span className="text-xs text-gray-400 font-medium">
          {requirements.length} Core Specifications
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
        {requirements.map((req) => (
          <div
            key={req.id}
            className="bg-gray-50/70 border border-gray-200 rounded-xl p-4 hover:bg-white hover:border-gray-300 transition-all flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center space-x-2 mb-1.5">
                <span className="w-6 h-6 rounded-md bg-red-600 text-white font-mono text-xs font-bold flex items-center justify-center shrink-0">
                  {req.number}
                </span>
                <h4 className="text-sm font-bold text-gray-900 leading-snug">
                  {req.title}
                </h4>
              </div>
              <p className="text-xs text-gray-600 leading-relaxed pl-8 mt-1">
                {req.explanation}
              </p>
            </div>
          </div>
        ))}
      </div>

      <div className="pt-2 flex items-center space-x-2 text-[11px] text-gray-400 border-t border-gray-100">
        <ShieldAlert className="w-3.5 h-3.5 text-gray-400 shrink-0" />
        <span>
          Compliance requires certified in-house or recognized laboratory testing according to the BIS Scheme of Inspection and Testing (SIT).
        </span>
      </div>
    </div>
  );
}

export default StandardRequirementsSection;
