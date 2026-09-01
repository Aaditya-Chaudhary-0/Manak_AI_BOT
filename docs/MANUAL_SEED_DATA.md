# MANUAL_SEED_DATA.md — ManakAI

Curated, real BIS-related entries for the demo corpus. Since these are hand-curated (per the
"manual curation for speed" decision), insert these directly as `Standard` + `Source` + `Chunk`
rows via the existing repositories — do NOT route them through parser.py/chunker.py, which are
built for scraping live pages, not static curated data.

Each entry below gives everything needed to construct one Source row, one Standard row (where
applicable), and one short Chunk (the "scope" field, paraphrased — not verbatim from any source —
serves as the chunk text to embed).

## Category: hallmarking (official bis.gov.in — most legally clean source in this set)

| Field | Value |
|---|---|
| title | Hallmarking Overview |
| url | https://www.bis.gov.in/hallmarking-overview/?lang=en |
| source_type | hallmarking |
| scope (paraphrased) | Explains BIS's hallmarking system for gold and silver jewellery, the role of Assaying & Hallmarking Centres, and jeweller registration via the BIS portal. |

| Field | Value |
|---|---|
| title | Hallmarking FAQ |
| url | https://www.bis.gov.in/hallmarking-overview/hallmarking-faqs/hallmarking-faq/?lang=en |
| source_type | hallmarking |
| scope (paraphrased) | Answers common consumer questions about hallmark components, the HUID number, and how to verify hallmarked jewellery using the BIS Care app. |

| Field | Value |
|---|---|
| title | Jeweller Registration Procedure |
| url | https://www.bis.gov.in/hallmarking-overview/jewellers-registration-scheme/procedure-of-obtaining-licence/?lang=en |
| source_type | hallmarking |
| scope (paraphrased) | Describes the process for a jeweller to obtain BIS registration to sell hallmarked gold/silver jewellery from a given sales outlet. |

| Field | Value |
|---|---|
| title | Hallmarking Charges |
| url | https://bis.gov.in/hallmarking-overview/jewellers-registration-scheme/halmarking-charges |
| source_type | hallmarking |
| scope (paraphrased) | Lists the per-piece charges payable to BIS-recognized Assaying & Hallmarking Centres for gold and silver jewellery hallmarking. |

| Field | Value |
|---|---|
| title | Consumer Protection — Hallmarking |
| url | https://www.bis.gov.in/hallmarking-overview/consumer-protection/?lang=en |
| source_type | hallmarking |
| scope (paraphrased) | Explains how a consumer can get jewellery tested at a BIS-recognized centre and verify hallmark authenticity via the BIS Care mobile app. |

| Field | Value |
|---|---|
| title | Brief on Hallmarking Scheme (PDF) |
| url | https://www.bis.gov.in/wp-content/uploads/2020/12/brief-on-Hallmarking.pdf |
| source_type | hallmarking |
| scope (paraphrased) | Background document covering how and why BIS became the sole agency operating India's gold and silver hallmarking scheme. |

## Category: standard_metadata (official bis.gov.in)

| Field | Value |
|---|---|
| standard_code | IS 10500 |
| title | Drinking Water — Specification (Second Revision) |
| url | https://www.bis.gov.in/other/DrinWatIS10500.pdf |
| source_type | standard_metadata |
| status | Active |
| version | 2012 (Second Revision) |
| scope (paraphrased) | Sets requirements and test/sampling methods for drinking water quality in India, covering acceptable and permissible limits for water quality parameters. |

| Field | Value |
|---|---|
| standard_code | IS 15820 |
| title | General Requirements for Establishment and Operation of Assaying and Hallmarking Centres |
| url | https://www.bis.gov.in/hallmarking-overview/?lang=en |
| source_type | standard_metadata |
| status | Active |
| version | 2009 |
| scope (paraphrased) | Forms the basis for BIS recognition of Assaying and Hallmarking Centres. |

| Field | Value |
|---|---|
| standard_code | IS 1417 |
| title | Gold and Gold Alloys — Determination of Fineness (used for 995/999 fineness bar marking) |
| url | https://www.bis.gov.in/hallmarking-overview/?lang=en |
| source_type | standard_metadata |
| status | Active |
| version | 2016 |
| scope (paraphrased) | Referenced for refineries seeking BIS licence to mark standard gold bars of 995 and 999 fineness. |

## Category: standard_metadata (via BSB Edge — BIS's officially appointed e-sale distributor;
## metadata only, no full standard text reproduced)

| Field | Value |
|---|---|
| standard_code | IS 8470 |
| title | Packaging — Complete, Filled Transport Packages and Unit Loads — Dimensions of Rigid Rectangular Packages |
| url | https://standardsbis.bsbedge.com/ |
| source_type | standard_metadata |
| status | Active |
| version | 2018 (R2023) |

| Field | Value |
|---|---|
| standard_code | IS 6192 |
| title | Textiles — Monoaxially Oriented High Density Polyethylene Tapes — Specification |
| url | https://standardsbis.bsbedge.com/ |
| source_type | standard_metadata |
| status | Active |
| version | 1994 (R2023) |

| Field | Value |
|---|---|
| standard_code | IS 6191 : Part 2 |
| title | Methods of Micro-Biological, Colour Fastness and Microscopical Tests for Leather — Part 2 Colour Fastness to Water |
| url | https://standardsbis.bsbedge.com/ |
| source_type | standard_metadata |
| status | Active |
| version | 2017 (R2023) |

| Field | Value |
|---|---|
| standard_code | IS 8392 |
| title | Tungsten Powder for Hardmetals — Specification |
| url | https://standardsbis.bsbedge.com/ |
| source_type | standard_metadata |
| status | Active |
| version | 2023 (R2024) |

## Notes

- These entries use official-domain sources (bis.gov.in) wherever possible; the BSB Edge entries
  are metadata-only (code/title/status/version), matching the "public metadata, not full
  copyrighted text" boundary in DATA_SOURCES.md — no full standard text is reproduced anywhere
  here.
- IS 15820 and IS 1417 currently point back to the hallmarking-overview page since that's where
  they were referenced, not a dedicated standard detail page — if a dedicated bis.gov.in page for
  either is found later, update the url field to point directly at it.
- This gives you real coverage across two of your five source_type categories (hallmarking,
  standard_metadata). certification and lab source_type categories still have no real curated
  entries — worth a follow-up pass before the benchmark run, since BENCHMARK_QUESTIONS.md
  currently has certification questions with no corpus content to actually match against.
