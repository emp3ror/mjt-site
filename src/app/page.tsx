import MjtBanner from "@/components/mjt-banner";
import { AboutSection } from "@/components/home/about-section";
import { LatestNotesSection } from "@/components/home/latest-notes-section";
import { ContactSection } from "@/components/home/contact-section";
import type { Post } from "contentlayer/generated";
import { allPosts } from "contentlayer/generated";

const posts = [...allPosts].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

type EnhancedPost = Post & { featured?: boolean };

export default function Home() {
  const latestPosts = posts.slice(0, 3) as EnhancedPost[];

  return (
    <main className="flex flex-col gap-0">
      <MjtBanner />
      {/* <HeroSection /> */}

      {/* <DoodleDivider variant="cloud" colorClassName="text-[color:var(--muted)]/60" /> */}

      <AboutSection />

      {/* <ExperienceSection /> */}

      {/* <SkillsSection /> */}

      {/* <DoodleDivider variant="lotus" colorClassName="text-[color:var(--accent)]/50" /> */}

      {/* <WorksSection /> */}

      {/* <TestimonialsSection /> */}

      <LatestNotesSection posts={latestPosts} />

      <ContactSection />
    </main>
  );
}
