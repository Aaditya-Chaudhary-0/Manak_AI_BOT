import { useState, useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import AppLayout from '../components/layout/AppLayout';
import AssistantHeader from '../components/assistant/AssistantHeader';
import MessageBubble from '../components/assistant/MessageBubble';
import EmptyState from '../components/assistant/EmptyState';
import LoadingState from '../components/assistant/LoadingState';
import MessageInput from '../components/assistant/MessageInput';
import ConversationHistory from '../components/assistant/ConversationHistory';
import { 
  RECENT_CONVERSATIONS_LIST 
} from '../data/mockAssistantData';
import type { 
  AssistantMessage, 
  ConversationSession,
  StandardItem,
  EvidenceItem
} from '../data/mockAssistantData';
import { History, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { searchApi } from '../lib/api';

export function AssistantPage() {
  const location = useLocation();
  const [messages, setMessages] = useState<AssistantMessage[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [conversations, setConversations] = useState<ConversationSession[]>(RECENT_CONVERSATIONS_LIST);
  const [activeConvId, setActiveConvId] = useState<string | undefined>(undefined);
  const [showHistorySidebar, setShowHistorySidebar] = useState<boolean>(false);
  const [prefilledQuery, setPrefilledQuery] = useState<string>('');

  // Handle incoming contextual navigation from Product Matcher or Certification
  useEffect(() => {
    const state = location.state as { initialQuery?: string } | null;
    if (state?.initialQuery) {
      setPrefilledQuery(state.initialQuery);
    }
  }, [location.state]);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom of conversation
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  // Handle sending a query
  const handleSendMessage = async (queryText: string) => {
    if (!queryText.trim()) return;

    const userMessage: AssistantMessage = {
      id: `usr-${Date.now()}`,
      role: 'user',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      text: queryText,
    };

    setMessages((prev) => [...prev, userMessage]);
    setIsLoading(true);
    setPrefilledQuery('');

    try {
      const searchRes = await searchApi({ query: queryText });

      let responseText = '';
      let confidence: 'High' | 'Medium' | 'Low' = 'Low';
      const standards: StandardItem[] = [];
      const evidence: EvidenceItem[] = [];

      if (searchRes.abstained || !searchRes.results || searchRes.results.length === 0) {
        responseText = searchRes.message || 'No sufficiently relevant evidence found in the indexed BIS corpus.';
        confidence = 'Low';
      } else {
        responseText = `Found ${searchRes.results.length} relevant standard specification(s) in official BIS data for: "${queryText}".`;
        confidence = searchRes.results[0].confidence || 'High';

        searchRes.results.forEach((res) => {
          standards.push({
            id: res.result_id,
            code: res.standard_code || 'BIS Standard',
            title: res.title,
            status: 'Active',
            relevanceReason: `Score: ${(res.score * 100).toFixed(0)}% match`,
            category: 'BIS Standard Specification',
            link: res.source_url,
          });

          evidence.push({
            sourceName: res.title,
            document: res.standard_code || res.title,
            clause: `Confidence: ${res.confidence} (${(res.score * 100).toFixed(0)}%)`,
            excerpt: res.snippet,
            sourceUrl: res.source_url,
          });
        });
      }

      const aiResponse: AssistantMessage = {
        id: `ai-${Date.now()}`,
        role: 'assistant',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        text: responseText,
        confidence,
        standards: standards.length > 0 ? standards : undefined,
        evidence: evidence.length > 0 ? evidence : undefined,
        suggestedActions: [
          {
            id: 'follow-1',
            label: 'View Detailed Specifications',
            type: 'followup',
            payload: `Show detailed specifications for ${queryText}`,
            primary: true,
          },
        ],
      };

      setMessages((prev) => [...prev, aiResponse]);

      if (!activeConvId) {
        const newConvId = `conv-${Date.now()}`;
        const newConv: ConversationSession = {
          id: newConvId,
          title: queryText.slice(0, 36) + (queryText.length > 36 ? '...' : ''),
          date: 'Just now',
          messages: [userMessage, aiResponse],
        };
        setConversations((prev) => [newConv, ...prev]);
        setActiveConvId(newConvId);
      }
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to connect to search service.';
      const errorMsg: AssistantMessage = {
        id: `err-${Date.now()}`,
        role: 'assistant',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        text: `Error performing search: ${errorMessage}`,
        isError: true,
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  // Start fresh chat
  const handleNewChat = () => {
    setMessages([]);
    setActiveConvId(undefined);
    setPrefilledQuery('');
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
        // Remove error message and resend
        setMessages((prev) => prev.filter((m) => m.id !== msgId));
        handleSendMessage(priorUserMsg.text);
      }
    }
  };

  return (
    <AppLayout
      pageTitle="MANAK AI Assistant"
      pageSubtitle="Search, analyze, and verify Bureau of Indian Standards (BIS)"
    >
      <div className="flex h-[calc(100vh-4rem)] bg-gray-50/50">
        {/* Main Conversation Column */}
        <div className="flex-1 flex flex-col min-w-0 bg-white border-r border-gray-200">
          {/* Header */}
          <div className="relative">
            <AssistantHeader
              onNewChat={handleNewChat}
              hasMessages={messages.length > 0}
            />
            {/* Mobile / Compact Toggle for History */}
            <div className="lg:hidden absolute right-28 top-4">
              <button
                onClick={() => setShowHistorySidebar(!showHistorySidebar)}
                className="inline-flex items-center space-x-1 px-2.5 py-1.5 rounded-lg text-xs font-medium bg-gray-100 text-gray-700 hover:bg-gray-200"
                title="Toggle recent queries"
              >
                <History className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Recent</span>
              </button>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto px-4 sm:px-6 py-6 space-y-6">
            {messages.length === 0 ? (
              <EmptyState onSelectPrompt={handleSendMessage} />
            ) : (
              <div className="max-w-4xl mx-auto space-y-4">
                <AnimatePresence initial={false}>
                  {messages.map((msg) => (
                    <motion.div
                      key={msg.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3 }}
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

          {/* Message Composer */}
          <MessageInput
            onSendMessage={handleSendMessage}
            isLoading={isLoading}
            initialValue={prefilledQuery}
          />
        </div>

        {/* Desktop Recent Queries Sidebar */}
        <div className="hidden lg:block w-72 bg-white shrink-0 border-l border-gray-100">
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
            className="fixed inset-0 bg-gray-900/30 z-50 lg:hidden flex justify-end"
            onClick={() => setShowHistorySidebar(false)}
          >
            <div
              className="w-80 max-w-full bg-white h-full shadow-2xl flex flex-col"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-3 border-b border-gray-200 flex items-center justify-between">
                <span className="text-xs font-bold text-gray-900 uppercase tracking-wider">
                  Recent Conversations
                </span>
                <button
                  onClick={() => setShowHistorySidebar(false)}
                  className="p-1 rounded-md text-gray-400 hover:text-gray-700 hover:bg-gray-100"
                  aria-label="Close"
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
