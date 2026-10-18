# CLAUDE.md

Covers `src/core/`.

### Type System

All types are derived from Zod schemas in `src/core/schemas/radar.schema.ts`:

```typescript
export type Blip = z.infer<typeof BlipSchema>;
export type Ring = z.infer<typeof RingSchema>; // 'Adopt' | 'Trial' | 'Assess' | 'Hold'
```

Types are re-exported through `src/core/types/index.ts` for clean imports.
