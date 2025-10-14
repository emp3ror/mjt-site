"use client";

import { Facebook, Link2, Share2, ThumbsUp, Twitter } from "lucide-react";
import { useEffect, useMemo, useState } from "react";

import { cn } from "@/lib/cn";

type ShareToolbarProps = {
  itemId: string;
  title: string;
  description?: string;
  url: string;
  className?: string;
};

const LIKE_STORAGE_KEY = "mjt-liked-items";

export function ShareToolbar({ itemId, title, description, url, className }: ShareToolbarProps) {
  const [origin, setOrigin] = useState<string | null>(null);
  const [liked, setLiked] = useState(false);
  const [copyState, setCopyState] = useState<"idle" | "copied" | "error">("idle");

  const absoluteUrl = useMemo(() => {
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

  const facebookUrl = useMemo(
    () => `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(absoluteUrl)}`,
    [absoluteUrl],
  );

  const twitterUrl = useMemo(() => {
    const params = new URLSearchParams({
      url: absoluteUrl,
      text: title,
    });

    return `https://twitter.com/intent/tweet?${params.toString()}`;
  }, [absoluteUrl, title]);

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    setOrigin(window.location.origin);

    try {
      const stored = window.localStorage.getItem(LIKE_STORAGE_KEY);
      if (!stored) {
        return;
      }

      const parsed: string[] = JSON.parse(stored);
      setLiked(parsed.includes(itemId));
    } catch {
      setLiked(false);
    }
  }, [itemId]);

  const handleCopy = async () => {
    try {
      if (!navigator.clipboard) {
        throw new Error("Clipboard not available");
      }
      await navigator.clipboard.writeText(absoluteUrl);
      setCopyState("copied");
    } catch {
      setCopyState("error");
    } finally {
      window.setTimeout(() => setCopyState("idle"), 2500);
    }
  };

  const handleShare = async () => {
    if (!origin) {
      setCopyState("error");
      setTimeout(() => setCopyState("idle"), 2500);
      return;
    }

    if (navigator.share) {
      try {
        await navigator.share({
          title,
          text: description,
          url: absoluteUrl,
        });
        return;
      } catch {
        // fall back to copying the link
      }
    }

    await handleCopy();
  };

  const toggleLike = () => {
    try {
      const stored = window.localStorage.getItem(LIKE_STORAGE_KEY);
      const parsed: string[] = stored ? JSON.parse(stored) : [];

      if (liked) {
        const next = parsed.filter((value) => value !== itemId);
        window.localStorage.setItem(LIKE_STORAGE_KEY, JSON.stringify(next));
        setLiked(false);
        return;
      }

      if (!parsed.includes(itemId)) {
        parsed.push(itemId);
      }

      window.localStorage.setItem(LIKE_STORAGE_KEY, JSON.stringify(parsed));
      setLiked(true);
    } catch {
      // ignore storage errors; liking is optional UX sugar
    }
  };

  return (
    <section
      className={cn(
        "space-y-4 rounded-3xl border border-[color:var(--muted)]/50 bg-white/80 p-6 shadow-[0_18px_45px_rgba(44,45,94,0.14)]",
        className,
      )}
    >
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-[color:var(--muted)]">
          Share this article
        </p>
        <p className="mt-1 text-sm text-[color:var(--ink)]/70">
          Spread the word or leave a quick like to keep this thread in your personal rotation.
        </p>
      </div>

      <div className="flex flex-wrap gap-3">
        <button
          type="button"
          className="inline-flex items-center gap-2 rounded-full border border-[color:var(--muted)]/50 bg-white/85 px-4 py-2 text-xs font-semibold uppercase tracking-[0.3em] text-[color:var(--ink)]/70 transition hover:-translate-y-0.5 hover:bg-white"
          onClick={handleShare}
        >
          <Share2 className="h-4 w-4" aria-hidden />
          Share
        </button>

        <a
          className="inline-flex items-center gap-2 rounded-full border border-[#1877F2]/40 bg-[#1877F2]/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.3em] text-[#1459b6] transition hover:-translate-y-0.5 hover:bg-[#1877F2]/20"
          href={facebookUrl}
          target="_blank"
          rel="noreferrer"
        >
          <Facebook className="h-4 w-4" aria-hidden />
          Facebook
        </a>

        <a
          className="inline-flex items-center gap-2 rounded-full border border-[#0F1419]/30 bg-[#0F1419]/5 px-4 py-2 text-xs font-semibold uppercase tracking-[0.3em] text-[#0F1419]/80 transition hover:-translate-y-0.5 hover:bg-[#0F1419]/10"
          href={twitterUrl}
          target="_blank"
          rel="noreferrer"
        >
          <Twitter className="h-4 w-4" aria-hidden />
          Tweet
        </a>
      </div>

      <div className="flex flex-wrap gap-3">
        <button
          type="button"
          className="inline-flex items-center gap-2 rounded-full border border-[color:var(--muted)]/50 bg-white/80 px-4 py-2 text-xs font-semibold uppercase tracking-[0.3em] text-[color:var(--ink)]/70 transition hover:-translate-y-0.5 hover:bg-white"
          onClick={handleCopy}
        >
          <Link2 className="h-4 w-4" aria-hidden />
          {copyState === "copied" ? "Copied!" : copyState === "error" ? "Try again" : "Copy link"}
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
      </div>
    </section>
  );
}
