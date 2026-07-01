import type { Metadata } from "next";

import { ChapterHeader } from "@/components/chapter-header";
import { EditorialDivider } from "@/components/editorial-divider";
import { TraceCard } from "@/components/trace-card";
import { getSelfStudyListing } from "@/lib/self-study";
import { formatDate } from "@/lib/format";
import type { Trace } from "@/lib/traces";

export const metadata: Metadata = {
  title: "Self Study",
  description: "Long-form curricula, resources, and progress tracking for courses I'm working through on my own.",
};

const entryToTrace = (entry: {
  href: string;
  title: string;
  description?: string;
  date?: string;
  updated?: string;
}): Trace => ({
  id: entry.href,
  kind: "study",
  kindLabel: "Study",
  title: entry.title,
  description: entry.description,
  href: entry.href,
  date: entry.date,
  displayDate: formatDate(entry.updated ?? entry.date, "short"),
  tags: [],
  category: "self-study",
  sortDate: entry.updated ?? entry.date ?? "1970-01-01",
});

export default async function SelfStudyPage() {
  const { page, rootEntries, sections } = await getSelfStudyListing();

  return (
    <div className="page-wrap section-block">
      <ChapterHeader
        eyebrow="Chapter"
        title={page.title}
        description={
          page.intro ??
          page.description ??
          "Long-form curricula I'm working through on my own, with resources and a progress tracker."
        }
      />

      {rootEntries.length > 0 ? (
        <>
          <EditorialDivider className="my-12 md:my-14" />
          <section className="space-y-7">
            <div className="space-y-2">
              <p className="eyebrow">Courses</p>
              <h2 className="text-[2rem] leading-[1.08] tracking-[-0.02em] md:text-[2.55rem]">Standalone curricula.</h2>
            </div>
            <div className="trace-grid">
              {rootEntries.map((entry, index) => (
                <TraceCard
                  key={entry.href}
                  trace={entryToTrace(entry)}
                  className={index % 2 === 0 ? "md:col-span-7" : "md:col-span-5"}
                />
              ))}
            </div>
          </section>
        </>
      ) : null}

      <div className="mt-14 space-y-14">
        {sections.map((section) => {
          const sectionBlurb = section.intro ?? section.description;
          return (
            <section key={section.slug} className="space-y-7">
              <div className="space-y-4 border-t border-[color:var(--line)] pt-9">
                <p className="eyebrow">{section.slug.replace(/[-_]/g, " ")}</p>
                <h2 className="max-w-[18ch] text-[2rem] leading-[1.08] tracking-[-0.02em] md:text-[2.55rem]">{section.title}</h2>
                {sectionBlurb ? (
                  <p className="body-copy max-w-[62ch] text-[color:var(--ink-soft)]">
                    {sectionBlurb}
                  </p>
                ) : null}
              </div>

              <div className="trace-grid">
                {section.entries.map((entry, index) => (
                  <TraceCard
                    key={entry.href}
                    trace={entryToTrace(entry)}
                    className={index % 2 === 0 ? "md:col-span-7" : "md:col-span-5"}
                  />
                ))}
              </div>
            </section>
          );
        })}
      </div>
    </div>
  );
}
