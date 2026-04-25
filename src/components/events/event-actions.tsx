"use client";

/**
 * Event-specific wrapper around `ContentActions`. Adds Google / Outlook /
 * .ics calendar export options and a header that previews the event time.
 */

import { CalendarDays, CalendarPlus, Download } from "lucide-react";
import { useMemo } from "react";

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
  const origin = typeof window === "undefined" ? null : window.location.origin;

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
          <p className="eyebrow">Event tools</p>
          <p className="mt-2 text-sm leading-7 text-[color:var(--ink-soft)]">
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
