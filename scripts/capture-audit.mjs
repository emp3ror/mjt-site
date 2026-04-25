#!/usr/bin/env node
const PW_PATH = process.env.PLAYWRIGHT_PATH || "playwright";
const pwModule = await import(PW_PATH);
const { chromium } = pwModule.default ?? pwModule;
import { mkdir } from "node:fs/promises";
import { resolve } from "node:path";

const BASE = process.env.AUDIT_BASE_URL || "http://localhost:3000";
const OUT_DIR = resolve(process.cwd(), "output/playwright/audit");

const ROUTES = [
  { id: "home", path: "/" },
  { id: "posts-list", path: "/posts" },
  { id: "posts-detail-hike", path: "/posts/hatiban-chandragiri-hike" },
  { id: "posts-detail-note", path: "/posts/personal-stillness" },
  { id: "events-list", path: "/events" },
  { id: "events-detail", path: "/events/event-1" },
  { id: "art-college-list", path: "/art-college" },
  { id: "art-college-section", path: "/art-college/first-year" },
  { id: "art-college-leaf", path: "/art-college/first-year/gesture-mapping" },
  { id: "shop-list", path: "/shop" },
  { id: "shop-detail", path: "/shop/posts/stickers" },
  { id: "tags-index", path: "/tags" },
  { id: "tags-detail", path: "/tags/community" },
  { id: "traces", path: "/traces" },
];

const VIEWPORTS = [
  { id: "desktop", width: 1440, height: 900, deviceScaleFactor: 1, isMobile: false },
  { id: "mobile", width: 390, height: 844, deviceScaleFactor: 2, isMobile: true },
];

async function captureRoute(browser, route, viewport) {
  const context = await browser.newContext({
    viewport: { width: viewport.width, height: viewport.height },
    deviceScaleFactor: viewport.deviceScaleFactor,
    isMobile: viewport.isMobile,
    hasTouch: viewport.isMobile,
    userAgent: viewport.isMobile
      ? "Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 Mobile Safari/604.1"
      : undefined,
    reducedMotion: "no-preference",
  });
  const page = await context.newPage();

  const url = `${BASE}${route.path}`;
  try {
    await page.goto(url, { waitUntil: "networkidle", timeout: 30000 });
  } catch (err) {
    console.error(`navigate failed: ${url} -> ${err.message}`);
    await context.close();
    return;
  }

  // Wait for fonts and lazy media a beat
  await page.waitForTimeout(900);

  const fold = `${route.id}-${viewport.id}-fold.png`;
  const full = `${route.id}-${viewport.id}-full.png`;
  await page.screenshot({ path: resolve(OUT_DIR, fold), fullPage: false });
  await page.screenshot({ path: resolve(OUT_DIR, full), fullPage: true });
  console.log(`captured ${route.id} ${viewport.id} -> ${fold}, ${full}`);

  await context.close();
}

async function main() {
  await mkdir(OUT_DIR, { recursive: true });
  const browser = await chromium.launch({ headless: true });
  for (const route of ROUTES) {
    for (const viewport of VIEWPORTS) {
      await captureRoute(browser, route, viewport);
    }
  }
  await browser.close();
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
