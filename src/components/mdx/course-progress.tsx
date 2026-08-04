"use client";

import { useMemo, useSyncExternalStore } from "react";

import { cn } from "@/lib/cn";
import { courseChecklists, type CourseProgressItem } from "@/components/mdx/course-progress-data";

type CourseProgressProps = {
  courseId: string;
};

const storageKeyFor = (courseId: string) => `mjt:self-study:${courseId}:progress`;

/**
 * `localStorage` is the source of truth for progress, so it is read through
 * `useSyncExternalStore` rather than mirrored into React state. Besides
 * avoiding a hydration-time render cascade, this keeps two open tabs of the
 * same course in sync via the native `storage` event.
 */
const STORAGE_EVENT = "mjt:progress-change";

const subscribeToStorage = (onChange: () => void) => {
  window.addEventListener("storage", onChange);
  window.addEventListener(STORAGE_EVENT, onChange);
  return () => {
    window.removeEventListener("storage", onChange);
    window.removeEventListener(STORAGE_EVENT, onChange);
  };
};

const readRaw = (storageKey: string) => {
  try {
    // A string snapshot stays referentially stable between reads, which is
    // what `useSyncExternalStore` requires; the Set is derived from it below.
    return window.localStorage.getItem(storageKey) ?? "";
  } catch {
    // localStorage unavailable (private mode, disabled, etc.) — start fresh.
    return "";
  }
};

const writeRaw = (storageKey: string, value: string[] | null) => {
  try {
    if (value === null) {
      window.localStorage.removeItem(storageKey);
    } else {
      window.localStorage.setItem(storageKey, JSON.stringify(value));
    }
  } catch {
    // ignore — progress just won't survive a reload.
  }
  window.dispatchEvent(new Event(STORAGE_EVENT));
};

const parseRaw = (raw: string | null): Set<string> => {
  if (!raw) return new Set();
  try {
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? new Set(parsed as string[]) : new Set();
  } catch {
    return new Set();
  }
};

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

  const raw = useSyncExternalStore(
    subscribeToStorage,
    () => readRaw(storageKey),
    () => null,
  );

  // `null` only on the server / first paint, where localStorage is unreachable.
  const hydrated = raw !== null;
  const done = useMemo(() => parseRaw(raw), [raw]);

  const toggle = (id: string) => {
    const next = new Set(done);
    if (next.has(id)) next.delete(id);
    else next.add(id);
    writeRaw(storageKey, [...next]);
  };

  const reset = () => writeRaw(storageKey, null);

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
