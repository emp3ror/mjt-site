import { cache } from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { compileMDX } from "next-mdx-remote/rsc";

import { LongformEntry } from "@/components/longform-entry";
import { MdxContainer, mdxComponents } from "@/components/mdx/mdx";
import { allShopItems, type ShopItem } from "@/content";
import { formatDate } from "@/lib/format";

type ShopPostPageProps = {
  params: Promise<{
    slug: string;
  }>;
};

const renderContent = cache(async (source: string) => {
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

export const generateStaticParams = () =>
  allShopItems.map((item) => ({
    slug: item.slug,
  }));

export default async function ShopPostPage({ params }: ShopPostPageProps) {
  const { slug } = await params;
  const item: ShopItem | undefined = allShopItems.find((entry) => entry.slug === slug);

  if (!item) {
    notFound();
  }

  const content = await renderContent(item.body.raw);

  return (
    <LongformEntry
      className="longform-note"
      backHref="/shop"
      backLabel="Back to shop"
      eyebrow="Shop drop"
      title={item.title}
      description={item.description}
      meta={[
        { label: "Updated", value: formatDate(item.updated, "long") },
        { label: "Format", value: "Small batch" },
      ]}
    >
      <div className="space-y-12">
        <MdxContainer>{content}</MdxContainer>

        <aside className="rounded-3xl border border-[color:var(--line)] bg-[color:var(--surface-strong)] p-7 md:p-8">
          <p className="eyebrow">Request a run</p>
          <p className="mt-3 max-w-[52ch] text-[1rem] leading-7 text-[color:var(--ink-soft)]">
            Want this drop, a bespoke variant, or a longer run? Send a note with quantities, sizes,
            and any artwork references — I&rsquo;ll reply with a proof and a quote.
          </p>
          <div className="mt-5 flex flex-wrap gap-3 text-sm">
            <Link
              href="/#contact"
              className="inline-flex items-center gap-2 rounded-full bg-[color:var(--foreground)] px-5 py-2.5 font-medium text-[color:var(--background)] transition hover:-translate-y-0.5"
            >
              Request a run
              <span aria-hidden>→</span>
            </Link>
            <Link
              href="/shop"
              className="inline-flex items-center gap-2 rounded-full border border-[color:var(--line-strong)] px-5 py-2.5 font-medium text-[color:var(--ink-soft)] transition hover:border-[color:var(--accent)] hover:text-[color:var(--foreground)]"
            >
              Browse other drops
            </Link>
          </div>
        </aside>
      </div>
    </LongformEntry>
  );
}
