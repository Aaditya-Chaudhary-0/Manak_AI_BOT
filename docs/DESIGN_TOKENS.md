# DESIGN_TOKENS.md — ManakAI

Owner: Frontend dev. Palette matches the original PS 26107 reference theme — serious government/enterprise
intelligence platform, not a generic AI chatbot look.

## 1. Color Palette

| Token | Hex | Usage |
|---|---|---|
| `--black` | `#111111` | Navigation, headers, primary text on light backgrounds |
| `--charcoal` | `#33363B` | Cards, borders, secondary/muted UI |
| `--red` | `#D81E2C` | Primary CTA buttons, critical highlights, active nav state |
| `--dark-red` | `#7A0C14` | Warnings, outdated-source flags, Low-confidence badge |
| `--blue` | `#1B4F9C` | AI/assistant elements, links, table headers, Medium/interactive accents |
| `--white` | `#FFFFFF` | Base background |
| `--light-bg` | `#F5F6F8` | Card backgrounds, zebra-striped table rows |

## 2. Confidence Badge Colors (Tied Directly to RETRIEVAL_LOGIC.md Buckets)

| Bucket | Background | Text |
|---|---|---|
| High | `#E6F4EA` | `#1E7A34` (green — not in core palette, used only for this semantic signal) |
| Medium | `#FFF4E5` | `--blue` `#1B4F9C` |
| Low | `#FDEEEE` | `--dark-red` `#7A0C14` |

Note: green is intentionally introduced only for High confidence — it's the one place a non-palette color earns
its keep, since confidence state is a critical, frequently-scanned signal and needs to be instantly
distinguishable, not just palette-consistent.

## 3. Typography

- Font family: clean sans-serif (e.g. Inter, or system font stack) — avoid anything playful; this reads as a
  compliance/government tool.
- Strong hierarchy: large readable body text for chat/search results (16px+ base), bold section headers.
- Evidence snippets: slightly smaller, monospace-adjacent feel is optional but not required — plain sans is fine.

## 4. Component Styling Rules

- Cards: moderate border radius (6-8px), thin 1px border in `--charcoal` at low opacity, restrained shadow
  (avoid heavy drop-shadows — keep it flat/enterprise, not glossy/consumer).
- Primary buttons: `--red` background, white text, no gradient.
- Secondary buttons: outline style, `--charcoal` border, transparent background.
- Navigation: `--black` background, white/light-gray text, `--red` for active state indicator only.

## 5. Layout

- Desktop-first, responsive down to mobile.
- Standard structure: left sidebar (logo + nav) + top bar (search, language toggle, profile) + main canvas +
  optional right-side contextual panel (sources/filters) on wide screens.

## 6. Tailwind Config Snippet

```js
// tailwind.config.js
module.exports = {
  theme: {
    extend: {
      colors: {
        brandBlack: '#111111',
        brandCharcoal: '#33363B',
        brandRed: '#D81E2C',
        brandDarkRed: '#7A0C14',
        brandBlue: '#1B4F9C',
        brandLightBg: '#F5F6F8',
      },
    },
  },
};
```

## 7. What to Avoid

- No playful illustration style, no rounded "chat bubble" AI-assistant aesthetic — this is meant to read as
  authoritative, not casual.
- Don't introduce additional accent colors beyond the confidence-badge green exception above — palette
  discipline is part of the "serious platform" positioning judges will notice.
