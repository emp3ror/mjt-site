import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { HikeMap } from "@/components/maps/hike-map";
import type { HikeCheckpointInput } from "@/components/maps/hike-map";
import { cache } from "react";

import { compileMDX } from "next-mdx-remote/rsc";
import rehypeAutolinkHeadings from "rehype-autolink-headings";
import rehypeSlug from "rehype-slug";

import { allPosts } from "contentlayer/generated";
import { MdxContainer, mdxComponents } from "@/components/mdx/mdx";

const posts = [...allPosts].sort((a, b) =>
  new Date(b.date).getTime() - new Date(a.date).getTime(),
);

const getPostFromParams = (slug: string) =>
  posts.find((post) => post.slug === slug);

type PostPageProps = {
  params: Promise<{
    slug: string;
  }>;
};

const renderMdx = cache(async (source: string) => {
  const { content } = await compileMDX<{ [key: string]: unknown }>({
    source,
    options: {
      mdxOptions: {
        remarkPlugins: [],
        rehypePlugins: [
          rehypeSlug,
          [rehypeAutolinkHeadings, { behavior: "wrap" }],
        ],
      },
    },
    components: mdxComponents,
  });

  return content;
});

export const generateStaticParams = async () =>
  posts.map((post) => ({ slug: post.slug }));

export const dynamicParams = false;

export async function generateMetadata({
  params,
}: PostPageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = getPostFromParams(slug);

  if (!post) {
    return {};
  }

  return {
    title: post.title,
    description: post.description,
    openGraph: {
      title: post.title,
      description: post.description,
      type: "article",
      publishedTime: post.date,
      url: post.url,
    },
  } satisfies Metadata;
}

const formatDate = (value: string) =>
  new Intl.DateTimeFormat("en", {
    year: "numeric",
    month: "long",
    day: "2-digit",
  }).format(new Date(value));

export default async function PostPage({ params }: PostPageProps) {
  const { slug } = await params;
  const post = getPostFromParams(slug);

  if (!post) {
    notFound();
  }

  const content = await renderMdx(post.body.raw);
  const showHikeMap = post.template === "hike" && Boolean(post.gpx);

  return (
    <article className="mx-auto flex min-h-screen max-w-3xl flex-col px-6 pb-24 pt-16">
      <nav className="text-sm text-neutral-500">
        <Link className="hover:text-blue-600" href="/">
          ← Back to all notes
        </Link>
      </nav>

      <header className="mt-8 space-y-4">
        <span className="text-xs uppercase tracking-[0.25em] text-neutral-400">
          {post.category}
        </span>
        <h1 className="text-4xl font-semibold tracking-tight text-neutral-900 dark:text-neutral-100">
          {post.title}
        </h1>
        <p className="text-base text-neutral-600 dark:text-neutral-300">
          {post.description}
        </p>
        <div className="flex items-center gap-4 text-sm text-neutral-400">
          <span>{formatDate(post.date)}</span>
          <span aria-hidden>•</span>
          <span>{post.readingTime}</span>
        </div>
      </header>

      <section className="mt-12 space-y-6">
        {showHikeMap && post.gpx ? (
          <HikeMap
            gpxPath={post.gpx}
            checkpoints={post.checkpoints as HikeCheckpointInput[] | undefined}
          />
        ) : null}
        <MdxContainer>{content}</MdxContainer>
      </section>
    </article>
  );
}
