# Before publishing — replace these

| Item | Where | Current |
| --- | --- | --- |
| Project repo links | `src/content/projects.ts` → `github` (4 projects) | `[GITHUB_REPO_URL]` → "Repository coming soon" |
| Site URL | env `NEXT_PUBLIC_SITE_URL` | `http://localhost:3000` |
| Contact email delivery | env `RESEND_API_KEY`, `CONTACT_TO_EMAIL` | unset → form says "not configured" |
| Internship locations | `src/content/experience.ts` (Zoho, Virtusa, PARO IT) | omitted — add if you want them shown |
| Company logos (optional) | `public/logos/*` + `logo` in `experience.ts` | initials shown |
| Engineering Lab | `src/content/lab.ts` | 2 entries mirror projects; the other 5 are **starter suggestions** — edit or delete |
| Blog posts | `src/content/blog/*.mdx` | 3 outlines marked `draft: true` |

Placeholder links are rendered as disabled or hidden, so nothing is broken while they remain.
