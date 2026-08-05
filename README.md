# Rihan's Live Age Calculator

This repository contains a small static web app that calculates your exact age live (years, months, days, hours, minutes, seconds). It is mobile-friendly, accessible, and PWA-capable.

## Files
- index.html
- styles.css
- script.js
- manifest.json
- sw.js (service worker)
- sitemap.xml
- robots.txt

## Local testing
1. Clone the repo.
2. Open `index.html` in a browser, or run a static server:

```bash
python -m http.server 8000
# then open http://localhost:8000
```

## Deploy (GitHub Pages)
1. Push to the `main` branch.
2. Go to Repository → Settings → Pages → select Branch `main` and folder `/ (root)` → Save.
3. Your site will be available at `https://<username>.github.io/<repo>/`.

## Notes
- Replace `https://example.com/` in `sitemap.xml`, `index.html` (JSON-LD) and `robots.txt` with your real site URL once you choose a domain or GitHub Pages URL.
- To speed up Google indexing, add the site to Google Search Console and submit the sitemap.

Enjoy — Rihan!