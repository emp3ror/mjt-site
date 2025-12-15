"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";

import {
  ArrowUpRight,
  Gamepad2,
  LayoutTemplate,
  Package2,
  Palette,
} from "lucide-react";
import bannerContent from "@/data/mjt-banner.json";

type BadgeIconName = "Package2" | "LayoutTemplate" | "Palette" | "Gamepad2";
type CtaVariant = "primary" | "secondary";

type BannerContent = {
  wordmarkTitle: string;
  statement: string[];
  ctas: Array<{ label: string; href: string; style: CtaVariant }>;
  heroBadges: Array<{ label: string; icon: BadgeIconName }>;
};

const content = bannerContent as BannerContent;
const badgeIconMap: Record<BadgeIconName, typeof Package2> = {
  Package2,
  LayoutTemplate,
  Palette,
  Gamepad2,
};
const ctaClassNames: Record<CtaVariant, string> = {
  primary:
    "inline-flex items-center gap-2 rounded-full bg-[color:var(--accent)] px-6 py-3 text-sm font-semibold text-white shadow-[0_14px_34px_rgba(242,92,39,0.3)] transition hover:-translate-y-1 hover:shadow-[0_22px_44px_rgba(242,92,39,0.35)]",
  secondary:
    "inline-flex items-center gap-2 rounded-full border border-[color:var(--muted)]/60 bg-white/70 px-6 py-3 text-sm font-semibold text-[color:var(--ink)] shadow-[0_12px_28px_rgba(44,45,94,0.12)] transition hover:-translate-y-1 hover:bg-white",
};

const dashLength = 2200;

const iconSources = [
  "/bg-svg/11-chess-s-svgrepo-com.svg",
  "/bg-svg/buddhism-svgrepo-com.svg",
  "/bg-svg/bus-svgrepo-com.svg",
  "/bg-svg/controller-5-svgrepo-com.svg",
  "/bg-svg/cycle-cycling-cyclist-svgrepo-com.svg",
  "/bg-svg/fitness-watch-health-smartwatch-svgrepo-com.svg",
  "/bg-svg/game-controller-svgrepo-com.svg",
  "/bg-svg/gym-running-foot-run-svgrepo-com.svg",
  "/bg-svg/laptop-with-arrows-svgrepo-com.svg",
  "/bg-svg/leaf-svgrepo-com.svg",
  "/bg-svg/mountain-svgrepo-com.svg",
  "/bg-svg/pagoda-svgrepo-com.svg",
  "/bg-svg/paintbrush-and-palette-svgrepo-com.svg",
  "/bg-svg/run-person-fast-rush-svgrepo-com.svg",
  "/bg-svg/soccer-shoes-2-svgrepo-com.svg",
  "/bg-svg/trail-sign-outline-svgrepo-com.svg",
] as const;

const BACKGROUND_LAYER_CLASS = "pointer-events-none absolute inset-0";
const BACKGROUND_GRADIENT_CLASS =
  "absolute inset-0 bg-gradient-to-br from-[#eef3f9]/35 via-white/25 to-[#f7f9fc]/35 opacity-50 dark:from-neutral-950/35 dark:via-neutral-950/40 dark:to-neutral-900/40";
const ICON_CANVAS_CLASS = "absolute inset-0 icon-canvas";
const ICON_WRAPPER_CLASS = "absolute select-none";
const ICON_ROWS = [4, 20, 36, 52, 68, 84];
const ICON_COLUMNS = [6, 24, 42, 60, 78, 94];
const ICON_BASE_SIZE = 48;
const ICON_SIZE_VARIATION = 6;
const ICON_ROTATION_STEP = 2;
const ICON_BASE_OPACITY = 0.6;
const ICON_OPACITY_VARIATION = 0.3;
type IconInstance = {
  src: (typeof iconSources)[number];
  top: string;
  left: string;
  size: number;
  rotate: number;
  delay: string;
  opacity: number;
};

export default function MjtBanner() {
  const iconPlacements = useMemo<IconInstance[]>(() => {
    const placements: IconInstance[] = [];

    ICON_ROWS.forEach((row, rowIndex) => {
      ICON_COLUMNS.forEach((column, colIndex) => {
        const placementIndex = placements.length;
        const sourceIndex = placementIndex % iconSources.length;

        placements.push({
          src: iconSources[sourceIndex],
          top: `${row + (colIndex % 2 === 0 ? 0 : 3)}%`,
          left: `${column + (rowIndex % 2 === 0 ? 0 : 3)}%`,
          size: sizeForPosition(rowIndex, colIndex),
          rotate: rotationForPosition(rowIndex, colIndex),
          delay: `${placementIndex * 0.25}s`,
          opacity: opacityForPosition(rowIndex, colIndex),
        });
      });
    });

    return placements;
  }, []);

  const iconMarkup = useProcessedIcons(iconSources);

  return (
    <section className="relative isolate left-1/2 w-screen -translate-x-1/2 overflow-hidden bg-white/80 text-center text-[color:var(--ink)] transition-colors dark:bg-neutral-950/85 dark:text-neutral-100">
      <div className={BACKGROUND_LAYER_CLASS} aria-hidden>
        <div className={BACKGROUND_GRADIENT_CLASS} />
        <div className={ICON_CANVAS_CLASS}>
          {iconPlacements.map((icon, index) => {
            const markup = iconMarkup[icon.src];
            if (!markup) return null;

            return (
              <div
                key={`${icon.src}-${index}`}
                className={ICON_WRAPPER_CLASS}
                style={{
                  top: icon.top,
                  left: icon.left,
                  transform: `rotate(${icon.rotate}deg)`,
                  opacity: icon.opacity,
                }}
              >
                <div
                  className="drift"
                  style={{
                    width: icon.size,
                    height: icon.size,
                    animationDelay: icon.delay,
                  }}
                  dangerouslySetInnerHTML={{ __html: markup }}
                />
              </div>
            );
          })}
        </div>
      </div>

      <div className="container mx-auto max-w-7xl px-4 py-24 md:px-8">
        <div className="relative mx-auto flex w-full max-w-5xl flex-col items-center gap-8">
          <div className="w-full px-4 sm:px-10 md:px-16">
            <div className="container mjt-wrapper">
              <svg
                viewBox="0 0 500 260"
                xmlns="http://www.w3.org/2000/svg"
                preserveAspectRatio="xMidYMid meet"
                className="mx-auto block h-auto w-full"
                style={{ maxWidth: "min(92vw, 68rem)", overflow: "visible" }}
                role="img"
                aria-labelledby="mjt-banner-title"
              >
                <title id="mjt-banner-title">{content.wordmarkTitle}</title>

                <text
                  x="50%"
                  y="50%"
                  textAnchor="middle"
                  dy=".32em"
                  className="mjt-banner__title"
                  style={{ strokeDasharray: dashLength, strokeDashoffset: dashLength }}
                >
                  MJT
                </text>
              </svg>
            </div>
          </div>

          <p className="max-w-2xl text-lg leading-relaxed text-[color:var(--ink)]/80 sm:text-xl dark:text-neutral-300/90">
            {content.statement.map((line) => (
              <span key={line} className="block">
                {line}
              </span>
            ))}
          </p>
          <div className="flex flex-wrap gap-4">
            {content.ctas.map((cta) => (
              <Link key={cta.label} href={cta.href} className={ctaClassNames[cta.style] ?? ctaClassNames.primary}>
                {cta.label}
                {cta.style === "primary" ? <ArrowUpRight className="h-4 w-4" aria-hidden /> : null}
              </Link>
            ))}
          </div>

          <ul className="flex flex-wrap gap-3 text-sm font-semibold text-[color:var(--ink)]/80">
            {content.heroBadges.map(({ label, icon }) => {
              const Icon = badgeIconMap[icon] ?? Package2;
              return (
                <li
                  key={label}
                  className="inline-flex items-center gap-2 rounded-full bg-white/80 px-4 py-2 shadow-[0_12px_30px_rgba(44,45,94,0.12)]"
                >
                  <Icon className="h-4 w-4 text-[color:var(--accent)]" aria-hidden />
                  {label}
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </section>
  );
}

function rotationForPosition(rowIndex: number, colIndex: number) {
  return ((rowIndex + colIndex) % 2 === 0 ? -6 : 6) + (rowIndex - colIndex) * ICON_ROTATION_STEP;
}

function sizeForPosition(rowIndex: number, colIndex: number) {
  return ICON_BASE_SIZE + ((rowIndex + colIndex) % 3) * ICON_SIZE_VARIATION;
}

function opacityForPosition(rowIndex: number, colIndex: number) {
  return ICON_BASE_OPACITY + ((rowIndex + colIndex) % 3) * ICON_OPACITY_VARIATION;
}

function useProcessedIcons(sources: readonly string[]) {
  const sourceList = useMemo(() => Array.from(new Set(sources)), [sources]);
  const [iconMarkup, setIconMarkup] = useState<Record<string, string>>({});

  useEffect(() => {
    let cancelled = false;

    async function loadIcons() {
      const entries = await Promise.all(
        sourceList.map(async (src) => {
          try {
            const response = await fetch(src);
            if (!response.ok) throw new Error(`Failed to load ${src}`);

            const raw = await response.text();
            const parser = new DOMParser();
            const doc = parser.parseFromString(raw, "image/svg+xml");
            const svg = doc.documentElement;

            if (!svg) return [src, ""] as const;

            svg.setAttribute("width", "100%");
            svg.setAttribute("height", "100%");
            svg.setAttribute("preserveAspectRatio", "xMidYMid meet");
            svg.setAttribute("aria-hidden", "true");
            svg.setAttribute("focusable", "false");

            svg.removeAttribute("class");
            svg.removeAttribute("style");

            doc.querySelectorAll("style").forEach((node) => node.remove());

            const elements = [svg, ...Array.from(svg.querySelectorAll<SVGElement>("*"))];
            elements.forEach((element) => {
              element.removeAttribute("class");
              element.removeAttribute("style");
            });

            const serialized = new XMLSerializer().serializeToString(svg);
            return [src, serialized] as const;
          } catch (error) {
            console.warn(error);
            return [src, ""] as const;
          }
        }),
      );

      if (!cancelled) setIconMarkup(Object.fromEntries(entries));
    }

    loadIcons();

    return () => {
      cancelled = true;
    };
  }, [sourceList]);

  return iconMarkup;
}
