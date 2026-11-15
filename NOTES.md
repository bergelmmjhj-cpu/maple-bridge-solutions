# Northisle Partners site

- Brand: Northisle Partners. The name hints at Canada (north) and the Philippines (isle).
- Canonical URL: https://northislepartners.netlify.app/
- Services page: https://northislepartners.netlify.app/services.html
- Hosting: Netlify and GitHub Pages serve the `gh-pages` branch root, with no build step. `.nojekyll` is present.
- Social preview: `og-image.png`. A base64 copy is kept in `og-image.png.b64` for text-only uploads. `.github/workflows/decode-og-image.yml` decodes it when that file changes on `main` or `gh-pages`.
- Contact: northislepartners@gmail.com. The form opens a pre-filled message in the visitor's email app. Nothing is stored on this website.
