"use client";

import {
  Bookmark,
  BookmarkCheck,
  CalendarDays,
  CalendarPlus,
  ChevronDown,
  Download,
  Facebook,
  Link2,
  Share2,
  ThumbsUp,
  Twitter,
} from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";

import { buildGoogleCalendarLink, buildIcsDataUri, buildMicrosoftCalendarLink } from "@/lib/calendar";
import { formatEventDateRange } from "@/lib/events";
import { cn } from "@/lib/cn";

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
  const [bookmarked, setBookmarked] = useState(false);
  const [liked, setLiked] = useState(false);
  const [copyState, setCopyState] = useState<"idle" | "copied" | "error">("idle");
  const [calendarOpen, setCalendarOpen] = useState(false);
  const calendarMenuRef = useRef<HTMLDivElement | null>(null);

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
  const facebookLink = useMemo(
    () => `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(eventUrl)}`,
    [eventUrl],
  );
  const twitterLink = useMemo(() => {
    const params = new URLSearchParams({
      url: eventUrl,
      text: event.title,
    });
    return `https://twitter.com/intent/tweet?${params.toString()}`;
  }, [event.title, eventUrl]);

  useEffect(() => {
    setOrigin(window.location.origin);

    try {
      const stored = window.localStorage.getItem(BOOKMARK_KEY);
      if (!stored) {
        return;
      }
      const items: string[] = JSON.parse(stored);
      setBookmarked(items.includes(event.slug));
    } catch {
      setBookmarked(false);
    }

    try {
      const storedLikes = window.localStorage.getItem(LIKE_KEY);
      if (!storedLikes) {
        setLiked(false);
        return;
      }
      const items: string[] = JSON.parse(storedLikes);
      setLiked(items.includes(event.slug));
    } catch {
      setLiked(false);
    }
  }, [event.slug]);

  useEffect(() => {
    if (!calendarOpen) {
      return;
    }

    const handlePointerEvent = (eventTarget: MouseEvent | TouchEvent) => {
      if (!calendarMenuRef.current) {
        return;
      }

      if (!calendarMenuRef.current.contains(eventTarget.target as Node)) {
        setCalendarOpen(false);
      }
    };

    const handleKey = (eventTarget: KeyboardEvent) => {
      if (eventTarget.key === "Escape") {
        setCalendarOpen(false);
      }
    };

    document.addEventListener("mousedown", handlePointerEvent);
    document.addEventListener("touchstart", handlePointerEvent);
    document.addEventListener("keydown", handleKey);

    return () => {
      document.removeEventListener("mousedown", handlePointerEvent);
      document.removeEventListener("touchstart", handlePointerEvent);
      document.removeEventListener("keydown", handleKey);
    };
  }, [calendarOpen]);

  const handleCopyLink = async () => {
    if (!eventUrl) {
      return;
    }

    try {
      if (!navigator.clipboard) {
        throw new Error("Clipboard API unavailable");
      }
      await navigator.clipboard.writeText(eventUrl);
      setCopyState("copied");
      setTimeout(() => setCopyState("idle"), 2500);
    } catch {
      setCopyState("error");
      setTimeout(() => setCopyState("idle"), 2500);
    }
  };

  const handleShare = async () => {
    if (!eventUrl) {
      return;
    }

    if (navigator.share) {
      try {
        await navigator.share({
          title: event.title,
          text: event.description,
          url: eventUrl,
        });
        return;
      } catch {
        // If the user cancels, fall back to copying.
      }
    }

    await handleCopyLink();
  };

  const toggleBookmark = () => {
    try {
      const stored = window.localStorage.getItem(BOOKMARK_KEY);
      const nextItems: string[] = stored ? JSON.parse(stored) : [];

      if (bookmarked) {
        const filtered = nextItems.filter((item) => item !== event.slug);
        window.localStorage.setItem(BOOKMARK_KEY, JSON.stringify(filtered));
        setBookmarked(false);
      } else {
        if (!nextItems.includes(event.slug)) {
          nextItems.push(event.slug);
        }
        window.localStorage.setItem(BOOKMARK_KEY, JSON.stringify(nextItems));
        setBookmarked(true);
      }
    } catch {
      // Ignore storage errors silently; bookmarking is optional.
    }
  };

  const toggleLike = () => {
    try {
      const stored = window.localStorage.getItem(LIKE_KEY);
      const nextItems: string[] = stored ? JSON.parse(stored) : [];

      if (liked) {
        const filtered = nextItems.filter((item) => item !== event.slug);
        window.localStorage.setItem(LIKE_KEY, JSON.stringify(filtered));
        setLiked(false);
        return;
      }

      if (!nextItems.includes(event.slug)) {
        nextItems.push(event.slug);
      }
      window.localStorage.setItem(LIKE_KEY, JSON.stringify(nextItems));
      setLiked(true);
    } catch {
      // ignore storage errors
    }
  };

  const toggleCalendarMenu = () => {
    setCalendarOpen((open) => !open);
  };

  const closeCalendarMenu = () => {
    setCalendarOpen(false);
  };

  const iconButtonClass =
    "inline-flex h-10 w-10 items-center justify-center rounded-full border border-[color:var(--muted)]/50 bg-white/80 text-[color:var(--ink)]/70 transition hover:-translate-y-0.5 hover:bg-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[color:var(--accent)]";

  const copyButtonLabel =
    copyState === "copied" ? "Event link copied" : copyState === "error" ? "Copy failed, try again" : "Copy event link";

  const calendarMenuId = `event-calendar-menu-${event.slug}`;

  return (
    <section className="space-y-4 rounded-3xl border border-[color:var(--muted)]/50 bg-white/80 p-6 shadow-[0_18px_45px_rgba(44,45,94,0.14)]">
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

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-wrap items-center gap-2">
          <button type="button" className={iconButtonClass} onClick={handleShare} title="Share" aria-label="Share event">
            <Share2 className="h-4 w-4" aria-hidden />
          </button>

          <a
            className={cn(iconButtonClass, "border-[#1877F2]/40 bg-[#1877F2]/10 text-[#1459b6] hover:bg-[#1877F2]/20")}
            href={facebookLink}
            target="_blank"
            rel="noreferrer"
            title="Share on Facebook"
            aria-label="Share on Facebook"
          >
            <Facebook className="h-4 w-4" aria-hidden />
          </a>

          <a
            className={cn(iconButtonClass, "border-[#0F1419]/30 bg-[#0F1419]/5 text-[#0F1419]/80 hover:bg-[#0F1419]/10")}
            href={twitterLink}
            target="_blank"
            rel="noreferrer"
            title="Share on X"
            aria-label="Share on X"
          >
            <Twitter className="h-4 w-4" aria-hidden />
          </a>

          <button
            type="button"
            className={cn(
              iconButtonClass,
              bookmarked ? "border-[color:var(--accent)]/60 bg-[color:var(--accent)]/10 text-[color:var(--accent)]" : undefined,
            )}
            onClick={toggleBookmark}
            aria-label={bookmarked ? "Remove bookmark" : "Bookmark event"}
            aria-pressed={bookmarked}
            title={bookmarked ? "Remove bookmark" : "Bookmark"}
          >
            {bookmarked ? <BookmarkCheck className="h-4 w-4" aria-hidden /> : <Bookmark className="h-4 w-4" aria-hidden />}
          </button>

          <button
            type="button"
            className={cn(
              iconButtonClass,
              liked ? "border-[color:var(--accent)]/60 bg-[color:var(--accent)]/10 text-[color:var(--accent)]" : undefined,
            )}
            onClick={toggleLike}
            aria-label={liked ? "Remove like" : "Like event"}
            aria-pressed={liked}
            title={liked ? "Unlike" : "Like"}
          >
            <ThumbsUp className="h-4 w-4" aria-hidden />
          </button>

          <button
            type="button"
            className={cn(
              iconButtonClass,
              copyState === "copied" ? "border-[color:var(--accent)]/60 bg-[color:var(--accent)]/10" : undefined,
              copyState === "error" ? "border-red-200 bg-red-50 text-red-600" : undefined,
            )}
            onClick={handleCopyLink}
            title={copyButtonLabel}
            aria-label={copyButtonLabel}
          >
            <Link2 className="h-4 w-4" aria-hidden />
          </button>
        </div>

        <div ref={calendarMenuRef} className="relative">
          <button
            type="button"
            className="inline-flex items-center gap-2 rounded-full border border-[color:var(--accent)]/40 bg-white/90 px-4 py-2 text-xs font-semibold uppercase tracking-[0.3em] text-[color:var(--accent)] transition hover:-translate-y-0.5 hover:bg-[color:var(--accent)]/10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[color:var(--accent)]"
            onClick={toggleCalendarMenu}
            aria-expanded={calendarOpen}
            aria-haspopup="menu"
            aria-controls={calendarMenuId}
          >
            <CalendarPlus className="h-4 w-4" aria-hidden />
            Add to calendar
            <ChevronDown className={cn("h-4 w-4 transition-transform", calendarOpen && "-scale-y-100")} aria-hidden />
          </button>

          {calendarOpen ? (
            <div
              id={calendarMenuId}
              role="menu"
              className="absolute right-0 z-20 mt-2 w-56 rounded-2xl border border-[color:var(--muted)]/60 bg-white/95 p-2 shadow-[0_12px_35px_rgba(44,45,94,0.16)] backdrop-blur"
            >
              <a
                className="flex items-center gap-2 rounded-xl px-3 py-2 text-sm text-[color:var(--ink)]/80 transition hover:bg-[color:var(--accent)]/10 hover:text-[color:var(--accent)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[color:var(--accent)]"
                href={googleLink}
                target="_blank"
                rel="noreferrer"
                role="menuitem"
                onClick={closeCalendarMenu}
              >
                <CalendarPlus className="h-4 w-4" aria-hidden />
                Google Calendar
              </a>
              <a
                className="flex items-center gap-2 rounded-xl px-3 py-2 text-sm text-[color:var(--ink)]/80 transition hover:bg-[color:var(--accent)]/10 hover:text-[color:var(--accent)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[color:var(--accent)]"
                href={microsoftLink}
                target="_blank"
                rel="noreferrer"
                role="menuitem"
                onClick={closeCalendarMenu}
              >
                <CalendarDays className="h-4 w-4" aria-hidden />
                Microsoft Outlook
              </a>
              <a
                className="flex items-center gap-2 rounded-xl px-3 py-2 text-sm text-[color:var(--ink)]/80 transition hover:bg-[color:var(--accent)]/10 hover:text-[color:var(--accent)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[color:var(--accent)]"
                href={icsHref}
                download={`${event.slug}.ics`}
                role="menuitem"
                onClick={closeCalendarMenu}
              >
                <Download className="h-4 w-4" aria-hidden />
                Download .ics
              </a>
            </div>
          ) : null}
        </div>
      </div>
    </section>
  );
}
