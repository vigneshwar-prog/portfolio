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
