"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

function Tooltip({ children, content, className }: { children: React.ReactNode; content: React.ReactNode; className?: string }) {
  return (
    <span className="group relative inline-flex">
      {children}
      <span
        role="tooltip"
        className={cn(
          "pointer-events-none absolute bottom-full left-1/2 z-50 mb-2 hidden -translate-x-1/2 whitespace-nowrap rounded-md bg-slate-950 px-2 py-1 text-xs font-medium text-white shadow-lg group-hover:block group-focus-within:block dark:bg-slate-100 dark:text-slate-950",
          className,
        )}
      >
        {content}
      </span>
    </span>
  );
}

export { Tooltip };
