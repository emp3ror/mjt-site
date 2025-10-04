import type { Metadata } from "next";
import Link from "next/link";

import { getArtCollegeListing } from "@/lib/art-college";

export const metadata: Metadata = {
  title: "Art College",
  description:
    "Modules, critiques, and studio experiments collected from the Art College archive.",
};

const formatDate = (value?: string) =>
  value
    ? new Intl.DateTimeFormat("en", {
        year: "numeric",
        month: "short",
        day: "2-digit",
      }).format(new Date(value))
    : undefined;

export default async function ArtCollegePage() {
  const { page, rootEntries, sections } = await getArtCollegeListing();

  return (
    <div className="mx-auto flex min-h-screen max-w-5xl flex-col gap-12 px-6 py-16">
      <header className="space-y-4">
        <p className="text-xs uppercase tracking-[0.3em] text-neutral-500">
          Studio syllabus
        </p>
        <div className="space-y-3">
          <h1 className="text-4xl font-semibold tracking-tight text-neutral-900 dark:text-neutral-100">
            {page.title}
          </h1>
          {page.intro ? (
            <p className="max-w-2xl text-base text-neutral-600 dark:text-neutral-300">
              {page.intro}
            </p>
          ) : null}
          {page.description ? (
            <p className="max-w-2xl text-sm text-neutral-500 dark:text-neutral-400">
              {page.description}
            </p>
          ) : null}
        </div>
        {page.updated ? (
          <p className="text-xs uppercase tracking-[0.25em] text-neutral-400">
            Last updated {formatDate(page.updated)}
          </p>
        ) : null}
      </header>

      {rootEntries.length > 0 ? (
        <section className="space-y-5">
          <h2 className="text-lg font-medium text-neutral-800 dark:text-neutral-200">
            Loose notes
          </h2>
          <ul className="grid gap-6 sm:grid-cols-2">
            {rootEntries.map((entry) => (
              <li
                key={entry.href}
                className="group flex h-full flex-col rounded-2xl border border-neutral-200/80 bg-white/80 p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-md dark:border-neutral-800/70 dark:bg-neutral-900/70"
              >
                {formatDate(entry.updated ?? entry.date) ? (
                  <span className="text-xs uppercase tracking-[0.25em] text-neutral-400">
                    {formatDate(entry.updated ?? entry.date)}
                  </span>
                ) : null}
                <Link
                  href={entry.href}
                  className="mt-2 text-xl font-semibold text-neutral-900 transition-colors group-hover:text-blue-600 dark:text-neutral-100 dark:group-hover:text-blue-400"
                >
                  {entry.title}
                </Link>
                {entry.description ? (
                  <p className="mt-3 flex-1 text-sm text-neutral-600 dark:text-neutral-300">
                    {entry.description}
                  </p>
                ) : null}
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      <div className="space-y-16">
        {sections.map((section) => (
          <section key={section.slug} className="space-y-6">
            <header className="space-y-2">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <h2 className="text-2xl font-semibold text-neutral-900 dark:text-neutral-100">
                  {section.title}
                </h2>
                <span className="inline-flex items-center rounded-full border border-neutral-200/70 px-4 py-1 text-xs uppercase tracking-[0.25em] text-neutral-500 dark:border-neutral-700/70 dark:text-neutral-400">
                  {section.slug.replace(/[-_]/g, " ")}
                </span>
              </div>
              {section.description ? (
                <p className="max-w-2xl text-sm text-neutral-600 dark:text-neutral-300">
                  {section.description}
                </p>
              ) : null}
              {section.intro ? (
                <p className="max-w-2xl text-xs text-neutral-500 dark:text-neutral-400">
                  {section.intro}
                </p>
              ) : null}
            </header>

            {section.entries.length > 0 ? (
              <ul className="grid gap-6 sm:grid-cols-2">
                {section.entries.map((entry) => (
                  <li
                    key={entry.href}
                    className="group flex h-full flex-col rounded-2xl border border-neutral-200/80 bg-white/80 p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-md dark:border-neutral-800/70 dark:bg-neutral-900/70"
                  >
                    {formatDate(entry.updated ?? entry.date) ? (
                      <span className="text-xs uppercase tracking-[0.25em] text-neutral-400">
                        {formatDate(entry.updated ?? entry.date)}
                      </span>
                    ) : null}
                    <Link
                      href={entry.href}
                      className="mt-2 text-xl font-semibold text-neutral-900 transition-colors group-hover:text-blue-600 dark:text-neutral-100 dark:group-hover:text-blue-400"
                    >
                      {entry.title}
                    </Link>
                    {entry.description ? (
                      <p className="mt-3 flex-1 text-sm text-neutral-600 dark:text-neutral-300">
                        {entry.description}
                      </p>
                    ) : null}
                  </li>
                ))}
              </ul>
            ) : (
              <div className="rounded-2xl border border-dashed border-neutral-200/80 bg-white/40 px-6 py-8 text-sm text-neutral-400 dark:border-neutral-700/60 dark:bg-neutral-900/40 dark:text-neutral-500">
                Work in progress—notes are being assembled here.
              </div>
            )}
          </section>
        ))}
      </div>
    </div>
  );
}

