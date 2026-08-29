import { MOCK_STANDARDS, type StandardDetail } from './mockStandardsData';

export interface ProductFormData {
  name: string;
  category: string;
  description: string;
  intendedUse: string;
  targetMarket?: string;
  materialComposition?: string;
  productType?: string;
  manufacturingLocation?: string;
  specialRequirements?: string;
}

export type RelevanceLevel = 'High Relevance' | 'Medium Relevance' | 'Low Relevance';

export interface RecommendationResult {
  id: string;
  standardId: string;
  standard: StandardDetail;
  relevanceLevel: RelevanceLevel;
  whyRelevant: string;
  alignedPoints: string[];
  suggestedScheme: string;
}

export interface CertificationSchemeInfo {
  id: string;
  title: string;
  shortCode: string;
  badge: string;
  whatIsIt: string;
  whenRelevant: string;
  nextAction: string;
  officialRef: string;
}

export interface ExampleProduct {
  id: string;
  title: string;
  category: string;
  badge: string;
  data: ProductFormData;
}

export const EXAMPLE_PRODUCTS: ExampleProduct[] = [
  {
    id: 'led-bulb',
    title: 'LED Bulb (Residential)',
    category: 'Electrical',
    badge: 'Lighting / Electronics',
    data: {
      name: 'Self-Ballasted LED Bulb 9W',
      category: 'Electrical',
      description: 'Energy-saving 9W LED bulb with integrated driver and B22 cap designed for indoor residential illumination.',
      intendedUse: 'Indoor residential and domestic lighting with 220-240V AC supply.',
      targetMarket: 'Indian Domestic Consumer Market',
      materialComposition: 'Thermoplastic body, aluminum heat sink, polycarbonate diffuser, SMD LED array.',
      productType: 'Consumer Lighting Appliance',
      manufacturingLocation: 'Domestic Manufacturing (India)',
      specialRequirements: 'High lumen efficacy (>90 lm/W) and BIS CRS registration compliance.',
    },
  },
  {
    id: 'cement-opc',
    title: 'Ordinary Portland Cement 53 Grade',
    category: 'Construction',
    badge: 'Civil Engineering',
    data: {
      name: 'Ordinary Portland Cement (OPC 53 Grade)',
      category: 'Construction',
      description: 'High-strength hydraulic cement for structural concrete, high-rise construction, and pre-cast concrete elements.',
      intendedUse: 'High-strength structural RCC beams, columns, bridges, and infrastructure.',
      targetMarket: 'Commercial Construction & Infrastructure',
      materialComposition: 'Calcareous and argillaceous materials with gypsum additives.',
      productType: 'Hydraulic Cement',
      manufacturingLocation: 'Domestic Manufacturing (India)',
      specialRequirements: 'Mandatory ISI mark compliance under Cement Quality Control Order.',
    },
  },
  {
    id: 'packaged-water',
    title: 'Packaged Drinking Water (Treated)',
    category: 'Food & Water',
    badge: 'Food Safety & Water',
    data: {
      name: 'Treated Packaged Drinking Water in 1L PET Bottles',
      category: 'Food & Water',
      description: 'Purified drinking water treated through reverse osmosis, UV disinfection, and ozonation packaged in food-grade PET bottles.',
      intendedUse: 'Consumer retail drinking water for general consumption.',
      targetMarket: 'Retail & Commercial Food Services',
      materialComposition: 'Potable water treated via RO, mineral fortification, food-grade PET container.',
      productType: 'Packaged Beverage / Water',
      manufacturingLocation: 'Domestic Bottling Plant (India)',
      specialRequirements: 'Mandatory FSSAI & BIS Scheme-I ISI Mark Certification with in-house laboratory testing.',
    },
  },
  {
    id: 'steel-rebar',
    title: 'TMT Steel Rebar (Fe 500D)',
    category: 'Metallurgical',
    badge: 'Structural Steel',
    data: {
      name: 'High-Strength TMT Rebar Fe 500D (12mm & 16mm)',
      category: 'Metallurgical',
      description: 'Thermo-Mechanically Treated high-ductility deformed steel reinforcement bars for earthquake-resistant concrete structures.',
      intendedUse: 'Reinforcement for RCC residential and civil infrastructure projects.',
      targetMarket: 'Structural Construction & Civil Contractors',
      materialComposition: 'Low-carbon micro-alloyed steel with controlled Sulphur and Phosphorus.',
      productType: 'Deformed Reinforcement Bar',
      manufacturingLocation: 'Domestic Integrated Steel Plant',
      specialRequirements: 'Mandatory Ministry of Steel Quality Control Order (QCO) BIS certification.',
    },
  },
];

export const CERTIFICATION_SCHEMES: CertificationSchemeInfo[] = [
  {
    id: 'isi-scheme-1',
    title: 'ISI Mark Certification Scheme (Scheme-I)',
    shortCode: 'ISI Scheme-I',
    badge: 'Mandatory & Voluntary',
    whatIsIt: 'The traditional third-party conformity assessment scheme under the BIS Act. Involves factory audits, testing in-house lab facilities, and independent sample testing before the grant of a standard ISI Mark license.',
    whenRelevant: 'Required for products covered under mandatory Quality Control Orders (e.g. Cement, Packaged Water, Steel, Household Appliances) as well as manufacturers voluntarily seeking the ISI mark for credibility.',
    nextAction: 'Prepare factory quality manual, verify in-house test equipment according to the Scheme of Inspection and Testing (SIT), and file online application on the BIS Manakonline portal.',
    officialRef: 'BIS Conformity Assessment Regulations 2018 (Scheme-I)',
  },
  {
    id: 'crs-scheme-2',
    title: 'Compulsory Registration Scheme (CRS)',
    shortCode: 'BIS CRS',
    badge: 'Electronics & IT',
    whatIsIt: 'Self-declaration of conformity scheme based on laboratory testing of product samples in BIS-recognized labs. Does not require preliminary factory inspection before registration, but requires ongoing market surveillance.',
    whenRelevant: 'Mandatory for notified electronics, IT products, LED lamps, smart watches, mobile phones, power adapters, and solar inverters under MeitY and MNRE orders.',
    nextAction: 'Submit sample to a BIS-recognized laboratory for safety testing against IS standard, obtain valid test report, and register on the BIS CRS portal to receive a unique R-Number.',
    officialRef: 'MeitY Electronics & IT Goods (Requirements for Compulsory Registration) Order',
  },
  {
    id: 'qco-order',
    title: 'Quality Control Orders (QCO)',
    shortCode: 'Mandatory QCO',
    badge: 'Statutory Requirement',
    whatIsIt: 'Government notifications issued by line ministries (e.g. DPIIT, Ministry of Steel, Ministry of Mines, MeitY) prohibiting the manufacture, import, sale, or distribution of specified products without valid BIS certification.',
    whenRelevant: 'Applicable to any manufacturer or importer dealing in notified product categories in India. Non-compliance attracts penalties under the BIS Act 2016.',
    nextAction: 'Check gazette notification enforcement dates, identify applicable Indian Standard, and initiate certification procedures at least 4-6 months before the mandatory deadline.',
    officialRef: 'Central Government Gazette Notifications & BIS QCO Tracker',
  },
  {
    id: 'voluntary-cert',
    title: 'Voluntary BIS Certification',
    shortCode: 'Voluntary Mark',
    badge: 'Market Trust',
    whatIsIt: 'Certification sought voluntarily by manufacturers for products not currently covered by mandatory QCOs to demonstrate superior safety, reliability, and quality standards to consumers and procurement agencies.',
    whenRelevant: 'Beneficial for enterprise tenders, government e-Marketplace (GeM) procurement preferences, export readiness, and consumer brand trust.',
    nextAction: 'Review standard test clauses, assess manufacturing capabilities against Indian Standard specifications, and submit a voluntary application under Scheme-I.',
    officialRef: 'BIS Act 2016 Section 13 (Voluntary Standards Conformity)',
  },
];

export const CERTIFICATION_PROCESS_STEPS = [
  {
    stepNumber: '01',
    title: 'Product Identification',
    desc: 'Determine product characteristics, category, and intended operational environment.',
  },
  {
    stepNumber: '02',
    title: 'Identify Indian Standard',
    desc: 'Identify applicable Indian Standard (IS Code) and review required clauses and test limits.',
  },
  {
    stepNumber: '03',
    title: 'Check Applicable Scheme',
    desc: 'Ascertain whether the product falls under ISI Scheme-I, CRS Registration, or Mandatory QCO.',
  },
  {
    stepNumber: '04',
    title: 'Testing & Assessment',
    desc: 'Test samples in BIS-recognized laboratories and ensure compliance with the Scheme of Testing (SIT).',
  },
  {
    stepNumber: '05',
    title: 'Application & Inspection',
    desc: 'Submit application via Manakonline / CRS portal; undergo factory inspection for Scheme-I.',
  },
  {
    stepNumber: '06',
    title: 'Grant of License / Registration',
    desc: 'Obtain CM/L License Number or Registration R-Number and apply standard mark to product labeling.',
  },
];

/**
 * Deterministic mock recommendation logic matching product details against MOCK_STANDARDS.
 * This is a demo rule-based matching engine simulating product understanding.
 */
export function getMockRecommendationsForProduct(formData: ProductFormData): RecommendationResult[] {
  const name = formData.name.toLowerCase();
  const cat = formData.category.toLowerCase();
  const desc = formData.description.toLowerCase();
  const use = formData.intendedUse.toLowerCase();
  const combined = `${name} ${cat} ${desc} ${use} ${(formData.productType || '').toLowerCase()} ${(formData.materialComposition || '').toLowerCase()}`;

  const results: RecommendationResult[] = [];

  // Helper to find standard
  const findStd = (id: string) => MOCK_STANDARDS.find((s) => s.id === id);

  // 1. LED Lighting / Bulbs / Lamps
  if (
    combined.includes('led') ||
    combined.includes('bulb') ||
    combined.includes('lamp') ||
    (cat.includes('electrical') && combined.includes('light'))
  ) {
    const is16102_1 = findStd('is-16102-1');
    const is16102_2 = findStd('is-16102-2');

    if (is16102_1) {
      results.push({
        id: `rec-led-1`,
        standardId: is16102_1.id,
        standard: is16102_1,
        relevanceLevel: 'High Relevance',
        whyRelevant: 'Product is an LED illumination device. IS 16102 (Part 1) mandates safety, insulation resistance, and cap torque specifications for self-ballasted lamps.',
        alignedPoints: [
          'Product category aligns with Electrotechnical / Lighting specifications',
          'Intended use matches domestic & general lighting voltage parameters (up to 250V AC)',
          'Mandatory compliance requirement under MeitY Compulsory Registration Scheme (CRS)',
        ],
        suggestedScheme: 'Compulsory Registration Scheme (CRS)',
      });
    }

    if (is16102_2) {
      results.push({
        id: `rec-led-2`,
        standardId: is16102_2.id,
        standard: is16102_2,
        relevanceLevel: 'High Relevance',
        whyRelevant: 'Direct companion standard establishing luminous efficacy (lm/W), lumen maintenance at 2,000 hours, and color temperature consistency.',
        alignedPoints: [
          'Addresses performance and energy-efficiency metrics for consumer retrofit lamps',
          'Directly complements Part 1 safety guidelines',
          'Crucial for BEE star labeling and quality declaration',
        ],
        suggestedScheme: 'Compulsory Registration Scheme (CRS)',
      });
    }
  }

  // 2. Cement / Concrete / Construction Materials
  if (
    combined.includes('cement') ||
    combined.includes('opc') ||
    combined.includes('portland') ||
    (cat.includes('construction') && (combined.includes('mortar') || combined.includes('concrete') || combined.includes('structural')))
  ) {
    const is269 = findStd('is-269');
    if (is269) {
      results.push({
        id: `rec-cement-1`,
        standardId: is269.id,
        standard: is269,
        relevanceLevel: 'High Relevance',
        whyRelevant: 'Product is hydraulic Ordinary Portland Cement. IS 269 provides mandatory chemical, compressive strength (33/43/53 Grade), and setting time parameters.',
        alignedPoints: [
          'Matches construction material classification under CED 2 committee',
          'Covers compressive strength thresholds at 72h, 168h, and 672h intervals',
          'Mandatory ISI Mark certification under Cement Quality Control Order',
        ],
        suggestedScheme: 'ISI Scheme-I (Mandatory QCO)',
      });
    }
  }

  // 3. Packaged Drinking Water / Mineral Water
  if (
    combined.includes('water') ||
    combined.includes('beverage') ||
    combined.includes('mineral') ||
    combined.includes('bottled') ||
    (cat.includes('food') && combined.includes('drink'))
  ) {
    const is14543 = findStd('is-14543');
    if (is14543) {
      results.push({
        id: `rec-water-1`,
        standardId: is14543.id,
        standard: is14543,
        relevanceLevel: 'High Relevance',
        whyRelevant: 'Product is treated packaged drinking water. IS 14543 prescribes microbiological safety, heavy metal limits, pesticide residue boundaries, and container food-grade standards.',
        alignedPoints: [
          'Category aligns directly with FAD 14 Food & Drinking Water Division',
          'Defines mandatory hygienic purification and testing procedures',
          'Mandatory compliance under FSSAI and BIS Scheme-I licensing',
        ],
        suggestedScheme: 'ISI Scheme-I (Mandatory Licensing)',
      });
    }
  }

  // 4. Steel / Rebar / TMT / Reinforcement
  if (
    combined.includes('steel') ||
    combined.includes('rebar') ||
    combined.includes('tmt') ||
    combined.includes('reinforcement') ||
    (cat.includes('metallurgical') && combined.includes('bar'))
  ) {
    const is1786 = findStd('is-1786');
    if (is1786) {
      results.push({
        id: `rec-steel-1`,
        standardId: is1786.id,
        standard: is1786,
        relevanceLevel: 'High Relevance',
        whyRelevant: 'Product is high-strength deformed steel rebar for concrete reinforcement. IS 1786 specifies yield strength, elongation, ductility, and chemical thresholds for Fe 415 to Fe 600 grades.',
        alignedPoints: [
          'Category directly matches MTD 4 Wrought Steel Products division',
          'Specifies mandatory bend/rebend tests and proof stress tolerances',
          'Enforced by Ministry of Steel mandatory Quality Control Order (QCO)',
        ],
        suggestedScheme: 'Mandatory QCO (Scheme-I)',
      });
    }
  }

  // 5. Electrical Appliances / Household / Plugs & Sockets
  if (
    combined.includes('plug') ||
    combined.includes('socket') ||
    combined.includes('outlet') ||
    combined.includes('switch')
  ) {
    const is1293 = findStd('is-1293');
    if (is1293) {
      results.push({
        id: `rec-plug-1`,
        standardId: is1293.id,
        standard: is1293,
        relevanceLevel: 'High Relevance',
        whyRelevant: 'Product belongs to electrical plugs and socket-outlets category. IS 1293 governs shutter safety, gauge tolerances, and temperature rise thresholds up to 250V / 16A.',
        alignedPoints: [
          'Directly matches DPIIT Plugs and Sockets Quality Control Order',
          'Specifies shutter safety mechanisms preventing foreign pin insertion',
          'Mandatory ISI Mark certification under Scheme-I',
        ],
        suggestedScheme: 'ISI Scheme-I (Mandatory QCO)',
      });
    }
  } else if (
    combined.includes('appliance') ||
    combined.includes('heater') ||
    combined.includes('iron') ||
    combined.includes('toaster') ||
    combined.includes('fan') ||
    (cat.includes('electrical') && !combined.includes('led'))
  ) {
    const is302_1 = findStd('is-302-1');
    if (is302_1) {
      results.push({
        id: `rec-app-1`,
        standardId: is302_1.id,
        standard: is302_1,
        relevanceLevel: 'High Relevance',
        whyRelevant: 'General safety benchmark for household electrical appliances. Covers electrical insulation, live part accessibility, and high-voltage breakdown criteria.',
        alignedPoints: [
          'Broad foundation standard referenced across specific appliance QCOs',
          'Mandates articulation probe testing and leakage current limits (<0.75mA)',
          'Requires testing in accredited laboratories',
        ],
        suggestedScheme: 'ISI Scheme-I (Mandatory QCO)',
      });
    }
  }

  // 6. Toys / Children Products / Chemical
  if (
    combined.includes('toy') ||
    combined.includes('game') ||
    combined.includes('children') ||
    combined.includes('doll')
  ) {
    const is9873_1 = findStd('is-9873-1');
    if (is9873_1) {
      results.push({
        id: `rec-toy-1`,
        standardId: is9873_1.id,
        standard: is9873_1,
        relevanceLevel: 'High Relevance',
        whyRelevant: 'Governs physical and mechanical safety aspects of children toys. Enforces small-parts choke hazard limits, drop impact tests, and edge sharpness criteria.',
        alignedPoints: [
          'Mandatory under Toys (Quality Control) Order',
          'Requires factory audit and Scheme-I certification',
          'Applies to all toys intended for children under 14 years',
        ],
        suggestedScheme: 'ISI Scheme-I (Mandatory QCO)',
      });
    }
  }

  // If we matched results, return them
  if (results.length > 0) {
    return results;
  }

  // If no direct keyword matched, but category matches an existing standard, provide a medium/low relevance suggestion
  if (cat.includes('electrical')) {
    const is302 = findStd('is-302-1');
    if (is302) {
      results.push({
        id: `rec-fallback-elec`,
        standardId: is302.id,
        standard: is302,
        relevanceLevel: 'Medium Relevance',
        whyRelevant: 'Product category is Electrical. IS 302 (Part 1) provides baseline safety and insulation guidelines for low-voltage consumer equipment.',
        alignedPoints: [
          'Category alignment with electrotechnical domain',
          'Provides general electrical insulation reference',
          'Check if a specific Part 2 standard applies to your exact product model',
        ],
        suggestedScheme: 'ISI Scheme-I / Voluntary Specification',
      });
    }
  } else if (cat.includes('construction')) {
    const is269 = findStd('is-269');
    if (is269) {
      results.push({
        id: `rec-fallback-const`,
        standardId: is269.id,
        standard: is269,
        relevanceLevel: 'Low Relevance',
        whyRelevant: 'Product is in Construction category. IS 269 is an example construction standard in our demo catalogue.',
        alignedPoints: [
          'General category similarity within Civil Engineering division',
          'Review whether specific masonry, tile, or structural standards apply',
        ],
        suggestedScheme: 'ISI Scheme-I',
      });
    }
  }

  return results;
}
