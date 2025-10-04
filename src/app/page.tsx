import AboutMeSection from "@/components/about-me-section";
import { EditorialBanner } from "@/components/editorial-banner";
import { RecentPosts } from "@/components/recent-posts";
import { allPosts } from "contentlayer/generated";

const posts = [...allPosts].sort((a, b) =>
  new Date(b.date).getTime() - new Date(a.date).getTime(),
);

export default function Home() {
  const enhancedPosts = posts as Array<
    (typeof posts)[number] & {
      featured?: boolean;
      category?: string;
    }
  >;

  return (
    <div className="mx-auto flex min-h-screen max-w-4xl flex-col gap-16 px-6 py-16">
      <header className="space-y-4">
        <p className="text-sm uppercase tracking-[0.3em] text-neutral-500">
          Notes on tech · life · art
        </p>
        <h1 className="text-4xl font-semibold tracking-tight text-neutral-900 dark:text-neutral-100">
          Making quiet, fast web experiences.
        </h1>
        <p className="max-w-2xl text-base text-neutral-600 dark:text-neutral-300">
          A static-first Next.js build that leans on MDX for storytelling. This is the
          staging ground while the editorial design takes shape.
        </p>
      </header>

      <EditorialBanner />

      <AboutMeSection />

      <RecentPosts id="recent-work" posts={enhancedPosts} />
    </div>
  );
}
