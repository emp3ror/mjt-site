"use client";

/**
 * Sticky primary navigation. Highlights the active route based on the URL.
 * Navigation links live in `content/site/navigation.json`.
 *
 * The inline list only appears from `lg` up, where all eight primary
 * links fit on one line without scrolling; below that a hamburger drawer
 * (`MobileNav`) takes over. Both breakpoints are kept in sync via
 * `NAV_BREAKPOINT` / `NAV_MEDIA_QUERY`.
 */

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

import navigation from "@content/site/navigation.json";
import { cn } from "@/lib/cn";
import { MobileNav } from "@/components/mobile-nav";

const SCROLL_THRESHOLD = 48;

const isActive = (href: string, pathname: string | null) => {
  if (!pathname) return false;
  if (href === "/") return pathname === "/";
  if (href.startsWith("/#")) return false;
  return pathname === href || pathname.startsWith(`${href}/`);
};

export function Header() {
  const pathname = usePathname();
  const isHome = pathname === "/";
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    if (!isHome) return;

    const handleScroll = () => {
      setScrolled(window.scrollY > SCROLL_THRESHOLD);
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [isHome]);

  const transparent = isHome && !scrolled;

  return (
    <header
      className={cn(
        "h-[var(--header-height)] transition-colors duration-300 ease-out",
        isHome
          ? scrolled
            ? "fixed inset-x-0 top-0 z-50 border-b border-[color:var(--line-strong)]/55 bg-[color:var(--surface)]/88 backdrop-blur-xl shadow-[0_12px_32px_-22px_rgba(15,23,42,0.45)]"
            : "fixed inset-x-0 top-0 z-50 bg-transparent"
          : "sticky top-0 z-40 border-b border-[color:var(--line-strong)]/65 bg-[color:var(--surface)]/94 backdrop-blur-xl",
      )}
    >
      <div className="page-wrap flex h-full items-center justify-between gap-6">
        <Link href="/" aria-label="Manish Jung Thapa — home" className="shrink-0">
          <span
            className={cn(
              "text-[0.8rem] font-semibold uppercase tracking-[0.38em] transition-colors duration-300",
              transparent ? "text-white/90" : "text-[color:var(--foreground)]/80",
            )}
          >
            MJT
          </span>
        </Link>

        {/* Keep the `lg` breakpoint in sync with `MobileNav`. */}
        <nav aria-label="Primary" className="hidden min-w-0 lg:block">
          <ul
            className={cn(
              "flex items-center gap-5 whitespace-nowrap text-[0.94rem] transition-colors duration-300 xl:gap-7",
              transparent ? "text-white/80" : "text-[color:var(--ink-soft)]",
            )}
          >
            {navigation.primary.map((item) => {
              const active = isActive(item.href, pathname);
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    aria-current={active ? "page" : undefined}
                    className={cn(
                      "group relative block pb-1.5 font-medium",
                      transparent
                        ? "hover:text-white"
                        : "hover:text-[color:var(--foreground)]",
                      active &&
                        (transparent ? "text-white" : "text-[color:var(--foreground)]"),
                    )}
                  >
                    {item.label}
                    <span
                      aria-hidden
                      className={cn(
                        "absolute inset-x-0 -bottom-px h-px transition-opacity duration-200",
                        transparent ? "bg-white" : "bg-[color:var(--accent)]",
                        active ? "opacity-100" : "opacity-0 group-hover:opacity-45",
                      )}
                    />
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        <MobileNav
          items={navigation.primary}
          socials={navigation.socials}
          appearance={transparent ? "light" : "default"}
        />
      </div>
    </header>
  );
}
