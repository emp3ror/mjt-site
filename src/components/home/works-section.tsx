import Image from "next/image";
import Link from "next/link";

import { Card } from "@/components/card";
import { SectionHeading } from "@/components/section-heading";
import { ArrowUpRight } from "lucide-react";
import worksSectionContent from "@/data/home/works-section.json";

type WorkProject = {
  title: string;
  category: string;
  description: string;
  cover: string;
  tags: string[];
  link: string;
};

type WorksSectionContent = {
  heading: {
    eyebrow: string;
    title: string;
    description: string;
  };
  projects: WorkProject[];
};

const content = worksSectionContent as WorksSectionContent;

export function WorksSection() {
  return (
    <section id="works" className="w-full bg-white">
      <div className="container mx-auto max-w-7xl space-y-10 px-4 py-16 sm:py-20 md:px-8">
        <SectionHeading
          eyebrow={content.heading.eyebrow}
          title={content.heading.title}
          description={content.heading.description}
        />
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {content.projects.map((work) => (
            <Card key={work.title} className="space-y-4 overflow-hidden p-0">
              <div className="relative aspect-[4/3] overflow-hidden">
                <Image
                  src={work.cover}
                  alt={work.title}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 33vw"
                />
                <span className="absolute left-4 top-4 inline-flex rounded-full bg-white/85 px-3 py-1 text-xs font-semibold uppercase tracking-[0.3em] text-[color:var(--accent)]">
                  {work.category}
                </span>
              </div>
              <div className="space-y-3 px-6 pb-6 pt-2">
                <div className="flex items-start justify-between gap-4">
                  <h3 className="text-xl font-semibold text-[color:var(--ink)]">{work.title}</h3>
                  <Link
                    href={work.link}
                    className="mt-1 inline-flex h-10 w-10 items-center justify-center rounded-full bg-[color:var(--accent)]/15 text-[color:var(--ink)] transition hover:bg-[color:var(--accent)] hover:text-white"
                  >
                    <ArrowUpRight className="h-4 w-4" aria-hidden />
                  </Link>
                </div>
                <p className="text-sm text-[color:var(--ink)]/75">{work.description}</p>
                <div className="flex flex-wrap gap-2 text-xs font-semibold uppercase tracking-[0.25em] text-[color:var(--ink)]/60">
                  {work.tags.map((tag) => (
                    <span key={tag} className="rounded-full bg-white/80 px-3 py-1">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
