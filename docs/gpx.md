# Prompt for VS Code ChatGPT / Copilot
Create a complete working example for Next.js (App Router) that:
- Uses Leaflet.js to visualize a GPX track on a map.
- Draws checkpoints (from <wpt> tags) as markers with popups.
- Shows an elevation profile below the map using Chart.js.
- Synchronizes hover/click between map and chart (hover chart -> move marker, click map -> highlight chart point).
- Works only on the client side (no SSR errors).
- Uses TypeScript for type safety.

Project structure should include:
  lib/parseGpx.ts     -> parses XML GPX into JSON
  components/GpxViewer.tsx -> client component rendering map + chart
  app/gpx/page.tsx    -> example page using the viewer

Use yarn add leaflet chart.js

Include:
1. parseGpx + cumulativeDistances utilities
2. GpxViewer component (with hooks, dynamic import safe)
3. Example page loading /public/sample.gpx
4. Minimal Tailwind or inline styling for layout

The output should be formatted in three code blocks:

---lib/parseGpx.ts---
// lib/parseGpx.ts
 ```
    export type GpxPoint = { lat: number; lon: number; ele: number; time?: Date };
    export type GpxWaypoint = { lat: number; lon: number; name?: string; desc?: string };
    export type GpxData = { points: GpxPoint[]; waypoints: GpxWaypoint[] };

    export function parseGpx(xmlText: string): GpxData {
      const xml = new DOMParser().parseFromString(xmlText, "application/xml");
      const ns = (q: string) => xml.getElementsByTagName(q);

      const pts: GpxPoint[] = Array.from(xml.getElementsByTagName("trkpt")).map((n) => {
        const lat = parseFloat(n.getAttribute("lat") || "0");
        const lon = parseFloat(n.getAttribute("lon") || "0");
        const ele = parseFloat(n.getElementsByTagName("ele")?.[0]?.textContent || "0");
        const timeText = n.getElementsByTagName("time")?.[0]?.textContent || "";
        return { lat, lon, ele, time: timeText ? new Date(timeText) : undefined };
      });

      const wpts: GpxWaypoint[] = Array.from(xml.getElementsByTagName("wpt")).map((n) => {
        const lat = parseFloat(n.getAttribute("lat") || "0");
        const lon = parseFloat(n.getAttribute("lon") || "0");
        const name = n.getElementsByTagName("name")?.[0]?.textContent || undefined;
        const desc = n.getElementsByTagName("desc")?.[0]?.textContent || undefined;
        return { lat, lon, name, desc };
      });

      return { points: pts, waypoints: wpts };
    }

    export function cumulativeDistances(points: GpxPoint[]): number[] {
      const R = 6371000; // m
      const toRad = (d: number) => (d * Math.PI) / 180;
      const out: number[] = [0];
      for (let i = 1; i < points.length; i++) {
        const a = points[i - 1], b = points[i];
        const dLat = toRad(b.lat - a.lat);
        const dLon = toRad(b.lon - a.lon);
        const lat1 = toRad(a.lat), lat2 = toRad(b.lat);
        const h =
          Math.sin(dLat / 2) ** 2 +
          Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLon / 2) ** 2;
        const surface = 2 * R * Math.asin(Math.sqrt(h));

        // include simple vertical component (optional)
        const dz = (b.ele || 0) - (a.ele || 0);
        const d = Math.sqrt(surface * surface + dz * dz);

        out.push(out[i - 1] + d);
      }
      return out; // meters
    }

```


---components/GpxViewer.tsx---
```
    "use client";

    import { useEffect, useMemo, useRef, useState } from "react";
    import L, { Map as LMap } from "leaflet";
    import { Chart, LineController, LineElement, PointElement, LinearScale, CategoryScale, Tooltip, Filler } from "chart.js";
    import { parseGpx, cumulativeDistances, GpxData } from "@/lib/parseGpx";

    Chart.register(LineController, LineElement, PointElement, LinearScale, CategoryScale, Tooltip, Filler);

    type Props = {
      gpxText: string;              // pass the raw GPX XML as string (fetched server- or client-side)
      height?: number;              // map height px
      checkpointsIconUrl?: string;  // optional custom marker icon
    };

    export default function GpxViewer({ gpxText, height = 420, checkpointsIconUrl }: Props) {
      const mapRef = useRef<LMap | null>(null);
      const mapElRef = useRef<HTMLDivElement | null>(null);
      const chartRef = useRef<Chart | null>(null);
      const chartCanvasRef = useRef<HTMLCanvasElement | null>(null);
      const hoverMarkerRef = useRef<L.Marker | null>(null);
      const [data, setData] = useState<GpxData | null>(null);

      // parse GPX once
      useEffect(() => {
        if (!gpxText) return;
        setData(parseGpx(gpxText));
      }, [gpxText]);

      // init map once
      useEffect(() => {
        if (mapRef.current || !mapElRef.current) return;
        const map = L.map(mapElRef.current, { zoomControl: true });
        L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
          maxZoom: 19,
          attribution: "&copy; OpenStreetMap",
        }).addTo(map);
        mapRef.current = map;
      }, []);

      // render track + waypoints
      useEffect(() => {
        if (!mapRef.current || !data) return;
        const map = mapRef.current;

        // clear old layers except base
        map.eachLayer((layer: any) => {
          if (!layer.getAttribution) map.removeLayer(layer);
        });

        const latlngs = data.points.map((p) => [p.lat, p.lon]) as [number, number][];
        if (latlngs.length) {
          const poly = L.polyline(latlngs, { weight: 4, opacity: 0.9 }).addTo(map);
          map.fitBounds(poly.getBounds(), { padding: [20, 20] });
        }

        // checkpoint markers (from <wpt>)
        const icon = checkpointsIconUrl
          ? L.icon({ iconUrl: checkpointsIconUrl, iconSize: [24, 24], iconAnchor: [12, 12] })
          : undefined;

        data.waypoints.forEach((w) => {
          const m = L.marker([w.lat, w.lon], icon ? { icon } : undefined).addTo(map);
          const label = `<b>${w.name || "Checkpoint"}</b>${w.desc ? `<br/>${w.desc}` : ""}`;
          m.bindPopup(label);
        });

        // hover marker (synced with chart hover)
        if (!hoverMarkerRef.current && data.points.length) {
          hoverMarkerRef.current = L.circleMarker([data.points[0].lat, data.points[0].lon], {
            radius: 6,
            weight: 2,
            fillOpacity: 0.7,
          }).addTo(map);
        }
      }, [data]);

      // elevation chart
      useEffect(() => {
        if (!data || !chartCanvasRef.current) return;

        // destroy old
        if (chartRef.current) {
          chartRef.current.destroy();
          chartRef.current = null;
        }

        const dists = cumulativeDistances(data.points); // meters
        const km = dists.map((m) => (m / 1000).toFixed(2));
        const elev = data.points.map((p) => p.ele || 0);

        const ctx = chartCanvasRef.current.getContext("2d");
        if (!ctx) return;

        chartRef.current = new Chart(ctx, {
          type: "line",
          data: {
            labels: km, // km as labels
            datasets: [
              {
                label: "Elevation (m)",
                data: elev,
                tension: 0.3,
                fill: true,
                pointRadius: 0,
                borderWidth: 2,
              },
            ],
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            animation: false,
            parsing: false,
            scales: {
              x: {
                type: "category",
                title: { display: true, text: "Distance (km)" },
                ticks: { maxTicksLimit: 10 },
              },
              y: {
                type: "linear",
                title: { display: true, text: "Elevation (m)" },
              },
            },
            interaction: { mode: "index", intersect: false },
            plugins: {
              tooltip: {
                callbacks: {
                  title: (items) => `km ${items[0].label}`,
                  label: (item) => `↑ ${item.parsed.y} m`,
                },
              },
            },
            onHover: (_, elts) => {
              // move map hover marker
              const idx = elts?.[0]?.index;
              if (idx != null && hoverMarkerRef.current && data.points[idx]) {
                hoverMarkerRef.current.setLatLng([data.points[idx].lat, data.points[idx].lon]);
              }
            },
            onClick: (_, elts) => {
              const idx = elts?.[0]?.index;
              if (idx != null && mapRef.current && data.points[idx]) {
                mapRef.current.panTo([data.points[idx].lat, data.points[idx].lon]);
              }
            },
          },
        });
      }, [data]);

      // optional: click on map to highlight chart index nearest to clicked latlng
      useEffect(() => {
        const map = mapRef.current;
        if (!map || !data || !chartRef.current) return;
        const handler = (e: L.LeafletMouseEvent) => {
          // find nearest track point (fast linear scan; optimize with R-tree if needed)
          let best = 0, bestD = Infinity;
          for (let i = 0; i < data.points.length; i++) {
            const p = data.points[i];
            const d = Math.hypot(e.latlng.lat - p.lat, e.latlng.lng - p.lon);
            if (d < bestD) { bestD = d; best = i; }
          }
          // set hover marker + draw a vertical guideline via active elements
          hoverMarkerRef.current?.setLatLng([data.points[best].lat, data.points[best].lon]);
          chartRef.current.setActiveElements([{ datasetIndex: 0, index: best }]);
          chartRef.current.tooltip?.setActiveElements([{ datasetIndex: 0, index: best }], { x: 0, y: 0 });
          chartRef.current.update();
        };
        map.on("click", handler);
        return () => { map.off("click", handler); };
      }, [data]);

      return (
        <div className="space-y-3">
          <div ref={mapElRef} style={{ height }} />
          <div style={{ height: 200 }}>
            <canvas ref={chartCanvasRef} />
          </div>
        </div>
      );
    }

```
---app/gpx/page.tsx---
```
    // app/gpx/page.tsx (or a server component that fetches the file)
    import fs from "node:fs/promises";
    import path from "node:path";
    import dynamic from "next/dynamic";

    const GpxViewer = dynamic(() => import("@/components/GpxViewer"), { ssr: false });

    export default async function Page() {
      // Example: read a GPX bundled in /public or /app/_data
      const gpxPath = path.join(process.cwd(), "public", "sample.gpx");
      const gpxText = await fs.readFile(gpxPath, "utf8");
      return (
        <main className="p-6">
          <h1 className="text-2xl font-semibold mb-4">GPX Preview</h1>
          <GpxViewer gpxText={gpxText} height={460} />
        </main>
      );
    }
```

@import "leaflet/dist/leaflet.css";

Also add one comment at the top with a short summary: 
// Next.js GPX Viewer with Leaflet + Chart.js Elevation Profile

Make sure all imports are correct and the code is self-contained so I can paste it directly into my project.
