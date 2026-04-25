"use client";

/**
 * Background media for the home hero. Always shows the poster image, then
 * upgrades to a looping video when the connection allows and the user
 * hasn't asked for reduced motion. Adds vignette/grain/flare/overlay
 * layers and tracks scroll progress for parallax in CSS.
 */

import { useEffect, useRef, useState } from "react";

type Props = {
  poster: string;
  mp4?: string;
  webm?: string;
  overlayOpacity?: number;
};

type ConnectionLike = {
  saveData?: boolean;
  effectiveType?: string;
};

const SLOW_TYPES = new Set(["slow-2g", "2g"]);

const grainSvg =
  "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 160 160'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/><feColorMatrix values='0 0 0 0 1  0 0 0 0 1  0 0 0 0 1  0 0 0 0.55 0'/></filter><rect width='100%' height='100%' filter='url(%23n)' opacity='0.85'/></svg>";

export function HomeHeroMedia({ poster, mp4, webm, overlayOpacity = 0.62 }: Props) {
  const [shouldLoadVideo, setShouldLoadVideo] = useState(false);
  const [inView, setInView] = useState(false);
  const [ready, setReady] = useState(false);
  const wrapperRef = useRef<HTMLDivElement | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const nav = navigator as Navigator & { connection?: ConnectionLike };
    const connection = nav.connection;
    const saveData = connection?.saveData === true;
    const slowConn = connection?.effectiveType
      ? SLOW_TYPES.has(connection.effectiveType)
      : false;

    const heavyAllowed = !reducedMotion.matches && !saveData && !slowConn && Boolean(mp4 || webm);
    queueMicrotask(() => setShouldLoadVideo(heavyAllowed));

    const onMotionChange = (event: MediaQueryListEvent) => {
      if (event.matches) {
        setShouldLoadVideo(false);
        setReady(false);
      }
    };
    reducedMotion.addEventListener?.("change", onMotionChange);
    return () => reducedMotion.removeEventListener?.("change", onMotionChange);
  }, [mp4, webm]);

  useEffect(() => {
    if (!shouldLoadVideo) return;
    const node = wrapperRef.current;
    if (!node) return;

    if (typeof IntersectionObserver === "undefined") {
      queueMicrotask(() => setInView(true));
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setInView(true);
            observer.disconnect();
            break;
          }
        }
      },
      { rootMargin: "120px" },
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, [shouldLoadVideo]);

  useEffect(() => {
    if (!inView) return;
    const video = videoRef.current;
    if (!video) return;

    const tryPlay = () => {
      const playResult = video.play();
      if (playResult && typeof playResult.catch === "function") {
        playResult.catch(() => {
          // autoplay denied - poster keeps the hero looking good
        });
      }
    };

    if (video.readyState >= 3) {
      queueMicrotask(() => setReady(true));
      tryPlay();
      return;
    }

    const onCanPlay = () => {
      setReady(true);
      tryPlay();
    };
    video.addEventListener("canplay", onCanPlay, { once: true });
    return () => video.removeEventListener("canplay", onCanPlay);
  }, [inView]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const node = wrapperRef.current?.parentElement;
    if (!node) return;

    let frame = 0;
    const update = () => {
      frame = 0;
      const rect = node.getBoundingClientRect();
      const total = rect.height || window.innerHeight;
      const progress = Math.min(1, Math.max(0, -rect.top / total));
      node.style.setProperty("--hero-scroll", progress.toFixed(3));
    };

    const onScroll = () => {
      if (frame) return;
      frame = window.requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (frame) window.cancelAnimationFrame(frame);
    };
  }, []);

  return (
    <div
      ref={wrapperRef}
      aria-hidden
      className="hero-media pointer-events-none absolute inset-0"
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={poster}
        alt=""
        className="hero-media__poster"
        decoding="async"
        fetchPriority="high"
      />
      {shouldLoadVideo && inView ? (
        <video
          ref={videoRef}
          className={`hero-media__video ${ready ? "is-ready" : ""}`}
          autoPlay
          muted
          loop
          playsInline
          preload="metadata"
          poster={poster}
          aria-hidden="true"
          tabIndex={-1}
        >
          {webm ? <source src={webm} type="video/webm" /> : null}
          {mp4 ? <source src={mp4} type="video/mp4" /> : null}
        </video>
      ) : null}
      <div className="hero-media__vignette" />
      <div
        className="hero-media__grain"
        style={{ backgroundImage: `url("${grainSvg}")` }}
      />
      <div className="hero-media__flare" />
      <div
        className="hero-media__overlay"
        style={{ "--hero-overlay-opacity": overlayOpacity } as React.CSSProperties}
      />
      <div className="hero-media__seam" />
    </div>
  );
}
