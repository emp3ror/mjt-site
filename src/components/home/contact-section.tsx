import Link from "next/link";
import Script from "next/script";

import { SectionHeading } from "@/components/section-heading";
import contactSectionContent from "@/data/home/contact-section.json";
import { Sparkles, Instagram, Linkedin, Mail, Palette } from "lucide-react";

type IconName = "Mail" | "Palette" | "Instagram" | "Linkedin" | "Sparkles";

type ContactSectionContent = {
  heading: {
    eyebrow: string;
    title: string;
    description: string;
  };
  contactSocials: Array<{
    label: string;
    href: string;
    icon: IconName;
  }>;
  form: {
    fields: {
      name: { label: string };
      email: { label: string };
      message: { label: string };
    };
    submit: {
      label: string;
      icon: IconName;
    };
    recaptchaNotConfigured: string;
    responseTimeNotice: string;
  };
};

const iconMap: Record<IconName, typeof Mail> = {
  Mail,
  Palette,
  Instagram,
  Linkedin,
  Sparkles,
};

const content = contactSectionContent as ContactSectionContent;

export function ContactSection() {
  const recaptchaSiteKey = process.env.NEXT_PUBLIC_GOOGLE_RECAPTCHA_SITE_KEY;
  const SubmitIcon = iconMap[content.form.submit.icon] ?? Sparkles;

  return (
    <section id="contact" className="w-full bg-white/80 py-16 sm:py-24">
      <div className="mx-auto grid max-w-6xl gap-8 rounded-[3rem] bg-white/90 p-10 shadow-[0_26px_80px_rgba(44,45,94,0.16)] backdrop-blur lg:grid-cols-[0.9fr_1.1fr]">
        <div className="space-y-6">
          <SectionHeading
            eyebrow={content.heading.eyebrow}
            title={content.heading.title}
            description={content.heading.description}
          />

          <div className="grid gap-3">
            {content.contactSocials.map(({ label, href, icon }) => {
              const Icon = iconMap[icon] ?? Mail;
              return (
                <Link
                  key={label}
                  href={href}
                  className="group inline-flex items-center gap-3 rounded-2xl border border-[color:var(--muted)]/50 bg-white/80 px-5 py-3 text-sm font-semibold text-[color:var(--ink)] transition hover:-translate-y-1 hover:bg-white"
                >
                  <Icon className="h-4 w-4 text-[color:var(--accent)] group-hover:scale-110" aria-hidden />
                  {label}
                </Link>
              );
            })}
          </div>
        </div>

        <form
          action="/api/contact"
          method="post"
          className="grid gap-4 rounded-3xl border border-[color:var(--muted)]/40 bg-white/95 p-6 shadow-inner"
        >
          <div className="grid gap-2">
            <label className="text-xs font-semibold uppercase tracking-[0.3em] text-[color:var(--ink)]/60" htmlFor="name">
              {content.form.fields.name.label}
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
              {content.form.fields.email.label}
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
              {content.form.fields.message.label}
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
            {content.form.submit.label}
            <SubmitIcon className="h-4 w-4" aria-hidden />
          </button>
          {recaptchaSiteKey ? (
            <div className="pt-2">
              <div className="g-recaptcha" data-sitekey={recaptchaSiteKey} />
            </div>
          ) : (
            <p className="text-xs text-[color:var(--ink)]/60">
              {content.form.recaptchaNotConfigured}
            </p>
          )}
          <p className="text-xs text-[color:var(--ink)]/50">
            {content.form.responseTimeNotice}
          </p>
        </form>
        {recaptchaSiteKey ? (
          <Script src="https://www.google.com/recaptcha/api.js" strategy="afterInteractive" />
        ) : null}
      </div>
    </section>
  );
}
