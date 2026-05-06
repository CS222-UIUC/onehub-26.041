# OneHub

> Every UIUC club. One feed. Stay in the loop.

OneHub aggregates Instagram posts from every UIUC student organization into a single, filterable feed. Browse a chronological feed across all clubs, filter by club, category, or tag, drill into a per-club page, or click any post to jump back to the original Instagram URL.

Live: [onehub.vercel.app](https://onehub.vercel.app) · Final project for CS 222 (UIUC), Spring 2026.

---

## Introduction

UIUC has hundreds of registered student organizations. Most of them post on Instagram, and most of them post nowhere else. Following thirty accounts to keep up with campus is annoying, and the official `illinois.edu` RSO directory is a static list that goes out of date.

OneHub is not a new idea — similar UIUC club aggregators have existed before. Our differentiation is deliberately small surface area:

- One good feed, one filter bar, one club view.
- No login required to browse — speed of access over feature breadth.
- Posts link out to Instagram; we never re-host content.

Audience: UIUC students discovering clubs, and club officers checking reach.

---

## Technical Architecture

```
                         ┌──────────┐
                         │ Browser  │
                         └────┬─────┘
                              │ HTTPS
              ┌───────────────▼────────────────────┐
              │ Next.js 16 / React 19 (Vercel)     │
              │ App Router · Server Components     │
              │ Tailwind 4 · lucide-react          │
              └────┬───────────────────┬───────────┘
                   │ reads             │ calls
       ┌───────────▼──────┐    ┌───────▼────────────┐
       │ Supabase Postgres│    │ API Routes         │
       │ clubs · posts    │◄───│ /api/scrape        │
       │ GIN(tags), idx   │    │ /api/image-proxy   │
       └──────────────────┘    └───────┬────────────┘
                                       │ apify-client
                                ┌──────▼────────┐
                                │ Apify Actor   │
                                │ Instagram     │
                                └──────┬────────┘
                                       │
                                ┌──────▼────────┐
                                │ instagram.com │
                                │ + CDN         │
                                └───────────────┘
```

### Components

**Frontend** — _Owner: Eshaan_
- **Role:** public web app — `/`, `/feed`, `/clubs`, `/clubs/[handle]`. Renders posts, filters, navigation.
- **Interacts:** reads from Supabase via the SSR client at request time; loads images through `/api/image-proxy`; links out to `instagram.com` on click.
- **Libraries:** Next.js 16 (App Router), React 19, TypeScript, Tailwind 4, lucide-react. Components: `Navbar`, `FilterBar`, `ClubCard`, `PostCard`.

**Backend / API Routes** — _Owners: Anish (hosting), Krishay (scrape route)_
- **Role:** `/api/scrape` kicks off an Apify run for one club and writes posts to Supabase. `/api/image-proxy` fetches Instagram CDN images server-side and re-streams them to bypass hotlink protection.
- **Interacts:** calls Apify (`apify-client`); writes to Supabase with the service-role key. Hosted on Vercel as Node functions.
- **Libraries:** Next.js Route Handlers, `apify-client`, `@supabase/supabase-js`, Vercel runtime.

**Database** — _Owner: Anish_
- **Role:** source of truth for clubs and posts. Two tables — `clubs` (`name`, `handle`, `category`, `instagram_url`, …) and `posts` (`club_id`, `image_url`, `caption`, `likes`, `post_url`, `timestamp`, `tags[]`). Indexed on `club_id`, `timestamp DESC`, and a GIN index on `tags` for fast filtering. Schema in [`lib/schema.sql`](lib/schema.sql).
- **Interacts:** read by the Next.js frontend on every page render; written by `/api/scrape` and the seed script.
- **Libraries:** Supabase (managed Postgres), `@supabase/ssr` for server-side reads, `@supabase/supabase-js` on the server.

**Scraping Pipeline** — _Owner: Krishay_
- **Role:** pulls fresh posts from each club's Instagram, normalizes the payload, and inserts into the `posts` table. Two entry points — `/api/scrape` for one-off refreshes and `scripts/seed.ts` to bootstrap the clubs list and back-fill history.
- **Interacts:** calls Apify's Instagram actor through `apify-client`; writes results into Supabase; re-runnable for cron-driven refresh.
- **Libraries:** `apify-client`, `tsx`, `dotenv`, `@supabase/supabase-js`.

---

## Local Development

### Prerequisites

- Node.js 20+
- npm (or pnpm / yarn / bun)
- A Supabase project (free tier is fine)
- An Apify account + API token

### Setup

```bash
git clone https://github.com/CS222-UIUC/onehub-26.041.git
cd onehub-26.041
npm install
```

### Environment variables

Create a `.env.local` in the project root:

```bash
NEXT_PUBLIC_SUPABASE_URL=https://<your-project>.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=<your-anon-key>
SUPABASE_SERVICE_ROLE_KEY=<your-service-role-key>
APIFY_API_TOKEN=<your-apify-token>
```

> `SUPABASE_SERVICE_ROLE_KEY` bypasses Row Level Security — keep it server-only and never commit it.

### Database

Apply the schema in your Supabase project:

```bash
# In the Supabase SQL editor, run:
cat lib/schema.sql
```

### Seed data (optional)

```bash
npm run seed
```

### Run the dev server

```bash
npm run dev
# → http://localhost:3000
```

### Build for production

```bash
npm run build
npm run start
```

### Deploy

Push to `main`; Vercel auto-deploys via the linked project (`vercel.json`).

---

## Scripts

| Command | What it does |
|---|---|
| `npm run dev` | Next.js dev server with hot reload |
| `npm run build` | Production build |
| `npm run start` | Run the production build |
| `npm run lint` | ESLint |
| `npm run seed` | Run `scripts/seed.ts` to bootstrap clubs + backfill posts |

---

## Team & Roles

| Member | Responsibility |
|---|---|
| **Krishay Bugatha** | Apify scraper logic, data pipelines, parts of the backend |
| **Anish Vankadhara** | Backend, Supabase wiring, Vercel hosting |
| **Eshaan** | Frontend, components, UI polish |

---

## License

Course project for CS 222 at the University of Illinois Urbana-Champaign. Not for redistribution.
