# USMicro Products — Project Status

**Last updated:** 2026-02-21
**Status:** ✅ Complete — Pending client review
**Live URL:** https://website-usmicro.vercel.app
**Repo:** c3po-minero/website-usmicro
**Vercel:** c3po-mineros-projects (Pro)

---

## Stack
- **Framework:** Next.js 15 (App Router, SSG)
- **Styling:** Tailwind CSS v4 (no config file, `@tailwindcss/postcss` plugin)
- **Animations:** CSS `@keyframes fadeInUp` in `globals.css`
- **Deploy:** Vercel Pro | `vercel --prod --yes`
- **Bypass token:** `K7KynBtHj7qo44Va9GyIuARaUbQWTu3g`

## Site Title
- `US Micro Products | Engineered Solutions`

## Accent Color
- `#9a5518` (WCAG AA compliant)

## Product Data
- **Source:** `working/usmicro/docs/USMP-Product-List-Q4.xlsx`
- **Sheets:** TFT, Smart, Touch, AMOLED, PMOLED, OFM, Graphic, Character, Tablet, files
- **JSON output:** `data/products/*.json`
- **Extract scripts:** `working/usmicro/extract_*.py`
- **Total products:** 459 across 9 categories
- **Datasheet URL pattern:** `https://djnr.net/usmp/{partNumber}.pdf`

## Pages Completed

### Product Categories (9)
| Category | Products | Columns | Special Sections |
|---|---|---|---|
| TFT Displays | default | default | Why Choose (bold-paragraph cards) |
| AMOLED Displays | 77 | 7 | Why Us (gradient+photos) |
| PMOLED Displays | 36 | 8 | PMOLED vs AMOLED 1v1, When to Choose |
| Character LCD | 45 | 14 | Char vs Graphic LCD 1v1, Applications 2-col |
| Graphic LCD | 20 | 13 | Package Types (COG/COB/TAB), Key Advantages |
| Smart Displays | 30 | 8 | Key Advantages gradient |
| Touch Panels | 24 | 9 | Key Advantages (6 bullets) |
| Open Frame Monitors | TBD | TBD | Not yet extracted from Excel |
| Tablets | TBD | TBD | Not yet extracted from Excel |

### Other Pages
- **Home** — Stats: 450+/9/30/200+ | FAQ | Industry cards | Client logos
- **About** — Hero bg image, Fabless Model photo collage
- **Custom Displays** — Consolidated 5 pages into 1: hero+stats, EDSP process, 4 technology cards, NRE/MOQ, FAQ
- **Products Overview** — Grid of all categories
- **Application Pages (12)** — Accordion sections, photo collage intros, dark gradient expertise
- **Service Pages (4)** — Photo collage intros, glass capability cards, accordion sections

## Key Architecture

### Dynamic Product Table
- `src/components/products/ProductTable.tsx`
- `CATEGORY_COLUMNS` record keyed by category slug
- Part numbers are clickable → PDF datasheet in new tab
- Table font: `0.8125rem` consistent

### Content Parsing
- `lib/content-parser.ts` — Parses markdown HTML into sections + FAQs
- `src/app/products/[category]/page.tsx` — Section renderer with regex detection:
  - `isWhyChoose` → `/why (choose|us micro)/i`
  - `isKeyAdvantages` → `/key (advantages|benefits)/i`
  - `isApplications` → `/^applications$/i`
  - `isCustomization` → `/customization/i`
  - `isWhenToChoose` → `/when to choose/i`
- Bold-paragraph extraction for Why Choose cards
- `decodeEntities()` helper for HTML entity decoding

### Templates
- `ApplicationTemplate.tsx` — 12 industry pages, 60/40 intro layout
- `ServiceTemplate.tsx` — 4 service pages, same visual patterns

### Images
- `public/images/applications/` — 24 webp (industry images from Unsplash)
- `public/images/services/` — 8 webp
- `public/images/content/` — about-hero, fabless-1/2, product photos
- `working/usmicro/logos/` — Client logos (Abbott, GE, Honeywell, etc.) + USMP brand logos

## Known Remaining Items
1. **Open Frame Monitors** — Excel sheet "OFM" not yet extracted
2. **Tablets** — Excel sheet "Tablet" not yet extracted
3. **Desktop submenu close-on-click** — Header.tsx uses CSS `group-hover:grid`; needs state-managed fix
4. **Client review** — Paco needs to review and approve before going live with real domain

## Design Patterns
- **Page intros:** 60% text left + 40% photo collage right
- **"Why Choose/Why Us":** Dark gradient bg + 2-col glass cards
- **"Key Advantages":** Dark gradient + cards left + stacked photos right
- **Comparisons (vs.):** Side-by-side 1v1 on dark gradient
- **"When to Choose":** Feature cards with accent left border icons
- **"Applications":** 2-col (cards left + photos right) + CTA buttons
- **"Customization":** Cards only, no links/buttons
- **FAQ:** 2-column accordion grid
- **Animations:** CSS fadeInUp (not JS IntersectionObserver — SSG compatibility)
