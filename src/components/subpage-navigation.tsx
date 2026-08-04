"use client";

/**
 * Secondary navigation strip directly under the global header.
 *
 * - On the home route it renders a row of in-page anchor links so users can
 *   quickly jump between hero sections. The list is passed in already
 *   filtered by the layout (see `lib/home-sections.ts`) so it can never link
 *   to a section the home page chose not to render.
 * - On any other route it renders a breadcrumb trail. Segment labels are
 *   looked up in `content/site/navigation.json`; unknown segments fall back
 *   to a title-cased version of the slug.
 */

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useMemo } from "react";

import navigation from "@content/site/navigation.json";

type Crumb = { label: string; href?: string };
type Anchor = { label: string; href: string };

const segmentLabels = navigation.breadcrumbLabels as Record<string, string>;

const titleCase = (value: string) =>
  value
    .split(/[-_]/)
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");

const buildCrumbs = (pathname: string | null): Crumb[] => {
  if (!pathname || pathname === "/") return [];

  const segments = pathname.split("/").filter(Boolean);

  return [
    { label: "Archive", href: "/" },
    ...segments.map((segment, index): Crumb => {
      const isLast = index === segments.length - 1;
      const isTagLeaf = segments[0] === "tags" && isLast;
      const label = isTagLeaf
        ? `#${titleCase(segment)}`
        : segmentLabels[segment] ?? titleCase(segment);

      return {
        label,
        href: isLast ? undefined : `/${segments.slice(0, index + 1).join("/")}`,
      };
    }),
  ];
};

export function SubpageNavigation({ homeAnchors = [] }: { homeAnchors?: Anchor[] }) {
  const pathname = usePathname();
  const crumbs = useMemo(() => buildCrumbs(pathname), [pathname]);

  if (pathname === "/") {
    if (homeAnchors.length === 0) return null;
    return (
      <nav
        aria-label="On this page"
        className="absolute inset-x-0 top-[var(--header-height)] z-40 bg-transparent"
      >
        {/* The strip floats over the hero, so it must stay a single line —
            wrapping pushed a third row down into the hero eyebrow on phones. */}
        <div className="page-wrap flex items-center gap-3 py-3.5 text-[0.72rem] uppercase tracking-[0.2em] text-white/75 sm:text-[0.69rem] sm:tracking-[0.3em]">
          <span
            aria-hidden
            className="h-1.5 w-1.5 shrink-0 rounded-full border border-white/45"
          />
          <ol className="no-scrollbar flex min-w-0 items-center gap-x-5 overflow-x-auto whitespace-nowrap">
            {homeAnchors.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className="transition-colors hover:text-white"
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ol>
        </div>
      </nav>
    );
  }

  if (crumbs.length === 0) return null;

  return (
    <nav
      aria-label="Location"
      className="border-b border-[color:var(--line)]/70 bg-[color:var(--surface)]/72"
    >
      <div className="page-wrap flex items-center gap-3 py-3.5 text-[0.72rem] uppercase tracking-[0.2em] text-[color:var(--muted)] sm:text-[0.69rem] sm:tracking-[0.3em]">
        <span
          aria-hidden
          className="h-1.5 w-1.5 shrink-0 rounded-full border border-[color:var(--accent)]/50"
        />
        <ol className="flex flex-wrap items-center gap-2">
          {crumbs.map((item, index) => {
            const isLast = index === crumbs.length - 1;
            return (
              <li key={`${item.label}-${index}`} className="flex items-center gap-2">
                {item.href && !isLast ? (
                  <Link href={item.href} className="hover:text-[color:var(--foreground)]/92">
                    {item.label}
                  </Link>
                ) : (
                  <span className="text-[color:var(--foreground)]/94">{item.label}</span>
                )}
                {!isLast && <span aria-hidden className="text-[color:var(--line-strong)]">/</span>}
              </li>
            );
          })}
        </ol>
      </div>
    </nav>
  );
}
