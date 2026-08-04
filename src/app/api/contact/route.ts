import { NextResponse } from "next/server";

import { notifyContactChannels } from "@/lib/contact-notifier";
import { checkRateLimit } from "@/lib/rate-limit";
import { z } from "zod";

const RECAPTCHA_VERIFY_URL = "https://www.google.com/recaptcha/api/siteverify";

/** Submissions allowed per client, per window. */
const RATE_LIMIT = { limit: 5, windowMs: 10 * 60 * 1000 };

const contactFormSchema = z.object({
  name: z.string().trim().min(1, "Name is required.").max(200, "Name is too long."),
  email: z
    .string()
    .trim()
    .min(1, "Email is required.")
    .max(320, "Email is too long.")
    .email("Provide a valid email address."),
  message: z.string().trim().min(1, "Message is required.").max(5000, "Message is too long."),
});

const recaptchaEnvSchema = z.object({
  GOOGLE_RECAPTCHA_SECRET_KEY: z.string().min(1, "GOOGLE_RECAPTCHA_SECRET_KEY is missing."),
});

function getStringValue(value: FormDataEntryValue | null) {
  return typeof value === "string" ? value : undefined;
}

/**
 * Best-effort client identity for rate limiting. Proxy headers are spoofable,
 * so this throttles casual abuse rather than a determined attacker — pair it
 * with edge/WAF rate limiting in production.
 */
function clientKey(request: Request) {
  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) {
    return forwarded.split(",")[0]!.trim();
  }
  return request.headers.get("x-real-ip") ?? "unknown";
}

export async function POST(request: Request) {
  const { allowed, retryAfterSeconds } = checkRateLimit(
    `contact:${clientKey(request)}`,
    RATE_LIMIT,
  );

  if (!allowed) {
    return NextResponse.json(
      { error: "Too many messages sent. Please try again later." },
      { status: 429, headers: { "Retry-After": String(retryAfterSeconds) } },
    );
  }

  let payload: FormData;
  try {
    payload = await request.formData();
  } catch {
    return NextResponse.json({ error: "Invalid form submission." }, { status: 400 });
  }

  // Honeypot: a real browser leaves the off-screen field empty. Answer with a
  // plain success so bots get no signal to adapt to, but send nothing onward.
  if ((getStringValue(payload.get("company")) ?? "").trim().length > 0) {
    return NextResponse.json({ received: true });
  }

  const recaptchaToken = getStringValue(payload.get("g-recaptcha-response")) ?? "";

  const parsedPayload = contactFormSchema.safeParse({
    name: getStringValue(payload.get("name")) ?? "",
    email: getStringValue(payload.get("email")) ?? "",
    message: getStringValue(payload.get("message")) ?? "",
  });

  if (!parsedPayload.success) {
    return NextResponse.json(
      {
        error: "Invalid form submission.",
        issues: parsedPayload.error.flatten().fieldErrors,
      },
      { status: 400 },
    );
  }

  const { name, email, message } = parsedPayload.data;

  const parsedEnv = recaptchaEnvSchema.safeParse({
    GOOGLE_RECAPTCHA_SECRET_KEY: process.env.GOOGLE_RECAPTCHA_SECRET_KEY ?? "",
  });

  const recaptchaSecret = parsedEnv.success ? parsedEnv.data.GOOGLE_RECAPTCHA_SECRET_KEY : "";
  const recaptchaConfigured = recaptchaSecret.length > 0;

  if (recaptchaConfigured) {
    if (!recaptchaToken) {
      return NextResponse.json(
        {
          error: "Invalid form submission.",
          issues: { recaptchaToken: ["reCAPTCHA token is required."] },
        },
        { status: 400 },
      );
    }

    const verificationResponse = await fetch(RECAPTCHA_VERIFY_URL, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({ secret: recaptchaSecret, response: recaptchaToken }),
    });

    if (!verificationResponse.ok) {
      return NextResponse.json({ error: "Failed to verify reCAPTCHA." }, { status: 502 });
    }

    const verification = (await verificationResponse.json()) as {
      success?: boolean;
      score?: number;
      action?: string;
      "error-codes"?: string[];
    };

    if (!verification.success) {
      // The raw error codes describe our own configuration; keep them server-side.
      console.warn("reCAPTCHA verification failed", verification["error-codes"]);
      return NextResponse.json(
        { error: "reCAPTCHA verification failed. Please try again." },
        { status: 400 },
      );
    }
  } else if (recaptchaToken) {
    console.error("Received a reCAPTCHA token but GOOGLE_RECAPTCHA_SECRET_KEY is not set.");
    return NextResponse.json(
      { error: "Contact form is misconfigured. Please email instead." },
      { status: 500 },
    );
  }

  const notificationResults = await notifyContactChannels({ name, email, message });
  const delivered = notificationResults.filter((result) => result.ok);

  if (notificationResults.length > 0 && delivered.length === 0) {
    // Channel names and failure reasons expose which integrations exist and how
    // they are configured, so they are logged rather than returned.
    console.error("Contact delivery failed on every channel", notificationResults);
    return NextResponse.json(
      { error: "Unable to deliver your message right now. Please try again later." },
      { status: 502 },
    );
  }

  return NextResponse.json({ received: true });
}
