import React from 'react';
import { ArrowRight, HelpCircle, Lightbulb, Shield, BookOpen, Layers } from 'lucide-react';
import { EXAMPLE_PROMPTS } from '../../data/mockAssistantData';

interface EmptyStateProps {
  onSelectPrompt: (query: string) => void;
}

export function EmptyState({ onSelectPrompt }: EmptyStateProps) {
  const iconMap: Record<string, React.ReactNode> = {
    'led-bulb': <Lightbulb className="w-4 h-4 text-amber-600" />,
    'cement': <Layers className="w-4 h-4 text-gray-700" />,
    'certification-guidance': <Shield className="w-4 h-4 text-blue-600" />,
    'packaged-water': <BookOpen className="w-4 h-4 text-cyan-600" />,
  };

  return (
    <div className="max-w-3xl mx-auto py-10 px-4 text-center">
      <div className="w-12 h-12 rounded-2xl bg-red-50 border border-red-100 text-red-600 mx-auto flex items-center justify-center mb-4 shadow-2xs">
        <HelpCircle className="w-6 h-6" />
      </div>

      <h3 className="text-2xl font-bold text-gray-900 tracking-tight mb-2">
        How can I help you with BIS?
      </h3>
      <p className="text-sm text-gray-600 max-w-lg mx-auto mb-8">
        Start with a BIS question. Describe your product, regulatory requirement, or testing problem and Manak AI will retrieve applicable Indian Standards and official guidance.
      </p>

      <div className="text-left mb-3">
        <span className="text-xs font-semibold uppercase tracking-wider text-gray-500">
          Recommended starting queries
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-left">
        {EXAMPLE_PROMPTS.map((prompt) => (
          <button
            key={prompt.id}
            onClick={() => onSelectPrompt(prompt.query)}
            className="group p-4 bg-white border border-gray-200 hover:border-red-300 hover:bg-red-50/20 rounded-xl transition-all text-left shadow-2xs flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-[11px] font-medium text-gray-500 bg-gray-100 px-2 py-0.5 rounded">
                  {prompt.badge}
                </span>
                <span className="p-1 rounded-md bg-gray-50 group-hover:bg-red-100 text-gray-400 group-hover:text-red-600 transition-colors">
                  {iconMap[prompt.id] || <HelpCircle className="w-4 h-4" />}
                </span>
              </div>
              <p className="text-xs sm:text-sm font-semibold text-gray-800 group-hover:text-red-700 transition-colors leading-relaxed">
                "{prompt.query}"
              </p>
            </div>
            <div className="mt-3 flex items-center text-[11px] font-medium text-gray-400 group-hover:text-red-600 transition-colors">
              <span>Ask Manak AI</span>
              <ArrowRight className="w-3 h-3 ml-1 group-hover:translate-x-1 transition-transform" />
            </div>
          </button>
        ))}
      </div>

      <div className="mt-8 pt-6 border-t border-gray-100 flex flex-wrap items-center justify-center gap-6 text-xs text-gray-500">
        <div className="flex items-center space-x-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-blue-500"></span>
          <span>Official BIS Standards Mapping</span>
        </div>
        <div className="flex items-center space-x-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-green-500"></span>
          <span>Direct Evidence & Clause Citations</span>
        </div>
        <div className="flex items-center space-x-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-purple-500"></span>
          <span>Bilingual EN / हिन्दी Ready</span>
        </div>
      </div>
    </div>
  );
}

export default EmptyState;
