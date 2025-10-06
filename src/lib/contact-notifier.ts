export type ContactChannel = "slack" | "discord" | "telegram" | "whatsapp";

export type ContactMessage = {
  name: string;
  email: string;
  message: string;
};

export type NotificationResult = {
  channel: ContactChannel;
  ok: boolean;
  error?: string;
};

function parseTargets(): ContactChannel[] {
  const targetsEnv = process.env.CONTACT_NOTIFICATION_TARGETS;

  if (!targetsEnv) {
    return [];
  }

  return targetsEnv
    .split(",")
    .map((value) => value.trim().toLowerCase())
    .filter((value): value is ContactChannel =>
      value === "slack" || value === "discord" || value === "telegram" || value === "whatsapp",
    );
}

export async function notifyContactChannels(payload: ContactMessage): Promise<NotificationResult[]> {
  const targets = parseTargets();

  if (targets.length === 0) {
    return [];
  }

  return Promise.all(
    targets.map(async (channel): Promise<NotificationResult> => {
      switch (channel) {
        case "slack":
          return sendSlackNotification(payload);
        case "discord":
          return sendDiscordNotification(payload);
        case "telegram":
          return sendTelegramNotification(payload);
        case "whatsapp":
          return sendWhatsAppNotification(payload);
        default:
          return { channel, ok: false, error: "Unsupported channel" };
      }
    }),
  );
}

function formatPlainText({ name, email, message }: ContactMessage) {
  return `New contact message\nFrom: ${name} <${email}>\n\n${message}`;
}

async function sendSlackNotification(payload: ContactMessage): Promise<NotificationResult> {
  const webhookUrl = process.env.SLACK_WEBHOOK_URL;

  if (!webhookUrl) {
    return { channel: "slack", ok: false, error: "Missing SLACK_WEBHOOK_URL" };
  }

  try {
    const response = await fetch(webhookUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text: formatPlainText(payload) }),
    });

    if (!response.ok) {
      return {
        channel: "slack",
        ok: false,
        error: `Slack webhook failed with status ${response.status}`,
      };
    }

    return { channel: "slack", ok: true };
  } catch (error) {
    return {
      channel: "slack",
      ok: false,
      error: error instanceof Error ? error.message : "Unknown Slack error",
    };
  }
}

async function sendDiscordNotification(payload: ContactMessage): Promise<NotificationResult> {
  const webhookUrl = process.env.DISCORD_WEBHOOK_URL;

  if (!webhookUrl) {
    return { channel: "discord", ok: false, error: "Missing DISCORD_WEBHOOK_URL" };
  }

  try {
    const response = await fetch(webhookUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        embeds: [
          {
            title: "New contact message",
            description: `**From:** ${payload.name} (${payload.email})\n\n${payload.message}`,
          },
        ],
      }),
    });

    if (!response.ok) {
      return {
        channel: "discord",
        ok: false,
        error: `Discord webhook failed with status ${response.status}`,
      };
    }

    return { channel: "discord", ok: true };
  } catch (error) {
    return {
      channel: "discord",
      ok: false,
      error: error instanceof Error ? error.message : "Unknown Discord error",
    };
  }
}

async function sendTelegramNotification(payload: ContactMessage): Promise<NotificationResult> {
  const botToken = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;

  if (!botToken || !chatId) {
    return {
      channel: "telegram",
      ok: false,
      error: "Missing TELEGRAM_BOT_TOKEN or TELEGRAM_CHAT_ID",
    };
  }

  try {
    const response = await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({ chat_id: chatId, text: formatPlainText(payload) }),
    });

    if (!response.ok) {
      return {
        channel: "telegram",
        ok: false,
        error: `Telegram API failed with status ${response.status}`,
      };
    }

    return { channel: "telegram", ok: true };
  } catch (error) {
    return {
      channel: "telegram",
      ok: false,
      error: error instanceof Error ? error.message : "Unknown Telegram error",
    };
  }
}

async function sendWhatsAppNotification(payload: ContactMessage): Promise<NotificationResult> {
  const accessToken = process.env.WHATSAPP_ACCESS_TOKEN;
  const phoneNumberId = process.env.WHATSAPP_PHONE_NUMBER_ID;
  const recipientPhone = process.env.WHATSAPP_RECIPIENT_PHONE;

  if (!accessToken || !phoneNumberId || !recipientPhone) {
    return {
      channel: "whatsapp",
      ok: false,
      error: "Missing WhatsApp configuration (token, phone number ID, or recipient)",
    };
  }

  try {
    const response = await fetch(`https://graph.facebook.com/v18.0/${phoneNumberId}/messages`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify({
        messaging_product: "whatsapp",
        to: recipientPhone,
        type: "text",
        text: { body: formatPlainText(payload) },
      }),
    });

    if (!response.ok) {
      return {
        channel: "whatsapp",
        ok: false,
        error: `WhatsApp API failed with status ${response.status}`,
      };
    }

    return { channel: "whatsapp", ok: true };
  } catch (error) {
    return {
      channel: "whatsapp",
      ok: false,
      error: error instanceof Error ? error.message : "Unknown WhatsApp error",
    };
  }
}
