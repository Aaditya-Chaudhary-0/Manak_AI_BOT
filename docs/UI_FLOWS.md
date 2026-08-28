# UI_FLOWS.md — ManakAI

Owner: Frontend dev. Trimmed to MVP scope only — matches `PRD.md` §6, not the full original 12-screen vision.

## 1. Screens in Scope for MVP

| Screen | Purpose | Backend dependency |
|---|---|---|
| Landing | Pitch + entry point, no auth required | none |
| Login / Signup | Auth | `POST /auth/login`, `POST /auth/signup` |
| Ask / Search | Core experience — text input, evidence cards | `POST /search` |
| Product Recommendation | Structured form → ranked standards | `POST /recommend` |
| Standard Detail | Single standard's metadata + sources | `GET /standards/:id` |
| History | Past queries (auth required) | `GET /history` |
| Admin Dashboard | KPI cards + review queue (admin only) | `GET /admin/stats` |

Deferred past MVP (per PRD §6): Hallmarking page, Lab Finder as a dedicated screen, standard comparison, PDF
export, document upload. Build these only after the six above work end-to-end.

## 2. Ask / Search Screen — Core Flow

```
1. User types a query into a single input (no separate "search vs ask" distinction — one box).
2. On submit → loading state → POST /search
3. Render response:
   - if abstained: show a plain "no confident match found" state with a suggestion to rephrase or browse
     Standards Search instead. Never render an empty results list silently — always explain why.
   - if results: render each as an evidence card:
       [ Standard code + title ]
       [ Snippet text, 2-3 lines, truncated with "read more" ]
       [ Confidence badge: High / Medium / Low, color-coded per DESIGN_TOKENS.md ]
       [ "View source" link → opens source_url in new tab ]
4. Below results: Helpful / Not Helpful buttons per card → POST /feedback
```

**Important UX rule tied to the backend design:** because there's no generated prose answer, the search results
list *is* the answer. Don't try to fake a summary sentence on the frontend by concatenating snippets — that
reintroduces exactly the "looks generated, might be wrong" problem the backend was built to avoid. If a
templated one-line answer is added later (PRD §6, COULD-have), it must come from the backend
(`RETRIEVAL_LOGIC.md` §5/§6 style deterministic templates), not be assembled client-side.

## 3. Product Recommendation — Wizard Flow

Simplify PRD v1's 5-step wizard to a single form for MVP (multi-step is a should-have, not a must-have):
```
Fields: product name*, material, use case, spec text (optional textarea)
Submit → POST /recommend
Render three sections: Strong Matches / Possible Matches / Needs Verification
Each match uses the same evidence-card component as the Search screen — reuse, don't rebuild.
```

## 4. Standard Detail Screen

```
Header: IS code, title, status badge, version
Body: scope text
Sources section: list of source cards (title + link + last-indexed date)
Related standards: only render this block if `related_standards` is non-empty — don't show an empty section header
```

## 5. Admin Dashboard — MVP Cut

Show only what maps to real backend data (don't build placeholder charts with fake numbers — the PRD explicitly
warns against presenting invented accuracy claims):
```
KPI cards: total_queries, abstained_rate, avg_latency_ms  (from GET /admin/stats)
Confidence distribution: simple bar/pie of High/Medium/Low  (from GET /admin/stats)
Top categories table
```

## 6. Component Reuse Principle

One `EvidenceCard` component, used by: Search results, Recommendation results, Standard Detail's source list.
Don't build three separate card components — they all render the same shape (`API_CONTRACT.md`'s result object).

## 7. Empty / Error States (Don't Skip These)

- No results + abstained → explanatory message, not a blank screen.
- API error (500) → generic "something went wrong, try again" — never surface raw error JSON to the user.
- Slow response (>3s) → loading skeleton, not a frozen button.
