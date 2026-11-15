# Northisle Partners site: hosting notes (Nov 15, 2026, ET)

- Brand: Northisle Partners, renamed from Maple Bridge Solutions on Nov 15, 2026 because a Fredericton company already uses that name. "Northisle" hints at Canada (north) and the Philippines (isle).
- Intended live URL (canonical and Open Graph): https://northislepartners.netlify.app/
- Services page: https://northislepartners.netlify.app/services.html
- Until the Netlify site is renamed, the current host is still https://maplebridgesolutions.netlify.app/ (same deploy, new name on the pages).
- Repo (public, not renamed): https://github.com/bergelmmjhj-cpu/maple-bridge-solutions (GitHub account bergelmmjhj-cpu)
- Pushed with the GitHub connector (push_files); the box has no git credentials.
- Pages source: **gh-pages branch, root**. Netlify's free plan autodeploys from gh-pages with no build step.
  - IMPORTANT: the live site serves gh-pages. After editing main, update gh-pages too.
- og-image.png (social preview) is uploaded as base64 (og-image.png.b64) because the connector only sends text; the workflow .github/workflows/decode-og-image.yml decodes and commits it. The workflow runs on main and gh-pages when the .b64 file changes (or via workflow_dispatch).
- .nojekyll is present.
- Local files: /workspace/maple-bridge-site/ (index.html, services.html, styles.css, main.js, favicon.svg, og-image.png). Validated with html-validate@8 (0 errors); all internal links and anchors checked.
- Contact: mailto links + a mailto form (opens the visitor's email app; no form service, nothing stored). Inbox is still maplebridgeops@gmail.com until a new address is chosen.
