export interface StandardItem {
  id: string;
  code: string;
  title: string;
  status: 'Active' | 'Under Revision' | 'Withdrawn' | 'Draft';
  relevanceReason: string;
  category: string;
  link: string;
}

export interface EvidenceItem {
  sourceName: string;
  document: string;
  clause: string;
  excerpt: string;
  sourceUrl: string;
}

export interface ActionItem {
  id: string;
  label: string;
  type: 'navigate' | 'followup' | 'save';
  payload: string;
  primary?: boolean;
}

export interface AssistantMessage {
  id: string;
  role: 'user' | 'assistant';
  timestamp: string;
  text: string;
  standards?: StandardItem[];
  evidence?: EvidenceItem[];
  confidence?: 'High' | 'Medium' | 'Low';
  suggestedActions?: ActionItem[];
  followUpPrompt?: string;
  isError?: boolean;
}

export interface ConversationSession {
  id: string;
  title: string;
  date: string;
  messages: AssistantMessage[];
}

export const EXAMPLE_PROMPTS = [
  {
    id: 'led-bulb',
    query: 'Which BIS standard applies to LED bulbs?',
    badge: 'Electrical & Lighting',
  },
  {
    id: 'cement',
    query: 'What standard is relevant for Ordinary Portland Cement?',
    badge: 'Civil & Construction',
  },
  {
    id: 'certification-guidance',
    query: 'How can I find the certification requirements for my product under Scheme-I?',
    badge: 'Certification',
  },
  {
    id: 'packaged-water',
    query: 'Help me identify the right BIS standard for packaged drinking water.',
    badge: 'Food & Safety',
  },
];

export const PRESET_CONVERSATIONS: Record<string, AssistantMessage[]> = {
  'led-bulb': [
    {
      id: 'msg-1-u',
      role: 'user',
      timestamp: '10:15 AM',
      text: 'Which BIS standard applies to LED bulbs?',
    },
    {
      id: 'msg-1-a',
      role: 'assistant',
      timestamp: '10:15 AM',
      text: 'For self-ballasted LED bulbs used for general lighting services, the primary applicable Indian Standard is IS 16102 (Part 1 & Part 2). These standards mandate safety and performance criteria respectively, and are compulsory under the BIS Compulsory Registration Scheme (CRS).',
      standards: [
        {
          id: 'std-1',
          code: 'IS 16102 (Part 1): 2012',
          title: 'Self-Ballasted LED-Lamps for General Lighting Services - Part 1: Safety Requirements',
          status: 'Active',
          relevanceReason: 'Covers essential electrical, thermal, and mechanical safety requirements for self-ballasted LED lamps.',
          category: 'Electrotechnical / Lighting',
          link: '/app/standards/is-16102-1',
        },
        {
          id: 'std-2',
          code: 'IS 16102 (Part 2): 2017',
          title: 'Self-Ballasted LED-Lamps for General Lighting Services - Part 2: Performance Requirements',
          status: 'Active',
          relevanceReason: 'Specifies luminous efficacy, lumen maintenance, color temperature consistency, and operational life.',
          category: 'Electrotechnical / Lighting',
          link: '/app/standards/is-16102-2',
        },
      ],
      evidence: [
        {
          sourceName: 'Bureau of Indian Standards (BIS)',
          document: 'IS 16102 (Part 1): 2012 / MeitY Compulsory Registration Order',
          clause: 'Clause 4.1 & MeitY CRO Gazette S.O. 2357(E)',
          excerpt: 'All self-ballasted LED lamps for general lighting services shall conform to IS 16102 (Part 1) and bear standard mark with unique R-number prior to market entry.',
          sourceUrl: 'https://www.bis.gov.in',
        },
      ],
      confidence: 'High',
      followUpPrompt: 'Are you looking for domestic residential ratings or commercial/industrial floodlight specifications?',
      suggestedActions: [
        { id: 'act-1', label: 'View IS 16102 Details', type: 'navigate', payload: '/app/standards', primary: true },
        { id: 'act-2', label: 'Check CRS Certification Guidance', type: 'navigate', payload: '/app/certification' },
        { id: 'act-3', label: 'Ask about Testing Requirements', type: 'followup', payload: 'What testing parameters are required in BIS lab for IS 16102?' },
      ],
    },
  ],
  'cement': [
    {
      id: 'msg-2-u',
      role: 'user',
      timestamp: '11:30 AM',
      text: 'What standard is relevant for Ordinary Portland Cement?',
    },
    {
      id: 'msg-2-a',
      role: 'assistant',
      timestamp: '11:30 AM',
      text: 'Ordinary Portland Cement (OPC) in India is categorized mainly under IS 269 (covering 33, 43, and 53 grades). Cement is under mandatory BIS certification (ISI Mark Scheme-I), meaning manufacturing or selling without a valid BIS license is prohibited.',
      standards: [
        {
          id: 'std-3',
          code: 'IS 269: 2015',
          title: 'Ordinary Portland Cement — Specification (Sixth Revision)',
          status: 'Active',
          relevanceReason: 'Unifies 33 Grade, 43 Grade, and 53 Grade OPC specifications, setting compressive strength, setting time, and chemical composition thresholds.',
          category: 'Civil Engineering / Cement & Concrete',
          link: '/app/standards/is-269',
        },
      ],
      evidence: [
        {
          sourceName: 'Bureau of Indian Standards',
          document: 'Cement (Quality Control) Order',
          clause: 'Section 3, Mandatory Scheme-I Licensing',
          excerpt: 'No person shall manufacture, store for sale, sell or distribute Ordinary Portland Cement which does not conform to IS 269 and without standard ISI Mark.',
          sourceUrl: 'https://www.bis.gov.in',
        },
      ],
      confidence: 'High',
      followUpPrompt: 'Would you like to explore specific compressive strength requirements for 43 Grade vs 53 Grade?',
      suggestedActions: [
        { id: 'act-4', label: 'View IS 269 Standard', type: 'navigate', payload: '/app/standards/is-269', primary: true },
        { id: 'act-5', label: 'Explore ISI Mark Certification Process', type: 'navigate', payload: '/app/certification' },
        { id: 'act-6', label: 'Check Pozzolana Portland Cement (IS 1489)', type: 'followup', payload: 'What is the standard for Portland Pozzolana Cement?' },
      ],
    },
  ],
  'certification-guidance': [
    {
      id: 'msg-3-u',
      role: 'user',
      timestamp: '02:00 PM',
      text: 'How can I find the certification requirements for my product under Scheme-I?',
    },
    {
      id: 'msg-3-a',
      role: 'assistant',
      timestamp: '02:00 PM',
      text: 'Scheme-I (ISI Mark Certification) applies to mandatory and voluntary products manufactured domestically and internationally (FMCS). The process involves factory audit, in-house laboratory readiness, sample testing in BIS-recognized labs, and compliance with the Scheme of Inspection and Testing (SIT).',
      standards: [
        {
          id: 'std-4',
          code: 'BIS Conformity Assessment Regs 2018',
          title: 'Scheme I - Conformity Assessment Procedures & Product Certification',
          status: 'Active',
          relevanceReason: 'Defines the legal procedures, application submission, audit guidelines, and grant of license.',
          category: 'Conformity Assessment',
          link: '/app/certification',
        },
      ],
      evidence: [
        {
          sourceName: 'Bureau of Indian Standards (BIS)',
          document: 'BIS Act 2016 & Conformity Assessment Regulations',
          clause: 'Regulation 4 & 5 (Scheme I)',
          excerpt: 'The license to use Standard Mark is granted after verification of manufacturing infrastructure, quality control system, and test results demonstrating conformity.',
          sourceUrl: 'https://www.bis.gov.in',
        },
      ],
      confidence: 'High',
      suggestedActions: [
        { id: 'act-7', label: 'Open Step-by-Step Certification Guide', type: 'navigate', payload: '/app/certification', primary: true },
        { id: 'act-8', label: 'Map Product to IS Code', type: 'navigate', payload: '/app/recommend' },
      ],
    },
  ],
  'packaged-water': [
    {
      id: 'msg-4-u',
      role: 'user',
      timestamp: '04:45 PM',
      text: 'Help me identify the right BIS standard for packaged drinking water.',
    },
    {
      id: 'msg-4-a',
      role: 'assistant',
      timestamp: '04:45 PM',
      text: 'Packaged drinking water is governed by two distinct standards depending on whether it is natural mineral water or treated packaged water: IS 14543 (other than natural mineral water) and IS 13428 (packaged natural mineral water). Both are strictly mandatory under FSSAI and BIS regulations.',
      standards: [
        {
          id: 'std-5',
          code: 'IS 14543: 2024',
          title: 'Packaged Drinking Water (Other than Packaged Natural Mineral Water) — Specification',
          status: 'Active',
          relevanceReason: 'Prescribes microbiological, chemical, and organoleptic limits along with container hygiene standards.',
          category: 'Food & Agriculture / Water',
          link: '/app/standards',
        },
        {
          id: 'std-6',
          code: 'IS 13428: 2005',
          title: 'Packaged Natural Mineral Water — Specification',
          status: 'Active',
          relevanceReason: 'Applies specifically to naturally sourced, unadulterated mineral water from underground aquifers.',
          category: 'Food & Agriculture / Water',
          link: '/app/standards',
        },
      ],
      evidence: [
        {
          sourceName: 'Food Safety and Standards Authority of India (FSSAI) & BIS',
          document: 'Food Safety and Standards (Prohibition and Restriction on Sales) Regulations',
          clause: 'Regulation 2.3.14 (Mandatory ISI Mark)',
          excerpt: 'No person shall manufacture, sell or exhibit for sale packaged drinking water except under the BIS Certification Mark.',
          sourceUrl: 'https://www.bis.gov.in',
        },
      ],
      confidence: 'High',
      suggestedActions: [
        { id: 'act-9', label: 'View IS 14543 Specification', type: 'navigate', payload: '/app/standards', primary: true },
        { id: 'act-10', label: 'Check Lab Testing Checklist', type: 'navigate', payload: '/app/certification' },
      ],
    },
  ],
};

export const RECENT_CONVERSATIONS_LIST: ConversationSession[] = [
  {
    id: 'conv-led',
    title: 'LED bulb standards (IS 16102)',
    date: 'Today',
    messages: PRESET_CONVERSATIONS['led-bulb'],
  },
  {
    id: 'conv-cement',
    title: 'Ordinary Portland Cement (IS 269)',
    date: 'Yesterday',
    messages: PRESET_CONVERSATIONS['cement'],
  },
  {
    id: 'conv-cert',
    title: 'Certification guidance for Scheme-I',
    date: '3 days ago',
    messages: PRESET_CONVERSATIONS['certification-guidance'],
  },
  {
    id: 'conv-water',
    title: 'Packaged drinking water (IS 14543)',
    date: 'Last week',
    messages: PRESET_CONVERSATIONS['packaged-water'],
  },
];

export function getMockResponseForQuery(query: string): AssistantMessage {
  const lower = query.toLowerCase();

  if (lower.includes('led') || lower.includes('bulb') || lower.includes('lighting') || lower.includes('lamp')) {
    return { ...PRESET_CONVERSATIONS['led-bulb'][1], id: `resp-${Date.now()}` };
  }

  if (lower.includes('cement') || lower.includes('concrete') || lower.includes('opc') || lower.includes('269')) {
    return { ...PRESET_CONVERSATIONS['cement'][1], id: `resp-${Date.now()}` };
  }

  if (lower.includes('water') || lower.includes('mineral') || lower.includes('drinking') || lower.includes('14543')) {
    return { ...PRESET_CONVERSATIONS['packaged-water'][1], id: `resp-${Date.now()}` };
  }

  if (lower.includes('certif') || lower.includes('scheme') || lower.includes('license') || lower.includes('isi mark') || lower.includes('audit')) {
    return { ...PRESET_CONVERSATIONS['certification-guidance'][1], id: `resp-${Date.now()}` };
  }

  if (lower.includes('steel') || lower.includes('tmt') || lower.includes('rebar')) {
    return {
      id: `resp-${Date.now()}`,
      role: 'assistant',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      text: 'High-strength deformed steel bars and wires for concrete reinforcement are classified under IS 1786. Steel used in structural construction is covered under mandatory Quality Control Orders (QCO) issued by the Ministry of Steel.',
      standards: [
        {
          id: 'std-steel',
          code: 'IS 1786: 2008',
          title: 'High Strength Deformed Steel Bars and Wires for Concrete Reinforcement — Specification',
          status: 'Active',
          relevanceReason: 'Covers physical, chemical, mechanical properties, and elongation for Fe 415, Fe 500, Fe 550, and Fe 600 grades.',
          category: 'Metallurgical Engineering',
          link: '/app/standards',
        },
      ],
      evidence: [
        {
          sourceName: 'Ministry of Steel / BIS',
          document: 'Steel and Steel Products (Quality Control) Order',
          clause: 'Section 4.2',
          excerpt: 'All reinforcement steel bars must conform to IS 1786 with BIS license before domestic sale or importation into India.',
          sourceUrl: 'https://www.bis.gov.in',
        },
      ],
      confidence: 'High',
      followUpPrompt: 'Do you need grade comparison details (Fe 500D vs Fe 550D) or bend/re-bend test criteria?',
      suggestedActions: [
        { id: 'act-steel-1', label: 'View IS 1786 Standard', type: 'navigate', payload: '/app/standards', primary: true },
        { id: 'act-steel-2', label: 'Check QCO Compliance Checklist', type: 'navigate', payload: '/app/certification' },
        { id: 'act-steel-3', label: 'Ask about chemical limits (Carbon/Sulphur)', type: 'followup', payload: 'What are the chemical composition limits for Fe 500D steel?' },
      ],
    };
  }

  // Fallback realistic response
  return {
    id: `resp-${Date.now()}`,
    role: 'assistant',
    timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    text: `Based on your query regarding "${query}", Manak AI has analyzed the Bureau of Indian Standards catalogue. Indian Standards establish safety, reliability, and procedural guidelines across over 14 technical divisions.`,
    standards: [
      {
        id: `std-gen-${Date.now()}`,
        code: 'IS General Conformity Assessment',
        title: 'Applicable Technical Specification & Safety Evaluation',
        status: 'Active',
        relevanceReason: 'Identified based on semantic match against BIS technical division database and current Quality Control Orders (QCOs).',
        category: 'General Standards & Regulations',
        link: '/app/standards',
      },
    ],
    evidence: [
      {
        sourceName: 'Bureau of Indian Standards',
        document: 'BIS Standards Repository & QCO Notification Portal',
        clause: 'General Product Compliance Regulation',
        excerpt: 'Standardization and conformity assessment under the BIS Act 2016 ensure consumer safety and product reliability.',
        sourceUrl: 'https://www.bis.gov.in',
      },
    ],
    confidence: 'Medium',
    followUpPrompt: 'Would you like to narrow down by specific product application, voltage rating, or material grade?',
    suggestedActions: [
      { id: 'act-gen-1', label: 'Explore Related Standards in Database', type: 'navigate', payload: '/app/standards', primary: true },
      { id: 'act-gen-2', label: 'Run Product → Standard Matcher', type: 'navigate', payload: '/app/recommend' },
      { id: 'act-gen-3', label: 'Ask specific requirement detail', type: 'followup', payload: `What are the testing requirements for ${query}?` },
    ],
  };
}
