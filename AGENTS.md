# AGENTS.md

## Purpose
This file tells coding agents how to work safely and consistently in this repository.

The project is a Next.js 16 App Router site for a personal archive (`posts`, `events`, `art-college`, `shop`, `traces`) with MDX-first content.

## Architecture Snapshot
- Framework: Next.js 16 + React 19 + TypeScript.
- Styling: Tailwind CSS v4 + design tokens in `src/app/globals.css`.
- Content source:
  - MDX entries live under `content/{posts,events,art-college,shop}`.
  - Site-wide editorial copy + nav config lives under `content/site/*.json`.
  - Read at build time by `src/content/index.ts`, which exposes typed arrays
    (`allPosts`, `allEvents`, `allShopItems`, plus the per-section overviews).
  - `tsconfig.json` exposes the `@content/*` alias for `content/*` and `@/*`
    for `src/*`. There is no Contentlayer step.
- Layout shell lives in `src/app/layout.tsx` with `Header`, `SubpageNavigation`, `PageSurface`, and `Footer`.
- MDX rendering is compiled in route pages using `compileMDX` and shared render components from `src/components/mdx/mdx.tsx`.

## Important Paths
- App routes: `src/app/**`
- Shared components: `src/components/**`
- Utility libraries: `src/lib/**`
- Content (MDX entries + site JSON): `content/**`
- Content registry: `src/content/index.ts`
- Public assets: `public/**`
- Docs/reference notes: `docs/**`

## Commands
- `npm run dev` - start local dev server.
- `npm run build` - production build (primary verification command).
- `npm run start` - run production server.
- `npm run lint` - ESLint checks.
- `npm run typecheck` - TypeScript checks without emit.
- `npm run export` - alias of build in this repo; prefer `build` unless static export flow is explicitly required.

## Working Rules For Agents
- Keep changes focused; avoid broad refactors unless requested.
- Do not revert or overwrite unrelated dirty working tree changes.
- Prefer server components by default; add `"use client"` only when hooks/browser APIs are required.
- Reuse existing primitives before creating new components.
- Keep Tailwind class patterns consistent with nearby code and global tokens.
- Preserve content schema expectations (frontmatter keys used by route loaders).

## MDX + Content Rules
- When adding new entries:
  - Posts: `content/posts/<slug>.mdx`
  - Events: `content/events/<slug>.mdx`
  - Shop: `content/shop/<slug>.mdx`
  - Art college: file or nested `index.mdx` under `content/art-college/**`
- Ensure required frontmatter fields are present for each type (`title`, `description`, date fields, etc. as used by loaders/pages).
- Do not introduce breaking schema changes in MDX frontmatter without updating `src/content/index.ts` and its consumers.
- Site-level editorial copy (hero, contact, navigation, home sections) lives
  in `content/site/*.json`. Prefer editing these files over hard-coding copy
  inside components.

## Route Conventions
- List pages read from generated content arrays.
- Detail pages use static params and currently run with `dynamicParams = false` where configured.
- Use existing longform wrappers/components (`LongformEntry`, `MdxContainer`, action panels) for consistency.

## Contact API Safety
- Contact endpoint: `src/app/api/contact/route.ts`.
- Validate payloads with Zod; keep explicit error responses.
- reCAPTCHA validation is optional based on env presence; do not hard-require it in code paths that currently allow missing secret.
- Notification channels are configured via environment variables; never hardcode secrets.

## Quality Checks Before Handoff
Run, at minimum:
1. `npm run lint`
2. `npm run typecheck`
3. `npm run build` (recommended for route/content changes)

If you cannot run commands, explicitly state that in your handoff.

## Commit/PR Guidance
- Commit messages should be short, imperative, and specific.
- Keep PRs small and reviewable when possible.
- Mention any env var changes, content schema changes, and manual verification steps.

## Security
- Never commit `.env*` or credentials.
- Treat webhook URLs, tokens, and IDs as secrets.
- Avoid adding large generated artifacts unless explicitly requested.
