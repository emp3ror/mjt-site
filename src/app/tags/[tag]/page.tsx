import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { allPosts } from "contentlayer/generated";

const posts = [...allPosts];

const formatDate = (value: string) =>
  new Intl.DateTimeFormat("en", {
    year: "numeric",
    month: "short",
    day: "2-digit",
  }).format(new Date(value));

const formatTagLabel = (tag: string) =>
  tag
    .split(/[-_]/)
    .filter(Boolean)
    .map((segment) => segment.charAt(0).toUpperCase() + segment.slice(1))
    .join(" ");

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
    description: `Posts tagged with ${formatTagLabel(tag)}.`,
  } satisfies Metadata;
}

export default async function TagPage({ params }: TagPageProps) {
  const { tag } = await params;
  const normalizedTag = tag.toLowerCase();

  const matchingPosts = posts.filter((post) =>
    post.tags.some((item) => item.toLowerCase() === normalizedTag),
  );

  if (matchingPosts.length === 0) {
    notFound();
  }

  const sortedPosts = [...matchingPosts].sort((a, b) =>
    new Date(b.date).getTime() - new Date(a.date).getTime(),
  );

  return (
    <div className="mx-auto flex min-h-screen max-w-4xl flex-col gap-10 px-6 py-16">
      <header className="space-y-4">
        <p className="text-xs uppercase tracking-[0.3em] text-neutral-500">
          Tagged
        </p>
        <h1 className="text-4xl font-semibold tracking-tight text-neutral-900 dark:text-neutral-100">
          #{formatTagLabel(tag)}
        </h1>
        <p className="max-w-2xl text-base text-neutral-600 dark:text-neutral-300">
          Posts that share this thread of curiosity. Catch the latest first.
        </p>
      </header>

      <ul className="grid gap-6 sm:grid-cols-2">
        {sortedPosts.map((post) => (
          <li
            key={post.slug}
            className="group flex h-full flex-col rounded-2xl border border-neutral-200/80 bg-white/80 p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-md dark:border-neutral-800/70 dark:bg-neutral-900/70"
          >
            <span className="text-xs uppercase tracking-[0.25em] text-neutral-400">
              {formatDate(post.date)}
            </span>
            <Link
              href={post.url}
              className="mt-2 text-xl font-semibold text-neutral-900 transition-colors group-hover:text-blue-600 dark:text-neutral-100 dark:group-hover:text-blue-400"
            >
              {post.title}
            </Link>
            <p className="mt-3 flex-1 text-sm text-neutral-600 dark:text-neutral-300">
              {post.description}
            </p>
            <div className="mt-6 text-xs text-neutral-400">{post.readingTime}</div>
          </li>
        ))}
      </ul>
    </div>
  );
}

