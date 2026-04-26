import { cache } from "react";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { compileMDX } from "next-mdx-remote/rsc";
import remarkGfm from "remark-gfm";
import rehypeAutolinkHeadings from "rehype-autolink-headings";
import rehypeSlug from "rehype-slug";

import { ContentActions } from "@/components/actions/content-actions";
import { LongformEntry } from "@/components/longform-entry";
import { HikeMap } from "@/components/maps/hike-map";
import type { HikeCheckpointInput } from "@/components/maps/hike-map";
import { MdxContainer, mdxComponents } from "@/components/mdx/mdx";
import { formatDate } from "@/lib/format";
import { allPosts } from "@/content";

const posts = [...allPosts].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

const getPostFromParams = (slug: string) => posts.find((post) => post.slug === slug);

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
        remarkPlugins: [remarkGfm],
        rehypePlugins: [rehypeSlug, [rehypeAutolinkHeadings, { behavior: "wrap" }]],
      },
    },
    components: mdxComponents,
  });

  return content;
});

export const generateStaticParams = async () => posts.map((post) => ({ slug: post.slug }));

export const dynamicParams = false;

export async function generateMetadata({ params }: PostPageProps): Promise<Metadata> {
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

export default async function PostPage({ params }: PostPageProps) {
  const { slug } = await params;
  const post = getPostFromParams(slug);

  if (!post) {
    notFound();
  }

  const content = await renderMdx(post.body.raw);
  const showHikeMap = Boolean(post.gpx);

  return (
    <LongformEntry
      className="longform-note"
      backHref="/posts"
      backLabel="Back to notes"
      eyebrow="Entry"
      title={post.title}
      description={post.description}
      meta={[
        { label: "Date", value: formatDate(post.date, "long") },
        { label: "Kind", value: post.category },
        { label: "Reading", value: post.readingTime },
      ]}
      actions={
        <ContentActions
          itemId={post._id}
          title={post.title}
          description={post.description}
          url={post.url}
          likeStorageKey="mjt-liked-items"
          header={
            <div>
              <p className="eyebrow">Share</p>
              <p className="mt-2 text-sm leading-7 text-[color:var(--ink-soft)]">
                Save or pass this note along.
              </p>
            </div>
          }
        />
      }
    >
      <div className="space-y-8">
        {showHikeMap && post.gpx ? (
          <HikeMap
            gpxPath={post.gpx}
            checkpoints={post.checkpoints as HikeCheckpointInput[] | undefined}
          />
        ) : null}
        <MdxContainer>{content}</MdxContainer>
      </div>
    </LongformEntry>
  );
}
