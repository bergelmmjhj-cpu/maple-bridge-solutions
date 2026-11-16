# Northisle Partners site

- Brand: Northisle Partners. The name hints at Canada (north) and the Philippines (isle). The business was first called Maple Bridge Solutions, which is why the repo keeps that name.
- Canonical URL: https://northislepartners.org/ (custom domain set by `CNAME`)
- Services page: https://northislepartners.org/services.html
- Hosting: GitHub Pages (northislepartners.org) and Netlify (northislepartners.netlify.app) both serve the `gh-pages` branch root, with no build step. `.nojekyll` is present. Pushing to `gh-pages` publishes both.
- SEO files: `robots.txt`, `sitemap.xml` (add new pages here) and `404.html` (uses root-relative paths so it works at any URL).
- Social preview: `og-image.png`. A base64 copy is kept in `og-image.png.b64` for text-only uploads. `.github/workflows/decode-og-image.yml` decodes it when that file changes on `main` or `gh-pages`.
- Booking: every "Book a discovery call" button links to https://cal.com/northislepartners/discovery-call (30 min).
- Contact: hello@northislepartners.org. No phone on the site until there is a business number. The homepage form posts to FormSubmit. The owner activates that address from FormSubmit's confirmation email. After that, submissions redirect to /thank-you (also /thank-you.html). The thank-you page is noindex and is intentionally left out of sitemap.xml. Nothing is stored on this website.
