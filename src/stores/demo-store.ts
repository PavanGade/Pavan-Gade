"use client";

import { create } from "zustand";
import { createJSONStorage, persist, type StateStorage } from "zustand/middleware";
import { createDemoSeed } from "@/lib/demo/seed";
import { getAnalytics as calculateAnalytics, getDashboardMetrics as calculateDashboardMetrics } from "@/lib/demo/metrics";
import { scoreProspect } from "@/lib/scoring/score-prospect";
import type {
  DemoActivity,
  DemoAnalytics,
  DemoAutomation,
  DemoCompany,
  DemoDashboardMetrics,
  DemoDatabase,
  DemoDateRange,
  DemoDeal,
  DemoIcpProfile,
  DemoList,
  DemoNotification,
  DemoNote,
  DemoPipelineStage,
  DemoProspect,
  DemoSession,
  DemoTag,
  DemoTask,
  DemoUserProfile,
} from "@/lib/demo/types";

const STORAGE_KEY = "prspct-demo-v1";

const noopStorage: StateStorage = {
  getItem: () => null,
  setItem: () => undefined,
  removeItem: () => undefined,
};

type DemoProspectCreateInput = Omit<
  DemoProspect,
  "id" | "organizationId" | "fullName" | "leadScore" | "leadTemperature" | "createdAt" | "updatedAt"
> &
  Partial<Pick<DemoProspect, "id" | "organizationId" | "fullName" | "leadScore" | "leadTemperature" | "createdAt">>;

type DemoCompanyCreateInput = Omit<DemoCompany, "id" | "organizationId" | "createdAt" | "updatedAt"> &
  Partial<Pick<DemoCompany, "id" | "organizationId" | "createdAt">>;

type DemoListCreateInput = Omit<DemoList, "id" | "organizationId" | "createdAt" | "updatedAt"> &
  Partial<Pick<DemoList, "id" | "organizationId" | "createdAt">>;

type DemoTagCreateInput = Omit<DemoTag, "id" | "organizationId" | "createdAt" | "updatedAt"> &
  Partial<Pick<DemoTag, "id" | "organizationId" | "createdAt">>;

type DemoTaskCreateInput = Omit<DemoTask, "id" | "organizationId" | "createdAt" | "updatedAt"> &
  Partial<Pick<DemoTask, "id" | "organizationId" | "createdAt">>;

type DemoNoteCreateInput = Omit<DemoNote, "id" | "organizationId" | "createdAt" | "updatedAt"> &
  Partial<Pick<DemoNote, "id" | "organizationId" | "createdAt">>;

type DemoDealCreateInput = Omit<DemoDeal, "id" | "organizationId" | "createdAt" | "updatedAt" | "probability" | "status"> &
  Partial<Pick<DemoDeal, "id" | "organizationId" | "createdAt" | "probability" | "status">>;

type DemoAutomationCreateInput = Omit<DemoAutomation, "id" | "organizationId" | "createdAt" | "updatedAt"> &
  Partial<Pick<DemoAutomation, "id" | "organizationId" | "createdAt">>;

type DemoActivityCreateInput = Omit<DemoActivity, "id" | "organizationId" | "actorId" | "createdAt"> &
  Partial<Pick<DemoActivity, "id" | "organizationId" | "actorId" | "createdAt">>;

export interface DemoSearchResults {
  prospects: DemoProspect[];
  companies: DemoCompany[];
  lists: DemoList[];
  deals: DemoDeal[];
  tasks: DemoTask[];
  notes: DemoNote[];
}

export interface DemoStoreState extends DemoDatabase {
  session: DemoSession | null;
  resetDemo: () => void;
  login: (email: string, password: string) => boolean;
  signup: (email: string, password: string, name?: string) => DemoSession | null;
  logout: () => void;
  completeOnboarding: (icp?: Partial<DemoIcpProfile>, profile?: Partial<DemoUserProfile>) => void;
  createProspect: (input: DemoProspectCreateInput) => DemoProspect;
  updateProspect: (id: string, updates: Partial<Omit<DemoProspect, "id" | "organizationId">>) => DemoProspect | undefined;
  deleteProspect: (id: string) => void;
  importProspects: (inputs: DemoProspectCreateInput[]) => DemoProspect[];
  createCompany: (input: DemoCompanyCreateInput) => DemoCompany;
  updateCompany: (id: string, updates: Partial<Omit<DemoCompany, "id" | "organizationId">>) => DemoCompany | undefined;
  deleteCompany: (id: string) => void;
  createList: (input: DemoListCreateInput) => DemoList;
  updateList: (id: string, updates: Partial<Omit<DemoList, "id" | "organizationId">>) => DemoList | undefined;
  deleteList: (id: string) => void;
  createTag: (input: DemoTagCreateInput) => DemoTag;
  updateTag: (id: string, updates: Partial<Omit<DemoTag, "id" | "organizationId">>) => DemoTag | undefined;
  deleteTag: (id: string) => void;
  createTask: (input: DemoTaskCreateInput) => DemoTask;
  updateTask: (id: string, updates: Partial<Omit<DemoTask, "id" | "organizationId">>) => DemoTask | undefined;
  deleteTask: (id: string) => void;
  createNote: (input: DemoNoteCreateInput) => DemoNote;
  updateNote: (id: string, updates: Partial<Omit<DemoNote, "id" | "organizationId">>) => DemoNote | undefined;
  deleteNote: (id: string) => void;
  createDeal: (input: DemoDealCreateInput) => DemoDeal;
  updateDeal: (id: string, updates: Partial<Omit<DemoDeal, "id" | "organizationId">>) => DemoDeal | undefined;
  moveDealStage: (dealId: string, stageId: string) => DemoDeal | undefined;
  deleteDeal: (id: string) => void;
  addActivity: (input: DemoActivityCreateInput) => DemoActivity;
  markNotificationRead: (id: string) => void;
  markAllNotificationsRead: (userId?: string) => void;
  createNotification: (input: Omit<DemoNotification, "id" | "organizationId" | "createdAt"> & Partial<Pick<DemoNotification, "id" | "organizationId" | "createdAt">>) => DemoNotification;
  deleteNotification: (id: string) => void;
  createAutomation: (input: DemoAutomationCreateInput) => DemoAutomation;
  updateAutomation: (id: string, updates: Partial<Omit<DemoAutomation, "id" | "organizationId">>) => DemoAutomation | undefined;
  deleteAutomation: (id: string) => void;
  search: (query: string) => DemoSearchResults;
  getDashboardMetrics: (range?: DemoDateRange) => DemoDashboardMetrics;
  getAnalytics: (range?: DemoDateRange) => DemoAnalytics;
}

const initialSeed = createDemoSeed();

function nowIso(): string {
  return new Date().toISOString();
}

function nextId(prefix: string, ids: string[]): string {
  const max = ids.reduce((highest, existingId) => {
    const match = existingId.match(new RegExp(`^${prefix}-(\\d+)$`));
    return match ? Math.max(highest, Number(match[1])) : highest;
  }, 0);

  return `${prefix}-${String(max + 1).padStart(3, "0")}`;
}

function getActorId(state: DemoStoreState): string {
  return state.session?.userId ?? "user-admin";
}

function createActivityRecord(
  state: DemoStoreState,
  input: Omit<DemoActivity, "id" | "organizationId" | "actorId" | "createdAt"> &
    Partial<Pick<DemoActivity, "actorId" | "createdAt">>,
): DemoActivity {
  return {
    id: nextId("act", state.activities.map((activity) => activity.id)),
    organizationId: state.organization.id,
    actorId: input.actorId ?? getActorId(state),
    createdAt: input.createdAt ?? nowIso(),
    type: input.type,
    subjectType: input.subjectType,
    subjectId: input.subjectId,
    summary: input.summary,
    prospectId: input.prospectId,
    companyId: input.companyId,
    dealId: input.dealId,
    metadata: input.metadata,
  };
}

function scoreDemoProspect(prospect: DemoProspect, companies: DemoCompany[]): DemoProspect {
  const company = companies.find((candidate) => candidate.id === prospect.companyId);
  const scored = scoreProspect({
    jobTitle: prospect.jobTitle,
    seniority: prospect.seniority,
    department: prospect.department,
    source: prospect.source,
    status: prospect.status,
    country: prospect.country,
    tagIds: prospect.tagIds,
    company,
  });

  return {
    ...prospect,
    ...scored,
  };
}

function syncTagMembership(tags: DemoTag[], prospects: DemoProspect[]): DemoTag[] {
  return tags.map((tag) => ({
    ...tag,
    prospectIds: prospects.filter((prospect) => prospect.tagIds.includes(tag.id)).map((prospect) => prospect.id),
  }));
}

function subscriptionWithUsage(state: DemoStoreState, prospects: DemoProspect[], companies: DemoCompany[]) {
  return {
    ...state.subscription,
    usage: {
      ...state.subscription.usage,
      prospects: prospects.length,
      companies: companies.length,
      seats: state.users.length,
    },
  };
}

function dealStatusForStage(stage?: DemoPipelineStage): DemoDeal["status"] {
  if (stage?.name === "Won") return "won";
  if (stage?.name === "Lost") return "lost";

  return "open";
}

function sessionForUser(user: DemoUserProfile): DemoSession {
  return {
    userId: user.id,
    email: user.email,
    name: user.name,
    role: user.role,
    organizationId: user.organizationId,
    onboardingComplete: user.onboardingComplete,
  };
}

function matches(value: string | undefined, query: string): boolean {
  return (value ?? "").toLowerCase().includes(query);
}

export const useDemoStore = create<DemoStoreState>()(
  persist(
    (set, get) => ({
      ...initialSeed,
      session: null,
      resetDemo: () => {
        set({
          ...createDemoSeed(),
          session: null,
        });
      },
      login: (email, password) => {
        const normalizedEmail = email.trim().toLowerCase();
        const user = get().users.find((candidate) => candidate.email.toLowerCase() === normalizedEmail);

        if (!user || !normalizedEmail.endsWith("@prspct.demo") || password.length < 6) {
          return false;
        }

        set({ session: sessionForUser(user) });
        return true;
      },
      signup: (email, password, name = "Demo User") => {
        const normalizedEmail = email.trim().toLowerCase();

        if (!normalizedEmail.includes("@") || password.length < 6) {
          return null;
        }

        const existingUser = get().users.find((user) => user.email.toLowerCase() === normalizedEmail);
        if (existingUser) {
          const session = sessionForUser(existingUser);
          set({ session });
          return session;
        }

        let createdSession: DemoSession | null = null;

        set((state) => {
          const createdAt = nowIso();
          const user: DemoUserProfile = {
            id: nextId("user", state.users.map((candidate) => candidate.id)),
            organizationId: state.organization.id,
            email: normalizedEmail,
            name,
            role: "rep",
            title: "Sales Rep",
            onboardingComplete: false,
            createdAt,
          };
          createdSession = sessionForUser(user);
          const activity = createActivityRecord(state, {
            type: "created",
            subjectType: "organization",
            subjectId: state.organization.id,
            summary: `${user.name} joined the demo workspace.`,
            actorId: user.id,
            createdAt,
          });

          return {
            users: [...state.users, user],
            session: createdSession,
            subscription: {
              ...state.subscription,
              usage: {
                ...state.subscription.usage,
                seats: state.users.length + 1,
              },
            },
            activities: [activity, ...state.activities],
          };
        });

        return createdSession;
      },
      logout: () => {
        set({ session: null });
      },
      completeOnboarding: (icp, profile) => {
        set((state) => {
          if (!state.session) return {};

          const updatedUsers = state.users.map((user) =>
            user.id === state.session?.userId
              ? {
                  ...user,
                  ...profile,
                  onboardingComplete: true,
                  updatedAt: nowIso(),
                }
              : user,
          );
          const updatedUser = updatedUsers.find((user) => user.id === state.session?.userId);
          const updatedSession = updatedUser ? sessionForUser(updatedUser) : state.session;
          const activity = createActivityRecord(state, {
            type: "onboarding",
            subjectType: "organization",
            subjectId: state.organization.id,
            summary: "Completed demo onboarding and ICP setup.",
          });

          return {
            users: updatedUsers,
            session: updatedSession,
            icpProfile: {
              ...state.icpProfile,
              ...icp,
              updatedAt: nowIso(),
            },
            activities: [activity, ...state.activities],
          };
        });
      },
      createProspect: (input) => {
        let created: DemoProspect | undefined;

        set((state) => {
          const candidate: DemoProspect = {
            ...input,
            id: input.id ?? nextId("p", state.prospects.map((prospect) => prospect.id)),
            organizationId: input.organizationId ?? state.organization.id,
            fullName: input.fullName ?? `${input.firstName} ${input.lastName}`,
            leadScore: input.leadScore ?? 0,
            leadTemperature: input.leadTemperature ?? "cold",
            createdAt: input.createdAt ?? nowIso(),
          };
          created = scoreDemoProspect(candidate, state.companies);
          const prospects = [created, ...state.prospects];
          const activity = createActivityRecord(state, {
            type: "created",
            subjectType: "prospect",
            subjectId: created.id,
            summary: `Created prospect ${created.fullName}.`,
            prospectId: created.id,
            companyId: created.companyId,
          });

          return {
            prospects,
            tags: syncTagMembership(state.tags, prospects),
            subscription: subscriptionWithUsage(state, prospects, state.companies),
            activities: [activity, ...state.activities],
          };
        });

        return created as DemoProspect;
      },
      updateProspect: (prospectId, updates) => {
        let updated: DemoProspect | undefined;

        set((state) => {
          const prospects = state.prospects.map((prospect) => {
            if (prospect.id !== prospectId) return prospect;

            updated = scoreDemoProspect(
              {
                ...prospect,
                ...updates,
                fullName: updates.fullName ?? `${updates.firstName ?? prospect.firstName} ${updates.lastName ?? prospect.lastName}`,
                updatedAt: nowIso(),
              },
              state.companies,
            );
            return updated;
          });

          if (!updated) return {};

          const activity = createActivityRecord(state, {
            type: "updated",
            subjectType: "prospect",
            subjectId: updated.id,
            summary: `Updated prospect ${updated.fullName}.`,
            prospectId: updated.id,
            companyId: updated.companyId,
          });

          return {
            prospects,
            tags: syncTagMembership(state.tags, prospects),
            activities: [activity, ...state.activities],
          };
        });

        return updated;
      },
      deleteProspect: (prospectId) => {
        set((state) => {
          const prospect = state.prospects.find((candidate) => candidate.id === prospectId);
          if (!prospect) return {};

          const prospects = state.prospects.filter((candidate) => candidate.id !== prospectId);
          const activity = createActivityRecord(state, {
            type: "deleted",
            subjectType: "prospect",
            subjectId: prospectId,
            summary: `Deleted prospect ${prospect.fullName}.`,
            prospectId,
            companyId: prospect.companyId,
          });

          return {
            prospects,
            lists: state.lists.map((list) => ({
              ...list,
              prospectIds: list.prospectIds.filter((id) => id !== prospectId),
            })),
            tags: syncTagMembership(state.tags, prospects),
            subscription: subscriptionWithUsage(state, prospects, state.companies),
            activities: [activity, ...state.activities],
          };
        });
      },
      importProspects: (inputs) => {
        const imported: DemoProspect[] = [];

        set((state) => {
          let ids = state.prospects.map((prospect) => prospect.id);
          const prospectsToImport = inputs.map((input) => {
            const prospectId = input.id ?? nextId("p", ids);
            ids = [...ids, prospectId];
            const candidate: DemoProspect = {
              ...input,
              id: prospectId,
              organizationId: input.organizationId ?? state.organization.id,
              fullName: input.fullName ?? `${input.firstName} ${input.lastName}`,
              leadScore: input.leadScore ?? 0,
              leadTemperature: input.leadTemperature ?? "cold",
              createdAt: input.createdAt ?? nowIso(),
            };
            return scoreDemoProspect(candidate, state.companies);
          });
          imported.push(...prospectsToImport);

          const prospects = [...prospectsToImport, ...state.prospects];
          const activity = createActivityRecord(state, {
            type: "imported",
            subjectType: "prospect",
            subjectId: prospectsToImport[0]?.id ?? "bulk-import",
            summary: `Imported ${prospectsToImport.length} prospects.`,
            metadata: { count: prospectsToImport.length },
          });

          return {
            prospects,
            tags: syncTagMembership(state.tags, prospects),
            subscription: subscriptionWithUsage(state, prospects, state.companies),
            activities: [activity, ...state.activities],
          };
        });

        return imported;
      },
      createCompany: (input) => {
        let created: DemoCompany | undefined;

        set((state) => {
          created = {
            ...input,
            id: input.id ?? nextId("c", state.companies.map((company) => company.id)),
            organizationId: input.organizationId ?? state.organization.id,
            createdAt: input.createdAt ?? nowIso(),
          };
          const companies = [created, ...state.companies];
          const activity = createActivityRecord(state, {
            type: "created",
            subjectType: "company",
            subjectId: created.id,
            summary: `Created company ${created.name}.`,
            companyId: created.id,
          });

          return {
            companies,
            subscription: subscriptionWithUsage(state, state.prospects, companies),
            activities: [activity, ...state.activities],
          };
        });

        return created as DemoCompany;
      },
      updateCompany: (companyId, updates) => {
        let updated: DemoCompany | undefined;

        set((state) => {
          const companies = state.companies.map((company) => {
            if (company.id !== companyId) return company;
            updated = { ...company, ...updates, updatedAt: nowIso() };
            return updated;
          });

          if (!updated) return {};

          const activity = createActivityRecord(state, {
            type: "updated",
            subjectType: "company",
            subjectId: updated.id,
            summary: `Updated company ${updated.name}.`,
            companyId: updated.id,
          });

          return {
            companies,
            activities: [activity, ...state.activities],
          };
        });

        return updated;
      },
      deleteCompany: (companyId) => {
        set((state) => {
          const company = state.companies.find((candidate) => candidate.id === companyId);
          if (!company) return {};

          const companies = state.companies.filter((candidate) => candidate.id !== companyId);
          const activity = createActivityRecord(state, {
            type: "deleted",
            subjectType: "company",
            subjectId: companyId,
            summary: `Deleted company ${company.name}.`,
            companyId,
          });

          return {
            companies,
            subscription: subscriptionWithUsage(state, state.prospects, companies),
            activities: [activity, ...state.activities],
          };
        });
      },
      createList: (input) => {
        let created: DemoList | undefined;

        set((state) => {
          created = {
            ...input,
            id: input.id ?? nextId("list", state.lists.map((list) => list.id)),
            organizationId: input.organizationId ?? state.organization.id,
            createdAt: input.createdAt ?? nowIso(),
          };
          const activity = createActivityRecord(state, {
            type: "created",
            subjectType: "list",
            subjectId: created.id,
            summary: `Created list ${created.name}.`,
          });

          return {
            lists: [created, ...state.lists],
            activities: [activity, ...state.activities],
          };
        });

        return created as DemoList;
      },
      updateList: (listId, updates) => {
        let updated: DemoList | undefined;

        set((state) => {
          const lists = state.lists.map((list) => {
            if (list.id !== listId) return list;
            updated = { ...list, ...updates, updatedAt: nowIso() };
            return updated;
          });

          if (!updated) return {};

          const activity = createActivityRecord(state, {
            type: "updated",
            subjectType: "list",
            subjectId: updated.id,
            summary: `Updated list ${updated.name}.`,
          });

          return {
            lists,
            activities: [activity, ...state.activities],
          };
        });

        return updated;
      },
      deleteList: (listId) => {
        set((state) => {
          const list = state.lists.find((candidate) => candidate.id === listId);
          if (!list) return {};

          const activity = createActivityRecord(state, {
            type: "deleted",
            subjectType: "list",
            subjectId: listId,
            summary: `Deleted list ${list.name}.`,
          });

          return {
            lists: state.lists.filter((candidate) => candidate.id !== listId),
            activities: [activity, ...state.activities],
          };
        });
      },
      createTag: (input) => {
        let created: DemoTag | undefined;

        set((state) => {
          created = {
            ...input,
            id: input.id ?? nextId("tag", state.tags.map((tag) => tag.id)),
            organizationId: input.organizationId ?? state.organization.id,
            createdAt: input.createdAt ?? nowIso(),
          };
          const activity = createActivityRecord(state, {
            type: "created",
            subjectType: "tag",
            subjectId: created.id,
            summary: `Created tag ${created.name}.`,
          });

          return {
            tags: [created, ...state.tags],
            activities: [activity, ...state.activities],
          };
        });

        return created as DemoTag;
      },
      updateTag: (tagId, updates) => {
        let updated: DemoTag | undefined;

        set((state) => {
          const tags = state.tags.map((tag) => {
            if (tag.id !== tagId) return tag;
            updated = { ...tag, ...updates, updatedAt: nowIso() };
            return updated;
          });

          if (!updated) return {};

          const activity = createActivityRecord(state, {
            type: "updated",
            subjectType: "tag",
            subjectId: updated.id,
            summary: `Updated tag ${updated.name}.`,
          });

          return {
            tags,
            activities: [activity, ...state.activities],
          };
        });

        return updated;
      },
      deleteTag: (tagId) => {
        set((state) => {
          const tag = state.tags.find((candidate) => candidate.id === tagId);
          if (!tag) return {};

          const prospects = state.prospects.map((prospect) => ({
            ...prospect,
            tagIds: prospect.tagIds.filter((id) => id !== tagId),
          }));
          const activity = createActivityRecord(state, {
            type: "deleted",
            subjectType: "tag",
            subjectId: tagId,
            summary: `Deleted tag ${tag.name}.`,
          });

          return {
            prospects,
            tags: state.tags.filter((candidate) => candidate.id !== tagId),
            activities: [activity, ...state.activities],
          };
        });
      },
      createTask: (input) => {
        let created: DemoTask | undefined;

        set((state) => {
          created = {
            ...input,
            id: input.id ?? nextId("task", state.tasks.map((task) => task.id)),
            organizationId: input.organizationId ?? state.organization.id,
            createdAt: input.createdAt ?? nowIso(),
          };
          const activity = createActivityRecord(state, {
            type: "task",
            subjectType: "task",
            subjectId: created.id,
            summary: `Created task ${created.title}.`,
            prospectId: created.prospectId,
            companyId: created.companyId,
            dealId: created.dealId,
          });

          return {
            tasks: [created, ...state.tasks],
            activities: [activity, ...state.activities],
          };
        });

        return created as DemoTask;
      },
      updateTask: (taskId, updates) => {
        let updated: DemoTask | undefined;

        set((state) => {
          const tasks = state.tasks.map((task) => {
            if (task.id !== taskId) return task;
            updated = {
              ...task,
              ...updates,
              completedAt: updates.status === "completed" ? updates.completedAt ?? nowIso() : updates.completedAt,
              updatedAt: nowIso(),
            };
            return updated;
          });

          if (!updated) return {};

          const activity = createActivityRecord(state, {
            type: "task",
            subjectType: "task",
            subjectId: updated.id,
            summary: `Updated task ${updated.title}.`,
            prospectId: updated.prospectId,
            companyId: updated.companyId,
            dealId: updated.dealId,
          });

          return {
            tasks,
            activities: [activity, ...state.activities],
          };
        });

        return updated;
      },
      deleteTask: (taskId) => {
        set((state) => {
          const task = state.tasks.find((candidate) => candidate.id === taskId);
          if (!task) return {};

          const activity = createActivityRecord(state, {
            type: "deleted",
            subjectType: "task",
            subjectId: taskId,
            summary: `Deleted task ${task.title}.`,
            prospectId: task.prospectId,
            companyId: task.companyId,
            dealId: task.dealId,
          });

          return {
            tasks: state.tasks.filter((candidate) => candidate.id !== taskId),
            activities: [activity, ...state.activities],
          };
        });
      },
      createNote: (input) => {
        let created: DemoNote | undefined;

        set((state) => {
          created = {
            ...input,
            id: input.id ?? nextId("note", state.notes.map((note) => note.id)),
            organizationId: input.organizationId ?? state.organization.id,
            createdAt: input.createdAt ?? nowIso(),
          };
          const activity = createActivityRecord(state, {
            type: "note",
            subjectType: "note",
            subjectId: created.id,
            summary: "Created a note.",
            prospectId: created.prospectId,
            companyId: created.companyId,
            dealId: created.dealId,
          });

          return {
            notes: [created, ...state.notes],
            activities: [activity, ...state.activities],
          };
        });

        return created as DemoNote;
      },
      updateNote: (noteId, updates) => {
        let updated: DemoNote | undefined;

        set((state) => {
          const notes = state.notes.map((note) => {
            if (note.id !== noteId) return note;
            updated = { ...note, ...updates, updatedAt: nowIso() };
            return updated;
          });

          if (!updated) return {};

          const activity = createActivityRecord(state, {
            type: "note",
            subjectType: "note",
            subjectId: updated.id,
            summary: "Updated a note.",
            prospectId: updated.prospectId,
            companyId: updated.companyId,
            dealId: updated.dealId,
          });

          return {
            notes,
            activities: [activity, ...state.activities],
          };
        });

        return updated;
      },
      deleteNote: (noteId) => {
        set((state) => {
          const note = state.notes.find((candidate) => candidate.id === noteId);
          if (!note) return {};

          const activity = createActivityRecord(state, {
            type: "deleted",
            subjectType: "note",
            subjectId: noteId,
            summary: "Deleted a note.",
            prospectId: note.prospectId,
            companyId: note.companyId,
            dealId: note.dealId,
          });

          return {
            notes: state.notes.filter((candidate) => candidate.id !== noteId),
            activities: [activity, ...state.activities],
          };
        });
      },
      createDeal: (input) => {
        let created: DemoDeal | undefined;

        set((state) => {
          const stage = state.pipelineStages.find((candidate) => candidate.id === input.stageId);
          created = {
            ...input,
            id: input.id ?? nextId("d", state.deals.map((deal) => deal.id)),
            organizationId: input.organizationId ?? state.organization.id,
            probability: input.probability ?? stage?.probability ?? 10,
            status: input.status ?? dealStatusForStage(stage),
            createdAt: input.createdAt ?? nowIso(),
          };
          const activity = createActivityRecord(state, {
            type: "deal",
            subjectType: "deal",
            subjectId: created.id,
            summary: `Created deal ${created.name}.`,
            prospectId: created.prospectId,
            companyId: created.companyId,
            dealId: created.id,
          });

          return {
            deals: [created, ...state.deals],
            activities: [activity, ...state.activities],
          };
        });

        return created as DemoDeal;
      },
      updateDeal: (dealId, updates) => {
        let updated: DemoDeal | undefined;

        set((state) => {
          const deals = state.deals.map((deal) => {
            if (deal.id !== dealId) return deal;
            const stage = state.pipelineStages.find((candidate) => candidate.id === (updates.stageId ?? deal.stageId));
            updated = {
              ...deal,
              ...updates,
              probability: updates.probability ?? stage?.probability ?? deal.probability,
              status: updates.status ?? dealStatusForStage(stage),
              updatedAt: nowIso(),
            };
            return updated;
          });

          if (!updated) return {};

          const activity = createActivityRecord(state, {
            type: "deal",
            subjectType: "deal",
            subjectId: updated.id,
            summary: `Updated deal ${updated.name}.`,
            prospectId: updated.prospectId,
            companyId: updated.companyId,
            dealId: updated.id,
          });

          return {
            deals,
            activities: [activity, ...state.activities],
          };
        });

        return updated;
      },
      moveDealStage: (dealId, stageId) => {
        let moved: DemoDeal | undefined;

        set((state) => {
          const stage = state.pipelineStages.find((candidate) => candidate.id === stageId);
          if (!stage) return {};

          const deals = state.deals.map((deal) => {
            if (deal.id !== dealId) return deal;
            moved = {
              ...deal,
              stageId,
              probability: stage.probability,
              status: dealStatusForStage(stage),
              updatedAt: nowIso(),
            };
            return moved;
          });

          if (!moved) return {};

          const activity = createActivityRecord(state, {
            type: "stage_changed",
            subjectType: "deal",
            subjectId: moved.id,
            summary: `Moved ${moved.name} to ${stage.name}.`,
            prospectId: moved.prospectId,
            companyId: moved.companyId,
            dealId: moved.id,
          });

          return {
            deals,
            activities: [activity, ...state.activities],
          };
        });

        return moved;
      },
      deleteDeal: (dealId) => {
        set((state) => {
          const deal = state.deals.find((candidate) => candidate.id === dealId);
          if (!deal) return {};

          const activity = createActivityRecord(state, {
            type: "deleted",
            subjectType: "deal",
            subjectId: dealId,
            summary: `Deleted deal ${deal.name}.`,
            prospectId: deal.prospectId,
            companyId: deal.companyId,
            dealId,
          });

          return {
            deals: state.deals.filter((candidate) => candidate.id !== dealId),
            activities: [activity, ...state.activities],
          };
        });
      },
      addActivity: (input) => {
        let created: DemoActivity | undefined;

        set((state) => {
          created = {
            ...input,
            id: input.id ?? nextId("act", state.activities.map((activity) => activity.id)),
            organizationId: input.organizationId ?? state.organization.id,
            actorId: input.actorId ?? getActorId(state),
            createdAt: input.createdAt ?? nowIso(),
          };

          return {
            activities: [created, ...state.activities],
          };
        });

        return created as DemoActivity;
      },
      markNotificationRead: (notificationId) => {
        set((state) => {
          const notification = state.notifications.find((candidate) => candidate.id === notificationId);
          if (!notification || notification.read) return {};

          const activity = createActivityRecord(state, {
            type: "notification",
            subjectType: "notification",
            subjectId: notificationId,
            summary: `Marked notification "${notification.title}" as read.`,
          });

          return {
            notifications: state.notifications.map((candidate) =>
              candidate.id === notificationId ? { ...candidate, read: true } : candidate,
            ),
            activities: [activity, ...state.activities],
          };
        });
      },
      markAllNotificationsRead: (userId) => {
        set((state) => {
          const targetUserId = userId ?? state.session?.userId;
          const notifications = state.notifications.map((notification) =>
            !targetUserId || notification.userId === targetUserId ? { ...notification, read: true } : notification,
          );
          const changedCount = state.notifications.filter(
            (notification) => !notification.read && (!targetUserId || notification.userId === targetUserId),
          ).length;

          if (changedCount === 0) return {};

          const activity = createActivityRecord(state, {
            type: "notification",
            subjectType: "notification",
            subjectId: targetUserId ?? "all",
            summary: `Marked ${changedCount} notifications as read.`,
            metadata: { count: changedCount },
          });

          return {
            notifications,
            activities: [activity, ...state.activities],
          };
        });
      },
      createNotification: (input) => {
        let created: DemoNotification | undefined;

        set((state) => {
          created = {
            ...input,
            id: input.id ?? nextId("notif", state.notifications.map((notification) => notification.id)),
            organizationId: input.organizationId ?? state.organization.id,
            createdAt: input.createdAt ?? nowIso(),
          };
          const activity = createActivityRecord(state, {
            type: "notification",
            subjectType: "notification",
            subjectId: created.id,
            summary: `Created notification ${created.title}.`,
          });

          return {
            notifications: [created, ...state.notifications],
            activities: [activity, ...state.activities],
          };
        });

        return created as DemoNotification;
      },
      deleteNotification: (notificationId) => {
        set((state) => {
          const notification = state.notifications.find((candidate) => candidate.id === notificationId);
          if (!notification) return {};

          const activity = createActivityRecord(state, {
            type: "deleted",
            subjectType: "notification",
            subjectId: notificationId,
            summary: `Deleted notification ${notification.title}.`,
          });

          return {
            notifications: state.notifications.filter((candidate) => candidate.id !== notificationId),
            activities: [activity, ...state.activities],
          };
        });
      },
      createAutomation: (input) => {
        let created: DemoAutomation | undefined;

        set((state) => {
          created = {
            ...input,
            id: input.id ?? nextId("auto", state.automations.map((automation) => automation.id)),
            organizationId: input.organizationId ?? state.organization.id,
            createdAt: input.createdAt ?? nowIso(),
          };
          const activity = createActivityRecord(state, {
            type: "automation",
            subjectType: "automation",
            subjectId: created.id,
            summary: `Created automation ${created.name}.`,
          });

          return {
            automations: [created, ...state.automations],
            activities: [activity, ...state.activities],
          };
        });

        return created as DemoAutomation;
      },
      updateAutomation: (automationId, updates) => {
        let updated: DemoAutomation | undefined;

        set((state) => {
          const automations = state.automations.map((automation) => {
            if (automation.id !== automationId) return automation;
            updated = { ...automation, ...updates, updatedAt: nowIso() };
            return updated;
          });

          if (!updated) return {};

          const activity = createActivityRecord(state, {
            type: "automation",
            subjectType: "automation",
            subjectId: updated.id,
            summary: `Updated automation ${updated.name}.`,
          });

          return {
            automations,
            activities: [activity, ...state.activities],
          };
        });

        return updated;
      },
      deleteAutomation: (automationId) => {
        set((state) => {
          const automation = state.automations.find((candidate) => candidate.id === automationId);
          if (!automation) return {};

          const activity = createActivityRecord(state, {
            type: "deleted",
            subjectType: "automation",
            subjectId: automationId,
            summary: `Deleted automation ${automation.name}.`,
          });

          return {
            automations: state.automations.filter((candidate) => candidate.id !== automationId),
            activities: [activity, ...state.activities],
          };
        });
      },
      search: (query) => {
        const normalizedQuery = query.trim().toLowerCase();
        const state = get();

        if (!normalizedQuery) {
          return {
            prospects: state.prospects,
            companies: state.companies,
            lists: state.lists,
            deals: state.deals,
            tasks: state.tasks,
            notes: state.notes,
          };
        }

        return {
          prospects: state.prospects.filter(
            (prospect) =>
              matches(prospect.fullName, normalizedQuery) ||
              matches(prospect.email, normalizedQuery) ||
              matches(prospect.jobTitle, normalizedQuery) ||
              matches(prospect.city, normalizedQuery) ||
              matches(prospect.industry, normalizedQuery),
          ),
          companies: state.companies.filter(
            (company) =>
              matches(company.name, normalizedQuery) ||
              matches(company.domain, normalizedQuery) ||
              matches(company.industry, normalizedQuery) ||
              matches(company.city, normalizedQuery),
          ),
          lists: state.lists.filter((list) => matches(list.name, normalizedQuery) || matches(list.description, normalizedQuery)),
          deals: state.deals.filter((deal) => matches(deal.name, normalizedQuery)),
          tasks: state.tasks.filter((task) => matches(task.title, normalizedQuery) || matches(task.description, normalizedQuery)),
          notes: state.notes.filter((note) => matches(note.body, normalizedQuery)),
        };
      },
      getDashboardMetrics: (range = "30d") => calculateDashboardMetrics(get(), range),
      getAnalytics: (range = "30d") => calculateAnalytics(get(), range),
    }),
    {
      name: STORAGE_KEY,
      version: 1,
      storage: createJSONStorage(() => (typeof window === "undefined" ? noopStorage : window.localStorage)),
    },
  ),
);

export const selectDemoSession = (state: DemoStoreState) => state.session;
export const selectDemoCurrentUser = (state: DemoStoreState) =>
  state.session ? state.users.find((user) => user.id === state.session?.userId) ?? null : null;
export const selectDemoProspects = (state: DemoStoreState) => state.prospects;
export const selectDemoCompanies = (state: DemoStoreState) => state.companies;
export const selectDemoLists = (state: DemoStoreState) => state.lists;
export const selectDemoTags = (state: DemoStoreState) => state.tags;
export const selectDemoDeals = (state: DemoStoreState) => state.deals;
export const selectDemoTasks = (state: DemoStoreState) => state.tasks;
export const selectDemoUnreadNotifications = (state: DemoStoreState) =>
  state.notifications.filter((notification) => !notification.read);

export const demoStoreSelectors = {
  session: selectDemoSession,
  currentUser: selectDemoCurrentUser,
  prospects: selectDemoProspects,
  companies: selectDemoCompanies,
  lists: selectDemoLists,
  tags: selectDemoTags,
  deals: selectDemoDeals,
  tasks: selectDemoTasks,
  unreadNotifications: selectDemoUnreadNotifications,
};
