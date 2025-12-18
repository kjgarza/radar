# GitHub Pages Deployment Checklist

Use this checklist to deploy your Technology Radar to GitHub Pages.

## Pre-Deployment Checklist

- [x] GitHub Actions workflow created (`.github/workflows/deploy.yml`)
- [x] Next.js config updated with basePath support (`next.config.ts`)
- [x] `.nojekyll` file added to `public/` directory
- [x] Documentation created (`DEPLOYMENT.md`, `README.md` updated)
- [x] Build tested locally with base path
- [ ] Repository pushed to GitHub
- [ ] GitHub Pages enabled in repository settings

## Deployment Steps

### 1. Enable GitHub Pages

- [ ] Go to your repository on GitHub
- [ ] Navigate to **Settings** > **Pages**
- [ ] Under "Build and deployment", select **Source: GitHub Actions**
- [ ] Save the configuration

### 2. Configure Base Path (if needed)

**Current configuration**: `/radar` (matches repository name)

- [ ] If your repository name is different, update `.github/workflows/deploy.yml`:
  ```yaml
  env:
    NEXT_PUBLIC_BASE_PATH: /your-repo-name
  ```

**For custom domain deployment**:
- [ ] Create `public/CNAME` with your domain
- [ ] Remove or empty `NEXT_PUBLIC_BASE_PATH` in workflow
- [ ] Configure DNS settings
- [ ] Set custom domain in GitHub Pages settings

### 3. Commit and Push

```bash
# Review changes
git status

# Add all files
git add .

# Commit with descriptive message
git commit -m "Add GitHub Pages deployment configuration"

# Push to main branch
git push origin main
```

### 4. Monitor Deployment

- [ ] Go to **Actions** tab in your GitHub repository
- [ ] Watch the "Deploy to GitHub Pages" workflow
- [ ] Wait for both "build" and "deploy" jobs to complete (usually 2-3 minutes)
- [ ] Check for any errors in the logs

### 5. Verify Deployment

- [ ] Visit deployment URL: `https://yourusername.github.io/radar/`
- [ ] Check that the homepage loads correctly
- [ ] Navigate to different sections (editions list, individual edition)
- [ ] Test the radar chart interactivity
- [ ] Verify filters and search functionality
- [ ] Check responsive design on mobile

## Post-Deployment Checklist

### Test All Features

- [ ] Homepage displays latest edition
- [ ] Radar chart renders correctly
- [ ] Quadrant colors are correct
- [ ] Blips are positioned properly
- [ ] Clicking blips shows details
- [ ] Filter by ring works
- [ ] Filter by quadrant works
- [ ] Filter by tags works
- [ ] Search functionality works
- [ ] Editions list page works
- [ ] Individual edition pages load
- [ ] Dark mode is default
- [ ] Light mode toggle works (if implemented)

### Verify Assets

- [ ] CSS styles load correctly
- [ ] JavaScript bundles load
- [ ] Images and icons display
- [ ] Fonts render properly
- [ ] No 404 errors in browser console

### Performance Check

- [ ] Page loads in under 3 seconds
- [ ] No JavaScript errors in console
- [ ] Chart.js renders smoothly
- [ ] Filtering is responsive

## Troubleshooting

If something doesn't work:

### Build Fails

**Zod Validation Error**:
- Check `data/radar.json` against schema
- Run `pnpm build` locally to see detailed errors
- Fix JSON data and push again

**Dependency Installation Error**:
- Check `pnpm-lock.yaml` is committed
- Verify `package.json` has correct versions
- Check workflow uses correct pnpm version (10.15.0)

### Deployment Succeeds but Site Shows 404

**Base Path Mismatch**:
- Verify `NEXT_PUBLIC_BASE_PATH` matches repository name
- Check HTML source for asset URLs
- Rebuild with correct base path

**GitHub Pages Not Enabled**:
- Confirm Source is set to "GitHub Actions" in settings
- Wait a few minutes for DNS propagation

### Assets Return 404

**Missing `.nojekyll` file**:
- Verify `public/.nojekyll` exists
- Rebuild and redeploy

**Wrong Asset Paths**:
- Check `next.config.ts` basePath configuration
- Verify environment variable is set in workflow

### Styles Not Loading

**Tailwind CSS Issue**:
- Tailwind CSS build scripts are auto-approved in CI
- Check workflow logs for PostCSS errors
- Verify `postcss.config.mjs` is committed

## Maintenance

### Updating Content

When you update `data/radar.json`:

1. Edit the JSON file locally
2. Test with `pnpm build`
3. Commit and push to `main`
4. GitHub Actions automatically redeploys

### Updating Dependencies

```bash
# Update dependencies
pnpm update

# Test build
pnpm build

# Commit and push
git add package.json pnpm-lock.yaml
git commit -m "Update dependencies"
git push origin main
```

### Manual Redeployment

To redeploy without code changes:

1. Go to **Actions** tab
2. Select "Deploy to GitHub Pages" workflow
3. Click "Run workflow"
4. Select branch (main)
5. Click "Run workflow" button

## Custom Domain Setup

If using a custom domain:

- [ ] Create `CNAME` file: `echo "yourdomain.com" > public/CNAME`
- [ ] Update workflow to remove `NEXT_PUBLIC_BASE_PATH`
- [ ] Configure DNS A records or CNAME record
- [ ] Set custom domain in GitHub Pages settings
- [ ] Enable "Enforce HTTPS" after DNS propagation
- [ ] Test at your custom domain

## Security

- [ ] HTTPS is enforced (automatic with GitHub Pages)
- [ ] No sensitive data in `data/radar.json`
- [ ] No API keys or secrets in code
- [ ] Content Security Policy headers (handled by GitHub Pages)

## Performance Optimization

Already configured:

- [x] Static site generation (SSG)
- [x] Image optimization disabled (required for static export)
- [x] CSS and JS minification
- [x] React 19 optimizations
- [x] Next.js 15 build optimizations

## Support Resources

- **Deployment Guide**: See `DEPLOYMENT.md`
- **Project Documentation**: See `README.md`
- **Architecture Guide**: See `.github/copilot-instructions.md`
- **GitHub Pages Docs**: https://docs.github.com/en/pages
- **Next.js Static Export**: https://nextjs.org/docs/app/building-your-application/deploying/static-exports

## Success Criteria

Your deployment is successful when:

- ✅ Workflow completes without errors
- ✅ Site is accessible at GitHub Pages URL
- ✅ All pages load correctly
- ✅ Radar chart displays and functions
- ✅ Filters and search work
- ✅ No console errors
- ✅ Assets load properly
- ✅ Site is responsive on mobile

---

**Note**: First deployment may take 5-10 minutes for DNS propagation. Subsequent deployments are faster (2-3 minutes).
