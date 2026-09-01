# Phase 1 – Frontend Foundation & Design System

## Goal Description
Build the complete technical and visual foundation for the MANAK AI frontend within `ManakAI-main/frontend/`. This includes setting up the React + Vite + TypeScript project, configuring Tailwind CSS, adding React Router and Lucide React, establishing a clean folder structure, creating design tokens (colors, typography, spacing, borders), developing reusable UI components, BIS‑specific components, chat/search/dashboard primitives, TypeScript domain types, mock data, service placeholders, i18n foundation, and routing foundation. No backend integration, authentication, or full pages are built at this stage.

---

## User Review Required
[!IMPORTANT] 
> Please confirm the proposed folder structure and any additional dependencies (e.g., `react-router-dom`, `lucide-react`) before we proceed. If you have preferences for component naming or want to adjust the design token values, let us know now.

---

## Open Questions
- **Routing:** Should we use hash router or browser router? (Default: `BrowserRouter`)
- **i18n library:** Preferred library (e.g., `react-i18next`) or a minimal custom solution?
- **State management:** Any preference for a global store (e.g., `zustand`) or plain React context?
- **Testing:** Should we add any testing setup now (Jest, React Testing Library) or defer to later phases?

---

## Proposed Changes
### Dependencies
- Install runtime dependencies: `react-router-dom`, `lucide-react`
- Install dev dependencies: `tailwindcss`, `postcss`, `autoprefixer`, `postcss-cli`
- Initialize Tailwind config and add Tailwind directives to `src/index.css`.

---

### Folder Structure (`src/`)
#### [NEW] src/
- **components/**
  - `ui/` – primitive UI components (Button, Input, Card, etc.)
  - `navigation/` – Header, Sidebar, MobileNav, TopBar
  - `bis/` – SourceCard, ConfidenceBadge, StandardBadge, StandardCard, RecommendationCard
  - `chat/` – ChatContainer, ChatMessage, UserMessage, AssistantMessage, ChatInput, TypingIndicator
  - `search/` – SearchBar, SearchResult, SearchResultList, SearchFilters
  - `dashboard/` – StatCard, SectionHeader, DataTable, ActivityItem, ProgressIndicator
- **layouts/** – `PublicLayout.tsx`, `AppLayout.tsx`, `AdminLayout.tsx`
- **pages/** – placeholder pages for routes (Login, Signup, ForgotPassword, Dashboard, etc.)
- **routes/** – route definitions using React Router
- **data/** – mock data files (`standards.ts`, `sources.ts`, `evidence.ts`, `recommendations.ts`, `chatMessages.ts`)
- **types/** – centralized TypeScript interfaces (`standard.ts`, `source.ts`, `evidence.ts`, `recommendation.ts`, `searchResult.ts`, `chatMessage.ts`, `user.ts`, `certificationInfo.ts`, `confidenceLevel.ts`)
- **services/** – placeholder service modules (`standardsService.ts`, `assistantService.ts`, `recommendationService.ts`, `certificationService.ts`)
- **i18n/** – simple localization files (`en.json`, `hi.json`) and a tiny loader.
- **hooks/** – reusable React hooks (e.g., `useToggle`, `useResponsive`).
- **utils/** – utility functions (classNames, formatDate, etc.)
- **styles/** – Tailwind base/utility extensions, design‑token definitions (`tokens.css`).
- **assets/** – icon SVGs if needed (Lucide icons are used directly via library).

---

### Design Tokens
Create `src/styles/tokens.css` with CSS custom properties for:
- **Colors** – black, red, blue, charcoal, white/light‑gray, dark‑red (values from the specification).
- **Typography** – font families (system or Google Inter), font‑size scale, line‑height, font‑weight.
- **Spacing** – `--spacing-0` to `--spacing-12` matching Tailwind's spacing values.
- **Border / Radius** – `--border-radius-sm`, `--border-radius-md`, `--border-radius-lg`.
Import this file in `src/index.css` before Tailwind directives.

---

### Tailwind Configuration
- Generate `tailwind.config.cjs` with `content` pointing to `src/**/*.{tsx,ts,js,jsx}`.
- Extend theme to expose our CSS variables via `theme.extend.colors` using `var(--color-…)`.
- Add `plugins: []` (no extra plugins).

---

### Core UI Components (examples)
- **Button** (`components/ui/Button.tsx`)
- **IconButton** (uses Lucide icons)
- **Input**, **Textarea**, **Select**, **Checkbox**, **Switch**
- **Alert**, **Toast**, **LoadingState**, **ErrorState**, **EmptyState**, **Skeleton**
- **Card**, **Badge**, **Avatar**, **StatCard**
- **Tabs**, **Breadcrumb**, **Dropdown**, **Modal**, **Table**
All components will use Tailwind classes and design tokens, be fully typed, and include basic ARIA attributes for accessibility.

---

### BIS‑Specific Components
- **SourceCard**, **ConfidenceBadge**, **StandardBadge**, **StandardCard**, **RecommendationCard** – placed under `components/bis/`.

---

### Chat UI Foundation
- Components under `components/chat/` using mock message data.

---

### Search UI Foundation
- Components under `components/search/` with mock result list.

---

### Dashboard Primitives
- Components under `components/dashboard/` (StatCard, SectionHeader, DataTable, etc.).

---

### TypeScript Domain Types
Create dedicated files under `src/types/` exporting interfaces such as:
```ts
export interface Standard { id: string; isNumber: string; title: string; status: string; description: string; }
export interface Source { id: string; name: string; type: string; }
export interface Evidence { id: string; sourceId: string; snippet: string; }
export interface Recommendation { id: string; standardId: string; relevance: number; confidence: 'high'|'medium'|'low'; explanation?: string; }
export interface SearchResult { id: string; title: string; type: 'standard'|'source'; }
export interface ChatMessage { id: string; role: 'user'|'assistant'; content: string; timestamp: string; }
export interface User { id: string; name: string; }
export interface CertificationInfo { id: string; standardId: string; status: string; }
export type ConfidenceLevel = 'high' | 'medium' | 'low';
```

---

### Mock Data
Create files in `src/data/` exporting arrays of the above types for development previews.

---

### Service Placeholders
Each service will export async functions returning the mock data, e.g., `await fetchStandards(): Promise<Standard[]>`.

---

### i18n Foundation
- Add `src/i18n/en.json` and `hi.json` with a few keys (e.g., `askAnything`).
- Provide a simple `t(key)` function that picks language based on a context/provider.

---

### Routing Foundation
- Install `react-router-dom`.
- Create `src/routes/index.tsx` defining routes for `/`, `/login`, `/signup`, `/forgot-password` using `BrowserRouter` and `Routes`.
- Each route renders a placeholder page component inside the appropriate layout (`PublicLayout`).
- Future `/app/*` and `/admin/*` routes are added as empty placeholders.

---

## Verification Plan
### Automated Tests
- Run `npx tsc --noEmit` to ensure type safety.
- Run `npm run build` to verify Vite build succeeds.

### Manual Verification
- Start dev server (`npm run dev`) and manually inspect:
  - Tailwind styling applies.
  - Navigation works between placeholder pages.
  - Components render correctly and are responsive at the breakpoints listed.
  - Accessibility basics (focus outline, ARIA labels) are present.

---

Once you approve the plan (or provide adjustments), I will proceed to implement the changes.
