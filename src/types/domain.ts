export type JsonPrimitive = string | number | boolean | null;
export type JsonValue = JsonPrimitive | JsonObject | JsonValue[];
export type JsonObject = { [key: string]: JsonValue };
export type EntityId = string;
export type IsoDateString = string;

export enum OrgRole {
  OWNER = "OWNER",
  ADMIN = "ADMIN",
  MEMBER = "MEMBER",
  VIEWER = "VIEWER",
}

export enum LeadStatus {
  NEW = "NEW",
  CONTACTED = "CONTACTED",
  ENGAGED = "ENGAGED",
  QUALIFIED = "QUALIFIED",
  UNQUALIFIED = "UNQUALIFIED",
  NURTURE = "NURTURE",
  CONVERTED = "CONVERTED",
  LOST = "LOST",
}

export enum LeadTemperature {
  HOT = "HOT",
  WARM = "WARM",
  COLD = "COLD",
}

export enum TaskType {
  CALL = "CALL",
  EMAIL = "EMAIL",
  MEETING = "MEETING",
  FOLLOW_UP = "FOLLOW_UP",
  LINKEDIN = "LINKEDIN",
  RESEARCH = "RESEARCH",
  TODO = "TODO",
  OTHER = "OTHER",
}

export enum TaskStatus {
  TODO = "TODO",
  IN_PROGRESS = "IN_PROGRESS",
  COMPLETED = "COMPLETED",
  CANCELLED = "CANCELLED",
  DEFERRED = "DEFERRED",
}

export enum TaskPriority {
  LOW = "LOW",
  MEDIUM = "MEDIUM",
  HIGH = "HIGH",
  URGENT = "URGENT",
}

export enum NoteEntityType {
  ORGANIZATION = "ORGANIZATION",
  COMPANY = "COMPANY",
  PROSPECT = "PROSPECT",
  DEAL = "DEAL",
  TASK = "TASK",
}

export enum ActivityType {
  PROSPECT_CREATED = "PROSPECT_CREATED",
  PROSPECT_UPDATED = "PROSPECT_UPDATED",
  COMPANY_CREATED = "COMPANY_CREATED",
  EMAIL_SENT = "EMAIL_SENT",
  EMAIL_OPENED = "EMAIL_OPENED",
  EMAIL_CLICKED = "EMAIL_CLICKED",
  EMAIL_REPLIED = "EMAIL_REPLIED",
  CALL_LOGGED = "CALL_LOGGED",
  MEETING_BOOKED = "MEETING_BOOKED",
  NOTE_ADDED = "NOTE_ADDED",
  TASK_CREATED = "TASK_CREATED",
  TASK_COMPLETED = "TASK_COMPLETED",
  DEAL_CREATED = "DEAL_CREATED",
  DEAL_STAGE_CHANGED = "DEAL_STAGE_CHANGED",
  IMPORT_COMPLETED = "IMPORT_COMPLETED",
}

export enum ImportStatus {
  PENDING = "PENDING",
  PROCESSING = "PROCESSING",
  COMPLETED = "COMPLETED",
  FAILED = "FAILED",
  CANCELLED = "CANCELLED",
}

export enum NotificationType {
  INFO = "INFO",
  SUCCESS = "SUCCESS",
  WARNING = "WARNING",
  ERROR = "ERROR",
  TASK_DUE = "TASK_DUE",
  DEAL_UPDATED = "DEAL_UPDATED",
  IMPORT_FINISHED = "IMPORT_FINISHED",
  USAGE_LIMIT = "USAGE_LIMIT",
}

export enum PlanTier {
  FREE = "FREE",
  PRO = "PRO",
  TEAM = "TEAM",
  BUSINESS = "BUSINESS",
}

export interface Profile {
  id: EntityId;
  email: string;
  fullName: string;
  avatarUrl?: string;
  timezone?: string;
  locale?: string;
  createdAt: IsoDateString;
  updatedAt: IsoDateString;
}

export interface Organization {
  id: EntityId;
  name: string;
  slug: string;
  logoUrl?: string;
  website?: string;
  planTier: PlanTier;
  ownerId: EntityId;
  createdAt: IsoDateString;
  updatedAt: IsoDateString;
}

export interface OrganizationMember {
  id: EntityId;
  organizationId: EntityId;
  profileId: EntityId;
  role: OrgRole;
  invitedById?: EntityId;
  joinedAt: IsoDateString;
  profile?: Profile;
}

export interface CompanySizeRange {
  min?: number;
  max?: number;
}

export interface IcpProfile {
  id: EntityId;
  organizationId: EntityId;
  name: string;
  description?: string;
  targetTitles: string[];
  targetIndustries: string[];
  targetCompanySizes: CompanySizeRange[];
  targetLocations: string[];
  keywords: string[];
  excludedTitles: string[];
  excludedIndustries: string[];
  isDefault: boolean;
  createdAt: IsoDateString;
  updatedAt: IsoDateString;
}

export interface Company {
  id: EntityId;
  organizationId?: EntityId;
  name: string;
  domain?: string;
  website?: string;
  linkedinUrl?: string;
  industry?: string;
  employeeCount?: number;
  annualRevenue?: number;
  country?: string;
  region?: string;
  city?: string;
  description?: string;
  technologies: string[];
  metadata?: JsonObject;
  enrichedAt?: IsoDateString;
  createdAt: IsoDateString;
  updatedAt: IsoDateString;
}

export interface Prospect {
  id: EntityId;
  organizationId?: EntityId;
  companyId?: EntityId;
  ownerId?: EntityId;
  firstName: string;
  lastName: string;
  email?: string;
  phone?: string;
  linkedinUrl?: string;
  title?: string;
  department?: string;
  seniority?: string;
  location?: string;
  leadStatus: LeadStatus;
  temperature: LeadTemperature;
  score: number;
  source?: string;
  company?: Company;
  metadata?: JsonObject;
  enrichedAt?: IsoDateString;
  lastContactedAt?: IsoDateString;
  createdAt: IsoDateString;
  updatedAt: IsoDateString;
}

export interface ProspectList {
  id: EntityId;
  organizationId: EntityId;
  ownerId: EntityId;
  name: string;
  description?: string;
  isShared: boolean;
  createdAt: IsoDateString;
  updatedAt: IsoDateString;
}

export interface ProspectListMember {
  id: EntityId;
  listId: EntityId;
  prospectId: EntityId;
  addedById: EntityId;
  addedAt: IsoDateString;
}

export interface Tag {
  id: EntityId;
  organizationId: EntityId;
  name: string;
  color?: string;
  createdAt: IsoDateString;
  updatedAt: IsoDateString;
}

export interface ProspectTag {
  id: EntityId;
  prospectId: EntityId;
  tagId: EntityId;
  createdAt: IsoDateString;
}

export interface Note {
  id: EntityId;
  organizationId: EntityId;
  authorId: EntityId;
  entityType: NoteEntityType;
  entityId: EntityId;
  body: string;
  isPinned: boolean;
  createdAt: IsoDateString;
  updatedAt: IsoDateString;
}

export interface Task {
  id: EntityId;
  organizationId: EntityId;
  assigneeId?: EntityId;
  createdById: EntityId;
  prospectId?: EntityId;
  companyId?: EntityId;
  dealId?: EntityId;
  type: TaskType;
  status: TaskStatus;
  priority: TaskPriority;
  title: string;
  description?: string;
  dueAt?: IsoDateString;
  completedAt?: IsoDateString;
  createdAt: IsoDateString;
  updatedAt: IsoDateString;
}

export interface Activity {
  id: EntityId;
  organizationId: EntityId;
  actorId?: EntityId;
  prospectId?: EntityId;
  companyId?: EntityId;
  dealId?: EntityId;
  type: ActivityType;
  title: string;
  description?: string;
  metadata?: JsonObject;
  occurredAt: IsoDateString;
}

export interface Pipeline {
  id: EntityId;
  organizationId: EntityId;
  name: string;
  description?: string;
  isDefault: boolean;
  createdAt: IsoDateString;
  updatedAt: IsoDateString;
}

export interface PipelineStage {
  id: EntityId;
  pipelineId: EntityId;
  name: string;
  order: number;
  probability: number;
  color?: string;
  createdAt: IsoDateString;
  updatedAt: IsoDateString;
}

export interface Deal {
  id: EntityId;
  organizationId: EntityId;
  pipelineId: EntityId;
  stageId: EntityId;
  companyId?: EntityId;
  prospectId?: EntityId;
  ownerId?: EntityId;
  name: string;
  amount: number;
  currency: string;
  probability: number;
  expectedCloseDate?: IsoDateString;
  closedAt?: IsoDateString;
  lostReason?: string;
  createdAt: IsoDateString;
  updatedAt: IsoDateString;
}

export interface Notification {
  id: EntityId;
  organizationId: EntityId;
  recipientId: EntityId;
  type: NotificationType;
  title: string;
  body?: string;
  actionUrl?: string;
  readAt?: IsoDateString;
  createdAt: IsoDateString;
}

export interface ImportJob {
  id: EntityId;
  organizationId: EntityId;
  createdById: EntityId;
  filename: string;
  status: ImportStatus;
  totalRows: number;
  processedRows: number;
  importedRows: number;
  failedRows: number;
  duplicateRows: number;
  mapping: JsonObject;
  errorMessage?: string;
  startedAt?: IsoDateString;
  completedAt?: IsoDateString;
  createdAt: IsoDateString;
}

export interface ImportRow {
  id: EntityId;
  importJobId: EntityId;
  rowNumber: number;
  rawData: JsonObject;
  mappedData?: JsonObject;
  status: ImportStatus;
  errors: string[];
  duplicateOfProspectId?: EntityId;
  createdAt: IsoDateString;
}

export interface CustomField {
  id: EntityId;
  organizationId: EntityId;
  entityType: NoteEntityType;
  key: string;
  label: string;
  fieldType: "text" | "number" | "date" | "boolean" | "select" | "multi_select" | "url";
  options: string[];
  required: boolean;
  createdAt: IsoDateString;
  updatedAt: IsoDateString;
}

export interface CustomFieldValue {
  id: EntityId;
  customFieldId: EntityId;
  entityId: EntityId;
  value: JsonValue;
  createdAt: IsoDateString;
  updatedAt: IsoDateString;
}

export interface Automation {
  id: EntityId;
  organizationId: EntityId;
  name: string;
  description?: string;
  enabled: boolean;
  triggerType: string;
  triggerConfig: JsonObject;
  actionConfig: JsonObject;
  createdById: EntityId;
  createdAt: IsoDateString;
  updatedAt: IsoDateString;
}

export interface AutomationRun {
  id: EntityId;
  automationId: EntityId;
  status: "PENDING" | "RUNNING" | "SUCCEEDED" | "FAILED";
  input: JsonObject;
  output?: JsonObject;
  errorMessage?: string;
  startedAt: IsoDateString;
  completedAt?: IsoDateString;
}

export interface AiGeneration {
  id: EntityId;
  organizationId: EntityId;
  userId: EntityId;
  provider: string;
  model: string;
  prompt: string;
  output: JsonObject;
  tokenCount?: number;
  createdAt: IsoDateString;
}

export interface Integration {
  id: EntityId;
  organizationId: EntityId;
  provider: string;
  accountId?: string;
  displayName: string;
  enabled: boolean;
  config: JsonObject;
  connectedAt: IsoDateString;
  updatedAt: IsoDateString;
}

export interface Subscription {
  id: EntityId;
  organizationId: EntityId;
  planTier: PlanTier;
  provider: "stripe" | "demo" | "manual";
  providerCustomerId?: string;
  providerSubscriptionId?: string;
  status: "trialing" | "active" | "past_due" | "canceled" | "incomplete";
  currentPeriodStart?: IsoDateString;
  currentPeriodEnd?: IsoDateString;
  cancelAtPeriodEnd: boolean;
  createdAt: IsoDateString;
  updatedAt: IsoDateString;
}

export interface UsageRecord {
  id: EntityId;
  organizationId: EntityId;
  feature: string;
  quantity: number;
  periodStart: IsoDateString;
  periodEnd: IsoDateString;
  metadata?: JsonObject;
  createdAt: IsoDateString;
}

export interface AuditLog {
  id: EntityId;
  organizationId: EntityId;
  actorId?: EntityId;
  action: string;
  entityType: string;
  entityId?: EntityId;
  before?: JsonObject;
  after?: JsonObject;
  ipAddress?: string;
  userAgent?: string;
  createdAt: IsoDateString;
}
