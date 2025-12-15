# Repository Guidelines

## Project Structure & Module Organization
- `src/app` App Router entry (`layout.tsx`, `page.tsx`) and routes for `posts`, `events`, `art-college`, `tags`, plus `api/contact/route.ts`.
- `src/components` shared UI (header/footer, home sections, action components); `src/lib` helpers; `src/data` small config/constants.
- Markdown/MDX content lives in `content/{posts,events,art-college}` and is wired through `contentlayer.config.ts`.
- Static assets sit in `public/`; generated static exports land in `out/` (avoid manual edits); extra references live in `docs/`.

## Build, Test, and Development Commands
- `npm run dev` — start the dev server on :3000 (fast refresh).
- `npm run build` — run Contentlayer then Next.js production build.
- `npm run start` — serve the production build locally.
- `npm run lint` — ESLint via `eslint.config.mjs`; `npm run typecheck` — TypeScript without emitting files.
- Prefer `npm run build`; use `npm run export` only when CI needs the static `out/` output.

## Coding Style & Naming Conventions
- TypeScript + React 19 + Next.js 15; favor functional components. Add `"use client";` only where client hooks or browser APIs are used.
- Utility-first styling with Tailwind classes; keep className ordering stable and reuse tokens from `globals.css`.
- Two-space indentation; PascalCase components; camelCase variables/functions; kebab-case filenames for content entries.
- Fix ESLint warnings and keep prop/state types explicit when inference is unclear.

## Testing Guidelines
- No automated tests are committed yet; always run `npm run lint` and `npm run typecheck` before pushing.
- If you add coverage, colocate UI tests as `*.test.tsx` alongside components or under `src/__tests__/` and prefer React Testing Library-style assertions.
- Manually verify navigation, posts/events rendering, and the contact form with valid reCAPTCHA + notification targets.

## Commit & Pull Request Guidelines
- Follow the existing style of concise, imperative commit subjects (e.g., “fixes”, “share tab and responsive contact”); keep them under ~60 characters.
- PRs should describe the change set, link any issues/tasks, note schema or env var updates, and include UI screenshots/GIFs when layouts or styles change.
- List the commands/tests you ran (`lint`, `typecheck`, `build`) in the PR description.

## Security & Configuration Tips
- Store secrets only in `.env.local` (reCAPTCHA keys and notification webhooks for Slack/Discord/Telegram/WhatsApp); never commit them.
- After editing content, rerun `npm run build` to refresh Contentlayer output. Exclude `node_modules`, `.env*`, and `out/` from commits.
