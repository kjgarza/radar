# GitHub Pages Deployment Guide

This guide explains how to deploy your Technology Radar to GitHub Pages using GitHub Actions.

## Overview

The project is configured for **automatic deployment** to GitHub Pages. Every push to the `main` branch triggers a build and deployment workflow.

## Workflow Details

The deployment workflow (`.github/workflows/deploy.yml`) performs the following steps:

1. **Checkout code** from the repository
2. **Setup pnpm** (version 10.15.0)
3. **Setup Node.js** (version 20.19.2)
4. **Install dependencies** with `pnpm install`
5. **Build the site** with `pnpm build` (generates static files in `out/`)
6. **Deploy to GitHub Pages** using the official `deploy-pages` action

## Initial Setup

### Step 1: Enable GitHub Pages

1. Navigate to your repository on GitHub
2. Go to **Settings** > **Pages**
3. Under "Build and deployment", set **Source** to **GitHub Actions**

### Step 2: Configure for Your Repository

The workflow is pre-configured for deployment to `https://username.github.io/radar/`.

If your repository has a different name, update the base path in `.github/workflows/deploy.yml`:

```yaml
- name: Build with Next.js
  run: pnpm build
  env:
    NEXT_PUBLIC_BASE_PATH: /your-repo-name  # Change this
```

### Step 3: Deploy

Push your changes to the `main` branch:

```bash
git add .
git commit -m "Configure GitHub Pages deployment"
git push origin main
```

The workflow will automatically run. Monitor progress in the **Actions** tab of your repository.

## Custom Domain Setup

To use a custom domain (e.g., `radar.yourdomain.com`):

### Step 1: Add CNAME File

Create a `CNAME` file in the `public/` directory:

```bash
echo "radar.yourdomain.com" > public/CNAME
```

### Step 2: Remove Base Path

Edit `.github/workflows/deploy.yml` and remove the `NEXT_PUBLIC_BASE_PATH` environment variable:

```yaml
- name: Build with Next.js
  run: pnpm build
  # Remove the env section completely
```

Or set it to an empty string:

```yaml
- name: Build with Next.js
  run: pnpm build
  env:
    NEXT_PUBLIC_BASE_PATH: ''
```

### Step 3: Configure DNS

Add a DNS record with your domain provider:

**For a subdomain (recommended):**
- Type: `CNAME`
- Name: `radar` (or your preferred subdomain)
- Value: `yourusername.github.io`

**For an apex domain:**
- Type: `A`
- Name: `@`
- Values (add all four):
  - `185.199.108.153`
  - `185.199.109.153`
  - `185.199.110.153`
  - `185.199.111.153`

### Step 4: Configure Custom Domain in GitHub

1. Go to **Settings** > **Pages**
2. Under "Custom domain", enter your domain
3. Check "Enforce HTTPS" (after DNS propagation)

## Workflow Triggers

The deployment workflow runs:

- **Automatically** on push to `main` branch
- **Manually** via "Run workflow" button in the Actions tab

## Troubleshooting

### Build Fails with Zod Validation Errors

The build intentionally fails if `data/radar.json` doesn't match the schema. This is a feature, not a bug!

**Fix:** Ensure your JSON data follows the schema defined in `src/core/schemas/radar.schema.ts`.

### 404 Errors on Deployment

If you see 404 errors after deployment:

1. **Check base path configuration**: Ensure `NEXT_PUBLIC_BASE_PATH` matches your repository name
2. **Verify GitHub Pages source**: Must be set to "GitHub Actions"
3. **Check deployment URL**: Go to Settings > Pages to see the actual deployment URL

### Tailwind CSS Build Script Approval

The workflow does NOT require manual `pnpm approve-builds` because Tailwind CSS build scripts are automatically trusted in CI environments.

If you encounter issues, you can explicitly approve in the workflow:

```yaml
- name: Approve Tailwind CSS build scripts
  run: pnpm config set approvals.packages "{\"tailwindcss\":\"*\"}" && pnpm install --force
```

### Assets Not Loading

If CSS/JS files return 404:

1. Verify the `basePath` in `next.config.ts` matches your deployment path
2. Check browser console for the actual URLs being requested
3. Ensure the `public/.nojekyll` file exists (prevents Jekyll processing)

## Environment Variables

### NEXT_PUBLIC_BASE_PATH

Controls the base path for all routes and assets.

- **For GitHub Pages** (non-custom domain): Set to `/your-repo-name`
- **For custom domains**: Set to empty string or omit
- **For Vercel/Netlify**: Not needed

### Adding More Variables

If you need additional environment variables:

1. Add them to the workflow:
   ```yaml
   - name: Build with Next.js
     run: pnpm build
     env:
       NEXT_PUBLIC_BASE_PATH: /radar
       NEXT_PUBLIC_API_URL: https://api.example.com
   ```

2. Access in your code:
   ```typescript
   const apiUrl = process.env.NEXT_PUBLIC_API_URL;
   ```

## Manual Deployment

To deploy manually without GitHub Actions:

```bash
# Build the site
pnpm build

# The out/ directory contains your static site
# Upload it to any static hosting provider
```

## Monitoring Deployments

1. Go to your repository's **Actions** tab
2. Click on the latest workflow run
3. View logs for each step
4. Check deployment URL in the "Deploy to GitHub Pages" step

## Reverting a Deployment

GitHub Pages deployments are immutable. To revert:

1. Use `git revert` to undo changes
2. Push to `main` branch
3. Workflow will automatically deploy the reverted version

Alternatively:
1. Go to Actions > Latest successful deployment
2. Click "Re-run all jobs"

## Security Considerations

- **Workflow permissions** are minimal (read contents, write pages)
- **No secrets required** (fully static site)
- **Build validation** ensures data integrity before deployment
- **HTTPS enforced** by GitHub Pages

## Performance

- **Cold build time**: ~2-3 minutes
- **Deployment time**: ~30 seconds
- **Cache enabled**: Subsequent builds are faster with pnpm cache

## Additional Resources

- [GitHub Pages Documentation](https://docs.github.com/en/pages)
- [Next.js Static Export](https://nextjs.org/docs/app/building-your-application/deploying/static-exports)
- [GitHub Actions Documentation](https://docs.github.com/en/actions)
