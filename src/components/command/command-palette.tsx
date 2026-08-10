"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Command } from "cmdk";
import { FilePlus2, ListPlus, Navigation, Plus, Search, UserPlus, X } from "lucide-react";
import { toast } from "sonner";
import { appNavItems } from "@/components/layout/sidebar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useDemoStore } from "@/stores/demo-store";

export function CommandPalette() {
  const router = useRouter();
  const [open, setOpen] = React.useState(false);
  const [query, setQuery] = React.useState("");
  const search = useDemoStore((state) => state.search);
  const createTask = useDemoStore((state) => state.createTask);
  const createList = useDemoStore((state) => state.createList);
  const createProspect = useDemoStore((state) => state.createProspect);
  const session = useDemoStore((state) => state.session);
  const organization = useDemoStore((state) => state.organization);
  const companies = useDemoStore((state) => state.companies);

  React.useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        setOpen((current) => !current);
      }
      if (event.key === "Escape") {
        setOpen(false);
      }
    };
    const onOpen = () => setOpen(true);

    window.addEventListener("keydown", onKeyDown);
    window.addEventListener("prspct:open-command", onOpen);
    return () => {
      window.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("prspct:open-command", onOpen);
    };
  }, []);

  const results = React.useMemo(() => search(query), [query, search]);

  const run = (callback: () => void) => {
    callback();
    setOpen(false);
    setQuery("");
  };

  const createDemoTask = () => {
    const dueDate = new Date();
    dueDate.setDate(dueDate.getDate() + 1);
    createTask({
      title: query.trim() || "Review new ICP opportunities",
      description: "Created from the command palette.",
      status: "todo",
      priority: "medium",
      dueDate: dueDate.toISOString(),
      assignedTo: session?.userId ?? "user-admin",
    });
    toast.success("Task created");
    router.push("/app/tasks");
  };

  const createDemoList = () => {
    createList({
      name: query.trim() || "New prospect list",
      description: "Created from the command palette.",
      prospectIds: [],
      createdBy: session?.userId ?? "user-admin",
    });
    toast.success("List created");
    router.push("/app/lists");
  };

  const createDemoProspect = () => {
    const company = companies[0];
    createProspect({
      firstName: "New",
      lastName: "Prospect",
      jobTitle: "Revenue Leader",
      seniority: "Director",
      department: "Sales",
      email: `prospect-${Date.now()}@example.com`,
      phone: "+1 555 0100",
      city: "San Francisco",
      country: "United States",
      industry: company?.industry ?? "Software",
      source: "Command palette",
      status: "new",
      ownerId: session?.userId ?? "user-admin",
      companyId: company?.id ?? organization.id,
      tagIds: [],
    });
    toast.success("Prospect created");
    router.push("/app/prospects");
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[60] bg-slate-950/60 p-4 backdrop-blur-sm" onMouseDown={() => setOpen(false)}>
      <Command
        label="PRSPCT command palette"
        className="mx-auto mt-20 max-w-2xl overflow-hidden rounded-xl border border-border bg-popover text-popover-foreground shadow-2xl"
        onMouseDown={(event) => event.stopPropagation()}
      >
        <div className="flex items-center border-b border-border px-4">
          <Search className="mr-3 h-4 w-4 text-muted-foreground" />
          <Command.Input
            value={query}
            onValueChange={setQuery}
            autoFocus
            placeholder="Search or run a command..."
            className="h-14 flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground"
          />
          <Button variant="ghost" size="icon" onClick={() => setOpen(false)} aria-label="Close command palette">
            <X className="h-4 w-4" />
          </Button>
        </div>
        <Command.List className="max-h-[28rem] overflow-y-auto p-2">
          <Command.Empty className="px-3 py-8 text-center text-sm text-muted-foreground">No command or record found.</Command.Empty>

          <Command.Group heading="Navigate" className="[&_[cmdk-group-heading]]:px-3 [&_[cmdk-group-heading]]:py-2 [&_[cmdk-group-heading]]:text-xs [&_[cmdk-group-heading]]:font-semibold [&_[cmdk-group-heading]]:text-muted-foreground">
            {appNavItems.map((item) => {
              const Icon = item.icon;
              return (
                <Command.Item
                  key={item.href}
                  value={`navigate ${item.title}`}
                  onSelect={() => run(() => router.push(item.href))}
                  className="flex cursor-pointer items-center gap-3 rounded-lg px-3 py-2 text-sm aria-selected:bg-accent aria-selected:text-accent-foreground"
                >
                  <Icon className="h-4 w-4" />
                  <span>{item.title}</span>
                  <Navigation className="ml-auto h-3 w-3 text-muted-foreground" />
                </Command.Item>
              );
            })}
          </Command.Group>

          <Command.Group heading="Create" className="[&_[cmdk-group-heading]]:px-3 [&_[cmdk-group-heading]]:py-2 [&_[cmdk-group-heading]]:text-xs [&_[cmdk-group-heading]]:font-semibold [&_[cmdk-group-heading]]:text-muted-foreground">
            <Command.Item value="create prospect" onSelect={() => run(createDemoProspect)} className="flex cursor-pointer items-center gap-3 rounded-lg px-3 py-2 text-sm aria-selected:bg-accent aria-selected:text-accent-foreground">
              <UserPlus className="h-4 w-4" />
              Create prospect
            </Command.Item>
            <Command.Item value="create task" onSelect={() => run(createDemoTask)} className="flex cursor-pointer items-center gap-3 rounded-lg px-3 py-2 text-sm aria-selected:bg-accent aria-selected:text-accent-foreground">
              <FilePlus2 className="h-4 w-4" />
              Create task
            </Command.Item>
            <Command.Item value="create list" onSelect={() => run(createDemoList)} className="flex cursor-pointer items-center gap-3 rounded-lg px-3 py-2 text-sm aria-selected:bg-accent aria-selected:text-accent-foreground">
              <ListPlus className="h-4 w-4" />
              Create list
            </Command.Item>
          </Command.Group>

          {query.trim() ? (
            <Command.Group heading="Records" className="[&_[cmdk-group-heading]]:px-3 [&_[cmdk-group-heading]]:py-2 [&_[cmdk-group-heading]]:text-xs [&_[cmdk-group-heading]]:font-semibold [&_[cmdk-group-heading]]:text-muted-foreground">
              {results.prospects.slice(0, 4).map((prospect) => (
                <Command.Item
                  key={prospect.id}
                  value={`prospect ${prospect.fullName} ${prospect.email}`}
                  onSelect={() => run(() => router.push("/app/prospects"))}
                  className="flex cursor-pointer items-center gap-3 rounded-lg px-3 py-2 text-sm aria-selected:bg-accent aria-selected:text-accent-foreground"
                >
                  <Plus className="h-4 w-4" />
                  <span className="flex-1">{prospect.fullName}</span>
                  <Badge variant="secondary">{prospect.leadTemperature}</Badge>
                </Command.Item>
              ))}
              {results.companies.slice(0, 3).map((company) => (
                <Command.Item
                  key={company.id}
                  value={`company ${company.name}`}
                  onSelect={() => run(() => router.push("/app/companies"))}
                  className="flex cursor-pointer items-center gap-3 rounded-lg px-3 py-2 text-sm aria-selected:bg-accent aria-selected:text-accent-foreground"
                >
                  <Plus className="h-4 w-4" />
                  <span>{company.name}</span>
                </Command.Item>
              ))}
            </Command.Group>
          ) : null}
        </Command.List>
      </Command>
    </div>
  );
}
