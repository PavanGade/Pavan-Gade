"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  BarChart3,
  Bot,
  BriefcaseBusiness,
  Building2,
  CreditCard,
  Gauge,
  Inbox,
  ListChecks,
  ListFilter,
  LifeBuoy,
  Phone,
  Plug,
  Settings,
  Sparkles,
  Target,
  Users,
  Workflow,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useDemoStore } from "@/stores/demo-store";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet";

export const appNavItems = [
  { title: "Dashboard", href: "/app/dashboard", icon: Gauge },
  { title: "Prospects", href: "/app/prospects", icon: Target },
  { title: "Companies", href: "/app/companies", icon: Building2 },
  { title: "Lists", href: "/app/lists", icon: ListFilter },
  { title: "Pipeline", href: "/app/pipeline", icon: BriefcaseBusiness },
  { title: "Tasks", href: "/app/tasks", icon: ListChecks },
  { title: "Dialer", href: "/app/dialer", icon: Phone },
  { title: "Inbox", href: "/app/inbox", icon: Inbox },
  { title: "AI Assistant", href: "/app/ai", icon: Bot },
  { title: "Analytics", href: "/app/analytics", icon: BarChart3 },
  { title: "Reports", href: "/app/reports", icon: BarChart3 },
  { title: "Automations", href: "/app/automations", icon: Workflow },
  { title: "Integrations", href: "/app/integrations", icon: Plug },
  { title: "Team", href: "/app/team", icon: Users },
  { title: "Support", href: "/app/support", icon: LifeBuoy },
  { title: "Settings", href: "/app/settings", icon: Settings },
  { title: "Payments", href: "/app/payments", icon: CreditCard },
  { title: "Billing", href: "/app/billing", icon: CreditCard },
];

function WorkspaceBadge() {
  const organizationName = useDemoStore((state) => state.organization.name);
  const session = useDemoStore((state) => state.session);

  return (
    <div className="flex items-center gap-3 rounded-xl border border-sidebar-border bg-white/5 p-3">
      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary text-primary-foreground">
        <Sparkles className="h-5 w-5" />
      </div>
      <div className="min-w-0">
        <p className="truncate text-sm font-semibold text-sidebar-foreground">{organizationName}</p>
        <p className="truncate text-xs text-sidebar-muted">{session?.role ?? "Demo"} workspace</p>
      </div>
    </div>
  );
}

function SidebarNav({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = usePathname();

  return (
    <nav className="flex flex-1 flex-col gap-1 overflow-y-auto py-4">
      {appNavItems.map((item) => {
        const Icon = item.icon;
        const active = pathname === item.href || pathname.startsWith(`${item.href}/`);

        return (
          <Link
            key={item.href}
            href={item.href}
            onClick={onNavigate}
            className={cn(
              "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-sidebar-muted transition hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
              active && "bg-sidebar-accent text-sidebar-accent-foreground shadow-sm",
            )}
          >
            <Icon className="h-4 w-4" />
            <span>{item.title}</span>
          </Link>
        );
      })}
    </nav>
  );
}

export function Sidebar() {
  return (
    <aside className="hidden h-screen w-72 shrink-0 border-r border-sidebar-border bg-sidebar p-4 text-sidebar-foreground lg:fixed lg:inset-y-0 lg:flex lg:flex-col">
      <Link href="/app/dashboard" className="mb-6 flex items-center gap-3 px-1">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-lg shadow-teal-950/20">
          <Sparkles className="h-5 w-5" />
        </div>
        <div>
          <p className="text-xl font-black tracking-tight text-white">PRSPCT</p>
          <p className="text-xs uppercase tracking-[0.2em] text-sidebar-muted">Revenue OS</p>
        </div>
      </Link>
      <WorkspaceBadge />
      <SidebarNav />
    </aside>
  );
}

export function MobileSidebar({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="left" className="border-sidebar-border bg-sidebar p-4 text-sidebar-foreground">
        <SheetHeader className="sr-only">
          <SheetTitle>Navigation</SheetTitle>
          <SheetDescription>PRSPCT mobile workspace navigation</SheetDescription>
        </SheetHeader>
        <Link href="/app/dashboard" onClick={() => onOpenChange(false)} className="mb-6 flex items-center gap-3 px-1">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-primary-foreground">
            <Sparkles className="h-5 w-5" />
          </div>
          <div>
            <p className="text-xl font-black tracking-tight text-white">PRSPCT</p>
            <p className="text-xs uppercase tracking-[0.2em] text-sidebar-muted">Revenue OS</p>
          </div>
        </Link>
        <WorkspaceBadge />
        <SidebarNav onNavigate={() => onOpenChange(false)} />
      </SheetContent>
    </Sheet>
  );
}
