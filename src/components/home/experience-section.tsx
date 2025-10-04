import { SectionHeading } from "@/components/section-heading";
import { Timeline, type TimelineItem } from "@/components/timeline";

const experienceTimeline: TimelineItem[] = [
  {
    title: "Freelance Visual Designer",
    organization: "Independent Studio",
    timeframe: "2023 - Present",
    highlights: [
      "Packaging worlds for lifestyle brands tying illustration with tactile finishes.",
      "Shipped kits for community art programs with playful activation guides.",
      "Built component libraries that carry both dev handoff and print specs.",
    ],
  },
  {
    title: "Senior Designer",
    organization: "Studio Kathmandu",
    timeframe: "2021 - 2023",
    highlights: [
      "Led brand refreshes across retail, beverage, and civic campaigns.",
      "Partnered with engineers to deliver responsive editorial microsites.",
      "Mentored junior artists through figure drawing and color labs weekly.",
    ],
  },
  {
    title: "Illustration Fellow",
    organization: "Art College Residency",
    timeframe: "2019 - 2021",
    highlights: [
      "Explored gesture drawing, art history, and cross-cultural storytelling.",
      "Collaborated with faculty on curriculum visuals and exhibition signage.",
      "Documented each semester inside the open Art College archive.",
    ],
  },
];

export function ExperienceSection() {
  return (
    <section id="experience" className="space-y-10">
      <SectionHeading
        eyebrow="Experience"
        title="Timeline of playful, human-centered collaborations"
        description="Roles blending design, illustration, and systems thinking across studios and residencies."
      />
      <Timeline items={experienceTimeline} />
    </section>
  );
}
