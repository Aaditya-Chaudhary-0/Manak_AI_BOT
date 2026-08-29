import React, { useState, useRef, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { 
  MessageSquare, 
  X, 
  Search, 
  ListTree, 
  ShieldCheck, 
  History, 
  Bookmark,
  User,
  Send,
  Loader2,
  ChevronRight
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

type Action = {
  label: string;
  path: string;
  icon: React.ElementType;
};

const ALL_ACTIONS: Record<string, Action> = {
  standards: { label: 'Search Standards', path: '/app/standards', icon: Search },
  recommend: { label: 'Product Recommendation', path: '/app/recommend', icon: ListTree },
  certification: { label: 'Certification Guidance', path: '/app/certification', icon: ShieldCheck },
  assistant: { label: 'Ask Manak AI', path: '/app/assistant', icon: MessageSquare },
  saved: { label: 'View Saved Items', path: '/app/saved', icon: Bookmark },
  history: { label: 'View History', path: '/app/history', icon: History },
  profile: { label: 'Profile Settings', path: '/app/profile', icon: User },
};

export function MiniManakAI() {
  const [isOpen, setIsOpen] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const [messages, setMessages] = useState<{role: 'ai' | 'user', text: string}[]>([
    { role: 'ai', text: 'How can I help you navigate BIS information?' }
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const [suggestedActions, setSuggestedActions] = useState<Action[]>([]);

  const navigate = useNavigate();
  const location = useLocation();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Close on Escape
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsOpen(false);
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, []);

  // Scroll to bottom when messages change
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen]);

  // Update contextual actions based on route
  useEffect(() => {
    const path = location.pathname;
    let actions: Action[] = [];

    if (path.includes('/app/dashboard')) {
      actions = [ALL_ACTIONS.standards, ALL_ACTIONS.assistant, ALL_ACTIONS.recommend, ALL_ACTIONS.certification];
      setMessages([{ role: 'ai', text: 'Need help getting started?' }]);
    } else if (path.includes('/app/standards')) {
      actions = [ALL_ACTIONS.recommend, ALL_ACTIONS.assistant];
      setMessages([{ role: 'ai', text: 'Looking for a standard? I can help you search or recommend one.' }]);
    } else if (path.includes('/app/recommend')) {
      actions = [ALL_ACTIONS.standards, ALL_ACTIONS.assistant];
      setMessages([{ role: 'ai', text: 'Need help describing your product?' }]);
    } else if (path.includes('/app/certification')) {
      actions = [ALL_ACTIONS.assistant, ALL_ACTIONS.standards];
      setMessages([{ role: 'ai', text: 'Need help understanding certification schemes?' }]);
    } else if (path.includes('/app/history')) {
      actions = [ALL_ACTIONS.assistant, ALL_ACTIONS.standards, ALL_ACTIONS.recommend];
    } else if (path.includes('/app/saved')) {
      actions = [ALL_ACTIONS.standards, ALL_ACTIONS.assistant];
    } else if (path.includes('/app/profile')) {
      actions = [ALL_ACTIONS.assistant];
      setMessages([{ role: 'ai', text: 'Need help with your account?' }]);
    } else {
      actions = [ALL_ACTIONS.standards, ALL_ACTIONS.assistant, ALL_ACTIONS.recommend, ALL_ACTIONS.certification];
    }

    setSuggestedActions(actions.slice(0, 4));
  }, [location.pathname]);

  const detectIntent = (text: string) => {
    const lower = text.toLowerCase();
    if (lower.includes('standard') || lower.includes('is ') || lower.includes('search') || lower.includes('find bis')) {
      return ALL_ACTIONS.standards;
    }
    if (lower.includes('product') || lower.includes('recommend') || lower.includes('which standard')) {
      return ALL_ACTIONS.recommend;
    }
    if (lower.includes('certification') || lower.includes('isi') || lower.includes('crs') || lower.includes('qco')) {
      return ALL_ACTIONS.certification;
    }
    if (lower.includes('saved') || lower.includes('bookmark')) {
      return ALL_ACTIONS.saved;
    }
    if (lower.includes('history') || lower.includes('previous')) {
      return ALL_ACTIONS.history;
    }
    if (lower.includes('profile') || lower.includes('language') || lower.includes('account')) {
      return ALL_ACTIONS.profile;
    }
    if (lower.includes('explain') || lower.includes('technical') || lower.includes('clause') || lower.includes('question')) {
      return ALL_ACTIONS.assistant;
    }
    return null;
  };

  const handleActionClick = (path: string) => {
    setIsOpen(false);
    navigate(path);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim()) return;

    const userText = inputValue;
    setInputValue('');
    setMessages(prev => [...prev, { role: 'user', text: userText }]);
    setIsLoading(true);

    // Mock processing delay
    setTimeout(() => {
      const intentAction = detectIntent(userText);
      
      if (intentAction) {
        setMessages(prev => [
          ...prev, 
          { 
            role: 'ai', 
            text: `It looks like you need help with ${intentAction.label}. Would you like to go there now?` 
          }
        ]);
        setSuggestedActions([intentAction, ALL_ACTIONS.assistant]);
      } else {
        setMessages(prev => [
          ...prev, 
          { 
            role: 'ai', 
            text: "I'm not exactly sure which section you need. Here are some options that might help:" 
          }
        ]);
        setSuggestedActions([
          ALL_ACTIONS.assistant, 
          ALL_ACTIONS.standards, 
          ALL_ACTIONS.recommend, 
          ALL_ACTIONS.certification
        ]);
      }
      setIsLoading(false);
    }, 600);
  };

  return (
    <>
      <AnimatePresence mode="wait">
        {!isOpen ? (
          <motion.button
            key="button"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setIsOpen(true)}
            className="fixed bottom-6 right-6 z-50 flex items-center space-x-2 bg-red-600 hover:bg-red-700 text-white px-4 py-3 rounded-full shadow-lg transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-600"
            aria-label="Open Mini Manak AI Guide"
          >
            <MessageSquare className="w-5 h-5" />
            <span className="font-semibold text-sm tracking-wide">Ask Manak AI</span>
          </motion.button>
        ) : (
          <motion.div 
            key="panel"
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="fixed bottom-6 right-6 z-50 w-80 md:w-96 bg-white rounded-xl shadow-2xl border border-gray-200 flex flex-col overflow-hidden font-sans"
          >
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-red-50 rounded-full flex items-center justify-center">
            <MessageSquare className="w-4 h-4 text-red-600" />
          </div>
          <div>
            <h3 className="font-bold text-gray-900 text-sm tracking-tight">MANAK<span className="text-red-600">AI</span></h3>
            <p className="text-[10px] font-semibold text-gray-500 uppercase tracking-widest">Global Guide</p>
          </div>
        </div>
        <button 
          onClick={() => setIsOpen(false)}
          className="p-1.5 text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded-md transition-colors focus:outline-none"
          aria-label="Close"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Chat Area */}
      <div className="flex-1 max-h-80 overflow-y-auto p-4 space-y-4 bg-gray-50/50">
        <AnimatePresence initial={false}>
          {messages.map((msg, idx) => (
            <motion.div 
              key={idx} 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2 }}
              className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div className={`max-w-[85%] rounded-lg px-3 py-2 text-sm ${
                msg.role === 'user' 
                  ? 'bg-red-600 text-white font-medium' 
                  : 'bg-white border border-gray-200 text-gray-700 shadow-sm'
              }`}>
                {msg.text}
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-white border border-gray-200 rounded-lg px-3 py-2 shadow-sm flex items-center space-x-2">
              <Loader2 className="w-4 h-4 text-red-600 animate-spin" />
              <span className="text-xs text-gray-500 font-medium">Understanding...</span>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Quick Actions */}
      {suggestedActions.length > 0 && (
        <div className="bg-white px-3 py-2 border-t border-gray-100 border-b">
          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-2 px-1">Suggested Actions</p>
          <div className="flex flex-col space-y-1">
            {suggestedActions.map((action, idx) => {
              const Icon = action.icon;
              return (
                <button
                  key={idx}
                  onClick={() => handleActionClick(action.path)}
                  className="flex items-center justify-between w-full px-2 py-1.5 text-xs text-gray-700 hover:bg-red-50 hover:text-red-700 rounded-md transition-colors group text-left"
                >
                  <div className="flex items-center space-x-2">
                    <Icon className="w-3.5 h-3.5 text-gray-400 group-hover:text-red-600" />
                    <span className="font-medium">{action.label}</span>
                  </div>
                  <ChevronRight className="w-3.5 h-3.5 text-gray-300 group-hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity" />
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Input Area */}
      <form onSubmit={handleSubmit} className="p-3 bg-white">
        <div className="relative flex items-center">
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="Ask where to go..."
            className="w-full bg-gray-50 border border-gray-200 text-sm text-gray-900 rounded-lg pl-3 pr-10 py-2.5 focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500 transition-all placeholder-gray-400"
            disabled={isLoading}
          />
          <button
            type="submit"
            disabled={!inputValue.trim() || isLoading}
            className="absolute right-1.5 p-1.5 bg-red-600 hover:bg-red-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white rounded-md transition-colors focus:outline-none"
            aria-label="Send query"
          >
            <Send className="w-3.5 h-3.5" />
          </button>
        </div>
      </form>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

export default MiniManakAI;
