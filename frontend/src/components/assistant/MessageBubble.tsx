import { User, Sparkles, AlertCircle, RefreshCw } from 'lucide-react';
import type { AssistantMessage } from '../../data/mockAssistantData';
import StandardCard from './StandardCard';
import EvidenceCard from './EvidenceCard';
import ConfidenceBadge from './ConfidenceBadge';
import SuggestedActions from './SuggestedActions';

interface MessageBubbleProps {
  message: AssistantMessage;
  onFollowUpClick: (prompt: string) => void;
  onRetry?: (messageId: string) => void;
}

export function MessageBubble({ message, onFollowUpClick, onRetry }: MessageBubbleProps) {
  const isUser = message.role === 'user';

  if (isUser) {
    return (
      <div className="flex justify-end my-3 sm:my-4">
        <div className="flex items-start space-x-2 max-w-2xl">
          <div className="bg-gray-100 border border-gray-200 text-gray-900 rounded-2xl rounded-tr-xs px-4 py-3 shadow-2xs">
            <div className="flex items-center justify-between space-x-4 mb-1">
              <span className="text-[11px] font-bold text-gray-700">You</span>
              <span className="text-[10px] text-gray-400 font-mono">{message.timestamp}</span>
            </div>
            <p className="text-sm font-medium leading-relaxed whitespace-pre-wrap">
              {message.text}
            </p>
          </div>
          <div className="w-8 h-8 rounded-full bg-gray-200 text-gray-700 flex items-center justify-center shrink-0 text-xs font-bold mt-1">
            <User className="w-4 h-4" />
          </div>
        </div>
      </div>
    );
  }

  // Error State handling
  if (message.isError) {
    return (
      <div className="flex justify-start my-3 sm:my-4 max-w-3xl">
        <div className="flex items-start space-x-3 w-full">
          <div className="w-8 h-8 rounded-xl bg-red-100 text-[#D7193F] flex items-center justify-center shrink-0 mt-1 shadow-2xs">
            <AlertCircle className="w-4 h-4" />
          </div>
          <div className="bg-red-50/50 border border-red-200 rounded-2xl rounded-tl-xs p-4 flex-1">
            <div className="flex items-center space-x-2 text-[#D7193F] font-semibold text-xs mb-1">
              <span>MANAK AI Response Notice</span>
            </div>
            <p className="text-sm text-gray-800 mb-3">
              {message.text || "We couldn't process that question. Please try again."}
            </p>
            {onRetry && (
              <button
                type="button"
                onClick={() => onRetry(message.id)}
                className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-white border border-red-300 text-[#D7193F] hover:bg-red-50 transition-colors shadow-2xs cursor-pointer"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Try Again</span>
              </button>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex justify-start my-3 sm:my-4 max-w-3xl">
      <div className="flex items-start space-x-3 w-full">
        <div className="w-8 h-8 rounded-xl bg-red-50 border border-red-200 text-[#D7193F] flex items-center justify-center shrink-0 mt-1 shadow-2xs">
          <Sparkles className="w-4 h-4" />
        </div>

        <div className="bg-white border border-gray-200 rounded-2xl rounded-tl-xs p-4 sm:p-5 shadow-2xs flex-1 space-y-4">
          {/* Header & Confidence */}
          <div className="flex items-center justify-between border-b border-gray-100 pb-3 flex-wrap gap-2">
            <div className="flex items-center space-x-2">
              <span className="text-xs font-bold text-gray-900 tracking-tight">
                MANAK <span className="text-[#D7193F]">AI</span>
              </span>
              <span className="text-[10px] text-gray-400 font-mono">
                {message.timestamp}
              </span>
            </div>
            {message.confidence && (
              <ConfidenceBadge level={message.confidence} />
            )}
          </div>

          {/* 1. DIRECT ANSWER */}
          <div className="text-sm text-gray-800 leading-relaxed space-y-2 font-normal">
            <p>{message.text}</p>
          </div>

          {/* 2. RELEVANT STANDARDS */}
          {message.standards && message.standards.length > 0 && (
            <div className="space-y-2.5 pt-2">
              <div className="flex items-center space-x-2">
                <span className="text-xs font-bold text-gray-900 uppercase tracking-wider">
                  Relevant Indian Standards ({message.standards.length})
                </span>
              </div>
              <div className="grid grid-cols-1 gap-2.5">
                {message.standards.map((std) => (
                  <StandardCard key={std.id} standard={std} />
                ))}
              </div>
            </div>
          )}

          {/* 3. EVIDENCE & CITATIONS */}
          {message.evidence && message.evidence.length > 0 && (
            <div className="space-y-2 pt-2">
              <div className="flex items-center space-x-2">
                <span className="text-xs font-bold text-[#1677B7] uppercase tracking-wider">
                  Official Gazette & Regulatory Citations
                </span>
              </div>
              <div className="space-y-2">
                {message.evidence.map((ev, idx) => (
                  <EvidenceCard key={idx} evidence={ev} />
                ))}
              </div>
            </div>
          )}

          {/* 4. FOLLOW-UP PROMPT CHIP */}
          {message.followUpPrompt && (
            <div className="bg-gray-50 border border-gray-200 rounded-xl p-3 flex items-start space-x-2 text-xs">
              <span className="font-semibold text-gray-900 shrink-0">Follow-up:</span>
              <button
                type="button"
                onClick={() => onFollowUpClick(message.followUpPrompt!)}
                className="text-left text-[#1677B7] hover:underline font-medium cursor-pointer"
              >
                "{message.followUpPrompt}"
              </button>
            </div>
          )}

          {/* 5. SUGGESTED NEXT ACTIONS */}
          {message.suggestedActions && message.suggestedActions.length > 0 && (
            <SuggestedActions
              actions={message.suggestedActions}
              onFollowUpClick={onFollowUpClick}
            />
          )}
        </div>
      </div>
    </div>
  );
}

export default MessageBubble;
