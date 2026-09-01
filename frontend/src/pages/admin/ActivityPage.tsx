import { useState, useMemo } from 'react';
import {
  Search,
  Clock,
  CheckCircle2,
  AlertTriangle,
  Info,
} from 'lucide-react';
import AdminLayout from '../../layouts/AdminLayout';
import {
  INITIAL_ACTIVITY_LOGS,
  type PlatformActivityLog,
} from '../../data/mockAdminData';

export function ActivityPage() {
  const [logs] = useState<PlatformActivityLog[]>(INITIAL_ACTIVITY_LOGS);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedModule, setSelectedModule] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');

  const filteredLogs = useMemo(() => {
    return logs.filter((log) => {
      const matchesSearch =
        log.actor.toLowerCase().includes(searchTerm.toLowerCase()) ||
        log.action.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesModule = selectedModule === 'all' || log.module === selectedModule;
      const matchesStatus = selectedStatus === 'all' || log.status === selectedStatus;

      return matchesSearch && matchesModule && matchesStatus;
    });
  }, [logs, searchTerm, selectedModule, selectedStatus]);

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* PAGE HEADER */}
        <div>
          <div className="flex items-center space-x-2 text-xs text-gray-500 mb-1">
            <span>Admin</span>
            <span>/</span>
            <span className="text-gray-900 font-medium">Activity Logs</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 tracking-tight">
            Platform Activity Audit Logs
          </h1>
          <p className="text-sm text-gray-600 mt-1">
            Audit user interactions, AI Assistant queries, recommendation searches, and administrative actions.
          </p>
        </div>

        {/* SEARCH & FILTERS */}
        <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-2xs space-y-3">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search activity by actor, action description, or query term..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-4 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-600 focus:border-red-600 bg-white"
              />
            </div>
            <div className="flex gap-2">
              <select
                value={selectedModule}
                onChange={(e) => setSelectedModule(e.target.value)}
                className="px-3 py-2 text-sm border border-gray-300 rounded-lg bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-red-600"
              >
                <option value="all">All Modules</option>
                <option value="Assistant">Assistant</option>
                <option value="Standards">Standards</option>
                <option value="Recommendation">Recommendation</option>
                <option value="Certification">Certification</option>
                <option value="Auth">Auth</option>
                <option value="Admin">Admin</option>
              </select>

              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="px-3 py-2 text-sm border border-gray-300 rounded-lg bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-red-600"
              >
                <option value="all">All Statuses</option>
                <option value="Success">Success</option>
                <option value="Info">Info</option>
                <option value="Warning">Warning</option>
              </select>
            </div>
          </div>
        </div>

        {/* ACTIVITY LOG TABLE */}
        <div className="bg-white border border-gray-200 rounded-xl shadow-2xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  <th className="py-3.5 px-4">Timestamp</th>
                  <th className="py-3.5 px-4">Actor & Role</th>
                  <th className="py-3.5 px-4">Module</th>
                  <th className="py-3.5 px-4">Action Summary</th>
                  <th className="py-3.5 px-4">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 text-sm">
                {filteredLogs.map((log) => (
                  <tr key={log.id} className="hover:bg-gray-50/80 transition-colors">
                    <td className="py-3.5 px-4 text-xs text-gray-600 whitespace-nowrap">
                      <span className="inline-flex items-center space-x-1">
                        <Clock className="h-3 w-3 text-gray-400" />
                        <span>{log.timestamp}</span>
                      </span>
                    </td>
                    <td className="py-3.5 px-4">
                      <p className="font-semibold text-gray-900 text-xs">{log.actor}</p>
                      <p className="text-gray-500 text-xs">{log.actorRole}</p>
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="inline-flex px-2.5 py-0.5 text-xs font-medium bg-gray-100 text-gray-800 rounded">
                        {log.module}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-xs font-medium text-gray-800">
                      {log.action}
                    </td>
                    <td className="py-3.5 px-4">
                      <span className={`inline-flex items-center space-x-1 px-2.5 py-0.5 rounded text-xs font-semibold ${log.status === 'Success' ? 'bg-green-50 text-green-700 border border-green-200' : log.status === 'Warning' ? 'bg-amber-50 text-amber-700 border border-amber-200' : 'bg-blue-50 text-blue-700 border border-blue-200'}`}>
                        {log.status === 'Success' ? (
                          <CheckCircle2 className="h-3 w-3" />
                        ) : log.status === 'Warning' ? (
                          <AlertTriangle className="h-3 w-3" />
                        ) : (
                          <Info className="h-3 w-3" />
                        )}
                        <span>{log.status}</span>
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="px-4 py-3 bg-gray-50 border-t border-gray-200 text-xs text-gray-500 flex justify-between">
            <span>Showing {filteredLogs.length} activity audit entries</span>
            <span>Real-time local event logger</span>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}

export default ActivityPage;
