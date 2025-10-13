"use client";

import type { ReactNode } from "react";
import { usePathname } from "next/navigation";

type PageSurfaceProps = {
  children: ReactNode;
};

export function PageSurface({ children }: PageSurfaceProps) {
  const pathname = usePathname();
  const isHome = pathname === "/";

  return <main className={`flex-1 py-0 ${isHome ? "" : "bg-white"}`}>{children}</main>;
}
