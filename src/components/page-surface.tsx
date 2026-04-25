/**
 * Main content surface used by the root layout. Adds the `<main>` landmark
 * and the bottom padding shared by every route.
 */

import type { ReactNode } from "react";

export function PageSurface({ children }: { children: ReactNode }) {
  return (
    <main id="main" className="flex-1">
      <div className="pb-10 md:pb-14">{children}</div>
    </main>
  );
}
