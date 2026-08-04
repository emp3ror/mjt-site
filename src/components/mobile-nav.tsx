"use client";

/**
 * Hamburger-driven drawer for viewports below `lg`, where the inline
 * header nav does not fit. Mirrors the primary navigation list, keeps
 * focus trapped inside the drawer while open, and closes on Escape,
 * backdrop tap, route change, or when the viewport grows past `lg`.
 *
 * The `lg` breakpoint is mirrored in `NAV_MEDIA_QUERY` so the scroll lock
 * can never outlive the drawer that set it.
 */

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useId, useRef, useState } from "react";

import { cn } from "@/lib/cn";

type NavItem = { label: string; href: string };

type MobileNavProps = {
  items: NavItem[];
  socials?: NavItem[];
  appearance?: "light" | "default";
};

const isActive = (href: string, pathname: string | null) => {
  if (!pathname) return false;
  if (href === "/") return pathname === "/";
  if (href.startsWith("/#")) return false;
  return pathname === href || pathname.startsWith(`${href}/`);
};

const FOCUSABLE = [
  "a[href]",
  "button:not([disabled])",
  "[tabindex]:not([tabindex='-1'])",
].join(",");

/** Mirrors the `lg:hidden` / `hidden lg:block` classes on this component and `Header`. */
const NAV_MEDIA_QUERY = "(min-width: 1024px)";

export function MobileNav({ items, socials = [], appearance = "default" }: MobileNavProps) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const drawerRef = useRef<HTMLDivElement | null>(null);
  const triggerRef = useRef<HTMLButtonElement | null>(null);
  const drawerId = useId();
  const [lastPathname, setLastPathname] = useState(pathname);

  // Close the drawer when the route changes (e.g. browser back/forward).
  // React's recommended alternative to calling setState inside an effect:
  // compare to a stored value and update during render.
  if (lastPathname !== pathname) {
    setLastPathname(pathname);
    if (open) setOpen(false);
  }

  // The drawer is `lg:hidden`, so growing past `lg` would hide it while the
  // body scroll lock below stayed applied — leaving the page unscrollable.
  // Close on the breakpoint change instead. (The trigger is `lg:hidden` too,
  // so the drawer can never be opened above the breakpoint in the first place.)
  useEffect(() => {
    const query = window.matchMedia(NAV_MEDIA_QUERY);
    const onChange = (event: MediaQueryListEvent) => {
      if (event.matches) setOpen(false);
    };

    query.addEventListener("change", onChange);
    return () => query.removeEventListener("change", onChange);
  }, []);

  useEffect(() => {
    if (!open) return;

    const handleKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        setOpen(false);
        triggerRef.current?.focus();
        return;
      }

      if (event.key !== "Tab" || !drawerRef.current) return;

      const focusable = Array.from(
        drawerRef.current.querySelectorAll<HTMLElement>(FOCUSABLE),
      ).filter((el) => !el.hasAttribute("aria-hidden"));
      if (focusable.length === 0) return;

      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      const active = document.activeElement as HTMLElement | null;

      if (event.shiftKey && active === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && active === last) {
        event.preventDefault();
        first.focus();
      }
    };

    document.addEventListener("keydown", handleKey);
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const focusable = drawerRef.current?.querySelectorAll<HTMLElement>(FOCUSABLE);
    focusable?.[0]?.focus();

    return () => {
      document.removeEventListener("keydown", handleKey);
      document.body.style.overflow = previous;
    };
  }, [open]);

  return (
    <>
      <button
        ref={triggerRef}
        type="button"
        aria-expanded={open}
        aria-controls={drawerId}
        aria-label={open ? "Close navigation" : "Open navigation"}
        onClick={() => setOpen((value) => !value)}
        className={cn(
          // `relative z-50` keeps the trigger tappable above the open backdrop.
          "relative z-50 inline-flex h-10 w-10 items-center justify-center rounded-full border transition lg:hidden",
          appearance === "light"
            ? "border-white/40 text-white/85 hover:border-white hover:text-white"
            : "border-[color:var(--line-strong)]/65 text-[color:var(--ink-soft)] hover:border-[color:var(--accent)] hover:text-[color:var(--foreground)]",
        )}
      >
        <span aria-hidden className="relative block h-3 w-5">
          <span
            className={cn(
              "absolute left-0 right-0 h-px bg-current transition-transform",
              open ? "top-1/2 -translate-y-1/2 rotate-45" : "top-0",
            )}
          />
          <span
            className={cn(
              "absolute left-0 right-0 top-1/2 h-px -translate-y-1/2 bg-current transition-opacity",
              open && "opacity-0",
            )}
          />
          <span
            className={cn(
              "absolute left-0 right-0 h-px bg-current transition-transform",
              open ? "top-1/2 -translate-y-1/2 -rotate-45" : "bottom-0",
            )}
          />
        </span>
      </button>

      {open ? (
        <>
          <button
            type="button"
            aria-hidden
            tabIndex={-1}
            onClick={() => {
              setOpen(false);
              triggerRef.current?.focus();
            }}
            className="fixed inset-0 z-40 bg-[color:var(--foreground)]/40 backdrop-blur-sm lg:hidden"
          />
          <div
            id={drawerId}
            ref={drawerRef}
            role="dialog"
            aria-modal="true"
            aria-label="Navigation"
            className="fixed inset-x-4 top-[calc(var(--header-height)+0.75rem)] z-50 max-h-[calc(100svh-var(--header-height)-2rem)] overflow-y-auto overscroll-contain rounded-3xl border border-[color:var(--line)] bg-[color:var(--surface-strong)] p-6 shadow-[0_30px_70px_rgba(38,31,20,0.18)] lg:hidden"
          >
            <nav aria-label="Primary mobile" className="space-y-5">
              <ul className="space-y-1.5">
                {items.map((item) => {
                  const active = isActive(item.href, pathname);
                  return (
                    <li key={item.href}>
                      <Link
                        href={item.href}
                        aria-current={active ? "page" : undefined}
                        className={cn(
                          "block rounded-2xl px-4 py-3 text-[1.05rem] font-medium",
                          active
                            ? "bg-[color:var(--accent-soft)] text-[color:var(--foreground)]"
                            : "text-[color:var(--ink-soft)] hover:bg-[color:var(--surface-strong)] hover:text-[color:var(--foreground)]",
                        )}
                      >
                        {item.label}
                      </Link>
                    </li>
                  );
                })}
              </ul>

              {socials.length > 0 ? (
                <div className="space-y-2 border-t border-[color:var(--line)] pt-5">
                  <p className="px-2 text-[0.68rem] uppercase tracking-[0.32em] text-[color:var(--muted)]">
                    Elsewhere
                  </p>
                  <ul className="flex flex-wrap gap-2 px-1">
                    {socials.map((item) => {
                      const external = item.href.startsWith("http");
                      return (
                        <li key={item.href}>
                          <Link
                            href={item.href}
                            target={external ? "_blank" : undefined}
                            rel={external ? "noreferrer" : undefined}
                            className="inline-flex items-center gap-2 rounded-full border border-[color:var(--line)] px-3.5 py-2 text-[0.85rem] text-[color:var(--ink-soft)] hover:border-[color:var(--accent)] hover:text-[color:var(--foreground)]"
                          >
                            {item.label}
                          </Link>
                        </li>
                      );
                    })}
                  </ul>
                </div>
              ) : null}
            </nav>
          </div>
        </>
      ) : null}
    </>
  );
}
