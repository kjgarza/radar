# CLAUDE.md

Shared instructions for coding agents. `AGENTS.md` is a symlink to this file, so Codex, Cursor and others read the same content.

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


## Deployment

### Other Platforms

The `out/` directory can be deployed to any static hosting:
- Vercel (auto-detects Next.js)
- Netlify
- AWS S3 + CloudFront
- Cloudflare Pages

## Where detail lives

Nested files load lazily when you read files in that directory.

- `data/CLAUDE.md` - radar.json structure, critical enums (ring/quadrant/movement order)
- `src/components/radar/CLAUDE.md` - chart positioning algorithm, quadrant colors
- `src/core/CLAUDE.md` - Zod-derived type system
- `src/app/CLAUDE.md` - static route generation, Tailwind/shadcn styling
- `.github/CLAUDE.md` - GitHub Pages deploy workflow

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

<!--
Canonical instruction file. Edit this one; AGENTS.md is a symlink to it.
Machine-local or personal notes go in CLAUDE.local.md (gitignored).
Convention: notes/scratchpad/10-Projects/specs/agent-instructions-convention.md
-->
