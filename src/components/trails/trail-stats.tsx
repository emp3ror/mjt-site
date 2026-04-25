/**
 * Compact stats row used by both the home `TrailsSection` and the archive
 * `TrailsLog`. Output adapts to context via `tone`: a quiet inline tone for
 * dense rows, a louder feature tone for the home page hero card.
 */

import type { TrailStats } from "@/lib/gpx-stats";
import { cn } from "@/lib/cn";

type Tone = "feature" | "inline" | "compact";

type Props = {
  stats: TrailStats | null;
  pointCount?: number;
  tone?: Tone;
  className?: string;
};

const formatDistance = (km: number) => {
  if (km <= 0) return "—";
  if (km < 10) return `${km.toFixed(2)} km`;
  return `${km.toFixed(1)} km`;
};

const formatElevation = (value: number | null) => {
  if (value === null) return "—";
  return `${Math.round(value)} m`;
};

export function TrailStatRow({
  stats,
  pointCount,
  tone = "inline",
  className,
}: Props) {
  const items: Array<{ label: string; value: string }> = [];

  if (stats) {
    items.push({ label: "Distance", value: formatDistance(stats.distanceKm) });
    items.push({ label: "Ascent", value: formatElevation(stats.ascent) });
    items.push({ label: "Descent", value: formatElevation(stats.descent) });
  }

  if (tone === "feature" && pointCount && pointCount > 0) {
    items.push({ label: "Points", value: pointCount.toLocaleString("en") });
  }

  if (items.length === 0) {
    return (
      <p
        className={cn(
          "text-xs uppercase tracking-[0.22em] text-[color:var(--muted)]",
          className,
        )}
      >
        No GPS data attached
      </p>
    );
  }

  if (tone === "feature") {
    return (
      <dl
        className={cn(
          "grid grid-cols-2 gap-x-6 gap-y-4 sm:grid-cols-4",
          className,
        )}
      >
        {items.map((item) => (
          <div key={item.label} className="flex flex-col">
            <dt className="eyebrow text-[0.65rem] text-[color:var(--muted)]">
              {item.label}
            </dt>
            <dd className="mt-1.5 font-serif text-2xl tracking-[-0.01em] text-[color:var(--foreground)]">
              {item.value}
            </dd>
          </div>
        ))}
      </dl>
    );
  }

  if (tone === "compact") {
    return (
      <div
        className={cn(
          "flex flex-wrap items-baseline gap-x-3 gap-y-1 text-[0.7rem] uppercase tracking-[0.2em] text-[color:var(--muted)]",
          className,
        )}
      >
        {items.map((item, index) => (
          <span key={item.label} className="inline-flex items-baseline gap-1.5">
            {index > 0 ? <span aria-hidden="true">·</span> : null}
            <span className="text-[color:var(--foreground)]/80">
              {item.value}
            </span>
            <span>{item.label}</span>
          </span>
        ))}
      </div>
    );
  }

  return (
    <dl className={cn("flex flex-wrap items-baseline gap-x-6 gap-y-2", className)}>
      {items.map((item) => (
        <div key={item.label} className="flex items-baseline gap-2">
          <dt className="eyebrow text-[0.62rem] text-[color:var(--muted)]">
            {item.label}
          </dt>
          <dd className="text-sm font-medium text-[color:var(--foreground)]">
            {item.value}
          </dd>
        </div>
      ))}
    </dl>
  );
}
