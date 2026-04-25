/**
 * Server-side GPX summariser.
 *
 * The interactive `HikeMap` does the rich client-side work (Leaflet + Chart.js)
 * on detail pages. For index/list/home views we only need a small static
 * summary — distance, ascent/descent, and a normalised SVG path that can be
 * inlined into a card without shipping any JS or pulling in tile servers.
 *
 * Everything here runs at build time; the parser is a deliberate regex pass so
 * we don't need a DOMParser polyfill on Node and so subsampling stays cheap
 * even for multi-thousand-point tracks.
 */

import fs from "node:fs";
import path from "node:path";

export type TrailStats = {
  distanceKm: number;
  ascent: number | null;
  descent: number | null;
};

export type TrailRoute = {
  svgPath: string;
  viewBox: string;
  start: { x: number; y: number };
  end: { x: number; y: number };
};

export type TrailGpx = {
  stats: TrailStats;
  route: TrailRoute;
  pointCount: number;
};

type RawPoint = { lat: number; lon: number; ele: number | null };

const TRKPT_RE = /<trkpt\b[^>]*\blat="([\-\d.]+)"[^>]*\blon="([\-\d.]+)"[^>]*>([\s\S]*?)<\/trkpt>/g;
const ELE_RE = /<ele>([\-\d.]+)<\/ele>/;

const EARTH_RADIUS_M = 6_371_000;
const SVG_WIDTH = 100;
const SVG_HEIGHT = 60;
const SVG_PADDING = 4;
const MAX_SAMPLES = 120;

const cache = new Map<string, TrailGpx | null>();

const toRadians = (value: number) => (value * Math.PI) / 180;

const haversineMeters = (a: RawPoint, b: RawPoint) => {
  const dLat = toRadians(b.lat - a.lat);
  const dLon = toRadians(b.lon - a.lon);
  const lat1 = toRadians(a.lat);
  const lat2 = toRadians(b.lat);
  const h =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLon / 2) ** 2;
  return 2 * EARTH_RADIUS_M * Math.asin(Math.min(1, Math.sqrt(h)));
};

const parsePoints = (xml: string): RawPoint[] => {
  const points: RawPoint[] = [];
  TRKPT_RE.lastIndex = 0;

  for (let match = TRKPT_RE.exec(xml); match !== null; match = TRKPT_RE.exec(xml)) {
    const lat = Number.parseFloat(match[1]);
    const lon = Number.parseFloat(match[2]);
    if (!Number.isFinite(lat) || !Number.isFinite(lon)) continue;

    const eleMatch = ELE_RE.exec(match[3]);
    const ele = eleMatch ? Number.parseFloat(eleMatch[1]) : Number.NaN;

    points.push({
      lat,
      lon,
      ele: Number.isFinite(ele) ? ele : null,
    });
  }

  return points;
};

const subsample = <T,>(items: T[], maxLength: number): T[] => {
  if (items.length <= maxLength) return items;
  const step = (items.length - 1) / (maxLength - 1);
  const out: T[] = [];
  for (let index = 0; index < maxLength; index += 1) {
    out.push(items[Math.round(index * step)]);
  }
  return out;
};

const computeStats = (points: RawPoint[]): TrailStats => {
  if (points.length < 2) {
    return { distanceKm: 0, ascent: null, descent: null };
  }

  let distance = 0;
  let ascent = 0;
  let descent = 0;

  for (let index = 1; index < points.length; index += 1) {
    const prev = points[index - 1];
    const next = points[index];
    distance += haversineMeters(prev, next);

    if (prev.ele !== null && next.ele !== null) {
      const delta = next.ele - prev.ele;
      if (delta > 0) ascent += delta;
      else descent += -delta;
    }
  }

  return {
    distanceKm: distance / 1000,
    ascent: ascent > 0 ? ascent : null,
    descent: descent > 0 ? descent : null,
  };
};

const buildRoute = (points: RawPoint[]): TrailRoute => {
  const sampled = subsample(points, MAX_SAMPLES);

  let minLat = Infinity;
  let maxLat = -Infinity;
  let minLon = Infinity;
  let maxLon = -Infinity;

  for (const point of sampled) {
    if (point.lat < minLat) minLat = point.lat;
    if (point.lat > maxLat) maxLat = point.lat;
    if (point.lon < minLon) minLon = point.lon;
    if (point.lon > maxLon) maxLon = point.lon;
  }

  const latSpan = Math.max(maxLat - minLat, 1e-9);
  const lonSpan = Math.max(maxLon - minLon, 1e-9);
  const usableW = SVG_WIDTH - SVG_PADDING * 2;
  const usableH = SVG_HEIGHT - SVG_PADDING * 2;
  const scale = Math.min(usableW / lonSpan, usableH / latSpan);
  const offsetX = SVG_PADDING + (usableW - lonSpan * scale) / 2;
  const offsetY = SVG_PADDING + (usableH - latSpan * scale) / 2;

  const project = (point: RawPoint) => ({
    x: offsetX + (point.lon - minLon) * scale,
    y: offsetY + (maxLat - point.lat) * scale,
  });

  let svgPath = "";
  let start = { x: 0, y: 0 };
  let end = { x: 0, y: 0 };

  sampled.forEach((point, index) => {
    const projected = project(point);
    svgPath += `${index === 0 ? "M" : "L"}${projected.x.toFixed(2)} ${projected.y.toFixed(2)} `;
    if (index === 0) start = projected;
    if (index === sampled.length - 1) end = projected;
  });

  return {
    svgPath: svgPath.trim(),
    viewBox: `0 0 ${SVG_WIDTH} ${SVG_HEIGHT}`,
    start,
    end,
  };
};

/**
 * Read a GPX file from `/public/<...>` and return the static summary used by
 * the trails listings. Returns `null` when the file is missing or empty so
 * callers can fall back gracefully.
 */
export const loadTrailGpx = (publicPath?: string): TrailGpx | null => {
  if (!publicPath) return null;
  if (cache.has(publicPath)) return cache.get(publicPath) ?? null;

  const cleaned = publicPath.replace(/^\/+/, "");
  const absolutePath = path.join(process.cwd(), "public", cleaned);

  if (!fs.existsSync(absolutePath)) {
    cache.set(publicPath, null);
    return null;
  }

  const xml = fs.readFileSync(absolutePath, "utf8");
  const points = parsePoints(xml);

  if (points.length < 2) {
    cache.set(publicPath, null);
    return null;
  }

  const result: TrailGpx = {
    stats: computeStats(points),
    route: buildRoute(points),
    pointCount: points.length,
  };

  cache.set(publicPath, result);
  return result;
};
