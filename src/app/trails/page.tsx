import type { Metadata } from "next";

import { ChapterHeader } from "@/components/chapter-header";
import { EditorialDivider } from "@/components/editorial-divider";
import { TrailsLog } from "@/components/trails/trails-log";
import { allTrails } from "@/lib/trails";
import { formatDate as formatDateBase } from "@/lib/format";

const formatDate = (value?: string) => formatDateBase(value, "short") ?? "—";

export const metadata: Metadata = {
  title: "Field Log",
  description:
    "Tracked routes — hikes and runs that left a GPS trace, gathered into one chronological log.",
};

export default function TrailsPage() {
  const trails = allTrails;
  const hikeCount = trails.filter((trail) => trail.kind === "hike").length;
  const runCount = trails.filter((trail) => trail.kind === "run").length;

  const totalDistanceKm = trails.reduce(
    (sum, trail) => sum + (trail.stats?.distanceKm ?? 0),
    0,
  );

  return (
    <div className="page-wrap section-block">
      <ChapterHeader
        eyebrow="Field Log"
        title="Tracked routes, kept in one place."
        description="Every entry below carries a real GPS trace. Open one to see the full map and elevation profile."
      />

      <dl className="mt-10 grid grid-cols-2 gap-x-8 gap-y-5 border-y border-[color:var(--line)] py-6 text-sm md:grid-cols-4">
        <Stat label="Entries" value={trails.length.toString()} />
        <Stat label="Hikes" value={hikeCount.toString()} />
        <Stat label="Runs" value={runCount.toString()} />
        <Stat
          label="Distance logged"
          value={
            totalDistanceKm > 0 ? `${totalDistanceKm.toFixed(1)} km` : "—"
          }
        />
      </dl>

      <EditorialDivider className="my-10 md:my-14" />

      <TrailsLog trails={trails} formatDate={formatDate} />
    </div>
  );
}

type StatProps = { label: string; value: string };

function Stat({ label, value }: StatProps) {
  return (
    <div className="flex flex-col gap-1.5">
      <dt className="eyebrow text-[0.62rem] text-[color:var(--muted)]">{label}</dt>
      <dd className="font-serif text-2xl tracking-[-0.01em] text-[color:var(--foreground)]">
        {value}
      </dd>
    </div>
  );
}
