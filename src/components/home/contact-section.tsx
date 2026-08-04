"use client";

/**
 * Contact form + social link list. Submits to `/api/contact`.
 * Optional reCAPTCHA is engaged when `NEXT_PUBLIC_GOOGLE_RECAPTCHA_SITE_KEY`
 * is defined. All copy and link metadata live in `content/site/contact.json`.
 */

import { type FormEvent, useState } from "react";
import Link from "next/link";
import Script from "next/script";
import {
  BriefcaseBusiness,
  Camera,
  Loader2,
  Mail,
  Palette,
  Send,
  type LucideIcon,
} from "lucide-react";

import { SectionHeading } from "@/components/section-heading";
import contact from "@content/site/contact.json";

type SocialIconName = "mail" | "palette" | "instagram" | "linkedin";

const SOCIAL_ICONS: Record<SocialIconName, LucideIcon> = {
  mail: Mail,
  palette: Palette,
  instagram: Camera,
  linkedin: BriefcaseBusiness,
};

type SubmitState = "idle" | "loading" | "success" | "error";

declare global {
  interface Window {
    grecaptcha?: {
      getResponse(widgetId?: number): string;
      reset(widgetId?: number): void;
    };
  }
}

const inputClass =
  "w-full border-b border-[color:var(--line-strong)] bg-transparent px-0 py-3 text-base text-[color:var(--foreground)] focus:border-[color:var(--accent)] focus:outline-none";

type ApiPayload = {
  error?: unknown;
  issues?: Record<string, unknown>;
  details?: unknown;
} | null;

const firstIssueMessage = (issues?: Record<string, unknown>) =>
  issues
    ? Object.values(issues)
        .flatMap((entry) => (Array.isArray(entry) ? entry : [entry]))
        .find((entry): entry is string => typeof entry === "string")
    : undefined;

const errorMessageFromPayload = (payload: ApiPayload) =>
  firstIssueMessage(payload?.issues as Record<string, unknown> | undefined) ??
  (typeof payload?.error === "string" ? payload.error : undefined) ??
  (typeof payload?.details === "string" ? payload.details : undefined) ??
  "Unable to send your message right now.";

export function ContactSection() {
  const recaptchaSiteKey = process.env.NEXT_PUBLIC_GOOGLE_RECAPTCHA_SITE_KEY;
  const [state, setState] = useState<SubmitState>("idle");
  const [feedback, setFeedback] = useState<string | null>(null);
  const isLoading = state === "loading";

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (isLoading) return;

    setState("loading");
    setFeedback(null);

    const form = event.currentTarget;
    const formData = new FormData(form);

    if (recaptchaSiteKey) {
      const token = window.grecaptcha?.getResponse() ?? "";
      if (!token) {
        setState("error");
        setFeedback("Please confirm you are not a robot.");
        return;
      }
      formData.set("g-recaptcha-response", token);
    }

    try {
      const response = await fetch("/api/contact", { method: "POST", body: formData });
      const payload = (await response.json().catch(() => null)) as ApiPayload;

      if (!response.ok) {
        setState("error");
        setFeedback(errorMessageFromPayload(payload));
        return;
      }

      setState("success");
      setFeedback("Thanks. Your note is on its way.");
      form.reset();
      window.grecaptcha?.reset();
    } catch {
      setState("error");
      setFeedback("Something went wrong. Please try again.");
    }
  };

  return (
    <section id="contact" className="section-block scroll-mt-28">
      <div className="page-wrap grid gap-10 md:grid-cols-[0.9fr_1.1fr] md:items-start">
        <div className="space-y-8">
          <SectionHeading
            eyebrow={contact.heading.eyebrow}
            title={contact.heading.title}
            description={contact.heading.description}
          />

          <ul className="space-y-3 border-t border-[color:var(--line)] pt-6">
            {contact.socialLinks.map((link) => {
              const Icon = SOCIAL_ICONS[link.icon as SocialIconName] ?? Mail;
              return (
                <li key={link.id}>
                  <Link
                    href={link.href}
                    aria-label={link.label}
                    className="flex items-center justify-between gap-4 border-b border-[color:var(--line)] py-3 text-sm text-[color:var(--ink-soft)] hover:text-[color:var(--foreground)]"
                  >
                    <span className="inline-flex items-center gap-3">
                      <Icon className="h-4 w-4 text-[color:var(--accent)]" aria-hidden />
                      {link.label}
                    </span>
                    <span aria-hidden>↗</span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>

        <form
          action="/api/contact"
          method="post"
          onSubmit={handleSubmit}
          className="border-t border-[color:var(--line-strong)] pt-6 md:pt-8"
        >
          <div className="grid gap-6">
            <label className="flex flex-col gap-2">
              <span className="eyebrow">{contact.form.fields.name.label}</span>
              <input
                id="name"
                name="name"
                type="text"
                autoComplete="name"
                maxLength={200}
                required
                className={inputClass}
              />
            </label>

            <label className="flex flex-col gap-2">
              <span className="eyebrow">{contact.form.fields.email.label}</span>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                maxLength={320}
                required
                className={inputClass}
              />
            </label>

            <label className="flex flex-col gap-2">
              <span className="eyebrow">{contact.form.fields.message.label}</span>
              <textarea
                id="message"
                name="message"
                rows={5}
                maxLength={5000}
                required
                className={`${inputClass} resize-y`}
              />
            </label>

            {/* Honeypot: hidden from users, irresistible to naive bots. */}
            <div aria-hidden className="absolute -left-[9999px] top-0 h-px w-px overflow-hidden">
              <label htmlFor="company">Company</label>
              <input
                id="company"
                name="company"
                type="text"
                tabIndex={-1}
                autoComplete="off"
              />
            </div>

            {recaptchaSiteKey ? (
              <div className="g-recaptcha" data-sitekey={recaptchaSiteKey} />
            ) : (
              <p className="text-sm text-[color:var(--ink-soft)]">
                {contact.form.recaptchaNotConfigured}
              </p>
            )}

            <div className="flex flex-col gap-3 border-t border-[color:var(--line)] pt-5">
              <button
                type="submit"
                disabled={isLoading}
                className="inline-flex items-center justify-center gap-2 self-start rounded-full border border-[color:var(--line)] px-5 py-2.5 text-sm text-[color:var(--foreground)] hover:border-[color:var(--accent)] hover:text-[color:var(--accent-strong)] disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" aria-hidden />
                    Sending...
                  </>
                ) : (
                  <>
                    {contact.form.submit.label}
                    <Send className="h-4 w-4" aria-hidden />
                  </>
                )}
              </button>

              {feedback && (
                <p
                  role="status"
                  aria-live="polite"
                  className={
                    state === "success"
                      ? "text-sm text-[color:var(--accent-strong)]"
                      : "text-sm text-[color:var(--accent-alt)]"
                  }
                >
                  {feedback}
                </p>
              )}

              <p className="text-sm leading-7 text-[color:var(--ink-soft)]">
                {contact.form.responseTimeNotice}
              </p>
            </div>
          </div>
        </form>

        {recaptchaSiteKey && (
          <Script src="https://www.google.com/recaptcha/api.js" strategy="afterInteractive" />
        )}
      </div>
    </section>
  );
}
