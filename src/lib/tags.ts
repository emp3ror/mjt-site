/**
 * Shared tag helpers. Used by `/tags`, `/tags/[tag]`, and any card that
 * surfaces tag pills so display stays consistent across the archive.
 */

export const slugifyTag = (tag: string) =>
  tag
    .trim()
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9-]/g, "");

/**
 * Renders a tag as a single-token, PascalCase label so multi-word tags
 * like `studio-notes` collapse to `StudioNotes` and read like a usable
 * hashtag (`#StudioNotes`) instead of `#Studio Notes`.
 */
export const formatTagLabel = (tag: string) =>
  tag
    .split(/[-_\s]+/)
    .filter(Boolean)
    .map((segment) => segment.charAt(0).toUpperCase() + segment.slice(1).toLowerCase())
    .join("");
