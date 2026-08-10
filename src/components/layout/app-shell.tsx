"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { BriefcaseBusiness, Ellipsis, Gauge, ListChecks, Target } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { MobileSidebar, Sidebar } from "@/components/layout/sidebar";
import { Topbar } from "@/components/layout/topbar";

const bottomNavItems = [
  { title: "Home", href: "/app/dashboard", icon: Gauge },
  { title: "Prospects", href: "/app/prospects", icon: Target },
  { title: "Pipeline", href: "/app/pipeline", icon: BriefcaseBusiness },
  { title: "Tasks", href: "/app/tasks", icon: ListChecks },
];

export function AppShell({ children }: { children: React.ReactNode }) {
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const pathname = usePathname();

  return (
    <div className="min-h-screen bg-background">
      <Sidebar />
      <MobileSidebar open={mobileOpen} onOpenChange={setMobileOpen} />

      <div className="min-h-screen lg:pl-72">
        <Topbar onMenuClick={() => setMobileOpen(true)} />
        <main className="mx-auto w-full max-w-7xl px-4 py-6 pb-24 lg:px-8 lg:pb-8">{children}</main>
      </div>

      <nav className="fixed inset-x-0 bottom-0 z-40 grid grid-cols-5 border-t border-border bg-card/95 px-2 py-2 shadow-lg backdrop-blur-xl lg:hidden">
        {bottomNavItems.map((item) => {
          const Icon = item.icon;
          const active = pathname === item.href || pathname.startsWith(`${item.href}/`);

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex flex-col items-center gap-1 rounded-lg px-2 py-1.5 text-[11px] font-medium text-muted-foreground",
                active && "bg-primary/10 text-primary",
              )}
            >
              <Icon className="h-4 w-4" />
              {item.title}
            </Link>
          );
        })}
        <Button variant="ghost" className="h-auto flex-col gap-1 px-2 py-1.5 text-[11px]" onClick={() => setMobileOpen(true)}>
          <Ellipsis className="h-4 w-4" />
          More
        </Button>
      </nav>
    </div>
  );
}
