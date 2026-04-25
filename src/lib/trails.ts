/**
 * Trail registry — the bridge between MDX posts that carry GPS data and the
 * UI components that surface them.
 *
 * A "trail" is any post that either lives in the `hike`/`run` category or
 * declares a `gpx` path in its frontmatter. The registry parses the GPX once
 * (server-side, see `gpx-stats`) and exposes a flat list ready for both the
 * home-page section and the dedicated /trails archive view.
 */

import { allPosts, type Post } from "@/content";

import { loadTrailGpx, type TrailRoute, type TrailStats } from "./gpx-stats";

export type TrailKind = "hike" | "run";

export type Trail = {
  id: string;
  slug: string;
  url: string;
  kind: TrailKind;
  title: string;
  description: string;
  date: string;
  cover?: string;
  pullQuote?: string;
  tags: string[];
  stats: TrailStats | null;
  route: TrailRoute | null;
  pointCount: number;
  hasGpx: boolean;
  gpxPath?: string;
};

const isTrailPost = (post: Post): boolean =>
  Boolean(post.gpx) ||
  post.category === "hike" ||
  post.category === "run" ||
  post.template === "hike" ||
  post.template === "run";

const inferKind = (post: Post): TrailKind => {
  if (post.category === "run" || post.template === "run") return "run";
  return "hike";
};

const cleanCover = (value?: string): string | undefined => {
  const trimmed = value?.trim();
  return trimmed && trimmed.length > 0 ? trimmed : undefined;
};

const buildTrail = (post: Post): Trail => {
  const gpx = loadTrailGpx(post.gpx);

  return {
    id: post._id,
    slug: post.slug,
    url: post.url,
    kind: inferKind(post),
    title: post.title,
    description: post.description,
    date: post.date,
    cover: cleanCover(post.cover),
    pullQuote: post.pullQuote,
    tags: post.tags,
    stats: gpx?.stats ?? null,
    route: gpx?.route ?? null,
    pointCount: gpx?.pointCount ?? 0,
    hasGpx: Boolean(post.gpx),
    gpxPath: post.gpx,
  };
};

export const allTrails: Trail[] = allPosts
  .filter(isTrailPost)
  .map(buildTrail)
  .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

export const featuredTrails = (limit = 4): Trail[] => allTrails.slice(0, limit);

export const trailsByKind = (kind: TrailKind): Trail[] =>
  allTrails.filter((trail) => trail.kind === kind);
