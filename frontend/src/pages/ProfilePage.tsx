import { useState } from 'react';
import AppLayout from '../components/layout/AppLayout';
import ProfileCard from '../components/profile/ProfileCard';
import SettingsSection from '../components/profile/SettingsSection';
import { useApp } from '../context/AppContext';
import { User, Sliders } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export function ProfilePage() {
  const { user, preferences, language, updateProfile, updatePreferences, setLanguage } = useApp();
  const [activeTab, setActiveTab] = useState<'profile' | 'settings'>('profile');

  return (
    <AppLayout
      pageTitle="Profile & Settings"
      pageSubtitle="Manage your account information and preferences."
    >
      <div className="min-h-full bg-gray-50/50 pb-20">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-6 sm:py-8 space-y-6">
          {/* Header Banner */}
          <div className="bg-white border border-gray-200 rounded-xl p-5 sm:p-6 shadow-2xs">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <div className="flex items-center space-x-2">
                  <span className="w-2 h-2 rounded-full bg-red-600"></span>
                  <span className="text-xs font-bold text-gray-900 uppercase tracking-wider">
                    Account & Preferences
                  </span>
                </div>
                <h1 className="text-xl sm:text-2xl font-bold text-gray-900 mt-1">
                  Profile & Settings
                </h1>
                <p className="text-xs sm:text-sm text-gray-600 mt-1 max-w-2xl leading-relaxed">
                  Manage your account information, interface preferences, and workspace configuration.
                </p>
              </div>

              {/* Tab Switcher */}
              <div className="inline-flex bg-gray-100 p-1 rounded-lg border border-gray-200 shrink-0 self-start sm:self-center">
                <button
                  type="button"
                  onClick={() => setActiveTab('profile')}
                  className={`flex items-center space-x-1.5 px-3.5 py-1.5 rounded-md text-xs font-semibold transition-colors cursor-pointer ${
                    activeTab === 'profile'
                      ? 'bg-white text-gray-900 shadow-2xs'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  <User className="w-3.5 h-3.5" />
                  <span>Profile Information</span>
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab('settings')}
                  className={`flex items-center space-x-1.5 px-3.5 py-1.5 rounded-md text-xs font-semibold transition-colors cursor-pointer ${
                    activeTab === 'settings'
                      ? 'bg-white text-gray-900 shadow-2xs'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  <Sliders className="w-3.5 h-3.5" />
                  <span>Workspace Settings</span>
                </button>
              </div>
            </div>
          </div>

          {/* Active Tab View */}
          <AnimatePresence mode="wait">
            {activeTab === 'profile' ? (
              <motion.div
                key="profile"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
              >
                <ProfileCard user={user} onUpdateProfile={updateProfile} />
              </motion.div>
            ) : (
              <motion.div
                key="settings"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
              >
                <SettingsSection
                  preferences={preferences}
                  onUpdatePreferences={updatePreferences}
                  language={language}
                  onLanguageChange={setLanguage}
                />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </AppLayout>
  );
}

export default ProfilePage;
