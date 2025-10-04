"use client";

import { useCallback, useEffect, useRef, useState } from "react";

import { cn } from "@/lib/cn";

type GpxPoint = {
  lat: number;
  lon: number;
  ele: number | null;
  time?: Date;
};

type GpxWaypoint = {
  lat: number;
  lon: number;
  name?: string;
  desc?: string;
  icon?: string;
};

type GpxTrack = {
  points: GpxPoint[];
  waypoints: GpxWaypoint[];
};

type TrackStats = {
  distanceKm: number;
  ascent: number | null;
  descent: number | null;
};

type LeafletBounds = unknown;

type LeafletLayer = {
  remove?: () => void;
  off?: (event: string, handler: unknown) => void;
};

type LeafletPolyline = LeafletLayer & {
  addTo: (map: LeafletMapInstance) => LeafletPolyline;
  getBounds: () => LeafletBounds;
  on?: (event: string, handler: (payload: { latlng: { lat: number; lng: number } }) => void) => void;
};

type LeafletMarker = LeafletLayer & {
  addTo: (map: LeafletMapInstance) => LeafletMarker;
  bindPopup?: (content: string) => void;
  setLatLng?: (latlng: [number, number]) => void;
};

type LeafletMapInstance = {
  fitBounds: (bounds: LeafletBounds, options?: { padding?: [number, number] }) => void;
  removeLayer: (layer: LeafletLayer) => void;
};

type Leaflet = {
  map: (element: HTMLElement, options?: { zoomControl?: boolean }) => LeafletMapInstance & {
    eachLayer: (callback: (layer: LeafletLayer) => void) => void;
  };
  tileLayer: (url: string, options?: Record<string, unknown>) => LeafletLayer & {
    addTo: (map: LeafletMapInstance) => LeafletLayer;
  };
  polyline: (latlngs: Array<[number, number]>, options?: Record<string, unknown>) => LeafletPolyline;
  marker: (latlng: [number, number], options?: Record<string, unknown>) => LeafletMarker;
  circleMarker: (latlng: [number, number], options?: Record<string, unknown>) => LeafletMarker;
  icon: (options: Record<string, unknown>) => unknown;
  divIcon: (options: Record<string, unknown>) => unknown;
};

type ChartActiveElement = { datasetIndex: number; index: number };

type ChartInstance = {
  destroy: () => void;
  update: () => void;
  setActiveElements?: (elements: ChartActiveElement[], eventPosition?: { x: number; y: number }) => void;
  tooltip?: {
    setActiveElements?: (elements: ChartActiveElement[], eventPosition?: { x: number; y: number }) => void;
  };
  getElementsAtEventForMode?: (
    event: unknown,
    mode: string,
    options: Record<string, unknown>,
    useFinalPosition: boolean,
  ) => ChartActiveElement[];
};

type ChartModule = {
  new (ctx: CanvasRenderingContext2D, config: unknown): ChartInstance;
};

declare global {
  interface Window {
    L?: Leaflet;
    Chart?: ChartModule;
  }
}

const LEAFLET_CSS = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.css";
const LEAFLET_JS = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.js";
const CHART_JS = "https://cdn.jsdelivr.net/npm/chart.js@4.4.6/dist/chart.umd.min.js";

let leafletPromise: Promise<Leaflet | undefined> | null = null;
let chartPromise: Promise<ChartModule | undefined> | null = null;

const ensureLeaflet = async () => {
  if (typeof window === "undefined") {
    return undefined;
  }

  if (window.L) {
    return window.L;
  }

  if (leafletPromise) {
    return leafletPromise;
  }

  leafletPromise = new Promise<Leaflet | undefined>((resolve, reject) => {
    const ensureStylesheet = () => {
      if (document.querySelector("link[data-leaflet]") ?? false) {
        return;
      }
      const link = document.createElement("link");
      link.rel = "stylesheet";
      link.href = LEAFLET_CSS;
      link.dataset.leaflet = "true";
      document.head.appendChild(link);
    };

    ensureStylesheet();

    const existingScript = document.querySelector<HTMLScriptElement>("script[data-leaflet]");
    if (existingScript) {
      existingScript.addEventListener(
        "load",
        () => resolve(window.L),
        { once: true },
      );
      existingScript.addEventListener(
        "error",
        () => reject(new Error("Failed to load Leaflet")),
        { once: true },
      );
      return;
    }

    const script = document.createElement("script");
    script.src = LEAFLET_JS;
    script.async = true;
    script.dataset.leaflet = "true";
    script.onload = () => resolve(window.L);
    script.onerror = () => reject(new Error("Failed to load Leaflet"));
    document.body.appendChild(script);
  });

  return leafletPromise;
};

const ensureChart = async () => {
  if (typeof window === "undefined") {
    return undefined;
  }

  if (window.Chart) {
    return window.Chart;
  }

  if (chartPromise) {
    return chartPromise;
  }

  chartPromise = new Promise<ChartModule | undefined>((resolve, reject) => {
    const existingScript = document.querySelector<HTMLScriptElement>("script[data-chartjs]");
    if (existingScript) {
      existingScript.addEventListener(
        "load",
        () => resolve(window.Chart),
        { once: true },
      );
      existingScript.addEventListener(
        "error",
        () => reject(new Error("Failed to load Chart.js")),
        { once: true },
      );
      return;
    }

    const script = document.createElement("script");
    script.src = CHART_JS;
    script.async = true;
    script.dataset.chartjs = "true";
    script.onload = () => resolve(window.Chart);
    script.onerror = () => reject(new Error("Failed to load Chart.js"));
    document.body.appendChild(script);
  });

  return chartPromise;
};

const resolveWaypointIcon = (value?: string) => {
  if (!value) {
    return undefined;
  }

  const lower = value.toLowerCase();
  if (lower.includes("start") || lower.includes("trailhead")) {
    return "🥾";
  }
  if (lower.includes("summit") || lower.includes("finish") || lower.includes("peak")) {
    return "🎉";
  }
  if (lower.includes("water") || lower.includes("spring")) {
    return "💧";
  }
  if (lower.includes("food") || lower.includes("meal") || lower.includes("snack")) {
    return "🥪";
  }
  if (lower.includes("camp") || lower.includes("rest")) {
    return "⛺️";
  }

  return "📍";
};

const parseGpx = (xml: Document): GpxTrack => {
  const trkpts = Array.from(xml.getElementsByTagName("trkpt"));
  const points: GpxPoint[] = trkpts
    .map((node) => {
      const lat = Number(node.getAttribute("lat"));
      const lon = Number(node.getAttribute("lon"));
      if (Number.isNaN(lat) || Number.isNaN(lon)) {
        return null;
      }
      const eleText = node.getElementsByTagName("ele")[0]?.textContent ?? undefined;
      const timeText = node.getElementsByTagName("time")[0]?.textContent ?? undefined;
      return {
        lat,
        lon,
        ele: eleText !== undefined ? Number(eleText) : null,
        time: timeText ? new Date(timeText) : undefined,
      } satisfies GpxPoint;
    })
    .filter((point): point is GpxPoint => Boolean(point));

  const wpts = Array.from(xml.getElementsByTagName("wpt"));
  const waypoints: GpxWaypoint[] = wpts
    .map((node) => {
      const lat = Number(node.getAttribute("lat"));
      const lon = Number(node.getAttribute("lon"));
      if (Number.isNaN(lat) || Number.isNaN(lon)) {
        return null;
      }
      const name = node.getElementsByTagName("name")[0]?.textContent ?? undefined;
      const desc = node.getElementsByTagName("desc")[0]?.textContent ?? undefined;
      const symbol = node.getElementsByTagName("sym")[0]?.textContent ?? undefined;
      const icon = resolveWaypointIcon(symbol ?? name ?? desc);
      return {
        lat,
        lon,
        name,
        desc,
        icon,
      } satisfies GpxWaypoint;
    })
    .filter((waypoint): waypoint is GpxWaypoint => Boolean(waypoint));

  return { points, waypoints };
};

const cumulativeDistances = (points: GpxPoint[]) => {
  const distances: number[] = [0];
  const earthRadius = 6_371_000;

  const toRadians = (value: number) => (value * Math.PI) / 180;

  for (let index = 1; index < points.length; index += 1) {
    const previous = points[index - 1];
    const current = points[index];

    const dLat = toRadians(current.lat - previous.lat);
    const dLon = toRadians(current.lon - previous.lon);

    const lat1 = toRadians(previous.lat);
    const lat2 = toRadians(current.lat);

    const haversine =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLon / 2) * Math.sin(dLon / 2);

    const surfaceDistance = 2 * earthRadius * Math.atan2(Math.sqrt(haversine), Math.sqrt(1 - haversine));

    const elevationDelta = (current.ele ?? 0) - (previous.ele ?? 0);
    const segmentDistance = Math.sqrt(surfaceDistance * surfaceDistance + elevationDelta * elevationDelta);

    distances.push(distances[distances.length - 1] + segmentDistance);
  }

  return distances;
};

const computeStats = (points: GpxPoint[]): TrackStats => {
  if (points.length < 2) {
    return {
      distanceKm: 0,
      ascent: null,
      descent: null,
    } satisfies TrackStats;
  }

  const distances = cumulativeDistances(points);
  let ascent = 0;
  let descent = 0;

  for (let index = 1; index < points.length; index += 1) {
    const previousElevation = points[index - 1].ele;
    const currentElevation = points[index].ele;

    if (previousElevation !== null && currentElevation !== null) {
      const delta = currentElevation - previousElevation;
      if (delta > 0) {
        ascent += delta;
      } else {
        descent += Math.abs(delta);
      }
    }
  }

  return {
    distanceKm: distances[distances.length - 1] / 1000,
    ascent: ascent > 0 ? ascent : null,
    descent: descent > 0 ? descent : null,
  } satisfies TrackStats;
};

const findClosestPointIndex = (points: GpxPoint[], targetLat: number, targetLon: number) => {
  let closestIndex = 0;
  let minDistance = Number.POSITIVE_INFINITY;

  for (let index = 0; index < points.length; index += 1) {
    const point = points[index];
    const dLat = point.lat - targetLat;
    const dLon = point.lon - targetLon;
    const distance = Math.sqrt(dLat * dLat + dLon * dLon);

    if (distance < minDistance) {
      minDistance = distance;
      closestIndex = index;
    }
  }

  return closestIndex;
};

type HikeMapProps = {
  gpxPath: string;
  className?: string;
};

export function HikeMap({ gpxPath, className }: HikeMapProps) {
  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const chartCanvasRef = useRef<HTMLCanvasElement | null>(null);

  const mapRef = useRef<(LeafletMapInstance & { eachLayer: (callback: (layer: LeafletLayer) => void) => void }) | null>(null);
  const hoverMarkerRef = useRef<LeafletMarker | null>(null);
  const chartRef = useRef<ChartInstance | null>(null);
  const trackRef = useRef<GpxTrack | null>(null);
  const renderedWaypointsRef = useRef<GpxWaypoint[]>([]);
  const checkpointIndicesRef = useRef<number[]>([]);
  const overlayRef = useRef<HTMLDivElement | null>(null);

  const [track, setTrack] = useState<GpxTrack | null>(null);
  const [stats, setStats] = useState<TrackStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedCoords, setSelectedCoords] = useState<string | null>(null);
  const [copyState, setCopyState] = useState<"idle" | "copied" | "error">("idle");

  useEffect(() => {
    trackRef.current = track;
  }, [track]);

  const handleCoordinateSelection = useCallback((lat: number, lon: number) => {
    const formatted = `${lat.toFixed(6)}, ${lon.toFixed(6)}`;
    setSelectedCoords(formatted);
    setCopyState("idle");
  }, []);

  const handleCopyCoordinates = useCallback(async () => {
    if (!selectedCoords) {
      return;
    }
    try {
      if (navigator?.clipboard?.writeText) {
        await navigator.clipboard.writeText(selectedCoords);
        setCopyState("copied");
      } else {
        setCopyState("error");
      }
    } catch {
      setCopyState("error");
    }
  }, [selectedCoords]);

  useEffect(() => {
    if (copyState !== "copied") {
      return;
    }
    const timeout = window.setTimeout(() => setCopyState("idle"), 2000);
    return () => window.clearTimeout(timeout);
  }, [copyState]);

  const highlightPoint = useCallback((index: number, eventPosition?: { x: number; y: number }) => {
    const currentTrack = trackRef.current;
    if (!currentTrack?.points.length) {
      return;
    }

    const clampedIndex = Math.min(Math.max(index, 0), currentTrack.points.length - 1);
    const point = currentTrack.points[clampedIndex];

    if (hoverMarkerRef.current?.setLatLng) {
      hoverMarkerRef.current.setLatLng([point.lat, point.lon]);
    }

    const chart = chartRef.current;
    if (chart?.setActiveElements) {
      const activeElements: ChartActiveElement[] = [{ datasetIndex: 0, index: clampedIndex }];
      if (checkpointIndicesRef.current.includes(clampedIndex)) {
        activeElements.push({ datasetIndex: 1, index: clampedIndex });
      }
      chart.setActiveElements(activeElements, eventPosition);
      chart.tooltip?.setActiveElements?.(activeElements, eventPosition);
      chart.update();
    }
  }, []);

  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      try {
        setLoading(true);
        setError(null);

        const [leaflet] = await Promise.all([ensureLeaflet()]);
        if (!leaflet) {
          throw new Error("Leaflet failed to initialise");
        }

        if (!mapRef.current && mapContainerRef.current) {
          const map = leaflet.map(mapContainerRef.current, { zoomControl: true });
          leaflet
            .tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
              maxZoom: 19,
              attribution: "© OpenStreetMap contributors",
            })
            .addTo(map);
          mapRef.current = map;
        }

        const response = await fetch(gpxPath);
        if (!response.ok) {
          throw new Error("Unable to load GPX track");
        }

        const text = await response.text();
        if (cancelled) {
          return;
        }

        const parser = new DOMParser();
        const xml = parser.parseFromString(text, "application/xml");
        const parserError = xml.querySelector("parsererror");
        if (parserError) {
          throw new Error("GPX file is malformed");
        }

        const parsed = parseGpx(xml);
        setTrack(parsed);
        setStats(computeStats(parsed.points));
      } catch (caught) {
        setError(caught instanceof Error ? caught.message : "Unable to display GPX track");
        setTrack(null);
        setStats(null);
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    load();

    return () => {
      cancelled = true;
    };
  }, [gpxPath]);

  useEffect(() => {
    if (!mapRef.current) {
      return;
    }

    const map = mapRef.current;
    const overlays: Array<{ remove: () => void }> = [];

    if (!track?.points.length) {
      return () => {
        overlays.forEach((overlay) => overlay.remove());
      };
    }

    const leaflet = window.L;
    if (!leaflet) {
      return;
    }

    const latlngs = track.points.map((point) => [point.lat, point.lon]) as Array<[number, number]>;
    if (latlngs.length) {
      const polyline = leaflet
        .polyline(latlngs, {
          color: "#F25C27",
          weight: 4,
          opacity: 0.9,
        })
        .addTo(map);

      map.fitBounds(polyline.getBounds(), { padding: [24, 24] });

      const handlePolylineClick = (payload: { latlng: { lat: number; lng: number } }) => {
        const { lat, lng } = payload.latlng;
        const index = findClosestPointIndex(track.points, lat, lng);
        highlightPoint(index);
        handleCoordinateSelection(lat, lng);
      };

      polyline.on?.("click", handlePolylineClick);

      overlays.push({
        remove: () => {
          polyline.off?.("click", handlePolylineClick);
          polyline.remove?.();
        },
      });
    }

    const handleMapClick = (payload: { latlng: { lat: number; lng: number } }) => {
      const { lat, lng } = payload.latlng;
      handleCoordinateSelection(lat, lng);
    };

    map.on("click", handleMapClick);

    overlays.push({
      remove: () => {
        map.off("click", handleMapClick);
      },
    });

    const fallbackWaypoints: GpxWaypoint[] = track.points.length
      ? [
          {
            lat: track.points[0].lat,
            lon: track.points[0].lon,
            name: "Trailhead",
            desc: "Starting point",
            icon: "🥾",
          },
          track.points[Math.floor(track.points.length / 2)]
            ? {
                lat: track.points[Math.floor(track.points.length / 2)].lat,
                lon: track.points[Math.floor(track.points.length / 2)].lon,
                name: "Midpoint",
                desc: "Halfway through the trail",
                icon: "🥪",
              }
            : null,
          {
            lat: track.points[track.points.length - 1].lat,
            lon: track.points[track.points.length - 1].lon,
            name: "Summit",
            desc: "Finish line",
            icon: "🎉",
          },
        ].filter(Boolean) as GpxWaypoint[]
      : [];

    const waypointsToRender = track.waypoints.length ? track.waypoints : fallbackWaypoints;
    renderedWaypointsRef.current = waypointsToRender;

    waypointsToRender.forEach((waypoint) => {
      const markerOptions =
        waypoint.icon
          ? {
              icon: leaflet.divIcon({
                className: "hike-map-marker",
                html: `<div style="display:flex;align-items:center;justify-content:center;font-size:18px;height:32px;width:32px;border-radius:16px;background:#fff;border:2px solid var(--leaf);box-shadow:0 6px 18px rgba(44,45,94,0.12);">${waypoint.icon}</div>`,
                iconSize: [32, 32],
                iconAnchor: [16, 16],
              }),
            }
          : undefined;

      const marker = leaflet.marker([waypoint.lat, waypoint.lon], markerOptions);
      marker.addTo(map);
      if (waypoint.name || waypoint.desc) {
        const label = `<strong>${waypoint.name ?? "Checkpoint"}</strong>${
          waypoint.desc ? `<br/>${waypoint.desc}` : ""
        }`;
        marker.bindPopup?.(label);
      }

      overlays.push({
        remove: () => {
          marker.remove?.();
        },
      });
    });

    const marker = leaflet.circleMarker(latlngs[0], {
      radius: 6,
      weight: 2,
      fillOpacity: 0.8,
      color: "#4AAE69",
      fillColor: "#4AAE69",
    });

    marker.addTo(map);
    hoverMarkerRef.current = marker;

    overlays.push({
      remove: () => {
        marker.remove?.();
        if (hoverMarkerRef.current === marker) {
          hoverMarkerRef.current = null;
        }
      },
    });

    highlightPoint(0);

    return () => {
      overlays.forEach((overlay) => {
        overlay.remove();
      });
    };
  }, [track, highlightPoint, handleCoordinateSelection]);

  useEffect(() => {
    let cancelled = false;
    let detachListeners: (() => void) | undefined;

    const initialiseChart = async () => {
      if (!track?.points.length || !chartCanvasRef.current) {
        if (chartRef.current) {
          chartRef.current.destroy();
          chartRef.current = null;
        }
        return;
      }

      const chartModule = await ensureChart();
      if (cancelled || !chartModule || !chartCanvasRef.current) {
        return;
      }

      const ctx = chartCanvasRef.current.getContext("2d");
      if (!ctx) {
        return;
      }

      if (chartRef.current) {
        chartRef.current.destroy();
        chartRef.current = null;
      }

      const distances = cumulativeDistances(track.points);
      const elevation = track.points.map((point) => point.ele ?? 0);
      const distanceLabels = distances.map((distance) => (distance / 1000).toFixed(2));

      const waypointIndices = renderedWaypointsRef.current.map((waypoint) =>
        findClosestPointIndex(track.points, waypoint.lat, waypoint.lon),
      );
      checkpointIndicesRef.current = waypointIndices;

      const checkpointHeights = track.points.map((point, index) =>
        waypointIndices.includes(index) ? point.ele ?? 0 : null,
      );

      const chart = new chartModule(ctx, {
        type: "line",
        data: {
          labels: distanceLabels,
          datasets: [
            {
              label: "Elevation (m)",
              data: elevation,
              tension: 0.35,
              fill: {
                target: "origin",
                above: "rgba(242, 92, 39, 0.15)",
              },
              borderColor: "#F25C27",
              backgroundColor: "rgba(242, 92, 39, 0.15)",
              borderWidth: 2,
              pointRadius: 0,
            },
            {
              label: "Checkpoints",
              data: checkpointHeights,
              showLine: false,
              pointRadius(context) {
                const value = context.raw as number | null;
                return value === null ? 0 : 6;
              },
              pointBackgroundColor: "#4AAE69",
              pointBorderColor: "#2C2D5E",
              pointHoverRadius: 8,
            },
          ],
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          interaction: {
            intersect: false,
            mode: "nearest",
          },
          animation: false,
          plugins: {
            legend: { display: false },
            tooltip: {
              callbacks: {
                title(contexts) {
                  return contexts.length ? `Distance ${contexts[0].label} km` : "";
                },
                label(context) {
                  if (context.datasetIndex === 1) {
                    const index = context.dataIndex;
                    const waypointIndex = checkpointIndicesRef.current.indexOf(index);
                    const waypoint = renderedWaypointsRef.current[waypointIndex];
                    if (waypoint) {
                      return waypoint.desc
                        ? `${waypoint.name ?? "Checkpoint"}: ${waypoint.desc}`
                        : waypoint.name ?? "Checkpoint";
                    }
                  }
                  const elevationValue = context.parsed.y;
                  return typeof elevationValue === "number"
                    ? `Elevation ${Math.round(elevationValue)} m`
                    : "";
                },
              },
            },
          },
          scales: {
            x: {
              title: {
                display: true,
                text: "Distance (km)",
              },
              ticks: {
                color: "#2C2D5E",
              },
            },
            y: {
              title: {
                display: true,
                text: "Elevation (m)",
              },
              ticks: {
                color: "#2C2D5E",
              },
            },
          },
        },
      });

      chartRef.current = chart;

      const renderOverlay = () => {
        const overlay = overlayRef.current;
        if (!overlay) {
          return;
        }

        overlay.innerHTML = "";
        overlay.style.pointerEvents = "none";
        overlay.style.zIndex = "1";

        const chartAny = chart as unknown as {
          scales: {
            x: { getPixelForValue: (value: number) => number };
            y: { top: number; bottom: number; getPixelForValue: (value: number) => number };
          };
          chartArea: { top: number; bottom: number };
        };

        const chartTop = chartAny.chartArea.top;
        const chartBottom = chartAny.chartArea.bottom;

                renderedWaypointsRef.current.forEach((waypoint, waypointIdx) => {
          const pointIndex = waypointIndices[waypointIdx];
          if (pointIndex === undefined) {
            return;
          }

          const baseX = chartAny.scales.x.getPixelForValue(pointIndex);
          const markerX = baseX + 10;

          const line = document.createElement("div");
          line.className = "pointer-events-none absolute w-px";
          line.style.left = `${markerX}px`;
          line.style.top = `${chartTop}px`;
          line.style.height = `${chartBottom - chartTop}px`;
          line.style.backgroundColor = "rgba(74, 174, 105, 0.6)";
          line.style.transform = "translateX(-0.5px)";
          overlay.appendChild(line);

          const wrapper = document.createElement("div");
          wrapper.className =
            "absolute flex cursor-pointer flex-col items-center gap-2 text-[color:var(--ink)]";
          wrapper.style.left = `${markerX}px`;
          wrapper.style.top = `${Math.max(chartTop - 120, 0)}px`;
          wrapper.style.transform = "translateX(-50%)";
          wrapper.style.pointerEvents = "auto";

          const circle = document.createElement("div");
          circle.className =
            "flex h-12 w-12 items-center justify-center rounded-full border-2 bg-white text-sm font-semibold";
          circle.style.borderColor = "var(--leaf)";
          circle.style.boxShadow = "0 8px 18px rgba(44, 45, 94, 0.12)";
          circle.textContent = (waypoint.name ?? `CP${waypointIdx + 1}`).slice(0, 3).toUpperCase();
          wrapper.appendChild(circle);

          if (waypoint.icon || waypoint.desc) {
            const pill = document.createElement("div");
            pill.className =
              "flex items-center gap-2 rounded-full border bg-white px-3 py-1 text-xs font-medium";
            pill.style.borderColor = "rgba(74, 174, 105, 0.45)";
            pill.style.boxShadow = "0 4px 12px rgba(44, 45, 94, 0.1)";
            if (waypoint.icon) {
              const iconSpan = document.createElement("span");
              iconSpan.textContent = waypoint.icon;
              pill.appendChild(iconSpan);
            }
            if (waypoint.desc) {
              const descSpan = document.createElement("span");
              descSpan.textContent = waypoint.desc;
              pill.appendChild(descSpan);
            }
            wrapper.appendChild(pill);
          }

          wrapper.addEventListener("click", (event) => {
            event.stopPropagation();
            highlightPoint(pointIndex);
            const point = track.points[pointIndex];
            handleCoordinateSelection(point.lat, point.lon);
          });

          overlay.appendChild(wrapper);
        });
      };

      renderOverlay();

      const canvas = chartCanvasRef.current;

      const handleMove = (event: MouseEvent) => {
        if (!chartRef.current?.getElementsAtEventForMode) {
          return;
        }
        const elements = chartRef.current.getElementsAtEventForMode(
          event,
          "nearest",
          { intersect: false },
          false,
        );
        if (!elements.length) {
          return;
        }
        const [{ index }] = elements;
        highlightPoint(index, { x: event.offsetX, y: event.offsetY });
      };

      const handleLeave = () => {
        const chartInstance = chartRef.current;
        if (!chartInstance) {
          return;
        }
        chartInstance.setActiveElements?.([]);
        chartInstance.tooltip?.setActiveElements?.([]);
        chartInstance.update();
      };

      const handleClick = (event: MouseEvent) => {
        if (!chartRef.current?.getElementsAtEventForMode) {
          return;
        }
        const elements = chartRef.current.getElementsAtEventForMode(
          event,
          "nearest",
          { intersect: false },
          false,
        );
        if (!elements.length) {
          return;
        }
        const [{ index }] = elements;
        highlightPoint(index, { x: event.offsetX, y: event.offsetY });
        const point = track.points[index];
        handleCoordinateSelection(point.lat, point.lon);
      };

      const handleResize = () => {
        renderOverlay();
      };

      canvas.addEventListener("mousemove", handleMove);
      canvas.addEventListener("mouseleave", handleLeave);
      canvas.addEventListener("click", handleClick);
      window.addEventListener("resize", handleResize);

      detachListeners = () => {
        canvas.removeEventListener("mousemove", handleMove);
        canvas.removeEventListener("mouseleave", handleLeave);
        canvas.removeEventListener("click", handleClick);
        window.removeEventListener("resize", handleResize);
      };

      highlightPoint(0);
      renderOverlay();

    };

    void initialiseChart();

    return () => {
      cancelled = true;
      detachListeners?.();
      if (chartRef.current) {
        chartRef.current.destroy();
        chartRef.current = null;
      }
    };
  }, [track, highlightPoint, handleCoordinateSelection]);

  if (error) {
    return (
      <section
        className={cn(
          "space-y-4 rounded-[3rem] border border-red-200 bg-red-50 p-6 text-red-700",
          className,
        )}
      >
        <p className="font-semibold">{error}</p>
      </section>
    );
  }

  return (
    <section
      className={cn(
        "space-y-6 rounded-[3rem] bg-white/85 p-6 shadow-[0_24px_70px_rgba(44,45,94,0.12)]",
        className,
      )}
    >
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-semibold text-[color:var(--ink)]">Hike route</h2>
          <p className="text-sm text-[color:var(--ink)]/70">
            Interactive GPX map with checkpoints and elevation profile.
          </p>
        </div>
        <a
          href={gpxPath}
          className="inline-flex items-center gap-2 rounded-full border border-[color:var(--muted)]/50 bg-white/90 px-4 py-2 text-xs font-semibold uppercase tracking-[0.3em] text-[color:var(--ink)] transition hover:-translate-y-1 hover:bg-white"
          download
        >
          Download GPX
        </a>
      </div>

      {stats ? (
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

      <div
        ref={mapContainerRef}
        className="h-[320px] w-full overflow-hidden rounded-3xl border border-[color:var(--muted)]/60"
      />

      {loading ? (
        <p className="text-sm text-[color:var(--ink)]/60">Loading hike route...</p>
      ) : null}

      {track?.points.length ? (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold uppercase tracking-[0.3em] text-[color:var(--ink)]/60">
              Elevation profile
            </h3>
            <p className="text-xs text-[color:var(--ink)]/50">
              Hover the chart to preview checkpoints on the map.
            </p>
          </div>
          <div className="relative h-60 w-full overflow-visible rounded-3xl border border-[color:var(--muted)]/60 bg-white/80 p-3">
            <canvas ref={chartCanvasRef} className="h-full w-full" />
            <div ref={overlayRef} className="absolute inset-0 overflow-visible" />
          </div>
        </div>
      ) : null}

      {selectedCoords ? (
        <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-[color:var(--muted)]/60 bg-white/80 px-4 py-3 text-sm text-[color:var(--ink)]/70">
          <div className="flex flex-col">
            <span className="text-xs font-semibold uppercase tracking-[0.3em] text-[color:var(--muted)]">Coordinates</span>
            <code className="text-base font-semibold text-[color:var(--ink)]">{selectedCoords}</code>
          </div>
          <button
            type="button"
            onClick={handleCopyCoordinates}
            className="inline-flex items-center gap-2 rounded-full border border-[color:var(--accent)]/40 px-4 py-2 text-xs font-semibold uppercase tracking-[0.25em] text-[color:var(--accent)] transition hover:-translate-y-0.5 hover:bg-[color:var(--accent)]/10"
          >
            {copyState === "copied" ? "Copied!" : copyState === "error" ? "Copy failed" : "Copy"}
          </button>
        </div>
      ) : null}
    </section>
  );
}
