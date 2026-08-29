import { useState } from 'react';
import {
  Shield,
  Bell,
  Lock,
  CheckCircle2,
  Languages,
} from 'lucide-react';
import AdminLayout from '../../layouts/AdminLayout';
import { MOCK_ADMIN_PROFILE } from '../../data/mockAdminData';
import { useApp } from '../../context/AppContext';

export function AdminProfilePage() {
  const { language, setLanguage } = useApp();
  const [profile] = useState(MOCK_ADMIN_PROFILE);
  const [sessionTimeout, setSessionTimeout] = useState('30');
  const [emailAlerts, setEmailAlerts] = useState(true);

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* PAGE HEADER */}
        <div>
          <div className="flex items-center space-x-2 text-xs text-gray-500 mb-1">
            <span>Admin</span>
            <span>/</span>
            <span className="text-gray-900 font-medium">Profile & Settings</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 tracking-tight">
            Admin Profile & Governance Settings
          </h1>
          <p className="text-sm text-gray-600 mt-1">
            Manage your administrative credentials, governance role permissions, and platform settings.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* COLUMN 1: ADMIN IDENTITY CARD */}
          <div className="lg:col-span-1 space-y-6">
            <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-2xs text-center space-y-4">
              <div className="w-20 h-20 rounded-full bg-gray-900 text-white font-bold text-2xl flex items-center justify-center mx-auto border-2 border-red-600 shadow-xs">
                AD
              </div>

              <div>
                <h2 className="text-lg font-bold text-gray-900">{profile.fullName}</h2>
                <p className="text-xs font-semibold text-red-600">{profile.role}</p>
                <p className="text-xs text-gray-500 mt-0.5">{profile.email}</p>
              </div>

              <div className="pt-3 border-t border-gray-100 text-xs text-gray-600 space-y-2 text-left">
                <div className="flex items-center justify-between">
                  <span className="text-gray-500">Department:</span>
                  <span className="font-semibold text-gray-900">{profile.department}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-500">Last Login:</span>
                  <span className="font-semibold text-gray-900">{profile.lastLogin}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-500">Auth Level:</span>
                  <span className="font-semibold text-green-700 bg-green-50 px-2 py-0.5 rounded border border-green-200">
                    Level 3 (Full Admin)
                  </span>
                </div>
              </div>
            </div>

            {/* PERMISSIONS BOX */}
            <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-2xs space-y-3">
              <div className="flex items-center space-x-2 pb-2 border-b border-gray-100">
                <Shield className="h-4 w-4 text-red-600" />
                <h3 className="text-sm font-bold text-gray-900">Governance Role Permissions</h3>
              </div>
              <ul className="space-y-2 text-xs">
                {profile.permissions.map((perm, idx) => (
                  <li key={idx} className="flex items-start space-x-2 text-gray-700">
                    <CheckCircle2 className="h-4 w-4 text-green-600 shrink-0 mt-0.5" />
                    <span>{perm}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* COLUMN 2 & 3: ADMIN PREFERENCES & SETTINGS */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-2xs space-y-6">
              <div className="border-b border-gray-100 pb-3">
                <h2 className="text-lg font-bold text-gray-900">Platform Preferences</h2>
                <p className="text-xs text-gray-500">
                  Configure language preferences and session controls.
                </p>
              </div>

              {/* LANGUAGE SELECTION */}
              <div className="space-y-3">
                <div className="flex items-center space-x-2">
                  <Languages className="h-4 w-4 text-red-600" />
                  <h3 className="text-sm font-bold text-gray-900">Interface Language Preference</h3>
                </div>
                <div className="grid grid-cols-2 gap-3 max-w-sm">
                  <button
                    onClick={() => setLanguage('en')}
                    className={`px-4 py-3 rounded-lg border text-xs font-semibold flex items-center justify-between transition-colors ${
                      language === 'en'
                        ? 'border-red-600 bg-red-50 text-red-700'
                        : 'border-gray-200 bg-gray-50 text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    <span>English (EN)</span>
                    {language === 'en' && <CheckCircle2 className="h-4 w-4 text-red-600" />}
                  </button>

                  <button
                    onClick={() => setLanguage('hi')}
                    className={`px-4 py-3 rounded-lg border text-xs font-semibold flex items-center justify-between transition-colors ${
                      language === 'hi'
                        ? 'border-red-600 bg-red-50 text-red-700'
                        : 'border-gray-200 bg-gray-50 text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    <span>हिन्दी (Hindi)</span>
                    {language === 'hi' && <CheckCircle2 className="h-4 w-4 text-red-600" />}
                  </button>
                </div>
              </div>

              {/* SESSION TIMEOUT */}
              <div className="space-y-3 pt-4 border-t border-gray-100">
                <div className="flex items-center space-x-2">
                  <Lock className="h-4 w-4 text-gray-700" />
                  <h3 className="text-sm font-bold text-gray-900">Session Security Timeout</h3>
                </div>
                <div className="flex items-center space-x-3 max-w-sm">
                  <select
                    value={sessionTimeout}
                    onChange={(e) => setSessionTimeout(e.target.value)}
                    className="px-3 py-2 text-xs font-medium border border-gray-300 rounded-lg bg-white text-gray-800 focus:outline-none focus:ring-2 focus:ring-red-600"
                  >
                    <option value="15">15 Minutes</option>
                    <option value="30">30 Minutes</option>
                    <option value="60">60 Minutes</option>
                    <option value="never">Never (Session Persistent)</option>
                  </select>
                  <span className="text-xs text-gray-500">Auto-lock inactivity period</span>
                </div>
              </div>

              {/* EMAIL NOTIFICATIONS */}
              <div className="space-y-3 pt-4 border-t border-gray-100">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Bell className="h-4 w-4 text-gray-700" />
                    <div>
                      <h3 className="text-sm font-bold text-gray-900">Verification Queue Alerts</h3>
                      <p className="text-xs text-gray-500">
                        Receive instant alerts when high priority standards or sources enter the queue.
                      </p>
                    </div>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer shrink-0">
                    <input
                      type="checkbox"
                      checked={emailAlerts}
                      onChange={(e) => setEmailAlerts(e.target.checked)}
                      className="sr-only peer"
                    />
                    <div className="w-9 h-5 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-red-600"></div>
                  </label>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}

export default AdminProfilePage;
