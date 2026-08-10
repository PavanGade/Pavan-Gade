import type {
  DemoAnalytics,
  DemoDashboardMetrics,
  DemoDatabase,
  DemoDateRange,
  DemoLeadTemperature,
  DemoProspectStatus,
} from "./types";

const DAY_MS = 24 * 60 * 60 * 1000;

const prospectStatuses: DemoProspectStatus[] = [
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

const leadTemperatures: DemoLeadTemperature[] = ["cold", "warm", "hot"];

function toDate(value: string | Date): Date {
  return value instanceof Date ? value : new Date(value);
}

function startOfUtcDay(date: Date): Date {
  return new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate()));
}

export function resolveDemoDateRange(range: DemoDateRange, now: string | Date): { from: Date; to: Date } {
  const end = toDate(now);

  if (typeof range === "object") {
    return {
      from: toDate(range.from),
      to: toDate(range.to),
    };
  }

  if (range === "all") {
    return {
      from: new Date("1970-01-01T00:00:00.000Z"),
      to: end,
    };
  }

  if (range === "today") {
    return {
      from: startOfUtcDay(end),
      to: end,
    };
  }

  const days = range === "7d" ? 7 : range === "30d" ? 30 : 90;

  return {
    from: new Date(end.getTime() - days * DAY_MS),
    to: end,
  };
}

function isWithin(value: string | undefined, from: Date, to: Date): boolean {
  if (!value) return false;
  const timestamp = new Date(value).getTime();

  return timestamp >= from.getTime() && timestamp <= to.getTime();
}

function average(values: number[]): number {
  if (values.length === 0) return 0;

  return Math.round(values.reduce((sum, value) => sum + value, 0) / values.length);
}

function emptyStatusRecord(): Record<DemoProspectStatus, number> {
  return prospectStatuses.reduce(
    (record, status) => ({
      ...record,
      [status]: 0,
    }),
    {} as Record<DemoProspectStatus, number>,
  );
}

function emptyTemperatureRecord(): Record<DemoLeadTemperature, number> {
  return leadTemperatures.reduce(
    (record, temperature) => ({
      ...record,
      [temperature]: 0,
    }),
    {} as Record<DemoLeadTemperature, number>,
  );
}

export function getDashboardMetrics(db: DemoDatabase, range: DemoDateRange = "30d"): DemoDashboardMetrics {
  const { from, to } = resolveDemoDateRange(range, db.meta.generatedAt);
  const now = new Date(db.meta.generatedAt);
  const openDeals = db.deals.filter((deal) => deal.status === "open");
  const wonDeals = db.deals.filter((deal) => deal.status === "won" && isWithin(deal.createdAt, from, to));
  const openTasks = db.tasks.filter((task) => task.status !== "completed");

  return {
    totalProspects: db.prospects.length,
    newProspects: db.prospects.filter((prospect) => isWithin(prospect.createdAt, from, to)).length,
    hotProspects: db.prospects.filter((prospect) => prospect.leadTemperature === "hot").length,
    totalCompanies: db.companies.length,
    openDeals: openDeals.length,
    pipelineValue: openDeals.reduce((sum, deal) => sum + deal.value, 0),
    wonDealsValue: wonDeals.reduce((sum, deal) => sum + deal.value, 0),
    openTasks: openTasks.length,
    overdueTasks: openTasks.filter((task) => new Date(task.dueDate).getTime() < now.getTime()).length,
    completedTasks: db.tasks.filter((task) => task.status === "completed" && isWithin(task.completedAt, from, to)).length,
    averageLeadScore: average(db.prospects.map((prospect) => prospect.leadScore)),
    conversionRate:
      db.deals.length === 0
        ? 0
        : Math.round((db.deals.filter((deal) => deal.status === "won").length / db.deals.length) * 100),
    unreadNotifications: db.notifications.filter((notification) => !notification.read).length,
    recentActivities: [...db.activities]
      .sort((left, right) => new Date(right.createdAt).getTime() - new Date(left.createdAt).getTime())
      .slice(0, 10),
  };
}

export function getAnalytics(db: DemoDatabase, range: DemoDateRange = "30d"): DemoAnalytics {
  const { from, to } = resolveDemoDateRange(range, db.meta.generatedAt);
  const prospectsInRange = db.prospects.filter((prospect) => isWithin(prospect.createdAt, from, to));
  const dealsInRange = db.deals.filter((deal) => isWithin(deal.createdAt, from, to));
  const activitiesInRange = db.activities.filter((activity) => isWithin(activity.createdAt, from, to));
  const tasksInRange = db.tasks.filter((task) => isWithin(task.createdAt, from, to) || isWithin(task.completedAt, from, to));
  const prospectsByStatus = emptyStatusRecord();
  const prospectsByTemperature = emptyTemperatureRecord();
  const prospectsBySource: Record<string, number> = {};
  const prospectsByOwner: Record<string, number> = {};
  const companiesByIndustry: Record<string, number> = {};
  const dealsByStage: Record<string, { count: number; value: number }> = {};
  const leadScoreBuckets: Record<string, number> = {
    "0-24": 0,
    "25-49": 0,
    "50-74": 0,
    "75-100": 0,
  };
  const activityTimeline: Record<string, number> = {};

  for (const prospect of prospectsInRange) {
    prospectsByStatus[prospect.status] += 1;
    prospectsByTemperature[prospect.leadTemperature] += 1;
    prospectsBySource[prospect.source] = (prospectsBySource[prospect.source] ?? 0) + 1;
    prospectsByOwner[prospect.ownerId] = (prospectsByOwner[prospect.ownerId] ?? 0) + 1;

    if (prospect.leadScore < 25) {
      leadScoreBuckets["0-24"] += 1;
    } else if (prospect.leadScore < 50) {
      leadScoreBuckets["25-49"] += 1;
    } else if (prospect.leadScore < 75) {
      leadScoreBuckets["50-74"] += 1;
    } else {
      leadScoreBuckets["75-100"] += 1;
    }
  }

  for (const company of db.companies) {
    companiesByIndustry[company.industry] = (companiesByIndustry[company.industry] ?? 0) + 1;
  }

  for (const deal of dealsInRange) {
    const stageName = db.pipelineStages.find((stage) => stage.id === deal.stageId)?.name ?? deal.stageId;
    const stageSummary = dealsByStage[stageName] ?? { count: 0, value: 0 };

    dealsByStage[stageName] = {
      count: stageSummary.count + 1,
      value: stageSummary.value + deal.value,
    };
  }

  for (const activity of activitiesInRange) {
    const day = activity.createdAt.slice(0, 10);
    activityTimeline[day] = (activityTimeline[day] ?? 0) + 1;
  }

  const completedTasks = tasksInRange.filter((task) => task.status === "completed").length;

  return {
    range: {
      from: from.toISOString(),
      to: to.toISOString(),
    },
    prospectsByStatus,
    prospectsBySource,
    prospectsByTemperature,
    prospectsByOwner,
    companiesByIndustry,
    dealsByStage,
    leadScoreBuckets,
    activityTimeline: Object.entries(activityTimeline)
      .map(([date, count]) => ({ date, count }))
      .sort((left, right) => left.date.localeCompare(right.date)),
    taskCompletionRate: tasksInRange.length === 0 ? 0 : Math.round((completedTasks / tasksInRange.length) * 100),
    pipelineValue: dealsInRange.filter((deal) => deal.status === "open").reduce((sum, deal) => sum + deal.value, 0),
    wonDealsValue: dealsInRange.filter((deal) => deal.status === "won").reduce((sum, deal) => sum + deal.value, 0),
    lostDealsValue: dealsInRange.filter((deal) => deal.status === "lost").reduce((sum, deal) => sum + deal.value, 0),
  };
}
