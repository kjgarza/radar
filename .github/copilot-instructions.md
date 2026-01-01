# Technology Radar - Copilot Instructions

## Project Overview

A **fully static Next.js 16 App Router** site (`output: 'export'`) for visualizing technology trends. Built with TypeScript, Zod validation, Chart.js radar charts, and shadcn/ui components. Uses Turbopack for fast builds.

**Stack**: Next.js 16 • React 19 • TypeScript • Tailwind CSS 4 • Chart.js • Zod • Bun

### Language & Runtime Versions

- **Bun**: `1.1.42+` (enforced via `packageManager` field)
- **TypeScript**: `^5` with strict mode enabled
- **React**: `19.2.3` (stable)
- **Next.js**: `16.1.1` (App Router with static export, Turbopack)

### Toolchain & Dependencies

**Core:**
- `next@16.1.1` - Framework with static export (Turbopack enabled)
- `react@19.2.3` & `react-dom@19.2.3` - UI library
- `typescript@^5` - Type safety
- `zod@^4` - Runtime validation & type generation

**UI & Styling:**
- `tailwindcss@^4` - Utility-first CSS
- `@radix-ui/*` - Headless UI primitives (shadcn/ui foundation)
- `lucide-react@^0.545.0` - Icon library
- `chart.js@^4.5.0` + `react-chartjs-2@^5.3.0` - Radar visualization

**Build Tools:**
- `@tailwindcss/postcss@^4` - PostCSS integration
- `postcss.config.mjs` - PostCSS configuration

### TypeScript Configuration

From `tsconfig.json`:
- **Strict mode**: `true` (enforces type safety)
- **Target**: ES2017
- **Module resolution**: `bundler` (Next.js optimized)
- **Path aliases**: `@/*` → `./src/*`
- **JSON imports**: Enabled (`resolveJsonModule: true`)

## Architecture Patterns

### Data Flow (Critical)
```
data/radar.json → RadarService (singleton) → Zod validation → React components
```

**Rules:**
- Always use `RadarService.getInstance()` - never import `radar.json` directly
- Service validates with `RadarDataSchema.parse()` at instantiation
- Build fails if JSON violates schema (intentional validation)
- All data processing happens at **build time**, not runtime

**Example:**
```typescript
const radarService = RadarService.getInstance();
const edition = radarService.getLatestEdition();
const blips = radarService.searchBlips('react');
```

### Type Safety via Zod
All types derive from Zod schemas in `src/core/schemas/radar.schema.ts`:
```typescript
export type Blip = z.infer<typeof BlipSchema>;
export type Ring = z.infer<typeof RingSchema>; // 'Adopt' | 'Trial' | 'Assess' | 'Hold'
```
Re-exported through `src/core/types/index.ts` for clean imports.

### Component Architecture
```
components/ui/      → shadcn/ui primitives (button, card, etc.)
components/radar/   → domain components (RadarChart, FilterSidebar, BlipList)
features/edition/   → feature-scoped composites (EditionView)
```

## Critical Workflows

### Canonical Commands (Single Source of Truth)

#### Initial Setup
```bash
# 1. Install dependencies
bun install

# 2. Verify setup
bun run build
```

**Note**: Unlike pnpm, Bun doesn't require approving build scripts for Tailwind CSS.

#### Development
```bash
bun dev                # Start dev server at http://localhost:3000
                       # Note: May need `bun run build` first due to static export
```

#### Build (Production)
```bash
bun run build          # 1. Validates data/radar.json with Zod
                       # 2. Generates static pages via generateStaticParams()
                       # 3. Outputs to out/ directory
                       # 4. Build FAILS if JSON schema invalid (intentional)
```

#### Preview Production Build
```bash
bun run build && bun run serve   # Serves static files from out/
```

**Note**: Next.js 16 removed `next start` support for static exports. Use `bun run serve` instead.

### CI/CD Pipeline

**Current State**: GitHub Pages deployment configured via GitHub Actions

**Workflow**: `.github/workflows/deploy.yml`
- Triggers on push to `main` branch
- Uses Bun for fast dependency installation and builds
- Builds with `NEXT_PUBLIC_BASE_PATH=/radar` for GitHub Pages
- Deploys `out/` directory to GitHub Pages

### Code Quality & Security Rules

#### TypeScript Strictness
- **Strict mode enabled**: No implicit `any`, strict null checks
- **No runtime type casting**: Use Zod for validation, not `as` assertions
- **Exhaustive type imports**: Import types explicitly when needed

#### Data Validation
- **Never bypass Zod validation**: All external data goes through schemas
- **Build-time validation**: JSON errors caught during build, not runtime
- **Schema-first types**: Generate TypeScript types from Zod schemas

#### Component Patterns
- **Server Components by default**: Use `'use client'` only when needed
  - Client: `RadarChart.tsx`, `EditionView.tsx`, `FilterSidebar.tsx`
  - Server: `page.tsx` files, layout components
- **Prop validation**: Use TypeScript interfaces, not runtime validators
- **No prop drilling**: Keep state local to feature components

#### Security Practices
- **No API keys in code**: This is a static site, no backend
- **Content Security**: All content from `data/radar.json` (trusted source)
- **XSS protection**: React auto-escapes, no `dangerouslySetInnerHTML`
- **External links**: Use `rel="noopener noreferrer"` for security

#### Styling Conventions
- **Tailwind-first**: Use utility classes, avoid custom CSS
- **CSS variables**: Theme colors via OKLCH variables in `globals.css`
- **Dark mode**: Default dark, light available via system preference
- **Responsive**: Mobile-first breakpoints (`lg:`, `md:`, etc.)

#### File Organization
- **Group by feature**: Related components in same directory
- **Barrel exports**: Use `index.ts` for clean imports
- **Naming**: PascalCase for components, kebab-case for files
- **Colocation**: Keep types, components, and logic together

### Adding Radar Data

```bash
# Edit data/radar.json - follow existing structure
# Required fields per blip:
{
  "id": "blip-unique-id",
  "name": "Technology Name",
  "quadrant": "Languages & Frameworks",  # or Tools, Platforms, Techniques
  "ring": "Trial",                       # Adopt, Trial, Assess, Hold
  "description": "Brief description",
  "isNew": true,
  "movement": "moved_in",                # moved_in, moved_out, no_change
  "tags": ["tag1", "tag2"]               # Used for filtering
}

# Validate immediately:
bun run build  # Fails with Zod errors if invalid
```

### Static Route Generation
Dynamic routes use `generateStaticParams()` (see `src/app/edition/[id]/page.tsx`):
```typescript
export function generateStaticParams() {
  const radarService = RadarService.getInstance();
  return radarService.getAllEditions().map(ed => ({ id: ed.id }));
}
```
All pages pre-rendered at build time to `out/` directory.

## Chart.js Radar Visualization

### Blip Positioning Algorithm
Located in `src/components/radar/RadarChart.tsx`:
- **Quadrants** mapped to angles: Languages(0°), Tools(90°), Platforms(180°), Techniques(270°)
- **Rings** mapped to radius: `{ Adopt: 0.25, Trial: 0.5, Assess: 0.75, Hold: 1.0 }`
- Blips distributed within quadrant with angle spread + random jitter

### Chart.js Setup
```typescript
import { Chart as ChartJS, LinearScale, PointElement, Tooltip, Legend } from 'chart.js';
ChartJS.register(LinearScale, PointElement, Tooltip, Legend);
```
Uses `Scatter` chart type with polar coordinates converted to Cartesian (x, y).

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

### Tailwind CSS 4 + OKLCH Colors
- Theme config in `src/app/globals.css` using CSS custom properties
- OKLCH format: `oklch(lightness chroma hue)` - better perceptual uniformity
- Dark mode default: `<html class="dark">`
- Full customization guide in `STYLING.md`

### shadcn/ui Configuration
From `components.json`:
- **Style**: New York
- **Base Color**: Zinc
- **CSS Variables**: Yes (for theming)
- **Icon Library**: lucide-react

## Data Schema Reference

### Critical Enums (Order Matters)
```typescript
// Rings (inner → outer, affects radius calculation)
['Adopt', 'Trial', 'Assess', 'Hold']

// Quadrants (affects angle assignment)
['Languages & Frameworks', 'Tools', 'Platforms', 'Techniques']

// Movement (affects visual indicators)
['moved_in', 'moved_out', 'no_change']
```

### Optional Blip Fields
- `previousRing`: Ring before movement (for history)
- `links`: Array of URLs (homepage, docs, etc.)
- `tags`: Array for filtering/search
- `caseStudyUrl`, `thoughtworksUrl`: External references

## Anti-Patterns

❌ **Don't** import `data/radar.json` directly → use `RadarService`
❌ **Don't** add runtime data fetching → this is a static site
❌ **Don't** use dynamic Next.js features → breaks static export
❌ **Don't** modify Zod schemas without updating all JSON data  

## Key Files to Reference

- `src/core/services/radar.service.ts` - All business logic
- `src/core/schemas/radar.schema.ts` - Type definitions + validation
- `src/components/radar/RadarChart.tsx` - Positioning algorithm
- `src/features/edition/EditionView.tsx` - Main view composition
- `data/radar.json` - Single source of truth for data