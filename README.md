# Shree Enterprises website

Next.js (App Router), TypeScript, Tailwind CSS and Lucide.

## Run locally

Requires Node 20.9 or newer.

```bash
npm install
npm run dev        # http://localhost:3000
npm run typecheck
npm run build
```

## Theme

All colours, fonts, radii and shadows are in the `@theme` block of `src/app/globals.css`. The rest of that file is the original site's CSS.

- Tailwind Preflight is intentionally not imported, because its reset would change the original layout.
- `themeColor` in `src/app/layout.tsx` must match `--color-primary`.

## Content

Until Storyblok is connected, all website text comes from `src/lib/content/site.json`, extracted from the original published page.

The enquiry form only prepares text for the visitor to copy or open in their mail app. Nothing is submitted to a server.

## Status

The website is migrated. Storyblok is not yet connected, and the following source material is still missing.

- **Images**, to be added to `public/images/` with these names: `automated-stp.jpg`, `desal.jpg`, `uf-ro-plc.jpg`, `frp-etp.jpg`, `frp-stp.jpg`, `frp-wtp.jpg`, `uf-skid.jpg`, `ro-skid.jpg`.
- **Capability cards** for five of the six tabs (`capabilities.groups`). Those tabs are currently empty.
- **Product item names** for nine of the ten categories. `missingItemCount` keeps the original card count until they are added.
- **Model and client categories.** Until they are added, the filter buttons show, but every filter except "All" is empty.
- **Hero typing examples.** There is one EPC example and no Water examples.
