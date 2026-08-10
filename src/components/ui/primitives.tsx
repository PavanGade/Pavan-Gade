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

type LegacyButtonVariant = NonNullable<BaseButtonProps["variant"]> | "primary" | "danger";
type LegacyBadgeVariant = NonNullable<BaseBadgeProps["variant"]> | "danger";

function Button({ variant, className, ...props }: Omit<BaseButtonProps, "variant"> & { variant?: LegacyButtonVariant }) {
  const mappedVariant: BaseButtonProps["variant"] =
    variant === "primary" ? "default" : variant === "danger" ? "destructive" : variant;
  return <BaseButton variant={mappedVariant} className={className} {...props} />;
}

function Badge({ variant, className, ...props }: Omit<BaseBadgeProps, "variant"> & { variant?: LegacyBadgeVariant }) {
  const mappedVariant: BaseBadgeProps["variant"] =
    variant === "danger" ? "destructive" : variant;
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
  tabs: Array<{ value: string; label: string; count?: number }>;
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
          {typeof tab.count === "number" ? <span className="ml-1 text-xs opacity-70">{tab.count}</span> : null}
        </button>
      ))}
    </div>
  );
}

export { Badge, Button, Card, Dialog, EmptyState, Input, PageHeader, Select, Table, Tabs };
