"use client";

import { useMemo } from "react";
import { useRouter } from "next/navigation";
import { Bell, LogOut, Menu, Moon, Search, Sun, UserCircle } from "lucide-react";
import { useTheme } from "next-themes";
import { toast } from "sonner";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useDemoStore } from "@/stores/demo-store";

function initials(name?: string) {
  return (name ?? "Demo User")
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

export function Topbar({ onMenuClick }: { onMenuClick: () => void }) {
  const router = useRouter();
  const { setTheme, resolvedTheme } = useTheme();
  const session = useDemoStore((state) => state.session);
  const logout = useDemoStore((state) => state.logout);
  const notifications = useDemoStore((state) => state.notifications);
  const markAllNotificationsRead = useDemoStore((state) => state.markAllNotificationsRead);

  const unread = useMemo(
    () => notifications.filter((notification) => !notification.read && (!session || notification.userId === session.userId)),
    [notifications, session],
  );

  const openCommandPalette = () => {
    window.dispatchEvent(new Event("prspct:open-command"));
  };

  const handleLogout = () => {
    logout();
    toast.success("Signed out of PRSPCT");
    router.push("/login");
  };

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center gap-3 border-b border-border bg-background/90 px-4 backdrop-blur-xl lg:px-6">
      <Button variant="ghost" size="icon" className="lg:hidden" onClick={onMenuClick} aria-label="Open navigation">
        <Menu className="h-5 w-5" />
      </Button>

      <button
        type="button"
        onClick={openCommandPalette}
        className="flex h-10 flex-1 items-center gap-3 rounded-lg border border-border bg-card px-3 text-left text-sm text-muted-foreground shadow-sm transition hover:bg-muted sm:max-w-md"
      >
        <Search className="h-4 w-4" />
        <span className="hidden sm:inline">Search prospects, companies, tasks...</span>
        <span className="sm:hidden">Search</span>
        <kbd className="ml-auto hidden rounded border border-border bg-muted px-1.5 py-0.5 font-mono text-[10px] text-muted-foreground sm:inline-flex">Cmd K</kbd>
      </button>

      <div className="ml-auto flex items-center gap-2">
        <DropdownMenu>
          <DropdownMenuTrigger className="relative inline-flex h-10 w-10 items-center justify-center rounded-md text-muted-foreground transition hover:bg-accent hover:text-accent-foreground">
            <Bell className="h-5 w-5" />
            {unread.length ? <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-primary" /> : null}
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-80">
            <DropdownMenuLabel className="flex items-center justify-between">
              Notifications
              {unread.length ? <span className="rounded-full bg-primary/10 px-2 py-0.5 text-xs text-primary">{unread.length} new</span> : null}
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <div className="max-h-72 overflow-y-auto">
              {(unread.length ? unread : notifications.slice(0, 3)).map((notification) => (
                <DropdownMenuItem
                  key={notification.id}
                  className="block whitespace-normal"
                  onClick={() => {
                    if (notification.link) router.push(notification.link);
                  }}
                >
                  <p className="font-medium text-foreground">{notification.title}</p>
                  <p className="mt-1 text-xs text-muted-foreground">{notification.body}</p>
                </DropdownMenuItem>
              ))}
              {!notifications.length ? <p className="px-2 py-6 text-center text-sm text-muted-foreground">No notifications yet.</p> : null}
            </div>
            {unread.length ? (
              <>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => markAllNotificationsRead(session?.userId)}>Mark all as read</DropdownMenuItem>
              </>
            ) : null}
          </DropdownMenuContent>
        </DropdownMenu>

        <Button
          variant="ghost"
          size="icon"
          aria-label="Toggle theme"
          onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}
        >
          <Sun className="h-5 w-5 rotate-0 scale-100 transition dark:-rotate-90 dark:scale-0" />
          <Moon className="absolute h-5 w-5 rotate-90 scale-0 transition dark:rotate-0 dark:scale-100" />
        </Button>

        <DropdownMenu>
          <DropdownMenuTrigger className="inline-flex items-center gap-2 rounded-full p-1 transition hover:bg-accent">
            <Avatar>
              <AvatarFallback>{initials(session?.name)}</AvatarFallback>
            </Avatar>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuLabel>
              <p className="font-semibold">{session?.name ?? "Demo User"}</p>
              <p className="text-xs font-normal text-muted-foreground">{session?.email ?? "admin@prspct.demo"}</p>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => router.push("/app/settings")}>
              <UserCircle className="h-4 w-4" />
              Account settings
            </DropdownMenuItem>
            <DropdownMenuItem onClick={handleLogout}>
              <LogOut className="h-4 w-4" />
              Log out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
