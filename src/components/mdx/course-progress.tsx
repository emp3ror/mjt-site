"use client";

import { useEffect, useState } from "react";

import { cn } from "@/lib/cn";
import { courseChecklists, type CourseProgressItem } from "@/components/mdx/course-progress-data";

type CourseProgressProps = {
  courseId: string;
};

const storageKeyFor = (courseId: string) => `mjt:self-study:${courseId}:progress`;

const groupByPhase = (items: CourseProgressItem[]) => {
  const groups: { phase: string; items: CourseProgressItem[] }[] = [];

  for (const item of items) {
    const lastGroup = groups.at(-1);
    if (lastGroup && lastGroup.phase === item.phase) {
      lastGroup.items.push(item);
    } else {
      groups.push({ phase: item.phase, items: [item] });
    }
  }

  return groups;
};

export function CourseProgress({ courseId }: CourseProgressProps) {
  const items = courseChecklists[courseId] ?? [];
  const storageKey = storageKeyFor(courseId);
  const [done, setDone] = useState<Set<string>>(new Set());
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") {
      setHydrated(true);
      return;
    }

    try {
      const raw = window.localStorage.getItem(storageKey);
      if (!raw) {
        setHydrated(true);
        return;
      }
      setDone(new Set(JSON.parse(raw) as string[]));
    } catch {
      // localStorage unavailable (private mode, disabled, etc.) — start fresh.
    }
    setHydrated(true);
  }, [storageKey]);

  const persist = (next: Set<string>) => {
    try {
      window.localStorage.setItem(storageKey, JSON.stringify([...next]));
    } catch {
      // ignore — progress just won't survive a reload.
    }
  };

  const toggle = (id: string) => {
    setDone((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      persist(next);
      return next;
    });
  };

  const reset = () => {
    setDone(new Set());
    try {
      window.localStorage.removeItem(storageKey);
    } catch {
      // ignore
    }
  };

  const percent = items.length ? Math.round((done.size / items.length) * 100) : 0;
  const groups = groupByPhase(items);

  return (
    <div className="mt-10 rounded-[1.4rem] border border-[color:var(--line)] bg-[color:var(--surface)] p-6 md:p-8">
      <div className="flex flex-wrap items-baseline justify-between gap-3">
        <p className="eyebrow">Your progress</p>
        <button
          type="button"
          onClick={reset}
          className="text-sm text-[color:var(--ink-soft)] underline decoration-[color:var(--accent)]/55 underline-offset-4 hover:text-[color:var(--accent-strong)]"
        >
          Reset progress
        </button>
      </div>

      <div className="mt-4 flex items-center gap-4">
        <div className="h-2 flex-1 overflow-hidden rounded-full bg-[color:var(--surface-strong)]">
          <div
            className="h-full rounded-full bg-[color:var(--accent)] transition-[width] duration-300"
            style={{ width: `${hydrated ? percent : 0}%` }}
          />
        </div>
        <span className="whitespace-nowrap text-sm text-[color:var(--ink-soft)]">
          {done.size}/{items.length} steps · {hydrated ? percent : 0}%
        </span>
      </div>
      <p className="mt-2 text-xs text-[color:var(--ink-soft)]">
        Saved in this browser only — check items off as you complete them.
      </p>

      <div className="mt-6 space-y-6">
        {groups.map((group) => (
          <div key={group.phase}>
            <p className="text-xs uppercase tracking-[0.08em] text-[color:var(--ink-soft)]">
              {group.phase}
            </p>
            <ul className="mt-2 space-y-1">
              {group.items.map((item) => (
                <li key={item.id}>
                  <label className="flex cursor-pointer items-start gap-3 py-1.5 text-[0.98rem] leading-[1.5]">
                    <input
                      type="checkbox"
                      checked={done.has(item.id)}
                      onChange={() => toggle(item.id)}
                      className="mt-1 h-4 w-4 shrink-0 accent-[color:var(--accent)]"
                    />
                    <span className={cn(done.has(item.id) && "text-[color:var(--ink-soft)] line-through")}>
                      {item.label}
                    </span>
                  </label>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
}
