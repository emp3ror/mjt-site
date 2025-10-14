import Link from "next/link";

import { Card } from "@/components/card";
import { cn } from "@/lib/cn";
import { formatEventDateRange } from "@/lib/events";
import type { Event } from "contentlayer/generated";

type EventCardProps = {
  event: Event;
  className?: string;
};

export function EventCard({ event, className }: EventCardProps) {
  return (
    <Card className={cn("flex h-full flex-col gap-4", className)}>
      <div className="space-y-2">
        <span className="block text-xs font-semibold uppercase tracking-[0.3em] text-[color:var(--muted)]">
          {formatEventDateRange({
            date: event.date,
            endDate: event.endDate,
            startTime: event.startTime,
            endTime: event.endTime,
          })}
        </span>

        <Link
          href={event.url}
          className="block text-lg font-semibold text-[color:var(--ink)] transition hover:text-[color:var(--accent)]"
        >
          {event.title}
        </Link>
      </div>

      {event.description ? (
        <p className="text-sm text-[color:var(--ink)]/70">{event.description}</p>
      ) : null}

      {event.tags?.length ? (
        <div className="flex flex-wrap gap-2 text-xs font-semibold uppercase tracking-[0.25em] text-[color:var(--ink)]/55">
          {event.tags.map((tag) => (
            <span key={tag} className="rounded-full bg-white/70 px-3 py-1">
              {tag}
            </span>
          ))}
        </div>
      ) : null}

      <div className="mt-auto flex items-center justify-between text-xs font-semibold uppercase tracking-[0.25em] text-[color:var(--ink)]/50">
        <span>{event.category ?? "Event"}</span>
        {event.location ? (
          <span className="truncate text-right text-[color:var(--ink)]/60">{event.location}</span>
        ) : (
          <span aria-hidden>→</span>
        )}
      </div>
    </Card>
  );
}
