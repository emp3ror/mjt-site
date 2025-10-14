"use client";

import { Bookmark, BookmarkCheck, CalendarPlus, Download, Facebook, Link2, Share2, ThumbsUp, Twitter } from "lucide-react";
import { useEffect, useMemo, useState } from "react";

import { buildGoogleCalendarLink, buildIcsDataUri } from "@/lib/calendar";
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

  return (
    <section className="space-y-4 rounded-3xl border border-[color:var(--muted)]/50 bg-white/80 p-6 shadow-[0_18px_45px_rgba(44,45,94,0.14)]">
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-[color:var(--muted)]">
          Event tools
        </p>
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

      <div className="flex flex-wrap gap-3">
        <a
          className="inline-flex items-center gap-2 rounded-full border border-[color:var(--accent)]/40 bg-white/90 px-4 py-2 text-xs font-semibold uppercase tracking-[0.3em] text-[color:var(--accent)] transition hover:-translate-y-0.5 hover:bg-[color:var(--accent)]/10"
          href={googleLink}
          target="_blank"
          rel="noreferrer"
        >
          <CalendarPlus className="h-4 w-4" aria-hidden />
          Google Calendar
        </a>
        <a
          className="inline-flex items-center gap-2 rounded-full border border-[color:var(--muted)]/60 bg-white px-4 py-2 text-xs font-semibold uppercase tracking-[0.3em] text-[color:var(--ink)]/70 transition hover:-translate-y-0.5 hover:bg-white/80"
          href={icsHref}
          download={`${event.slug}.ics`}
        >
          <Download className="h-4 w-4" aria-hidden />
          Download .ics
        </a>
      </div>

      <div className="flex flex-wrap gap-3">
        <a
          className="inline-flex items-center gap-2 rounded-full border border-[#1877F2]/40 bg-[#1877F2]/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.3em] text-[#1459b6] transition hover:-translate-y-0.5 hover:bg-[#1877F2]/20"
          href={facebookLink}
          target="_blank"
          rel="noreferrer"
        >
          <Facebook className="h-4 w-4" aria-hidden />
          Facebook
        </a>

        <a
          className="inline-flex items-center gap-2 rounded-full border border-[#0F1419]/30 bg-[#0F1419]/5 px-4 py-2 text-xs font-semibold uppercase tracking-[0.3em] text-[#0F1419]/80 transition hover:-translate-y-0.5 hover:bg-[#0F1419]/10"
          href={twitterLink}
          target="_blank"
          rel="noreferrer"
        >
          <Twitter className="h-4 w-4" aria-hidden />
          Tweet
        </a>

        <button
          type="button"
          className="inline-flex items-center gap-2 rounded-full border border-[color:var(--muted)]/50 bg-white/80 px-4 py-2 text-xs font-semibold uppercase tracking-[0.3em] text-[color:var(--ink)]/70 transition hover:-translate-y-0.5 hover:bg-white"
          onClick={handleShare}
        >
          <Share2 className="h-4 w-4" aria-hidden />
          Share
        </button>

        <button
          type="button"
          className="inline-flex items-center gap-2 rounded-full border border-[color:var(--muted)]/50 bg-white/80 px-4 py-2 text-xs font-semibold uppercase tracking-[0.3em] text-[color:var(--ink)]/70 transition hover:-translate-y-0.5 hover:bg-white"
          onClick={toggleBookmark}
        >
          {bookmarked ? (
            <BookmarkCheck className="h-4 w-4 text-[color:var(--accent)]" aria-hidden />
          ) : (
            <Bookmark className="h-4 w-4" aria-hidden />
          )}
          {bookmarked ? "Bookmarked" : "Bookmark"}
        </button>

        <button
          type="button"
          className={cn(
            "inline-flex items-center gap-2 rounded-full border px-4 py-2 text-xs font-semibold uppercase tracking-[0.3em] transition hover:-translate-y-0.5",
            liked
              ? "border-[color:var(--accent)]/50 bg-[color:var(--accent)]/10 text-[color:var(--accent)]"
              : "border-[color:var(--muted)]/50 bg-white/80 text-[color:var(--ink)]/70 hover:bg-white",
          )}
          onClick={toggleLike}
        >
          <ThumbsUp className="h-4 w-4" aria-hidden />
          {liked ? "Liked" : "Like"}
        </button>

        <button
          type="button"
          className="inline-flex items-center gap-2 rounded-full border border-[color:var(--muted)]/50 bg-white/80 px-4 py-2 text-xs font-semibold uppercase tracking-[0.3em] text-[color:var(--ink)]/70 transition hover:-translate-y-0.5 hover:bg-white"
          onClick={handleCopyLink}
        >
          <Link2 className="h-4 w-4" aria-hidden />
          {copyState === "copied" ? "Copied!" : copyState === "error" ? "Try again" : "Copy link"}
        </button>
      </div>
    </section>
  );
}
