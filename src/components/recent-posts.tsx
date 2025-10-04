import Link from "next/link";

import { cn } from "@/lib/cn";
import type { Post } from "contentlayer/generated";

type EnhancedPost = Post & {
  featured?: boolean;
  category?: string;
};

type RecentPostsProps = {
  posts: EnhancedPost[];
  className?: string;
  id?: string;
};

type CategoryConfig = {
  key: string;
  title: string;
  description: string;
  accent: string;
};

const sections: CategoryConfig[] = [
  {
    key: "tech",
    title: "Tech dispatches",
    description: "Systems thinking, shipping velocity, and developer experience notes.",
    accent: "from-blue-500/70 via-sky-400/60 to-cyan-500/50",
  },
  {
    key: "art",
    title: "Art studio",
    description: "Process journals, composition experiments, and visual storytelling.",
    accent: "from-purple-500/70 via-fuchsia-500/60 to-rose-400/50",
  },
  {
    key: "politics",
    title: "Civic field notes",
    description: "Grassroots design sprints, neighborhood advocacy, and policy sketches.",
    accent: "from-emerald-500/70 via-lime-400/60 to-green-500/50",
  },
  {
    key: "art-study",
    title: "Art study of the week",
    description: "Focused look at a single art exercise, technique, or observational sprint.",
    accent: "from-amber-500/70 via-orange-400/60 to-yellow-400/50",
  },
];

const toTitleCase = (value: string) =>
  value
    .split(/[-_]/)
    .filter(Boolean)
    .map((segment) => segment.charAt(0).toUpperCase() + segment.slice(1))
    .join(" ");

const formatDate = (value: string) =>
  new Intl.DateTimeFormat("en", {
    year: "numeric",
    month: "short",
    day: "2-digit",
  }).format(new Date(value));

const cardBaseStyles =
  "group flex h-full flex-col rounded-2xl border border-neutral-200/80 bg-white/80 p-6 shadow-sm backdrop-blur transition hover:-translate-y-1 hover:shadow-md dark:border-neutral-800/70 dark:bg-neutral-900/70";

export function RecentPosts({ posts, className, id }: RecentPostsProps) {
  const postsByCategory = posts.reduce<Record<string, EnhancedPost[]>>((acc, post) => {
    const key = (post.category ?? "misc").toLowerCase();

    if (!acc[key]) {
      acc[key] = [];
    }

    acc[key]?.push(post);
    return acc;
  }, {});

  const featuredPost = posts.find((post) => post.featured);

  const filteredPostsByCategory = Object.fromEntries(
    Object.entries(postsByCategory).map(([category, items]) => [
      category,
      items.filter((post) => post._id !== featuredPost?._id),
    ]),
  );

  const artStudyPosts = filteredPostsByCategory["art-study"] ?? [];

  const sectionMap = new Map(sections.map((section) => [section.key, section]));

  const extraSections: CategoryConfig[] = Object.keys(filteredPostsByCategory)
    .filter((key) => !sectionMap.has(key) && key !== "art-study")
    .map((key) => ({
      key,
      title: toTitleCase(key),
      description: "Assorted notes and experiments from the studio vault.",
      accent: "from-neutral-500/50 via-neutral-400/40 to-neutral-300/30",
    }));

  const standardSections = [...sections.filter((section) => section.key !== "art-study"), ...extraSections];

  return (
    <section id={id} className={cn("space-y-12", className)}>
      <div className="space-y-3">
        <h2 className="text-lg font-medium uppercase tracking-[0.25em] text-neutral-500">
          Recent work streams
        </h2>
        <p className="max-w-2xl text-base text-neutral-600 dark:text-neutral-300">
          Snapshot of what has been moving across the studio lately—grouped by the
          hats I wear and the threads they pull on.
        </p>
      </div>

      {featuredPost ? (
        <Link
          href={featuredPost.url}
          className={cn(
            cardBaseStyles,
            "relative overflow-hidden border-neutral-200 bg-gradient-to-br from-blue-500/10 via-indigo-500/5 to-transparent dark:border-neutral-700/80 dark:from-blue-400/20 dark:via-indigo-500/10",
          )}
        >
          <span className="inline-flex w-fit items-center gap-2 rounded-full bg-neutral-900/90 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-white shadow-sm dark:bg-neutral-100/10 dark:text-neutral-100">
            Featured
          </span>
          <h3 className="mt-4 text-2xl font-semibold text-neutral-900 dark:text-neutral-50">
            {featuredPost.title}
          </h3>
          <p className="mt-3 text-sm text-neutral-600 dark:text-neutral-300">
            {featuredPost.description}
          </p>
          <div className="mt-6 flex items-center justify-between text-xs uppercase tracking-[0.2em] text-neutral-400">
            <span>{featuredPost.category ?? "featured"}</span>
            <span>{formatDate(featuredPost.date)}</span>
          </div>
        </Link>
      ) : null}

      <div className="grid gap-12">
        {standardSections.map((section) => {
          const sectionPosts = filteredPostsByCategory[section.key] ?? [];

          return (
            <div key={section.key} className="space-y-6">
              <div className="flex flex-wrap items-end justify-between gap-3">
                <div>
                  <h3 className="text-xl font-semibold text-neutral-900 dark:text-neutral-100">
                    {section.title}
                  </h3>
                  <p className="text-sm text-neutral-600 dark:text-neutral-300">
                    {section.description}
                  </p>
                </div>
                <span
                  className={cn(
                    "inline-flex h-10 items-center rounded-full bg-gradient-to-r px-4 text-xs font-semibold uppercase tracking-[0.25em] text-white shadow-sm",
                    section.accent,
                  )}
                >
                  {section.key}
                </span>
              </div>

              {sectionPosts.length > 0 ? (
                <ul className="grid gap-6 sm:grid-cols-2">
                  {sectionPosts.map((post) => (
                    <li key={post.slug} className={cardBaseStyles}>
                      <span className="text-xs uppercase tracking-[0.25em] text-neutral-400">
                        {formatDate(post.date)}
                      </span>
                      <Link
                        className="mt-2 text-xl font-semibold text-neutral-900 transition-colors group-hover:text-blue-600 dark:text-neutral-100 dark:group-hover:text-blue-400"
                        href={post.url}
                      >
                        {post.title}
                      </Link>
                      <p className="mt-3 flex-1 text-sm text-neutral-600 dark:text-neutral-300">
                        {post.description}
                      </p>
                      <div className="mt-6 text-xs text-neutral-400">
                        {post.readingTime}
                      </div>
                    </li>
                  ))}
                </ul>
              ) : (
                <div className="rounded-2xl border border-dashed border-neutral-200/80 bg-white/40 px-6 py-8 text-sm text-neutral-400 dark:border-neutral-700/60 dark:bg-neutral-900/40 dark:text-neutral-500">
                  Nothing published here yet—studio notes are on the way.
                </div>
              )}
            </div>
          );
        })}
      </div>

      {artStudyPosts.length > 0 ? (
        <aside className="overflow-hidden rounded-3xl border border-neutral-200/70 bg-gradient-to-br from-amber-100/60 via-orange-100/30 to-transparent p-8 shadow-inner dark:border-neutral-700/70 dark:from-amber-500/10 dark:via-orange-500/5">
          <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
            <div className="max-w-xl space-y-3">
              <h3 className="text-xl font-semibold text-neutral-900 dark:text-neutral-100">
                Art study of the week
              </h3>
              <p className="text-sm text-neutral-700 dark:text-neutral-300">
                Deep dives into a single practice rep. New studies surface every
                Sunday with process notes and references.
              </p>
            </div>
            <span className="rounded-full bg-neutral-900/90 px-4 py-1 text-xs font-semibold uppercase tracking-[0.25em] text-white shadow-sm dark:bg-neutral-100/10 dark:text-neutral-100">
              art-study
            </span>
          </div>

          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            {artStudyPosts.map((post) => (
              <Link
                key={post.slug}
                href={post.url}
                className="group flex flex-col gap-3 rounded-2xl border border-transparent bg-white/70 p-5 shadow-sm transition hover:-translate-y-1 hover:border-neutral-200/70 hover:shadow-md dark:bg-neutral-950/50 dark:hover:border-neutral-700"
              >
                <span className="text-xs uppercase tracking-[0.25em] text-neutral-400">
                  {formatDate(post.date)}
                </span>
                <h4 className="text-lg font-medium text-neutral-900 transition group-hover:text-amber-600 dark:text-neutral-100 dark:group-hover:text-amber-300">
                  {post.title}
                </h4>
                <p className="text-sm text-neutral-600 dark:text-neutral-300">
                  {post.description}
                </p>
                <span className="text-xs text-neutral-400">{post.readingTime}</span>
              </Link>
            ))}
          </div>
        </aside>
      ) : null}
    </section>
  );
}
