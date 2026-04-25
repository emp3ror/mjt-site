/**
 * Server-rendered SVG silhouette of a recorded route.
 *
 * Both the home `TrailsSection` and the `TrailsLog` archive view embed this
 * primitive. It deliberately ships zero JS — the path string is precomputed
 * by `loadTrailGpx` at build time. When a trail has no GPX data we fall back
 * to an idle waveform so cards still render with rhythm.
 */

import type { TrailRoute } from "@/lib/gpx-stats";
import type { TrailKind } from "@/lib/trails";
import { cn } from "@/lib/cn";

type Variant = "card" | "ghost" | "log";

type Props = {
  route: TrailRoute | null;
  kind: TrailKind;
  className?: string;
  variant?: Variant;
  title?: string;
};

const FALLBACK_PATH = "M5 42 Q 22 18, 44 32 T 78 26 T 95 36";

const STROKE_BY_KIND: Record<TrailKind, string> = {
  hike: "var(--leaf)",
  run: "var(--accent-alt)",
};

const VARIANT_STROKE: Record<Variant, number> = {
  card: 1.6,
  ghost: 0.9,
  log: 1.4,
};

export function RouteSilhouette({
  route,
  kind,
  className,
  variant = "card",
  title,
}: Props) {
  const stroke = STROKE_BY_KIND[kind];
  const strokeWidth = VARIANT_STROKE[variant];

  if (!route) {
    return (
      <svg
        viewBox="0 0 100 60"
        className={cn("h-full w-full", className)}
        role={title ? "img" : "presentation"}
        aria-label={title}
        aria-hidden={title ? undefined : true}
        preserveAspectRatio="xMidYMid meet"
      >
        <path
          d={FALLBACK_PATH}
          fill="none"
          stroke={stroke}
          strokeOpacity={0.45}
          strokeWidth={strokeWidth}
          strokeDasharray="2 3"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    );
  }

  return (
    <svg
      viewBox={route.viewBox}
      className={cn("h-full w-full", className)}
      role={title ? "img" : "presentation"}
      aria-label={title}
      aria-hidden={title ? undefined : true}
      preserveAspectRatio="xMidYMid meet"
    >
      {variant === "card" ? (
        <path
          d={route.svgPath}
          fill="none"
          stroke={stroke}
          strokeOpacity={0.18}
          strokeWidth={strokeWidth + 3}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      ) : null}

      <path
        d={route.svgPath}
        fill="none"
        stroke={stroke}
        strokeOpacity={variant === "ghost" ? 0.55 : 0.95}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeDasharray={kind === "run" ? "0" : "0"}
      />

      {variant !== "ghost" ? (
        <>
          <circle cx={route.start.x} cy={route.start.y} r={1.6} fill={stroke} />
          <circle
            cx={route.end.x}
            cy={route.end.y}
            r={1.8}
            fill="var(--background)"
            stroke={stroke}
            strokeWidth={1}
          />
        </>
      ) : null}
    </svg>
  );
}
