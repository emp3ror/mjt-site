"use client";

import { useEffect, useRef, useState } from "react";

import { cn } from "@/lib/cn";

type LeafletBounds = unknown;

type LeafletMapInstance = {
  remove: () => void;
  fitBounds: (bounds: LeafletBounds, options?: { padding?: [number, number] }) => void;
};

type LeafletLayer = {
  addTo: (map: LeafletMapInstance) => LeafletLayer;
};

type LeafletPolyline = LeafletLayer & {
  getBounds: () => LeafletBounds;
};

type Leaflet = {
  map: (element: HTMLElement, options?: { zoomControl?: boolean }) => LeafletMapInstance;
  tileLayer: (url: string, options?: Record<string, unknown>) => LeafletLayer;
  polyline: (latlngs: Array<[number, number]>, options?: Record<string, unknown>) => LeafletPolyline;
  circleMarker: (latlng: [number, number], options?: Record<string, unknown>) => LeafletLayer;
};

declare global {
  interface Window {
    L?: Leaflet;
  }
}

const LEAFLET_CSS = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.css";
const LEAFLET_JS = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.js";

let leafletPromise: Promise<void> | null = null;

const ensureLeaflet = () => {
  if (typeof window === "undefined") {
    return Promise.resolve();
  }

  if (window.L) {
    return Promise.resolve();
  }

  if (leafletPromise) {
    return leafletPromise;
  }

  leafletPromise = new Promise<void>((resolve, reject) => {
    const existingLink = document.querySelector<HTMLLinkElement>("link[data-leaflet]");
    if (!existingLink) {
      const link = document.createElement("link");
      link.rel = "stylesheet";
      link.href = LEAFLET_CSS;
      link.dataset.leaflet = "true";
      document.head.appendChild(link);
    }

    const existingScript = document.querySelector<HTMLScriptElement>("script[data-leaflet]");
    if (existingScript) {
      if (window.L) {
        resolve();
      } else {
        existingScript.addEventListener("load", () => resolve(), { once: true });
        existingScript.addEventListener(
          "error",
          () => reject(new Error("Failed to load map library")),
          { once: true },
        );
      }
      return;
    }

    const script = document.createElement("script");
    script.src = LEAFLET_JS;
    script.async = true;
    script.dataset.leaflet = "true";
    script.onload = () => resolve();
    script.onerror = () => reject(new Error("Failed to load map library"));
    document.body.appendChild(script);
  });

  return leafletPromise;
};

type TrackStats = {
  distanceKm: number;
  ascent: number | null;
  descent: number | null;
};

type ParsedTrack = {
  coordinates: Array<[number, number]>;
  stats: TrackStats;
};

const toRadians = (value: number) => (value * Math.PI) / 180;

const haversine = (a: [number, number], b: [number, number]) => {
  const [lat1, lon1] = a;
  const [lat2, lon2] = b;
  const R = 6371e3;

  const dLat = toRadians(lat2 - lat1);
  const dLon = toRadians(lon2 - lon1);

  const lat1Rad = toRadians(lat1);
  const lat2Rad = toRadians(lat2);

  const h =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1Rad) * Math.cos(lat2Rad) * Math.sin(dLon / 2) * Math.sin(dLon / 2);

  return 2 * R * Math.atan2(Math.sqrt(h), Math.sqrt(1 - h));
};

const parseGpx = (xml: Document): ParsedTrack => {
  const points = Array.from(xml.querySelectorAll("trkpt"));
  const coordinates: Array<[number, number]> = [];
  const elevations: number[] = [];

  for (const point of points) {
    const lat = Number(point.getAttribute("lat"));
    const lon = Number(point.getAttribute("lon"));
    if (Number.isNaN(lat) || Number.isNaN(lon)) {
      continue;
    }
    const elevationNode = point.querySelector("ele");
    const elevation = elevationNode ? Number(elevationNode.textContent ?? "") : Number.NaN;

    coordinates.push([lat, lon]);
    elevations.push(elevation);
  }

  let distance = 0;
  let ascent = 0;
  let descent = 0;

  if (coordinates.length > 1) {
    for (let index = 1; index < coordinates.length; index += 1) {
      distance += haversine(coordinates[index - 1], coordinates[index]);

      const previousElevation = elevations[index - 1];
      const currentElevation = elevations[index];

      if (!Number.isNaN(previousElevation) && !Number.isNaN(currentElevation)) {
        const delta = currentElevation - previousElevation;
        if (delta > 0) {
          ascent += delta;
        } else {
          descent += Math.abs(delta);
        }
      }
    }
  }

  return {
    coordinates,
    stats: {
      distanceKm: distance / 1000,
      ascent: Number.isFinite(ascent) && ascent > 0 ? ascent : null,
      descent: Number.isFinite(descent) && descent > 0 ? descent : null,
    },
  };
};

const loadTrack = async (gpxPath: string): Promise<ParsedTrack> => {
  const response = await fetch(gpxPath);

  if (!response.ok) {
    throw new Error("Unable to load GPX track");
  }

  const text = await response.text();
  const parser = new DOMParser();
  const xml = parser.parseFromString(text, "application/xml");

  const parserError = xml.querySelector("parsererror");
  if (parserError) {
    throw new Error("GPX file is malformed");
  }

  return parseGpx(xml);
};

type HikeMapProps = {
  gpxPath: string;
  className?: string;
};

export function HikeMap({ gpxPath, className }: HikeMapProps) {
  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const mapInstanceRef = useRef<LeafletMapInstance | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [stats, setStats] = useState<TrackStats | null>(null);

  useEffect(() => {
    let cancelled = false;

    const initialise = async () => {
      try {
        setLoading(true);
        setError(null);

        await ensureLeaflet();
        if (cancelled || !mapContainerRef.current) {
          return;
        }

        const { coordinates, stats: parsedStats } = await loadTrack(gpxPath);
        if (cancelled) {
          return;
        }

        if (!coordinates.length) {
          throw new Error("No route data found in GPX file");
        }

        setStats(parsedStats);

        if (mapInstanceRef.current) {
          mapInstanceRef.current.remove();
          mapInstanceRef.current = null;
        }

        const L = window.L;
        if (!L) {
          throw new Error("Map library failed to initialise");
        }

        const map = L.map(mapContainerRef.current, { zoomControl: false });
        mapInstanceRef.current = map;

        L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
          attribution: "© OpenStreetMap contributors",
          maxZoom: 18,
        }).addTo(map);

        const line = L.polyline(coordinates, {
          color: "#F25C27",
          weight: 4,
          opacity: 0.9,
        }).addTo(map);

        map.fitBounds(line.getBounds(), { padding: [24, 24] });

        const start = coordinates[0];
        const end = coordinates[coordinates.length - 1];

        L.circleMarker(start, {
          radius: 6,
          color: "#4AAE69",
          fillColor: "#4AAE69",
          fillOpacity: 1,
        }).addTo(map);

        L.circleMarker(end, {
          radius: 6,
          color: "#F25C27",
          fillColor: "#F25C27",
          fillOpacity: 1,
        }).addTo(map);
      } catch (caught) {
        setError(caught instanceof Error ? caught.message : "Unable to display GPX track");
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    initialise();

    return () => {
      cancelled = true;
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, [gpxPath]);

  return (
    <section className={cn("space-y-4 rounded-[3rem] bg-white/85 p-6 shadow-[0_24px_70px_rgba(44,45,94,0.12)]", className)}>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-semibold text-[color:var(--ink)]">Hike route</h2>
          <p className="text-sm text-[color:var(--ink)]/70">Interactive view of the GPX trail.</p>
        </div>
        <a
          href={gpxPath}
          className="inline-flex items-center gap-2 rounded-full border border-[color:var(--muted)]/50 bg-white/90 px-4 py-2 text-xs font-semibold uppercase tracking-[0.3em] text-[color:var(--ink)] transition hover:-translate-y-1 hover:bg-white"
          download
        >
          Download GPX
        </a>
      </div>

      <div
        ref={mapContainerRef}
        className="h-[320px] w-full overflow-hidden rounded-3xl border border-[color:var(--muted)]/60"
      />

      {loading ? (
        <p className="text-sm text-[color:var(--ink)]/60">Loading hike route...</p>
      ) : error ? (
        <p className="text-sm text-red-600">{error}</p>
      ) : stats ? (
        <div className="grid gap-4 text-sm text-[color:var(--ink)]/70 sm:grid-cols-3">
          <div>
            <p className="uppercase tracking-[0.25em] text-[color:var(--muted)]">Distance</p>
            <p className="text-lg font-semibold text-[color:var(--ink)]">
              {stats.distanceKm.toFixed(2)} km
            </p>
          </div>
          <div>
            <p className="uppercase tracking-[0.25em] text-[color:var(--muted)]">Ascent</p>
            <p className="text-lg font-semibold text-[color:var(--ink)]">
              {stats.ascent !== null ? `${Math.round(stats.ascent)} m` : "--"}
            </p>
          </div>
          <div>
            <p className="uppercase tracking-[0.25em] text-[color:var(--muted)]">Descent</p>
            <p className="text-lg font-semibold text-[color:var(--ink)]">
              {stats.descent !== null ? `${Math.round(stats.descent)} m` : "--"}
            </p>
          </div>
        </div>
      ) : null}
    </section>
  );
}
