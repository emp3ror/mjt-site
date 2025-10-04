"use client";

import { useState } from "react";
import { Menu, X } from "lucide-react";
import Link from "next/link";


const navigation = [
  { label: "Work", href: "#works" },
  { label: "Experience", href: "#experience" },
  { label: "Skills", href: "#skills" },
  { label: "Testimonials", href: "#testimonials" },
  { label: "Contact", href: "#contact" },
];

export function Header() {
  const [open, setOpen] = useState(false);

  const toggle = () => setOpen((previous) => !previous);
  const close = () => setOpen(false);

  return (
    <header className="sticky top-0 z-40 w-full bg-[color:var(--surface)]/80 backdrop-blur-xl">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <Link
          href="/"
          className="relative flex items-center gap-2 rounded-full bg-white/80 px-4 py-2 text-sm font-semibold text-[color:var(--ink)] shadow-[0_10px_30px_rgba(44,45,94,0.08)] transition hover:-translate-y-0.5 hover:shadow-[0_12px_40px_rgba(44,45,94,0.12)]"
        >
          <span className="relative">
            MJT Studio
            <span className="absolute -bottom-1 left-0 h-2 w-full rounded-full bg-[color:var(--accent)]/30" aria-hidden />
          </span>
        </Link>

        <nav className="hidden items-center gap-6 md:flex">
          {navigation.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="group relative text-sm font-medium text-[color:var(--ink)]/80 transition hover:text-[color:var(--ink)]"
            >
              {item.label}
              <span className="absolute inset-x-0 -bottom-1 h-1 scale-x-0 rounded-full bg-[color:var(--accent)]/70 transition group-hover:scale-x-100" />
            </Link>
          ))}
        </nav>

        <button
          type="button"
          className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-[color:var(--muted)]/60 text-[color:var(--ink)] md:hidden"
          onClick={toggle}
          aria-label={open ? "Close menu" : "Open menu"}
        >
          {open ? <X className="h-5 w-5" aria-hidden /> : <Menu className="h-5 w-5" aria-hidden />}
        </button>
      </div>

      {open ? (
        <div className="md:hidden px-4">
          <nav className="mb-4 space-y-2 rounded-3xl border border-[color:var(--muted)]/60 bg-white/95 p-6 shadow-[0_24px_60px_rgba(44,45,94,0.18)] transition-all duration-300 ease-out">
            {navigation.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="flex items-center justify-between rounded-2xl bg-[color:var(--background)] px-4 py-3 text-sm font-medium text-[color:var(--ink)] shadow-sm transition hover:bg-white"
                onClick={close}
              >
                {item.label}
                <span aria-hidden>{">"}</span>
              </Link>
            ))}
          </nav>
        </div>
      ) : null}
    </header>
  );
}
