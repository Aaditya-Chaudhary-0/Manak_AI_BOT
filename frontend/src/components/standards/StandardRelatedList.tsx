import { Link } from 'react-router-dom';
import { GitFork, ArrowUpRight } from 'lucide-react';
import type { StandardDetail } from '../../data/mockStandardsData';

interface StandardRelatedListProps {
  relatedStandards: StandardDetail[];
}

export function StandardRelatedList({ relatedStandards }: StandardRelatedListProps) {
  if (!relatedStandards || relatedStandards.length === 0) return null;

  return (
    <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-2xs space-y-4">
      <div className="flex items-center space-x-2 border-b border-gray-100 pb-3">
        <GitFork className="w-5 h-5 text-gray-700" />
        <h3 className="text-base font-bold text-gray-900">
          Related Indian Standards & Companion Parts
        </h3>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
        {relatedStandards.map((std) => (
          <Link
            key={std.id}
            to={`/app/standards/${std.id}`}
            className="group bg-gray-50/70 border border-gray-200 rounded-xl p-4 hover:bg-white hover:border-blue-300 hover:shadow-xs transition-all flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <span className="font-mono text-xs font-bold text-gray-900 bg-white px-2 py-0.5 rounded border border-gray-200">
                  {std.code}
                </span>
                <span className="text-[10px] font-medium text-green-700 bg-green-50 px-1.5 py-0.5 rounded border border-green-200">
                  {std.status}
                </span>
              </div>
              <h4 className="text-xs font-semibold text-gray-800 group-hover:text-blue-700 transition-colors line-clamp-2 mt-2 leading-snug">
                {std.title}
              </h4>
            </div>

            <div className="mt-3 pt-2 border-t border-gray-200/60 flex items-center justify-between text-[11px] text-blue-600 font-medium">
              <span>View Details</span>
              <ArrowUpRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}

export default StandardRelatedList;
