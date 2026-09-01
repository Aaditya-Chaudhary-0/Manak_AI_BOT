import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import type { UserPreferences } from '../../data/mockUserData';
import { 
  Globe2, 
  Bell, 
  Lock, 
  LogOut, 
  Info 
} from 'lucide-react';

interface SettingsSectionProps {
  preferences: UserPreferences;
  onUpdatePreferences: (updated: Partial<UserPreferences>) => void;
  language: 'en' | 'hi';
  onLanguageChange: (lang: 'en' | 'hi') => void;
}

export function SettingsSection({
  preferences,
  onUpdatePreferences,
  language,
  onLanguageChange,
}: SettingsSectionProps) {
  const navigate = useNavigate();
  const [passwordNotice, setPasswordNotice] = useState(false);
  const [prefSavedToast, setPrefSavedToast] = useState(false);

  const showPrefToast = () => {
    setPrefSavedToast(true);
    setTimeout(() => setPrefSavedToast(false), 2000);
  };

  const handleLandingChange = (val: UserPreferences['defaultLandingSection']) => {
    onUpdatePreferences({ defaultLandingSection: val });
    showPrefToast();
  };

  const handleToggle = (key: keyof UserPreferences) => {
    onUpdatePreferences({ [key]: !preferences[key] });
    showPrefToast();
  };

  const handleLogout = () => {
    navigate('/login');
  };

  return (
    <div className="space-y-6">
      {prefSavedToast && (
        <div className="bg-gray-900 text-white text-xs font-semibold px-4 py-2.5 rounded-xl shadow-lg flex items-center justify-between animate-fade-in">
          <span>Preferences updated</span>
          <span className="text-[10px] text-gray-400">Saved</span>
        </div>
      )}

      {/* 1. Language & Navigation Preferences */}
      <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-2xs space-y-5">
        <div className="border-b border-gray-100 pb-3 flex items-center space-x-2">
          <Globe2 className="w-4 h-4 text-blue-600" />
          <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider">
            Language & Workspace Preferences
          </h3>
        </div>

        <div className="space-y-4 text-xs">
          {/* Language Selection */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-gray-50/80 p-4 rounded-xl border border-gray-100">
            <div>
              <span className="font-bold text-gray-900 block text-sm">
                Interface Language
              </span>
              <p className="text-gray-500 mt-0.5">
                Select your preferred language for navigation and standards interpretation.
              </p>
            </div>

            <div className="inline-flex bg-white p-1 rounded-lg border border-gray-200 shrink-0">
              <button
                type="button"
                onClick={() => {
                  onLanguageChange('en');
                  showPrefToast();
                }}
                className={`px-3 py-1.5 rounded-md font-semibold transition-colors cursor-pointer ${
                  language === 'en'
                    ? 'bg-red-600 text-white shadow-2xs'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                English
              </button>
              <button
                type="button"
                onClick={() => {
                  onLanguageChange('hi');
                  showPrefToast();
                }}
                className={`px-3 py-1.5 rounded-md font-semibold transition-colors cursor-pointer ${
                  language === 'hi'
                    ? 'bg-red-600 text-white shadow-2xs'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                हिन्दी (Hindi)
              </button>
            </div>
          </div>

          {/* Default Landing Section */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-gray-50/80 p-4 rounded-xl border border-gray-100">
            <div>
              <span className="font-bold text-gray-900 block text-sm">
                Default Workspace Landing Page
              </span>
              <p className="text-gray-500 mt-0.5">
                Choose which view opens by default upon logging in.
              </p>
            </div>

            <select
              value={preferences.defaultLandingSection}
              onChange={(e) => handleLandingChange(e.target.value as any)}
              className="px-3 py-2 bg-white border border-gray-300 rounded-lg font-semibold text-gray-900 text-xs focus:outline-none focus:ring-2 focus:ring-red-500 shrink-0"
            >
              <option value="dashboard">Dashboard</option>
              <option value="assistant">AI BIS Assistant</option>
              <option value="standards">Standards Search</option>
              <option value="recommend">Product Matcher</option>
            </select>
          </div>

          {/* Show Navigation Tips Toggle */}
          <div className="flex items-center justify-between bg-gray-50/80 p-4 rounded-xl border border-gray-100">
            <div>
              <span className="font-bold text-gray-900 block">
                Show Navigation Guidance & Tips
              </span>
              <p className="text-gray-500 mt-0.5">
                Display contextual suggestions and example query templates across workflows.
              </p>
            </div>

            <label className="relative inline-flex items-center cursor-pointer shrink-0">
              <input
                type="checkbox"
                checked={preferences.showNavigationTips}
                onChange={() => handleToggle('showNavigationTips')}
                className="sr-only peer"
              />
              <div className="w-10 h-5 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-red-600"></div>
            </label>
          </div>
        </div>
      </div>

      {/* 2. Notification Preferences */}
      <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-2xs space-y-4">
        <div className="border-b border-gray-100 pb-3 flex items-center space-x-2">
          <Bell className="w-4 h-4 text-blue-600" />
          <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider">
            Notification Preferences (Demo Toggles)
          </h3>
        </div>

        <div className="space-y-3 text-xs">
          <div className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 transition-colors">
            <div>
              <span className="font-semibold text-gray-900 block">
                Standards Gazette & QCO Updates
              </span>
              <span className="text-gray-500">
                Receive notifications when new mandatory Quality Control Orders are notified by line ministries.
              </span>
            </div>
            <label className="relative inline-flex items-center cursor-pointer shrink-0 ml-4">
              <input
                type="checkbox"
                checked={preferences.notifyStandardsGazette}
                onChange={() => handleToggle('notifyStandardsGazette')}
                className="sr-only peer"
              />
              <div className="w-9 h-5 bg-gray-200 rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-red-600"></div>
            </label>
          </div>

          <div className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 transition-colors">
            <div>
              <span className="font-semibold text-gray-900 block">
                Product Matcher & Feature Announcements
              </span>
              <span className="text-gray-500">
                Updates regarding newly indexed BIS standards, technical divisions, and AI capabilities.
              </span>
            </div>
            <label className="relative inline-flex items-center cursor-pointer shrink-0 ml-4">
              <input
                type="checkbox"
                checked={preferences.notifyProductUpdates}
                onChange={() => handleToggle('notifyProductUpdates')}
                className="sr-only peer"
              />
              <div className="w-9 h-5 bg-gray-200 rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-red-600"></div>
            </label>
          </div>
        </div>
      </div>

      {/* 3. Account Security UI */}
      <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-2xs space-y-4">
        <div className="border-b border-gray-100 pb-3 flex items-center space-x-2">
          <Lock className="w-4 h-4 text-gray-700" />
          <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider">
            Account Security
          </h3>
        </div>

        <div className="space-y-3">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
            <div>
              <span className="font-semibold text-gray-900 block">
                Password & Authentication
              </span>
              <span className="text-gray-500">
                Manage your credentials and login access.
              </span>
            </div>

            <button
              type="button"
              onClick={() => setPasswordNotice(true)}
              className="inline-flex items-center space-x-1.5 px-3.5 py-2 bg-gray-100 hover:bg-gray-200 text-gray-800 text-xs font-semibold rounded-lg transition-colors cursor-pointer w-fit"
            >
              <span>Change Password</span>
            </button>
          </div>

          {passwordNotice && (
            <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg text-xs text-blue-900 flex items-start space-x-2 animate-fade-in">
              <Info className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold">Notice regarding credentials:</p>
                <p className="text-blue-800 mt-0.5">
                  Password change will be available after backend authentication integration.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* 4. Session & Logout */}
      <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h3 className="text-sm font-bold text-gray-900">
            Sign Out of Manak AI
          </h3>
          <p className="text-xs text-gray-500 mt-0.5">
            End your current workspace session and return to the login screen.
          </p>
        </div>

        <button
          type="button"
          onClick={handleLogout}
          className="inline-flex items-center space-x-1.5 px-5 py-2.5 bg-red-600 hover:bg-red-700 text-white text-xs font-bold uppercase tracking-wider rounded-lg shadow-2xs transition-colors cursor-pointer shrink-0"
        >
          <LogOut className="w-4 h-4" />
          <span>Log Out</span>
        </button>
      </div>
    </div>
  );
}

export default SettingsSection;
