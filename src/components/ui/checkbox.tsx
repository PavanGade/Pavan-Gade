"use client";

import * as React from "react";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

export type CheckboxProps = Omit<React.InputHTMLAttributes<HTMLInputElement>, "type">;

const Checkbox = React.forwardRef<HTMLInputElement, CheckboxProps>(({ className, ...props }, ref) => (
  <label className="relative inline-flex h-4 w-4 items-center justify-center">
    <input ref={ref} type="checkbox" className="peer sr-only" {...props} />
    <span
      className={cn(
        "flex h-4 w-4 items-center justify-center rounded border border-input bg-background text-primary-foreground shadow-sm transition-colors peer-checked:border-primary peer-checked:bg-primary peer-checked:[&_svg]:block peer-focus-visible:ring-2 peer-focus-visible:ring-ring peer-disabled:cursor-not-allowed peer-disabled:opacity-50",
        className,
      )}
    >
      <Check className="hidden h-3 w-3" aria-hidden="true" />
    </span>
  </label>
));
Checkbox.displayName = "Checkbox";

export { Checkbox };
