import { Link } from 'react-router-dom';
import {
  Users,
  FileCheck,
  MessageSquare,
  Search,
  ListTree,
  ShieldAlert,
  Activity,
  ArrowRight,
  TrendingUp,
  Clock,
  ShieldCheck,
  CheckCircle2,
} from 'lucide-react';
import AdminLayout from '../../layouts/AdminLayout';
import {
  INITIAL_ACTIVITY_LOGS,
  INITIAL_VERIFICATION_QUEUE,
  INITIAL_SYSTEM_COMPONENTS,
} from '../../data/mockAdminData';

export function AdminOverviewPage() {
  const pendingItems = INITIAL_VERIFICATION_QUEUE.filter((i) => i.status === 'Pending');

  const metrics = [
    {
      name: 'Total Registered Users',
      value: '1,248',
      context: 'Across MSME, Engineers & Procurement',
      trend: '+12% this month',
      icon: Users,
      color: 'text-gray-900',
    },
    {
      name: 'Active Users',
      value: '982',
      context: '78.6% active engagement rate',
      trend: '+5.4% active',
      icon: TrendingUp,
      color: 'text-green-600',
    },
    {
      name: 'Saved Standards',
      value: '3,410',
      context: 'Bookmarked across 4 major sectors',
      icon: FileCheck,
      color: 'text-red-600',
    },
    {
      name: 'AI Conversations',
      value: '5,120',
      context: '94% query resolution accuracy',
      icon: MessageSquare,
      color: 'text-blue-600',
    },
    {
      name: 'Standard Searches',
      value: '12,840',
      context: 'Top: IS 16102, IS 269, IS 1786',
      icon: Search,
      color: 'text-gray-700',
    },
    {
      name: 'Product Recommendations',
      value: '1,450',
      context: 'Completed product-to-standard maps',
      icon: ListTree,
      color: 'text-red-600',
    },
    {
      name: 'Pending Verification',
      value: pendingItems.length.toString(),
      context: 'Standards, sources & evidence in queue',
      icon: ShieldAlert,
      color: 'text-amber-600',
      alert: true,
    },
    {
      name: 'Platform System Status',
      value: 'Operational',
      context: 'Frontend Mock & Local Data Layer Active',
      icon: ShieldCheck,
      color: 'text-blue-600',
    },
  ];

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* PAGE HEADER */}
        <div>
          <div className="flex items-center space-x-2 text-xs text-gray-500 mb-1">
            <span>Admin</span>
            <span>/</span>
            <span className="text-gray-900 font-medium">Overview</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 tracking-tight">
            Admin Overview
          </h1>
          <p className="text-sm text-gray-600 mt-1">
            Monitor platform activity, standards catalog content, verification queue, and demo system status.
          </p>
        </div>

        {/* METRICS GRID */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {metrics.map((metric, idx) => {
            const Icon = metric.icon;
            return (
              <div
                key={idx}
                className={`bg-white border rounded-xl p-4 shadow-2xs hover:shadow-xs transition-shadow ${
                  metric.alert ? 'border-amber-300 bg-amber-50/20' : 'border-gray-200'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    {metric.name}
                  </span>
                  <Icon className={`h-4 w-4 ${metric.color}`} />
                </div>
                <div className="mt-2 flex items-baseline justify-between">
                  <span className="text-2xl font-bold text-gray-900 tracking-tight">
                    {metric.value}
                  </span>
                  {metric.trend && (
                    <span className="text-xs font-medium text-green-700 bg-green-50 px-1.5 py-0.5 rounded border border-green-200">
                      {metric.trend}
                    </span>
                  )}
                </div>
                <p className="text-xs text-gray-500 mt-1 line-clamp-1">{metric.context}</p>
              </div>
            );
          })}
        </div>

        {/* TWO COLUMN LOWER SECTION */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* COLUMN 1 & 2: RECENT ACTIVITY & PENDING VERIFICATION */}
          <div className="lg:col-span-2 space-y-6">
            {/* PENDING VERIFICATION WIDGET */}
            <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-2xs">
              <div className="flex items-center justify-between pb-4 border-b border-gray-100">
                <div className="flex items-center space-x-2">
                  <ShieldAlert className="h-5 w-5 text-red-600" />
                  <h2 className="text-base font-bold text-gray-900">
                    Pending Content Verification
                  </h2>
                </div>
                <Link
                  to="/admin/verification"
                  className="text-xs font-semibold text-red-600 hover:text-red-700 inline-flex items-center space-x-1"
                >
                  <span>View Queue ({pendingItems.length})</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </div>

              <div className="mt-4 space-y-3">
                {pendingItems.slice(0, 3).map((item) => (
                  <div
                    key={item.id}
                    className="p-3 bg-gray-50 border border-gray-200 rounded-lg flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                  >
                    <div>
                      <div className="flex items-center space-x-2">
                        <span className="text-xs font-bold px-2 py-0.5 rounded bg-red-100 text-red-700">
                          {item.itemType}
                        </span>
                        <span
                          className={`text-xs font-medium px-2 py-0.5 rounded ${
                            item.priority === 'High'
                              ? 'bg-red-50 text-red-700 border border-red-200'
                              : 'bg-blue-50 text-blue-700 border border-blue-200'
                          }`}
                        >
                          {item.priority} Priority
                        </span>
                      </div>
                      <h3 className="text-sm font-semibold text-gray-900 mt-1">
                        {item.itemTitle}
                      </h3>
                      <p className="text-xs text-gray-500 mt-0.5 line-clamp-1">
                        Ref: {item.referenceDoc} • Added: {item.addedDate}
                      </p>
                    </div>

                    <Link
                      to="/admin/verification"
                      className="shrink-0 px-3 py-1.5 text-xs font-semibold text-white bg-red-600 hover:bg-red-700 rounded-md transition-colors text-center"
                    >
                      Review Item
                    </Link>
                  </div>
                ))}
              </div>
            </div>

            {/* RECENT PLATFORM ACTIVITY */}
            <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-2xs">
              <div className="flex items-center justify-between pb-4 border-b border-gray-100">
                <div className="flex items-center space-x-2">
                  <Activity className="h-5 w-5 text-gray-700" />
                  <h2 className="text-base font-bold text-gray-900">Recent User & System Activity</h2>
                </div>
                <Link
                  to="/admin/activity"
                  className="text-xs font-semibold text-red-600 hover:text-red-700 inline-flex items-center space-x-1"
                >
                  <span>Full Activity Log</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </div>

              <div className="mt-4 divide-y divide-gray-100">
                {INITIAL_ACTIVITY_LOGS.slice(0, 5).map((log) => (
                  <div key={log.id} className="py-3 flex items-start justify-between gap-4">
                    <div className="space-y-1">
                      <div className="flex items-center space-x-2">
                        <span className="text-xs font-semibold text-gray-900">{log.actor}</span>
                        <span className="text-xs px-1.5 py-0.5 bg-gray-100 text-gray-600 rounded">
                          {log.module}
                        </span>
                      </div>
                      <p className="text-xs text-gray-700">{log.action}</p>
                    </div>
                    <span className="text-xs text-gray-400 shrink-0 flex items-center space-x-1">
                      <Clock className="h-3 w-3" />
                      <span>{log.timestamp}</span>
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* COLUMN 3: SYSTEM STATUS WIDGET */}
          <div className="space-y-6">
            <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-2xs">
              <div className="flex items-center justify-between pb-3 border-b border-gray-100">
                <h2 className="text-base font-bold text-gray-900">System Health Overview</h2>
                <Link
                  to="/admin/system"
                  className="text-xs font-semibold text-blue-600 hover:text-blue-700"
                >
                  Details
                </Link>
              </div>

              <div className="mt-4 space-y-3">
                {INITIAL_SYSTEM_COMPONENTS.map((sys) => (
                  <div
                    key={sys.id}
                    className="flex items-center justify-between p-2.5 bg-gray-50 rounded-lg border border-gray-100"
                  >
                    <div className="min-w-0 pr-2">
                      <p className="text-xs font-semibold text-gray-900 truncate">{sys.name}</p>
                      <p className="text-xs text-gray-500">{sys.category}</p>
                    </div>
                    <span
                      className={`shrink-0 inline-flex items-center space-x-1 px-2 py-0.5 rounded text-xs font-semibold ${
                        sys.status === 'Operational'
                          ? 'bg-green-50 text-green-700 border border-green-200'
                          : 'bg-blue-50 text-blue-700 border border-blue-200'
                      }`}
                    >
                      <CheckCircle2 className="h-3 w-3" />
                      <span>{sys.status}</span>
                    </span>
                  </div>
                ))}
              </div>

              <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg text-xs text-blue-800">
                <p className="font-semibold mb-0.5">Frontend Demo Note</p>
                <p className="text-blue-700 leading-relaxed">
                  All metrics and status indicators are displayed using the internal mock governance dataset.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}

export default AdminOverviewPage;
