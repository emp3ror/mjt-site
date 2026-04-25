/**
 * Home section for tracked activity (hikes / runs with GPS data).
 *
 * Visual register: an editorial "field log" — one large featured trail with
 * the route silhouette playing the role of a hand-drawn cartographic plate,
 * paired with a small ledger of recent secondary entries. Sister to (but
 * deliberately distinct from) the volunteering rail and journal section so
 * the home page keeps four different rhythms instead of four cards.
 *
 * Editorial copy lives in `content/site/home.json` under `trails`.
 * The data shape comes from `src/lib/trails.ts`, which is also reused by
 * the dedicated /trails archive view.
 */

import Link from "next/link";

import homeContent from "@content/site/home.json";

import { RouteSilhouette } from "@/components/trails/route-silhouette";
import { TrailStatRow } from "@/components/trails/trail-stats";
import type { Trail, TrailKind } from "@/lib/trails";

const COPY = homeContent.trails;

const KIND_LABELS = COPY.kindLabels as Record<TrailKind, string>;

type Props = {
  trails: Trail[];
  formatDate: (value?: string) => string;
};

export function TrailsSection({ trails, formatDate }: Props) {
  if (trails.length === 0) return null;

  const visible = trails.slice(0, COPY.maxFeatured);
  const [featured, ...secondary] = visible;

  return (
    <section
      id="trails"
      className="section-block scroll-mt-28"
    >
      <div className="page-wrap">
        <div className="mb-10 grid gap-6 md:mb-14 lg:grid-cols-[0.95fr_1.05fr] lg:items-end">
          <div className="section-heading-stack">
            <p className="eyebrow">{COPY.eyebrow}</p>
            <h2 className="max-w-[18ch] text-h2 leading-[1.04]">{COPY.title}</h2>
          </div>
          <div className="flex flex-col gap-5 lg:items-end">
            <p className="body-copy max-w-[52ch] text-[color:var(--ink-soft)]">
              {COPY.description}
            </p>
            <Link
              href={COPY.indexHref}
              className="story-link inline-flex items-center self-start text-sm font-medium text-[color:var(--accent-strong)] lg:self-auto"
            >
              {COPY.indexCtaLabel}
              <span aria-hidden className="ml-2">→</span>
            </Link>
          </div>
        </div>

        <div className="trails-grid">
          <FeaturedTrail trail={featured} formatDate={formatDate} />
          {secondary.length > 0 ? (
            <ol
              className="trails-stack"
              aria-label="More tracked routes"
            >
              {secondary.map((trail) => (
                <li key={trail.id}>
                  <SecondaryTrail trail={trail} formatDate={formatDate} />
                </li>
              ))}
            </ol>
          ) : null}
        </div>
      </div>
    </section>
  );
}

type CardProps = {
  trail: Trail;
  formatDate: (value?: string) => string;
};

function FeaturedTrail({ trail, formatDate }: CardProps) {
  const kindLabel = KIND_LABELS[trail.kind];

  return (
    <article
      aria-labelledby={`trail-${trail.id}-feature-title`}
      className="trail-feature relative flex flex-col overflow-hidden"
    >
      <div className="trail-feature__plate" aria-hidden>
        <RouteSilhouette
          route={trail.route}
          kind={trail.kind}
          variant="card"
          className="trail-feature__route"
        />
      </div>

      <div className="relative flex flex-1 flex-col gap-7 p-6 md:p-9 lg:p-11">
        <div className="flex flex-wrap items-center gap-3 text-[0.72rem] uppercase tracking-[0.22em] text-[color:var(--muted)]">
          <span
            className={`trail-kind trail-kind--${trail.kind}`}
            aria-label={`Kind: ${kindLabel}`}
          >
            {kindLabel}
          </span>
          <span aria-hidden="true">·</span>
          <span>{formatDate(trail.date)}</span>
          {trail.tags.length > 0 ? (
            <>
              <span aria-hidden="true">·</span>
              <span>{trail.tags.slice(0, 2).join(" / ")}</span>
            </>
          ) : null}
        </div>

        <div className="space-y-4">
          <h3
            id={`trail-${trail.id}-feature-title`}
            className="font-serif text-[2rem] leading-[1.06] tracking-[-0.02em] text-[color:var(--foreground)] md:text-[2.85rem]"
          >
            <Link href={trail.url} className="story-link">
              {trail.title}
            </Link>
          </h3>
          <p className="body-copy max-w-[54ch] text-[color:var(--ink-soft)]">
            {trail.description}
          </p>
        </div>

        <TrailStatRow
          stats={trail.stats}
          pointCount={trail.pointCount}
          tone="feature"
          className="border-t border-[color:var(--line)] pt-6"
        />

        <div className="mt-auto flex flex-wrap items-center gap-5 text-sm">
          <Link
            href={trail.url}
            className="inline-flex items-center gap-2 rounded-full border border-[color:var(--line-strong)] bg-[color:var(--surface-strong)]/80 px-5 py-2.5 text-[color:var(--foreground)] hover:-translate-y-0.5 hover:border-[color:var(--accent)]"
          >
            {COPY.featuredCtaLabel}
            <span aria-hidden>→</span>
          </Link>
          {trail.gpxPath ? (
            <a
              href={trail.gpxPath}
              download
              className="text-xs uppercase tracking-[0.24em] text-[color:var(--muted)] hover:text-[color:var(--accent-strong)]"
            >
              Download .gpx
            </a>
          ) : null}
        </div>
      </div>
    </article>
  );
}

function SecondaryTrail({ trail, formatDate }: CardProps) {
  const kindLabel = KIND_LABELS[trail.kind];

  return (
    <Link
      href={trail.url}
      className="trail-row group block"
      aria-label={`Open ${trail.title}`}
    >
      <div className="trail-row__thumb" aria-hidden>
        <RouteSilhouette
          route={trail.route}
          kind={trail.kind}
          variant="ghost"
        />
      </div>

      <div className="flex min-w-0 flex-1 flex-col gap-2">
        <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-[0.68rem] uppercase tracking-[0.22em] text-[color:var(--muted)]">
          <span className={`trail-kind trail-kind--${trail.kind}`}>{kindLabel}</span>
          <span aria-hidden="true">·</span>
          <span>{formatDate(trail.date)}</span>
        </div>

        <h3 className="text-lg leading-snug tracking-[-0.01em] text-[color:var(--foreground)] md:text-xl">
          <span className="trail-row__title">{trail.title}</span>
        </h3>

        <TrailStatRow stats={trail.stats} tone="compact" />
      </div>

      <span aria-hidden className="trail-row__arrow">→</span>
    </Link>
  );
}
