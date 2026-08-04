"use client";

/**
 * Reads `window.location.origin` without a setState-in-effect cascade.
 *
 * The origin is a browser-only value that never changes for the life of the
 * page, so `useSyncExternalStore` with a no-op subscription gives us `null`
 * during SSR and the real origin from the first client render onwards.
 */

import { useSyncExternalStore } from "react";

const subscribe = () => () => {};
const getSnapshot = () => window.location.origin;
const getServerSnapshot = () => null;

export function useOrigin(): string | null {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}
