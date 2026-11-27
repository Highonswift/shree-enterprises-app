# Shree Enterprises website

Next.js (App Router), TypeScript, Tailwind CSS and Lucide.

## Run locally

Requires Node 22.18 or newer.

```bash
npm install
npm run dev        # http://localhost:3000
npm run typecheck
npm run build
```

Without Storyblok tokens, the site shows `src/lib/content/site.json`, which was extracted from the original published page. A Vercel production deployment refuses to build this way.

## Theme

All colours, fonts, radii and shadows are in the `@theme` block of `src/app/globals.css`. The rest of that file is the original site's CSS.

- Tailwind Preflight is intentionally not imported, because its reset would change the original layout.
- `PRIMARY` and `ACCENT` in `src/app/layout.tsx` (favicon and browser toolbar) must match the theme.

## Storyblok setup

1. Create a space. Copy `.env.example` to `.env.local` and fill it in. Never commit it. None of the values may start with `NEXT_PUBLIC_`.
2. Preview what the setup will do. This sends nothing:
   ```bash
   npm run storyblok:setup
   ```
3. Apply it. This creates the components, uploads the available images and creates the page `site` as an **unpublished draft**:
   ```bash
   npm run storyblok:setup -- --apply
   ```
   An existing page is never changed. Same-named components are left alone unless you add `--update-components`. Afterwards, remove `STORYBLOK_MANAGEMENT_TOKEN` and revoke it if it is no longer needed.
4. Review the page in Storyblok, then publish it. A production build fails until it has been published.

### Visual Editor

In Storyblok, set the preview URL to `https://<your-site>/api/draft?path=`. Storyblok adds a signed, time-limited token; other requests to this address are refused. To leave preview mode, open `/api/draft?disable=1`.

- The preview needs HTTPS. Locally, run `npx next dev --experimental-https` and use `https://localhost:3000/api/draft?path=`.
- Preview uses a cookie inside Storyblok's frame, so a browser that blocks third-party cookies will show published content instead.
- Only the site itself and `app.storyblok.com` can show the site in a frame (`next.config.ts`).

### Publish webhook

In Storyblok, add a webhook for story published, unpublished, moved and deleted:

- **Paid plans:** URL `https://<your-site>/api/revalidate`, with the webhook secret set to `STORYBLOK_WEBHOOK_SECRET`.
- **Free plan (no webhook secrets):** URL `https://<your-site>/api/revalidate?secret=<STORYBLOK_WEBHOOK_SECRET>`. URLs can appear in server logs, so use a secret that is used nowhere else.

Without a webhook, published changes appear within about an hour, on a later visit.

## Editing content

- Everything is on one page, `site`. Each website section is one block, in a fixed order.
- To hide a section, switch on **Hide this section**.
- Banners, cards, models, stages, products, clients and footer links can be added, deleted and reordered.
- Simple lists, such as the scrolling strip, phone numbers and product items, use one line per entry.
- Blank wording under **Enquiry form wording** and **Buttons & labels** falls back to the original wording. Other blank fields stay blank.

The content model is defined in `src/lib/storyblok/components.ts`.

## Enquiry form

The form only prepares text for the visitor to copy or open in their mail app. Nothing is submitted to a server. The only server routes are `/api/draft` and `/api/revalidate`.

## Missing source material

- **Images:** `automated-stp.jpg`, `desal.jpg`, `uf-ro-plc.jpg`, `frp-etp.jpg`, `frp-stp.jpg`, `frp-wtp.jpg`, `uf-skid.jpg`, `ro-skid.jpg`. Add them to `public/images/` before running the setup, or upload them in Storyblok afterwards.
- **Capability cards** for five of the six tabs.
- **Product item names** for nine of the ten categories. The temporary item count keeps the original number on each card; clear it as names are added.
- **Model and client categories.** Until they are added, every filter except "All" is empty.
- **Hero typing examples.** There is one EPC example and no Water examples.
