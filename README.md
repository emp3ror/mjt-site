This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Contact form configuration

Create a `.env.local` file to configure spam protection and message delivery for the contact form.

```
NEXT_PUBLIC_GOOGLE_RECAPTCHA_SITE_KEY=""
GOOGLE_RECAPTCHA_SECRET_KEY=""

# Comma separated list of notification targets.
CONTACT_NOTIFICATION_TARGETS="slack,discord"

# Slack
SLACK_WEBHOOK_URL=""

# Discord
DISCORD_WEBHOOK_URL=""

# Telegram
TELEGRAM_BOT_TOKEN=""
TELEGRAM_CHAT_ID=""

# WhatsApp Cloud API
WHATSAPP_ACCESS_TOKEN=""
WHATSAPP_PHONE_NUMBER_ID=""
WHATSAPP_RECIPIENT_PHONE=""
```

Only the environment variables for the targets listed in `CONTACT_NOTIFICATION_TARGETS` are required. The contact API validates Google reCAPTCHA tokens with the provided secret before sending the message to the configured destinations.

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
