import { cache } from "react";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { compileMDX } from "next-mdx-remote/rsc";
import rehypeAutolinkHeadings from "rehype-autolink-headings";
import rehypeSlug from "rehype-slug";

import { ChapterHeader } from "@/components/chapter-header";
import { EditorialDivider } from "@/components/editorial-divider";
import { LongformEntry } from "@/components/longform-entry";
import { MdxContainer, mdxComponents } from "@/components/mdx/mdx";
import { TraceCard } from "@/components/trace-card";
import {
  getAllArtCollegeSlugs,
  getArtCollegeEntry,
  getArtCollegeSection,
  type ArtCollegeEntry,
} from "@/lib/art-college";
import { formatDate } from "@/lib/format";
import type { Trace } from "@/lib/traces";

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
        rehypePlugins: [rehypeSlug, [rehypeAutolinkHeadings, { behavior: "wrap" }]],
      },
    },
    components: mdxComponents,
  });

  return content;
});

const entryToTrace = (entry: ArtCollegeEntry): Trace => ({
  id: entry.href,
  kind: "study",
  kindLabel: "Study",
  title: entry.title,
  description: entry.description,
  href: entry.href,
  date: entry.date,
  displayDate: formatDate(entry.updated ?? entry.date, "short"),
  tags: [],
  category: "art-college",
  sortDate: entry.updated ?? entry.date ?? "1970-01-01",
});

const hasChildEntries = async (slug: string[]) => {
  const section = await getArtCollegeSection(slug);
  return section?.entries.length ? section : null;
};

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
    const section = await getArtCollegeSection(slug);
    if (!section) return {};
    return {
      title: section.title,
      description: section.description ?? section.intro,
    } satisfies Metadata;
  }

  const title = entry.frontMatter.title ?? slug.at(-1) ?? "Study";
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

  const childSection = await hasChildEntries(slug);
  const content = await compileContent(entry.content);
  const formattedDate = formatDate(entry.frontMatter.updated ?? entry.frontMatter.date, "long");
  const title = entry.frontMatter.title ?? slug.at(-1) ?? "Study note";
  const description = entry.frontMatter.description ?? entry.frontMatter.intro;

  if (childSection) {
    return (
      <div className="page-wrap section-block">
        <ChapterHeader
          eyebrow="Study"
          title={title}
          description={description}
        />

        {entry.content.trim().length > 0 ? (
          <MdxContainer className="mt-10">{content}</MdxContainer>
        ) : null}

        <EditorialDivider className="my-12 md:my-14" />

        <section className="space-y-7">
          <div className="space-y-2">
            <p className="eyebrow">Inside this chapter</p>
            <h2 className="text-[2rem] leading-[1.08] tracking-[-0.02em] md:text-[2.55rem]">
              {childSection.entries.length} note{childSection.entries.length === 1 ? "" : "s"} in {title}.
            </h2>
          </div>
          <div className="trace-grid">
            {childSection.entries.map((child, index) => (
              <TraceCard
                key={child.href}
                trace={entryToTrace(child)}
                className={index % 2 === 0 ? "md:col-span-7" : "md:col-span-5"}
              />
            ))}
          </div>
        </section>
      </div>
    );
  }

  return (
    <LongformEntry
      className="longform-note"
      backHref="/art-college"
      backLabel="Back to study"
      eyebrow="Study"
      title={title}
      description={description}
      meta={[
        { label: "Updated", value: formattedDate },
        { label: "Path", value: slug.join(" / ") },
      ]}
    >
      <MdxContainer>{content}</MdxContainer>
    </LongformEntry>
  );
}
