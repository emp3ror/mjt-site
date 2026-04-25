import { cache } from "react";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { compileMDX } from "next-mdx-remote/rsc";
import rehypeAutolinkHeadings from "rehype-autolink-headings";
import rehypeSlug from "rehype-slug";

import { EventActions } from "@/components/events/event-actions";
import { LongformEntry } from "@/components/longform-entry";
import { MdxContainer, mdxComponents } from "@/components/mdx/mdx";
import { formatEventDateRange, formatEventPrimaryDate } from "@/lib/events";
import { allEvents } from "@/content";

const events = [...allEvents].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

const getEventFromParams = (slug: string) => events.find((event) => event.slug === slug);

type EventPageProps = {
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
        rehypePlugins: [rehypeSlug, [rehypeAutolinkHeadings, { behavior: "wrap" }]],
      },
    },
    components: mdxComponents,
  });

  return content;
});

export const generateStaticParams = async () => events.map((event) => ({ slug: event.slug }));

export const dynamicParams = false;

export async function generateMetadata({ params }: EventPageProps): Promise<Metadata> {
  const { slug } = await params;
  const event = getEventFromParams(slug);

  if (!event) {
    return {};
  }

  return {
    title: event.title,
    description: event.description,
    openGraph: {
      title: event.title,
      description: event.description,
      type: "website",
      url: event.url,
    },
  } satisfies Metadata;
}

export default async function EventPage({ params }: EventPageProps) {
  const { slug } = await params;
  const event = getEventFromParams(slug);

  if (!event) {
    notFound();
  }

  const content = await renderMdx(event.body.raw);
  const dateLabel = formatEventDateRange({
    date: event.date,
    endDate: event.endDate,
    startTime: event.startTime,
    endTime: event.endTime,
  });

  return (
    <LongformEntry
      className="longform-note"
      backHref="/events"
      backLabel="Back to gatherings"
      eyebrow="Gathering"
      title={event.title}
      description={event.description}
      meta={[
        { label: "Date", value: dateLabel },
        { label: "Filed", value: formatEventPrimaryDate({ date: event.date }) },
        { label: "Place", value: event.location },
        { label: "Type", value: event.category ?? "Event" },
      ]}
      actions={
        <EventActions
          event={{
            slug: event.slug,
            title: event.title,
            description: event.description,
            date: event.date,
            endDate: event.endDate,
            startTime: event.startTime,
            endTime: event.endTime,
            location: event.location,
            url: event.url,
          }}
        />
      }
    >
      <MdxContainer>{content}</MdxContainer>
    </LongformEntry>
  );
}
