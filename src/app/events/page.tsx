import { cache } from "react";

import { compileMDX } from "next-mdx-remote/rsc";

import { ChapterHeader } from "@/components/chapter-header";
import { EditorialDivider } from "@/components/editorial-divider";
import { MdxContainer, mdxComponents } from "@/components/mdx/mdx";
import { TraceCard } from "@/components/trace-card";
import { normalizeEventDates } from "@/lib/events";
import { eventToTrace } from "@/lib/traces";
import { allEvents, allEventsOverviews, type Event, type Overview } from "@/content";

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
  past.sort((a, b) => new Date(b.endDate ?? b.date).getTime() - new Date(a.endDate ?? a.date).getTime());

  return { upcoming, past };
};

export default async function EventsPage() {
  const events = [...allEvents];
  const overview: Overview | undefined = allEventsOverviews[0];
  const overviewContent = overview ? await renderOverview(overview.body.raw) : null;
  const { upcoming, past } = splitEvents(events);

  return (
    <div className="page-wrap section-block">
      <ChapterHeader
        eyebrow="Chapter"
        title={overview?.title ?? "Gatherings"}
        description={
          overview?.description ??
          "Workshops, sessions, and shared public moments collected alongside the rest of the archive."
        }
      />

      {overview?.intro ? (
        <p className="body-copy mt-6 text-[color:var(--ink-soft)]">
          {overview.intro}
        </p>
      ) : null}

      {overviewContent ? (
        <div className="mt-10">
          <MdxContainer>{overviewContent}</MdxContainer>
        </div>
      ) : null}

      {upcoming.length > 0 ? (
        <section className="mt-14 space-y-7">
          <div className="space-y-2">
            <p className="eyebrow">Upcoming</p>
            <h2 className="text-[2rem] leading-[1.08] tracking-[-0.02em] md:text-[2.55rem]">Next gatherings on the calendar.</h2>
          </div>
          <div className="trace-grid">
            {upcoming.map((event, index) => (
              <TraceCard
                key={event._id}
                trace={eventToTrace(event)}
                className={index % 2 === 0 ? "md:col-span-7" : "md:col-span-5"}
              />
            ))}
          </div>
        </section>
      ) : null}

      {past.length > 0 ? (
        <>
          <EditorialDivider className="my-12 md:my-14" />
          <section className="space-y-7">
            <div className="space-y-2">
              <p className="eyebrow">Archive</p>
              <h2 className="text-[2rem] leading-[1.08] tracking-[-0.02em] md:text-[2.55rem]">Past sessions and recaps.</h2>
            </div>
            <div className="trace-grid">
              {past.map((event, index) => (
                <TraceCard
                  key={event._id}
                  trace={eventToTrace(event)}
                  className={index % 2 === 0 ? "md:col-span-7" : "md:col-span-5"}
                />
              ))}
            </div>
          </section>
        </>
      ) : null}
    </div>
  );
}
