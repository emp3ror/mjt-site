import { cache } from "react";

import { compileMDX } from "next-mdx-remote/rsc";

import { Badge } from "@/components/badge";
import { DoodleDivider } from "@/components/doodle-divider";
import { EventCard } from "@/components/events/event-card";
import { MdxContainer, mdxComponents } from "@/components/mdx/mdx";
import { SectionHeading } from "@/components/section-heading";
import { normalizeEventDates } from "@/lib/events";
import type { Event, EventsOverview } from "contentlayer/generated";
import { allEvents, allEventsOverviews } from "contentlayer/generated";

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

const splitEvents = (events: Event[]) => {
  const now = new Date();

  const upcoming: Event[] = [];
  const past: Event[] = [];

  events.forEach((event) => {
    const dates = normalizeEventDates({
      date: event.date,
      endDate: event.endDate,
      startTime: event.startTime,
      endTime: event.endTime,
    });

    if (dates.endCalendar >= now) {
      upcoming.push(event);
    } else {
      past.push(event);
    }
  });

  upcoming.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  past.sort(
    (a, b) =>
      new Date(b.endDate ?? b.date).getTime() - new Date(a.endDate ?? a.date).getTime(),
  );

  return { upcoming, past };
};

const formatDate = (value: string) =>
  new Intl.DateTimeFormat("en", {
    year: "numeric",
    month: "short",
    day: "2-digit",
  }).format(new Date(value));

export default async function EventsPage() {
  const events = [...allEvents];
  const overview: EventsOverview | undefined = allEventsOverviews[0];
  const overviewContent = overview ? await renderOverview(overview.body.raw) : null;

  const { upcoming, past } = splitEvents(events);

  return (
    <div className="relative mx-auto flex min-h-screen max-w-6xl flex-col gap-20 px-6 pb-24 pt-24">
      <section className="space-y-6">
        <Badge className="bg-white/85 text-[color:var(--accent)]">Field gatherings</Badge>
        <SectionHeading
          title={overview?.title ?? "Field gatherings & studio sessions"}
          description={overview?.description ?? "Workshops, pop-ups, and residencies you can join."}
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
      </section>

      <DoodleDivider variant="cloud" colorClassName="text-[color:var(--muted)]/50" />

      {upcoming.length > 0 ? (
        <section className="space-y-6">
          <SectionHeading
            title="Upcoming sessions"
            description="Hold your spot for the next in-person workshop or field study."
          />

          <div className="grid gap-8 md:grid-cols-2 xl:grid-cols-3">
            {upcoming.map((event) => (
              <EventCard key={event._id} event={event} />
            ))}
          </div>
        </section>
      ) : null}

      {past.length > 0 ? (
        <section className="space-y-6">
          <SectionHeading
            title="Recent archives"
            description="Notes and recaps from previous events you can revisit anytime."
          />

          <div className="grid gap-8 md:grid-cols-2 xl:grid-cols-3">
            {past.map((event) => (
              <EventCard key={event._id} event={event} />
            ))}
          </div>
        </section>
      ) : null}

      {events.length === 0 ? (
        <div className="rounded-[2.5rem] border border-dashed border-[color:var(--muted)]/60 bg-white/70 px-8 py-16 text-center text-sm text-[color:var(--ink)]/60">
          <p className="text-lg font-semibold text-[color:var(--ink)]">No events yet</p>
          <p className="mt-2">The calendar is open. Check back soon for new workshops and pop-ups.</p>
        </div>
      ) : null}
    </div>
  );
}
