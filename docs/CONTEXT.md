# Portfolio — Project Context

> The single source of truth for this project: what was built, why, and every decision made.
> Paste or load this file to rebuild or continue the site in a new session.
> **Keep this file in sync** — see the rules in `CLAUDE.md`. Last updated: 2026-11-02.

---

## 1. Overview

| Item | Value |
| --- | --- |
| Owner | Vigneshwar B — Software Engineer @ Cisco, Bangalore |
| Live site | https://vigneshwarb.in (also www.vigneshwarb.in) |
| Repo | https://github.com/vigneshwar-prog/portfolio (public, branch `main`) |
| Local path | `/Users/vigneshwar/Documents/AI/portfolio` |
| Hosting | Vercel — every push to `main` deploys automatically |
| Domain registrar | GoDaddy (DNS: `A @ → 216.198.79.1`, `CNAME www → Vercel`) |
| Original brief | `docs/prompt.md` (the original request); `docs/plan.md` (the build plan) |

Goal: a fast, premium developer portfolio with a dark developer/terminal look, honest content taken from the resume, an MDX blog, and good SEO.

---

## 2. Tech stack & decisions

| Choice | Decision / reason |
| --- | --- |
| Framework | **Next.js 15.5 App Router + TypeScript**, React 19. Pages are generated statically. |
| Styling | **Tailwind CSS v4** — colours are CSS variables mapped through `@theme inline` in `globals.css`. |
| Animation | **Framer Motion** — 3D flip card, width transitions, reveals. |
| Theme | `next-themes` with the `class` attribute; dark by default, light theme supported. |
| Icons | `lucide-react` (`components/ui/Icon.tsx` maps names to icons). |
| Blog | MDX from `src/content/blog/*.mdx` via `next-mdx-remote/rsc` + `gray-matter` + `reading-time` + `remark-gfm` (tables). |
| Email | Resend was used at first, then **removed** along with the contact form (the free sender only delivers to the account owner's address). The contact section now uses `mailto:` plus copy buttons. Zod was removed too. |
| Database | None (Supabase was skipped). |
| Newsletter | None (by choice). |
| Docker | Not needed — Vercel builds the site directly. |
| Content | All copy lives in typed data files under `src/content/*.ts`. Components contain no hard-coded personal data. |

Dependencies: clsx, framer-motion, gray-matter, lucide-react, next 15.5.28, next-mdx-remote, next-themes, react/react-dom 19.1.0, reading-time, remark-gfm. Dev: tailwindcss v4, @tailwindcss/postcss, eslint, typescript.
`package.json` includes `"allowScripts": {"unrs-resolver@1.12.2": true}` (needed for the install script).

Environment variable: `NEXT_PUBLIC_SITE_URL=https://vigneshwarb.in` (set in Vercel; locally it falls back to `http://localhost:3000`). There are no other secrets. The old `.env.vercel` file was deleted.

---

## 3. File map

```text
CLAUDE.md, README.md    root (must stay in the root)
docs/                   CONTEXT.md (this file), plan.md, prompt.md, PLACEHOLDERS.md
src/app/
  layout.tsx            root: fonts, ThemeProvider, NetworkBackground (fixed, whole site), Navbar, Footer, metadata, JSON-LD
                        title default: `${profile.name} — Software Engineer · Backend · AI`  (title starts with "Vigneshwar B")
  page.tsx              home: Hero(about) → Experience → Skills → Projects → Achievements → Contact
  globals.css           colour tokens, animations (cup-shine, term-blink), terminal focus fix
  blog/page.tsx         blog index (hides draft posts)
  blog/[slug]/page.tsx  MDX post, generateStaticParams
  projects/[slug]/page.tsx  project case-study page (FlowDiagram uses the wide layout)
  sitemap.ts, robots.ts, opengraph-image.tsx, twitter-image.tsx, icon.svg, error/loading/not-found.tsx
src/components/
  layout/Navbar.tsx     window-dots logo "~/vigneshwar.b", numbered lowercase links, active section highlighted while scrolling,
                        bg-bg/90 backdrop-blur-xl, AmbientAudio button + theme toggle
  layout/Footer.tsx     "© {year} Vigneshwar B" only ("Built with Next.js" was removed)
  sections/Hero.tsx     Hero and About merged into one section (id="about"), see §5
  sections/Terminal.tsx interactive terminal + notes, see §6
  sections/Experience.tsx, Skills.tsx, Projects.tsx
  sections/Achievements.tsx  gold medal by the "Awards" title; 4 cards with shining badges
  sections/Contact.tsx  email + phone cards with copy buttons; buttons: Send email, LinkedIn, GitHub, Resume;
                        heading "Let's build something together."
  diagrams/FlowDiagram.tsx  HTML boxes (16px labels), one row on desktop (lg), stacked on smaller screens
  ui/AmbientAudio.tsx   generated ambient pad music (Web Audio), see §7
  ui/NetworkBackground.tsx  animated network canvas behind every page
  ui/ButtonLink.tsx, Icon.tsx, Section.tsx
src/content/
  profile.ts, experience.ts, skills.ts, projects.ts, achievements.ts, blog/*.mdx
src/lib/
  blog.ts (reads MDX + front matter), sfx.ts (terminal sounds), utils.ts
public/
  images/profile.jpg (portrait), resume.pdf, logos/ (empty — company initials shown instead)
```

Removed during the session: `app/api/contact` route, Resend, Zod, `Lab.tsx`, `content/lab.ts`, `About.tsx`, `.env.vercel`.

---

## 4. Content (from the resume — never invent facts)

**Profile:** Vigneshwar B · Software Engineer @ Cisco · Bangalore · 4+ years
- Tagline: "Software Engineer · Backend · AI & Automation · Distributed Systems"
- Headline: "Building intelligent systems." / "Engineering scalable solutions."
- Email `vigneshwar.work.ai@gmail.com` · phone `+91 99444 31817`
- LinkedIn `linkedin.com/in/vigneshwar-prog/` · GitHub `github.com/vigneshwar-prog`
- Education: B.Tech IT, Sri Sairam Engineering College, 2018–2022, CGPA 8.88/10
- YouTube: InfiTamil (https://www.youtube.com/@InFiTamil)
- Nav order: About, Experience, Projects, Blog, Contact.

**Experience:**
- Cisco — Software Engineer, Aug 2022–Present: hybrid RAG (LangChain, Chroma, RRF, LLM routing, LLM-as-judge); OAuth-secured MCP server for Webex; containerised Django + FastAPI device-management platform (80% less manual effort); AI workflow for end-to-end testing (60%+ less manual effort).
- Cisco — Project Intern, Jan–Aug 2022: Django dashboards, Webex chatbot reporting NSVT metrics.
- Zoho — SDE Intern, Oct–Dec 2021: Tomcat, JavaScript, jQuery, Ember.js.
- Virtusa — SE Intern, Jun–Sep 2021: stock management app, Google Authenticator 2FA, won the internal hackathon (Java, Spring Boot, React).
- PARO IT Pty Ltd — Web Dev Intern, Mar–May 2021: WordPress e-commerce.

**Skills:** grouped and labelled by level (professional / hands-on / exploring). Python is the primary language; Java is only basic — never overclaim it.

**Projects** (each has a case-study page `/projects/[slug]`): `employee-rag-assistant`, `network-device-management`, `webex-mcp-integration`, `pcap-validation-automation`. Repository links are still `[GITHUB_REPO_URL]` placeholders and show as "Repository coming soon".

**Awards:** Automation Genie (Cisco, ×3), Rising Star (Cisco), Hackathon Winner (Virtusa), Content Creator (YouTube InfiTamil, with a "Visit channel" link).

**Blog** (all `draft: false`, published 2026-11-02, expanded in depth):
1. `understanding-rag-architecture.mdx` (AI) — an 8-stage pipeline: ingest, card-based chunking, embedding vs metadata fields, Chroma indexing that can be re-run safely (code), routing/decomposition, hybrid retrieval, RRF, grounded generation and guardrails, LLM-as-judge plus recall@k evaluation.
2. `why-hybrid-retrieval-matters.mdx` (AI) — why dense and sparse search each fail, a comparison table, dense + BM25 + regex ID code, filtering before vs after ranking with a fallback, how RRF works with worked numbers, questions with more than one intent.
3. `redis-and-celery-explained.mdx` (Backend) — the device-management platform: why SSH work stays out of the request, data-flow diagram, a Celery task with late acks / prefetch 1 / time limits / backoff, idempotency with Redis `SET NX`, group/chord fan-out, queue routing, per-device locks, progress via `update_state`, Flower, handling secrets.
   ⚠️ Some details (Netmiko, Flower, queue names, BM25 library, websocket, "What changed in practice") are a typical implementation, not confirmed by the owner. The owner should check them against the real projects.

---

## 5. Hero (home, `id="about"`)

- Two columns: `lg:grid-cols-[minmax(0,1fr)_560px]` — the column width is fixed so the text never moves. Mobile uses `grid-cols-[minmax(0,1fr)]` (fixes the open terminal squeezing the text).
- Left column: name + "try me ›_" button (green when closed → red "close ›_" when open), tagline, headline, intro, buttons.
- Right column: a 3D flip card (Framer Motion `rotateY`, preserve-3d, backface-visibility) that switches between the **portrait** (340px) and the **terminal** (560px). `toggle()` plays the sounds from `lib/sfx.ts`.
- Below: stat cards with `ShineIcon` (Experience/Briefcase, Organisations/Building2, Award/Trophy) and an Education card.

## 6. Terminal (`sections/Terminal.tsx`)

- Commands: `help, whoami, about, ls, skills, projects, education, contact, notes, download, clear, goto <section-id>`. Arrow keys ↑/↓ step through history. Unknown → "command not found".
- `whoami` uses `profile.intro`; `ls` lists project slugs followed by `/`.
- No auto-typing; the input is focused automatically ~50ms after opening.
- Blinking block cursor (`.term-cursor`, `term-blink` animation): the real input is transparent and a mirrored span draws the text plus cursor.
- Bottom bar: terminal/notes tabs, quick-command buttons (whoami, projects, skills), download button → `terminal.txt` or `notes.txt`.
- The red window dot closes the terminal when `onClose` is provided.
- CSS: the focus outline is removed for `#term-input` and `#term-notes` (overrides the site-wide `:focus-visible`).

## 7. Audio

- `AmbientAudio.tsx`: soft ambient music generated with the Web Audio API, playing by default. It starts on the first **real gesture** (pointerdown/click/keydown/touchend) and keeps listening until the audio is actually running, because browsers don't count scrolling as permission to play sound. Mute is saved in localStorage `ambient-muted`.
- `sfx.ts`: `playTerminalOpen` / `playTerminalClose`, silent when muted.

## 8. Theme / colours (`globals.css`)

- Tokens in `:root` (light) and `.dark`, mapped through `@theme inline` → Tailwind classes (`text-green`, `bg-bg`, `border-line`, …).
- Light theme was darkened for contrast: fg `#07080a`, muted `#3f444c`, green `#047a4a`, cyan `#0e6f8c`, violet `#5534c4`, amber `#b45309`, red `#c81e1e`.
- The `--amber` and `--red` tokens replaced Tailwind's `amber-400` and `red-500`.
- Animations: `cup-shine` (shine sweep across award badges) and `term-blink`.

## 9. SEO

- Metadata + OG/Twitter images generated with `ImageResponse`, JSON-LD describing the person in the layout, `sitemap.ts` (includes posts that are not drafts and project pages), `robots.ts`.
- To do (owner): Google Search Console — verify the site, submit `/sitemap.xml`, request indexing for the posts; Bing Webmaster Tools; add the site URL to LinkedIn/GitHub/YouTube.

## 10. Resume

- Skill `resume-builder` (`~/.claude/skills/resume-builder`). The name in the resume links to https://vigneshwarb.in/.
- Output: `~/Downloads/flat/Resume_Portfolio_Link_2026-11-01/Vigneshwar_B_Resume.pdf`. `public/resume.pdf` is what the site serves.

## 11. Workflow / commands

```bash
npm run dev                 # localhost:3000
npm run build && npx next start -p 3123   # production check
git add -A && git commit -m "..." && git push   # deploys to Vercel
```
- Visual checks: Playwright with system Chrome (`channel: 'chrome'`), scripts in `/tmp/pfshot`.
- Check the live site: `curl -s https://vigneshwarb.in | grep -o "<title>[^<]*"`; `curl -s https://vigneshwarb.in/sitemap.xml`.

## 12. Issues hit & fixes

| Problem | Fix |
| --- | --- |
| Contact email failed (Resend test sender only delivers to the owner) | Removed the form; use mailto + copy buttons |
| Domain showed a 404 after the DNS change | The Mac had cached the old GoDaddy IP → flush the DNS cache |
| Music didn't start on first click | Scrolling counted as the first interaction → listen for real gestures until audio is running |
| Blue focus outline on terminal input | ID-specific CSS rule overrides the global `:focus-visible` |
| On mobile the open terminal squeezed the text | `grid-cols-[minmax(0,1fr)]` |
| Vercel built an old commit (8c4654a) | The user had redeployed an old deployment — redeploy the latest `main` |
| Light theme text hard to read | Darkened tokens (§8) |

## 13. Change log

| Date | Commit | Change |
| --- | --- | --- |
| — | 58626ee | Create Next App |
| — | 8c4654a | Built the portfolio site |
| — | e66381e | Network background across the whole layout |
| — | f9f121e / e4f5eeb / 362e563 | Simplified the site; removed contact API, Resend, keys |
| — | c14f922 | Removed the About section (merged into Hero) |
| — | 7cfbef8 | Responsive layout, profile updates, terminal sounds |
| — | 15d9b64 | allowScripts for unrs-resolver |
| — | 2a3c321 | Colour tokens, terminal download, responsive layout |
| 2026-11-02 | a00b0aa | Published the 3 blog posts; light-theme contrast; terminal notes/ls |
| 2026-11-02 | 2a6af6c, 3a49195 | Blog posts expanded with in-depth technical content |
| 2026-11-02 | — | Added CONTEXT.md and CLAUDE.md |
| 2026-11-02 | — | Planned navbar like button (Upstash Redis, atomic INCR + SET NX, rate limit) in docs/plan.md |
| 2026-11-02 | — | Moved CONTEXT/plan/prompt/PLACEHOLDERS .md into `docs/`; CLAUDE.md and README.md stay in the root (Claude Code and GitHub only read them there) |

## 14. Open items

- Project repo links (`[GITHUB_REPO_URL]`) in `projects.ts`.
- Optional company logos in `public/logos`.
- Owner to check the blog's technical details (see §4).
- Search Console / Bing submission.
- Like button in navbar — planned in `docs/plan.md` (Upstash Redis via Vercel Marketplace); not built yet.
