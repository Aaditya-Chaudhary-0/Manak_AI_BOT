import { PlusCircle, Sparkles, CheckCircle2 } from 'lucide-react';

interface AssistantHeaderProps {
  onNewChat: () => void;
  hasMessages?: boolean;
}

export function AssistantHeader({ onNewChat }: AssistantHeaderProps) {
  return (
    <div className="bg-white border-b border-gray-200 px-6 py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shrink-0">
      <div className="flex items-start sm:items-center space-x-3">
        <div className="w-10 h-10 rounded-xl bg-red-50 border border-red-200 flex items-center justify-center text-red-600 shrink-0 shadow-2xs">
          <Sparkles className="w-5 h-5" />
        </div>
        <div>
          <div className="flex items-center space-x-2 flex-wrap">
            <h2 className="text-lg font-bold text-gray-900 tracking-tight">
              MANAK<span className="text-red-600">AI</span>
            </h2>
            <span className="text-gray-300 font-light">|</span>
            <span className="text-sm font-semibold text-gray-700">
              BIS Intelligence Assistant
            </span>
            <span className="inline-flex items-center space-x-1 px-2 py-0.5 rounded-full text-[11px] font-medium bg-green-50 text-green-700 border border-green-200">
              <CheckCircle2 className="w-3 h-3 text-green-600" />
              <span>Ready to help</span>
            </span>
          </div>
          <p className="text-xs text-gray-500 mt-0.5">
            Ask questions about Indian Standards, certification, and BIS-related requirements.
          </p>
        </div>
      </div>

      <div className="flex items-center space-x-2">
        <button
          onClick={onNewChat}
          className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-gray-700 bg-white border border-gray-300 hover:bg-gray-50 hover:text-gray-900 transition-colors shadow-2xs"
          title="Start a new chat session"
        >
          <PlusCircle className="w-4 h-4 text-red-600" />
          <span>New Chat</span>
        </button>
      </div>
    </div>
  );
}

export default AssistantHeader;
