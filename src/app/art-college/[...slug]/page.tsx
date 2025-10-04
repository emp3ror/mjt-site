import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { cache } from "react";

import { compileMDX } from "next-mdx-remote/rsc";
import rehypeAutolinkHeadings from "rehype-autolink-headings";
import rehypeSlug from "rehype-slug";

import { MdxContainer, mdxComponents } from "@/components/mdx/mdx";
import {
  getAllArtCollegeSlugs,
  getArtCollegeEntry,
} from "@/lib/art-college";

type ArtCollegeEntryPageProps = {
  params: Promise<{
    slug: string[];
  }>;
};

const compileContent = cache(async (source: string) => {
  const { content } = await compileMDX({
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

const formatDate = (value?: string) =>
  value
    ? new Intl.DateTimeFormat("en", {
        year: "numeric",
        month: "long",
        day: "2-digit",
      }).format(new Date(value))
    : undefined;

export const generateStaticParams = async () => {
  const slugs = await getAllArtCollegeSlugs();
  return slugs.map((slug) => ({ slug }));
};

export const dynamicParams = false;

export async function generateMetadata({
  params,
}: ArtCollegeEntryPageProps): Promise<Metadata> {
  const { slug } = await params;
  const entry = await getArtCollegeEntry(slug);

  if (!entry) {
    return {};
  }

  const title = entry.frontMatter.title ?? slug.at(-1) ?? "Art College";
  const description = entry.frontMatter.description ?? entry.frontMatter.intro;

  return {
    title,
    description,
  } satisfies Metadata;
}

export default async function ArtCollegeEntryPage({
  params,
}: ArtCollegeEntryPageProps) {
  const { slug } = await params;
  const entry = await getArtCollegeEntry(slug);

  if (!entry) {
    notFound();
  }

  const content = await compileContent(entry.content);
  const formattedDate = formatDate(entry.frontMatter.updated ?? entry.frontMatter.date);

  return (
    <article className="mx-auto flex min-h-screen max-w-3xl flex-col px-6 pb-24 pt-16">
      <nav className="text-sm text-neutral-500">
        <Link className="hover:text-blue-600" href="/art-college">
          ← Back to Art College
        </Link>
      </nav>

      <header className="mt-8 space-y-4">
        <h1 className="text-4xl font-semibold tracking-tight text-neutral-900 dark:text-neutral-100">
          {entry.frontMatter.title ?? slug.at(-1)}
        </h1>
        {entry.frontMatter.description ? (
          <p className="text-base text-neutral-600 dark:text-neutral-300">
            {entry.frontMatter.description}
          </p>
        ) : null}
        {formattedDate ? (
          <div className="text-sm text-neutral-400">Updated {formattedDate}</div>
        ) : null}
      </header>

      <section className="mt-12 space-y-6">
        <MdxContainer>{content}</MdxContainer>
      </section>
    </article>
  );
}

