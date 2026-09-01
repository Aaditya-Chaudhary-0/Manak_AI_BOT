import { ShieldCheck, ExternalLink } from 'lucide-react';

export function CertificationDisclaimer() {
  return (
    <div className="bg-blue-50/60 border border-blue-200 rounded-xl p-4 shadow-2xs space-y-2">
      <div className="flex items-center space-x-2">
        <div className="w-6 h-6 rounded-md bg-blue-100 text-blue-700 flex items-center justify-center shrink-0">
          <ShieldCheck className="w-4 h-4" />
        </div>
        <h4 className="text-xs font-bold text-blue-900 tracking-wider uppercase">
          Certification Guidance & Verification Notice
        </h4>
      </div>

      <p className="text-xs text-blue-950/80 leading-relaxed pl-8">
        Certification requirements can vary by product, scheme and applicable regulations. Verify the current requirements using official BIS sources before filing applications or concluding conformity assessments.
      </p>

      <div className="pt-2 border-t border-blue-100 flex items-center justify-between text-[11px] text-blue-800 pl-8">
        <span>Official Portals: Bureau of Indian Standards & BIS CRS Portal</span>
        <a
          href="https://www.services.bis.gov.in"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center space-x-1 font-semibold text-blue-700 hover:text-blue-900 hover:underline"
        >
          <span>Official BIS Portal</span>
          <ExternalLink className="w-3 h-3" />
        </a>
      </div>
    </div>
  );
}

export default CertificationDisclaimer;
