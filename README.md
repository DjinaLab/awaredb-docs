# awaredb-docs

Documentation site for **AwareDB** — a computational model graph.

Built with [Astro](https://astro.build) + [Starlight](https://starlight.astro.build),
deployed to Cloudflare Pages/Workers static assets at `docs.awaredb.io`.

## Develop

```bash
nvm use            # Node 22 (see .nvmrc)
npm install
npm run dev        # http://localhost:4321
```

## Build

```bash
npm run build      # static output → dist/
npm run preview    # serve the built site locally
```

## Deploy (Cloudflare)

Project settings on the Cloudflare dashboard:

- Build command: `npm run build`
- Build output directory: `dist`
- Environment variable: `NODE_VERSION = 22`

Manual deploy: `npx wrangler deploy` (config in `wrangler.toml`).

## Structure

- `src/content/docs/` — all pages (Markdown / MDX), grouped: Introduction, Outcomes,
  Get started, Examples, Reference.
- `astro.config.mjs` — site config + sidebar.
- `src/components/` — `SiteTitle.astro`, `Hero.astro` (brand lockup).
- `src/styles/custom.css` — theme (orange accent #d04b16, Rajdhani + IBM Plex Mono),
  matching the AwareDB app + marketing site. Fonts load via a Google Fonts `<link>`
  declared in `astro.config.mjs` (`head`), not self-hosted `@fontsource`.
- `public/logos/` — placeholder brand marks. See `~/Desktop/awaredb/handovers/logo.md`
  for the final-logo brief; swapping the SVGs is a drop-in replacement.
