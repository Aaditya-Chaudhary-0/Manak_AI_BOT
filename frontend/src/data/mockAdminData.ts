import { type UserType } from './mockUserData';

export interface AdminUser {
  id: string;
  fullName: string;
  email: string;
  userType: UserType;
  status: 'Active' | 'Inactive' | 'Pending';
  joinedDate: string;
  lastActivity: string;
  organization?: string;
  savedStandardsCount: number;
  conversationsCount: number;
}

export interface AdminStandardOverview {
  id: string;
  code: string;
  title: string;
  category: string;
  year: string;
  status: 'Active' | 'Replaced' | 'Under Review';
  verificationStatus: 'Verified' | 'Needs Review' | 'Pending';
  lastAudited: string;
}

export interface AdminSourceItem {
  id: string;
  name: string;
  type: 'Gazette Notification' | 'Standard Clause' | 'Regulatory Circular' | 'Technical Manual';
  referenceNo: string;
  publishingAuthority: string;
  status: 'Verified' | 'Needs Review' | 'Pending' | 'Demo Source';
  lastReviewed: string;
  verificationState: 'Approved' | 'Review Required' | 'Draft';
  clauseSummary: string;
  fullExcerpt: string;
}

export interface VerificationQueueItem {
  id: string;
  itemTitle: string;
  itemType: 'Standard' | 'Source' | 'Evidence' | 'Content';
  addedDate: string;
  priority: 'High' | 'Medium' | 'Low';
  status: 'Pending' | 'Approved' | 'Needs Review' | 'Rejected';
  submittedBy: string;
  referenceDoc: string;
  clauseExcerpt: string;
  notes?: string;
}

export interface PlatformActivityLog {
  id: string;
  timestamp: string;
  actor: string;
  actorRole: string;
  action: string;
  module: 'Assistant' | 'Standards' | 'Recommendation' | 'Certification' | 'Auth' | 'Admin';
  status: 'Success' | 'Warning' | 'Error' | 'Info';
}

export interface SystemComponent {
  id: string;
  name: string;
  category: 'Core Service' | 'AI & ML' | 'Data Layer' | 'User Interface';
  status: 'Operational' | 'Demo' | 'Unavailable';
  description: string;
  lastChecked: string;
}

export interface AdminProfileDetails {
  id: string;
  fullName: string;
  email: string;
  role: string;
  department: string;
  lastLogin: string;
  permissions: string[];
}

export const INITIAL_ADMIN_USERS: AdminUser[] = [
  {
    id: 'usr-101',
    fullName: 'Rajesh Kumar',
    email: 'rajesh.k@compliance-india.org',
    userType: 'msme',
    status: 'Active',
    joinedDate: 'Jan 15, 2025',
    lastActivity: '10 minutes ago',
    organization: 'Apex Electricals Pvt Ltd',
    savedStandardsCount: 4,
    conversationsCount: 12,
  },
  {
    id: 'usr-102',
    fullName: 'Dr. Ananya Sen',
    email: 'ananya.sen@nit-research.ac.in',
    userType: 'engineer',
    status: 'Active',
    joinedDate: 'Feb 02, 2025',
    lastActivity: '2 hours ago',
    organization: 'NIT Quality Assurance Lab',
    savedStandardsCount: 8,
    conversationsCount: 24,
  },
  {
    id: 'usr-103',
    fullName: 'Vikramaditya Sharma',
    email: 'procurement@cpwd-works.gov.in',
    userType: 'procurement',
    status: 'Active',
    joinedDate: 'Dec 10, 2024',
    lastActivity: '1 day ago',
    organization: 'Central Public Works Dept (CPWD)',
    savedStandardsCount: 15,
    conversationsCount: 38,
  },
  {
    id: 'usr-104',
    fullName: 'Priya Nair',
    email: 'priya.nair@consumer-forum.org',
    userType: 'consumer',
    status: 'Active',
    joinedDate: 'Jan 28, 2025',
    lastActivity: '3 days ago',
    organization: 'Consumer Action Group',
    savedStandardsCount: 2,
    conversationsCount: 5,
  },
  {
    id: 'usr-105',
    fullName: 'Siddharth Mehta',
    email: 'siddharth.m@iitb.ac.in',
    userType: 'student',
    status: 'Active',
    joinedDate: 'Feb 10, 2025',
    lastActivity: '4 hours ago',
    organization: 'IIT Bombay Dept of Civil Eng',
    savedStandardsCount: 6,
    conversationsCount: 18,
  },
  {
    id: 'usr-106',
    fullName: 'Karan Patel',
    email: 'karan@patel-foundry.com',
    userType: 'msme',
    status: 'Pending',
    joinedDate: 'Feb 26, 2025',
    lastActivity: '5 days ago',
    organization: 'Patel Steel & Foundry MSME',
    savedStandardsCount: 1,
    conversationsCount: 2,
  },
  {
    id: 'usr-107',
    fullName: 'Meera Deshmukh',
    email: 'm.deshmukh@testing-labs.in',
    userType: 'engineer',
    status: 'Inactive',
    joinedDate: 'Nov 14, 2024',
    lastActivity: '2 weeks ago',
    organization: 'Standard Testing Bureau',
    savedStandardsCount: 3,
    conversationsCount: 7,
  },
  {
    id: 'usr-108',
    fullName: 'Amitabh Roy',
    email: 'a.roy@procure-corp.com',
    userType: 'other',
    status: 'Active',
    joinedDate: 'Jan 05, 2025',
    lastActivity: 'Yesterday',
    organization: 'National Infrastructure Agency',
    savedStandardsCount: 9,
    conversationsCount: 19,
  },
];

export const INITIAL_ADMIN_SOURCES: AdminSourceItem[] = [
  {
    id: 'src-01',
    name: 'BIS Official Gazette 2024 (Gazette No. 442)',
    type: 'Gazette Notification',
    referenceNo: 'S.O. 1422(E) / BIS-2024',
    publishingAuthority: 'Bureau of Indian Standards / Govt of India',
    status: 'Verified',
    lastReviewed: 'Feb 20, 2025',
    verificationState: 'Approved',
    clauseSummary: 'Mandatory certification for self-ballasted LED lamps under Scheme-I.',
    fullExcerpt: 'In exercise of the powers conferred by section 16 of the Bureau of Indian Standards Act, 2016, the Central Government after consulting the Bureau, hereby makes mandatory compliance of IS 16102 (Part 1): 2012.',
  },
  {
    id: 'src-02',
    name: 'MeitY Compulsory Registration Order (CRO Phase V)',
    type: 'Regulatory Circular',
    referenceNo: 'MeitY-Ref-2023-V',
    publishingAuthority: 'Ministry of Electronics and Information Technology',
    status: 'Verified',
    lastReviewed: 'Feb 18, 2025',
    verificationState: 'Approved',
    clauseSummary: 'Registration mandates for electronic hardware products & IT adapters.',
    fullExcerpt: 'All IT and electronic equipment specified in Schedule-V shall bear the Standard Mark under a licence from the Bureau as per Scheme-II (CRS).',
  },
  {
    id: 'src-03',
    name: 'IS 1786 Technical Audit Guidelines',
    type: 'Technical Manual',
    referenceNo: 'BIS-TM-CIV-1786',
    publishingAuthority: 'BIS Civil Engineering Department',
    status: 'Needs Review',
    lastReviewed: 'Jan 25, 2025',
    verificationState: 'Review Required',
    clauseSummary: 'Tensile testing standards and bend test tolerances for Fe 500D steel.',
    fullExcerpt: 'Clause 7.2 requires chemical composition verification for Carbon equivalent (CE <= 0.42%) and elongation percentage of minimum 16.0%.',
  },
  {
    id: 'src-04',
    name: 'FSSAI Food Safety Mandate for Packaged Water',
    type: 'Regulatory Circular',
    referenceNo: 'FSSAI/LEG/2023/WATER',
    publishingAuthority: 'Food Safety and Standards Authority of India',
    status: 'Verified',
    lastReviewed: 'Feb 14, 2025',
    verificationState: 'Approved',
    clauseSummary: 'Pesticide residue limits and microbiological purity under IS 14543.',
    fullExcerpt: 'No packaged drinking water unit shall operate without dual mandatory BIS Certification (ISI Mark) and FSSAI License under IS 14543: 2004.',
  },
  {
    id: 'src-05',
    name: 'CPWD Works Specification Clause 3.4',
    type: 'Standard Clause',
    referenceNo: 'CPWD-SPEC-2023-VOL1',
    publishingAuthority: 'Central Public Works Department',
    status: 'Pending',
    lastReviewed: 'Feb 01, 2025',
    verificationState: 'Draft',
    clauseSummary: 'Ordinary Portland Cement 53 Grade mandatory usage in RCC structural spans.',
    fullExcerpt: 'Cement used for structural RCC members shall strictly conform to IS 269: 2015. Manufacturer test certificate shall be submitted per batch.',
  },
];

export const INITIAL_VERIFICATION_QUEUE: VerificationQueueItem[] = [
  {
    id: 'vq-101',
    itemTitle: 'IS 16102 (Part 1) Safety Requirements Update',
    itemType: 'Standard',
    addedDate: 'Feb 25, 2025',
    priority: 'High',
    status: 'Pending',
    submittedBy: 'AI Knowledge Ingestion Pipeline',
    referenceDoc: 'IS 16102 (Part 1): 2012 / Amdt 3',
    clauseExcerpt: 'Addition of mandatory insulation resistance testing at high humidity ambient chamber (40deg C, 95% RH).',
    notes: 'Verify amendment 3 alignment with latest Gazette notification before publishing to public assistant.',
  },
  {
    id: 'vq-102',
    itemTitle: 'MeitY CRO Lab Testing Scheme Amendment',
    itemType: 'Source',
    addedDate: 'Feb 24, 2025',
    priority: 'High',
    status: 'Pending',
    submittedBy: 'Compliance Lead (Dr. Ananya)',
    referenceDoc: 'MeitY Order 2024-Ext',
    clauseExcerpt: 'Extension of registration deadline for Smart Meters under IS 16444 to June 2025.',
    notes: 'Updates timeline advice shown in Product Matcher Step 3.',
  },
  {
    id: 'vq-103',
    itemTitle: 'IS 269:2015 Compressive Strength Test Mapping',
    itemType: 'Evidence',
    addedDate: 'Feb 22, 2025',
    priority: 'Medium',
    status: 'Needs Review',
    submittedBy: 'System Automated Ingestion',
    referenceDoc: 'IS 269:2015 Clause 6.1',
    clauseExcerpt: 'Minimum 28-day compressive strength shall be 53 MPa when tested per IS 4031 (Part 6).',
    notes: 'Citation evidence mapping check for Civil Engineering queries.',
  },
  {
    id: 'vq-104',
    itemTitle: 'TMT Steel Rebar Fe 550D Chemical Limits',
    itemType: 'Content',
    addedDate: 'Feb 20, 2025',
    priority: 'Low',
    status: 'Pending',
    submittedBy: 'User Feedback Submission',
    referenceDoc: 'IS 1786:2008 Table 3',
    clauseExcerpt: 'Sulphur and Phosphorus combined percentage maximum 0.085% for grade Fe 550D.',
    notes: 'Suggested clarification for high-ductility rebar standards.',
  },
];

export const INITIAL_ACTIVITY_LOGS: PlatformActivityLog[] = [
  {
    id: 'act-01',
    timestamp: 'Today, 11:42 AM',
    actor: 'Rajesh Kumar (MSME)',
    actorRole: 'User',
    action: 'Ran Product Matcher for "Self-Ballasted 9W LED Bulb"',
    module: 'Recommendation',
    status: 'Success',
  },
  {
    id: 'act-02',
    timestamp: 'Today, 11:15 AM',
    actor: 'Dr. Ananya Sen (Engineer)',
    actorRole: 'User',
    action: 'Queried AI Assistant on IS 16102 insulation test protocol',
    module: 'Assistant',
    status: 'Success',
  },
  {
    id: 'act-03',
    timestamp: 'Today, 10:30 AM',
    actor: 'Admin Administrator',
    actorRole: 'Super Admin',
    action: 'Approved verification item VQ-100 (IS 14543 FSSAI Mapping)',
    module: 'Admin',
    status: 'Success',
  },
  {
    id: 'act-04',
    timestamp: 'Today, 09:15 AM',
    actor: 'Vikramaditya Sharma',
    actorRole: 'Procurement Officer',
    action: 'Saved standard IS 269:2015 to profile',
    module: 'Standards',
    status: 'Info',
  },
  {
    id: 'act-05',
    timestamp: 'Yesterday, 04:50 PM',
    actor: 'Priya Nair (Consumer)',
    actorRole: 'User',
    action: 'Downloaded BIS Certification checklist for IS 14543',
    module: 'Certification',
    status: 'Success',
  },
  {
    id: 'act-06',
    timestamp: 'Yesterday, 02:10 PM',
    actor: 'System Auto Ingestion',
    actorRole: 'Automated Service',
    action: 'Ingested 12 updated gazette notices from BIS portal',
    module: 'Standards',
    status: 'Info',
  },
  {
    id: 'act-07',
    timestamp: 'Feb 26, 2025',
    actor: 'Karan Patel',
    actorRole: 'New User',
    action: 'User registration submitted (Pending Approval)',
    module: 'Auth',
    status: 'Warning',
  },
];

export const INITIAL_SYSTEM_COMPONENTS: SystemComponent[] = [
  {
    id: 'sys-01',
    name: 'MANAK AI Web Application (Vite/React)',
    category: 'User Interface',
    status: 'Operational',
    description: 'Frontend workspace application client running cleanly.',
    lastChecked: 'Just now',
  },
  {
    id: 'sys-02',
    name: 'BIS Standards Catalogue Index',
    category: 'Data Layer',
    status: 'Operational',
    description: 'Mock catalog dataset (IS 16102, IS 269, IS 1786, IS 14543) active.',
    lastChecked: 'Just now',
  },
  {
    id: 'sys-03',
    name: 'MANAK AI Assistant Engine',
    category: 'AI & ML',
    status: 'Operational',
    description: 'RAG response generator & standard recommendation matcher operational.',
    lastChecked: 'Just now',
  },
  {
    id: 'sys-04',
    name: 'Conformity Assessment Guidance Engine',
    category: 'Core Service',
    status: 'Operational',
    description: 'Scheme-I & Scheme-II (CRS) certification guidance active.',
    lastChecked: 'Just now',
  },
  {
    id: 'sys-05',
    name: 'Local Storage State Manager',
    category: 'Data Layer',
    status: 'Operational',
    description: 'Browser persistent state active for user history, preferences & saved items.',
    lastChecked: 'Just now',
  },
  {
    id: 'sys-06',
    name: 'Python FastAPI Backend Integration',
    category: 'Core Service',
    status: 'Demo',
    description: 'Demo Mode active — Frontend mock response layer engaged.',
    lastChecked: 'Just now',
  },
];

export const MOCK_ADMIN_PROFILE: AdminProfileDetails = {
  id: 'adm-001',
  fullName: 'Admin Administrator',
  email: 'admin@manakai.in',
  role: 'Super Administrator & Compliance Lead',
  department: 'Bureau Standards AI Governance Cell',
  lastLogin: 'Today, 08:30 AM (IST)',
  permissions: [
    'User Management & Moderation',
    'Standards Catalogue Management',
    'Sources & Evidence Verification',
    'Verification Queue Approval',
    'System Status Monitoring',
    'Audit Log Access',
  ],
};
