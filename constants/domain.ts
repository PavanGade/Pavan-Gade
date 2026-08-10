export const ORG_ROLES = [
  'OWNER',
  'ADMIN',
  'MANAGER',
  'SALES_REP',
  'VIEWER',
] as const;

export type OrgRole = (typeof ORG_ROLES)[number];

export const LEAD_STATUSES = [
  'NEW',
  'CONTACTED',
  'ENGAGED',
  'QUALIFIED',
  'UNQUALIFIED',
  'NURTURING',
] as const;

export type LeadStatus = (typeof LEAD_STATUSES)[number];

export const TASK_TYPES = [
  'CALL',
  'EMAIL',
  'WHATSAPP',
  'MEETING',
  'FOLLOW_UP',
  'CUSTOM',
] as const;

export type TaskType = (typeof TASK_TYPES)[number];

export const TASK_STATUSES = ['OPEN', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED'] as const;
export type TaskStatus = (typeof TASK_STATUSES)[number];

export const TASK_PRIORITIES = ['LOW', 'MEDIUM', 'HIGH', 'URGENT'] as const;
export type TaskPriority = (typeof TASK_PRIORITIES)[number];

export const DEFAULT_PIPELINE_STAGES = [
  { name: 'New', position: 0, probability: 10 },
  { name: 'Contacted', position: 1, probability: 20 },
  { name: 'Engaged', position: 2, probability: 30 },
  { name: 'Qualified', position: 3, probability: 45 },
  { name: 'Meeting', position: 4, probability: 55 },
  { name: 'Proposal', position: 5, probability: 70 },
  { name: 'Negotiation', position: 6, probability: 85 },
  { name: 'Won', position: 7, probability: 100, isWon: true },
  { name: 'Lost', position: 8, probability: 0, isLost: true },
] as const;

export const QUERY_KEYS = {
  session: ['session'] as const,
  profile: ['profile'] as const,
  organizations: ['organizations'] as const,
  dashboard: (orgId: string) => ['dashboard', orgId] as const,
  prospects: (orgId: string) => ['prospects', orgId] as const,
  prospect: (id: string) => ['prospect', id] as const,
  companies: (orgId: string) => ['companies', orgId] as const,
  company: (id: string) => ['company', id] as const,
  lists: (orgId: string) => ['lists', orgId] as const,
  list: (id: string) => ['list', id] as const,
  tasks: (orgId: string) => ['tasks', orgId] as const,
  pipeline: (orgId: string) => ['pipeline', orgId] as const,
  deals: (orgId: string) => ['deals', orgId] as const,
  search: (orgId: string, q: string) => ['search', orgId, q] as const,
  notes: (entity: string, id: string) => ['notes', entity, id] as const,
  activities: (prospectId: string) => ['activities', prospectId] as const,
} as const;

export const PAGE_SIZE = 20;
