# Technology Radar

A static technology radar website built with Next.js, TypeScript, and Chart.js to visualize and track technology trends and decisions.

## Features

- 📊 **Interactive Radar Chart**: Visualize technologies across quadrants and rings
- 🔍 **Advanced Filtering**: Filter by rings, quadrants, tags, and search by name/description
- 📱 **Responsive Design**: Works seamlessly on desktop and mobile devices
- 🎨 **Modern UI**: Built with Tailwind CSS and shadcn/ui components (Zinc theme, dark mode default)
- 📈 **Historical Tracking**: Track how technologies move through different rings over time
- 🚀 **Fully Static**: Pre-rendered at build time for optimal performance
- ♿ **Accessible**: Built with accessibility in mind

## Tech Stack

- **Framework**: Next.js 15 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: shadcn/ui (Zinc theme)
- **Charts**: Chart.js with react-chartjs-2
- **Validation**: Zod
- **Package Manager**: pnpm
- **Deployment**: Vercel (or any static hosting)

## Configuration

### Site Information

Edit `src/config/site.ts` to customize site information, author details, and footer links:

```typescript
export const siteConfig = {
  name: "Technology Radar",
  description: "Track and visualize technology trends and decisions",
  author: {
    name: "Your Name",
    email: "hello@example.com",
    github: "https://github.com/yourusername",
    linkedin: "https://linkedin.com/in/yourusername",
    figma: "https://figma.com/@yourusername",
  },
  links: {
    github: "https://github.com/yourusername/radar-2025",
  },
};
```

## Project Structure

```
radar-2025/
├── data/
│   └── radar.json           # Radar data (editions and blips)
├── src/
│   ├── app/                 # Next.js App Router pages
│   │   ├── page.tsx         # Home page (latest edition)
│   │   ├── editions/        # Editions list page
│   │   └── edition/[id]/    # Individual edition pages
│   ├── components/
│   │   ├── ui/              # shadcn/ui components
│   │   └── radar/           # Radar-specific components
│   ├── config/
│   │   └── site.ts          # Site configuration
│   ├── core/
│   │   ├── schemas/         # Zod schemas for validation
│   │   ├── services/        # Business logic (RadarService)
│   │   └── types/           # TypeScript types
│   └── features/
│       └── edition/         # Edition feature components
└── public/                  # Static assets
```

## Getting Started

### Prerequisites

- Node.js 18+ 
- pnpm

### Installation

1. Install dependencies:
```bash
pnpm install
```

2. Approve build scripts (required for Tailwind CSS):
```bash
pnpm approve-builds
# Select all packages and approve
```

3. Run the development server:
```bash
pnpm dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

**Note**: In development mode with static export enabled, you may need to build first to see changes properly.

## Data Format

The radar data is stored in `data/radar.json` and follows this structure:

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
          "id": "blip-xyz",
          "name": "Technology Name",
          "quadrant": "Languages & Frameworks",
          "ring": "Trial",
          "description": "Description of the technology",
          "isNew": true,
          "movement": "moved_in",
          "previousRing": "Assess",
          "links": ["https://example.com"],
          "tags": ["tag1", "tag2"]
        }
      ]
    }
  ]
}
```

### Quadrants

- Languages & Frameworks
- Tools
- Platforms
- Techniques

### Rings

- **Adopt**: Technologies we have high confidence in
- **Trial**: Technologies worth pursuing
- **Assess**: Technologies worth exploring
- **Hold**: Technologies to avoid or phase out

### Movement

- `moved_in`: Moved to inner ring
- `moved_out`: Moved to outer ring  
- `no_change`: Stayed in same ring

## Building for Production

```bash
pnpm build
```

This generates a static site in the `out/` directory.

## Deployment

### Vercel

The easiest way to deploy:

1. Push your code to GitHub
2. Import the repository in Vercel
3. Vercel will automatically detect Next.js and deploy

### Other Static Hosts

You can deploy the `out/` directory to any static hosting service:

- Netlify
- GitHub Pages
- AWS S3 + CloudFront
- Azure Static Web Apps

## Updating the Radar

1. Edit `data/radar.json`
2. Add new editions or update existing blips
3. Rebuild the site: `pnpm build`
4. Deploy the updated `out/` directory

The build process will validate your JSON data using Zod schemas and fail if there are any errors.

## Customization

### Theme

The site uses the Zinc color scheme from shadcn/ui with dark mode enabled by default. 

To change themes, see [STYLING.md](./STYLING.md) for detailed instructions.

### Footer Links

Update your personal links in `src/config/site.ts`.

## Architecture

This project follows SOLID principles with a clean architecture approach:

- **Data Layer**: JSON data with Zod validation
- **Service Layer**: `RadarService` encapsulates business logic
- **Presentation Layer**: React components for UI
- **Type Safety**: Full TypeScript coverage

The architecture maintains good separation of concerns while avoiding over-engineering for this MVP scope.

## License

MIT

---

Built with ❤️ using Next.js
