import React, { useState, useRef, useEffect } from 'react';
import { Send, CornerDownLeft, Sparkles } from 'lucide-react';

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
    <div className="bg-white border-t border-gray-200 p-4 sticky bottom-0 z-20">
      <div className="max-w-4xl mx-auto">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSubmit();
          }}
          className="relative flex items-end bg-white border border-gray-300 rounded-xl shadow-xs focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-100 transition-all p-2 gap-2"
        >
          <div className="pl-2 pb-2 text-gray-400">
            <Sparkles className="w-4 h-4 text-gray-400" />
          </div>

          <textarea
            ref={textareaRef}
            rows={1}
            value={text}
            onChange={handleChange}
            onKeyDown={handleKeyDown}
            disabled={isLoading || disabled}
            placeholder="Ask anything about BIS Standards, product certification, or test requirements..."
            className="flex-1 max-h-32 min-h-[38px] py-1.5 px-2 text-sm text-gray-900 placeholder:text-gray-400 bg-transparent resize-none focus:outline-none leading-relaxed"
            aria-label="Ask about a BIS standard"
          />

          <div className="flex items-center space-x-2 pb-1 pr-1">
            <button
              type="submit"
              disabled={isSendDisabled}
              className={`p-2 rounded-lg text-white font-medium transition-all flex items-center justify-center ${
                isSendDisabled
                  ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                  : 'bg-red-600 hover:bg-red-700 active:scale-95 shadow-xs'
              }`}
              title={isSendDisabled ? 'Type a question to send' : 'Send message (Enter)'}
              aria-label="Send message"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
        </form>

        <div className="flex items-center justify-between mt-2 px-1 text-[11px] text-gray-400">
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
          <span className="hidden sm:inline">
            Manak AI references official BIS data catalogs
          </span>
        </div>
      </div>
    </div>
  );
}

export default MessageInput;
