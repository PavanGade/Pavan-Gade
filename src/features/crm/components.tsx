"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { Badge, Button, Card, EmptyState, Input, Select, Table } from "@/components/ui/primitives";
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
import { cn } from "@/lib/utils";
import {
  activityIcon,
  companyName,
  formatDate,
  formatDateTime,
  ownerName,
  prospectLocation,
  prospectName,
  prospectStatuses,
  statusLabels,
} from "./utils";

export function ActionLink({
  href,
  children,
  variant = "primary",
}: {
  href: string;
  children: React.ReactNode;
  variant?: "primary" | "outline" | "secondary" | "ghost";
}) {
  return (
    <Link
      href={href}
      className={cn(
        "inline-flex h-10 items-center justify-center rounded-lg px-4 text-sm font-medium transition",
        variant === "primary" && "bg-zinc-950 text-white hover:bg-zinc-800",
        variant === "outline" && "border border-zinc-200 bg-white text-zinc-900 hover:bg-zinc-50",
        variant === "secondary" && "bg-zinc-100 text-zinc-950 hover:bg-zinc-200",
        variant === "ghost" && "text-zinc-700 hover:bg-zinc-100",
      )}
    >
      {children}
    </Link>
  );
}

export function Section({
  title,
  description,
  actions,
  children,
}: {
  title: string;
  description?: string;
  actions?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <Card>
      <div className="mb-4 flex items-start justify-between gap-3">
        <div>
          <h2 className="font-semibold text-zinc-950">{title}</h2>
          {description ? <p className="text-sm text-zinc-500">{description}</p> : null}
        </div>
        {actions}
      </div>
      {children}
    </Card>
  );
}

export function MetricCard({
  label,
  value,
  detail,
}: {
  label: string;
  value: React.ReactNode;
  detail?: React.ReactNode;
}) {
  return (
    <Card>
      <p className="text-sm text-zinc-500">{label}</p>
      <div className="mt-2 text-2xl font-semibold text-zinc-950">{value}</div>
      {detail ? <p className="mt-1 text-xs text-zinc-500">{detail}</p> : null}
    </Card>
  );
}

export function StatusBadge({ status }: { status: DemoProspectStatus }) {
  const variant = status === "won" || status === "qualified" ? "success" : status === "lost" ? "danger" : status === "new" ? "warning" : "default";
  return <Badge variant={variant}>{statusLabels[status]}</Badge>;
}

export function ScoreBadge({ score }: { score: number }) {
  const variant = score >= 75 ? "success" : score >= 50 ? "warning" : "default";
  return <Badge variant={variant}>{score}</Badge>;
}

export function TemperatureBadge({ value }: { value: DemoProspect["leadTemperature"] }) {
  return <Badge variant={value === "hot" ? "danger" : value === "warm" ? "warning" : "default"}>{value.toUpperCase()}</Badge>;
}

export function ActivityTimeline({
  activities,
  users,
  empty = "No activity yet.",
}: {
  activities: DemoActivity[];
  users: DemoUserProfile[];
  empty?: string;
}) {
  if (activities.length === 0) {
    return <EmptyState title={empty} />;
  }

  return (
    <div className="space-y-3">
      {activities.map((activity) => (
        <div key={activity.id} className="flex gap-3 rounded-xl border border-zinc-100 p-3">
          <span className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-zinc-900 text-xs text-white">
            {activityIcon(activity)}
          </span>
          <div>
            <p className="text-sm font-medium text-zinc-950">{activity.summary}</p>
            <p className="text-xs text-zinc-500">
              {ownerName(users, activity.actorId)} · {formatDateTime(activity.createdAt)}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}

export function TaskRows({
  tasks,
  prospects,
  companies,
  users,
  onComplete,
}: {
  tasks: DemoTask[];
  prospects: DemoProspect[];
  companies: DemoCompany[];
  users: DemoUserProfile[];
  onComplete?: (task: DemoTask) => void;
}) {
  if (tasks.length === 0) {
    return <EmptyState title="No tasks found" description="Create tasks from a prospect, deal, or the tasks page." />;
  }

  return (
    <div className="space-y-2">
      {tasks.map((task) => (
        <div key={task.id} className="flex flex-col gap-3 rounded-xl border border-zinc-100 p-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <p className="font-medium text-zinc-950">{task.title}</p>
              <Badge variant={task.priority === "high" ? "danger" : task.priority === "medium" ? "warning" : "default"}>{task.priority}</Badge>
              <Badge variant={task.status === "completed" ? "success" : "outline"}>{task.status.replace("_", " ")}</Badge>
            </div>
            <p className="mt-1 text-sm text-zinc-500">
              Due {formatDate(task.dueDate)} · {prospectName(prospects, task.prospectId)} · {companyName(companies, task.companyId)} · {ownerName(users, task.assignedTo)}
            </p>
          </div>
          {onComplete && task.status !== "completed" ? (
            <Button type="button" variant="outline" size="sm" onClick={() => onComplete(task)}>
              Complete
            </Button>
          ) : null}
        </div>
      ))}
    </div>
  );
}

export function ProspectTable({
  prospects,
  companies,
  users,
  selectedIds = [],
  onSelect,
  onSelectAll,
}: {
  prospects: DemoProspect[];
  companies: DemoCompany[];
  users: DemoUserProfile[];
  selectedIds?: string[];
  onSelect?: (id: string, checked: boolean) => void;
  onSelectAll?: (checked: boolean) => void;
}) {
  if (prospects.length === 0) {
    return <EmptyState title="No prospects found" description="Try adjusting search, filters, or discover new prospects." />;
  }

  const selected = new Set(selectedIds);

  return (
    <Table>
      <thead>
        <tr className="border-b border-zinc-100 text-left text-xs uppercase text-zinc-500">
          {onSelect ? (
            <th className="py-3 pr-3">
              <input
                type="checkbox"
                checked={prospects.length > 0 && prospects.every((prospect) => selected.has(prospect.id))}
                onChange={(event) => onSelectAll?.(event.target.checked)}
                aria-label="Select all prospects"
              />
            </th>
          ) : null}
          <th className="py-3 pr-3">Name</th>
          <th className="py-3 pr-3">Title</th>
          <th className="py-3 pr-3">Company</th>
          <th className="py-3 pr-3">Location</th>
          <th className="py-3 pr-3">Status</th>
          <th className="py-3 pr-3">Score</th>
          <th className="py-3 pr-3">Owner</th>
          <th className="py-3">Last Contact</th>
        </tr>
      </thead>
      <tbody>
        {prospects.map((prospect) => (
          <tr key={prospect.id} className="border-b border-zinc-100">
            {onSelect ? (
              <td className="py-3 pr-3">
                <input
                  type="checkbox"
                  checked={selected.has(prospect.id)}
                  onChange={(event) => onSelect(prospect.id, event.target.checked)}
                  aria-label={`Select ${prospect.fullName}`}
                />
              </td>
            ) : null}
            <td className="py-3 pr-3">
              <Link className="font-medium text-zinc-950 hover:underline" href={`/app/prospects/${prospect.id}`}>
                {prospect.fullName}
              </Link>
              <div className="text-xs text-zinc-500">{prospect.email}</div>
            </td>
            <td className="py-3 pr-3">{prospect.jobTitle}</td>
            <td className="py-3 pr-3">
              <Link className="hover:underline" href={`/app/companies/${prospect.companyId}`}>
                {companyName(companies, prospect.companyId)}
              </Link>
            </td>
            <td className="py-3 pr-3">{prospectLocation(prospect)}</td>
            <td className="py-3 pr-3"><StatusBadge status={prospect.status} /></td>
            <td className="py-3 pr-3"><ScoreBadge score={prospect.leadScore} /></td>
            <td className="py-3 pr-3">{ownerName(users, prospect.ownerId)}</td>
            <td className="py-3">{formatDate(prospect.lastContactedAt)}</td>
          </tr>
        ))}
      </tbody>
    </Table>
  );
}

export function ProspectForm({
  companies,
  users,
  onSubmit,
  submitLabel = "Create prospect",
}: {
  companies: DemoCompany[];
  users: DemoUserProfile[];
  onSubmit: (input: {
    firstName: string;
    lastName: string;
    jobTitle: string;
    seniority: string;
    department: string;
    email: string;
    phone: string;
    city: string;
    country: string;
    industry: string;
    source: string;
    status: DemoProspectStatus;
    ownerId: string;
    companyId: string;
    tagIds: string[];
  }) => void;
  submitLabel?: string;
}) {
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    jobTitle: "",
    seniority: "Manager",
    department: "Sales",
    email: "",
    phone: "",
    city: companies[0]?.city ?? "",
    country: companies[0]?.country ?? "",
    industry: companies[0]?.industry ?? "SaaS",
    source: "Manual",
    status: "new" as DemoProspectStatus,
    ownerId: users[0]?.id ?? "user-admin",
    companyId: companies[0]?.id ?? "",
    tagIds: [] as string[],
  });

  const selectedCompany = useMemo(() => companies.find((company) => company.id === form.companyId), [companies, form.companyId]);

  return (
    <form
      className="grid gap-4 sm:grid-cols-2"
      onSubmit={(event) => {
        event.preventDefault();
        onSubmit({
          ...form,
          city: form.city || selectedCompany?.city || "",
          country: form.country || selectedCompany?.country || "",
          industry: form.industry || selectedCompany?.industry || "",
        });
      }}
    >
      <Input required placeholder="First name" value={form.firstName} onChange={(event) => setForm({ ...form, firstName: event.target.value })} />
      <Input required placeholder="Last name" value={form.lastName} onChange={(event) => setForm({ ...form, lastName: event.target.value })} />
      <Input required placeholder="Job title" value={form.jobTitle} onChange={(event) => setForm({ ...form, jobTitle: event.target.value })} />
      <Input placeholder="Seniority" value={form.seniority} onChange={(event) => setForm({ ...form, seniority: event.target.value })} />
      <Input required type="email" placeholder="Email" value={form.email} onChange={(event) => setForm({ ...form, email: event.target.value })} />
      <Input placeholder="Phone" value={form.phone} onChange={(event) => setForm({ ...form, phone: event.target.value })} />
      <Select value={form.companyId} onChange={(event) => {
        const company = companies.find((candidate) => candidate.id === event.target.value);
        setForm({
          ...form,
          companyId: event.target.value,
          city: company?.city ?? form.city,
          country: company?.country ?? form.country,
          industry: company?.industry ?? form.industry,
        });
      }}>
        {companies.map((company) => <option key={company.id} value={company.id}>{company.name}</option>)}
      </Select>
      <Select value={form.ownerId} onChange={(event) => setForm({ ...form, ownerId: event.target.value })}>
        {users.map((user) => <option key={user.id} value={user.id}>{user.name}</option>)}
      </Select>
      <Input placeholder="City" value={form.city} onChange={(event) => setForm({ ...form, city: event.target.value })} />
      <Input placeholder="Country" value={form.country} onChange={(event) => setForm({ ...form, country: event.target.value })} />
      <Input placeholder="Department" value={form.department} onChange={(event) => setForm({ ...form, department: event.target.value })} />
      <Input placeholder="Source" value={form.source} onChange={(event) => setForm({ ...form, source: event.target.value })} />
      <Select value={form.status} onChange={(event) => setForm({ ...form, status: event.target.value as DemoProspectStatus })}>
        {prospectStatuses.map((status) => <option key={status} value={status}>{statusLabels[status]}</option>)}
      </Select>
      <div className="sm:col-span-2">
        <Button type="submit">{submitLabel}</Button>
      </div>
    </form>
  );
}

export function DealForm({
  prospects,
  companies,
  users,
  stages,
  onSubmit,
}: {
  prospects: DemoProspect[];
  companies: DemoCompany[];
  users: DemoUserProfile[];
  stages: Array<{ id: string; name: string }>;
  onSubmit: (input: {
    name: string;
    prospectId: string;
    companyId: string;
    ownerId: string;
    stageId: string;
    value: number;
    currency: "USD" | "INR";
    expectedCloseDate: string;
  }) => void;
}) {
  const firstProspect = prospects[0];
  const [form, setForm] = useState({
    name: "",
    prospectId: firstProspect?.id ?? "",
    companyId: firstProspect?.companyId ?? companies[0]?.id ?? "",
    ownerId: firstProspect?.ownerId ?? users[0]?.id ?? "user-admin",
    stageId: stages[0]?.id ?? "",
    value: "25000",
    currency: "USD" as "USD" | "INR",
    expectedCloseDate: "2026-09-15",
  });

  return (
    <form
      className="grid gap-4 sm:grid-cols-2"
      onSubmit={(event) => {
        event.preventDefault();
        onSubmit({ ...form, value: Number(form.value) || 0 });
      }}
    >
      <Input required className="sm:col-span-2" placeholder="Deal name" value={form.name} onChange={(event) => setForm({ ...form, name: event.target.value })} />
      <Select value={form.prospectId} onChange={(event) => {
        const prospect = prospects.find((candidate) => candidate.id === event.target.value);
        setForm({
          ...form,
          prospectId: event.target.value,
          companyId: prospect?.companyId ?? form.companyId,
          ownerId: prospect?.ownerId ?? form.ownerId,
        });
      }}>
        {prospects.map((prospect) => <option key={prospect.id} value={prospect.id}>{prospect.fullName}</option>)}
      </Select>
      <Select value={form.companyId} onChange={(event) => setForm({ ...form, companyId: event.target.value })}>
        {companies.map((company) => <option key={company.id} value={company.id}>{company.name}</option>)}
      </Select>
      <Select value={form.ownerId} onChange={(event) => setForm({ ...form, ownerId: event.target.value })}>
        {users.map((user) => <option key={user.id} value={user.id}>{user.name}</option>)}
      </Select>
      <Select value={form.stageId} onChange={(event) => setForm({ ...form, stageId: event.target.value })}>
        {stages.map((stage) => <option key={stage.id} value={stage.id}>{stage.name}</option>)}
      </Select>
      <Input required type="number" min="0" value={form.value} onChange={(event) => setForm({ ...form, value: event.target.value })} />
      <Select value={form.currency} onChange={(event) => setForm({ ...form, currency: event.target.value as "USD" | "INR" })}>
        <option value="USD">USD</option>
        <option value="INR">INR</option>
      </Select>
      <Input required type="date" value={form.expectedCloseDate} onChange={(event) => setForm({ ...form, expectedCloseDate: event.target.value })} />
      <div className="sm:col-span-2">
        <Button type="submit">Create deal</Button>
      </div>
    </form>
  );
}

export function DealTable({
  deals,
  prospects,
  companies,
  stages,
}: {
  deals: DemoDeal[];
  prospects: DemoProspect[];
  companies: DemoCompany[];
  stages: Array<{ id: string; name: string }>;
}) {
  if (deals.length === 0) {
    return <EmptyState title="No deals yet" description="Create a deal from a prospect or the pipeline." />;
  }

  return (
    <Table>
      <thead>
        <tr className="border-b border-zinc-100 text-left text-xs uppercase text-zinc-500">
          <th className="py-3 pr-3">Deal</th>
          <th className="py-3 pr-3">Prospect</th>
          <th className="py-3 pr-3">Company</th>
          <th className="py-3 pr-3">Stage</th>
          <th className="py-3 pr-3">Value</th>
          <th className="py-3">Close</th>
        </tr>
      </thead>
      <tbody>
        {deals.map((deal) => (
          <tr key={deal.id} className="border-b border-zinc-100">
            <td className="py-3 pr-3">
              <Link href={`/app/deals/${deal.id}`} className="font-medium text-zinc-950 hover:underline">{deal.name}</Link>
            </td>
            <td className="py-3 pr-3">{prospectName(prospects, deal.prospectId)}</td>
            <td className="py-3 pr-3">{companyName(companies, deal.companyId)}</td>
            <td className="py-3 pr-3">{stages.find((stage) => stage.id === deal.stageId)?.name ?? "Unknown"}</td>
            <td className="py-3 pr-3">{formatCurrency(deal.value, deal.currency)}</td>
            <td className="py-3">{formatDate(deal.expectedCloseDate)}</td>
          </tr>
        ))}
      </tbody>
    </Table>
  );
}

export function ListsTable({ lists, prospects, users }: { lists: DemoList[]; prospects: DemoProspect[]; users: DemoUserProfile[] }) {
  if (lists.length === 0) {
    return <EmptyState title="No lists yet" description="Create saved prospect segments for outreach and workflow." />;
  }

  return (
    <div className="grid gap-3 md:grid-cols-2">
      {lists.map((list) => (
        <Link key={list.id} href={`/app/lists/${list.id}`} className="rounded-2xl border border-zinc-100 p-4 transition hover:border-zinc-300">
          <div className="flex items-start justify-between gap-3">
            <div>
              <h3 className="font-semibold text-zinc-950">{list.name}</h3>
              <p className="mt-1 text-sm text-zinc-500">{list.description}</p>
            </div>
            <Badge>{list.prospectIds.length}</Badge>
          </div>
          <p className="mt-3 text-xs text-zinc-500">
            Owner {ownerName(users, list.createdBy)} · {prospects.filter((prospect) => list.prospectIds.includes(prospect.id)).length} active prospects
          </p>
        </Link>
      ))}
    </div>
  );
}
