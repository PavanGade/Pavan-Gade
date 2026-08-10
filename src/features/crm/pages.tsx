"use client";

import { DndContext, type DragEndEvent, useDraggable, useDroppable } from "@dnd-kit/core";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import Papa from "papaparse";
import { useMemo, useState } from "react";
import type React from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { Badge, Button, Card, Dialog, EmptyState, Input, PageHeader, Select, Tabs } from "@/components/ui/primitives";
import type { DemoDateRangePreset, DemoDeal, DemoProspect, DemoProspectStatus } from "@/lib/demo/types";
import { getClientIntegrationStatuses } from "@/lib/env";
import { formatCurrency, initials } from "@/lib/format";
import { evaluateImportRows, suggestColumnMapping, type CsvRow, type ImportProspectData } from "@/lib/import/csv";
import { getBillingProvider } from "@/lib/providers/billing";
import { getAIProvider, type OutreachGeneration, type ProspectAnalysis } from "@/lib/providers/ai";
import { MockProspectProvider } from "@/lib/providers/prospect-data";
import type { JsonObject, PlanTier, Prospect } from "@/types/domain";
import { useDemoStore } from "@/stores/demo-store";
import { cn } from "@/lib/utils";
import {
  ActionLink,
  ActivityTimeline,
  DealForm,
  DealTable,
  ListsTable,
  MetricCard,
  ProspectForm,
  ProspectTable,
  ScoreBadge,
  Section,
  TaskRows,
  TemperatureBadge,
} from "./components";
import {
  companyName,
  dealValue,
  formatDate,
  isOverdueTask,
  isToday,
  listActiveProspects,
  ownerName,
  prospectLocation,
  prospectStatuses,
  sortNewest,
  statusLabels,
} from "./utils";

const colors = ["#18181b", "#71717a", "#a1a1aa", "#d4d4d8", "#3f3f46", "#52525b"];

function statusCount(prospects: DemoProspect[], status: DemoProspectStatus) {
  return prospects.filter((prospect) => prospect.status === status).length;
}

function toChartRows(record: Record<string, number>) {
  return Object.entries(record).map(([name, value]) => ({ name, value }));
}

function toDealCreateName(prospect: DemoProspect | undefined) {
  return prospect ? `${prospect.fullName} opportunity` : "New CRM opportunity";
}

export function DashboardPage() {
  const store = useDemoStore();
  const [range, setRange] = useState<DemoDateRangePreset>("30d");
  const metrics = store.getDashboardMetrics(range);
  const analytics = store.getAnalytics(range);
  const overdue = store.tasks.filter((task) => isOverdueTask(task));
  const today = store.tasks.filter((task) => task.status !== "completed" && isToday(task.dueDate));
  const hot = store.prospects.filter((prospect) => prospect.leadTemperature === "hot");
  const atRisk = store.deals.filter((deal) => deal.status === "open" && new Date(deal.expectedCloseDate) <= new Date("2026-08-24T00:00:00.000Z") && deal.probability < 60);
  const recentProspects = sortNewest(store.prospects).slice(0, 6);

  return (
    <>
      <PageHeader
        title="Dashboard"
        description="A live command center backed by the PRSPCT demo Zustand store."
        actions={
          <>
            {(["7d", "30d", "90d"] as DemoDateRangePreset[]).map((value) => (
              <Button key={value} type="button" variant={range === value ? "primary" : "outline"} size="sm" onClick={() => setRange(value)}>
                {value}
              </Button>
            ))}
          </>
        }
      />
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
        <MetricCard label="Total prospects" value={metrics.totalProspects} detail={`${metrics.averageLeadScore} avg score`} />
        <MetricCard label="New" value={statusCount(store.prospects, "new")} />
        <MetricCard label="Contacted" value={statusCount(store.prospects, "contacted")} />
        <MetricCard label="Engaged" value={statusCount(store.prospects, "engaged")} />
        <MetricCard label="Qualified" value={statusCount(store.prospects, "qualified")} />
        <MetricCard label="Meetings" value={statusCount(store.prospects, "meeting")} />
        <MetricCard label="Opportunities" value={metrics.openDeals} detail={formatCurrency(metrics.pipelineValue)} />
        <MetricCard label="Won" value={store.deals.filter((deal) => deal.status === "won").length} />
        <MetricCard label="Revenue" value={formatCurrency(metrics.wonDealsValue)} />
        <MetricCard label="Overdue" value={metrics.overdueTasks} detail="Follow-ups" />
      </div>

      <div className="mt-6 grid gap-6 xl:grid-cols-3">
        <Section title="Command center insights">
          <div className="grid gap-3">
            <Link href="/app/tasks" className="rounded-xl border border-zinc-100 p-4 hover:border-zinc-300">
              <div className="flex items-center justify-between"><span className="font-medium">Overdue follow-ups</span><Badge variant="danger">{overdue.length}</Badge></div>
              <p className="mt-1 text-sm text-zinc-500">Tasks that need immediate rep action.</p>
            </Link>
            <Link href="/app/prospects?view=hot" className="rounded-xl border border-zinc-100 p-4 hover:border-zinc-300">
              <div className="flex items-center justify-between"><span className="font-medium">Hot prospects</span><Badge variant="warning">{hot.length}</Badge></div>
              <p className="mt-1 text-sm text-zinc-500">High-temperature leads ready for prioritization.</p>
            </Link>
            <Link href="/app/pipeline" className="rounded-xl border border-zinc-100 p-4 hover:border-zinc-300">
              <div className="flex items-center justify-between"><span className="font-medium">Deals at risk</span><Badge>{atRisk.length}</Badge></div>
              <p className="mt-1 text-sm text-zinc-500">Low-probability deals close to expected close date.</p>
            </Link>
          </div>
        </Section>
        <Section title="Prospects by status">
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={toChartRows(analytics.prospectsByStatus).filter((row) => row.value > 0)}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" hide />
                <YAxis allowDecimals={false} />
                <Tooltip />
                <Bar dataKey="value" fill="#18181b" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Section>
        <Section title="Activity timeline">
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={analytics.activityTimeline}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" hide />
                <YAxis allowDecimals={false} />
                <Tooltip />
                <Line type="monotone" dataKey="count" stroke="#18181b" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Section>
      </div>

      <div className="mt-6 grid gap-6 xl:grid-cols-2">
        <Section title="Today's tasks"><TaskRows tasks={today.slice(0, 6)} prospects={store.prospects} companies={store.companies} users={store.users} onComplete={(task) => store.updateTask(task.id, { status: "completed" })} /></Section>
        <Section title="Overdue tasks"><TaskRows tasks={overdue.slice(0, 6)} prospects={store.prospects} companies={store.companies} users={store.users} onComplete={(task) => store.updateTask(task.id, { status: "completed" })} /></Section>
        <Section title="Recent prospects"><ProspectTable prospects={recentProspects} companies={store.companies} users={store.users} /></Section>
        <Section title="Recent activity"><ActivityTimeline activities={metrics.recentActivities.slice(0, 8)} users={store.users} /></Section>
      </div>
    </>
  );
}

export function ProspectsPage() {
  const store = useDemoStore();
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState<"all" | DemoProspectStatus>("all");
  const [view, setView] = useState("All");
  const [page, setPage] = useState(1);
  const [selected, setSelected] = useState<string[]>([]);
  const pageSize = 20;
  const currentUserId = store.session?.userId ?? store.users[0]?.id;
  const filtered = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    return store.prospects.filter((prospect) => {
      const matchesQuery = !normalized || [prospect.fullName, prospect.email, prospect.jobTitle, companyName(store.companies, prospect.companyId), prospectLocation(prospect)].join(" ").toLowerCase().includes(normalized);
      const matchesStatus = status === "all" || prospect.status === status;
      const matchesView =
        view === "All" ||
        (view === "Hot" && prospect.leadTemperature === "hot") ||
        (view === "My Leads" && prospect.ownerId === currentUserId) ||
        (view === "Needs Follow-up" && Boolean(prospect.nextFollowupAt && new Date(prospect.nextFollowupAt) <= new Date("2026-08-10T09:00:00.000Z"))) ||
        (view === "New" && prospect.status === "new") ||
        (view === "Qualified" && prospect.status === "qualified");
      return matchesQuery && matchesStatus && matchesView;
    });
  }, [currentUserId, query, status, store.companies, store.prospects, view]);
  const pageCount = Math.max(1, Math.ceil(filtered.length / pageSize));
  const pageRows = filtered.slice((page - 1) * pageSize, page * pageSize);

  return (
    <>
      <PageHeader
        title="Prospects"
        description="Search, segment, bulk update, and open prospect records."
        actions={
          <>
            <ActionLink href="/app/prospects/discover" variant="outline">Discover</ActionLink>
            <ActionLink href="/app/prospects/import" variant="outline">Import</ActionLink>
            <ActionLink href="/app/prospects/new">Add Prospect</ActionLink>
          </>
        }
      />
      <Card className="mb-4">
        <div className="flex flex-col gap-3 lg:flex-row">
          <Input placeholder="Search prospects, company, title, location" value={query} onChange={(event) => { setQuery(event.target.value); setPage(1); }} />
          <Select value={status} onChange={(event) => { setStatus(event.target.value as "all" | DemoProspectStatus); setPage(1); }}>
            <option value="all">All statuses</option>
            {prospectStatuses.map((item) => <option key={item} value={item}>{statusLabels[item]}</option>)}
          </Select>
        </div>
        <div className="mt-4 flex flex-wrap gap-2">
          {["All", "Hot", "My Leads", "Needs Follow-up", "New", "Qualified"].map((chip) => (
            <Button key={chip} type="button" size="sm" variant={view === chip ? "primary" : "outline"} onClick={() => { setView(chip); setPage(1); }}>
              {chip}
            </Button>
          ))}
        </div>
        {selected.length > 0 ? (
          <div className="mt-4 flex flex-wrap items-center gap-2 rounded-xl bg-zinc-50 p-3">
            <span className="text-sm font-medium">{selected.length} selected</span>
            <Select aria-label="Bulk status" onChange={(event) => {
              const nextStatus = event.target.value as DemoProspectStatus;
              selected.forEach((id) => store.updateProspect(id, { status: nextStatus }));
              setSelected([]);
            }} defaultValue="">
              <option value="" disabled>Update status</option>
              {prospectStatuses.map((item) => <option key={item} value={item}>{statusLabels[item]}</option>)}
            </Select>
            <Select aria-label="Bulk assign owner" onChange={(event) => {
              const ownerId = event.target.value;
              if (!ownerId) return;
              selected.forEach((id) => store.updateProspect(id, { ownerId }));
              setSelected([]);
            }} defaultValue="">
              <option value="" disabled>Assign owner</option>
              {store.users.map((user) => <option key={user.id} value={user.id}>{user.name}</option>)}
            </Select>
            <Select aria-label="Bulk add to list" onChange={(event) => {
              const listId = event.target.value;
              if (!listId) return;
              const list = store.lists.find((item) => item.id === listId);
              if (!list) return;
              const prospectIds = Array.from(new Set([...list.prospectIds, ...selected]));
              store.updateList(listId, { prospectIds });
              setSelected([]);
            }} defaultValue="">
              <option value="" disabled>Add to list</option>
              {store.lists.map((list) => <option key={list.id} value={list.id}>{list.name}</option>)}
            </Select>
            <Select aria-label="Bulk add tag" onChange={(event) => {
              const tagId = event.target.value;
              if (!tagId) return;
              selected.forEach((id) => {
                const prospect = store.prospects.find((item) => item.id === id);
                if (!prospect) return;
                store.updateProspect(id, { tagIds: Array.from(new Set([...prospect.tagIds, tagId])) });
              });
              setSelected([]);
            }} defaultValue="">
              <option value="" disabled>Add tag</option>
              {store.tags.map((tag) => <option key={tag.id} value={tag.id}>{tag.name}</option>)}
            </Select>
            <Button type="button" variant="danger" onClick={() => { selected.forEach(store.deleteProspect); setSelected([]); }}>Delete selected</Button>
          </div>
        ) : null}
      </Card>
      <Card>
        <ProspectTable
          prospects={pageRows}
          companies={store.companies}
          users={store.users}
          selectedIds={selected}
          onSelect={(id, checked) => setSelected((ids) => checked ? [...ids, id] : ids.filter((item) => item !== id))}
          onSelectAll={(checked) => setSelected(checked ? pageRows.map((prospect) => prospect.id) : [])}
        />
        <div className="mt-4 flex items-center justify-between text-sm text-zinc-500">
          <span>{filtered.length} results · page {page} of {pageCount}</span>
          <div className="flex gap-2">
            <Button type="button" variant="outline" size="sm" disabled={page === 1} onClick={() => setPage((value) => value - 1)}>Previous</Button>
            <Button type="button" variant="outline" size="sm" disabled={page === pageCount} onClick={() => setPage((value) => value + 1)}>Next</Button>
          </div>
        </div>
      </Card>
    </>
  );
}

export function NewProspectPage() {
  const router = useRouter();
  const store = useDemoStore();
  return (
    <>
      <PageHeader title="Add prospect" description="Create a new prospect in the demo CRM." />
      <Card>
        <ProspectForm
          companies={store.companies}
          users={store.users}
          onSubmit={(input) => {
            const created = store.createProspect(input);
            router.push(`/app/prospects/${created.id}`);
          }}
        />
      </Card>
    </>
  );
}

export function ProspectDetailPage() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const store = useDemoStore();
  const prospect = store.prospects.find((candidate) => candidate.id === params.id);
  const [note, setNote] = useState("");
  const [listOpen, setListOpen] = useState(false);
  const [taskOpen, setTaskOpen] = useState(false);
  const [dealOpen, setDealOpen] = useState(false);
  const [aiLoading, setAiLoading] = useState(false);
  const [analysis, setAnalysis] = useState<ProspectAnalysis | null>(null);
  const [outreachOpen, setOutreachOpen] = useState(false);
  const [outreach, setOutreach] = useState<OutreachGeneration | null>(null);
  const [outreachForm, setOutreachForm] = useState({ channel: "email" as "email" | "linkedin", tone: "professional" as "professional" | "friendly" | "concise" | "direct" });

  if (!prospect) {
    return <EmptyState title="Prospect not found" action={<ActionLink href="/app/prospects">Back to prospects</ActionLink>} />;
  }

  const company = store.companies.find((candidate) => candidate.id === prospect.companyId);
  const tasks = store.tasks.filter((task) => task.prospectId === prospect.id);
  const deals = store.deals.filter((deal) => deal.prospectId === prospect.id);
  const notes = store.notes.filter((item) => item.prospectId === prospect.id);
  const activities = store.activities.filter((activity) => activity.prospectId === prospect.id);
  const phone = prospect.phone.replace(/\D/g, "");

  return (
    <>
      <PageHeader
        title={prospect.fullName}
        description={`${prospect.jobTitle} at ${company?.name ?? "Unknown company"}`}
        actions={
          <>
            <a className="inline-flex h-10 items-center rounded-lg border border-zinc-200 px-4 text-sm" href={`tel:${prospect.phone}`}>Call</a>
            <a className="inline-flex h-10 items-center rounded-lg border border-zinc-200 px-4 text-sm" href={`mailto:${prospect.email}?subject=${encodeURIComponent(`Following up, ${prospect.firstName}`)}&body=${encodeURIComponent(`Hi ${prospect.firstName},\n\nQuick follow-up from PRSPCT.\n`)}`}>Email</a>
            <a className="inline-flex h-10 items-center rounded-lg border border-zinc-200 px-4 text-sm" href={`sms:${prospect.phone}?body=${encodeURIComponent(`Hi ${prospect.firstName}, following up from our team.`)}`}>SMS</a>
            <a className="inline-flex h-10 items-center rounded-lg border border-zinc-200 px-4 text-sm" href={`https://wa.me/${phone}?text=${encodeURIComponent(`Hi ${prospect.firstName}, following up after our conversation.`)}`} target="_blank" rel="noreferrer">WhatsApp</a>
            <ActionLink href="/app/dialer" variant="outline">Open dialer</ActionLink>
          </>
        }
      />
      <div className="grid gap-6 xl:grid-cols-[1fr_360px]">
        <div className="space-y-6">
          <Section title="Overview">
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <div><p className="text-xs text-zinc-500">Status</p><Select className="mt-1 w-full" value={prospect.status} onChange={(event) => store.updateProspect(prospect.id, { status: event.target.value as DemoProspectStatus })}>{prospectStatuses.map((status) => <option key={status} value={status}>{statusLabels[status]}</option>)}</Select></div>
              <div><p className="text-xs text-zinc-500">Score</p><div className="mt-2"><ScoreBadge score={prospect.leadScore} /></div></div>
              <div><p className="text-xs text-zinc-500">Temperature</p><div className="mt-2"><TemperatureBadge value={prospect.leadTemperature} /></div></div>
              <div><p className="text-xs text-zinc-500">Owner</p><p className="mt-2 font-medium">{ownerName(store.users, prospect.ownerId)}</p></div>
              <div><p className="text-xs text-zinc-500">Email</p><p className="mt-1">{prospect.email}</p></div>
              <div><p className="text-xs text-zinc-500">Phone</p><p className="mt-1">{prospect.phone}</p></div>
              <div><p className="text-xs text-zinc-500">Location</p><p className="mt-1">{prospectLocation(prospect)}</p></div>
              <div><p className="text-xs text-zinc-500">Company</p><Link className="mt-1 block font-medium hover:underline" href={`/app/companies/${prospect.companyId}`}>{company?.name}</Link></div>
            </div>
          </Section>
          <Section title="AI analysis" actions={<Button type="button" disabled={aiLoading} onClick={async () => {
            setAiLoading(true);
            try {
              const provider = await getAIProvider();
              setAnalysis(await provider.analyzeProspect({ prospect: prospect as unknown as JsonObject, company: company as unknown as JsonObject, icp: store.icpProfile as unknown as JsonObject }));
            } finally {
              setAiLoading(false);
            }
          }}>{aiLoading ? "Analyzing..." : "AI Analyze"}</Button>}>
            {analysis ? (
              <div className="space-y-3">
                <Badge variant="warning">DEMO</Badge>
                <p className="text-sm text-zinc-700">{analysis.summary}</p>
                <div className="grid gap-3 md:grid-cols-3">
                  <MetricCard label="Fit score" value={analysis.fitScore} />
                  <MetricCard label="Confidence" value={`${Math.round(analysis.confidence * 100)}%`} />
                  <MetricCard label="Next steps" value={analysis.recommendedNextSteps.length} />
                </div>
                <p className="text-sm font-medium">Buying signals</p>
                <ul className="list-disc pl-5 text-sm text-zinc-600">{analysis.buyingSignals.map((item) => <li key={item}>{item}</li>)}</ul>
              </div>
            ) : <EmptyState title="No analysis yet" description="Run AI analysis to generate demo fit signals." />}
          </Section>
          <Section title="Notes" actions={<Button type="button" onClick={() => {
            if (!note.trim()) return;
            store.createNote({ body: note, authorId: store.session?.userId ?? store.users[0]?.id ?? "user-admin", prospectId: prospect.id, companyId: prospect.companyId });
            setNote("");
          }}>Add note</Button>}>
            <textarea className="mb-4 min-h-24 w-full rounded-xl border border-zinc-200 p-3 text-sm outline-none focus:ring-2 focus:ring-zinc-100" value={note} onChange={(event) => setNote(event.target.value)} placeholder="Write a note..." />
            {notes.length ? <div className="space-y-3">{notes.map((item) => <div key={item.id} className="rounded-xl border border-zinc-100 p-3"><p className="text-sm">{item.body}</p><p className="mt-1 text-xs text-zinc-500">{ownerName(store.users, item.authorId)} · {formatDate(item.createdAt)}</p></div>)}</div> : <EmptyState title="No notes yet" />}
          </Section>
          <Section title="Tasks"><TaskRows tasks={tasks} prospects={store.prospects} companies={store.companies} users={store.users} onComplete={(task) => store.updateTask(task.id, { status: "completed" })} /></Section>
          <Section title="Deals"><DealTable deals={deals} prospects={store.prospects} companies={store.companies} stages={store.pipelineStages} /></Section>
          <Section title="Activity timeline"><ActivityTimeline activities={activities} users={store.users} /></Section>
        </div>
        <Card className="h-fit">
          <h2 className="font-semibold">Actions</h2>
          <div className="mt-4 grid gap-2">
            <Button type="button" variant="outline" onClick={() => setListOpen(true)}>Add to list</Button>
            <Button type="button" variant="outline" onClick={() => setTaskOpen(true)}>Create task</Button>
            <Button type="button" variant="outline" onClick={() => setDealOpen(true)}>Create deal</Button>
            <Button type="button" variant="outline" onClick={() => setOutreachOpen(true)}>Generate Outreach</Button>
            <Button type="button" variant="danger" onClick={() => { store.deleteProspect(prospect.id); router.push("/app/prospects"); }}>Delete prospect</Button>
          </div>
        </Card>
      </div>

      <Dialog open={listOpen} onOpenChange={setListOpen} title="Add to list">
        <div className="space-y-2">
          {store.lists.map((list) => (
            <Button key={list.id} type="button" variant="outline" className="w-full justify-start" onClick={() => {
              store.updateList(list.id, { prospectIds: Array.from(new Set([...list.prospectIds, prospect.id])) });
              setListOpen(false);
            }}>{list.name}</Button>
          ))}
        </div>
      </Dialog>
      <Dialog open={taskOpen} onOpenChange={setTaskOpen} title="Create task">
        <TaskCreateForm onCreate={(title, dueDate) => {
          store.createTask({ title, description: `Follow-up for ${prospect.fullName}`, status: "todo", priority: "medium", dueDate, assignedTo: prospect.ownerId, prospectId: prospect.id, companyId: prospect.companyId });
          setTaskOpen(false);
        }} />
      </Dialog>
      <Dialog open={dealOpen} onOpenChange={setDealOpen} title="Create deal">
        <DealForm prospects={[prospect]} companies={store.companies} users={store.users} stages={store.pipelineStages} onSubmit={(input) => { store.createDeal({ ...input, name: input.name || toDealCreateName(prospect) }); setDealOpen(false); }} />
      </Dialog>
      <Dialog open={outreachOpen} onOpenChange={setOutreachOpen} title="Generate outreach" description="Demo mode returns labeled sample copy.">
        <div className="mb-4 grid gap-3 sm:grid-cols-2">
          <Select value={outreachForm.channel} onChange={(event) => setOutreachForm({ ...outreachForm, channel: event.target.value as "email" | "linkedin" })}><option value="email">Email</option><option value="linkedin">LinkedIn</option></Select>
          <Select value={outreachForm.tone} onChange={(event) => setOutreachForm({ ...outreachForm, tone: event.target.value as typeof outreachForm.tone })}><option value="professional">Professional</option><option value="friendly">Friendly</option><option value="concise">Concise</option><option value="direct">Direct</option></Select>
          <Button type="button" onClick={async () => {
            const provider = await getAIProvider();
            setOutreach(await provider.generateOutreach({ prospect: prospect as unknown as JsonObject, company: company as unknown as JsonObject, goal: "Book a discovery call", ...outreachForm }));
          }}>Generate copy</Button>
        </div>
        {outreach ? (
          <div className="rounded-xl bg-zinc-50 p-4">
            <p className="font-medium">{outreach.subject}</p>
            <pre className="mt-3 whitespace-pre-wrap text-sm text-zinc-700">{outreach.body}</pre>
            <p className="mt-3 text-sm font-medium">{outreach.callToAction}</p>
            <Button type="button" className="mt-4" variant="outline" onClick={() => navigator.clipboard.writeText(`${outreach.subject}\n\n${outreach.body}\n\n${outreach.callToAction}`)}>Copy</Button>
          </div>
        ) : null}
      </Dialog>
    </>
  );
}

function TaskCreateForm({ onCreate }: { onCreate: (title: string, dueDate: string) => void }) {
  const [title, setTitle] = useState("");
  const [dueDate, setDueDate] = useState("2026-08-11T15:00");
  return (
    <form className="space-y-3" onSubmit={(event) => { event.preventDefault(); if (title.trim()) onCreate(title, new Date(dueDate).toISOString()); }}>
      <Input required placeholder="Task title" value={title} onChange={(event) => setTitle(event.target.value)} />
      <Input required type="datetime-local" value={dueDate} onChange={(event) => setDueDate(event.target.value)} />
      <Button type="submit">Create task</Button>
    </form>
  );
}

export function DiscoverPage() {
  const store = useDemoStore();
  const provider = useMemo(() => new MockProspectProvider(), []);
  const [filters, setFilters] = useState({ query: "", industry: "", location: "" });
  const [results, setResults] = useState<Prospect[]>([]);
  const [loading, setLoading] = useState(false);
  return (
    <>
      <PageHeader title="Discover prospects" description="Search mock provider results and save qualified leads to the demo CRM." />
      <Card className="mb-6">
        <form className="grid gap-3 md:grid-cols-4" onSubmit={async (event) => {
          event.preventDefault();
          setLoading(true);
          try {
            setResults(await provider.searchProspects({ query: filters.query, industries: filters.industry ? [filters.industry] : undefined, locations: filters.location ? [filters.location] : undefined, limit: 20 }));
          } finally {
            setLoading(false);
          }
        }}>
          <Input placeholder="Keyword" value={filters.query} onChange={(event) => setFilters({ ...filters, query: event.target.value })} />
          <Input placeholder="Industry" value={filters.industry} onChange={(event) => setFilters({ ...filters, industry: event.target.value })} />
          <Input placeholder="Location" value={filters.location} onChange={(event) => setFilters({ ...filters, location: event.target.value })} />
          <Button type="submit" disabled={loading}>{loading ? "Searching..." : "Search"}</Button>
        </form>
      </Card>
      <div className="grid gap-4">
        {results.length === 0 ? <EmptyState title="No search results yet" description="Run a search against the mock prospect provider." /> : results.map((result) => {
          const company = result.company;
          const saved = store.prospects.some((prospect) => prospect.email === result.email);
          return (
            <Card key={result.id}>
              <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div>
                  <h2 className="font-semibold">{result.firstName} {result.lastName}</h2>
                  <p className="text-sm text-zinc-500">{result.title} · {company?.name} · {result.location}</p>
                  <div className="mt-2 flex gap-2"><Badge>{result.source}</Badge><Badge variant="warning">{result.temperature}</Badge></div>
                </div>
                <Button type="button" disabled={saved} onClick={() => {
                  let demoCompany = store.companies.find((candidate) => candidate.domain === company?.domain || candidate.name === company?.name);
                  if (!demoCompany && company) {
                    demoCompany = store.createCompany({
                      name: company.name,
                      domain: company.domain ?? `${company.name.toLowerCase().replace(/\s+/g, "")}.example`,
                      website: company.website ?? "",
                      industry: company.industry ?? "Unknown",
                      description: company.description ?? "Imported from mock discovery.",
                      employeeCount: company.employeeCount ?? 0,
                      revenue: company.annualRevenue ?? 0,
                      country: company.country ?? "",
                      state: company.region ?? "",
                      city: company.city ?? "",
                      technologies: company.technologies ?? [],
                      foundedYear: 2020,
                      source: "Mock provider",
                    });
                  }
                  store.createProspect({
                    firstName: result.firstName,
                    lastName: result.lastName,
                    jobTitle: result.title ?? "Unknown",
                    seniority: result.seniority ?? "Unknown",
                    department: result.department ?? "Unknown",
                    email: result.email ?? "",
                    phone: result.phone ?? "",
                    city: company?.city ?? "",
                    country: company?.country ?? "",
                    industry: company?.industry ?? "Unknown",
                    source: "Mock provider",
                    status: "new",
                    ownerId: store.users[0]?.id ?? "user-admin",
                    companyId: demoCompany?.id ?? store.companies[0]?.id ?? "",
                    tagIds: [],
                  });
                }}>{saved ? "Saved" : "Save to CRM"}</Button>
              </div>
            </Card>
          );
        })}
      </div>
    </>
  );
}

export function ImportPage() {
  const store = useDemoStore();
  const [rows, setRows] = useState<CsvRow[]>([]);
  const [fileLabel, setFileLabel] = useState<string | null>(null);
  const mapping = useMemo(() => suggestColumnMapping(Object.keys(rows[0] ?? {})), [rows]);
  const evaluation = useMemo(() => evaluateImportRows(rows, mapping, store.prospects.map((prospect) => ({ id: prospect.id, email: prospect.email, phone: prospect.phone, firstName: prospect.firstName, lastName: prospect.lastName }))), [mapping, rows, store.prospects]);
  const validRows = evaluation.rows.filter((row) => row.status === "valid");

  async function loadSpreadsheet(file: File) {
    setFileLabel(file.name);
    const lower = file.name.toLowerCase();
    if (lower.endsWith(".xlsx") || lower.endsWith(".xls")) {
      const XLSX = await import("xlsx");
      const buffer = await file.arrayBuffer();
      const workbook = XLSX.read(buffer, { type: "array" });
      const sheetName = workbook.SheetNames[0];
      if (!sheetName) {
        setRows([]);
        return;
      }
      const sheet = workbook.Sheets[sheetName];
      const json = XLSX.utils.sheet_to_json<CsvRow>(sheet, { defval: "" });
      setRows(json);
      return;
    }

    Papa.parse<CsvRow>(file, {
      header: true,
      skipEmptyLines: true,
      complete: (result) => setRows(result.data),
    });
  }

  return (
    <>
      <PageHeader title="Import prospects" description="Upload CSV or Excel (.xlsx), validate rows, and import valid prospects." />
      <Card className="mb-6 space-y-3">
        <Input
          type="file"
          accept=".csv,.xlsx,.xls,text/csv,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,application/vnd.ms-excel"
          onChange={(event) => {
            const file = event.target.files?.[0];
            if (!file) return;
            void loadSpreadsheet(file);
          }}
        />
        <p className="text-sm text-zinc-500">
          Excel upload supported. Map columns automatically, review duplicates, then import. {fileLabel ? `Loaded: ${fileLabel}` : null}
        </p>
      </Card>
      {rows.length === 0 ? <EmptyState title="No file loaded" description="Choose a CSV or Excel file with name, email, title, company, industry, and location columns." /> : (
        <div className="space-y-6">
          <div className="grid gap-4 md:grid-cols-4">
            <MetricCard label="Rows" value={evaluation.summary.totalRows} />
            <MetricCard label="Valid" value={evaluation.summary.validRows} />
            <MetricCard label="Duplicates" value={evaluation.summary.duplicateRows} />
            <MetricCard label="Invalid" value={evaluation.summary.invalidRows} />
          </div>
          <Card>
            <div className="mb-4 flex items-center justify-between">
              <h2 className="font-semibold">Preview</h2>
              <Button type="button" disabled={validRows.length === 0} onClick={() => {
                const createdInputs = validRows.map((row) => importRowToProspect(row.data, store.companies[0]?.id ?? "", store.users[0]?.id ?? "user-admin"));
                store.importProspects(createdInputs);
                setRows([]);
              }}>Import {validRows.length} prospects</Button>
            </div>
            <div className="space-y-2">
              {evaluation.rows.slice(0, 12).map((row) => (
                <div key={row.rowNumber} className="rounded-xl border border-zinc-100 p-3 text-sm">
                  <div className="flex items-center justify-between"><span>{row.data.fullName ?? `${row.data.firstName ?? ""} ${row.data.lastName ?? ""}`}</span><Badge variant={row.status === "valid" ? "success" : row.status === "duplicate" ? "warning" : "danger"}>{row.status}</Badge></div>
                  {[...row.errors, ...row.warnings].length ? <p className="mt-1 text-xs text-zinc-500">{[...row.errors, ...row.warnings].join(" ")}</p> : null}
                </div>
              ))}
            </div>
          </Card>
        </div>
      )}
    </>
  );
}

function importRowToProspect(data: ImportProspectData, companyId: string, ownerId: string) {
  const name = data.fullName?.split(/\s+/) ?? [];
  return {
    firstName: data.firstName ?? name[0] ?? "Imported",
    lastName: data.lastName ?? (name.slice(1).join(" ") || "Prospect"),
    jobTitle: data.title ?? "Unknown",
    seniority: "Unknown",
    department: "Unknown",
    email: data.email ?? "",
    phone: data.phone ?? "",
    city: data.location ?? "",
    country: "",
    industry: data.industry ?? "Unknown",
    source: data.source ?? "CSV",
    status: "new" as DemoProspectStatus,
    ownerId,
    companyId,
    tagIds: [],
  };
}

export function CompaniesPage() {
  const store = useDemoStore();
  const [query, setQuery] = useState("");
  const rows = store.companies.filter((company) => [company.name, company.domain, company.industry, company.city].join(" ").toLowerCase().includes(query.toLowerCase()));
  return (
    <>
      <PageHeader title="Companies" description="Accounts in the demo workspace." />
      <Card className="mb-4"><Input placeholder="Search companies" value={query} onChange={(event) => setQuery(event.target.value)} /></Card>
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {rows.map((company) => (
          <Link key={company.id} href={`/app/companies/${company.id}`} className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm hover:border-zinc-300">
            <h2 className="font-semibold">{company.name}</h2>
            <p className="text-sm text-zinc-500">{company.industry} · {company.city}, {company.country}</p>
            <div className="mt-4 grid grid-cols-2 gap-3 text-sm"><span>{company.employeeCount} employees</span><span>{formatCurrency(company.revenue)}</span></div>
          </Link>
        ))}
      </div>
    </>
  );
}

export function CompanyDetailPage() {
  const params = useParams<{ id: string }>();
  const store = useDemoStore();
  const company = store.companies.find((candidate) => candidate.id === params.id);
  if (!company) return <EmptyState title="Company not found" action={<ActionLink href="/app/companies">Back to companies</ActionLink>} />;
  const prospects = store.prospects.filter((prospect) => prospect.companyId === company.id);
  const deals = store.deals.filter((deal) => deal.companyId === company.id);
  const activities = store.activities.filter((activity) => activity.companyId === company.id);
  return (
    <>
      <PageHeader title={company.name} description={company.description} actions={<a className="inline-flex h-10 items-center rounded-lg border border-zinc-200 px-4 text-sm" href={company.website} target="_blank" rel="noreferrer">Website</a>} />
      <div className="grid gap-6 xl:grid-cols-3">
        <MetricCard label="Prospects" value={prospects.length} />
        <MetricCard label="Pipeline" value={dealValue(deals.filter((deal) => deal.status === "open"))} />
        <MetricCard label="Revenue" value={formatCurrency(company.revenue)} />
      </div>
      <div className="mt-6 grid gap-6 xl:grid-cols-2">
        <Section title="Prospects"><ProspectTable prospects={prospects} companies={store.companies} users={store.users} /></Section>
        <Section title="Deals"><DealTable deals={deals} prospects={store.prospects} companies={store.companies} stages={store.pipelineStages} /></Section>
        <Section title="Activity"><ActivityTimeline activities={activities.slice(0, 10)} users={store.users} /></Section>
        <Section title="Company details">
          <div className="space-y-2 text-sm">
            <p><strong>Domain:</strong> {company.domain}</p>
            <p><strong>Industry:</strong> {company.industry}</p>
            <p><strong>Employees:</strong> {company.employeeCount}</p>
            <p><strong>Technologies:</strong> {company.technologies.join(", ")}</p>
          </div>
        </Section>
      </div>
    </>
  );
}

export function ListsPage() {
  const store = useDemoStore();
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  return (
    <>
      <PageHeader title="Lists" description="Saved prospect views and segments." actions={<Button type="button" onClick={() => setOpen(true)}>Create list</Button>} />
      <Card><ListsTable lists={store.lists} prospects={store.prospects} users={store.users} /></Card>
      <Dialog open={open} onOpenChange={setOpen} title="Create list">
        <form className="space-y-3" onSubmit={(event) => { event.preventDefault(); if (!name.trim()) return; store.createList({ name, description: "Custom demo list", prospectIds: [], createdBy: store.session?.userId ?? store.users[0]?.id ?? "user-admin" }); setName(""); setOpen(false); }}>
          <Input required placeholder="List name" value={name} onChange={(event) => setName(event.target.value)} />
          <Button type="submit">Create list</Button>
        </form>
      </Dialog>
    </>
  );
}

export function ListDetailPage() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const store = useDemoStore();
  const list = store.lists.find((candidate) => candidate.id === params.id);
  if (!list) return <EmptyState title="List not found" action={<ActionLink href="/app/lists">Back to lists</ActionLink>} />;
  const members = listActiveProspects(list, store.prospects);
  return (
    <>
      <PageHeader title={list.name} description={list.description} actions={<Button type="button" variant="danger" onClick={() => { store.deleteList(list.id); router.push("/app/lists"); }}>Archive list</Button>} />
      <div className="grid gap-6 xl:grid-cols-[1fr_380px]">
        <Section title="Members"><ProspectTable prospects={members} companies={store.companies} users={store.users} /></Section>
        <Section title="Add or remove members" description="Checked prospects are included in this list.">
          <div className="max-h-[640px] space-y-2 overflow-y-auto">
            {store.prospects.map((prospect) => {
              const checked = list.prospectIds.includes(prospect.id);
              return (
                <label key={prospect.id} className="flex cursor-pointer items-center gap-3 rounded-xl border border-zinc-100 p-3 text-sm">
                  <input type="checkbox" checked={checked} onChange={(event) => {
                    store.updateList(list.id, {
                      prospectIds: event.target.checked ? [...list.prospectIds, prospect.id] : list.prospectIds.filter((id) => id !== prospect.id),
                    });
                  }} />
                  <span>{prospect.fullName}</span>
                </label>
              );
            })}
          </div>
        </Section>
      </div>
    </>
  );
}

export function PipelinePage() {
  const store = useDemoStore();
  const [createOpen, setCreateOpen] = useState(false);
  const stages = [...store.pipelineStages].sort((left, right) => left.order - right.order);
  const onDragEnd = (event: DragEndEvent) => {
    if (!event.over?.id) return;
    store.moveDealStage(String(event.active.id), String(event.over.id));
  };
  return (
    <>
      <PageHeader title="Pipeline" description="Drag deals between stages to update probability and status." actions={<Button type="button" onClick={() => setCreateOpen(true)}>Create deal</Button>} />
      <DndContext onDragEnd={onDragEnd}>
        <div className="grid gap-4 overflow-x-auto xl:grid-cols-5">
          {stages.map((stage) => (
            <PipelineStage key={stage.id} id={stage.id} name={stage.name} deals={store.deals.filter((deal) => deal.stageId === stage.id)} prospects={store.prospects} />
          ))}
        </div>
      </DndContext>
      <Dialog open={createOpen} onOpenChange={setCreateOpen} title="Create deal">
        <DealForm prospects={store.prospects} companies={store.companies} users={store.users} stages={store.pipelineStages} onSubmit={(input) => { store.createDeal(input); setCreateOpen(false); }} />
      </Dialog>
    </>
  );
}

function PipelineStage({ id, name, deals, prospects }: { id: string; name: string; deals: DemoDeal[]; prospects: DemoProspect[] }) {
  const { setNodeRef, isOver } = useDroppable({ id });
  return (
    <div ref={setNodeRef} className={cn("min-h-64 rounded-2xl border border-zinc-200 bg-zinc-50 p-3", isOver && "ring-2 ring-zinc-900")}>
      <div className="mb-3 flex items-center justify-between"><h2 className="font-semibold">{name}</h2><Badge>{deals.length}</Badge></div>
      <div className="space-y-3">
        {deals.map((deal) => <DealCard key={deal.id} deal={deal} prospect={prospects.find((prospect) => prospect.id === deal.prospectId)} />)}
      </div>
    </div>
  );
}

function DealCard({ deal, prospect }: { deal: DemoDeal; prospect?: DemoProspect }) {
  const { attributes, listeners, setNodeRef, transform } = useDraggable({ id: deal.id });
  return (
    <div ref={setNodeRef} style={{ transform: transform ? `translate3d(${transform.x}px, ${transform.y}px, 0)` : undefined }} {...listeners} {...attributes} className="cursor-grab rounded-xl border border-zinc-200 bg-white p-3 shadow-sm">
      <Link href={`/app/deals/${deal.id}`} className="font-medium hover:underline">{deal.name}</Link>
      <p className="mt-1 text-sm text-zinc-500">{prospect?.fullName}</p>
      <p className="mt-2 text-sm font-semibold">{formatCurrency(deal.value, deal.currency)}</p>
    </div>
  );
}

export function NewDealPage() {
  const router = useRouter();
  const store = useDemoStore();
  return (
    <>
      <PageHeader title="New deal" description="Create an opportunity in the demo pipeline." />
      <Card><DealForm prospects={store.prospects} companies={store.companies} users={store.users} stages={store.pipelineStages} onSubmit={(input) => { const deal = store.createDeal(input); router.push(`/app/deals/${deal.id}`); }} /></Card>
    </>
  );
}

export function DealDetailPage() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const store = useDemoStore();
  const deal = store.deals.find((candidate) => candidate.id === params.id);
  if (!deal) return <EmptyState title="Deal not found" action={<ActionLink href="/app/pipeline">Back to pipeline</ActionLink>} />;
  const prospect = store.prospects.find((candidate) => candidate.id === deal.prospectId);
  const activities = store.activities.filter((activity) => activity.dealId === deal.id);
  return (
    <>
      <PageHeader title={deal.name} description={`${companyName(store.companies, deal.companyId)} · ${formatCurrency(deal.value, deal.currency)}`} actions={<Button type="button" variant="danger" onClick={() => { store.deleteDeal(deal.id); router.push("/app/pipeline"); }}>Delete</Button>} />
      <div className="grid gap-6 xl:grid-cols-3">
        <MetricCard label="Value" value={formatCurrency(deal.value, deal.currency)} />
        <MetricCard label="Probability" value={`${deal.probability}%`} />
        <MetricCard label="Expected close" value={formatDate(deal.expectedCloseDate)} />
      </div>
      <div className="mt-6 grid gap-6 xl:grid-cols-2">
        <Section title="Deal details">
          <div className="grid gap-4 text-sm">
            <p><strong>Prospect:</strong> {prospect ? <Link className="hover:underline" href={`/app/prospects/${prospect.id}`}>{prospect.fullName}</Link> : "Unknown"}</p>
            <p><strong>Company:</strong> <Link className="hover:underline" href={`/app/companies/${deal.companyId}`}>{companyName(store.companies, deal.companyId)}</Link></p>
            <p><strong>Stage:</strong> <Select value={deal.stageId} onChange={(event) => store.moveDealStage(deal.id, event.target.value)}>{store.pipelineStages.map((stage) => <option key={stage.id} value={stage.id}>{stage.name}</option>)}</Select></p>
            <p><strong>Status:</strong> <Badge>{deal.status}</Badge></p>
          </div>
        </Section>
        <Section title="Activity"><ActivityTimeline activities={activities} users={store.users} /></Section>
      </div>
    </>
  );
}

export function TasksPage() {
  const store = useDemoStore();
  const [tab, setTab] = useState("today");
  const [open, setOpen] = useState(false);
  const filtered = store.tasks.filter((task) =>
    tab === "today" ? task.status !== "completed" && isToday(task.dueDate) :
    tab === "upcoming" ? task.status !== "completed" && !isToday(task.dueDate) && !isOverdueTask(task) :
    tab === "overdue" ? isOverdueTask(task) :
    task.status === "completed"
  );
  return (
    <>
      <PageHeader title="Tasks" description="Manage rep follow-ups and reminders." actions={<Button type="button" onClick={() => setOpen(true)}>Create task</Button>} />
      <Card>
        <Tabs tabs={[{ value: "today", label: "Today" }, { value: "upcoming", label: "Upcoming" }, { value: "overdue", label: "Overdue" }, { value: "completed", label: "Completed" }]} value={tab} onValueChange={setTab} />
        <div className="mt-4"><TaskRows tasks={filtered} prospects={store.prospects} companies={store.companies} users={store.users} onComplete={(task) => store.updateTask(task.id, { status: "completed" })} /></div>
      </Card>
      <Dialog open={open} onOpenChange={setOpen} title="Create task">
        <TaskCreateForm onCreate={(title, dueDate) => { store.createTask({ title, description: "Manual task", status: "todo", priority: "medium", dueDate, assignedTo: store.users[0]?.id ?? "user-admin" }); setOpen(false); }} />
      </Dialog>
    </>
  );
}

export function AnalyticsPage() {
  const store = useDemoStore();
  const [range, setRange] = useState<DemoDateRangePreset>("30d");
  const analytics = store.getAnalytics(range);
  return (
    <>
      <PageHeader title="Analytics" description="Pipeline, prospect, and activity analytics." actions={(["7d", "30d", "90d"] as DemoDateRangePreset[]).map((value) => <Button key={value} type="button" size="sm" variant={range === value ? "primary" : "outline"} onClick={() => setRange(value)}>{value}</Button>)} />
      <div className="grid gap-4 md:grid-cols-3">
        <MetricCard label="Pipeline" value={formatCurrency(analytics.pipelineValue)} />
        <MetricCard label="Won" value={formatCurrency(analytics.wonDealsValue)} />
        <MetricCard label="Task completion" value={`${analytics.taskCompletionRate}%`} />
      </div>
      <div className="mt-6 grid gap-6 xl:grid-cols-2">
        <ChartCard title="Sources" data={toChartRows(analytics.prospectsBySource)} />
        <ChartCard title="Lead scores" data={toChartRows(analytics.leadScoreBuckets)} />
        <ChartCard title="Deals by stage" data={Object.entries(analytics.dealsByStage).map(([name, value]) => ({ name, value: value.value }))} />
        <Section title="Temperature">
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart><Pie data={toChartRows(analytics.prospectsByTemperature)} dataKey="value" nameKey="name">{toChartRows(analytics.prospectsByTemperature).map((_, index) => <Cell key={index} fill={colors[index % colors.length]} />)}</Pie><Tooltip /></PieChart>
            </ResponsiveContainer>
          </div>
        </Section>
      </div>
    </>
  );
}

function ChartCard({ title, data }: { title: string; data: Array<{ name: string; value: number }> }) {
  return (
    <Section title={title}>
      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="name" hide /><YAxis /><Tooltip /><Bar dataKey="value" fill="#18181b" /></BarChart>
        </ResponsiveContainer>
      </div>
    </Section>
  );
}

export function AiPage() {
  const store = useDemoStore();
  const [messages, setMessages] = useState<Array<{ role: "user" | "assistant"; content: string }>>([
    { role: "assistant", content: "Ask about hot leads, overdue tasks, or pipeline focus." },
  ]);
  const [input, setInput] = useState("");
  const hotLeads = store.prospects.filter((prospect) => prospect.leadTemperature === "hot").length;
  const overdueTasks = store.tasks.filter((task) => isOverdueTask(task)).length;
  return (
    <>
      <PageHeader title="AI assistant" description="Demo chat assistant with workspace context." />
      <Card>
        <div className="mb-4 grid gap-3 md:grid-cols-3"><MetricCard label="Prospects" value={store.prospects.length} /><MetricCard label="Hot leads" value={hotLeads} /><MetricCard label="Overdue tasks" value={overdueTasks} /></div>
        <div className="h-[460px] overflow-y-auto rounded-2xl bg-zinc-50 p-4">
          {messages.map((message, index) => <div key={index} className={cn("mb-3 max-w-[80%] rounded-2xl p-3 text-sm", message.role === "user" ? "ml-auto bg-zinc-950 text-white" : "bg-white text-zinc-700")}>{message.content}</div>)}
        </div>
        <form className="mt-4 flex gap-2" onSubmit={async (event) => {
          event.preventDefault();
          if (!input.trim()) return;
          const next = [...messages, { role: "user" as const, content: input }];
          setMessages(next);
          setInput("");
          const provider = await getAIProvider();
          const response = await provider.chatAssistant({ messages: next, context: { prospectCount: store.prospects.length, hotLeads, overdueTasks, openDeals: store.deals.filter((deal) => deal.status === "open").length } });
          setMessages([...next, { role: "assistant", content: `${response.message}\n\nSuggested: ${response.suggestedActions.join(", ")}` }]);
        }}>
          <Input value={input} onChange={(event) => setInput(event.target.value)} placeholder="Ask the assistant..." />
          <Button type="submit">Send</Button>
        </form>
      </Card>
    </>
  );
}

export function AutomationsPage() {
  const store = useDemoStore();
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const automationDescription = (description: string, name: string) =>
    name === "Route high intent leads"
      ? `${description} Welcome messages for new leads use the WhatsApp provider welcome template and require a configured provider before sending.`
      : description;
  return (
    <>
      <PageHeader title="Automations" description="Create and toggle CRM workflows." actions={<Button type="button" onClick={() => setOpen(true)}>Create automation</Button>} />
      <div className="grid gap-4">
        {store.automations.map((automation) => (
          <Card key={automation.id}>
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div><h2 className="font-semibold">{automation.name}</h2><p className="text-sm text-zinc-500">{automationDescription(automation.description, automation.name)}</p><p className="mt-2 text-xs text-zinc-500">When {automation.trigger}: {automation.actions.join(", ")}</p></div>
              <Button type="button" variant={automation.enabled ? "primary" : "outline"} onClick={() => store.updateAutomation(automation.id, { enabled: !automation.enabled })}>{automation.enabled ? "Enabled" : "Disabled"}</Button>
            </div>
          </Card>
        ))}
      </div>
      <Dialog open={open} onOpenChange={setOpen} title="Create automation">
        <form className="space-y-3" onSubmit={(event) => { event.preventDefault(); if (!name.trim()) return; store.createAutomation({ name, description: "Custom demo automation", enabled: true, trigger: "Prospect created", conditions: ["leadScore > 70"], actions: ["Create task"], createdBy: store.users[0]?.id ?? "user-admin" }); setName(""); setOpen(false); }}>
          <Input required placeholder="Automation name" value={name} onChange={(event) => setName(event.target.value)} />
          <Button type="submit">Create automation</Button>
        </form>
      </Dialog>
    </>
  );
}

export function InboxPage() {
  const store = useDemoStore();
  const [tab, setTab] = useState("email");
  const typeMap: Record<string, string[]> = { email: ["emailed"], whatsapp: [], calls: ["called"], tasks: ["task"] };
  const activities = store.activities.filter((activity) => typeMap[tab]?.includes(activity.type));
  return (
    <>
      <PageHeader title="Inbox" description="Communication and workstream activity." />
      <Card>
        <Tabs tabs={[{ value: "email", label: "Email" }, { value: "whatsapp", label: "WhatsApp" }, { value: "calls", label: "Calls" }, { value: "tasks", label: "Tasks" }]} value={tab} onValueChange={setTab} />
        <div className="mt-4"><ActivityTimeline activities={activities} users={store.users} empty={`No ${tab} activity yet.`} /></div>
      </Card>
    </>
  );
}

export function IntegrationsPage() {
  const statuses = getClientIntegrationStatuses();
  return (
    <>
      <PageHeader title="Integrations" description="Client-safe status only; no secret values are exposed." />
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {Object.entries(statuses).map(([key, status]) => (
          <Card key={key}><div className="flex items-center justify-between"><h2 className="font-semibold">{status.label}</h2><Badge variant={status.configured ? "success" : "warning"}>{status.configured ? "Configured" : "Demo"}</Badge></div><p className="mt-3 text-sm text-zinc-500">{status.detail}</p></Card>
        ))}
      </div>
    </>
  );
}

export function TeamPage() {
  const store = useDemoStore();
  return (
    <>
      <PageHeader title="Team" description="Demo workspace users and roles." />
      <div className="grid gap-4 md:grid-cols-2">
        {store.users.map((user) => (
          <Card key={user.id}><div className="flex items-center gap-3"><span className="flex h-10 w-10 items-center justify-center rounded-full bg-zinc-900 text-sm font-semibold text-white">{initials(user.name)}</span><div><h2 className="font-semibold">{user.name}</h2><p className="text-sm text-zinc-500">{user.email} · {user.title}</p></div><Badge className="ml-auto">{user.role}</Badge></div></Card>
        ))}
      </div>
    </>
  );
}

export function SettingsPage() {
  const store = useDemoStore();
  const user = store.session ? store.users.find((candidate) => candidate.id === store.session?.userId) : store.users[0];
  const [theme, setTheme] = useState("system");
  return (
    <>
      <PageHeader title="Settings" description="Profile, workspace, demo data, and scoring configuration." />
      <div className="grid gap-6 xl:grid-cols-2">
        <Section title="Profile"><div className="space-y-3"><Input value={user?.name ?? ""} readOnly /><Input value={user?.email ?? ""} readOnly /><Badge>{user?.role}</Badge></div></Section>
        <Section title="Workspace"><div className="space-y-2 text-sm"><p><strong>Name:</strong> {store.organization.name}</p><p><strong>Plan:</strong> {store.subscription.plan}</p><p><strong>Usage:</strong> {store.subscription.usage.prospects}/{store.subscription.limits.prospects} prospects</p></div></Section>
        <Section title="Theme"><Select value={theme} onChange={(event) => setTheme(event.target.value)}><option value="system">System</option><option value="light">Light</option><option value="dark">Dark</option></Select><p className="mt-2 text-sm text-zinc-500">Selection is stored for this session UI only.</p></Section>
        <Section title="Reset demo data"><p className="mb-3 text-sm text-zinc-500">Restore the original seeded demo CRM data in local storage.</p><Button type="button" variant="danger" onClick={() => store.resetDemo()}>Reset demo data</Button></Section>
        <Section title="Scoring explanation"><ul className="list-disc space-y-2 pl-5 text-sm text-zinc-600"><li>Decision maker titles, seniority, and high-intent tags raise scores.</li><li>ICP-fit industries, regions, and company sizes improve fit.</li><li>Hot, warm, and cold temperatures are derived from the store scorer.</li></ul></Section>
      </div>
    </>
  );
}

export function BillingPage() {
  const [message, setMessage] = useState("");
  const plans: Array<{ tier: PlanTier; price: string; features: string[] }> = [
    { tier: "FREE" as PlanTier, price: "$0", features: ["Demo CRM", "250 prospects", "Basic analytics"] },
    { tier: "PRO" as PlanTier, price: "$49", features: ["More prospects", "AI workflows", "Exports"] },
    { tier: "TEAM" as PlanTier, price: "$149", features: ["Seats", "Team pipeline", "Automations"] },
    { tier: "BUSINESS" as PlanTier, price: "Custom", features: ["Scale limits", "Priority support", "Security review"] },
  ];
  return (
    <>
      <PageHeader title="Billing" description="Stripe-ready checkout. Demo mode never fakes payment success." />
      {message ? <Card className="mb-4"><Badge variant="warning">DEMO CHECKOUT</Badge><p className="mt-2 text-sm text-zinc-600">{message}</p></Card> : null}
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {plans.map((plan) => (
          <Card key={plan.tier}>
            <h2 className="font-semibold">{plan.tier}</h2><p className="mt-2 text-3xl font-semibold">{plan.price}</p>
            <ul className="my-4 space-y-2 text-sm text-zinc-600">{plan.features.map((feature) => <li key={feature}>- {feature}</li>)}</ul>
            <Button type="button" className="w-full" onClick={async () => {
              const provider = await getBillingProvider();
              const session = await provider.createCheckoutSession({ priceId: `price_demo_${plan.tier.toLowerCase()}`, planTier: plan.tier, successUrl: "/app/billing?status=success", cancelUrl: "/app/billing?status=cancelled" });
              setMessage(session.provider === "demo" ? `Demo checkout requires Stripe configuration before payment can be completed. Checkout reference: ${session.id}.` : `Checkout session created: ${session.url}`);
            }}>{plan.tier === "FREE" ? "Current demo plan" : "Start checkout"}</Button>
          </Card>
        ))}
      </div>
    </>
  );
}

export function SearchPage() {
  const store = useDemoStore();
  const [query, setQuery] = useState("");
  const results = store.search(query);
  return (
    <>
      <PageHeader title="Search" description="Global CRM search across demo store records." />
      <Card className="mb-6"><Input placeholder="Search anything..." value={query} onChange={(event) => setQuery(event.target.value)} /></Card>
      <div className="grid gap-6 xl:grid-cols-2">
        <Section title={`Prospects (${results.prospects.length})`}><ProspectTable prospects={results.prospects.slice(0, 10)} companies={store.companies} users={store.users} /></Section>
        <Section title={`Companies (${results.companies.length})`}>{results.companies.length ? <div className="space-y-2">{results.companies.slice(0, 10).map((company) => <Link key={company.id} className="block rounded-xl border border-zinc-100 p-3 hover:border-zinc-300" href={`/app/companies/${company.id}`}>{company.name}</Link>)}</div> : <EmptyState title="No companies" />}</Section>
        <Section title={`Deals (${results.deals.length})`}><DealTable deals={results.deals.slice(0, 10)} prospects={store.prospects} companies={store.companies} stages={store.pipelineStages} /></Section>
        <Section title={`Lists (${results.lists.length})`}><ListsTable lists={results.lists.slice(0, 10)} prospects={store.prospects} users={store.users} /></Section>
      </div>
    </>
  );
}
