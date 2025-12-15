"use client";

import { useEffect, useMemo, useState, type CSSProperties } from "react";
import Link from "next/link";
import type { LucideIcon } from "lucide-react";
import { Camera, Gamepad2, Sparkles, Trophy } from "lucide-react";

import socialHighlightsContent from "@/data/home/social-highlights-section.json";
import socialHighlightsSettings from "@/data/home/social-highlights-settings.json";

type IconName = "Sparkles" | "Camera" | "Gamepad2" | "Trophy";

type SocialHighlightsContent = {
  id: string;
  headline: {
    iconCycle?: IconName[];
    titleTop: string;
    titleBottom: string;
    eyebrow?: string;
  };
  cards: Array<{
    id: string;
    image: string;
    alt: string;
    imagePosition?: string;
  }>;
  cta: {
    headline: string;
    platforms: Array<{
      id: string;
      label: string;
      href: string;
    }>;
  };
};

type SocialHighlightsSettings = {
  layout: {
    fanAngle: number;
    scaleStep: number;
    hoverScaleBoost: number;
    hoverLift: number;
    arcLift: number;
    minScale: number;
    spacing: {
      wide: number;
      medium: number;
      narrow: number;
    };
    breakpoints: {
      medium: number;
      narrow: number;
    };
    card: {
      width: {
        minRem: number;
        fluidVw: number;
        maxRem: number;
      };
      height: {
        minRem: number;
        fluidVw: number;
        maxRem: number;
      };
      borderRadiusRem: number;
    };
  };
  background?: {
    upperGlowOpacity?: number;
    lowerGlowOpacity?: number;
  };
};

const iconMap: Record<IconName, LucideIcon> = {
  Sparkles,
  Camera,
  Gamepad2,
  Trophy,
};

const content = socialHighlightsContent as SocialHighlightsContent;
const settings = socialHighlightsSettings as SocialHighlightsSettings;

export function SocialHighlightsSection() {
  const iconSequence = useMemo(
    () => (content.headline.iconCycle ?? []).filter((iconName) => Boolean(iconMap[iconName])),
    [],
  );
  const [iconIndex, setIconIndex] = useState(0);
  const [activeCardIndex, setActiveCardIndex] = useState<number | null>(null);
  const layout = settings.layout;
  const background = settings.background;
  const initialViewportWidth =
    typeof window === "undefined" ? layout.breakpoints.medium : window.innerWidth;
  const [viewportWidth, setViewportWidth] = useState(initialViewportWidth);

  useEffect(() => {
    if (iconSequence.length <= 1) {
      return;
    }

    const intervalId = window.setInterval(() => {
      setIconIndex((prev) => (prev + 1) % iconSequence.length);
    }, 2600);

    return () => window.clearInterval(intervalId);
  }, [iconSequence.length]);

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    const handleResize = () => {
      window.requestAnimationFrame(() => {
        setViewportWidth(window.innerWidth);
      });
    };

    handleResize();
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const ActiveIcon =
    iconMap[(iconSequence[iconIndex] as IconName | undefined) ?? "Sparkles"] ?? Sparkles;

  const titleId = `${content.id}-title`;
  const cards = content.cards;
  const middleOffset = (cards.length - 1) / 2;
  const cardWidth = `clamp(${layout.card.width.minRem}rem, ${layout.card.width.fluidVw}vw, ${layout.card.width.maxRem}rem)`;
  const cardHeight = `clamp(${layout.card.height.minRem}rem, ${layout.card.height.fluidVw}vw, ${layout.card.height.maxRem}rem)`;
  const currentSpacing =
    viewportWidth < layout.breakpoints.narrow
      ? layout.spacing.narrow
      : viewportWidth < layout.breakpoints.medium
        ? layout.spacing.medium
        : layout.spacing.wide;
  const currentFanAngle =
    viewportWidth < layout.breakpoints.narrow ? layout.fanAngle * 0.8 : layout.fanAngle;

  return (
    <section
      id="community-contribution"
      aria-labelledby={titleId}
      className="relative isolate w-full py-16 sm:py-24"
    >
      <div className="container mx-auto max-w-6xl px-4 md:px-8">
        <div className="relative isolate overflow-hidden rounded-[3.75rem] bg-white px-6 py-16 text-center sm:px-10 md:px-16">
          {background?.upperGlowOpacity ? (
            <div
              className="pointer-events-none absolute inset-x-12 top-10 h-28 rounded-[50%] bg-[color:var(--accent)]"
              style={{ opacity: background.upperGlowOpacity, filter: "blur(120px)" }}
              aria-hidden
            />
          ) : null}

          {background?.lowerGlowOpacity ? (
            <div
              className="pointer-events-none absolute inset-x-6 bottom-4 h-32 rounded-[50%/100%] bg-[color:var(--leaf)]"
              style={{ opacity: background.lowerGlowOpacity, filter: "blur(140px)" }}
              aria-hidden
            />
          ) : null}

          {iconSequence.length ? (
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-white">
              <ActiveIcon className="h-6 w-6 text-[color:var(--accent)] transition-transform duration-500 ease-out" aria-hidden />
            </div>
          ) : null}

          {content.headline.eyebrow ? (
            <p className="mt-6 text-[0.7rem] font-semibold uppercase tracking-[0.55em] text-[color:var(--ink)]/45">
              {content.headline.eyebrow}
            </p>
          ) : null}

          <h2
            id={titleId}
            className="mt-6 text-4xl font-semibold uppercase leading-tight text-[color:var(--ink)] md:text-[2.75rem]"
          >
            <span className="block bg-gradient-to-r from-[#f9b0a7] via-[#f6a6a0] to-[#f9b0a7] bg-clip-text tracking-[0.18em] text-transparent">
              {content.headline.titleTop}
            </span>
            <span className="mt-2 block bg-gradient-to-r from-[#6f6ba8] via-[#626095] to-[#6f6ba8] bg-clip-text tracking-[0.18em] text-transparent">
              {content.headline.titleBottom}
            </span>
          </h2>

          <ul
            className="relative mx-auto mt-14 w-full max-w-5xl"
            style={{ minHeight: cardHeight }}
          >
            {cards.map((card, index) => {
              const offset = index - middleOffset;
              const rotate = offset * currentFanAngle;
              const translateX = offset * currentSpacing;
              const baseTranslateY = Math.pow(Math.abs(offset), 1.18) * layout.arcLift;
              const scaleBase = Math.max(layout.minScale, 1 - Math.abs(offset) * layout.scaleStep);
              const isActive = activeCardIndex === index;
              const translateY = isActive ? baseTranslateY - layout.hoverLift : baseTranslateY;
              const scale = isActive ? scaleBase + layout.hoverScaleBoost : scaleBase;

              const cardStyle: CSSProperties = {
                transform: `translate(-50%, 0) translate(${translateX}px, ${translateY}px) rotate(${rotate}deg) scale(${scale})`,
                transformOrigin: "bottom center",
                zIndex: cards.length - Math.abs(offset) + (isActive ? 10 : 0),
                width: cardWidth,
                height: cardHeight,
                backfaceVisibility: "hidden",
                willChange: "transform",
                flex: "none",
                overflow: "clip",
                borderRadius: `${layout.card.borderRadiusRem}rem`,
              };

              const backgroundStyle: CSSProperties = {
                backgroundImage: `linear-gradient(180deg, rgba(255,255,255,0) 25%, rgba(98,96,149,0.28) 100%), url(${card.image})`,
                backgroundPosition: card.imagePosition ?? "center",
                backgroundSize: "cover",
                backgroundRepeat: "no-repeat",
              };

              return (
                <li
                  key={card.id}
                  style={cardStyle}
                  onMouseEnter={() => setActiveCardIndex(index)}
                  onMouseLeave={() => setActiveCardIndex(null)}
                  onFocus={() => setActiveCardIndex(index)}
                  onBlur={() => setActiveCardIndex(null)}
                  tabIndex={0}
                  className="absolute left-1/2 top-0 transition-all duration-[480ms] ease-[cubic-bezier(0.22,1,0.36,1)]"
                >
                  <div className="absolute inset-0 overflow-hidden" style={{ borderRadius: "inherit" }}>
                    <div className="absolute inset-0" style={backgroundStyle} aria-hidden />
                    <span className="sr-only">{card.alt}</span>
                  </div>
                </li>
              );
            })}
          </ul>

          <div className="mt-16 space-y-4">
            <p className="text-sm font-medium uppercase tracking-[0.3em] text-[color:var(--ink)]/65">
              {content.cta.headline}
            </p>
            <div className="flex flex-wrap justify-center gap-6 text-[0.7rem] font-semibold uppercase tracking-[0.55em] text-[color:var(--ink)]/60">
              {content.cta.platforms.map((platform) => (
                <Link
                  key={platform.id}
                  href={platform.href}
                  className="transition hover:text-[color:var(--accent)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[color:var(--accent)]"
                >
                  {platform.label}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
