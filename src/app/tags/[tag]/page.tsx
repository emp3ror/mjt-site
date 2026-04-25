import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { ChapterHeader } from "@/components/chapter-header";
import { EditorialDivider } from "@/components/editorial-divider";
import { TraceCard } from "@/components/trace-card";
import { postToTrace } from "@/lib/traces";
import { formatTagLabel } from "@/lib/tags";
import { allPosts } from "@/content";

const posts = [...allPosts];

type TagPageProps = {
  params: Promise<{
    tag: string;
  }>;
};

export const generateStaticParams = async () => {
  const uniqueTags = new Set<string>();
  posts.forEach((post) => post.tags.forEach((tag) => uniqueTags.add(tag.toLowerCase())));
  return Array.from(uniqueTags).map((tag) => ({ tag }));
};

export const dynamicParams = false;

export async function generateMetadata({ params }: TagPageProps): Promise<Metadata> {
  const { tag } = await params;
  const matchingPosts = posts.filter((post) =>
    post.tags.some((item) => item.toLowerCase() === tag.toLowerCase()),
  );

  if (matchingPosts.length === 0) {
    return {};
  }

  const title = `#${formatTagLabel(tag)}`;

  return {
    title,
    description: `Notes tagged with ${formatTagLabel(tag)}.`,
  } satisfies Metadata;
}

export default async function TagPage({ params }: TagPageProps) {
  const { tag } = await params;
  const normalizedTag = tag.toLowerCase();

  const matchingPosts = posts
    .filter((post) => post.tags.some((item) => item.toLowerCase() === normalizedTag))
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  if (matchingPosts.length === 0) {
    notFound();
  }

  return (
    <div className="page-wrap section-block">
      <ChapterHeader
        eyebrow="Tagged"
        title={`#${formatTagLabel(tag)}`}
        description="A smaller thread through the notes archive."
      />

      <EditorialDivider className="my-10 md:my-12" />

      <div className="trace-grid">
        {matchingPosts.map((post, index) => (
          <TraceCard
            key={post.slug}
            trace={postToTrace(post)}
            className={index % 2 === 0 ? "md:col-span-7" : "md:col-span-5"}
          />
        ))}
      </div>
    </div>
  );
}
