import { CheckCircle2, Info } from 'lucide-react';
import AdminLayout from '../../layouts/AdminLayout';
import { INITIAL_SYSTEM_COMPONENTS } from '../../data/mockAdminData';

export function SystemStatusPage() {
  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* PAGE HEADER */}
        <div>
          <div className="flex items-center space-x-2 text-xs text-gray-500 mb-1">
            <span>Admin</span>
            <span>/</span>
            <span className="text-gray-900 font-medium">System Status</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 tracking-tight">
            System & Service Health Status
          </h1>
          <p className="text-sm text-gray-600 mt-1">
            Monitor client application health, catalog index state, AI Assistant engine readiness, and demo service integration.
          </p>
        </div>

        {/* DEMO STATUS DISCLAIMER BANNER */}
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 flex items-start space-x-3 text-blue-900">
          <Info className="h-5 w-5 text-blue-600 shrink-0 mt-0.5" />
          <div className="text-xs space-y-1">
            <h3 className="font-bold text-sm text-blue-950">Frontend Demo Environment Active</h3>
            <p className="text-blue-800 leading-relaxed">
              All services listed below demonstrate the operational frontend application layer and mock datasets. Backend microservice status metrics will connect to real health endpoints during future API integration phases.
            </p>
          </div>
        </div>

        {/* SYSTEM COMPONENTS GRID */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {INITIAL_SYSTEM_COMPONENTS.map((sys) => (
            <div
              key={sys.id}
              className="bg-white border border-gray-200 rounded-xl p-5 shadow-2xs hover:shadow-xs transition-shadow space-y-3"
            >
              <div className="flex items-start justify-between">
                <div>
                  <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
                    {sys.category}
                  </span>
                  <h3 className="text-base font-bold text-gray-900 mt-0.5">{sys.name}</h3>
                </div>
                <span
                  className={`shrink-0 inline-flex items-center space-x-1 px-2.5 py-1 rounded text-xs font-semibold ${
                    sys.status === 'Operational'
                      ? 'bg-green-50 text-green-700 border border-green-200'
                      : sys.status === 'Demo'
                      ? 'bg-blue-50 text-blue-700 border border-blue-200'
                      : 'bg-red-50 text-red-700 border border-red-200'
                  }`}
                >
                  <CheckCircle2 className="h-3.5 w-3.5" />
                  <span>{sys.status}</span>
                </span>
              </div>

              <p className="text-xs text-gray-600 leading-relaxed">{sys.description}</p>

              <div className="pt-3 border-t border-gray-100 flex items-center justify-between text-xs text-gray-500">
                <span>Last verified: {sys.lastChecked}</span>
                <span className="text-gray-400 font-mono">Status: 200 OK</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </AdminLayout>
  );
}

export default SystemStatusPage;
