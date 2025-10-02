import Link from "next/link";
import { allPosts } from "contentlayer/generated";

const posts = [...allPosts].sort((a, b) =>
  new Date(b.date).getTime() - new Date(a.date).getTime(),
);

const formatDate = (value: string) =>
  new Intl.DateTimeFormat("en", {
    year: "numeric",
    month: "short",
    day: "2-digit",
  }).format(new Date(value));

export default function Home() {
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

      <section className="space-y-10">
        <h2 className="text-lg font-medium text-neutral-700 dark:text-neutral-200">
          Latest posts
        </h2>
        <ul className="grid gap-8 sm:grid-cols-2">
          {posts.map((post) => (
            <li
              key={post.slug}
              className="group flex flex-col rounded-2xl border border-neutral-200/80 bg-white/70 p-6 shadow-sm backdrop-blur transition hover:-translate-y-1 hover:shadow-md dark:border-neutral-800/70 dark:bg-neutral-900/70"
            >
              <span className="text-xs uppercase tracking-[0.25em] text-neutral-400">
                {post.category}
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
              <div className="mt-6 flex items-center justify-between text-xs text-neutral-400">
                <span>{formatDate(post.date)}</span>
                <span>{post.readingTime}</span>
              </div>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
