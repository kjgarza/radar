Generate a ststic technology radar static website. 


## Key User Roles & JTBD (simplified)

|Persona|JTBD / “When I …”|Acceptance Criteria|
|---|---|---|
|**Curator / Maintainer**|When I update the radar data (JSON), I want the site build to include the new edition and blip data|The JSON is read at build time; site build errors if schema invalid.|
|**Reader / Visitor**|When I open the site, I want to see the latest radar edition|The homepage should default to latest edition.|
||When I navigate to an edition, I want to see all blips in their quadrants & rings|The radial chart + list view should show each blip.|
||When I click or hover a blip, I want details (name, description, links, movement)|Tooltip or side panel shows details.|
||When I want to see how a blip changed over time, I want to see its historical path|A “history” view or timeline per blip showing ring changes across editions.|
||When I want to filter by ring or quadrant or search by name/tag|The UI should allow filtering / search client-side.|
||When I want a printable / shareable snapshot, I want to export or download|Provide “export to SVG / PNG / PDF” (client-side or build-time).|

---

## Feature Set / Functional Requirements

### Data / Content

- JSON schema for editions + blips.  
    Example:
    

```json
{
  "editions": [
    {
      "id": "2025-10",
      "version": "Vol 1 (2025 Oct)",
      "releaseDate": "2025-10-01",
      "description": "...",
      "blips": [
        {
          "id": "blip-xyz",
          "name": "FooFramework",
          "quadrant": "Languages & Frameworks",
          "ring": "Trial",
          "description": "FooFramework is ...",
          "isNew": true,
          "movement": "no_change",
          "previousRing": "Assess",
          "links": ["https://…"],
          "tags": ["frontend","js"]
        },
        … more blips
      ]
    },
    … more editions
  ]
}
```

- Validation at build time: required fields, enums, no duplicates, consistent id usage.
    
- Precompute any derived data needed for history (e.g. mapping blip ID → per-edition ring).
    

### Build Process

- Use a static site generator (e.g. NextJS, etc.).
    
- At build time:
    
    1. Parse JSON file(s).
        
    2. Generate pages:
        
        - Homepage → points to latest edition (with summary, navigation).
            
        - Edition pages → for each edition: radar view + list view + metadata.
            
        - Blip history pages → one per blip (show ring per edition timeline).
            
        - Archive / editions index page.
            
    3. Embed TS / CSS bundles for the radar interactivity.
        
    4. Optionally, pre-generate static export (SVG / PNG) snapshots.
        

### Client-side / Visualization

- On the edition page, client-side TS loads the blip data (embedded JSON or separate data payload).
    
- Use a chart / visualization library to draw the radial / radar chart. https://www.chartjs.org/docs/latest/samples/plugins/quadrants.html
    
- Support:
    
    - Hover / click tooltips or detail panels.
        
    - Filtering (by ring, quadrant, tags) — i.e. subset of nodes shown/hidden.
        
    - Animated transitions (blips moving, appearing) as filters change or as user toggles views.
        
    - Responsive layout (desktop vs mobile) — possibly fallback to list view on narrow screens.
        
    - Deep linking: URL query parameters or fragment hashes to preserve filter state or highlight a specific blip.
        
    - Export (SVG / PNG) – either via library support or by serializing the SVG/Canvas output.
        

### Blip History / Timeline View

- For each blip, show a small chart / list: edition dates vs ring names (e.g. “Adopt → Trial → Trial → Adopt”).
    
- Optionally a small sparkline or colored dots to indicate movements.
    

### Search / Filtering / Directory View

- On edition page: provide controls to filter by ring(s), quadrant(s), tags, and free-text search on name/description.
    
- Below or aside: a fallback directory list (sorted alphabetically) linking to each blip.
    

### Export / Printable

- Provide a “Download as SVG / PNG / PDF” button.
    
- Ensure layout is print-friendly (maybe via CSS print styles).
    

### Navigation & Metadata Pages

- Navigation bar with links to: Home, Editions Archive, About, maybe Contributing / JSON source.
    
- Edition archive page: list edition cards (name, date, description) linking to edition pages.
    
- SEO metadata (title, meta description) per page.
    

---





## Revised Lightweight Spec Outline (Markdown)


```markdown
# Tech Radar Static Site — Spec

## Data Format

- `data/radar.json` — contains an object:
  - `editions`: list of editions, each with `id`, `version`, `releaseDate`, `description`, `blips` list.
  - Each blip has `id`, `name`, `quadrant`, `ring`, `description`, `isNew`, `movement`, `previousRing`, `links`, `tags`.

## Build & Site Generation

- Choose a static site generator (e.g. Nextjs).  
- On build:
  1. Read `radar.json`, validate schema.  
  2. Generate:
     - `index.html` — redirects or shows latest edition.  
     - `edition/<editionId>.html` — page for each edition.  
     - `blip/<blipId>.html` — history / timeline page for each blip.  
     - `editions.html` — archive of editions.  
  3. Embed needed JS and CSS assets.  
- No runtime backend, no DB.

## Edition Page (`edition/<editionId>.html`)

- UI:
  - Radar chart area (canvas / SVG) showing all blips in their ring + quadrant.  
  - Filter controls (checkboxes / toggles for rings, quadrants, tags).  
  - Search box to filter/blips by name/description.  
  - Directory / list view fallback.  
  - Export button (SVG / PNG / PDF).  
- Behavior:
  - On load, chart displays all blips.  
  - On filter, update chart (show/hide) with transition.  
  - Hover/click blip → show tooltip / detail card.  
  - Deep link preserving filters or selected blip via URL hash/query.

## Blip History Page (`blip/<blipId>.html`)

- Show blip name, description, links.  
- Show a timeline or table:
```

Edition | Ring | Movement  
2024-04 | Trial | moved_in  
2025-10 | Adopt | moved_out

```
- (Optional) mini sparkline or colored ring dots.

## Export / Print

- Export the chart area as SVG or PNG (using library or JS).  
- Provide CSS for print layout for readable print/PDF.

## Dependencies & Libraries

- Charting library (recommended: Chart.js ).  
- Vanilla JS for filtering/search logic.  
- CSS / layout library (optional) for styling.  
- Build tool / bundler if needed (rollup, webpack, etc).

## Error Handling & Validation

- Build fails if JSON validation fails (missing fields, invalid enum).  
- On client side, if data missing or malformed, show user-friendly message (e.g. “No data available”).

## Deployment & Hosting

- Host as static site (Vercel).  
- Version control the JSON + source.  
- To update: edit JSON → rebuild → deploy.

## Performance & UX Notes

- Minimize JS payload. Only load charting library + data for current edition.  
- Lazy load or chunk JS where possible.  
- On mobile, if radial chart is cramped, fallback to list view.  
- Ensure color contrasts, tooltips accessible.  
- Use responsive layout.

```




Tech stack

- nextjs
- node
- pnpm
- typescript
- shadcn
- vercel deployment
- fully static
- tailwinds
- chartjs


In terms of the development use SOLID Principles and onion architecture ideas, but do not over engineer. Keep a good abstraction of structure, style and data. Treat this as a light MVP.
