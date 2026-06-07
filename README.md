# The Miners Arms — Demo Website

A premium, animated demo website for **The Miners Arms**, a British grill house in
West Bromwich serving English breakfasts, Indian curries and Chinese/Vietnamese
small plates. Built as a client-ready concept by CROWNBOT.

> **Note:** All menu items and prices are taken **verbatim** from the live site
> (`miners-arms.com`). Imagery is curated free stock (Unsplash) standing in for the
> client's own photography. Forms are fully validated demos — they don't yet send.

---

## Tech Stack

- **Next.js 16** (App Router, Turbopack) + **React 19**
- **TypeScript** (strict)
- **Tailwind CSS** 3.4 — custom dark-luxury theme
- **Framer Motion** 11 — scroll reveals, parallax, 3D tilt, page transitions
- SEO: per-page metadata, Open Graph, `sitemap.xml`, `robots.txt`, Restaurant JSON-LD
- A11y: skip link, reduced-motion support, semantic landmarks, focus styles

## Architecture

```
src/
├── app/
│   ├── layout.tsx          Root layout, fonts, nav/footer, JSON-LD, skip link
│   ├── page.tsx            Home (hero → marquee → signatures → story → reviews → gallery → CTA)
│   ├── about/page.tsx      Story, values, decade timeline
│   ├── menu/page.tsx       Interactive menu explorer (café / pub + category filters)
│   ├── gallery/page.tsx    Masonry gallery + keyboard-navigable lightbox
│   ├── contact/page.tsx    Details, hours, map embed, enquiry form
│   ├── reservations/page.tsx  Booking form + perks
│   ├── sitemap.ts / robots.ts / not-found.tsx
│   └── globals.css         Theme tokens, component classes
├── components/             Hero, Navbar, Footer, Preloader, MenuExplorer, forms, etc.
└── data/                   site.ts · menu.ts · images.ts · testimonials.ts (single source of truth)
```

## Brand System

| Token | Use | Value |
|------|-----|-------|
| `ink-900` | Page base | `#0a0908` |
| `cream-50/100/200` | Text | warm off-whites |
| `saffron-400/500/600` | Primary accent (gold) | `#f0b860 → #c9842a` |
| `ember-400/500` | Secondary accent (chilli) | `#e0654a → #c1352b` |
| `jade-400/500` | Tertiary (the Chinese thread) | `#5fae93 → #2f7d63` |

**Type:** Playfair Display (display) · Inter (body) · Cormorant Garamond (quotes).

## Local Development

```bash
npm install
npm run dev      # http://localhost:3000
npm run build    # production build
npm start        # serve the production build
```

## Deploy to Vercel

This app lives inside a monorepo, so set the **Root Directory** when importing:

1. Push this folder to a Git repo (or import the monorepo).
2. In Vercel → **New Project** → import the repo.
3. Set **Root Directory** to `Clients Demo/the-miners-arms`.
4. Framework preset: **Next.js** (auto-detected). Build: `next build`. No env vars required.
5. Deploy.

`outputFileTracingRoot` and `turbopack.root` are pinned in `next.config.mjs` so
file tracing stays scoped to this folder despite the parent monorepo lockfile.

## Wiring up for production (next steps)

- **Forms** → connect `ReservationForm` / `ContactForm` submit handlers to an API
  route (e.g. Resend email) or a booking provider (OpenTable, ResDiary, Calendly).
- **Images** → swap Unsplash URLs in `src/data/images.ts` + `menu.ts` for the
  client's own photography.
- **Domain** → point `miners-arms.com` at the Vercel deployment.
