"use client";

import { CalendarDays, CalendarPlus, Download } from "lucide-react";
import { useEffect, useMemo, useState } from "react";

import { ContentActions } from "@/components/actions/content-actions";
import { buildGoogleCalendarLink, buildIcsDataUri, buildMicrosoftCalendarLink } from "@/lib/calendar";
import { formatEventDateRange } from "@/lib/events";

type EventActionsProps = {
  event: {
    slug: string;
    title: string;
    description?: string;
    date: string;
    endDate?: string;
    startTime?: string;
    endTime?: string;
    location?: string;
    url: string;
  };
};

const BOOKMARK_KEY = "mjt-bookmarked-events";
const LIKE_KEY = "mjt-liked-events";

export function EventActions({ event }: EventActionsProps) {
  const [origin, setOrigin] = useState<string | null>(null);

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }
    setOrigin(window.location.origin);
  }, []);

  const eventUrl = useMemo(() => {
    if (!origin) {
      return event.url;
    }
    return `${origin}${event.url}`;
  }, [event.url, origin]);

  const calendarData = useMemo(
    () => ({
      title: event.title,
      description: event.description,
      location: event.location,
      date: event.date,
      endDate: event.endDate,
      startTime: event.startTime,
      endTime: event.endTime,
      url: eventUrl,
    }),
    [event.date, event.description, event.endDate, event.endTime, event.location, event.startTime, event.title, eventUrl],
  );

  const googleLink = useMemo(() => buildGoogleCalendarLink(calendarData), [calendarData]);
  const microsoftLink = useMemo(() => buildMicrosoftCalendarLink(calendarData), [calendarData]);
  const icsHref = useMemo(() => buildIcsDataUri(calendarData), [calendarData]);

  return (
    <ContentActions
      itemId={event.slug}
      title={event.title}
      description={event.description}
      url={eventUrl}
      likeStorageKey={LIKE_KEY}
      bookmark={{ storageKey: BOOKMARK_KEY, slug: event.slug }}
      calendar={{
        options: [
          {
            id: "google",
            label: "Google Calendar",
            href: googleLink,
            icon: CalendarPlus,
            target: "_blank",
            rel: "noreferrer",
          },
          {
            id: "microsoft",
            label: "Microsoft Outlook",
            href: microsoftLink,
            icon: CalendarDays,
            target: "_blank",
            rel: "noreferrer",
          },
          {
            id: "ics",
            label: "Download .ics",
            href: icsHref,
            icon: Download,
            downloadFilename: `${event.slug}.ics`,
          },
        ],
      }}
      header={
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-[color:var(--muted)]">Event tools</p>
          <p className="mt-1 text-sm text-[color:var(--ink)]/70">
            {formatEventDateRange({
              date: event.date,
              endDate: event.endDate,
              startTime: event.startTime,
              endTime: event.endTime,
            })}
            {event.location ? ` · ${event.location}` : ""}
          </p>
        </div>
      }
    />
  );
}
