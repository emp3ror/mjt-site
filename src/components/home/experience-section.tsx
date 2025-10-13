import { SectionHeading } from "@/components/section-heading";
import { Timeline, type TimelineItem } from "@/components/timeline";
import experienceSectionContent from "@/data/home/experience-section.json";

type ExperienceSectionContent = {
  heading: {
    eyebrow: string;
    title: string;
    description: string;
  };
  timeline: TimelineItem[];
};

const content = experienceSectionContent as ExperienceSectionContent;

export function ExperienceSection() {
  return (
    <section id="experience" className="space-y-10">
      <SectionHeading
        eyebrow={content.heading.eyebrow}
        title={content.heading.title}
        description={content.heading.description}
      />
      <Timeline items={content.timeline} />
    </section>
  );
}
