import Link from "next/link";
import { cache } from "react";

import { compileMDX } from "next-mdx-remote/rsc";

import { Badge } from "@/components/badge";
import { Card } from "@/components/card";
import { DoodleDivider } from "@/components/doodle-divider";
import { MdxContainer, mdxComponents } from "@/components/mdx/mdx";
import { SectionHeading } from "@/components/section-heading";
import type { Post, PostsOverview } from "contentlayer/generated";
import { allPosts, allPostsOverviews } from "contentlayer/generated";

const renderOverview = cache(async (source: string) => {
  const { content } = await compileMDX<{ [key: string]: unknown }>({
    source,
    options: {
      mdxOptions: {
        remarkPlugins: [],
      },
    },
    components: mdxComponents,
  });

  return content;
});

const formatDate = (value: string) =>
  new Intl.DateTimeFormat("en", {
    year: "numeric",
    month: "short",
    day: "2-digit",
  }).format(new Date(value));

const getCategories = (items: Post[]) =>
  Array.from(new Set(items.map((item) => item.category))).sort();

export default async function PostsPage() {
  const posts = [...allPosts].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  const overview: PostsOverview | undefined = allPostsOverviews[0];
  const categories = getCategories(posts);

  const overviewContent = overview ? await renderOverview(overview.body.raw) : null;

  return (
    <div className="relative mx-auto flex min-h-screen max-w-6xl flex-col gap-20 px-6 pb-24 pt-24">
      <section className="space-y-6">
        <Badge className="bg-white/85 text-[color:var(--accent)]">Studio log</Badge>
        <SectionHeading
          title={overview?.title ?? "Latest notes and process journals"}
          description={overview?.description ?? "Deep dives, retros, and art studies collected in one place."}
        />

        {overview?.intro ? (
          <p className="max-w-3xl text-sm text-[color:var(--ink)]/70">{overview.intro}</p>
        ) : null}

        {overviewContent ? <MdxContainer>{overviewContent}</MdxContainer> : null}

        {overview?.updated ? (
          <p className="text-xs uppercase tracking-[0.3em] text-[color:var(--muted)]">
            Updated {formatDate(overview.updated)}
          </p>
        ) : null}

        {categories.length > 0 ? (
          <div className="flex flex-wrap gap-3 text-xs font-semibold uppercase tracking-[0.3em] text-[color:var(--ink)]/60">
            {categories.map((category) => (
              <span
                key={category}
                className="rounded-full border border-[color:var(--muted)]/50 bg-white/80 px-4 py-2"
              >
                {category}
              </span>
            ))}
          </div>
        ) : null}
      </section>

      <DoodleDivider variant="cloud" colorClassName="text-[color:var(--muted)]/50" />

      {posts.length > 0 ? (
        <div className="grid gap-8 md:grid-cols-2 xl:grid-cols-3">
          {posts.map((post) => (
            <Card key={post._id} className="h-full space-y-4">
              <div className="space-y-2">
                <span className="text-xs font-semibold uppercase tracking-[0.3em] text-[color:var(--muted)]">
                  {formatDate(post.date)}
                </span>
                <Link href={post.url} className="text-xl font-semibold text-[color:var(--ink)]">
                  {post.title}
                </Link>
              </div>
              <p className="text-sm text-[color:var(--ink)]/70">{post.description}</p>
              <div className="flex flex-wrap gap-2 text-xs font-semibold uppercase tracking-[0.25em] text-[color:var(--ink)]/55">
                {post.tags.map((tag) => (
                  <span key={tag} className="rounded-full bg-white/70 px-3 py-1">
                    {tag}
                  </span>
                ))}
              </div>
              <div className="flex items-center justify-between text-xs uppercase tracking-[0.25em] text-[color:var(--ink)]/50">
                <span>{post.category}</span>
                <span>{post.readingTime}</span>
              </div>
            </Card>
          ))}
        </div>
      ) : (
        <div className="rounded-[2.5rem] border border-dashed border-[color:var(--muted)]/60 bg-white/70 px-8 py-16 text-center text-sm text-[color:var(--ink)]/60">
          <p className="text-lg font-semibold text-[color:var(--ink)]">Nothing published yet</p>
          <p className="mt-2">Notes are currently brewing. Check back soon for fresh write-ups.</p>
        </div>
      )}
    </div>
  );
}
