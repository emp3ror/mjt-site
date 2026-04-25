import type { Metadata } from "next";

import { ChapterHeader } from "@/components/chapter-header";
import { EditorialDivider } from "@/components/editorial-divider";
import { TraceCard } from "@/components/trace-card";
import { getAllTraces } from "@/lib/traces";

export const metadata: Metadata = {
  title: "Traces",
  description: "A unified archive of notes, gatherings, and studies.",
};

export default async function TracesPage() {
  const traces = await getAllTraces();

  return (
    <div className="page-wrap section-block">
      <ChapterHeader
        eyebrow="Archive"
        title="Traces"
        description="Entries from software, studio work, running, and community life gathered into one shared index."
      />

      <EditorialDivider className="my-12 md:my-14" />

      <div className="trace-grid">
        {traces.map((trace, index) => (
          <TraceCard
            key={trace.id}
            trace={trace}
            className={index % 2 === 0 ? "md:col-span-7" : "md:col-span-5"}
          />
        ))}
      </div>
    </div>
  );
}
