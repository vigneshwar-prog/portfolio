# CLAUDE.md — rules for this repo

Personal portfolio for Vigneshwar B → https://vigneshwarb.in (Next.js 15 + Tailwind v4, deployed on Vercel from `main`).

## Always start here
- **Read `docs/CONTEXT.md` first.** It is the full project context: stack, file map, content, decisions, fixes and change log.

## Keep docs/CONTEXT.md in sync (mandatory)
- After **every** change — code, content, configuration, dependencies, deployment, DNS, or a decision — update `docs/CONTEXT.md` in the **same task**, before reporting that you're done.
- Update the section the change affects (file map, content, terminal, theme, etc.), add a row to **§13 Change log** (date, commit, change), add new problems and their fixes to **§12**, and keep **§14 Open items** current.
- Update the "Last updated" date at the top.
- Record every small detail (colours, class names, sizes, wording, commands). Never leave the file stale or contradicting the code.
- If something is removed, remove it from the file map and mention the removal.

## Content rules
- Facts come only from the resume or from what the owner says. **Never invent** experience, metrics, dates or credentials.
- Python is the primary language; Java is basic only — never overclaim it.
- Personal data lives in `src/content/*.ts` and the MDX posts — not hard-coded in components.
- Placeholders stay in `[BRACKETS]` and must show as disabled/hidden (see `docs/PLACEHOLDERS.md`).

## Code rules
- TypeScript; Tailwind using the theme tokens (`text-fg`, `text-muted`, `text-green`, `bg-bg`, `border-line`, `--amber`, `--red`) — no raw Tailwind palette colours.
- Every change must look right in **both dark and light** themes and at phone width (no horizontal scroll).
- Keep the hero grid fixed (`lg:grid-cols-[minmax(0,1fr)_560px]`) so the text doesn't move when the flip card switches.
- Sounds and music must respect the `ambient-muted` setting.

## Learnings notes (docs/notes.html)
- When the owner learns something new during a task (a concept, tool, service or how something works), ask whether to save it to `docs/notes.html`. If yes, add it as one note (a `section.topic`) explaining how it works internally — learning content only, no task status or to-dos.
- Put each note under a fitting category (e.g. Redis, Vercel, Next.js) and add a matching sidebar link under that category's group, numbered within the category. If none fits, propose a new category name and confirm it with the owner before adding it.
- Write it in plain words with short examples; keep the page's existing style (light/dark tokens, phone width).

## Before you finish
1. `npm run build` passes.
2. Check visually with Playwright when the UI changes.
3. Commit/push only when asked (pushing deploys to production). Commit messages end with the Co-Authored-By line.
4. Update `docs/CONTEXT.md` (see above).
