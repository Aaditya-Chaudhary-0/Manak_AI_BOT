import { Loader2 } from 'lucide-react';

export function StandardsLoadingState() {
  return (
    <div className="space-y-4">
      <div className="flex items-center space-x-2 text-xs font-semibold text-blue-700 bg-blue-50 border border-blue-200 px-3 py-2 rounded-lg">
        <Loader2 className="w-4 h-4 animate-spin text-blue-600" />
        <span>Searching and filtering Indian Standards index...</span>
      </div>

      <div className="space-y-3">
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="bg-white border border-gray-200 rounded-xl p-5 shadow-2xs space-y-3 animate-pulse"
          >
            <div className="flex items-center space-x-2">
              <div className="h-5 bg-gray-200 rounded w-32"></div>
              <div className="h-4 bg-gray-100 rounded w-16"></div>
              <div className="h-4 bg-gray-100 rounded w-24"></div>
            </div>
            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            <div className="h-3 bg-gray-100 rounded w-5/6"></div>
            <div className="h-12 bg-gray-50 rounded-lg"></div>
            <div className="pt-2 border-t border-gray-100 flex justify-between">
              <div className="h-3 bg-gray-100 rounded w-28"></div>
              <div className="h-3 bg-gray-200 rounded w-36"></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default StandardsLoadingState;
