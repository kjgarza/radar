# CLAUDE.md

Covers `src/components/radar/`.

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
