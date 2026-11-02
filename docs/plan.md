# Portfolio Build Plan — Vigneshwar B

## Context
Build a premium, production-ready personal portfolio (spec: `prompt.md`) to share on LinkedIn/GitHub/resume, positioning Vigneshwar as a Software / Backend / AI engineer (not only networking).

## Tech stack decision
| Option | Pros | Cons |
|---|---|---|
| **Next.js 15 + TS (chosen)** | SSR/SSG for SEO & OG previews, Route Handlers keep secrets server-side, MDX blog, Vercel-native, spec asks for it | Heavier than Astro, more framework surface |
| Astro + React islands | Smallest JS, great MDX | Interactive pieces become islands; page transitions harder |
| Vite React SPA | Simplest dev model | Poor SEO, separate backend for contact |

- **Email:** Resend (one API key, free tier) — chosen over Nodemailer/SMTP and Formspree.
- **Newsletter / Supabase:** skipped for v1; code structured so it can be added later.

## Architecture
- Next.js 15 App Router, TypeScript, Tailwind CSS v4, Framer Motion, Lucide icons, `next-themes` (dark-first + light), Geist + Instrument Serif fonts.
- **Content as data:** `content/*.ts` (profile, experience, skills, projects, lab, achievements) — every unknown value is a clearly marked placeholder (`[MY_EMAIL]`, etc.).
- **Blog:** one MDX file per post in `content/blog/` with frontmatter (title, date, category, summary, draft). Reading time computed automatically. Sample posts clearly labelled drafts.

## Pages / sections
- **Home:** Hero (animated network-graph canvas, photo slot `/public/images/profile.jpg`, CTAs, socials) → About (interactive terminal) → Experience timeline → Skills (Professional / Hands-on / Exploring) with skill↔project constellation → Projects → Achievements → Engineering Lab (status badges) → Contact.
- **`/projects/[slug]`:** case study (problem, solution, architecture SVG diagram, tech, decisions, trade-offs, outcomes, GitHub placeholder).
- **`/blog`, `/blog/[slug]`.**
- Custom 404, loading & error states.

## Contact form
Zod validation on server, honeypot field, per-IP rate limit, sent via Resend using server-only `RESEND_API_KEY`; clear message if not configured.

## SEO & polish
Metadata, OG images, sitemap, robots.txt, Person JSON-LD, canonical URLs, favicon, accessibility pass, responsive checks.

## Deliverables
README (local dev, env vars, Vercel deploy, GitHub setup) + placeholder checklist.

## Verification
`npm run build` passes; run dev server and check every route, link and button at mobile/tablet/desktop widths.

---

## Feature: Like button (planned — not built yet)

**Goal:** a heart button in the **top-right of the navbar** (after the theme toggle). A visitor clicks it once and sees the total like count go up. The count is shared by everyone and stays correct even when many people click at the same moment.

### Database: Redis (via Upstash) — compatible with Vercel
- Vercel's own "Vercel KV" product was shut down in Dec 2024 and moved to **Upstash Redis**, added from the **Vercel Marketplace** (Storage → Upstash → Redis). One click creates the database and puts its URL and token into the project's environment variables for Production, Preview and Development.
- Use the **`@upstash/redis`** SDK. It talks to Redis over **HTTP/REST**, which suits Vercel's serverless functions: each function can stop and start at any time, so there are no long-lived connections or connection pools to run out. Plain Redis clients (`ioredis`, `node-redis`) keep a TCP connection open and can leak or run out of connections on serverless.
- Free tier (about 500K commands per month, 256 MB) is far more than a portfolio needs. A single key holds the count.
- Why not Postgres/Supabase: it would be too heavy for one number. Why not Edge Config: it is read-mostly and too slow to write to.

### Concurrency
- Redis runs commands one at a time, and **`INCR` is atomic**, so 1,000 simultaneous clicks give exactly +1,000 with no lost updates. No read-then-write logic and no locks are needed.
- Duplicate likes are blocked atomically too: `SET like:v:<visitorHash> 1 NX EX 31536000` succeeds only once per visitor, and only then do we `INCR`. Both steps go in one round trip, either a `MULTI` transaction or a small Lua script, so they can't get out of step:
  ```lua
  -- KEYS[1]=like:v:<hash>  KEYS[2]=likes:site
  if redis.call('SET', KEYS[1], 1, 'NX', 'EX', 31536000) then
    return {1, redis.call('INCR', KEYS[2])}
  end
  return {0, tonumber(redis.call('GET', KEYS[2]) or '0')}
  ```

### Data model
| Key | Type | Purpose |
| --- | --- | --- |
| `likes:site` | string (integer) | total count |
| `like:v:<sha256(ip + ua + salt)>` | string, 1-year expiry | "this visitor already liked" — no raw IP is stored |

### API — `src/app/api/likes/route.ts` (Node runtime, `dynamic = "force-dynamic"`)
- `GET /api/likes` → `{ count, liked }`. Read with `Cache-Control: s-maxage=10, stale-while-revalidate=60` so heavy traffic doesn't hit Redis on every page view. (`liked` is read from a cookie, so it isn't cached per visitor.)
- `POST /api/likes` → runs the script → `{ count, liked: true }`. Requests without a same-origin `Origin` header are rejected.
- **Rate limit** with `@upstash/ratelimit` (e.g. 5 requests per minute per IP, sliding window) → returns 429 when exceeded.
- Visitor ID = SHA-256 of `x-forwarded-for` IP + user-agent + `LIKE_SALT` (a secret environment variable). A `liked=1` cookie is also set (httpOnly, 1 year).
- Unlike is not supported (simpler and harder to game). It can be added later with `DEL` + `DECR` in the same kind of script.

### UI — `src/components/ui/LikeButton.tsx` (client)
- Placed in `Navbar.tsx` after the theme toggle, the same size and border style as the other icon buttons, using theme tokens (`text-muted` → filled heart in `text-[var(--red)]` once liked). The count is shown next to it in `font-mono text-xs`, and shortened (1.2k) past 999.
- Shows the count right away from GET. A click adds 1 and fills the heart instantly; POST then sets the real number and undoes the change on failure or 429. The button is disabled while the request is in flight.
- A small "pop" animation on click (Framer Motion); it respects `prefers-reduced-motion`. Optional sound via `sfx.ts`, silent when `ambient-muted` is set.
- Liked state is also saved in `localStorage` (inside try/catch) so the heart stays filled on reload before GET returns.
- Phone width: count hidden below `sm` if the navbar is tight; the heart stays visible. `aria-pressed` and `aria-label="Like this site (N likes)"`.

### Files / env
- New: `src/app/api/likes/route.ts`, `src/lib/redis.ts` (one shared client via `Redis.fromEnv()`), `src/components/ui/LikeButton.tsx`.
- Edit: `Navbar.tsx`. Dependencies: `@upstash/redis`, `@upstash/ratelimit`.
- Environment: `KV_REST_API_URL`, `KV_REST_API_TOKEN` (added by the Marketplace integration; `Redis.fromEnv()` reads them), `LIKE_SALT`. For local development: `vercel env pull .env.local`.

### Verification
- `npm run build`; check GET/POST locally with curl.
- Concurrency test: `seq 200 | xargs -P50 -I{} curl -s -XPOST -H "x-forwarded-for: 10.0.0.{}" …/api/likes`. The count must go up by exactly the number of unique visitors, and repeating a visitor must not change it.
- Playwright: dark and light themes, phone width, and the heart staying filled after reload.
