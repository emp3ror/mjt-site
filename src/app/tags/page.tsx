import type { Metadata } from "next";
import Link from "next/link";

import { ChapterHeader } from "@/components/chapter-header";
import { EditorialDivider } from "@/components/editorial-divider";
import { allPosts } from "@/content";
import { formatDate } from "@/lib/format";
import { formatTagLabel } from "@/lib/tags";

const posts = [...allPosts];

export const metadata: Metadata = {
  title: "Browse tags",
  description: "Explore notes grouped by recurring themes and motifs.",
};

const tagSummary = posts.reduce<Record<string, { count: number; latestDate?: string }>>(
  (acc, post) => {
    post.tags.forEach((tag) => {
      const lowerTag = tag.toLowerCase();
      const existing = acc[lowerTag];
      const latestDate = existing?.latestDate ?? post.date;
      const newerDate =
        new Date(post.date).getTime() > new Date(latestDate).getTime() ? post.date : latestDate;

      acc[lowerTag] = {
        count: (existing?.count ?? 0) + 1,
        latestDate: newerDate,
      };
    });
    return acc;
  },
  {},
);

export default function TagsIndexPage() {
  const sortedTags = Object.entries(tagSummary).sort((a, b) => {
    const countDelta = b[1].count - a[1].count;
    if (countDelta !== 0) {
      return countDelta;
    }
    return new Date(b[1].latestDate ?? "1970-01-01").getTime() - new Date(a[1].latestDate ?? "1970-01-01").getTime();
  });

  return (
    <div className="page-wrap section-block">
      <ChapterHeader
        eyebrow="Index"
        title="Tags"
        description="A lighter way to follow repeated subjects, materials, and questions across the notes archive."
      />

      <EditorialDivider className="my-10 md:my-12" />

      <ul className="grid gap-4 md:grid-cols-2">
        {sortedTags.map(([tag, details]) => (
          <li key={tag}>
            <Link
              className="editorial-surface block rounded-[1.5rem] p-5 hover:border-[color:var(--line-strong)]"
              href={`/tags/${tag}`}
            >
              <div className="flex items-center justify-between gap-4 text-sm text-[color:var(--ink-soft)]">
                <span>{details.count} trace{details.count === 1 ? "" : "s"}</span>
                <span>{formatDate(details.latestDate, "short")}</span>
              </div>
              <h2 className="mt-3 text-3xl">#{formatTagLabel(tag)}</h2>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
