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

- **Framework**: Next.js 16 with App Router (Turbopack)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: shadcn/ui (Zinc theme)
- **Charts**: Chart.js with react-chartjs-2
- **Validation**: Zod
- **Package Manager**: Bun
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
    github: "https://github.com/yourusername/radar",
  },
};
```

## Project Structure

```
radar/
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

- Node.js 18+ or Bun 1.0+

### Installation

1. Install dependencies:
```bash
bun install
```

2. Run the development server:
```bash
bun dev
```

3. Open [http://localhost:3000](http://localhost:3000) in your browser.

**Note**: In development mode with static export enabled, you may need to build first to see changes properly.

### Preview Production Build

```bash
bun run build     # Build the static site
bun run serve     # Serve the built site locally
```

**Next.js 16 Note**: `next start` no longer works with static exports. Use `bun run serve` to preview the production build.

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
          "tags": ["tag1", "tag2"],
          "caseStudyUrl": "https://yourwebsite.com/case-studies/tech-name",
          "thoughtworksUrl": "https://www.thoughtworks.com/radar/languages-and-frameworks/tech-name"
        }
      ]
    }
  ]
}
```

### Required Fields

- `id`: Unique identifier for the blip
- `name`: Display name of the technology
- `quadrant`: Which quadrant the technology belongs to
- `ring`: Current assessment ring
- `description`: Brief description of the technology
- `isNew`: Whether this is a new entry in this edition
- `movement`: How the technology moved between rings

### Optional Fields

- `previousRing`: The ring the technology was in before (if it moved)
- `links`: Array of relevant URLs (documentation, homepage, etc.)
- `tags`: Array of tags for categorization and filtering
- `caseStudyUrl`: Link to a case study on your website
- `thoughtworksUrl`: Link to ThoughtWorks Technology Radar entry

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
bun run build
```

This generates a static site in the `out/` directory.

## Deployment

### GitHub Pages

This project is configured for automatic deployment to GitHub Pages.

#### Initial Setup

1. **Enable GitHub Pages** in your repository:
   - Go to Settings > Pages
   - Set Source to "GitHub Actions"

2. **Configure base path** (if not using a custom domain):
   - The workflow is pre-configured for `https://username.github.io/radar/`
   - For a custom domain or root deployment, edit `.github/workflows/deploy.yml` and remove the `NEXT_PUBLIC_BASE_PATH` environment variable

3. **Push to main branch**:
   ```bash
   git add .
   git commit -m "Add GitHub Pages deployment"
   git push origin main
   ```

The workflow will automatically build and deploy your site to GitHub Pages. Check the Actions tab to monitor deployment progress.

#### Custom Domain

To use a custom domain:

1. Add a `CNAME` file to the `public/` directory with your domain:
   ```bash
   echo "yourdomain.com" > public/CNAME
   ```

2. Update `.github/workflows/deploy.yml` and remove the `NEXT_PUBLIC_BASE_PATH` variable:
   ```yaml
   - name: Build with Next.js
     run: bun run build
     # Remove: env: NEXT_PUBLIC_BASE_PATH: /radar
   ```

3. Configure your DNS provider to point to GitHub Pages

#### Manual Deployment

To deploy manually:

```bash
bun run build
# Upload the out/ directory to your hosting provider
```

### Vercel

The easiest way to deploy:

1. Push your code to GitHub
2. Import the repository in Vercel
3. Vercel will automatically detect Next.js and deploy

**Note**: When deploying to Vercel, you don't need the `basePath` configuration. The workflow environment variable only applies to GitHub Pages deployment.

### Other Static Hosts

You can deploy the `out/` directory to any static hosting service:

- Netlify
- AWS S3 + CloudFront
- Azure Static Web Apps
- Cloudflare Pages

## Updating the Radar

1. Edit `data/radar.json`
2. Add new editions or update existing blips
3. Rebuild the site: `bun run build`
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
