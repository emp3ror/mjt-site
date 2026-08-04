/**
 * Which in-page sections the home route actually renders.
 *
 * Several home sections hide themselves when they have no content — and with
 * most entries still `draft: true`, a production build genuinely drops some of
 * them. Anything that links to `/#<id>` (the hero CTA, the anchor strip under
 * the header) resolves against this set so it can never advertise a section
 * that isn't on the page.
 *
 * Keep in sync with `src/app/page.tsx`.
 */

import { hasVolunteeringSlides } from "@/components/home/volunteering-section";
import { allEvents, allPosts } from "@/content";
import { allTrails } from "@/lib/trails";

export function getHomeSectionIds(): ReadonlySet<string> {
  const ids = new Set<string>(["home", "stories", "contact"]);

  if (hasVolunteeringSlides(allEvents, allPosts)) ids.add("volunteering");
  if (allPosts.length > 0) ids.add("journal");
  if (allTrails.length > 0) ids.add("trails");

  return ids;
}

/** Keeps only the `/#…` links whose target section is on the page. */
export function filterHomeAnchors<T extends { href: string }>(anchors: T[]): T[] {
  const ids = getHomeSectionIds();
  return anchors.filter((anchor) => {
    if (!anchor.href.startsWith("/#")) return true;
    return ids.has(anchor.href.slice(2));
  });
}
