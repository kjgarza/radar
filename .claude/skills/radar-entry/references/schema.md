# Radar JSON Schema Reference

## File location

`data/radar.json` — single source of truth for all radar data.

## Top-level structure

```json
{
  "editions": [ ...Edition ]
}
```

## Edition object

| Field | Type | Required | Notes |
|-------|------|----------|-------|
| `id` | string | yes | Format: `YYYY-MM` e.g. `"2026-04"` |
| `version` | string | yes | Human label e.g. `"Vol 2 (2026 Apr)"` |
| `releaseDate` | string | yes | ISO 8601 UTC e.g. `"2026-04-01T00:00:00Z"` |
| `description` | string | yes | Short description of this edition |
| `blips` | Blip[] | yes | Array of blip entries |

## Blip object

| Field | Type | Required | Notes |
|-------|------|----------|-------|
| `id` | string | yes | Format: `blip-{kebab-slug}` e.g. `"blip-fastapi"` |
| `name` | string | yes | Display name of the technology/tool/technique |
| `quadrant` | string | yes | See Quadrants below |
| `ring` | string | yes | See Rings below |
| `description` | string | yes | Reflective prose — see voice-guide.md |
| `isNew` | boolean | yes | `true` if first appearance on the radar |
| `movement` | string | yes | See Movement values below |
| `previousRing` | string | conditional | Required when `movement` is `"moved_in"` AND `isNew` is `false`, or when `movement` is `"moved_out"`. Omit when `isNew: true`. |
| `links` | string[] | yes | Array of URLs; empty array `[]` is valid |
| `tags` | string[] | yes | Lowercase kebab-case tags |

## Quadrants

Exactly one of:
- `"Languages & Frameworks"`
- `"Tools"`
- `"Techniques"`
- `"Platforms"`

## Rings (inner to outer)

| Ring | Meaning |
|------|---------|
| `"Adopt"` | Strong recommendation; proven in use |
| `"Trial"` | Worth pursuing; some hands-on experience |
| `"Assess"` | Worth exploring; limited or early use |
| `"Hold"` | Proceed with caution; moving away from |

## Movement values

| Value | Meaning | `previousRing` needed? |
|-------|---------|------------------------|
| `"moved_in"` | Moved to a more central ring (e.g. Assess → Trial) OR new entry | Only if `isNew: false` |
| `"moved_out"` | Moved to a less central ring (e.g. Trial → Assess) | Yes |
| `"no_change"` | Same ring as last edition | No |

## ID naming convention

Generate the `id` from the technology name:
- Lowercase
- Replace spaces and special characters with hyphens
- Strip punctuation
- Examples: `"blip-fastapi"`, `"blip-github-actions-extended"`, `"blip-figma-playwright-mcps"`

## Insertion point

When adding a blip to an **existing edition**: append to the `blips` array of the matching edition object.

When adding a **new edition**: append to the `editions` array (newest edition last, or maintain chronological order).
