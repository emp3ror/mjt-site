import { DoodleDivider } from "@/components/doodle-divider";
import MjtBanner from "@/components/mjt-banner";
import { HeroSection } from "@/components/home/hero-section";
import { AboutSection } from "@/components/home/about-section";
import { ExperienceSection } from "@/components/home/experience-section";
import { SkillsSection } from "@/components/home/skills-section";
import { WorksSection } from "@/components/home/works-section";
import { TestimonialsSection } from "@/components/home/testimonials-section";
import { LatestNotesSection } from "@/components/home/latest-notes-section";
import { ContactSection } from "@/components/home/contact-section";
import type { Post } from "contentlayer/generated";
import { allPosts } from "contentlayer/generated";

const posts = [...allPosts].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

type EnhancedPost = Post & { featured?: boolean };

export default function Home() {
  const latestPosts = posts.slice(0, 3) as EnhancedPost[];

  return (
    <div className="relative mx-auto flex min-h-screen max-w-6xl flex-col gap-24 px-6 pb-24 pt-24">
      <HeroSection />

      <MjtBanner />

      <DoodleDivider variant="cloud" colorClassName="text-[color:var(--muted)]/60" />

      <AboutSection />

      <ExperienceSection />

      <SkillsSection />

      <DoodleDivider variant="lotus" colorClassName="text-[color:var(--accent)]/50" />

      <WorksSection />

      <TestimonialsSection />

      <LatestNotesSection posts={latestPosts} />

      <ContactSection />
    </div>
  );
}
