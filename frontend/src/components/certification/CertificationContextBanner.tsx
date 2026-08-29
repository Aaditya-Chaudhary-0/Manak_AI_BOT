import type { ProductFormData } from '../../data/mockRecommendationData';
import type { StandardDetail } from '../../data/mockStandardsData';
import { Package, ShieldCheck, Tag, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

interface CertificationContextBannerProps {
  product?: ProductFormData;
  standard?: StandardDetail;
  relevance?: string;
}

export function CertificationContextBanner({
  product,
  standard,
  relevance,
}: CertificationContextBannerProps) {
  if (!product && !standard) {
    return null;
  }

  return (
    <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-2xs space-y-4 mb-6">
      <div className="flex items-center justify-between border-b border-gray-100 pb-3">
        <div className="flex items-center space-x-2">
          <span className="w-2 h-2 rounded-full bg-blue-600"></span>
          <span className="text-xs font-bold text-gray-900 uppercase tracking-wider">
            Active Evaluation Context
          </span>
        </div>
        <span className="text-[11px] font-medium text-gray-500 bg-gray-50 px-2 py-0.5 rounded border border-gray-200">
          Source: Product Matcher
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
        {/* Product Context */}
        {product && (
          <div className="bg-gray-50/80 border border-gray-100 rounded-xl p-3.5 space-y-1.5">
            <div className="flex items-center space-x-1.5 text-gray-500 font-bold uppercase tracking-wider text-[10px]">
              <Package className="w-3.5 h-3.5 text-red-600" />
              <span>Target Product</span>
            </div>
            <p className="font-bold text-gray-900 text-sm">{product.name}</p>
            <div className="flex items-center space-x-2 text-gray-600">
              <span className="inline-flex items-center space-x-1 font-medium bg-white px-2 py-0.5 rounded border border-gray-200 text-[11px]">
                <Tag className="w-3 h-3 text-gray-400" />
                <span>{product.category}</span>
              </span>
              {relevance && (
                <span className="text-[11px] font-semibold text-green-700 bg-green-50 px-2 py-0.5 rounded border border-green-200">
                  {relevance}
                </span>
              )}
            </div>
          </div>
        )}

        {/* Standard Context */}
        {standard && (
          <div className="bg-blue-50/50 border border-blue-100 rounded-xl p-3.5 space-y-1.5">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-1.5 text-blue-900 font-bold uppercase tracking-wider text-[10px]">
                <ShieldCheck className="w-3.5 h-3.5 text-blue-600" />
                <span>Mapped Standard</span>
              </div>
              <Link
                to={`/app/standards/${standard.id}`}
                className="text-[11px] font-semibold text-blue-700 hover:text-blue-900 inline-flex items-center space-x-0.5"
              >
                <span>Details</span>
                <ArrowRight className="w-3 h-3" />
              </Link>
            </div>
            <p className="font-mono font-bold text-gray-900 text-sm">{standard.code}</p>
            <p className="text-gray-700 line-clamp-1 font-medium text-xs">{standard.title}</p>
            <div className="flex items-center space-x-2">
              <span className="text-[11px] font-medium text-blue-800 bg-white px-2 py-0.5 rounded border border-blue-200">
                {standard.standardType}
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default CertificationContextBanner;
