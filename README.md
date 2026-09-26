# OpenGeni landing v1

Static site, no build step.

```
index.html      markup
styles.css      all styling (CSS variables at the top)
script.js       pill nav, eased scrolling, copy-to-clipboard
assets/
  favicon.svg           theme-aware: black mark in light mode, white in dark (prefers-color-scheme)
  favicon.ico           Safari / legacy fallback: white mark on an ink tile, 16 + 32 px
  apple-touch-icon.png  iOS home-screen icon, 180 px
  fonts/                DM Sans, IBM Plex Mono (self-hosted)
```

DM Serif Display (hero italic) loads from Google Fonts; swap the `<link>` in `index.html` for a local `@font-face` if you want zero external requests.

## Run locally

Open `index.html` directly, or serve the folder:

```
npx serve .
```

## Deploy

Any static host (GitHub Pages, Netlify, Vercel, S3). For GitHub Pages: push to `main`, then Settings → Pages → Deploy from branch → `main` / root.
