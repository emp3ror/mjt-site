import type { Metadata } from "next";
import Link from "next/link";

import { ChapterHeader } from "@/components/chapter-header";
import { EditorialDivider } from "@/components/editorial-divider";
import navigation from "@content/site/navigation.json";

/**
 * Every detail route sets `dynamicParams = false`, so an unknown slug lands
 * here rather than rendering. Give it real exits instead of a bare 404.
 */

export const metadata: Metadata = {
  title: "Page not found",
  description: "That page is not part of the archive.",
};

export default function NotFound() {
  const destinations = [...navigation.sections, ...navigation.archive];

  return (
    <div className="page-wrap section-block">
      <ChapterHeader
        eyebrow="404"
        title="This page left no trace."
        description="The link may be old, or the entry may never have made it out of drafts. Everything that does exist is one step away."
      />

      <EditorialDivider className="my-10 md:my-12" />

      <nav aria-label="Archive shortcuts">
        <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {destinations.map((item) => (
            <li key={item.href}>
              <Link
                href={item.href}
                className="group flex items-center justify-between gap-4 rounded-[1.2rem] border border-[color:var(--line)] bg-[color:var(--surface-strong)]/70 px-5 py-4 text-[1.02rem] text-[color:var(--ink-soft)] transition hover:-translate-y-0.5 hover:border-[color:var(--accent)] hover:text-[color:var(--foreground)]"
              >
                {item.label}
                <span
                  aria-hidden
                  className="text-[color:var(--muted)] transition-transform group-hover:translate-x-1"
                >
                  →
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </nav>

      <p className="mt-10 text-[0.95rem] text-[color:var(--ink-soft)]">
        Or head{" "}
        <Link href="/" className="story-link text-[color:var(--accent-strong)]">
          back to the beginning
        </Link>
        .
      </p>
    </div>
  );
}
