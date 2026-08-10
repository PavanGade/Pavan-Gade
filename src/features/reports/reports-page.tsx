"use client";

import { format, getHours, isSameDay, subDays } from "date-fns";
import { useMemo, useState } from "react";
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { Badge, Card, EmptyState, PageHeader, Select, Table, Tabs } from "@/components/ui/primitives";
import type { DemoDeal, DemoProspect, DemoTask, DemoUserProfile } from "@/lib/demo/types";
import { formatCurrency } from "@/lib/format";
import { useDemoStore } from "@/stores/demo-store";

type ReportTab = "hourly" | "daily" | "leaderboard" | "sales" | "agents" | "custom";
type CustomMetric = "prospects" | "deals" | "tasks";
type CustomGroup = "status" | "owner" | "source";

const tabs = [
  { value: "hourly", label: "Hourly" },
  { value: "daily", label: "Daily" },
  { value: "leaderboard", label: "Leaderboard" },
  { value: "sales", label: "Sales" },
  { value: "agents", label: "Agents" },
  { value: "custom", label: "Custom" },
];

export function ReportsPage() {
  const store = useDemoStore();
  const [tab, setTab] = useState<ReportTab>("hourly");

  return (
    <>
      <PageHeader title="Reports" description="TeleCRM-style activity, sales, and agent performance reporting." />
      <Card>
        <Tabs tabs={tabs} value={tab} onValueChange={(value) => setTab(value as ReportTab)} />
      </Card>
      <div className="mt-6">
        {tab === "hourly" ? <HourlyReport activities={store.activities} tasks={store.tasks} /> : null}
        {tab === "daily" ? <DailyReport store={store} /> : null}
        {tab === "leaderboard" ? <LeaderboardReport store={store} /> : null}
        {tab === "sales" ? <SalesReport store={store} /> : null}
        {tab === "agents" ? <AgentsReport store={store} /> : null}
        {tab === "custom" ? <CustomReport store={store} /> : null}
      </div>
    </>
  );
}

function HourlyReport({
  activities,
  tasks,
}: {
  activities: ReturnType<typeof useDemoStore.getState>["activities"];
  tasks: DemoTask[];
}) {
  const rows = useMemo(
    () =>
      Array.from({ length: 24 }, (_, hour) => ({
        hour: `${String(hour).padStart(2, "0")}:00`,
        activities: activities.filter((activity) => getHours(new Date(activity.createdAt)) === hour).length,
        tasks: tasks.filter((task) => getHours(new Date(task.dueDate)) === hour).length,
      })),
    [activities, tasks],
  );

  return (
    <Card>
      <h2 className="font-semibold">Activities and tasks by hour</h2>
      <div className="mt-4 h-96">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={rows}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="hour" interval={2} />
            <YAxis allowDecimals={false} />
            <Tooltip />
            <Bar dataKey="activities" fill="#18181b" />
            <Bar dataKey="tasks" fill="#a1a1aa" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
}

function DailyReport({ store }: { store: ReturnType<typeof useDemoStore.getState> }) {
  const now = new Date();
  const rows = Array.from({ length: 14 }, (_, index) => {
    const date = subDays(now, 13 - index);
    const activities = store.activities.filter((activity) => isSameDay(new Date(activity.createdAt), date));
    const sales = store.deals
      .filter((deal) => deal.status === "won" && isSameDay(new Date(deal.updatedAt ?? deal.createdAt), date))
      .reduce((sum, deal) => sum + deal.value, 0);

    return {
      date: format(date, "MMM d"),
      calls: activities.filter((activity) => activity.type === "called").length,
      activities: activities.length,
      sales,
    };
  });

  return (
    <Card>
      <h2 className="font-semibold">Last 14 days</h2>
      <Table className="mt-4">
        <thead>
          <tr className="border-b border-zinc-100 text-left text-xs uppercase text-zinc-500">
            <th className="py-3 pr-3">Day</th>
            <th className="py-3 pr-3">Calls</th>
            <th className="py-3 pr-3">Activities</th>
            <th className="py-3">Sales</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.date} className="border-b border-zinc-100">
              <td className="py-3 pr-3 font-medium">{row.date}</td>
              <td className="py-3 pr-3">{row.calls}</td>
              <td className="py-3 pr-3">{row.activities}</td>
              <td className="py-3">{formatCurrency(row.sales)}</td>
            </tr>
          ))}
        </tbody>
      </Table>
    </Card>
  );
}

function LeaderboardReport({ store }: { store: ReturnType<typeof useDemoStore.getState> }) {
  const rows = store.users
    .map((user) => {
      const wonValue = store.deals.filter((deal) => deal.ownerId === user.id && deal.status === "won").reduce((sum, deal) => sum + deal.value, 0);
      const completedTasks = store.tasks.filter((task) => task.assignedTo === user.id && task.status === "completed").length;
      const ownedProspects = store.prospects.filter((prospect) => prospect.ownerId === user.id).length;
      return { user, wonValue, completedTasks, ownedProspects, score: wonValue + completedTasks * 1000 + ownedProspects * 500 };
    })
    .sort((left, right) => right.score - left.score);

  return (
    <Card>
      <h2 className="font-semibold">Leaderboard</h2>
      <Table className="mt-4">
        <thead>
          <tr className="border-b border-zinc-100 text-left text-xs uppercase text-zinc-500">
            <th className="py-3 pr-3">Rank</th>
            <th className="py-3 pr-3">Agent</th>
            <th className="py-3 pr-3">Won value</th>
            <th className="py-3 pr-3">Completed tasks</th>
            <th className="py-3">Owned prospects</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row, index) => (
            <tr key={row.user.id} className="border-b border-zinc-100">
              <td className="py-3 pr-3"><Badge>{index + 1}</Badge></td>
              <td className="py-3 pr-3 font-medium">{row.user.name}</td>
              <td className="py-3 pr-3">{formatCurrency(row.wonValue)}</td>
              <td className="py-3 pr-3">{row.completedTasks}</td>
              <td className="py-3">{row.ownedProspects}</td>
            </tr>
          ))}
        </tbody>
      </Table>
    </Card>
  );
}

function SalesReport({ store }: { store: ReturnType<typeof useDemoStore.getState> }) {
  const rows = store.pipelineStages
    .map((stage) => {
      const deals = store.deals.filter((deal) => deal.stageId === stage.id);
      return { name: stage.name, count: deals.length, value: deals.reduce((sum, deal) => sum + deal.value, 0) };
    })
    .sort((left, right) => right.value - left.value);
  const pipeline = store.deals.filter((deal) => deal.status === "open").reduce((sum, deal) => sum + deal.value, 0);
  const won = store.deals.filter((deal) => deal.status === "won").reduce((sum, deal) => sum + deal.value, 0);

  return (
    <div className="grid gap-6 xl:grid-cols-3">
      <MetricCard label="Pipeline value" value={formatCurrency(pipeline)} />
      <MetricCard label="Won revenue" value={formatCurrency(won)} />
      <MetricCard label="Open deals" value={store.deals.filter((deal) => deal.status === "open").length} />
      <Card className="xl:col-span-2">
        <h2 className="font-semibold">Deals by stage</h2>
        <div className="mt-4 h-80">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={rows}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" hide />
              <YAxis />
              <Tooltip formatter={(value) => formatCurrency(Number(value))} />
              <Bar dataKey="value" fill="#18181b" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </Card>
      <Card>
        <Table>
          <thead><tr className="border-b border-zinc-100 text-left text-xs uppercase text-zinc-500"><th className="py-3 pr-3">Stage</th><th className="py-3 pr-3">Deals</th><th className="py-3">Value</th></tr></thead>
          <tbody>{rows.map((row) => <tr key={row.name} className="border-b border-zinc-100"><td className="py-3 pr-3">{row.name}</td><td className="py-3 pr-3">{row.count}</td><td className="py-3">{formatCurrency(row.value)}</td></tr>)}</tbody>
        </Table>
      </Card>
    </div>
  );
}

function AgentsReport({ store }: { store: ReturnType<typeof useDemoStore.getState> }) {
  const now = new Date();
  const rows = store.users.map((user) => ({
    user,
    prospects: store.prospects.filter((prospect) => prospect.ownerId === user.id).length,
    openTasks: store.tasks.filter((task) => task.assignedTo === user.id && task.status !== "completed").length,
    overdueTasks: store.tasks.filter((task) => task.assignedTo === user.id && task.status !== "completed" && new Date(task.dueDate) < now).length,
    deals: store.deals.filter((deal) => deal.ownerId === user.id).length,
  }));

  return (
    <Card>
      <h2 className="font-semibold">Agent workload</h2>
      <Table className="mt-4">
        <thead><tr className="border-b border-zinc-100 text-left text-xs uppercase text-zinc-500"><th className="py-3 pr-3">Agent</th><th className="py-3 pr-3">Prospects</th><th className="py-3 pr-3">Open tasks</th><th className="py-3 pr-3">Overdue</th><th className="py-3">Deals</th></tr></thead>
        <tbody>{rows.map((row) => <tr key={row.user.id} className="border-b border-zinc-100"><td className="py-3 pr-3 font-medium">{row.user.name}</td><td className="py-3 pr-3">{row.prospects}</td><td className="py-3 pr-3">{row.openTasks}</td><td className="py-3 pr-3">{row.overdueTasks}</td><td className="py-3">{row.deals}</td></tr>)}</tbody>
      </Table>
    </Card>
  );
}

function CustomReport({ store }: { store: ReturnType<typeof useDemoStore.getState> }) {
  const [metric, setMetric] = useState<CustomMetric>("prospects");
  const [groupBy, setGroupBy] = useState<CustomGroup>("status");
  const rows = customRows(metric, groupBy, store.prospects, store.deals, store.tasks, store.users);

  return (
    <Card>
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <h2 className="font-semibold">Custom report</h2>
        <div className="flex gap-2">
          <Select value={metric} onChange={(event) => setMetric(event.target.value as CustomMetric)}>
            <option value="prospects">Prospects</option>
            <option value="deals">Deals</option>
            <option value="tasks">Tasks</option>
          </Select>
          <Select value={groupBy} onChange={(event) => setGroupBy(event.target.value as CustomGroup)}>
            <option value="status">Status</option>
            <option value="owner">Owner</option>
            <option value="source">Source</option>
          </Select>
        </div>
      </div>
      {rows.length ? (
        <Table className="mt-4">
          <thead><tr className="border-b border-zinc-100 text-left text-xs uppercase text-zinc-500"><th className="py-3 pr-3">Group</th><th className="py-3">Count</th></tr></thead>
          <tbody>{rows.map((row) => <tr key={row.name} className="border-b border-zinc-100"><td className="py-3 pr-3">{row.name}</td><td className="py-3">{row.count}</td></tr>)}</tbody>
        </Table>
      ) : <EmptyState title="No report rows" />}
    </Card>
  );
}

function customRows(
  metric: CustomMetric,
  groupBy: CustomGroup,
  prospects: DemoProspect[],
  deals: DemoDeal[],
  tasks: DemoTask[],
  users: DemoUserProfile[],
) {
  const prospectById = new Map(prospects.map((prospect) => [prospect.id, prospect]));
  const userById = new Map(users.map((user) => [user.id, user.name]));
  const labels = new Map<string, number>();
  const label = (key: string | undefined) => groupBy === "owner" ? userById.get(key ?? "") ?? "Unassigned" : key || "Unassigned";
  const add = (key: string | undefined) => {
    const name = label(key);
    labels.set(name, (labels.get(name) ?? 0) + 1);
  };

  if (metric === "prospects") {
    prospects.forEach((prospect) => add(groupBy === "status" ? prospect.status : groupBy === "owner" ? prospect.ownerId : prospect.source));
  } else if (metric === "deals") {
    deals.forEach((deal) => add(groupBy === "status" ? deal.status : groupBy === "owner" ? deal.ownerId : prospectById.get(deal.prospectId)?.source));
  } else {
    tasks.forEach((task) => add(groupBy === "status" ? task.status : groupBy === "owner" ? task.assignedTo : prospectById.get(task.prospectId ?? "")?.source));
  }

  return Array.from(labels, ([name, count]) => ({ name, count })).sort((left, right) => right.count - left.count);
}

function MetricCard({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <Card>
      <p className="text-sm text-zinc-500">{label}</p>
      <div className="mt-2 text-2xl font-semibold">{value}</div>
    </Card>
  );
}
