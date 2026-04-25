import { PostCard } from "@/components/post-card";
import { allPosts, allPostsOverviews, type Overview } from "@/content";

export default function PostsPage() {
  const posts = [...allPosts].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  const overview: Overview | undefined = allPostsOverviews[0];

  return (
    <div className="page-wrap section-block">
      <header className="max-w-4xl space-y-5">
        <h1 className="max-w-[16ch] text-h1 leading-[1.02] tracking-[-0.03em] text-[color:var(--foreground)]">
          {overview?.title ?? "Learn from the latest posts."}
        </h1>
        <p className="body-copy text-[color:var(--ink-soft)]">
          {overview?.intro ??
            overview?.description ??
            "Simple notes and studies from the studio, organized in one clean feed."}
        </p>
      </header>

      <div className="mt-12 grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-4">
        {posts.map((post) => (
          <PostCard key={post._id} post={post} />
        ))}
      </div>
    </div>
  );
}
