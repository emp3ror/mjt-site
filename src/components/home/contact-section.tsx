import Link from "next/link";

import { SectionHeading } from "@/components/section-heading";
import { Sparkles, Instagram, Linkedin, Mail, Palette } from "lucide-react";

const contactSocials = [
  { label: "Email", href: "mailto:hello@mjt.studio", icon: Mail },
  { label: "Behance", href: "https://www.behance.net", icon: Palette },
  { label: "Instagram", href: "https://www.instagram.com", icon: Instagram },
  { label: "LinkedIn", href: "https://www.linkedin.com", icon: Linkedin },
];

export function ContactSection() {
  return (
    <section id="contact" className="grid gap-8 rounded-[3rem] bg-white/80 p-10 shadow-[0_26px_80px_rgba(44,45,94,0.16)] backdrop-blur lg:grid-cols-[0.9fr_1.1fr]">
      <div className="space-y-6">
        <SectionHeading
          eyebrow="Contact"
          title="Let us build something friendly"
          description="Tell me about your next launch, illustration brief, or art residency."
        />

        <div className="grid gap-3">
          {contactSocials.map(({ label, href, icon: Icon }) => (
            <Link
              key={label}
              href={href}
              className="group inline-flex items-center gap-3 rounded-2xl border border-[color:var(--muted)]/50 bg-white/80 px-5 py-3 text-sm font-semibold text-[color:var(--ink)] transition hover:-translate-y-1 hover:bg-white"
            >
              <Icon className="h-4 w-4 text-[color:var(--accent)] group-hover:scale-110" aria-hidden />
              {label}
            </Link>
          ))}
        </div>
      </div>

      <form
        action="/api/contact"
        method="post"
        className="grid gap-4 rounded-3xl border border-[color:var(--muted)]/40 bg-white/90 p-6 shadow-inner"
      >
        <div className="grid gap-2">
          <label className="text-xs font-semibold uppercase tracking-[0.3em] text-[color:var(--ink)]/60" htmlFor="name">
            Name
          </label>
          <input
            id="name"
            name="name"
            type="text"
            required
            className="h-12 rounded-2xl border border-[color:var(--muted)]/40 bg-white px-4 text-sm text-[color:var(--ink)] shadow-sm focus:border-[color:var(--accent)]"
          />
        </div>
        <div className="grid gap-2">
          <label className="text-xs font-semibold uppercase tracking-[0.3em] text-[color:var(--ink)]/60" htmlFor="email">
            Email
          </label>
          <input
            id="email"
            name="email"
            type="email"
            required
            className="h-12 rounded-2xl border border-[color:var(--muted)]/40 bg-white px-4 text-sm text-[color:var(--ink)] shadow-sm focus:border-[color:var(--leaf)]"
          />
        </div>
        <div className="grid gap-2">
          <label className="text-xs font-semibold uppercase tracking-[0.3em] text-[color:var(--ink)]/60" htmlFor="message">
            Message
          </label>
          <textarea
            id="message"
            name="message"
            rows={4}
            required
            className="rounded-2xl border border-[color:var(--muted)]/40 bg-white px-4 py-3 text-sm text-[color:var(--ink)] shadow-sm focus:border-[color:var(--accent)]"
          />
        </div>
        <button
          type="submit"
          className="mt-2 inline-flex items-center justify-center gap-2 rounded-full bg-[color:var(--accent)] px-6 py-3 text-sm font-semibold text-white shadow-[0_18px_44px_rgba(242,92,39,0.35)] transition hover:-translate-y-1"
        >
          Send message
          <Sparkles className="h-4 w-4" aria-hidden />
        </button>
        <p className="text-xs text-[color:var(--ink)]/50">
          You will receive a copy of your message. Responses arrive within two business days.
        </p>
      </form>
    </section>
  );
}
