# Client preview

Public preview (no GitHub login):
https://vibeit-intel.github.io/marlet-equestrian-centre/

## If you see GitHub Pages “404”

The site files are on `main` (`index.html`, `assets/`, workflow `.github/workflows/pages.yml`). A **404** usually means hosting is not switched on yet for this repository.

**Repo owner — one-time setup (about 2 minutes):**

1. **Visibility** — Project sites at `vibeit-intel.github.io/…` need a **public** repository (unless your GitHub plan allows private Pages).
   - GitHub → **Settings** → **General** → **Danger zone** → **Change visibility** → **Public**
2. **Pages source** — **Settings** → **Pages** → **Build and deployment** → **Source:** **GitHub Actions**
3. **Deploy** — **Actions** → **Deploy GitHub Pages** → **Run workflow** on `main` (or push any commit to `main`).

After a green workflow run, the preview URL above should load within a few minutes.

When **www.marlet.co.za** is connected, point the domain at this site and update the canonical URL in `index.html` from the GitHub Pages address to `https://www.marlet.co.za/`.
