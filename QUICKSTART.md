# Quick Start Guide - GitHub Pages Deployment

This is the fastest way to get your Technology Radar deployed to GitHub Pages.

## ⚡ 5-Minute Setup

### Step 1: Enable GitHub Pages (1 minute)

1. Go to your repository: https://github.com/kjgarza/radar
2. Click **Settings** (top navigation)
3. Click **Pages** (left sidebar under "Code and automation")
4. Under "Build and deployment" section:
   - Set **Source** to: **GitHub Actions**
5. Done! No need to click Save, it auto-saves.

### Step 2: Push the Changes (2 minutes)

```bash
# Navigate to your project
cd /Users/kristiangarza/aves/radar-2025

# Review what will be committed
git status

# Add all new files and changes
git add .

# Commit with a descriptive message
git commit -m "Add GitHub Pages deployment configuration

- Add GitHub Actions workflow for automatic deployment
- Configure Next.js basePath for GitHub Pages
- Add .nojekyll file to prevent Jekyll processing
- Add comprehensive deployment documentation"

# Push to GitHub
git push origin main
```

### Step 3: Wait for Deployment (2 minutes)

1. Go to **Actions** tab in your GitHub repository
2. You'll see a workflow run called "Deploy to GitHub Pages"
3. Click on it to watch the progress
4. Wait for both jobs to complete:
   - ✅ build (1-2 minutes)
   - ✅ deploy (30 seconds)

### Step 4: Visit Your Site! (30 seconds)

Your site will be live at:
```
https://kjgarza.github.io/radar/
```

Open it in your browser and verify:
- ✅ Homepage loads with radar chart
- ✅ Navigation works
- ✅ Filters and search function
- ✅ No console errors

## 🎉 That's It!

Your Technology Radar is now live on GitHub Pages and will automatically redeploy every time you push to the main branch.

## 📝 Common Commands

### Update radar data and deploy:
```bash
# Edit data/radar.json
# Test locally
pnpm build

# Commit and push
git add data/radar.json
git commit -m "Update radar data"
git push origin main
# Automatically deploys!
```

### Force a rebuild without changes:
```bash
# Go to GitHub > Actions > Deploy to GitHub Pages > Run workflow
```

### Test locally before pushing:
```bash
# Build with the same configuration as GitHub Pages
NEXT_PUBLIC_BASE_PATH=/radar pnpm build

# Check the output
ls -la out/
```

## 🔧 Advanced Configuration

### Use a Custom Domain

1. Create CNAME file:
```bash
echo "radar.yourdomain.com" > public/CNAME
```

2. Edit `.github/workflows/deploy.yml` and remove these lines:
```yaml
env:
  NEXT_PUBLIC_BASE_PATH: /radar
```

3. Configure DNS:
   - Add CNAME record: `radar` → `kjgarza.github.io`

4. In GitHub Settings > Pages:
   - Enter custom domain: `radar.yourdomain.com`
   - Wait for DNS check
   - Enable "Enforce HTTPS"

### Deploy to a Different Repository

If you rename your repository or fork it:

1. Update `.github/workflows/deploy.yml`:
```yaml
env:
  NEXT_PUBLIC_BASE_PATH: /new-repo-name
```

2. Push and deploy

## 🐛 Troubleshooting

### Build Fails

**Error:** Zod validation failed
- **Fix:** Check `data/radar.json` for schema errors
- **Test:** Run `pnpm build` locally to see detailed errors

**Error:** pnpm install failed  
- **Fix:** Delete `node_modules` and `pnpm-lock.yaml`, run `pnpm install`

### Site Shows 404

**Problem:** Wrong base path
- **Fix:** Verify `NEXT_PUBLIC_BASE_PATH` matches repository name
- **Check:** View page source, look at asset URLs

**Problem:** GitHub Pages not enabled
- **Fix:** Go to Settings > Pages, set Source to "GitHub Actions"

### Assets Not Loading

**Problem:** Missing `.nojekyll` file
- **Fix:** Already created at `public/.nojekyll`
- **Verify:** Check it exists in the `out/` directory after build

## 📚 Full Documentation

For complete details, see:

- **DEPLOYMENT.md** - Comprehensive deployment guide with troubleshooting
- **DEPLOYMENT_CHECKLIST.md** - Detailed step-by-step checklist
- **GITHUB_PAGES_SETUP.md** - Technical summary of what was configured
- **README.md** - Full project documentation

## 💡 Tips

1. **Always test locally first:**
   ```bash
   pnpm build
   ```

2. **Watch the Actions tab** for deployment status

3. **First deployment takes longer** (5-10 minutes for DNS)

4. **Subsequent deployments are fast** (2-3 minutes)

5. **Manual redeploy anytime** via Actions > Run workflow

## 🔐 Security Note

- No secrets or API keys are needed (fully static site)
- Workflow has minimal permissions (read code, write pages)
- HTTPS is automatically enforced by GitHub Pages
- All data validation happens at build time

## ✅ Success Checklist

- [ ] GitHub Pages enabled in Settings
- [ ] Changes committed and pushed to main
- [ ] Workflow completed successfully (green checkmark)
- [ ] Site accessible at `https://kjgarza.github.io/radar/`
- [ ] Radar chart displays correctly
- [ ] All features working (filters, search, navigation)

---

**Need Help?** Check the troubleshooting section in DEPLOYMENT.md or the GitHub Actions logs for detailed error messages.
