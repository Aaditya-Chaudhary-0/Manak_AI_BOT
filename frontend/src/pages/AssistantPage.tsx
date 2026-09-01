import { useState, useEffect, useRef, useCallback } from 'react';
import { useLocation } from 'react-router-dom';
import AppLayout from '../components/layout/AppLayout';
import AssistantHeader from '../components/assistant/AssistantHeader';
import MessageBubble from '../components/assistant/MessageBubble';
import EmptyState from '../components/assistant/EmptyState';
import LoadingState from '../components/assistant/LoadingState';
import MessageInput from '../components/assistant/MessageInput';
import ConversationHistory from '../components/assistant/ConversationHistory';
import { 
  RECENT_CONVERSATIONS_LIST, 
  getMockResponseForQuery 
} from '../data/mockAssistantData';
import type { 
  AssistantMessage, 
  ConversationSession 
} from '../data/mockAssistantData';
import { History, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export function AssistantPage() {
  const location = useLocation();
  const [messages, setMessages] = useState<AssistantMessage[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [conversations, setConversations] = useState<ConversationSession[]>(RECENT_CONVERSATIONS_LIST);
  const [activeConvId, setActiveConvId] = useState<string | undefined>(undefined);
  const [showHistorySidebar, setShowHistorySidebar] = useState<boolean>(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const processedQueryRef = useRef<string | null>(null);

  // Auto-scroll to bottom of conversation
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  // Core handler for sending queries (stays in React state on /app/assistant)
  const handleSendMessage = useCallback((queryText: string) => {
    if (!queryText.trim()) return;

    const userMessage: AssistantMessage = {
      id: `usr-${Date.now()}`,
      role: 'user',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      text: queryText.trim(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setIsLoading(true);

    // Simulate realistic AI lookup latency
    setTimeout(() => {
      const aiResponse = getMockResponseForQuery(queryText.trim());
      setMessages((prev) => [...prev, aiResponse]);
      setIsLoading(false);

      // Create new session in conversation history if new thread
      const newConvId = `conv-${Date.now()}`;
      const newConv: ConversationSession = {
        id: newConvId,
        title: queryText.slice(0, 38) + (queryText.length > 38 ? '...' : ''),
        date: 'Just now',
        messages: [userMessage, aiResponse],
      };
      setConversations((prev) => [newConv, ...prev]);
      setActiveConvId(newConvId);
    }, 600);
  }, []);

  // Handle incoming query from Dashboard, Matcher, or Certification
  useEffect(() => {
    const state = location.state as { initialQuery?: string } | null;
    const searchParams = new URLSearchParams(location.search);
    const queryParam = searchParams.get('q');
    const incomingQuery = state?.initialQuery || queryParam;

    if (incomingQuery && incomingQuery !== processedQueryRef.current) {
      processedQueryRef.current = incomingQuery;
      handleSendMessage(incomingQuery);
      // Clean location state to avoid re-trigger on simple rerenders
      window.history.replaceState({}, document.title, window.location.pathname);
    }
  }, [location.state, location.search, handleSendMessage]);

  // Start fresh chat
  const handleNewChat = () => {
    setMessages([]);
    setActiveConvId(undefined);
    processedQueryRef.current = null;
  };

  // Select an existing conversation from history
  const handleSelectConversation = (session: ConversationSession) => {
    setMessages(session.messages);
    setActiveConvId(session.id);
    setShowHistorySidebar(false);
  };

  // Handle follow up suggestion click
  const handleFollowUpClick = (followUpPrompt: string) => {
    handleSendMessage(followUpPrompt);
  };

  // Handle retry
  const handleRetry = (msgId: string) => {
    const errorIndex = messages.findIndex((m) => m.id === msgId);
    if (errorIndex > 0) {
      const priorUserMsg = messages[errorIndex - 1];
      if (priorUserMsg && priorUserMsg.role === 'user') {
        setMessages((prev) => prev.filter((m) => m.id !== msgId));
        handleSendMessage(priorUserMsg.text);
      }
    }
  };

  return (
    <AppLayout
      pageTitle="MANAK AI Assistant"
      pageSubtitle="Interactive Standards Intelligence, Test Methods & Verification"
    >
      <div className="flex flex-1 w-full bg-[#F7F8FA]">
        {/* Main Conversation Column */}
        <div className="flex-1 flex flex-col min-w-0 bg-white border-r border-gray-200">
          {/* Header */}
          <div className="relative shrink-0">
            <AssistantHeader
              onNewChat={handleNewChat}
              hasMessages={messages.length > 0}
            />
            {/* Mobile / Tablet Toggle for History */}
            <div className="lg:hidden absolute right-28 top-4">
              <button
                onClick={() => setShowHistorySidebar(!showHistorySidebar)}
                className="inline-flex items-center space-x-1 px-2.5 py-1.5 rounded-lg text-xs font-semibold bg-gray-100 text-gray-700 hover:bg-gray-200 transition-colors"
                title="Toggle recent queries"
              >
                <History className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Recent</span>
              </button>
            </div>
          </div>

          {/* Conversation Chat Scroll Area */}
          <div className="flex-1 overflow-y-auto px-4 sm:px-6 py-6 space-y-6 bg-[#F7F8FA]">
            {messages.length === 0 ? (
              <EmptyState onSelectPrompt={handleSendMessage} />
            ) : (
              <div className="max-w-4xl mx-auto space-y-4">
                <AnimatePresence initial={false}>
                  {messages.map((msg) => (
                    <motion.div
                      key={msg.id}
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      <MessageBubble
                        message={msg}
                        onFollowUpClick={handleFollowUpClick}
                        onRetry={handleRetry}
                      />
                    </motion.div>
                  ))}
                </AnimatePresence>

                {isLoading && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                  >
                    <LoadingState />
                  </motion.div>
                )}
                <div ref={messagesEndRef} />
              </div>
            )}
          </div>

          {/* Message Composer (Anchored Sticky Bottom) */}
          <MessageInput
            onSendMessage={handleSendMessage}
            isLoading={isLoading}
          />
        </div>

        {/* Desktop Recent Queries Sidebar */}
        <div className="hidden lg:block w-72 bg-white shrink-0 border-l border-gray-100 h-full">
          <ConversationHistory
            conversations={conversations}
            activeConversationId={activeConvId}
            onSelectConversation={handleSelectConversation}
            onNewChat={handleNewChat}
          />
        </div>

        {/* Mobile History Drawer Overlay */}
        {showHistorySidebar && (
          <div
            className="fixed inset-0 bg-gray-900/40 backdrop-blur-2xs z-50 lg:hidden flex justify-end"
            onClick={() => setShowHistorySidebar(false)}
          >
            <div
              className="w-80 max-w-full bg-white h-full shadow-2xl flex flex-col z-50"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-3 border-b border-gray-200 flex items-center justify-between">
                <span className="text-xs font-bold text-gray-900 uppercase tracking-wider">
                  Recent Conversations
                </span>
                <button
                  onClick={() => setShowHistorySidebar(false)}
                  className="p-1 rounded-md text-gray-400 hover:text-gray-700 hover:bg-gray-100"
                  aria-label="Close recent conversations"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
              <div className="flex-1 overflow-y-auto">
                <ConversationHistory
                  conversations={conversations}
                  activeConversationId={activeConvId}
                  onSelectConversation={handleSelectConversation}
                  onNewChat={() => {
                    handleNewChat();
                    setShowHistorySidebar(false);
                  }}
                />
              </div>
            </div>
          </div>
        )}
      </div>
    </AppLayout>
  );
}

export default AssistantPage;
