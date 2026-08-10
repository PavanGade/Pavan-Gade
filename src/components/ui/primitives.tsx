"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { Button as BaseButton, buttonVariants, type ButtonProps as BaseButtonProps } from "@/components/ui/button";
import { Badge as BaseBadge, type BadgeProps as BaseBadgeProps } from "@/components/ui/badge";
import { Card as BaseCard } from "@/components/ui/card";
import { Dialog as BaseDialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { EmptyState } from "@/components/ui/empty-state";
import { Input } from "@/components/ui/input";
import { PageHeader } from "@/components/ui/page-header";
import { Select } from "@/components/ui/select";
import { Table } from "@/components/ui/table";

type LegacyButtonVariant = BaseButtonProps["variant"] | "primary" | "danger";
type LegacyBadgeVariant = BaseBadgeProps["variant"] | "danger";

function Button({ variant, className, ...props }: Omit<BaseButtonProps, "variant"> & { variant?: LegacyButtonVariant }) {
  const mappedVariant = variant === "primary" ? "default" : variant === "danger" ? "destructive" : variant;
  return <BaseButton variant={mappedVariant} className={className} {...props} />;
}

function Badge({ variant, className, ...props }: Omit<BaseBadgeProps, "variant"> & { variant?: LegacyBadgeVariant }) {
  const mappedVariant = variant === "danger" ? "destructive" : variant;
  return <BaseBadge variant={mappedVariant} className={className} {...props} />;
}

function Card({ className, ...props }: React.ComponentProps<"div">) {
  return <BaseCard className={cn("p-5", className)} {...props} />;
}

function Dialog({
  open,
  onOpenChange,
  title,
  description,
  children,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description?: string;
  children: React.ReactNode;
}) {
  return (
    <BaseDialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          {description ? <DialogDescription>{description}</DialogDescription> : null}
        </DialogHeader>
        <div className="mt-5">{children}</div>
      </DialogContent>
    </BaseDialog>
  );
}

function Tabs({
  tabs,
  value,
  onValueChange,
}: {
  tabs: Array<{ value: string; label: string }>;
  value: string;
  onValueChange: (value: string) => void;
}) {
  return (
    <div className="flex flex-wrap gap-2">
      {tabs.map((tab) => (
        <button
          key={tab.value}
          type="button"
          onClick={() => onValueChange(tab.value)}
          className={cn(
            buttonVariants({ variant: value === tab.value ? "default" : "outline", size: "sm" }),
            "rounded-full",
          )}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
}

export { Badge, Button, Card, Dialog, EmptyState, Input, PageHeader, Select, Table, Tabs };
import * as React from "react";
import { cn } from "@/lib/utils";

export function Button({
  className,
  variant = "primary",
  size = "md",
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "secondary" | "outline" | "ghost" | "danger";
  size?: "sm" | "md";
}) {
  return (
    <button
      className={cn(
        "inline-flex items-center justify-center gap-2 rounded-lg font-medium transition disabled:pointer-events-none disabled:opacity-50",
        size === "sm" ? "h-8 px-3 text-sm" : "h-10 px-4 text-sm",
        variant === "primary" && "bg-zinc-950 text-white hover:bg-zinc-800",
        variant === "secondary" && "bg-zinc-100 text-zinc-950 hover:bg-zinc-200",
        variant === "outline" && "border border-zinc-200 bg-white text-zinc-900 hover:bg-zinc-50",
        variant === "ghost" && "text-zinc-700 hover:bg-zinc-100",
        variant === "danger" && "bg-red-600 text-white hover:bg-red-700",
        className,
      )}
      {...props}
    />
  );
}

export const Input = React.forwardRef<HTMLInputElement, React.InputHTMLAttributes<HTMLInputElement>>(
  ({ className, ...props }, ref) => (
    <input
      ref={ref}
      className={cn(
        "h-10 w-full rounded-lg border border-zinc-200 bg-white px-3 text-sm outline-none transition placeholder:text-zinc-400 focus:border-zinc-400 focus:ring-2 focus:ring-zinc-100",
        className,
      )}
      {...props}
    />
  ),
);
Input.displayName = "Input";

export function Select({
  className,
  children,
  ...props
}: React.SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <select
      className={cn(
        "h-10 rounded-lg border border-zinc-200 bg-white px-3 text-sm outline-none focus:border-zinc-400 focus:ring-2 focus:ring-zinc-100",
        className,
      )}
      {...props}
    >
      {children}
    </select>
  );
}

export function Card({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm", className)} {...props} />;
}

export function Badge({
  className,
  variant = "default",
  ...props
}: React.HTMLAttributes<HTMLSpanElement> & { variant?: "default" | "success" | "warning" | "danger" | "outline" }) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium",
        variant === "default" && "bg-zinc-100 text-zinc-700",
        variant === "success" && "bg-emerald-50 text-emerald-700",
        variant === "warning" && "bg-amber-50 text-amber-700",
        variant === "danger" && "bg-red-50 text-red-700",
        variant === "outline" && "border border-zinc-200 bg-white text-zinc-700",
        className,
      )}
      {...props}
    />
  );
}

export function Table({ className, ...props }: React.TableHTMLAttributes<HTMLTableElement>) {
  return (
    <div className="w-full overflow-x-auto">
      <table className={cn("w-full border-collapse text-sm", className)} {...props} />
    </div>
  );
}

export function EmptyState({
  title,
  description,
  action,
}: {
  title: string;
  description?: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="flex min-h-44 flex-col items-center justify-center rounded-2xl border border-dashed border-zinc-300 bg-zinc-50 p-8 text-center">
      <h3 className="text-base font-semibold text-zinc-950">{title}</h3>
      {description ? <p className="mt-2 max-w-md text-sm text-zinc-500">{description}</p> : null}
      {action ? <div className="mt-4">{action}</div> : null}
    </div>
  );
}

export function Dialog({
  open,
  onOpenChange,
  title,
  description,
  children,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description?: string;
  children: React.ReactNode;
}) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4" role="dialog" aria-modal="true">
      <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl bg-white p-6 shadow-xl">
        <div className="mb-5 flex items-start justify-between gap-4">
          <div>
            <h2 className="text-lg font-semibold text-zinc-950">{title}</h2>
            {description ? <p className="mt-1 text-sm text-zinc-500">{description}</p> : null}
          </div>
          <Button type="button" variant="ghost" size="sm" onClick={() => onOpenChange(false)}>
            Close
          </Button>
        </div>
        {children}
      </div>
    </div>
  );
}

export function PageHeader({
  title,
  description,
  actions,
}: {
  title: string;
  description?: string;
  actions?: React.ReactNode;
}) {
  return (
    <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight text-zinc-950">{title}</h1>
        {description ? <p className="mt-1 text-sm text-zinc-500">{description}</p> : null}
      </div>
      {actions ? <div className="flex flex-wrap items-center gap-2">{actions}</div> : null}
    </div>
  );
}

export function Tabs({
  tabs,
  value,
  onValueChange,
}: {
  tabs: Array<{ value: string; label: string; count?: number }>;
  value: string;
  onValueChange: (value: string) => void;
}) {
  return (
    <div className="flex flex-wrap gap-2">
      {tabs.map((tab) => (
        <Button
          key={tab.value}
          type="button"
          size="sm"
          variant={value === tab.value ? "primary" : "outline"}
          onClick={() => onValueChange(tab.value)}
        >
          {tab.label}
          {typeof tab.count === "number" ? <span className="text-xs opacity-70">{tab.count}</span> : null}
        </Button>
      ))}
    </div>
  );
}

export function Skeleton({ className }: { className?: string }) {
  return <div className={cn("animate-pulse rounded-lg bg-zinc-100", className)} />;
}

export function Avatar({ name, src, className }: { name: string; src?: string; className?: string }) {
  return src ? (
    // eslint-disable-next-line @next/next/no-img-element
    <img src={src} alt={name} className={cn("h-9 w-9 rounded-full object-cover", className)} />
  ) : (
    <span className={cn("inline-flex h-9 w-9 items-center justify-center rounded-full bg-zinc-900 text-xs font-semibold text-white", className)}>
      {name
        .split(/\s+/)
        .map((part) => part[0])
        .join("")
        .slice(0, 2)
        .toUpperCase()}
    </span>
  );
}
