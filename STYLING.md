# Styling Guide

This document explains how to customize the colors and styling of the Technology Radar.

## Current Theme

The radar now uses a **Tech Blue Theme** with vibrant colors optimized for both light and dark modes.

### Color Palette

#### Light Mode
- **Primary**: Vibrant Blue (`oklch(0.55 0.22 250)`)
- **Background**: Off-white (`oklch(0.99 0 0)`)
- **Cards**: Pure white
- **Borders**: Light blue-gray
- **Accent**: Electric blue

#### Dark Mode
- **Primary**: Bright Blue (`oklch(0.65 0.25 250)`)
- **Background**: Dark blue-gray (`oklch(0.12 0.01 250)`)
- **Cards**: Slightly lighter dark blue
- **Borders**: Medium blue-gray
- **Accent**: Cyan

### Radar Chart Colors
- **Languages & Frameworks**: Blue
- **Tools**: Green
- **Platforms**: Orange
- **Techniques**: Purple

## Customizing Colors

### Option 1: Modify CSS Variables

Edit `src/app/globals.css` and change the color values in the `:root` section (light mode) and `.dark` section (dark mode).

The colors use OKLCH format: `oklch(lightness chroma hue)`
- **Lightness**: 0 (black) to 1 (white)
- **Chroma**: 0 (gray) to ~0.4 (very saturated)
- **Hue**: 0-360 degrees (0=red, 120=green, 240=blue, etc.)

Example - Change to green theme:
```css
:root {
  --primary: oklch(0.50 0.20 150); /* Green */
  --ring: oklch(0.50 0.20 150);
}
```

### Option 2: Use shadcn Theme Generator

Visit https://ui.shadcn.com/themes to generate a custom theme, then copy the CSS variables into `globals.css`.

### Option 3: Change Base Color

Run the shadcn init command with a different color:
```bash
pnpm dlx shadcn@latest init
```

Choose from: neutral, gray, zinc, stone, slate, blue, green, orange, red, rose, violet

## Customizing Border Radius

Change the `--radius` variable in `src/app/globals.css`:
```css
:root {
  --radius: 0.75rem; /* Current: medium rounded */
  /* Options:
     0rem - No rounding (sharp corners)
     0.375rem - Small rounding
     0.5rem - Default rounding
     0.75rem - Medium rounding (current)
     1rem - Large rounding
     9999px - Fully rounded (pills)
  */
}
```

## Customizing Radar Chart Colors

Edit `src/components/radar/RadarChart.tsx` and modify the `QUADRANT_COLORS` object:

```typescript
const QUADRANT_COLORS = {
  'Languages & Frameworks': 'rgba(R, G, B, 0.8)',
  'Tools': 'rgba(R, G, B, 0.8)',
  'Platforms': 'rgba(R, G, B, 0.8)',
  'Techniques': 'rgba(R, G, B, 0.8)',
};
```

### Recommended Color Combinations

**Professional Tech**:
- Blue, Teal, Green, Purple (current)

**Warm Sunset**:
- Orange, Red, Yellow, Pink

**Cool Ocean**:
- Blue, Cyan, Teal, Navy

**High Contrast**:
- Blue, Yellow, Magenta, Green

## Typography

The site uses the Geist font family. To change fonts:

1. Import different fonts in `src/app/layout.tsx`
2. Update the font variables in the className

Example - Using Inter:
```typescript
import { Inter } from 'next/font/google';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-sans',
});
```

## Component-Specific Styling

### Buttons
Buttons use the primary color by default. To create variant styles, edit `src/components/ui/button.tsx`.

### Cards
Cards use the card background color. Modify `--card` and `--card-foreground` in `globals.css`.

### Badges
Badges in the filter controls use the primary and secondary colors. These will automatically update when you change the theme.

## Dark Mode

The site automatically supports dark mode based on system preferences. To force a specific mode:

Add this to `src/app/layout.tsx`:
```tsx
<html lang="en" className="dark">  {/* or remove className for auto */}
```

## Rebuilding After Changes

After making styling changes, rebuild the site:
```bash
pnpm build
```

The static files will be regenerated in the `out/` directory with your new styling.

## Tips

1. **Test both modes**: Always check your changes in both light and dark mode
2. **Use contrast checkers**: Ensure text is readable (WCAG AA compliance)
3. **Preview before deploying**: Run `pnpm build` and test the `out/` directory
4. **Keep it consistent**: Use the design system variables instead of hardcoded colors
5. **Mobile-friendly**: Test on different screen sizes

## Resources

- [shadcn/ui Theming](https://ui.shadcn.com/docs/theming)
- [OKLCH Color Picker](https://oklch.com/)
- [Tailwind CSS Colors](https://tailwindcss.com/docs/customizing-colors)
- [Chart.js Colors](https://www.chartjs.org/docs/latest/general/colors.html)
