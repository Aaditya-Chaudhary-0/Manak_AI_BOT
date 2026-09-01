import React, { useState, useRef, useEffect } from 'react';
import { Send, CornerDownLeft, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';
import { buttonPress, microHoverLift } from '../../styles/animation';

interface MessageInputProps {
  onSendMessage: (text: string) => void;
  isLoading: boolean;
  disabled?: boolean;
  initialValue?: string;
}

export function MessageInput({ onSendMessage, isLoading, disabled, initialValue = '' }: MessageInputProps) {
  const [text, setText] = useState(initialValue);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (initialValue) {
      setText(initialValue);
      if (textareaRef.current) {
        textareaRef.current.focus();
      }
    }
  }, [initialValue]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  const handleSubmit = () => {
    if (!text.trim() || isLoading || disabled) return;
    onSendMessage(text.trim());
    setText('');
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setText(e.target.value);
    // Auto-adjust height up to 120px
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 120)}px`;
    }
  };

  const isSendDisabled = !text.trim() || isLoading || disabled;

  return (
    <div className="bg-white px-4 py-3 sm:px-6 sm:py-4 w-full shadow-xs">
      <div className="max-w-4xl mx-auto w-full">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSubmit();
          }}
          className="relative flex items-end bg-white border border-gray-300 rounded-2xl shadow-2xs focus-within:border-[#D7193F] focus-within:ring-2 focus-within:ring-red-100 transition-all p-2 sm:p-2.5 gap-2"
        >
          <div className="pl-1.5 pb-2 text-gray-400 shrink-0">
            <Sparkles className="w-4 h-4 text-[#D7193F]" />
          </div>

          <textarea
            ref={textareaRef}
            rows={1}
            value={text}
            onChange={handleChange}
            onKeyDown={handleKeyDown}
            disabled={isLoading || disabled}
            placeholder="Ask anything about BIS Standards, products, testing, or certification..."
            className="flex-1 max-h-32 min-h-[38px] py-1.5 px-1 text-sm text-gray-900 placeholder:text-gray-400 bg-transparent resize-none focus:outline-none leading-relaxed"
            aria-label="Ask about a BIS standard"
          />

          <div className="flex items-center space-x-2 pb-0.5 pr-0.5 shrink-0">
            <motion.button
              type="submit"
              disabled={isSendDisabled}
              className={`p-2.5 rounded-xl text-white font-semibold transition-all flex items-center justify-center ${
                isSendDisabled
                  ? 'bg-gray-100 text-gray-400 cursor-not-allowed border border-gray-200'
                  : 'bg-[#D7193F] hover:bg-[#BE1435] shadow-2xs cursor-pointer'
              }`}
              title={isSendDisabled ? 'Type a question to send' : 'Send message (Enter)'}
              aria-label="Send message"
              whileTap={buttonPress.whileTap}
              whileHover={microHoverLift.whileHover}
            >
              <Send className="w-4 h-4" />
            </motion.button>
          </div>
        </form>

        <div className="flex items-center justify-between mt-2 px-1 text-[11px] text-gray-500">
          <div className="flex items-center space-x-1">
            <span>Press</span>
            <kbd className="px-1.5 py-0.5 bg-gray-100 border border-gray-200 rounded text-[10px] text-gray-600 font-mono flex items-center">
              Enter <CornerDownLeft className="w-2.5 h-2.5 ml-0.5 inline" />
            </kbd>
            <span>to send,</span>
            <kbd className="px-1.5 py-0.5 bg-gray-100 border border-gray-200 rounded text-[10px] text-gray-600 font-mono">
              Shift + Enter
            </kbd>
            <span>for new line</span>
          </div>
          <span className="hidden sm:inline text-gray-400">
            Grounded in official BIS standards catalogue
          </span>
        </div>
      </div>
    </div>
  );
}

export default MessageInput;
