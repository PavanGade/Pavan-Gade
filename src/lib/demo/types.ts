export type DemoUserRole = "admin" | "manager" | "rep";

export type DemoProspectStatus =
  | "new"
  | "contacted"
  | "engaged"
  | "qualified"
  | "meeting"
  | "proposal"
  | "negotiation"
  | "won"
  | "lost"
  | "nurture";

export type DemoLeadTemperature = "cold" | "warm" | "hot";

export type DemoTaskStatus = "todo" | "in_progress" | "completed";

export type DemoTaskPriority = "low" | "medium" | "high";

export type DemoActivityType =
  | "created"
  | "updated"
  | "deleted"
  | "imported"
  | "emailed"
  | "called"
  | "meeting"
  | "note"
  | "task"
  | "deal"
  | "stage_changed"
  | "notification"
  | "automation"
  | "onboarding";

export type DemoSubjectType =
  | "prospect"
  | "company"
  | "list"
  | "tag"
  | "task"
  | "note"
  | "deal"
  | "notification"
  | "automation"
  | "organization";

export type DemoPlan = "FREE" | "PRO" | "BUSINESS";

export type DemoDateRangePreset = "today" | "7d" | "30d" | "90d" | "all";

export type DemoDateRange =
  | DemoDateRangePreset
  | {
      from: string | Date;
      to: string | Date;
    };

export interface DemoOrganization {
  id: string;
  name: string;
  createdAt: string;
}

export interface DemoUserProfile {
  id: string;
  organizationId: string;
  email: string;
  name: string;
  role: DemoUserRole;
  title: string;
  avatarUrl?: string;
  onboardingComplete: boolean;
  createdAt: string;
}

export interface DemoSession {
  userId: string;
  email: string;
  name: string;
  role: DemoUserRole;
  organizationId: string;
  onboardingComplete: boolean;
}

export interface DemoCompany {
  id: string;
  organizationId: string;
  name: string;
  domain: string;
  website: string;
  industry: string;
  description: string;
  employeeCount: number;
  revenue: number;
  country: string;
  state: string;
  city: string;
  technologies: string[];
  foundedYear: number;
  source: string;
  createdAt: string;
  updatedAt?: string;
}

export interface DemoProspect {
  id: string;
  organizationId: string;
  firstName: string;
  lastName: string;
  fullName: string;
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
  leadScore: number;
  leadTemperature: DemoLeadTemperature;
  ownerId: string;
  companyId: string;
  tagIds: string[];
  lastContactedAt?: string;
  nextFollowupAt?: string;
  createdAt: string;
  updatedAt?: string;
}

export interface DemoList {
  id: string;
  organizationId: string;
  name: string;
  description: string;
  prospectIds: string[];
  createdBy: string;
  createdAt: string;
  updatedAt?: string;
}

export interface DemoTag {
  id: string;
  organizationId: string;
  name: string;
  color: string;
  prospectIds: string[];
  createdAt: string;
  updatedAt?: string;
}

export interface DemoPipelineStage {
  id: string;
  organizationId: string;
  name: string;
  order: number;
  probability: number;
  createdAt: string;
}

export interface DemoDeal {
  id: string;
  organizationId: string;
  name: string;
  prospectId: string;
  companyId: string;
  ownerId: string;
  stageId: string;
  value: number;
  currency: "USD" | "INR";
  probability: number;
  expectedCloseDate: string;
  status: "open" | "won" | "lost";
  createdAt: string;
  updatedAt?: string;
}

export interface DemoTask {
  id: string;
  organizationId: string;
  title: string;
  description: string;
  status: DemoTaskStatus;
  priority: DemoTaskPriority;
  dueDate: string;
  assignedTo: string;
  prospectId?: string;
  companyId?: string;
  dealId?: string;
  completedAt?: string;
  createdAt: string;
  updatedAt?: string;
}

export interface DemoNote {
  id: string;
  organizationId: string;
  body: string;
  authorId: string;
  prospectId?: string;
  companyId?: string;
  dealId?: string;
  createdAt: string;
  updatedAt?: string;
}

export interface DemoActivity {
  id: string;
  organizationId: string;
  actorId: string;
  type: DemoActivityType;
  subjectType: DemoSubjectType;
  subjectId: string;
  summary: string;
  prospectId?: string;
  companyId?: string;
  dealId?: string;
  metadata?: Record<string, string | number | boolean | null>;
  createdAt: string;
}

export interface DemoNotification {
  id: string;
  organizationId: string;
  userId: string;
  title: string;
  body: string;
  read: boolean;
  link?: string;
  createdAt: string;
}

export interface DemoAutomation {
  id: string;
  organizationId: string;
  name: string;
  description: string;
  enabled: boolean;
  trigger: string;
  conditions: string[];
  actions: string[];
  createdBy: string;
  createdAt: string;
  updatedAt?: string;
}

export interface DemoIcpProfile {
  id: string;
  organizationId: string;
  name: string;
  industries: string[];
  employeeCountMin: number;
  employeeCountMax: number;
  revenueMin: number;
  revenueMax: number;
  regions: string[];
  seniorities: string[];
  departments: string[];
  technologies: string[];
  createdAt: string;
  updatedAt?: string;
}

export interface DemoSubscription {
  organizationId: string;
  plan: DemoPlan;
  usage: {
    prospects: number;
    companies: number;
    exports: number;
    enrichmentCredits: number;
    seats: number;
  };
  limits: {
    prospects: number;
    companies: number;
    exports: number;
    enrichmentCredits: number;
    seats: number;
  };
  currentPeriodStart: string;
  currentPeriodEnd: string;
}

export interface DemoDatabase {
  meta: {
    version: 1;
    generatedAt: string;
    passwordHint: "demo1234";
  };
  organization: DemoOrganization;
  users: DemoUserProfile[];
  companies: DemoCompany[];
  prospects: DemoProspect[];
  lists: DemoList[];
  tags: DemoTag[];
  pipelineStages: DemoPipelineStage[];
  deals: DemoDeal[];
  tasks: DemoTask[];
  notes: DemoNote[];
  activities: DemoActivity[];
  notifications: DemoNotification[];
  automations: DemoAutomation[];
  icpProfile: DemoIcpProfile;
  subscription: DemoSubscription;
}

export interface DemoDashboardMetrics {
  totalProspects: number;
  newProspects: number;
  hotProspects: number;
  totalCompanies: number;
  openDeals: number;
  pipelineValue: number;
  wonDealsValue: number;
  openTasks: number;
  overdueTasks: number;
  completedTasks: number;
  averageLeadScore: number;
  conversionRate: number;
  unreadNotifications: number;
  recentActivities: DemoActivity[];
}

export interface DemoAnalytics {
  range: {
    from: string;
    to: string;
  };
  prospectsByStatus: Record<DemoProspectStatus, number>;
  prospectsBySource: Record<string, number>;
  prospectsByTemperature: Record<DemoLeadTemperature, number>;
  prospectsByOwner: Record<string, number>;
  companiesByIndustry: Record<string, number>;
  dealsByStage: Record<string, { count: number; value: number }>;
  leadScoreBuckets: Record<string, number>;
  activityTimeline: Array<{ date: string; count: number }>;
  taskCompletionRate: number;
  pipelineValue: number;
  wonDealsValue: number;
  lostDealsValue: number;
}
