/**
 * Article shell used by every long-form detail route (post, event, study).
 * Provides the back link, eyebrow, title, sidebar metadata, and an
 * optional `actions` slot (used for sharing, calendar export, etc.).
 */

import type { ReactNode } from "react";
import Link from "next/link";

import { cn } from "@/lib/cn";

type LongformEntryProps = {
  backHref: string;
  backLabel: string;
  eyebrow?: string;
  title: string;
  description?: string;
  meta?: Array<{ label: string; value?: string | null }>;
  actions?: ReactNode;
  children: ReactNode;
  className?: string;
};

export function LongformEntry({
  backHref,
  backLabel,
  eyebrow,
  title,
  description,
  meta = [],
  actions,
  children,
  className,
}: LongformEntryProps) {
  const visibleMeta = meta.filter((item) => item.value);

  return (
    <article className={cn("page-wrap section-block", className)}>
      <Link
        href={backHref}
        className="inline-flex items-center gap-2 text-[0.95rem] text-[color:var(--ink-soft)] hover:text-[color:var(--foreground)]"
      >
        <span aria-hidden>←</span>
        {backLabel}
      </Link>

      <div className="mt-9 grid gap-10 lg:grid-cols-[16rem_minmax(0,1fr)] lg:gap-16">
        <aside className="space-y-6 lg:pt-6">
          {eyebrow ? <p className="eyebrow">{eyebrow}</p> : null}
          {visibleMeta.length > 0 ? (
            <dl className="space-y-5 border-t border-[color:var(--line)] pt-5 text-[0.95rem] text-[color:var(--ink-soft)]">
              {visibleMeta.map((item) => (
                <div key={item.label} className="space-y-1">
                  <dt className="text-[0.72rem] uppercase tracking-[0.22em] text-[color:var(--muted)]">
                    {item.label}
                  </dt>
                  <dd className="leading-7 text-[color:var(--foreground)]/86">{item.value}</dd>
                </div>
              ))}
            </dl>
          ) : null}
          {actions ? <div className="pt-2">{actions}</div> : null}
        </aside>

        <div className="space-y-12">
          <header className="space-y-5">
            <h1 className="max-w-[18ch] text-display leading-[1.02] tracking-[-0.035em]">{title}</h1>
            {description ? (
              <p className="body-copy max-w-[40ch] text-[color:var(--ink-soft)] md:text-[1.18rem]">
                {description}
              </p>
            ) : null}
          </header>

          <section className="border-t border-[color:var(--line)] pt-10">
            {children}
          </section>
        </div>
      </div>
    </article>
  );
}
