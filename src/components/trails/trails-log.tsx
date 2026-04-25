/**
 * Archive-grade list view for tracked routes — the "ledger" sibling to the
 * home `TrailsSection`. Shares the same data shape (`Trail`) and visual
 * primitives (`RouteSilhouette`, `TrailStatRow`) but rearranges them into a
 * dense, scrollable log: route thumbnail · title + description · stats per
 * row. Optional kind filter chips group routes when the archive grows.
 *
 * Server-renderable; no client JS required for the log itself.
 */

import Link from "next/link";

import { RouteSilhouette } from "@/components/trails/route-silhouette";
import { TrailStatRow } from "@/components/trails/trail-stats";
import type { Trail, TrailKind } from "@/lib/trails";
import { cn } from "@/lib/cn";

type Labels = {
  kind: Record<TrailKind, string>;
  emptyMessage?: string;
};

type Props = {
  trails: Trail[];
  formatDate: (value?: string) => string;
  labels?: Partial<Labels>;
  className?: string;
  showHeader?: boolean;
};

const DEFAULT_LABELS: Labels = {
  kind: { hike: "Hike", run: "Run" },
  emptyMessage: "No tracked routes have landed in the archive yet.",
};

export function TrailsLog({
  trails,
  formatDate,
  labels,
  className,
  showHeader = true,
}: Props) {
  const finalLabels: Labels = {
    kind: { ...DEFAULT_LABELS.kind, ...(labels?.kind ?? {}) },
    emptyMessage: labels?.emptyMessage ?? DEFAULT_LABELS.emptyMessage,
  };

  if (trails.length === 0) {
    return (
      <p className="body-copy text-[color:var(--ink-soft)]">
        {finalLabels.emptyMessage}
      </p>
    );
  }

  return (
    <div className={cn("trail-log", className)} role="list" aria-label="Tracked routes">
      {showHeader ? (
        <div
          aria-hidden
          className="hidden grid-cols-[7rem_minmax(0,1.4fr)_minmax(0,1fr)_auto] items-center gap-7 border-b border-[color:var(--line)] pb-3 text-[0.62rem] uppercase tracking-[0.28em] text-[color:var(--muted)] md:grid"
        >
          <span>Route</span>
          <span>Entry</span>
          <span>Stats</span>
          <span className="justify-self-end">Open</span>
        </div>
      ) : null}

      {trails.map((trail) => (
        <TrailLogRow
          key={trail.id}
          trail={trail}
          formatDate={formatDate}
          kindLabel={finalLabels.kind[trail.kind]}
        />
      ))}
    </div>
  );
}

type RowProps = {
  trail: Trail;
  formatDate: (value?: string) => string;
  kindLabel: string;
};

function TrailLogRow({ trail, formatDate, kindLabel }: RowProps) {
  return (
    <Link
      href={trail.url}
      role="listitem"
      aria-label={`${kindLabel}: ${trail.title}`}
      className="trail-log__row"
    >
      <div className="trail-log__thumb">
        <RouteSilhouette
          route={trail.route}
          kind={trail.kind}
          variant="log"
        />
      </div>

      <div className="flex min-w-0 flex-col gap-2.5">
        <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-[0.66rem] uppercase tracking-[0.22em] text-[color:var(--muted)]">
          <span className={`trail-kind trail-kind--${trail.kind}`}>{kindLabel}</span>
          <span aria-hidden="true">·</span>
          <span>{formatDate(trail.date)}</span>
          {trail.tags.length > 0 ? (
            <>
              <span aria-hidden="true">·</span>
              <span className="truncate">{trail.tags.slice(0, 2).join(" / ")}</span>
            </>
          ) : null}
        </div>

        <h3 className="trail-log__title">{trail.title}</h3>
        <p className="max-w-[60ch] text-sm leading-7 text-[color:var(--ink-soft)] line-clamp-2">
          {trail.description}
        </p>
      </div>

      <div className="flex flex-col gap-3">
        <TrailStatRow stats={trail.stats} tone="inline" />
        {trail.gpxPath ? (
          <span className="text-[0.62rem] uppercase tracking-[0.24em] text-[color:var(--muted)]">
            GPX · {trail.pointCount.toLocaleString("en")} points
          </span>
        ) : (
          <span className="text-[0.62rem] uppercase tracking-[0.24em] text-[color:var(--muted)]">
            No GPS log
          </span>
        )}
      </div>

      <span
        aria-hidden
        className="hidden self-center text-base text-[color:var(--muted)] md:inline"
      >
        →
      </span>
    </Link>
  );
}
