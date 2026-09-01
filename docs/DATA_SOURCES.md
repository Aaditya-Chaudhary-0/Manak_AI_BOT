# DATA_SOURCES.md — ManakAI

Owner: Dev 1 (Ingestion). This is the authoritative list of what gets scraped/parsed and indexed — nothing
outside this list should be ingested without adding it here first, so the team always knows exactly what the
corpus covers (and can say so to judges).

## 1. Source Categories

| Category | `source_type` value | What it covers |
|---|---|---|
| Know Your Standard | `standard_metadata` | Standard code, title, scope, status, version, amendments |
| Product Certification | `certification` | Scheme-I/Scheme-IV process guidance, FAQs |
| Hallmarking | `hallmarking` | Hallmarking overview, jeweller registration, HUID FAQs |
| Laboratories | `lab` | BIS-recognized testing/assaying facility info |
| Curated FAQs | `faq` | Admin-reviewed Q&A pairs, added manually for gap-filling |

## 2. Source List (Fill In Before First Ingestion Run)

| # | URL | Category | Notes |
|---|---|---|---|
| 1 | https://standardsbis.bsbedge.com/BIS_AdvanceSearch| standard_metadata | Primary standards index |
| 2 | *(BIS Product Certification page)* | certification | Scheme-I/IV guidance |
| 3 | *(BIS Hallmarking overview page)* | hallmarking | Consumer + jeweller info |
| 4 | *(BIS Hallmarking FAQ page)* | hallmarking | HUID explanation |
| 5 | *(BIS Product Certification FAQ)* | certification | Licence process |
| ... | | | |

> Keep this table updated as sources are added. Each row here should correspond 1:1 with a row in the `sources`
> Postgres table after ingestion.

## 3. Legal / Scope Boundary

- Only ingest **publicly accessible** BIS pages and documents — no login-walled or purchased-standard content.
- Do not attempt to reproduce or index full copyrighted standard text if BIS does not make it freely public;
  index the publicly available metadata/summary/scope instead, and always link to the official source for the
  full document.
- Respect `robots.txt` and reasonable request rates when scraping — this is a hackathon prototype, not a
  production crawler; a small curated set (dozens to low hundreds of pages) is enough for a strong demo.

## 4. Parsing Approach by Source Type

| Source Type | Parser |
|---|---|
| HTML pages | `BeautifulSoup` — extract main content div, strip nav/footer |
| PDF (public guidance docs) | `pdfplumber` for text, `pdftotext -layout` as fallback |
| FAQ pages | Parse Q/A pairs structurally where the page has clear markup; otherwise manually curate into `faq` category |

## 5. Refresh Cadence

For the hackathon: ingest once, re-run manually before the demo to catch any last-minute source changes. Track
`sources.checksum` so `POST /admin/sources/reindex` can detect "this page changed since we last indexed it"
without re-embedding everything blindly.
