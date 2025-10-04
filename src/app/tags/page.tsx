import type { Metadata } from "next";
import Link from "next/link";

import { allPosts } from "contentlayer/generated";

const posts = [...allPosts];

export const metadata: Metadata = {
  title: "Browse tags",
  description: "Explore writing grouped by shared motifs, materials, and ideas.",
};

const tagSummary = posts.reduce<Record<string, { count: number; latestDate?: string }>>(
  (acc, post) => {
    post.tags.forEach((tag) => {
      const lowerTag = tag.toLowerCase();
      const existing = acc[lowerTag];
      const latestDate = existing?.latestDate ?? post.date;
      const newerDate = new Date(post.date).getTime() > new Date(latestDate).getTime()
        ? post.date
        : latestDate;

      acc[lowerTag] = {
        count: (existing?.count ?? 0) + 1,
        latestDate: newerDate,
      };
    });
    return acc;
  },
  {},
);

const formatTagLabel = (tag: string) =>
  tag
    .split(/[-_]/)
    .filter(Boolean)
    .map((segment) => segment.charAt(0).toUpperCase() + segment.slice(1))
    .join(" ");

const formatDate = (value?: string) =>
  value
    ? new Intl.DateTimeFormat("en", {
        year: "numeric",
        month: "short",
        day: "2-digit",
      }).format(new Date(value))
    : undefined;

export default function TagsIndexPage() {
  const sortedTags = Object.entries(tagSummary).sort((a, b) => {
    const countDelta = b[1].count - a[1].count;
    if (countDelta !== 0) {
      return countDelta;
    }
    const dateA = a[1].latestDate ?? "1970-01-01";
    const dateB = b[1].latestDate ?? "1970-01-01";
    return new Date(dateB).getTime() - new Date(dateA).getTime();
  });

  return (
    <div className="mx-auto flex min-h-screen max-w-4xl flex-col gap-10 px-6 py-16">
      <header className="space-y-4">
        <p className="text-xs uppercase tracking-[0.3em] text-neutral-500">
          Browse themes
        </p>
        <h1 className="text-4xl font-semibold tracking-tight text-neutral-900 dark:text-neutral-100">
          Tags
        </h1>
        <p className="max-w-2xl text-base text-neutral-600 dark:text-neutral-300">
          The quickest way to scan for related work. Each tag threads together posts
          that explore similar questions, tools, or motifs.
        </p>
      </header>

      <ul className="grid gap-4 sm:grid-cols-2">
        {sortedTags.map(([tag, details]) => (
          <li key={tag} className="group rounded-2xl border border-neutral-200/80 bg-white/80 p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-md dark:border-neutral-800/70 dark:bg-neutral-900/70">
            <Link className="flex flex-col gap-2" href={`/tags/${tag}`}>
              <div className="flex items-center justify-between text-sm text-neutral-500 dark:text-neutral-400">
                <span>{details.count} post{details.count === 1 ? "" : "s"}</span>
                <span>{formatDate(details.latestDate)}</span>
              </div>
              <h2 className="text-xl font-semibold text-neutral-900 transition group-hover:text-blue-600 dark:text-neutral-100 dark:group-hover:text-blue-400">
                #{formatTagLabel(tag)}
              </h2>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

