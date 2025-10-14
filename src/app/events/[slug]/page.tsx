import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { cache } from "react";

import { compileMDX } from "next-mdx-remote/rsc";
import rehypeAutolinkHeadings from "rehype-autolink-headings";
import rehypeSlug from "rehype-slug";

import { EventActions } from "@/components/events/event-actions";
import { MdxContainer, mdxComponents } from "@/components/mdx/mdx";
import { formatEventDateRange, formatEventPrimaryDate } from "@/lib/events";
import { allEvents } from "contentlayer/generated";

const events = [...allEvents].sort(
  (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
);

const getEventFromParams = (slug: string) =>
  events.find((event) => event.slug === slug);

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
  events.map((event) => ({ slug: event.slug }));

export const dynamicParams = false;

export async function generateMetadata({
  params,
}: EventPageProps): Promise<Metadata> {
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
    <article className="mx-auto flex min-h-screen max-w-3xl flex-col gap-12 px-6 pb-24 pt-16">
      <nav className="text-sm text-neutral-500">
        <Link className="hover:text-blue-600" href="/events">
          ← Back to all events
        </Link>
      </nav>

      <header className="space-y-6">
        <div className="space-y-2">
          <span className="text-xs uppercase tracking-[0.25em] text-neutral-400">
            {event.category ?? "Event"} · {formatEventPrimaryDate({ date: event.date })}
          </span>
          <h1 className="text-4xl font-semibold tracking-tight text-neutral-900 dark:text-neutral-100">
            {event.title}
          </h1>
        </div>

        {event.description ? (
          <p className="text-base text-neutral-600 dark:text-neutral-300">{event.description}</p>
        ) : null}

        <div className="flex flex-wrap items-center gap-3 text-sm text-neutral-500">
          <span>{dateLabel}</span>
          {event.location ? (
            <>
              <span aria-hidden>•</span>
              <span>{event.location}</span>
            </>
          ) : null}
        </div>

        {event.tags?.length ? (
          <div className="flex flex-wrap gap-2 text-xs font-semibold uppercase tracking-[0.25em] text-neutral-500">
            {event.tags.map((tag) => (
              <span key={tag} className="rounded-full bg-neutral-100 px-3 py-1 dark:bg-neutral-900">
                {tag}
              </span>
            ))}
          </div>
        ) : null}
      </header>

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

      <section className="space-y-6">
        <MdxContainer>{content}</MdxContainer>
      </section>
    </article>
  );
}
