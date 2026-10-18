# CLAUDE.md

Covers `.github/`.

### GitHub Pages (Current)

Configured via `.github/workflows/deploy.yml`:
- Triggers on push to `main` branch
- Uses Bun for fast dependency installation and builds
- Builds with `NEXT_PUBLIC_BASE_PATH=/radar` for GitHub Pages
- Deploys `out/` directory to GitHub Pages
