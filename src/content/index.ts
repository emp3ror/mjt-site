/**
 * Content registry.
 *
 * Reads MDX files under `content/` at build time and exposes typed arrays
 * the rest of the app can iterate over (posts, events, shop items, plus
 * each section's index/overview MDX).
 *
 * This module replaces the previous Contentlayer integration. The shape of
 * `Post`, `Event`, etc. mirrors what Contentlayer used to emit so route
 * pages did not need to change when the dependency was removed.
 */

import fs from "node:fs";
import path from "node:path";

import matter from "gray-matter";
import readingTime from "reading-time";

import { isVisible } from "@/lib/content-visibility";

const CONTENT_DIR = path.join(process.cwd(), "content");
const MDX_EXTENSION = /\.mdx$/;

const toPosixPath = (value: string) => value.replaceAll(path.sep, "/");
const isIndexFile = (relativePath: string) => path.basename(relativePath) === "index.mdx";

type Doc = {
  _id: string;
  _raw: { flattenedPath: string };
  body: { raw: string };
};

export type Post = Doc & {
  title: string;
  description: string;
  date: string;
  category: "tech" | "art" | "politics" | "art-study" | "personal" | "hike" | "run";
  tags: string[];
  cover?: string;
  pullQuote?: string;
  featured?: boolean;
  template?: string;
  gpx?: string;
  checkpoints?: unknown;
  draft?: boolean;
  slug: string;
  url: string;
  readingTime: string;
};

export type Event = Doc & {
  title: string;
  description: string;
  date: string;
  endDate?: string;
  startTime?: string;
  endTime?: string;
  category?: string;
  location?: string;
  tags?: string[];
  cover?: string;
  registrationUrl?: string;
  draft?: boolean;
  slug: string;
  url: string;
};

export type Overview = Doc & {
  title: string;
  intro?: string;
  description?: string;
  updated?: string;
  draft?: boolean;
};

export type ShopItem = Doc & {
  title: string;
  intro?: string;
  description?: string;
  updated?: string;
  draft?: boolean;
  slug: string;
  url: string;
};

export type ShopOverview = Overview & {
  slug: string;
  url: string;
};

type ParsedMdx<T> = {
  frontMatter: T;
  content: string;
  flattenedPath: string;
};

const readMdx = <T,>(relativePath: string): ParsedMdx<T> => {
  const source = fs.readFileSync(path.join(CONTENT_DIR, relativePath), "utf8");
  const { data, content } = matter(source);

  return {
    frontMatter: data as T,
    content,
    flattenedPath: toPosixPath(relativePath.replace(MDX_EXTENSION, "")),
  };
};

const toDoc = (parsed: ParsedMdx<unknown>): Doc => ({
  _id: parsed.flattenedPath,
  _raw: { flattenedPath: parsed.flattenedPath },
  body: { raw: parsed.content },
});

const walkMdx = (relativeDir: string): string[] => {
  const absoluteDir = path.join(CONTENT_DIR, relativeDir);

  return fs.readdirSync(absoluteDir, { withFileTypes: true }).flatMap((entry) => {
    const next = path.join(relativeDir, entry.name);

    if (entry.isDirectory()) {
      return walkMdx(next);
    }

    if (!entry.isFile() || !entry.name.endsWith(".mdx")) {
      return [];
    }

    return [toPosixPath(next)];
  });
};

const loadOverview = <T extends { title: string }>(
  relativePath: string,
  withExtras?: (parsed: ParsedMdx<T>) => Record<string, unknown>,
): Array<Doc & T & Record<string, unknown>> => {
  if (!fs.existsSync(path.join(CONTENT_DIR, relativePath))) {
    return [];
  }

  const parsed = readMdx<T>(relativePath);

  return [
    {
      ...toDoc(parsed),
      ...parsed.frontMatter,
      ...(withExtras ? withExtras(parsed) : {}),
    },
  ];
};

const postFiles = walkMdx("posts").filter((p) => !isIndexFile(p));
const eventFiles = walkMdx("events").filter((p) => !isIndexFile(p));
const shopFiles = walkMdx("shop").filter((p) => !isIndexFile(p));

export const allPosts: Post[] = postFiles
  .map((relativePath) => {
    const parsed = readMdx<Omit<Post, keyof Doc | "slug" | "url" | "readingTime">>(relativePath);
    const slug = parsed.flattenedPath.replace(/^posts\//, "");

    return {
      ...toDoc(parsed),
      ...parsed.frontMatter,
      tags: parsed.frontMatter.tags ?? [],
      slug,
      url: `/posts/${slug}`,
      readingTime: readingTime(parsed.content).text,
    };
  })
  .filter(isVisible);

export const allEvents: Event[] = eventFiles
  .map((relativePath) => {
    const parsed = readMdx<Omit<Event, keyof Doc | "slug" | "url">>(relativePath);
    const slug = parsed.flattenedPath.replace(/^events\//, "");

    return {
      ...toDoc(parsed),
      ...parsed.frontMatter,
      tags: parsed.frontMatter.tags ?? [],
      slug,
      url: `/events/${slug}`,
    };
  })
  .filter(isVisible);

export const allShopItems: ShopItem[] = shopFiles
  .map((relativePath) => {
    const parsed = readMdx<Omit<ShopItem, keyof Doc | "slug" | "url">>(relativePath);
    const slug = parsed.flattenedPath.replace(/^shop\//, "");

    return {
      ...toDoc(parsed),
      ...parsed.frontMatter,
      slug,
      url: `/shop/posts/${slug}`,
    };
  })
  .filter(isVisible);

export const allPostsOverviews = (
  loadOverview<Pick<Overview, "title" | "intro" | "description" | "updated"> & { draft?: boolean }>(
    "posts/index.mdx",
  ) as Overview[]
).filter(isVisible);

export const allEventsOverviews = (
  loadOverview<Pick<Overview, "title" | "intro" | "description" | "updated"> & { draft?: boolean }>(
    "events/index.mdx",
  ) as Overview[]
).filter(isVisible);

export const allShopOverviews = (
  loadOverview<Pick<Overview, "title" | "intro" | "description" | "updated"> & { draft?: boolean }>(
    "shop/index.mdx",
    () => ({ slug: "", url: "/shop" }),
  ) as ShopOverview[]
).filter(isVisible);
