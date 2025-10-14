"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useMemo } from "react";

type Breadcrumb = {
  label: string;
  href?: string;
};

const segmentLabelMap: Record<string, string> = {
  posts: "Notes",
  tags: "Tags",
  "art-college": "Art College",
  events: "Events",
};

const formatSegmentLabel = (value: string) =>
  value
    .split(/[-_]/)
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");

export function SubpageNavigation() {
  const pathname = usePathname();

  const breadcrumbs = useMemo<Breadcrumb[]>(() => {
    if (!pathname || pathname === "/") {
      return [];
    }

    const segments = pathname.split("/").filter(Boolean);

    if (segments.length === 0) {
      return [];
    }

    return [
      { label: "Home", href: "/" },
      ...segments.map((segment, index) => {
        const isLast = index === segments.length - 1;
        const path = `/${segments.slice(0, index + 1).join("/")}`;

        const label =
          segments[0] === "tags" && isLast
            ? `#${formatSegmentLabel(segment)}`
            : segmentLabelMap[segment] ?? formatSegmentLabel(segment);

        return {
          label,
          href: isLast ? undefined : path,
        };
      }),
    ];
  }, [pathname]);

  if (breadcrumbs.length === 0) {
    return null;
  }

  return (
    <nav className="border-b border-neutral-200/70 bg-white dark:border-neutral-800/50 dark:bg-neutral-950">
      <div className="mx-auto flex w-full max-w-6xl items-center gap-2 px-6 py-4 text-xs uppercase tracking-[0.3em] text-neutral-500 dark:text-neutral-400">
        <ol className="flex flex-wrap items-center gap-2">
          {breadcrumbs.map((item, index) => {
            const isLast = index === breadcrumbs.length - 1;

            return (
              <li key={item.label} className="flex items-center gap-2">
                {item.href && !isLast ? (
                  <Link
                    href={item.href}
                    className="transition hover:text-neutral-800 dark:hover:text-neutral-100"
                  >
                    {item.label}
                  </Link>
                ) : (
                  <span className="text-neutral-800 dark:text-neutral-100">
                    {item.label}
                  </span>
                )}
                {isLast ? null : <span aria-hidden className="text-neutral-300 dark:text-neutral-600">/</span>}
              </li>
            );
          })}
        </ol>
      </div>
    </nav>
  );
}
