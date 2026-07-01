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
  getAllSelfStudySlugs,
  getSelfStudyEntry,
  getSelfStudySection,
  type SelfStudyEntry,
} from "@/lib/self-study";
import { formatDate } from "@/lib/format";
import type { Trace } from "@/lib/traces";

type SelfStudyEntryPageProps = {
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

const entryToTrace = (entry: SelfStudyEntry): Trace => ({
  id: entry.href,
  kind: "study",
  kindLabel: "Study",
  title: entry.title,
  description: entry.description,
  href: entry.href,
  date: entry.date,
  displayDate: formatDate(entry.updated ?? entry.date, "short"),
  tags: [],
  category: "self-study",
  sortDate: entry.updated ?? entry.date ?? "1970-01-01",
});

const hasChildEntries = async (slug: string[]) => {
  const section = await getSelfStudySection(slug);
  return section?.entries.length ? section : null;
};

export const generateStaticParams = async () => {
  const slugs = await getAllSelfStudySlugs();
  return slugs.map((slug) => ({ slug }));
};

export const dynamicParams = false;

export async function generateMetadata({
  params,
}: SelfStudyEntryPageProps): Promise<Metadata> {
  const { slug } = await params;
  const entry = await getSelfStudyEntry(slug);

  if (!entry) {
    const section = await getSelfStudySection(slug);
    if (!section) return {};
    return {
      title: section.title,
      description: section.description ?? section.intro,
    } satisfies Metadata;
  }

  const title = entry.frontMatter.title ?? slug.at(-1) ?? "Self Study";
  const description = entry.frontMatter.description ?? entry.frontMatter.intro;

  return {
    title,
    description,
  } satisfies Metadata;
}

export default async function SelfStudyEntryPage({
  params,
}: SelfStudyEntryPageProps) {
  const { slug } = await params;
  const entry = await getSelfStudyEntry(slug);

  if (!entry) {
    notFound();
  }

  const childSection = await hasChildEntries(slug);
  const content = await compileContent(entry.content);
  const formattedDate = formatDate(entry.frontMatter.updated ?? entry.frontMatter.date, "long");
  const title = entry.frontMatter.title ?? slug.at(-1) ?? "Self Study note";
  const description = entry.frontMatter.description ?? entry.frontMatter.intro;

  if (childSection) {
    return (
      <div className="page-wrap section-block">
        <ChapterHeader
          eyebrow="Self Study"
          title={title}
          description={description}
        />

        {entry.content.trim().length > 0 ? (
          <MdxContainer className="mt-10">{content}</MdxContainer>
        ) : null}

        <EditorialDivider className="my-12 md:my-14" />

        <section className="space-y-7">
          <div className="space-y-2">
            <p className="eyebrow">Inside this course</p>
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
      backHref="/self-study"
      backLabel="Back to self study"
      eyebrow="Self Study"
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
