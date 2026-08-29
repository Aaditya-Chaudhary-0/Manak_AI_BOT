import { Sparkles, Loader2 } from 'lucide-react';

export function LoadingState() {
  return (
    <div className="bg-white border border-gray-200 rounded-2xl p-5 shadow-2xs space-y-4 max-w-3xl animate-pulse">
      <div className="flex items-center space-x-3">
        <div className="w-8 h-8 rounded-xl bg-red-100 flex items-center justify-center text-red-600">
          <Sparkles className="w-4 h-4" />
        </div>
        <div className="flex items-center space-x-2">
          <span className="text-xs font-bold text-gray-900 tracking-tight">
            MANAK AI
          </span>
          <span className="text-gray-300">|</span>
          <div className="flex items-center space-x-1.5 text-xs text-blue-700 font-medium">
            <Loader2 className="w-3.5 h-3.5 animate-spin" />
            <span>Finding relevant BIS information and standard clauses...</span>
          </div>
        </div>
      </div>

      <div className="space-y-2.5 pt-1 pl-11">
        <div className="h-3 bg-gray-100 rounded-md w-11/12"></div>
        <div className="h-3 bg-gray-100 rounded-md w-4/5"></div>
        <div className="h-3 bg-gray-100 rounded-md w-3/4"></div>
      </div>

      <div className="pl-11 pt-2 grid grid-cols-1 gap-2">
        <div className="h-16 bg-gray-50 border border-gray-100 rounded-lg"></div>
      </div>
    </div>
  );
}

export default LoadingState;
