import { cache } from "react";
import Link from "next/link";
import { compileMDX } from "next-mdx-remote/rsc";

import { Badge } from "@/components/badge";
import { DoodleDivider } from "@/components/doodle-divider";
import { MdxContainer, mdxComponents } from "@/components/mdx/mdx";
import { SectionHeading } from "@/components/section-heading";
import type { ShopItem, ShopOverview } from "contentlayer/generated";
import { allShopItems, allShopOverviews } from "contentlayer/generated";

const renderOverview = cache(async (source: string) => {
  const { content } = await compileMDX<{ [key: string]: unknown }>({
    source,
    options: {
      mdxOptions: {
        remarkPlugins: [],
      },
    },
    components: mdxComponents,
  });

  return content;
});

const formatDate = (value: string) =>
  new Intl.DateTimeFormat("en", {
    year: "numeric",
    month: "short",
    day: "2-digit",
  }).format(new Date(value));

const sortItems = (items: ShopItem[]) =>
  [...items].sort((a, b) => {
    const aDate = a.updated ? new Date(a.updated).getTime() : 0;
    const bDate = b.updated ? new Date(b.updated).getTime() : 0;
    if (aDate === bDate) return a.title.localeCompare(b.title);
    return bDate - aDate;
  });

export default async function ShopPage() {
  const overview: ShopOverview | undefined = allShopOverviews[0];
  const items = sortItems(allShopItems);

  const overviewContent = overview ? await renderOverview(overview.body.raw) : null;

  return (
    <div className="relative mx-auto flex min-h-screen max-w-6xl flex-col gap-16 px-6 pb-24 pt-24">
      <section className="space-y-6">
        <Badge className="bg-white/85 text-[color:var(--accent)]">Shop</Badge>
        <SectionHeading
          title={overview?.title ?? "Studio shop"}
          description={overview?.description ?? "Limited-run prints, stickers, and experiments straight from the studio."}
        />

        {overview?.intro ? (
          <p className="max-w-3xl text-sm text-[color:var(--ink)]/70">{overview.intro}</p>
        ) : null}

        {overviewContent ? <MdxContainer>{overviewContent}</MdxContainer> : null}

        {overview?.updated ? (
          <p className="text-xs uppercase tracking-[0.3em] text-[color:var(--muted)]">
            Updated {formatDate(overview.updated)}
          </p>
        ) : null}
      </section>

      <DoodleDivider variant="cloud" colorClassName="text-[color:var(--muted)]/50" />

      {items.length > 0 ? (
        <div className="grid gap-6 md:grid-cols-2">
          {items.map((item) => (
            <Link
              key={item._id}
              href={item.url}
              className="group block h-full rounded-[2rem] border border-[color:var(--muted)]/60 bg-white/90 p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-[0_18px_50px_rgba(44,45,94,0.16)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[color:var(--accent)]"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="space-y-2">
                  <h3 className="text-lg font-semibold text-[color:var(--ink)] transition group-hover:text-[color:var(--accent)]">
                    {item.title}
                  </h3>
                  {item.intro ? (
                    <p className="text-sm text-[color:var(--ink)]/70">{item.intro}</p>
                  ) : null}
                  {item.description ? (
                    <p className="text-xs text-[color:var(--ink)]/60">{item.description}</p>
                  ) : null}
                </div>
                <span className="text-lg text-[color:var(--accent)] transition group-hover:translate-x-1" aria-hidden>
                  →
                </span>
              </div>
              {item.updated ? (
                <p className="mt-4 text-xs uppercase tracking-[0.25em] text-[color:var(--muted)]">
                  Updated {formatDate(item.updated)}
                </p>
              ) : null}
            </Link>
          ))}
        </div>
      ) : (
        <div className="rounded-[2.5rem] border border-dashed border-[color:var(--muted)]/60 bg-white/70 px-8 py-16 text-center text-sm text-[color:var(--ink)]/60">
          <p className="text-lg font-semibold text-[color:var(--ink)]">No items yet</p>
          <p className="mt-2">The shop shelf is being restocked. Check back soon.</p>
        </div>
      )}
    </div>
  );
}
