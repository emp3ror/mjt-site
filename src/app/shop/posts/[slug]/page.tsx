import { cache } from "react";
import { notFound } from "next/navigation";
import { compileMDX } from "next-mdx-remote/rsc";

import { Badge } from "@/components/badge";
import { ContactSection } from "@/components/home/contact-section";
import { DoodleDivider } from "@/components/doodle-divider";
import { MdxContainer, mdxComponents } from "@/components/mdx/mdx";
import { SectionHeading } from "@/components/section-heading";
import type { ShopItem } from "contentlayer/generated";
import { allShopItems } from "contentlayer/generated";

type ShopPostPageProps = {
  params: {
    slug: string;
  };
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

const formatDate = (value: string) =>
  new Intl.DateTimeFormat("en", {
    year: "numeric",
    month: "short",
    day: "2-digit",
  }).format(new Date(value));

export const generateStaticParams = () =>
  allShopItems.map((item) => ({
    slug: item.slug,
  }));

export default async function ShopPostPage({ params }: ShopPostPageProps) {
  const item: ShopItem | undefined = allShopItems.find((entry) => entry.slug === params.slug);

  if (!item) {
    notFound();
  }

  const content = await renderContent(item.body.raw);

  return (
    <div className="relative mx-auto flex min-h-screen max-w-5xl flex-col gap-12 px-6 pb-24 pt-24">
      <section className="space-y-6">
        <Badge className="bg-white/85 text-[color:var(--accent)]">Shop Post</Badge>
        <SectionHeading
          title={item.title}
          description={item.description ?? "Studio-made item details and ordering notes."}
        />

        {item.intro ? (
          <p className="max-w-3xl text-sm text-[color:var(--ink)]/70">{item.intro}</p>
        ) : null}

        <MdxContainer>{content}</MdxContainer>

        {item.updated ? (
          <p className="text-xs uppercase tracking-[0.3em] text-[color:var(--muted)]">
            Updated {formatDate(item.updated)}
          </p>
        ) : null}
      </section>

      <DoodleDivider variant="lotus" colorClassName="text-[color:var(--muted)]/50" />

      <ContactSection />
    </div>
  );
}
