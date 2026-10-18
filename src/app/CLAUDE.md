# CLAUDE.md

Covers `src/app/`.

## Styling System

- **Tailwind CSS 4**: Utility-first styling with OKLCH colors
- **shadcn/ui**: Zinc theme, New York style, with CSS variables for theming
- **Dark mode**: Default dark, light available via system preference
- **Responsive**: Mobile-first breakpoints
- Theme configuration in `src/app/globals.css`

See `STYLING.md` for full customization guide.

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
