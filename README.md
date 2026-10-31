# Vigneshwar B — Portfolio

Personal portfolio built with **Next.js 15 (App Router)**, **TypeScript**, **Tailwind CSS v4**, **Framer Motion** and **MDX**.

- Dark-first design with a light theme toggle
- Hero with animated network background, terminal-style About, animated experience timeline
- Skills grouped by depth (professional / hands-on / exploring) + interactive technology constellation
- Project case-study pages with architecture diagrams (`/projects/[slug]`)
- Engineering Lab with filterable status cards
- MDX blog (`/blog`) — add a post by dropping in a file
- Contact form with server-side validation, honeypot, timing check, rate limiting and email via Resend
- SEO: metadata, Open Graph/Twitter images, sitemap, robots.txt, JSON-LD, canonical URLs, custom 404

## Local development

```bash
npm install
cp .env.example .env.local   # fill in values
npm run dev                  # http://localhost:3000
npm run build && npm start   # production check
```

Requires Node.js 18.18+ (20+ recommended).

## Environment variables

| Variable | Required | Purpose |
| --- | --- | --- |
| `NEXT_PUBLIC_SITE_URL` | Yes (prod) | Canonical URL, sitemap and OG links, e.g. `https://vigneshwar.dev` |
| `RESEND_API_KEY` | For contact form | Server-only Resend API key |
| `CONTACT_TO_EMAIL` | For contact form | Inbox that receives messages |
| `CONTACT_FROM_EMAIL` | Optional | Verified sender, e.g. `Portfolio <hello@yourdomain.com>`. Defaults to Resend's test sender |

Secrets are only read in `src/app/api/contact/route.ts` (server). Nothing is exposed to the browser. Without `RESEND_API_KEY`, the form shows a friendly "not configured" message.

## Editing content

All content lives in `src/content/` — no component changes required:

| File | What it controls |
| --- | --- |
| `profile.ts` | Name, headline, links, email, resume, about text |
| `experience.ts` | Timeline roles |
| `skills.ts` | Skill groups and levels |
| `projects.ts` | Project cards + case-study pages |
| `lab.ts` | Engineering Lab entries |
| `achievements.ts` | Awards and certifications |
| `blog/*.mdx` | Blog posts |

### Adding a blog post

Create `src/content/blog/my-post.mdx`:

```mdx
---
title: "My post"
summary: "One-line summary."
date: "2026-11-01"
category: "Backend"
draft: false
---

Content in Markdown/MDX…
```

Reading time is computed automatically. `draft: true` shows a "Sample draft" badge, adds `noindex`, and omits the post from the sitemap.

### Images and resume

- Portrait: `public/images/profile.jpg` (4:5 ratio, ≥ 800px wide). Until it exists a styled monogram is shown.
- Resume: `public/resume.pdf`. Until it exists the download buttons are shown disabled.
- Company logos (optional): put files in `public/logos/` and set `logo: "/logos/cisco.svg"` in `experience.ts`.

## Deploying to Vercel

1. Push to GitHub (below).
2. On [vercel.com](https://vercel.com) → **Add New → Project** → import the repo. Framework is detected automatically.
3. Add the environment variables above under **Settings → Environment Variables**.
4. Deploy. Add a custom domain under **Settings → Domains** and set `NEXT_PUBLIC_SITE_URL` to it, then redeploy.

### Resend setup

1. Create an account at [resend.com](https://resend.com) and an API key.
2. To send from your own address, verify your domain under **Domains** and set `CONTACT_FROM_EMAIL`.
   Without a verified domain, Resend's test sender only delivers to your own account email.

## GitHub setup

```bash
git init
git add .
git commit -m "Initial portfolio"
git branch -M main
git remote add origin https://github.com/<your-username>/portfolio.git
git push -u origin main
```

## Notes

- The contact rate limiter is in-memory (per server instance). For stricter limits at scale, swap in Upstash Redis.
- A newsletter was intentionally left out of v1. To add one later, create `src/app/api/subscribe/route.ts` backed by Supabase or Resend Audiences.

See **PLACEHOLDERS.md** for everything to replace before publishing.
