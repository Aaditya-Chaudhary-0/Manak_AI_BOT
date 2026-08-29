import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  Users,
  FileCheck,
  FileSearch,
  ShieldCheck,
  Activity,
  Server,
  UserCheck,
  Menu,
  X,
  ExternalLink,
  Shield,
  Languages,
} from 'lucide-react';
import { useApp } from '../context/AppContext';

interface AdminLayoutProps {
  children: React.ReactNode;
}

export function AdminLayout({ children }: AdminLayoutProps) {
  const location = useLocation();
  const navigate = useNavigate();
  const { language, toggleLanguage } = useApp();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    {
      name: 'Overview',
      path: '/admin',
      icon: LayoutDashboard,
      exact: true,
    },
    {
      name: 'User Management',
      path: '/admin/users',
      icon: Users,
    },
    {
      name: 'Standards Management',
      path: '/admin/standards',
      icon: FileCheck,
    },
    {
      name: 'Sources & Evidence',
      path: '/admin/sources',
      icon: FileSearch,
    },
    {
      name: 'Verification Queue',
      path: '/admin/verification',
      icon: ShieldCheck,
      badge: '4',
    },
    {
      name: 'Platform Activity',
      path: '/admin/activity',
      icon: Activity,
    },
    {
      name: 'System Status',
      path: '/admin/system',
      icon: Server,
    },
    {
      name: 'Admin Profile',
      path: '/admin/profile',
      icon: UserCheck,
    },
  ];

  const isActive = (item: (typeof navItems)[0]) => {
    if (item.exact) {
      return location.pathname === item.path;
    }
    return location.pathname.startsWith(item.path);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col font-sans text-gray-900">
      {/* TOP HEADER BAR */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-40">
        <div className="px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          {/* Left Side: Mobile Menu Button & Brand */}
          <div className="flex items-center space-x-3">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-md focus:outline-none"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>

            <Link to="/admin" className="flex items-center space-x-2">
              <div className="bg-red-600 text-white p-1.5 rounded-lg flex items-center justify-center font-bold text-lg">
                M
              </div>
              <span className="font-bold text-lg tracking-tight text-gray-900">
                MANAK <span className="text-red-600">AI</span>
              </span>
              <span className="bg-red-50 text-red-700 text-xs font-semibold px-2 py-0.5 rounded border border-red-200 uppercase tracking-wider">
                Admin Console
              </span>
            </Link>
          </div>

          {/* Right Side Controls */}
          <div className="flex items-center space-x-3 sm:space-x-4">
            {/* Demo Status Indicator */}
            <span className="hidden md:inline-flex items-center space-x-1.5 bg-blue-50 text-blue-700 text-xs px-2.5 py-1 rounded-full border border-blue-200 font-medium">
              <span className="w-2 h-2 rounded-full bg-blue-600 animate-pulse"></span>
              <span>Demo Admin Mode</span>
            </span>

            {/* Language Toggle */}
            <button
              onClick={toggleLanguage}
              className="inline-flex items-center space-x-1 px-2.5 py-1.5 text-xs font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md transition-colors"
              title="Toggle Language"
            >
              <Languages className="h-3.5 w-3.5 text-gray-500" />
              <span>{language === 'en' ? 'EN' : 'हिन्दी'}</span>
            </button>

            {/* Back to User App Button */}
            <button
              onClick={() => navigate('/app/dashboard')}
              className="inline-flex items-center space-x-1.5 px-3 py-1.5 text-xs font-medium text-gray-700 hover:text-red-600 bg-gray-50 hover:bg-red-50 border border-gray-200 hover:border-red-200 rounded-md transition-colors"
            >
              <ExternalLink className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">User Workspace</span>
            </button>

            {/* Admin Avatar */}
            <div className="flex items-center space-x-2 pl-2 border-l border-gray-200">
              <div className="w-8 h-8 rounded-full bg-gray-900 text-white font-semibold text-xs flex items-center justify-center border border-gray-300">
                AD
              </div>
              <div className="hidden xl:block text-left text-xs">
                <p className="font-semibold text-gray-900 leading-tight">Admin User</p>
                <p className="text-gray-500">Compliance Lead</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* MAIN CONTAINER (Sidebar + Page Content) */}
      <div className="flex-1 flex max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 gap-6">
        {/* DESKTOP SIDEBAR */}
        <aside className="hidden lg:block w-64 shrink-0">
          <div className="bg-white border border-gray-200 rounded-xl p-4 sticky top-22 shadow-sm">
            <div className="mb-4 pb-3 border-b border-gray-100">
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
                Platform Management
              </p>
            </div>
            <nav className="space-y-1">
              {navItems.map((item) => {
                const Icon = item.icon;
                const active = isActive(item);
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={`flex items-center justify-between px-3 py-2.5 text-sm font-medium rounded-lg transition-colors ${
                      active
                        ? 'bg-red-50 text-red-700 font-semibold border-l-4 border-red-600 pl-2'
                        : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <Icon className={`h-4 w-4 ${active ? 'text-red-600' : 'text-gray-500'}`} />
                      <span>{item.name}</span>
                    </div>
                    {item.badge && (
                      <span className="bg-red-600 text-white text-xs font-bold px-2 py-0.5 rounded-full">
                        {item.badge}
                      </span>
                    )}
                  </Link>
                );
              })}
            </nav>

            <div className="mt-8 pt-4 border-t border-gray-100 bg-gray-50 rounded-lg p-3 text-xs text-gray-600 space-y-1.5">
              <div className="flex items-center space-x-1.5 font-semibold text-gray-800">
                <Shield className="h-3.5 w-3.5 text-red-600" />
                <span>BIS Governance Suite</span>
              </div>
              <p className="text-gray-500 leading-normal">
                Frontend Management Console v1.0. All standards data synced locally.
              </p>
            </div>
          </div>
        </aside>

        {/* MOBILE DRAWER OVERLAY */}
        {mobileMenuOpen && (
          <div className="lg:hidden fixed inset-0 z-50 flex">
            <div
              className="fixed inset-0 bg-black/40 backdrop-blur-xs"
              onClick={() => setMobileMenuOpen(false)}
            />
            <div className="relative bg-white w-72 max-w-full flex flex-col p-4 z-10 shadow-xl">
              <div className="flex items-center justify-between pb-4 border-b border-gray-100">
                <div className="flex items-center space-x-2">
                  <div className="bg-red-600 text-white p-1 rounded font-bold text-sm">M</div>
                  <span className="font-bold text-base text-gray-900">Admin Navigation</span>
                </div>
                <button
                  onClick={() => setMobileMenuOpen(false)}
                  className="p-1 text-gray-500 hover:text-gray-800"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
              <nav className="mt-4 space-y-1 flex-1">
                {navItems.map((item) => {
                  const Icon = item.icon;
                  const active = isActive(item);
                  return (
                    <Link
                      key={item.path}
                      to={item.path}
                      onClick={() => setMobileMenuOpen(false)}
                      className={`flex items-center justify-between px-3 py-2.5 text-sm font-medium rounded-lg ${
                        active
                          ? 'bg-red-50 text-red-700 font-semibold border-l-4 border-red-600'
                          : 'text-gray-700 hover:bg-gray-50'
                      }`}
                    >
                      <div className="flex items-center space-x-3">
                        <Icon className={`h-4 w-4 ${active ? 'text-red-600' : 'text-gray-500'}`} />
                        <span>{item.name}</span>
                      </div>
                      {item.badge && (
                        <span className="bg-red-600 text-white text-xs font-bold px-2 py-0.5 rounded-full">
                          {item.badge}
                        </span>
                      )}
                    </Link>
                  );
                })}
              </nav>
            </div>
          </div>
        )}

        {/* MAIN PAGE CONTENT */}
        <main className="flex-1 min-w-0">{children}</main>
      </div>
    </div>
  );
}

export default AdminLayout;
