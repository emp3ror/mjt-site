"use client";

const dashLength = 2200;

export default function MjtBanner() {
  return (
    <section className="rounded-3xl border border-[color:var(--muted)]/40 bg-transparent px-6 py-16 text-center text-[color:var(--ink)] transition-colors dark:border-neutral-700/50 dark:text-neutral-100">
      <div className="mx-auto flex max-w-5xl flex-col items-center gap-8">
        <svg
          viewBox="0 0 1200 600"
          xmlns="http://www.w3.org/2000/svg"
          preserveAspectRatio="xMidYMid meet"
          className="mx-auto h-auto w-full max-w-4xl"
          role="img"
          aria-labelledby="mjt-banner-title"
        >
          <title id="mjt-banner-title">MJT wordmark banner</title>

          <text
            x="50%"
            y="50%"
            textAnchor="middle"
            dy=".3em"
            className="mjt-banner__title"
            style={{ strokeDasharray: dashLength, strokeDashoffset: dashLength }}
          >
            MJT
          </text>
        </svg>
      </div>
    </section>
  );
}
