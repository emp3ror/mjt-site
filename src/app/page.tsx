import { HomeHero } from "@/components/home/home-hero";
import { JournalSection } from "@/components/home/journal-section";
import { StoriesSection } from "@/components/home/stories-section";
import { TrailsSection } from "@/components/home/trails-section";
import { VolunteeringSection } from "@/components/home/volunteering-section";
import { allEvents, allPosts } from "@/content";
import { formatDate as formatDateBase } from "@/lib/format";
import { allTrails } from "@/lib/trails";

const formatDate = (value?: string) => formatDateBase(value, "short") ?? "Ongoing";

const byNewest = <T extends { date: string; endDate?: string }>(items: T[]) =>
  [...items].sort(
    (a, b) =>
      new Date(b.endDate ?? b.date).getTime() -
      new Date(a.endDate ?? a.date).getTime(),
  );

export default function Home() {
  const posts = byNewest(allPosts);
  const events = byNewest(allEvents);

  return (
    <div className="pb-20 md:pb-28">
      <HomeHero />
      <VolunteeringSection events={events} posts={posts} formatDate={formatDate} />
      <JournalSection posts={posts} formatDate={formatDate} />
      <TrailsSection trails={allTrails} formatDate={formatDate} />
      <StoriesSection posts={posts} />
    </div>
  );
}
