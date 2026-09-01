export type UserType = 
  | 'msme'
  | 'engineer'
  | 'procurement'
  | 'consumer'
  | 'student'
  | 'other';

export interface UserProfile {
  id: string;
  fullName: string;
  email: string;
  userType: UserType;
  preferredLanguage: 'en' | 'hi';
  organization?: string;
  joinedDate: string;
}

export interface UserPreferences {
  defaultLandingSection: 'dashboard' | 'assistant' | 'standards' | 'recommend';
  showNavigationTips: boolean;
  notifyProductUpdates: boolean;
  notifyStandardsGazette: boolean;
  notifySystemAlerts: boolean;
}

export interface HistoryItem {
  id: string;
  type: 'conversation' | 'search' | 'recommendation';
  title: string;
  subtitle?: string;
  timestamp: string;
  payload?: any;
  category?: string;
}

export interface SavedRecommendationItem {
  id: string;
  productName: string;
  category: string;
  standardCode: string;
  standardTitle: string;
  standardId: string;
  relevanceLevel: string;
  savedAt: string;
}

export const USER_TYPE_LABELS: Record<UserType, string> = {
  msme: 'MSME / Startup',
  engineer: 'Engineer / QA',
  procurement: 'Procurement Officer',
  consumer: 'Consumer',
  student: 'Student',
  other: 'Other',
};

export const INITIAL_USER_PROFILE: UserProfile = {
  id: 'usr-default-01',
  fullName: 'Manak User',
  email: 'msme@manakai.in',
  userType: 'msme',
  preferredLanguage: 'en',
  organization: 'Enterprise India Compliance Labs',
  joinedDate: 'January 2025',
};

export const INITIAL_USER_PREFERENCES: UserPreferences = {
  defaultLandingSection: 'dashboard',
  showNavigationTips: true,
  notifyProductUpdates: true,
  notifyStandardsGazette: true,
  notifySystemAlerts: false,
};

export const INITIAL_HISTORY_ITEMS: HistoryItem[] = [
  {
    id: 'hist-conv-1',
    type: 'conversation',
    title: 'LED bulb certification & safety requirements',
    subtitle: 'Which BIS standard applies to LED bulbs under MeitY CRO?',
    timestamp: 'Today, 10:15 AM',
    category: 'Electrotechnical / Lighting',
    payload: { conversationId: 'conv-led' },
  },
  {
    id: 'hist-search-1',
    type: 'search',
    title: 'Ordinary Portland Cement 53 Grade',
    subtitle: 'Search across Civil & Construction catalogue',
    timestamp: 'Today, 09:30 AM',
    category: 'Construction',
    payload: { query: 'Cement' },
  },
  {
    id: 'hist-rec-1',
    type: 'recommendation',
    title: 'TMT Steel Rebar (Fe 500D)',
    subtitle: 'Mapped to IS 1786:2008 (High Relevance)',
    timestamp: 'Yesterday, 04:20 PM',
    category: 'Metallurgical',
    payload: { productName: 'TMT Steel Rebar (Fe 500D)', category: 'Metallurgical' },
  },
  {
    id: 'hist-conv-2',
    type: 'conversation',
    title: 'Scheme-I factory audit checklist & SIT',
    subtitle: 'How can I find the certification requirements under Scheme-I?',
    timestamp: '2 days ago',
    category: 'Conformity Assessment',
    payload: { conversationId: 'conv-cert' },
  },
  {
    id: 'hist-search-2',
    type: 'search',
    title: 'Packaged drinking water IS 14543',
    subtitle: 'Filter: Active Standards • Food & Water',
    timestamp: '3 days ago',
    category: 'Food & Water',
    payload: { query: 'IS 14543' },
  },
  {
    id: 'hist-rec-2',
    type: 'recommendation',
    title: 'Self-Ballasted LED Bulb 9W',
    subtitle: 'Mapped to IS 16102 (Part 1 & 2)',
    timestamp: '5 days ago',
    category: 'Electrical',
    payload: { productName: 'Self-Ballasted LED Bulb 9W', category: 'Electrical' },
  },
];

export const INITIAL_SAVED_STANDARDS = ['is-16102-1', 'is-269', 'is-1786'];

export const INITIAL_SAVED_RECOMMENDATIONS: SavedRecommendationItem[] = [
  {
    id: 'saved-rec-1',
    productName: 'Self-Ballasted LED Bulb 9W',
    category: 'Electrical',
    standardCode: 'IS 16102 (Part 1): 2012',
    standardTitle: 'Self-Ballasted LED-Lamps for General Lighting Services - Part 1: Safety Requirements',
    standardId: 'is-16102-1',
    relevanceLevel: 'High Relevance',
    savedAt: '2 days ago',
  },
  {
    id: 'saved-rec-2',
    productName: 'TMT Steel Rebar Fe 500D',
    category: 'Metallurgical',
    standardCode: 'IS 1786: 2008',
    standardTitle: 'High Strength Deformed Steel Bars and Wires for Concrete Reinforcement',
    standardId: 'is-1786',
    relevanceLevel: 'High Relevance',
    savedAt: '5 days ago',
  },
];
