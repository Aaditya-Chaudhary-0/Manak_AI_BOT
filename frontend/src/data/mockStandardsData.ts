import type { EvidenceItem } from './mockAssistantData';

export interface KeyRequirement {
  id: string;
  number: string;
  title: string;
  explanation: string;
}

export interface ImportantClause {
  clauseNumber: string;
  topic: string;
  description: string;
}

export interface StandardDetail {
  id: string;
  code: string;
  title: string;
  status: 'Active' | 'Draft' | 'Withdrawn';
  category: 'Electrical' | 'Construction' | 'Food & Water' | 'Mechanical' | 'Metallurgical' | 'Chemical';
  year: number;
  standardType: 'Mandatory QCO' | 'Compulsory CRS' | 'ISI Scheme-I' | 'Voluntary Specification';
  description: string;
  relevanceReason: string;
  scope: string;
  metadata: {
    publicationYear: string;
    language: string;
    documentType: string;
    technicalCommittee: string;
    icsCode: string;
    gazetteRef: string;
  };
  keyRequirements: KeyRequirement[];
  importantClauses: ImportantClause[];
  evidence: EvidenceItem[];
  relatedStandardIds: string[];
}

export const MOCK_STANDARDS: StandardDetail[] = [
  {
    id: 'is-16102-1',
    code: 'IS 16102 (Part 1): 2012',
    title: 'Self-Ballasted LED-Lamps for General Lighting Services - Part 1: Safety Requirements',
    status: 'Active',
    category: 'Electrical',
    year: 2012,
    standardType: 'Compulsory CRS',
    description: 'Specifies essential electrical, insulation, mechanical, and thermal safety requirements for self-ballasted LED lamps intended for domestic and commercial general lighting with supply voltages up to 250V AC.',
    relevanceReason: 'Mandatory certification requirement under the MeitY Compulsory Registration Scheme (CRS) for domestic and imported LED lamps.',
    scope: 'This standard specifies the safety and interchangeability requirements, together with the test methods and conditions required to show compliance of LED-lamps with integrated means for controlling, intended for domestic and similar general lighting purposes.',
    metadata: {
      publicationYear: '2012 (Reaffirmed 2022)',
      language: 'English / Hindi',
      documentType: 'Indian Standard Specification',
      technicalCommittee: 'LITD 28 (Solid State Lighting & Lighting Fittings)',
      icsCode: '29.140.01 (Lamps in general)',
      gazetteRef: 'MeitY CRO Gazette Order S.O. 2357(E)',
    },
    keyRequirements: [
      {
        id: 'req-1',
        number: '01',
        title: 'Insulation Resistance & Electric Strength',
        explanation: 'Insulation resistance between current-carrying live parts and accessible metallic outer bodies must not be less than 4 MΩ under rated test conditions.',
      },
      {
        id: 'req-2',
        number: '02',
        title: 'Thermal Resistance and Heat Dissipation',
        explanation: 'Cap temperature rise during continuous steady-state operation must not exceed safety thresholds specified in Annexure B (maximum 120°C).',
      },
      {
        id: 'req-3',
        number: '03',
        title: 'Mechanical Strength of Lamp Caps',
        explanation: 'B22d and E27 lamp caps must withstand torsional torque testing of 3.0 Nm without detachment or mechanical degradation.',
      },
      {
        id: 'req-4',
        number: '04',
        title: 'Fault Condition Safety',
        explanation: 'The lamp must not catch fire, emit flammable gases, or produce dangerous exposed live contacts under short-circuit driver fault conditions.',
      },
    ],
    importantClauses: [
      {
        clauseNumber: 'Clause 4.1',
        topic: 'Marking & Traceability',
        description: 'Mandates permanent indelible marking of rated wattage, rated voltage, frequency, BIS Registration R-Number, and manufacturer identifier.',
      },
      {
        clauseNumber: 'Clause 6.2',
        topic: 'Cap Temperature Limits',
        description: 'Specifies test procedures in draft-free enclosure to record thermal rise on cap surface during prolonged operation.',
      },
      {
        clauseNumber: 'Clause 8.1',
        topic: 'Insulation Resistance Testing',
        description: 'Prescribes 500V DC megohmmeter insulation resistance verification across terminals and external envelope.',
      },
      {
        clauseNumber: 'Clause 11.3',
        topic: 'Resistance to Heat and Fire',
        description: 'Requires glow-wire testing at 650°C on insulating materials retaining live parts in place.',
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
    relatedStandardIds: ['is-16102-2', 'is-10322-5', 'is-15885-2-13'],
  },
  {
    id: 'is-16102-2',
    code: 'IS 16102 (Part 2): 2017',
    title: 'Self-Ballasted LED-Lamps for General Lighting Services - Part 2: Performance Requirements',
    status: 'Active',
    category: 'Electrical',
    year: 2017,
    standardType: 'Compulsory CRS',
    description: 'Establishes performance requirements including luminous flux maintenance, luminous efficacy (lm/W), correlated color temperature (CCT), color rendering index (CRI), and operational life testing.',
    relevanceReason: 'Direct companion standard to Part 1 for verifying energy ratings and lumen efficiency.',
    scope: 'This standard covers the performance requirements for self-ballasted LED lamps with supply voltage up to 250V for general lighting purposes.',
    metadata: {
      publicationYear: '2017',
      language: 'English',
      documentType: 'Indian Standard Specification',
      technicalCommittee: 'LITD 28',
      icsCode: '29.140.01',
      gazetteRef: 'BEE Star Labeling Guidelines & BIS CRS',
    },
    keyRequirements: [
      {
        id: 'req-p-1',
        number: '01',
        title: 'Initial Luminous Efficacy',
        explanation: 'Initial lumen output per watt must meet or exceed declared manufacturer rating by at least 90% in standardized integrating sphere tests.',
      },
      {
        id: 'req-p-2',
        number: '02',
        title: 'Lumen Maintenance at 2,000 Hours',
        explanation: 'Lamp must maintain at least 92% of initial rated lumen output after 2,000 continuous operating hours.',
      },
    ],
    importantClauses: [
      {
        clauseNumber: 'Clause 5.1',
        topic: 'Color Characteristics',
        description: 'Defines 7-step MacAdam ellipse color tolerance tolerances for declared standard CCT (2700K, 4000K, 6500K).',
      },
      {
        clauseNumber: 'Clause 7.2',
        topic: 'Life Test Conditions',
        description: 'Specifies continuous burn-in test protocols and rapid cycling switching withstand tests.',
      },
    ],
    evidence: [
      {
        sourceName: 'Bureau of Indian Standards',
        document: 'IS 16102 (Part 2): 2017 Standard Specification',
        clause: 'Section 6.1 (Luminous Efficacy)',
        excerpt: 'The measured luminous efficacy of the lamp shall not be less than 85 lm/W for standard consumer retrofit categories.',
        sourceUrl: 'https://www.bis.gov.in',
      },
    ],
    relatedStandardIds: ['is-16102-1', 'is-10322-5'],
  },
  {
    id: 'is-269',
    code: 'IS 269: 2015',
    title: 'Ordinary Portland Cement — Specification (Sixth Revision)',
    status: 'Active',
    category: 'Construction',
    year: 2015,
    standardType: 'ISI Scheme-I',
    description: 'Comprehensive Indian Standard specification unifying chemical, physical, and strength requirements for Ordinary Portland Cement 33 Grade, 43 Grade, and 53 Grade.',
    relevanceReason: 'Governed by mandatory Cement Quality Control Order; manufacturing or distribution without valid ISI mark is legally prohibited in India.',
    scope: 'Covers the manufacture and chemical and physical requirements of 33 grade, 43 grade and 53 grade ordinary Portland cement.',
    metadata: {
      publicationYear: '2015 (Sixth Revision)',
      language: 'English',
      documentType: 'Product Specification (Mandatory ISI Mark)',
      technicalCommittee: 'CED 2 (Cement and Concrete Sectional Committee)',
      icsCode: '91.100.10 (Cement. Gypsum. Lime. Mortar)',
      gazetteRef: 'Cement (Quality Control) Order, Ministry of Commerce & Industry',
    },
    keyRequirements: [
      {
        id: 'req-c-1',
        number: '01',
        title: 'Compressive Strength Criteria',
        explanation: 'Mandates minimum compressive strength of 43 MPa (43 Grade) and 53 MPa (53 Grade) at 28 days of standard curing.',
      },
      {
        id: 'req-c-2',
        number: '02',
        title: 'Initial and Final Setting Times',
        explanation: 'Initial setting time shall not be less than 30 minutes; final setting time shall not exceed 600 minutes via Vicat apparatus testing.',
      },
      {
        id: 'req-c-3',
        number: '03',
        title: 'Soundness Limits',
        explanation: 'Unaffected expansion tested by Le Chatelier method must not exceed 10 mm; autoclave expansion must not exceed 0.8%.',
      },
    ],
    importantClauses: [
      {
        clauseNumber: 'Clause 6.1',
        topic: 'Chemical Requirements',
        description: 'Defines ratio of percentage of lime to percentages of silica, alumina and iron oxide (Lime Saturation Factor between 0.66 and 1.02).',
      },
      {
        clauseNumber: 'Clause 7.2',
        topic: 'Compressive Strength Test',
        description: 'Standard cube testing (70.6 mm size) at 72±1h, 168±2h and 672±4h intervals.',
      },
    ],
    evidence: [
      {
        sourceName: 'Bureau of Indian Standards',
        document: 'Cement (Quality Control) Order / IS 269:2015',
        clause: 'Clause 10 & Scheme of Testing and Inspection (SIT)',
        excerpt: 'Every bag of Ordinary Portland Cement shall be marked with BIS Standard Mark (ISI) with valid license number CM/L.',
        sourceUrl: 'https://www.bis.gov.in',
      },
    ],
    relatedStandardIds: ['is-1489-1', 'is-456'],
  },
  {
    id: 'is-14543',
    code: 'IS 14543: 2024',
    title: 'Packaged Drinking Water (Other than Packaged Natural Mineral Water) — Specification',
    status: 'Active',
    category: 'Food & Water',
    year: 2024,
    standardType: 'ISI Scheme-I',
    description: 'Prescribes microbiological parameters, permissible pesticide residue limits, toxic heavy metal thresholds, and physical packaging criteria for treated packaged drinking water.',
    relevanceReason: 'Mandatory ISI mark compliance under Food Safety and Standards Authority of India (FSSAI) and BIS regulations.',
    scope: 'Prescribes requirements and methods of sampling and testing for packaged drinking water other than packaged natural mineral water.',
    metadata: {
      publicationYear: '2024 (Third Revision)',
      language: 'English',
      documentType: 'Mandatory Food Safety Specification',
      technicalCommittee: 'FAD 14 (Drinks and Drinking Water Sectional Committee)',
      icsCode: '13.060.20 (Drinking water)',
      gazetteRef: 'FSSAI Notification & BIS Mandatory Licensing Regulation',
    },
    keyRequirements: [
      {
        id: 'req-w-1',
        number: '01',
        title: 'Microbiological Sterility',
        explanation: 'Must be completely free from Escherichia coli, coliform bacteria, Faecal streptococci, Pseudomonas aeruginosa, and yeast/mould.',
      },
      {
        id: 'req-w-2',
        number: '02',
        title: 'Pesticide Residue Limits',
        explanation: 'Individual pesticide residues must not exceed 0.0001 mg/l; total pesticide residues must not exceed 0.0005 mg/l.',
      },
      {
        id: 'req-w-3',
        number: '03',
        title: 'Total Dissolved Solids (TDS)',
        explanation: 'TDS range must remain between 75 mg/l and 500 mg/l to maintain essential mineral balance.',
      },
    ],
    importantClauses: [
      {
        clauseNumber: 'Clause 4.2',
        topic: 'Water Treatment Technologies',
        description: 'Permits reverse osmosis, ozonation, ultrafiltration, and UV disinfection under strict hygienic safeguards.',
      },
      {
        clauseNumber: 'Clause 8.1',
        topic: 'Packaging Material Compliance',
        description: 'Containers must be food-grade polymer conforming to IS 12252 / IS 15410 or clean glass bottles.',
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
    relatedStandardIds: ['is-13428', 'is-10500'],
  },
  {
    id: 'is-1786',
    code: 'IS 1786: 2008',
    title: 'High Strength Deformed Steel Bars and Wires for Concrete Reinforcement — Specification',
    status: 'Active',
    category: 'Metallurgical',
    year: 2008,
    standardType: 'Mandatory QCO',
    description: 'Covers physical, mechanical, and chemical requirements for high-strength deformed Thermo-Mechanically Treated (TMT) steel bars and wires in grades Fe 415, Fe 500, Fe 550, and Fe 600.',
    relevanceReason: 'Governed by Ministry of Steel Quality Control Order requiring mandatory BIS licensing.',
    scope: 'Specifies requirements for deformed steel bars and wires for use as reinforcement in concrete in various construction applications.',
    metadata: {
      publicationYear: '2008 (Fourth Revision, Reaffirmed 2023)',
      language: 'English',
      documentType: 'Mandatory Product Specification',
      technicalCommittee: 'MTD 4 (Wrought Steel Products)',
      icsCode: '77.140.15 (Steels for reinforced concrete)',
      gazetteRef: 'Ministry of Steel (Quality Control) Order',
    },
    keyRequirements: [
      {
        id: 'req-s-1',
        number: '01',
        title: '0.2% Proof Stress / Yield Stress',
        explanation: 'Minimum proof stress of 500 MPa for Fe 500 and 500 MPa with enhanced ductility (Fe 500D) for earthquake-resistant zones.',
      },
      {
        id: 'req-s-2',
        number: '02',
        title: 'Elongation & Tensile Ratio',
        explanation: 'Fe 500D requires minimum elongation of 16.0% and ultimate tensile strength to yield stress ratio (UTS/YS) of at least 1.10.',
      },
    ],
    importantClauses: [
      {
        clauseNumber: 'Clause 4.2',
        topic: 'Chemical Composition Limits',
        description: 'Maximum Carbon: 0.25%, Sulphur: 0.040%, Phosphorus: 0.040%, and total S+P: 0.075%.',
      },
      {
        clauseNumber: 'Clause 9.3',
        topic: 'Bend and Rebend Tests',
        description: 'Mandates 180° cold bend test around specified mandrel diameter without transverse fracture.',
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
    relatedStandardIds: ['is-456', 'is-269'],
  },
  {
    id: 'is-302-1',
    code: 'IS 302 (Part 1): 2008',
    title: 'Safety of Household and Similar Electrical Appliances - General Requirements',
    status: 'Active',
    category: 'Electrical',
    year: 2008,
    standardType: 'Mandatory QCO',
    description: 'Deals with the general electrical, mechanical, and thermal safety of electric appliances for household and similar purposes, with rated voltages up to 250V for single-phase.',
    relevanceReason: 'Core benchmark standard for consumer electrical appliances quality control orders.',
    scope: 'Covers appliances used by laymen in domestic environments, shops, light industry and farms.',
    metadata: {
      publicationYear: '2008 (Fifth Revision)',
      language: 'English',
      documentType: 'General Safety Standard',
      technicalCommittee: 'ETD 32 (Electrical Appliances)',
      icsCode: '97.030 (Domestic electrical appliances in general)',
      gazetteRef: 'DPIIT Electrical Appliances (Quality Control) Order',
    },
    keyRequirements: [
      {
        id: 'req-e-1',
        number: '01',
        title: 'Protection Against Access to Live Parts',
        explanation: 'Standard test finger (probe B of IS 1401) must not contact live or internally insulated parts through any enclosure aperture.',
      },
      {
        id: 'req-e-2',
        number: '02',
        title: 'Leakage Current and Electric Strength at Operating Temperature',
        explanation: 'Leakage current must not exceed 0.75 mA for Class II portable appliances when powered at 1.15 times rated input.',
      },
    ],
    importantClauses: [
      {
        clauseNumber: 'Clause 8.1',
        topic: 'Accessibility Testing',
        description: 'Rigorous articulation probe tests across joints and switches.',
      },
      {
        clauseNumber: 'Clause 13.2',
        topic: 'High Voltage Breakdown',
        description: 'Application of 1250V AC test voltage between live poles and chassis.',
      },
    ],
    evidence: [
      {
        sourceName: 'Bureau of Indian Standards',
        document: 'IS 302 (Part 1) / DPIIT Quality Control Order',
        clause: 'General Compliance Section 3',
        excerpt: 'Household appliances manufactured or sold in India must fulfill electrical insulation and mechanical impact criteria.',
        sourceUrl: 'https://www.bis.gov.in',
      },
    ],
    relatedStandardIds: ['is-1293', 'is-16102-1'],
  },
  {
    id: 'is-1293',
    code: 'IS 1293: 2019',
    title: 'Plugs and Socket-Outlets for Related Voltages Up to and Including 250V and Rated Current Up to 16A',
    status: 'Active',
    category: 'Electrical',
    year: 2019,
    standardType: 'Mandatory QCO',
    description: 'Applies to 6A and 16A plugs and fixed or portable socket-outlets for AC circuits intended for domestic and general purposes.',
    relevanceReason: 'Governed under mandatory DPIIT Quality Control Order for all consumer wiring accessories.',
    scope: 'Applies to plugs and fixed or portable socket-outlets for a.c. only, with or without earthing contact.',
    metadata: {
      publicationYear: '2019 (Fourth Revision)',
      language: 'English',
      documentType: 'Indian Standard Specification',
      technicalCommittee: 'ETD 14 (Electrical Wiring Accessories)',
      icsCode: '29.120.30 (Plugs, socket-outlets, couplers)',
      gazetteRef: 'DPIIT Plugs and Sockets QCO Notification',
    },
    keyRequirements: [
      {
        id: 'req-ps-1',
        number: '01',
        title: 'Shutter Safety Mechanism',
        explanation: 'Socket-outlets must incorporate automatic shutter mechanisms preventing single-pin insertion of foreign objects.',
      },
      {
        id: 'req-ps-2',
        number: '02',
        title: 'Pin Dimensions & Gauge Verification',
        explanation: 'Pin diameter and spacing must conform strictly to GO and NO-GO precision gauge tolerances.',
      },
    ],
    importantClauses: [
      {
        clauseNumber: 'Clause 9.1',
        topic: 'Mechanical Impact Resistance',
        description: 'Spring-operated impact hammer test at 0.5 Joule on exposed thermoplastic faceplates.',
      },
      {
        clauseNumber: 'Clause 14.1',
        topic: 'Temperature Rise of Terminals',
        description: 'Terminal temperature rise must not exceed 45°C when loaded continuously at rated current.',
      },
    ],
    evidence: [
      {
        sourceName: 'Department for Promotion of Industry and Internal Trade (DPIIT)',
        document: 'Plugs and Socket-Outlets (Quality Control) Order',
        clause: 'Mandatory Marking Clause 3',
        excerpt: 'Goods or articles specified shall conform to IS 1293 and bear the Standard Mark under Scheme-I.',
        sourceUrl: 'https://www.bis.gov.in',
      },
    ],
    relatedStandardIds: ['is-302-1'],
  },
  {
    id: 'is-9873-1',
    code: 'IS 9873 (Part 1): 2019',
    title: 'Safety of Toys - Part 1: Safety Aspects Related to Mechanical and Physical Properties',
    status: 'Active',
    category: 'Chemical',
    year: 2019,
    standardType: 'Mandatory QCO',
    description: 'Establishes safety requirements regarding sharp edges, small parts choke hazards, tension/drop resistance, and acoustic limits for children toys.',
    relevanceReason: 'Strictly mandatory under Toys (Quality Control) Order with BIS Scheme-I factory licensing.',
    scope: 'Applies to toys for children under 14 years of age, specifying test criteria to reduce risks from mechanical hazards.',
    metadata: {
      publicationYear: '2019 (First Revision)',
      language: 'English',
      documentType: 'Product Safety Standard',
      technicalCommittee: 'PCD 12 (Consumer Products)',
      icsCode: '97.190 (Equipment for children)',
      gazetteRef: 'Toys (Quality Control) Order, Ministry of Commerce',
    },
    keyRequirements: [
      {
        id: 'req-t-1',
        number: '01',
        title: 'Small Parts Choking Cylinder Test',
        explanation: 'No component of a toy intended for children under 36 months may fit entirely into the standard small parts test cylinder.',
      },
      {
        id: 'req-t-2',
        number: '02',
        title: 'Drop and Impact Stress',
        explanation: 'Toys must withstand 5 repeated drop tests from 138 cm height onto steel plate without producing accessible sharp edges.',
      },
    ],
    importantClauses: [
      {
        clauseNumber: 'Clause 4.4',
        topic: 'Small Parts Hazard',
        description: 'Specifies 31.7 mm diameter angled cylinder truncation testing.',
      },
      {
        clauseNumber: 'Clause 5.24',
        topic: 'Tension Test on Projectiles',
        description: 'Application of 70N pull force on suction cup tips and soft projectile tips.',
      },
    ],
    evidence: [
      {
        sourceName: 'Bureau of Indian Standards',
        document: 'Toys (Quality Control) Order / IS 9873 (Part 1)',
        clause: 'Section 3 & SIT',
        excerpt: 'No toy shall be imported, manufactured or sold without valid BIS ISI mark confirming to IS 9873.',
        sourceUrl: 'https://www.bis.gov.in',
      },
    ],
    relatedStandardIds: [],
  },
];

export const SEARCH_SUGGESTIONS = [
  'LED bulbs',
  'Cement',
  'Packaged drinking water',
  'Electrical appliances',
  'IS 16102',
  'IS 269',
  'TMT Steel rebar',
  'Plugs and sockets',
  'Safety of toys',
];

export const CATEGORIES_LIST = [
  'Electrical',
  'Construction',
  'Food & Water',
  'Mechanical',
  'Metallurgical',
  'Chemical',
] as const;

export const STATUS_LIST = ['Active', 'Draft', 'Withdrawn'] as const;

export const STANDARD_TYPE_LIST = [
  'Mandatory QCO',
  'Compulsory CRS',
  'ISI Scheme-I',
  'Voluntary Specification',
] as const;

export const YEARS_LIST = [2024, 2019, 2017, 2015, 2012, 2008] as const;
