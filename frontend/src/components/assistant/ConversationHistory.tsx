import { MessageSquare, Clock, Plus } from 'lucide-react';
import type { ConversationSession } from '../../data/mockAssistantData';

interface ConversationHistoryProps {
  conversations: ConversationSession[];
  activeConversationId?: string;
  onSelectConversation: (conversation: ConversationSession) => void;
  onNewChat: () => void;
}

export function ConversationHistory({
  conversations,
  activeConversationId,
  onSelectConversation,
  onNewChat,
}: ConversationHistoryProps) {
  return (
    <div className="w-full bg-white flex flex-col h-full">
      <div className="p-4 border-b border-gray-200 flex items-center justify-between">
        <div className="flex items-center space-x-2 text-xs font-bold text-gray-900 uppercase tracking-wider">
          <Clock className="w-4 h-4 text-gray-500" />
          <span>Recent Queries</span>
        </div>
        <button
          onClick={onNewChat}
          className="p-1 text-red-600 hover:bg-red-50 rounded-md transition-colors"
          title="Start new conversation"
          aria-label="New chat"
        >
          <Plus className="w-4 h-4" />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-2 space-y-1">
        {conversations.map((conv) => {
          const isActive = activeConversationId === conv.id;
          return (
            <button
              key={conv.id}
              onClick={() => onSelectConversation(conv)}
              className={`w-full text-left p-2.5 rounded-lg text-xs transition-all flex items-center justify-between group ${
                isActive
                  ? 'bg-red-50 text-red-700 font-semibold border border-red-200 shadow-2xs'
                  : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900 border border-transparent'
              }`}
            >
              <div className="flex items-center space-x-2 truncate">
                <MessageSquare className={`w-3.5 h-3.5 shrink-0 ${isActive ? 'text-red-600' : 'text-gray-400 group-hover:text-gray-600'}`} />
                <span className="truncate">{conv.title}</span>
              </div>
              <span className="text-[10px] text-gray-400 shrink-0 ml-1">
                {conv.date}
              </span>
            </button>
          );
        })}
      </div>

      <div className="p-3 border-t border-gray-100 bg-gray-50/50 text-[11px] text-gray-500 text-center">
        <span>History saved locally in browser session</span>
      </div>
    </div>
  );
}

export default ConversationHistory;
