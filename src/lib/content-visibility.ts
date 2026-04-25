/**
 * Content visibility gating.
 *
 * Any MDX entry can opt out of the production build by adding
 * `draft: true` to its frontmatter. Drafts are visible during local
 * development by default and hidden when `next build` runs.
 *
 * Override behaviour with the `SHOW_DRAFTS` env var:
 *   SHOW_DRAFTS=true   force-show drafts (useful for `build:drafts`)
 *   SHOW_DRAFTS=false  force-hide drafts (useful for `dev:no-drafts`)
 *
 * Falls back to `NODE_ENV !== "production"` when the var is unset.
 */

const showDraftsEnv = process.env.SHOW_DRAFTS?.toLowerCase();

export const showDrafts: boolean =
  showDraftsEnv === "true" ||
  showDraftsEnv === "1" ||
  (showDraftsEnv !== "false" &&
    showDraftsEnv !== "0" &&
    process.env.NODE_ENV !== "production");

export type DraftFlag = { draft?: boolean };

export const isVisible = (frontMatter: DraftFlag): boolean =>
  showDrafts || !frontMatter.draft;
