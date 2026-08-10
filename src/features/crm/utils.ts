import type {
  DemoActivity,
  DemoCompany,
  DemoDeal,
  DemoList,
  DemoProspect,
  DemoProspectStatus,
  DemoTask,
  DemoUserProfile,
} from "@/lib/demo/types";
import { formatCurrency } from "@/lib/format";

export const prospectStatuses: DemoProspectStatus[] = [
  "new",
  "contacted",
  "engaged",
  "qualified",
  "meeting",
  "proposal",
  "negotiation",
  "won",
  "lost",
  "nurture",
];

export const statusLabels: Record<DemoProspectStatus, string> = {
  new: "New",
  contacted: "Contacted",
  engaged: "Engaged",
  qualified: "Qualified",
  meeting: "Meeting",
  proposal: "Proposal",
  negotiation: "Negotiation",
  won: "Won",
  lost: "Lost",
  nurture: "Nurture",
};

export function ownerName(users: DemoUserProfile[], ownerId: string | undefined): string {
  return users.find((user) => user.id === ownerId)?.name ?? "Unassigned";
}

export function companyName(companies: DemoCompany[], companyId: string | undefined): string {
  return companies.find((company) => company.id === companyId)?.name ?? "Unknown company";
}

export function prospectName(prospects: DemoProspect[], prospectId: string | undefined): string {
  return prospects.find((prospect) => prospect.id === prospectId)?.fullName ?? "Unknown prospect";
}

export function formatDate(value: string | undefined): string {
  if (!value) return "Never";
  return new Intl.DateTimeFormat("en", { month: "short", day: "numeric", year: "numeric" }).format(new Date(value));
}

export function formatDateTime(value: string | undefined): string {
  if (!value) return "Never";
  return new Intl.DateTimeFormat("en", {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  }).format(new Date(value));
}

export function isOverdueTask(task: DemoTask, now = new Date("2026-08-10T09:00:00.000Z")): boolean {
  return task.status !== "completed" && new Date(task.dueDate).getTime() < now.getTime();
}

export function isToday(value: string, now = new Date("2026-08-10T09:00:00.000Z")): boolean {
  const date = new Date(value);
  return (
    date.getUTCFullYear() === now.getUTCFullYear() &&
    date.getUTCMonth() === now.getUTCMonth() &&
    date.getUTCDate() === now.getUTCDate()
  );
}

export function sortNewest<T extends { createdAt: string }>(records: T[]): T[] {
  return [...records].sort((left, right) => new Date(right.createdAt).getTime() - new Date(left.createdAt).getTime());
}

export function dealValue(deals: DemoDeal[]): string {
  return formatCurrency(deals.reduce((sum, deal) => sum + deal.value, 0));
}

export function prospectLocation(prospect: DemoProspect): string {
  return [prospect.city, prospect.country].filter(Boolean).join(", ");
}

export function listActiveProspects(list: DemoList, prospects: DemoProspect[]): DemoProspect[] {
  const ids = new Set(list.prospectIds);
  return prospects.filter((prospect) => ids.has(prospect.id));
}

export function activityIcon(activity: DemoActivity): string {
  const icons: Record<DemoActivity["type"], string> = {
    created: "+",
    updated: "u",
    deleted: "-",
    imported: "i",
    emailed: "@",
    called: "c",
    meeting: "m",
    note: "n",
    task: "t",
    deal: "$",
    stage_changed: ">",
    notification: "!",
    automation: "a",
    onboarding: "o",
  };

  return icons[activity.type];
}
