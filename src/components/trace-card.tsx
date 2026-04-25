/**
 * Unified card that renders any "trace" (post, event, or study entry).
 * Three layout variants: `default` (grids), `feature` (large hero), and
 * `compact` (sidebars). Trace shapes come from `@/lib/traces`.
 */

import Link from "next/link";

import { cn } from "@/lib/cn";
import { formatTagLabel, slugifyTag } from "@/lib/tags";
import type { Trace } from "@/lib/traces";

type TraceCardProps = {
  trace: Trace;
  variant?: "default" | "feature" | "compact";
  className?: string;
};

const kindColorMap: Record<Trace["kind"], string> = {
  post: "text-[color:var(--accent-strong)]",
  event: "text-[color:var(--accent-alt)]",
  study: "text-[color:var(--accent)]",
};

export function TraceCard({
  trace,
  variant = "default",
  className,
}: TraceCardProps) {
  const isFeature = variant === "feature";
  const isCompact = variant === "compact";
  const meta = [trace.displayDate, trace.location, trace.distance].filter(Boolean);

  return (
    <article
      className={cn(
        "group relative overflow-hidden rounded-[1.5rem] border border-[color:var(--line)] bg-[linear-gradient(180deg,rgba(255,252,246,0.88),rgba(246,239,227,0.72))] shadow-[0_18px_44px_rgba(37,32,23,0.09)]",
        isFeature ? "p-8 md:p-10" : isCompact ? "p-5" : "p-7",
        className,
      )}
    >
      <div className="space-y-6">
        <div className="flex flex-wrap items-center gap-x-3 gap-y-2 text-[0.68rem] uppercase tracking-[0.28em] text-[color:var(--muted)]">
          <span className={cn("font-semibold", kindColorMap[trace.kind])}>{trace.kindLabel}</span>
          {trace.category ? <span>{trace.category.replace(/-/g, " ")}</span> : null}
          {trace.readingTime ? <span>{trace.readingTime}</span> : null}
        </div>

        <div className="space-y-3">
          <Link href={trace.href} className="block">
            <h2
              className={cn(
                "leading-[1.08] tracking-[-0.02em] text-[color:var(--foreground)] underline decoration-transparent underline-offset-6 transition group-hover:decoration-[color:var(--foreground)]",
                isFeature ? "text-[2.2rem] md:text-[2.85rem]" : isCompact ? "text-2xl" : "text-[2.1rem]",
              )}
            >
              {trace.title}
            </h2>
          </Link>
          {trace.description ? (
            <p
              className={cn(
                "max-w-2xl text-[color:var(--ink-soft)]",
                isFeature ? "text-[1.05rem] leading-8 md:text-[1.14rem]" : "text-[0.98rem] leading-8",
              )}
            >
              {trace.description}
            </p>
          ) : null}
        </div>

        {meta.length > 0 ? (
          <div className="flex flex-wrap items-center gap-x-3 gap-y-2 text-[0.95rem] text-[color:var(--ink-soft)]">
            {meta.map((item, index) => (
              <span key={`${item}-${index}`} className="flex items-center gap-3">
                {index > 0 ? <span aria-hidden className="h-px w-4 bg-[color:var(--line)]" /> : null}
                <span>{item}</span>
              </span>
            ))}
          </div>
        ) : null}

        {trace.tags.length > 0 ? (
          <div className="flex flex-wrap gap-2 pt-1 text-[0.72rem] uppercase tracking-[0.18em] text-[color:var(--muted)]">
            {trace.tags.slice(0, isCompact ? 2 : 4).map((tag) => (
              <Link
                key={tag}
                href={`/tags/${slugifyTag(tag)}`}
                className="px-0 py-1 hover:text-[color:var(--foreground)]"
              >
                #{formatTagLabel(tag)}
              </Link>
            ))}
          </div>
        ) : null}
      </div>
    </article>
  );
}
