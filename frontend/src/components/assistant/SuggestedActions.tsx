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
                onClick={() => navigate(action.payload)}
                className={`inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border transition-all ${
                  action.primary
                    ? 'bg-red-600 hover:bg-red-700 text-white border-red-600 shadow-2xs'
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
                onClick={() => onFollowUpClick(action.payload)}
                className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-blue-50 hover:bg-blue-100/80 text-blue-800 border border-blue-200 transition-colors"
              >
                <CornerDownRight className="w-3 h-3 text-blue-600" />
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
