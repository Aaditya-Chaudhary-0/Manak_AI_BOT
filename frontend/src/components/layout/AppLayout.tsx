import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, 
  MessageSquare, 
  Search, 
  ListTree, 
  ShieldCheck, 
  History, 
  Bookmark,
  User, 
  Menu, 
  X, 
  LogOut, 
  ExternalLink,
  ChevronRight
} from 'lucide-react';
import { microHoverLift, buttonPress, pageTransition } from '../../styles/animation';
import { useApp } from '../../context/AppContext';
import { USER_TYPE_LABELS } from '../../data/mockUserData';
import { MiniManakAI } from '../assistant/MiniManakAI';
import { motion, AnimatePresence } from 'framer-motion';
const MotionLink = motion(Link);

interface AppLayoutProps {
  children: React.ReactNode;
  pageTitle?: string;
  pageSubtitle?: string;
}

export function AppLayout({ children, pageTitle, pageSubtitle }: AppLayoutProps) {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, language, toggleLanguage } = useApp();
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  const navItems = [
    { label: 'Dashboard', path: '/app/dashboard', icon: LayoutDashboard },
    { label: 'AI Assistant', path: '/app/assistant', icon: MessageSquare, badge: 'Core' },
    { label: 'Standards Search', path: '/app/standards', icon: Search },
    { label: 'Product Matcher', path: '/app/recommend', icon: ListTree },
    { label: 'Certification Guidance', path: '/app/certification', icon: ShieldCheck },
    { label: 'History', path: '/app/history', icon: History },
    { label: 'Saved Standards', path: '/app/saved', icon: Bookmark },
    { label: 'Profile & Settings', path: '/app/profile', icon: User },
  ];

  const handleLogout = () => {
    navigate('/login');
  };

  return (
    <div className="h-screen w-full min-w-0 overflow-hidden bg-[#F7F8FA] flex flex-col md:flex-row text-gray-900 font-sans">
      {/* Mobile Header Bar */}
      <div className="md:hidden bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between sticky top-0 z-40">
        <div className="flex items-center space-x-2">
          <button 
            onClick={() => setMobileSidebarOpen(true)}
            className="p-1.5 rounded-lg text-gray-600 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-red-500"
            aria-label="Open navigation menu"
          >
            <Menu className="w-6 h-6" />
          </button>
          <Link to="/app/dashboard" className="text-xl font-bold tracking-tight text-gray-900">
            MANAK<span className="text-[#D7193F]">AI</span>
          </Link>
        </div>
        <div className="flex items-center space-x-2">
          <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-semibold bg-blue-50 text-[#1677B7] border border-blue-200">
            BIS AI
          </span>
        </div>
      </div>

      {/* Mobile Drawer Overlay */}
      <AnimatePresence>
        {mobileSidebarOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            className="fixed inset-0 bg-gray-900/40 z-50 md:hidden backdrop-blur-xs"
            onClick={() => setMobileSidebarOpen(false)}
          >
            <motion.div 
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 220 }}
              className="fixed inset-y-0 left-0 max-w-xs w-full bg-white shadow-xl flex flex-col p-4 z-50"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between pb-4 border-b border-gray-100">
                <Link to="/app/dashboard" className="text-xl font-bold tracking-tight text-gray-900">
                  MANAK<span className="text-[#D7193F]">AI</span>
                </Link>
                <button 
                  onClick={() => setMobileSidebarOpen(false)}
                  className="p-1 text-gray-500 hover:text-gray-700 rounded-lg hover:bg-gray-100"
                  aria-label="Close menu"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="py-2 text-[11px] font-semibold text-gray-400 uppercase tracking-wider">
                Workspace Navigation
              </div>

              <nav className="flex-1 space-y-1 overflow-y-auto py-2">
                {navItems.map((item) => {
                  const isActive = location.pathname === item.path || (item.path !== '/app/dashboard' && location.pathname.startsWith(item.path));
                  const Icon = item.icon;
                  return (
                    <motion.div
                      key={item.path}
                      whileHover={microHoverLift.whileHover}
                      whileTap={buttonPress.whileTap}
                      className={`flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                        isActive ? 'bg-red-50 text-[#D7193F] font-semibold border-l-4 border-[#D7193F]' : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
                      }`}
                    >
                      <Link to={item.path} onClick={() => setMobileSidebarOpen(false)} className="flex items-center justify-between w-full">
                        <div className="flex items-center space-x-3">
                          <Icon className={`w-5 h-5 ${isActive ? 'text-[#D7193F]' : 'text-gray-500'}`} />
                          <span>{item.label}</span>
                        </div>
                        {item.badge && (
                          <span className="bg-red-100 text-[#D7193F] text-[10px] font-bold px-1.5 py-0.5 rounded">
                            {item.badge}
                          </span>
                        )}
                      </Link>
                    </motion.div>
                  );
                })}
              </nav>

              <div className="pt-4 border-t border-gray-100 space-y-2">
                <div className="flex items-center justify-between px-3 py-2 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-2">
                    <div className="w-8 h-8 rounded-full bg-red-100 text-[#D7193F] font-bold flex items-center justify-center text-xs">
                      {user.fullName.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2) || 'MU'}
                    </div>
                    <div className="text-xs">
                      <p className="font-semibold text-gray-900 truncate w-32">{user.fullName}</p>
                      <p className="text-gray-500">{USER_TYPE_LABELS[user.userType] || 'MSME Enterprise'}</p>
                    </div>
                  </div>
                  <button 
                    onClick={handleLogout}
                    className="text-gray-400 hover:text-[#D7193F] p-1.5 rounded-md hover:bg-white"
                    title="Logout"
                    aria-label="Logout"
                  >
                    <LogOut className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Desktop Sidebar */}
      <aside className="hidden md:flex md:w-64 flex-col bg-white border-r border-gray-200 shrink-0 sticky top-0 h-full min-h-0">
        {/* Brand Header */}
        <div className="h-16 flex items-center justify-between px-6 border-b border-gray-200">
          <Link to="/app/dashboard" className="flex items-center space-x-2">
            <span className="text-xl font-bold tracking-tight text-gray-900">
              MANAK<span className="text-[#D7193F]">AI</span>
            </span>
          </Link>
          <span className="text-[11px] font-semibold text-[#1677B7] bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
            BIS PORTAL
          </span>
        </div>

        {/* Navigation list */}
        <div className="flex-1 px-4 py-5 space-y-1 overflow-y-auto">
          <div className="px-2 mb-2 text-[11px] font-semibold text-gray-400 uppercase tracking-wider">
            Workspace
          </div>
          {navItems.map((item) => {
            const isActive = location.pathname === item.path || (item.path !== '/app/dashboard' && location.pathname.startsWith(item.path));
            const Icon = item.icon;
            return (
              <MotionLink
                  key={item.path}
                  to={item.path}
                  className={`group flex items-center justify-between px-3 py-2.5 rounded-lg text-sm transition-all duration-150 ${
                    isActive 
                      ? 'bg-red-50 text-[#D7193F] font-semibold border-l-4 border-[#D7193F] shadow-2xs' 
                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                  }`}
                  whileHover={microHoverLift.whileHover}
                  whileTap={buttonPress.whileTap}
                >
                <div className="flex items-center space-x-3">
                  <Icon className={`w-4 h-4 transition-transform duration-150 group-hover:scale-105 ${isActive ? 'text-[#D7193F]' : 'text-gray-500'}`} />
                  <span>{item.label}</span>
                </div>
                {item.badge ? (
                  <span className="bg-[#D7193F] text-white text-[10px] font-bold px-1.5 py-0.5 rounded">
                    {item.badge}
                  </span>
                ) : (
                  isActive && <ChevronRight className="w-3.5 h-3.5 text-red-500" />
                )}
              </MotionLink>
            );
          })}

          <div className="pt-6 px-2 text-[11px] font-semibold text-gray-400 uppercase tracking-wider">
            External BIS Portals
          </div>
          <a
            href="https://www.services.bis.gov.in"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-between px-3 py-2 text-xs text-gray-500 hover:text-[#1677B7] hover:bg-blue-50/60 rounded-lg transition-colors"
          >
            <span>Official BIS Standards</span>
            <ExternalLink className="w-3 h-3 text-gray-400" />
          </a>
          <a
            href="https://www.crsbis.in"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-between px-3 py-2 text-xs text-gray-500 hover:text-[#1677B7] hover:bg-blue-50/60 rounded-lg transition-colors"
          >
            <span>BIS CRS Portal</span>
            <ExternalLink className="w-3 h-3 text-gray-400" />
          </a>
        </div>

        {/* Footer Profile Box */}
        <div className="p-4 border-t border-gray-200 bg-gray-50/80">
          <div className="flex items-center justify-between">
            <Link to="/app/profile" className="flex items-center space-x-3 hover:opacity-85 transition-opacity">
              <div className="w-8 h-8 rounded-full bg-[#D7193F] text-white font-bold flex items-center justify-center text-xs shadow-2xs">
                {user.fullName.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2) || 'MU'}
              </div>
              <div className="text-xs">
                <p className="font-semibold text-gray-900 truncate w-28">{user.fullName}</p>
                <p className="text-gray-500 truncate w-28">{user.email}</p>
              </div>
            </Link>
            <button 
              onClick={handleLogout}
              className="p-1.5 text-gray-400 hover:text-[#D7193F] hover:bg-white rounded-md transition-colors"
              title="Sign Out"
              aria-label="Sign Out"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex flex-1 min-h-0 min-w-0 flex-col w-full bg-[#F7F8FA]">
        {/* Desktop Top Bar */}
        <header className="hidden md:flex h-16 border-b border-gray-200 px-6 items-center justify-between bg-white shrink-0">
          <div className="flex items-center space-x-3">
            <div>
              <h1 className="text-base font-semibold text-gray-900 tracking-tight">
                {pageTitle || 'MANAK AI Intelligence'}
              </h1>
              {pageSubtitle && (
                <p className="text-xs text-gray-500">{pageSubtitle}</p>
              )}
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <Link
              to="/admin"
              className="text-xs font-semibold text-gray-700 hover:text-[#D7193F] bg-gray-50 hover:bg-red-50 border border-gray-200 hover:border-red-200 px-2.5 py-1 rounded-md transition-colors"
            >
              Admin Console
            </Link>
            <div className="flex items-center space-x-1.5 text-xs text-gray-600 bg-gray-50 border border-gray-200 px-2.5 py-1 rounded-md">
              <span className="w-2 h-2 rounded-full bg-[#0E8A43]"></span>
              <span className="font-medium text-gray-700">BIS Index Live (2025–26)</span>
            </div>
            <div className="h-4 w-px bg-gray-200"></div>
            <button
              type="button"
              onClick={toggleLanguage}
              className="text-xs font-semibold text-gray-600 hover:text-[#D7193F] cursor-pointer px-2 py-1 rounded hover:bg-gray-50 transition-colors"
              title={`Switch to ${language === 'en' ? 'Hindi' : 'English'}`}
            >
              {language === 'en' ? 'EN | हिन्दी' : 'हिन्दी | EN'}
            </button>
          </div>
        </header>

        {/* Page Content */}
        <AnimatePresence mode="wait">
          <motion.main 
            key={location.pathname}
            variants={pageTransition}
            initial="initial"
            animate="animate"
            exit="exit"
            className="flex-1 min-h-0 overflow-y-auto w-full"
          >
            {children}
          </motion.main>
        </AnimatePresence>
      </div>

      {/* Global Mini Manak AI Widget */}
      <MiniManakAI />
    </div>
  );
}

export default AppLayout;
