# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

A **fully static Next.js 16 App Router** site for visualizing technology trends as an interactive radar chart. Built with TypeScript, Zod validation, Chart.js, and shadcn/ui components. Uses Turbopack for fast builds.

**Critical constraint**: This is a static site (`output: 'export'`) - no server-side rendering, no API routes, no dynamic Next.js features.

## Essential Commands

### Initial Setup
```bash
bun install
```

**Note**: Unlike pnpm, Bun doesn't require approving build scripts for Tailwind CSS.

### Development
```bash
bun dev           # Start dev server at http://localhost:3000
                  # Note: May need to build first due to static export
bun run build     # Build static site to out/ directory
bun run serve     # Preview production build from out/ (uses serve package)
```

**Note**: Next.js 16 removed `next start` support for static exports. Use `bun run serve` to preview the built site.

### Validation
```bash
bun run build     # Validates data/radar.json with Zod schemas
                  # Build FAILS if JSON schema is invalid (intentional)
```

## Architecture

### Data Flow (Critical)
```
data/radar.json → RadarService (singleton) → Zod validation → React components
```

**Never import `data/radar.json` directly.** Always use `RadarService.getInstance()`:

```typescript
const radarService = RadarService.getInstance();
const edition = radarService.getLatestEdition();
const blips = radarService.searchBlips('react');
```

The service validates all data against Zod schemas at instantiation. Invalid data causes build-time failures.

### Type System

All types are derived from Zod schemas in `src/core/schemas/radar.schema.ts`:

```typescript
export type Blip = z.infer<typeof BlipSchema>;
export type Ring = z.infer<typeof RingSchema>; // 'Adopt' | 'Trial' | 'Assess' | 'Hold'
```

Types are re-exported through `src/core/types/index.ts` for clean imports.

### Directory Structure

```
src/
├── app/                    # Next.js App Router pages (Server Components)
│   ├── page.tsx            # Home page (latest edition)
│   ├── editions/           # Editions list
│   └── edition/[id]/       # Individual edition pages
├── components/
│   ├── ui/                 # shadcn/ui primitives (button, card, etc.)
│   └── radar/              # Radar-specific components (RadarChart, FilterSidebar, BlipList)
├── features/edition/       # Feature-scoped composites (EditionView)
├── core/
│   ├── schemas/            # Zod schemas (single source of truth for types)
│   ├── services/           # RadarService (all business logic)
│   └── types/              # TypeScript types (re-exports from schemas)
└── config/site.ts          # Site configuration
```

## Critical Patterns

### Server vs Client Components

**Server Components** (default):
- All `page.tsx` files
- Layout components
- Static content

**Client Components** (`'use client'` directive):
- `RadarChart.tsx` - Uses Chart.js
- `EditionView.tsx` - Interactive filtering
- `FilterSidebar.tsx` - User interactions

### Static Route Generation

Dynamic routes use `generateStaticParams()` to pre-render all pages:

```typescript
// src/app/edition/[id]/page.tsx
export function generateStaticParams() {
  const radarService = RadarService.getInstance();
  return radarService.getAllEditions().map(ed => ({ id: ed.id }));
}
```

All pages are pre-rendered at build time to `out/` directory.

## Data Schema

### radar.json Structure

```json
{
  "editions": [
    {
      "id": "2025-10",
      "version": "Vol 1 (2025 Oct)",
      "releaseDate": "2025-10-01T00:00:00Z",
      "description": "Edition description",
      "blips": [
        {
          "id": "blip-unique-id",
          "name": "Technology Name",
          "quadrant": "Languages & Frameworks",
          "ring": "Trial",
          "description": "Brief description",
          "isNew": true,
          "movement": "moved_in",
          "previousRing": "Assess",
          "tags": ["tag1", "tag2"],
          "links": ["https://example.com"]
        }
      ]
    }
  ]
}
```

### Critical Enums (Order Matters)

**Rings** (inner → outer, affects radius calculation):
```typescript
['Adopt', 'Trial', 'Assess', 'Hold']
```

**Quadrants** (affects angle assignment in radar chart):
```typescript
['Languages & Frameworks', 'Tools', 'Platforms', 'Techniques']
```

**Movement** (affects visual indicators):
```typescript
['moved_in', 'moved_out', 'no_change']
```

## Radar Chart Implementation

### Positioning Algorithm

Located in `src/components/radar/RadarChart.tsx`:

- **Quadrants** mapped to angles: Languages(0°), Tools(90°), Platforms(180°), Techniques(270°)
- **Rings** mapped to radius: `{ Adopt: 0.25, Trial: 0.5, Assess: 0.75, Hold: 1.0 }`
- Blips distributed within quadrant with angle spread + random jitter for visual separation

Chart.js `Scatter` chart type with polar coordinates converted to Cartesian (x, y).

### Quadrant Colors

```typescript
const QUADRANT_COLORS = {
  'Languages & Frameworks': 'rgba(59, 130, 246, 0.8)',  // blue
  'Tools': 'rgba(34, 197, 94, 0.8)',                   // green
  'Platforms': 'rgba(249, 115, 22, 0.8)',              // orange
  'Techniques': 'rgba(168, 85, 247, 0.8)',             // purple
};
```

## Styling System

- **Tailwind CSS 4**: Utility-first styling with OKLCH colors
- **shadcn/ui**: Zinc theme, New York style, with CSS variables for theming
- **Dark mode**: Default dark, light available via system preference
- **Responsive**: Mobile-first breakpoints
- Theme configuration in `src/app/globals.css`

See `STYLING.md` for full customization guide.

## Deployment

### GitHub Pages (Current)

Configured via `.github/workflows/deploy.yml`:
- Triggers on push to `main` branch
- Uses Bun for fast dependency installation and builds
- Builds with `NEXT_PUBLIC_BASE_PATH=/radar` for GitHub Pages
- Deploys `out/` directory to GitHub Pages

### Other Platforms

The `out/` directory can be deployed to any static hosting:
- Vercel (auto-detects Next.js)
- Netlify
- AWS S3 + CloudFront
- Cloudflare Pages

## Common Anti-Patterns to Avoid

❌ **Don't** import `data/radar.json` directly → use `RadarService`
❌ **Don't** add runtime data fetching → this is a static site
❌ **Don't** use dynamic Next.js features (middleware, API routes, server actions) → breaks static export
❌ **Don't** modify Zod schemas without updating `data/radar.json`

## Key Files Reference

- `src/core/services/radar.service.ts` - All business logic for data access
- `src/core/schemas/radar.schema.ts` - Type definitions + validation (single source of truth)
- `src/components/radar/RadarChart.tsx` - Chart.js implementation with positioning algorithm
- `src/features/edition/EditionView.tsx` - Main view composition with filtering
- `data/radar.json` - Single source of truth for radar data
- `src/config/site.ts` - Site metadata and author information

## TypeScript Configuration

- **Strict mode**: Enabled
- **Path aliases**: `@/*` → `./src/*`
- **Target**: ES2017
- **Module resolution**: `bundler` (Next.js optimized)
- **JSON imports**: Enabled via `resolveJsonModule`
