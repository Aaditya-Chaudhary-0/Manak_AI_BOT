import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  type UserProfile,
  type UserPreferences,
  type HistoryItem,
  type SavedRecommendationItem,
  INITIAL_USER_PROFILE,
  INITIAL_USER_PREFERENCES,
  INITIAL_HISTORY_ITEMS,
  INITIAL_SAVED_STANDARDS,
  INITIAL_SAVED_RECOMMENDATIONS,
} from '../data/mockUserData';

interface AppContextType {
  user: UserProfile;
  preferences: UserPreferences;
  language: 'en' | 'hi';
  history: HistoryItem[];
  savedStandards: string[];
  savedRecommendations: SavedRecommendationItem[];
  updateProfile: (updated: Partial<UserProfile>) => void;
  updatePreferences: (updated: Partial<UserPreferences>) => void;
  setLanguage: (lang: 'en' | 'hi') => void;
  toggleLanguage: () => void;
  clearHistory: () => void;
  removeHistoryItem: (id: string) => void;
  addHistoryItem: (item: Omit<HistoryItem, 'id' | 'timestamp'>) => void;
  toggleSaveStandard: (standardId: string) => void;
  isStandardSaved: (standardId: string) => boolean;
  removeSavedRecommendation: (id: string) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserProfile>(() => {
    try {
      const stored = localStorage.getItem('manak_user_profile');
      return stored ? JSON.parse(stored) : INITIAL_USER_PROFILE;
    } catch {
      return INITIAL_USER_PROFILE;
    }
  });

  const [preferences, setPreferences] = useState<UserPreferences>(() => {
    try {
      const stored = localStorage.getItem('manak_user_prefs');
      return stored ? JSON.parse(stored) : INITIAL_USER_PREFERENCES;
    } catch {
      return INITIAL_USER_PREFERENCES;
    }
  });

  const [language, setLanguageState] = useState<'en' | 'hi'>(() => {
    return user.preferredLanguage || 'en';
  });

  const [history, setHistory] = useState<HistoryItem[]>(() => {
    try {
      const stored = localStorage.getItem('manak_user_history');
      return stored ? JSON.parse(stored) : INITIAL_HISTORY_ITEMS;
    } catch {
      return INITIAL_HISTORY_ITEMS;
    }
  });

  const [savedStandards, setSavedStandards] = useState<string[]>(() => {
    try {
      const stored = localStorage.getItem('manak_saved_standards');
      return stored ? JSON.parse(stored) : INITIAL_SAVED_STANDARDS;
    } catch {
      return INITIAL_SAVED_STANDARDS;
    }
  });

  const [savedRecommendations, setSavedRecommendations] = useState<SavedRecommendationItem[]>(() => {
    try {
      const stored = localStorage.getItem('manak_saved_recs');
      return stored ? JSON.parse(stored) : INITIAL_SAVED_RECOMMENDATIONS;
    } catch {
      return INITIAL_SAVED_RECOMMENDATIONS;
    }
  });

  // Sync to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('manak_user_profile', JSON.stringify(user));
    } catch {
      // ignore
    }
  }, [user]);

  useEffect(() => {
    try {
      localStorage.setItem('manak_user_prefs', JSON.stringify(preferences));
    } catch {
      // ignore
    }
  }, [preferences]);

  useEffect(() => {
    try {
      localStorage.setItem('manak_user_history', JSON.stringify(history));
    } catch {
      // ignore
    }
  }, [history]);

  useEffect(() => {
    try {
      localStorage.setItem('manak_saved_standards', JSON.stringify(savedStandards));
    } catch {
      // ignore
    }
  }, [savedStandards]);

  useEffect(() => {
    try {
      localStorage.setItem('manak_saved_recs', JSON.stringify(savedRecommendations));
    } catch {
      // ignore
    }
  }, [savedRecommendations]);

  const updateProfile = (updated: Partial<UserProfile>) => {
    setUser((prev) => {
      const next = { ...prev, ...updated };
      if (updated.preferredLanguage) {
        setLanguageState(updated.preferredLanguage);
      }
      return next;
    });
  };

  const updatePreferences = (updated: Partial<UserPreferences>) => {
    setPreferences((prev) => ({ ...prev, ...updated }));
  };

  const setLanguage = (lang: 'en' | 'hi') => {
    setLanguageState(lang);
    setUser((prev) => ({ ...prev, preferredLanguage: lang }));
  };

  const toggleLanguage = () => {
    const nextLang = language === 'en' ? 'hi' : 'en';
    setLanguage(nextLang);
  };

  const clearHistory = () => {
    setHistory([]);
  };

  const removeHistoryItem = (id: string) => {
    setHistory((prev) => prev.filter((item) => item.id !== id));
  };

  const addHistoryItem = (item: Omit<HistoryItem, 'id' | 'timestamp'>) => {
    const newItem: HistoryItem = {
      ...item,
      id: `hist-${Date.now()}`,
      timestamp: 'Just now',
    };
    setHistory((prev) => [newItem, ...prev]);
  };

  const toggleSaveStandard = (standardId: string) => {
    setSavedStandards((prev) =>
      prev.includes(standardId)
        ? prev.filter((id) => id !== standardId)
        : [...prev, standardId]
    );
  };

  const isStandardSaved = (standardId: string) => {
    return savedStandards.includes(standardId);
  };

  const removeSavedRecommendation = (id: string) => {
    setSavedRecommendations((prev) => prev.filter((item) => item.id !== id));
  };

  return (
    <AppContext.Provider
      value={{
        user,
        preferences,
        language,
        history,
        savedStandards,
        savedRecommendations,
        updateProfile,
        updatePreferences,
        setLanguage,
        toggleLanguage,
        clearHistory,
        removeHistoryItem,
        addHistoryItem,
        toggleSaveStandard,
        isStandardSaved,
        removeSavedRecommendation,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};

export default AppContext;
