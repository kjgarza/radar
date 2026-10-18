# CLAUDE.md

Covers `data/`.

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
