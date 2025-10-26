# Recent Updates - Optional Blip Fields

## New Optional Data Attributes

Two new optional fields have been added to the blip schema to enhance the information you can provide about each technology:

### 1. `caseStudyUrl` (optional)
- **Type**: URL string
- **Purpose**: Link to case studies on your website
- **Example**: `"caseStudyUrl": "https://yourwebsite.com/case-studies/nextjs-migration"`
- **Display**: Shows as "View Case Study →" link in the blip detail panel

### 2. `thoughtworksUrl` (optional)
- **Type**: URL string
- **Purpose**: Link to the ThoughtWorks Technology Radar entry for this technology
- **Example**: `"thoughtworksUrl": "https://www.thoughtworks.com/radar/languages-and-frameworks/next-js"`
- **Display**: Shows as "View on ThoughtWorks →" link in the blip detail panel

## How to Use

Add these fields to any blip in your `data/radar.json` file:

```json
{
  "id": "blip-nextjs",
  "name": "Next.js",
  "quadrant": "Languages & Frameworks",
  "ring": "Adopt",
  "description": "Next.js is a React framework...",
  "isNew": false,
  "movement": "no_change",
  "links": ["https://nextjs.org"],
  "tags": ["frontend", "react", "ssr"],
  "caseStudyUrl": "https://yourwebsite.com/case-studies/nextjs",
  "thoughtworksUrl": "https://www.thoughtworks.com/radar/languages-and-frameworks/next-js"
}
```

## Where They Appear

These links are displayed in two places:

1. **Blip Detail Panel** (right sidebar when a blip is clicked)
   - Appears after tags and before general links
   - Each link has a distinct label and arrow icon

2. **Blip List View**
   - Appears at the bottom of each blip card
   - Displayed inline with other metadata

## Benefits

- **Case Study Links**: Showcase your experience and implementations with specific technologies
- **ThoughtWorks Links**: Provide additional context and industry perspective
- **Better Documentation**: Help readers understand both your perspective and industry standards
- **Easy Navigation**: Quick access to related resources without cluttering the main description

## Notes

- Both fields are completely optional
- URLs are validated by Zod schema - must be valid URLs
- If a field is not provided, it simply won't be displayed
- The build will fail if an invalid URL is provided (for data integrity)
