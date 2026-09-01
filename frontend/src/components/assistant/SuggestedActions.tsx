import { useNavigate } from 'react-router-dom';
import { ArrowRight, CornerDownRight } from 'lucide-react';
import type { ActionItem } from '../../data/mockAssistantData';

interface SuggestedActionsProps {
  actions: ActionItem[];
  onFollowUpClick: (prompt: string) => void;
}

export function SuggestedActions({ actions, onFollowUpClick }: SuggestedActionsProps) {
  const navigate = useNavigate();

  if (!actions || actions.length === 0) return null;

  return (
    <div className="space-y-2 pt-2 border-t border-gray-100">
      <div className="flex items-center space-x-1.5 text-xs font-semibold text-gray-500">
        <span>Suggested Next Steps:</span>
      </div>
      <div className="flex flex-wrap gap-2">
        {actions.map((action) => {
          if (action.type === 'navigate') {
            return (
              <button
                key={action.id}
                type="button"
                onClick={() => navigate(action.payload)}
                className={`inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all cursor-pointer ${
                  action.primary
                    ? 'bg-[#D7193F] hover:bg-[#BE1435] text-white border-[#D7193F] shadow-2xs'
                    : 'bg-white hover:bg-gray-50 text-gray-700 border-gray-300 hover:border-gray-400'
                }`}
              >
                <span>{action.label}</span>
                <ArrowRight className="w-3 h-3" />
              </button>
            );
          }

          if (action.type === 'followup') {
            return (
              <button
                key={action.id}
                type="button"
                onClick={() => onFollowUpClick(action.payload)}
                className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-blue-50 hover:bg-blue-100/80 text-[#1677B7] border border-blue-200 transition-colors cursor-pointer"
              >
                <CornerDownRight className="w-3 h-3 text-[#1677B7]" />
                <span>{action.label}</span>
              </button>
            );
          }

          return null;
        })}
      </div>
    </div>
  );
}

export default SuggestedActions;
