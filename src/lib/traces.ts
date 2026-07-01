import { allEvents, allPosts, type Event, type Post } from "@/content";
import { getArtCollegeListing, type ArtCollegeEntry } from "@/lib/art-college";
import { getSelfStudyListing, type SelfStudyEntry } from "@/lib/self-study";
import { formatEventDateRange } from "@/lib/events";
import { formatDate } from "@/lib/format";

export type TraceKind = "post" | "event" | "study";

export type Trace = {
  id: string;
  kind: TraceKind;
  kindLabel: string;
  title: string;
  description?: string;
  href: string;
  date?: string;
  endDate?: string;
  displayDate?: string;
  location?: string;
  tags: string[];
  category?: string;
  readingTime?: string;
  distance?: string;
  featured?: boolean;
  sortDate: string;
};

const fallbackDate = "1970-01-01";

const sortDesc = (items: Trace[]) =>
  [...items].sort(
    (a, b) => new Date(b.sortDate).getTime() - new Date(a.sortDate).getTime(),
  );

const inferDistance = (post: Post) => {
  const distanceTag = post.tags.find((tag) => /\d+(?:\.\d+)?\s?(km|mi)/i.test(tag));
  return distanceTag ?? undefined;
};

export const postToTrace = (post: Post): Trace => ({
  id: post._id,
  kind: "post",
  kindLabel: post.category === "hike" ? "Field note" : "Note",
  title: post.title,
  description: post.description,
  href: post.url,
  date: post.date,
  displayDate: formatDate(post.date, "short"),
  tags: post.tags ?? [],
  category: post.category,
  readingTime: post.readingTime,
  distance: inferDistance(post),
  featured: post.featured,
  sortDate: post.date,
});

export const eventToTrace = (event: Event): Trace => ({
  id: event._id,
  kind: "event",
  kindLabel: "Gathering",
  title: event.title,
  description: event.description,
  href: event.url,
  date: event.date,
  endDate: event.endDate,
  displayDate: formatEventDateRange({
    date: event.date,
    endDate: event.endDate,
    startTime: event.startTime,
    endTime: event.endTime,
  }),
  location: event.location,
  tags: event.tags ?? [],
  category: event.category,
  featured: false,
  sortDate: event.endDate ?? event.date,
});

const studyToTrace = (entry: ArtCollegeEntry): Trace => ({
  id: entry.href,
  kind: "study",
  kindLabel: "Study",
  title: entry.title,
  description: entry.description,
  href: entry.href,
  date: entry.date,
  displayDate: formatDate(entry.updated ?? entry.date, "short"),
  tags: [],
  category: "art-college",
  featured: false,
  sortDate: entry.updated ?? entry.date ?? fallbackDate,
});

const selfStudyToTrace = (entry: SelfStudyEntry): Trace => ({
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
  featured: false,
  sortDate: entry.updated ?? entry.date ?? fallbackDate,
});

export const getAllTraces = async (): Promise<Trace[]> => {
  const [artCollege, selfStudy] = await Promise.all([
    getArtCollegeListing(),
    getSelfStudyListing(),
  ]);

  const studyEntries = [
    ...artCollege.rootEntries,
    ...artCollege.sections.flatMap((section) => section.entries),
  ].map(studyToTrace);

  const selfStudyEntries = [
    ...selfStudy.rootEntries,
    ...selfStudy.sections.flatMap((section) => section.entries),
  ].map(selfStudyToTrace);

  return sortDesc([
    ...allPosts.map(postToTrace),
    ...allEvents.map(eventToTrace),
    ...studyEntries,
    ...selfStudyEntries,
  ]);
};

export const getRecentTraces = async (count = 6) => {
  const traces = await getAllTraces();
  return traces.slice(0, count);
};

export const getFeaturedTrace = async () => {
  const featuredPost = allPosts
    .filter((post) => post.featured)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())[0];

  if (featuredPost) {
    return postToTrace(featuredPost);
  }

  return (await getRecentTraces(1))[0];
};

export const getThemeTraces = async () => {
  const traces = await getAllTraces();

  return {
    fieldNotes: traces.filter((trace) => trace.kind === "post").slice(0, 3),
    gatherings: traces.filter((trace) => trace.kind === "event").slice(0, 2),
    studies: traces.filter((trace) => trace.kind === "study").slice(0, 2),
  };
};
