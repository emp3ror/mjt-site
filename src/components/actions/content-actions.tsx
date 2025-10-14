"use client";

import {
  Bookmark,
  BookmarkCheck,
  CalendarPlus,
  ChevronDown,
  Facebook,
  Link2,
  Share2,
  ThumbsUp,
  Twitter,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import type { ReactNode } from "react";

import { cn } from "@/lib/cn";

type CalendarOption = {
  id: string;
  label: string;
  href: string;
  icon: LucideIcon;
  target?: string;
  rel?: string;
  downloadFilename?: string;
};

type CalendarConfig = {
  triggerLabel?: string;
  triggerIcon?: LucideIcon;
  options: CalendarOption[];
};

type BookmarkConfig = {
  storageKey: string;
  slug: string;
};

type ContentActionsProps = {
  itemId: string;
  title: string;
  description?: string;
  url: string;
  likeStorageKey?: string;
  bookmark?: BookmarkConfig;
  calendar?: CalendarConfig;
  className?: string;
  header?: ReactNode;
};

type CopyState = "idle" | "copied" | "error";

const iconButtonClass =
  "inline-flex h-10 w-10 items-center justify-center rounded-full border border-[color:var(--muted)]/50 bg-white/80 text-[color:var(--ink)]/70 transition hover:-translate-y-0.5 hover:bg-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[color:var(--accent)]";

export function ContentActions({
  itemId,
  title,
  description,
  url,
  likeStorageKey,
  bookmark,
  calendar,
  className,
  header,
}: ContentActionsProps) {
  const [origin, setOrigin] = useState<string | null>(null);
  const [liked, setLiked] = useState(false);
  const [bookmarked, setBookmarked] = useState(false);
  const [copyState, setCopyState] = useState<CopyState>("idle");
  const [calendarOpen, setCalendarOpen] = useState(false);
  const calendarMenuRef = useRef<HTMLDivElement | null>(null);

  const hasCalendar = Boolean(calendar?.options.length);
  const calendarMenuId = hasCalendar ? `content-actions-calendar-${itemId}` : undefined;
  const triggerLabel = calendar?.triggerLabel ?? "Add to calendar";
  const TriggerIcon = calendar?.triggerIcon ?? CalendarPlus;

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }
    setOrigin(window.location.origin);
  }, []);

  useEffect(() => {
    if (!likeStorageKey || typeof window === "undefined") {
      setLiked(false);
      return;
    }

    try {
      const stored = window.localStorage.getItem(likeStorageKey);
      if (!stored) {
        setLiked(false);
        return;
      }

      const items: string[] = JSON.parse(stored);
      setLiked(items.includes(itemId));
    } catch {
      setLiked(false);
    }
  }, [itemId, likeStorageKey]);

  useEffect(() => {
    if (!bookmark || typeof window === "undefined") {
      setBookmarked(false);
      return;
    }

    try {
      const stored = window.localStorage.getItem(bookmark.storageKey);
      if (!stored) {
        setBookmarked(false);
        return;
      }
      const items: string[] = JSON.parse(stored);
      setBookmarked(items.includes(bookmark.slug));
    } catch {
      setBookmarked(false);
    }
  }, [bookmark]);

  useEffect(() => {
    if (!hasCalendar || !calendarOpen || typeof document === "undefined") {
      return;
    }

    const handlePointer = (event: MouseEvent | TouchEvent) => {
      if (!calendarMenuRef.current) {
        return;
      }
      if (!calendarMenuRef.current.contains(event.target as Node)) {
        setCalendarOpen(false);
      }
    };

    const handleKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setCalendarOpen(false);
      }
    };

    document.addEventListener("mousedown", handlePointer);
    document.addEventListener("touchstart", handlePointer);
    document.addEventListener("keydown", handleKey);

    return () => {
      document.removeEventListener("mousedown", handlePointer);
      document.removeEventListener("touchstart", handlePointer);
      document.removeEventListener("keydown", handleKey);
    };
  }, [calendarOpen, hasCalendar]);

  const resolvedUrl = useMemo(() => {
    if (url.startsWith("http://") || url.startsWith("https://")) {
      return url;
    }

    if (!origin) {
      return url;
    }

    try {
      return new URL(url, origin).toString();
    } catch {
      return url;
    }
  }, [origin, url]);

  const facebookLink = useMemo(
    () => `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(resolvedUrl)}`,
    [resolvedUrl],
  );

  const twitterLink = useMemo(() => {
    const params = new URLSearchParams({
      url: resolvedUrl,
      text: title,
    });
    return `https://twitter.com/intent/tweet?${params.toString()}`;
  }, [resolvedUrl, title]);

  const copyButtonLabel = copyState === "copied" ? "Link copied" : copyState === "error" ? "Copy failed, try again" : "Copy link";

  const handleCopy = async () => {
    try {
      if (!navigator.clipboard) {
        throw new Error("Clipboard API unavailable");
      }
      await navigator.clipboard.writeText(resolvedUrl);
      setCopyState("copied");
    } catch {
      setCopyState("error");
    } finally {
      window.setTimeout(() => setCopyState("idle"), 2500);
    }
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title,
          text: description,
          url: resolvedUrl,
        });
        return;
      } catch {
        // fall back to copy below
      }
    }

    await handleCopy();
  };

  const toggleLike = () => {
    if (!likeStorageKey || typeof window === "undefined") {
      return;
    }

    try {
      const stored = window.localStorage.getItem(likeStorageKey);
      const nextItems: string[] = stored ? JSON.parse(stored) : [];

      if (liked) {
        const filtered = nextItems.filter((value) => value !== itemId);
        window.localStorage.setItem(likeStorageKey, JSON.stringify(filtered));
        setLiked(false);
        return;
      }

      if (!nextItems.includes(itemId)) {
        nextItems.push(itemId);
      }
      window.localStorage.setItem(likeStorageKey, JSON.stringify(nextItems));
      setLiked(true);
    } catch {
      // ignore storage errors; likes are optional extra UX
    }
  };

  const toggleBookmark = () => {
    if (!bookmark || typeof window === "undefined") {
      return;
    }

    try {
      const stored = window.localStorage.getItem(bookmark.storageKey);
      const nextItems: string[] = stored ? JSON.parse(stored) : [];

      if (bookmarked) {
        const filtered = nextItems.filter((value) => value !== bookmark.slug);
        window.localStorage.setItem(bookmark.storageKey, JSON.stringify(filtered));
        setBookmarked(false);
        return;
      }

      if (!nextItems.includes(bookmark.slug)) {
        nextItems.push(bookmark.slug);
      }
      window.localStorage.setItem(bookmark.storageKey, JSON.stringify(nextItems));
      setBookmarked(true);
    } catch {
      // ignore storage errors; bookmarking is an optional enhancement
    }
  };

  const toggleCalendarMenu = () => {
    if (!hasCalendar) {
      return;
    }
    setCalendarOpen((open) => !open);
  };

  const closeCalendarMenu = () => {
    setCalendarOpen(false);
  };

  return (
    <section
      className={cn(
        "space-y-4 rounded-3xl bg-white/80 p-6 shadow-[0_18px_45px_rgba(44,45,94,0.14)]",
        className,
      )}
    >
      {header}

      <div
        className={cn(
          "flex flex-col gap-3 sm:flex-row sm:items-center",
          hasCalendar ? "sm:justify-between" : "",
        )}
      >
        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            className={iconButtonClass}
            onClick={handleShare}
            title="Share"
            aria-label="Share item"
          >
            <Share2 className="h-4 w-4" aria-hidden />
          </button>

          <a
            className={cn(
              iconButtonClass,
              "border-[#1877F2]/40 bg-[#1877F2]/10 text-[#1459b6] hover:bg-[#1877F2]/20",
            )}
            href={facebookLink}
            target="_blank"
            rel="noreferrer"
            title="Share on Facebook"
            aria-label="Share on Facebook"
          >
            <Facebook className="h-4 w-4" aria-hidden />
          </a>

          <a
            className={cn(
              iconButtonClass,
              "border-[#0F1419]/30 bg-[#0F1419]/5 text-[#0F1419]/80 hover:bg-[#0F1419]/10",
            )}
            href={twitterLink}
            target="_blank"
            rel="noreferrer"
            title="Share on X"
            aria-label="Share on X"
          >
            <Twitter className="h-4 w-4" aria-hidden />
          </a>

          {bookmark ? (
            <button
              type="button"
              className={cn(
                iconButtonClass,
                bookmarked ? "border-[color:var(--accent)]/60 bg-[color:var(--accent)]/10 text-[color:var(--accent)]" : undefined,
              )}
              onClick={toggleBookmark}
              aria-label={bookmarked ? "Remove bookmark" : "Bookmark item"}
              aria-pressed={bookmarked}
              title={bookmarked ? "Remove bookmark" : "Bookmark"}
            >
              {bookmarked ? <BookmarkCheck className="h-4 w-4" aria-hidden /> : <Bookmark className="h-4 w-4" aria-hidden />}
            </button>
          ) : null}

          {likeStorageKey ? (
            <button
              type="button"
              className={cn(
                iconButtonClass,
                liked ? "border-[color:var(--accent)]/60 bg-[color:var(--accent)]/10 text-[color:var(--accent)]" : undefined,
              )}
              onClick={toggleLike}
              aria-label={liked ? "Remove like" : "Like item"}
              aria-pressed={liked}
              title={liked ? "Unlike" : "Like"}
            >
              <ThumbsUp className="h-4 w-4" aria-hidden />
            </button>
          ) : null}

          <button
            type="button"
            className={cn(
              iconButtonClass,
              copyState === "copied" ? "border-[color:var(--accent)]/60 bg-[color:var(--accent)]/10" : undefined,
              copyState === "error" ? "border-red-200 bg-red-50 text-red-600" : undefined,
            )}
            onClick={handleCopy}
            title={copyButtonLabel}
            aria-label={copyButtonLabel}
          >
            <Link2 className="h-4 w-4" aria-hidden />
          </button>
        </div>

        {hasCalendar ? (
          <div ref={calendarMenuRef} className="relative">
            <button
              type="button"
              className="inline-flex items-center gap-2 rounded-full border border-[color:var(--accent)]/40 bg-white/90 px-4 py-2 text-xs font-semibold uppercase tracking-[0.3em] text-[color:var(--accent)] transition hover:-translate-y-0.5 hover:bg-[color:var(--accent)]/10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[color:var(--accent)]"
              onClick={toggleCalendarMenu}
              aria-expanded={calendarOpen}
              aria-haspopup="menu"
              aria-controls={calendarMenuId}
            >
              <TriggerIcon className="h-4 w-4" aria-hidden />
              {triggerLabel}
              <ChevronDown className={cn("h-4 w-4 transition-transform", calendarOpen && "-scale-y-100")} aria-hidden />
            </button>

            {calendarOpen ? (
              <div
                id={calendarMenuId}
                role="menu"
                className="absolute right-0 z-20 mt-2 w-56 rounded-2xl border border-[color:var(--muted)]/60 bg-white/95 p-2 shadow-[0_12px_35px_rgba(44,45,94,0.16)] backdrop-blur"
              >
                {calendar?.options.map((option) => {
                  const OptionIcon = option.icon;
                  return (
                    <a
                      key={option.id}
                      className="flex items-center gap-2 rounded-xl px-3 py-2 text-sm text-[color:var(--ink)]/80 transition hover:bg-[color:var(--accent)]/10 hover:text-[color:var(--accent)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[color:var(--accent)]"
                      href={option.href}
                      target={option.target}
                      rel={option.rel}
                      role="menuitem"
                      onClick={closeCalendarMenu}
                      download={option.downloadFilename}
                    >
                      <OptionIcon className="h-4 w-4" aria-hidden />
                      {option.label}
                    </a>
                  );
                })}
              </div>
            ) : null}
          </div>
        ) : null}
      </div>
    </section>
  );
}
