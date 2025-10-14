import { NextResponse } from "next/server";

import { notifyContactChannels } from "@/lib/contact-notifier";
import { z } from "zod";

const RECAPTCHA_VERIFY_URL = "https://www.google.com/recaptcha/api/siteverify";

const contactFormSchema = z.object({
  name: z.string().trim().min(1, "Name is required.").max(200, "Name is too long."),
  email: z.string().trim().min(1, "Email is required.").email("Provide a valid email address."),
  message: z.string().trim().min(1, "Message is required.").max(5000, "Message is too long."),
});

const recaptchaEnvSchema = z.object({
  GOOGLE_RECAPTCHA_SECRET_KEY: z.string().min(1, "GOOGLE_RECAPTCHA_SECRET_KEY is missing."),
});

function getStringValue(value: FormDataEntryValue | null) {
  return typeof value === "string" ? value : undefined;
}

export async function POST(request: Request) {
  const payload = await request.formData();

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
      return NextResponse.json(
        {
          error: "reCAPTCHA verification failed.",
          details: verification["error-codes"] ?? null,
        },
        { status: 400 },
      );
    }
  } else if (recaptchaToken) {
    return NextResponse.json(
      {
        error: "reCAPTCHA server secret is not configured.",
        issues: parsedEnv.success ? null : parsedEnv.error.flatten().fieldErrors,
      },
      { status: 500 },
    );
  }

  const notificationResults = await notifyContactChannels({ name, email, message });
  const delivered = notificationResults.filter((result) => result.ok);

  if (notificationResults.length > 0 && delivered.length === 0) {
    return NextResponse.json(
      {
        error: "Unable to deliver the message to the configured channel(s).",
        results: notificationResults,
      },
      { status: 502 },
    );
  }

  return NextResponse.json({ received: true, results: notificationResults });
}
