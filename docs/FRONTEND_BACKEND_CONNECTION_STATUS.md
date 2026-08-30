# FRONTEND_BACKEND_CONNECTION_STATUS.md — ManakAI

Snapshot of what's actually wired together right now vs. what exists on only one side. Regenerate
this whenever new endpoints or pages are added — it's a status doc, not a spec (specs are
API_CONTRACT.md and UI_FLOWS.md).

## Backend endpoints that exist right now

| Endpoint | Status | Consumed by frontend? |
|---|---|---|
| GET /health & GET /api/health | Built, working | Yes — connected in `HomePage.tsx` / health check |
| POST /api/search | Built, working, real corpus (30 sources, 7 standards, 89 chunks) | Yes — connected in `AssistantPage.tsx` via `src/lib/api.ts` |

## Backend endpoints documented in API_CONTRACT.md but NOT built yet

| Endpoint | Needed by which frontend page(s) |
|---|---|
| POST /api/auth/signup | LoginPage.tsx (indirectly), SignupPage.tsx |
| POST /api/auth/login | LoginPage.tsx |
| POST /api/recommend | RecommendPage.tsx |
| GET /api/standards/search | StandardsPage.tsx |
| GET /api/standards/:id | StandardDetailPage.tsx |
| GET /api/history | HistoryPage.tsx |
| POST /api/feedback | AssistantPage.tsx (helpful/not-helpful buttons), any results view |
| GET /api/admin/stats | DashboardPage.tsx (admin), admin/* pages |
| POST /api/admin/sources/reindex | admin/* pages (knowledge source management) |

No backend endpoint for: password reset flow (ForgotPasswordPage.tsx), user profile management
(ProfilePage.tsx), saved/bookmarked standards (SavedPage.tsx), certification-specific lookups
(CertificationPage.tsx beyond what /api/search could already answer generically) — none of these
are in API_CONTRACT.md's documented MVP surface; confirm before building backend for them whether
they're still in scope or should stay deferred per PRD.md §6.

## Frontend pages — connection status

| Page | Backend dependency | Status |
|---|---|---|
| AssistantPage.tsx | POST /api/search | **CONNECTED** — Wired to `searchApi()` in `src/lib/api.ts` |
| HomePage.tsx | GET /api/health | **CONNECTED** — Checks backend health |
| LoginPage.tsx | POST /api/auth/login | Blocked — backend not built |
| SignupPage.tsx | POST /api/auth/signup | Blocked — backend not built |
| ForgotPasswordPage.tsx | (no documented endpoint) | Blocked — not in API_CONTRACT.md at all |
| RecommendPage.tsx | POST /api/recommend | Blocked — backend not built |
| StandardsPage.tsx | GET /api/standards/search | Blocked — backend not built |
| StandardDetailPage.tsx | GET /api/standards/:id | Blocked — backend not built |
| CertificationPage.tsx | (no dedicated endpoint documented) | Blocked — clarify scope first |
| HistoryPage.tsx | GET /api/history | Blocked — backend not built (also needs auth) |
| SavedPage.tsx | (no documented endpoint) | Blocked — not in API_CONTRACT.md at all |
| ProfilePage.tsx | (no documented endpoint) | Blocked — not in API_CONTRACT.md at all |
| DashboardPage.tsx (admin) | GET /api/admin/stats | Blocked — backend not built (also needs auth) |
| admin/* pages | GET /api/admin/stats, POST /api/admin/sources/reindex | Blocked — backend not built |

## Summary

- **2 of 14 frontend pages connected today**: `AssistantPage.tsx` → `POST /api/search` and `HomePage.tsx` → `GET /api/health`.
- **0 backend endpoints built without consumers**: Both `/health` and `/api/search` are fully integrated with frontend UI.
- **8 backend endpoints documented but not built** — each blocks exactly one or two pages.
- **3 frontend pages (ForgotPasswordPage, SavedPage, ProfilePage) have no corresponding endpoint documented in API_CONTRACT.md at all**.

## Recommended order to close these gaps

1. AssistantPage ↔ /api/search (Completed — wired and verified)
2. Auth (unblocks Login/Signup, and unlocks real user_id on History/Dashboard/admin)
3. /api/standards/* (unblocks StandardsPage, StandardDetailPage)
4. /api/recommend (unblocks RecommendPage)
5. /api/history, /api/feedback (unblocks HistoryPage, feedback buttons on AssistantPage)
6. /api/admin/* (unblocks DashboardPage/admin pages)
7. Decide scope on ForgotPasswordPage, SavedPage, ProfilePage, CertificationPage — either add
   them to API_CONTRACT.md with real endpoints, or explicitly mark them post-hackathon/future
