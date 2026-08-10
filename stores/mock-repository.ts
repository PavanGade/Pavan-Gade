import { create } from 'zustand';

import {
  DEMO_COMPANIES,
  DEMO_DEALS,
  DEMO_LISTS,
  DEMO_ORG_ID,
  DEMO_PROSPECTS,
  DEMO_STAGES,
  DEMO_TASKS,
  type DemoProspect,
} from '@/lib/mock/demo-data';
import type { Company, Deal, Task } from '@/types/database';
import { scoreProspect } from '@/features/scoring/score-prospect';
import type { NormalizedImportRow } from '@/features/import/csv-import';

type DemoList = (typeof DEMO_LISTS)[number];

type NoteRecord = {
  id: string;
  organization_id: string;
  entity_type: 'PROSPECT' | 'COMPANY' | 'DEAL';
  prospect_id: string | null;
  company_id: string | null;
  deal_id: string | null;
  body: string;
  author_id: string | null;
  created_at: string;
  updated_at: string;
};

type ActivityRecord = {
  id: string;
  organization_id: string;
  prospect_id: string | null;
  title: string;
  activity_type: string;
  created_at: string;
};

type MockState = {
  prospects: DemoProspect[];
  companies: Company[];
  tasks: Task[];
  deals: Deal[];
  lists: DemoList[];
  stages: typeof DEMO_STAGES;
  notes: NoteRecord[];
  activities: ActivityRecord[];
  addProspect: (input: Partial<DemoProspect> & { full_name: string }) => DemoProspect;
  updateProspect: (id: string, patch: Partial<DemoProspect>) => void;
  deleteProspect: (id: string) => void;
  addCompany: (input: { name: string } & Partial<Company>) => Company;
  addTask: (input: Omit<Task, 'id' | 'created_at' | 'updated_at' | 'deleted_at' | 'completed_at'> & {
    id?: string;
  }) => Task;
  completeTask: (id: string) => void;
  addDeal: (input: Omit<Deal, 'id' | 'created_at' | 'updated_at' | 'deleted_at'> & { id?: string }) => Deal;
  moveDeal: (id: string, stageId: string) => void;
  addList: (name: string) => DemoList;
  renameList: (id: string, name: string) => void;
  archiveList: (id: string) => void;
  addToList: (listId: string, prospectId: string) => void;
  removeFromList: (listId: string, prospectId: string) => void;
  addNote: (input: Omit<NoteRecord, 'id' | 'created_at' | 'updated_at'>) => NoteRecord;
  importProspects: (rows: NormalizedImportRow[]) => number;
  search: (q: string) => {
    prospects: DemoProspect[];
    companies: Company[];
    lists: DemoList[];
    deals: Deal[];
  };
};

function id(prefix: string) {
  return `${prefix}-${Math.random().toString(36).slice(2, 10)}`;
}

export const useMockRepository = create<MockState>((set, get) => ({
  prospects: [...DEMO_PROSPECTS],
  companies: [...DEMO_COMPANIES],
  tasks: [...DEMO_TASKS],
  deals: [...DEMO_DEALS],
  lists: DEMO_LISTS.map((l) => ({ ...l, member_ids: [...l.member_ids] })),
  stages: DEMO_STAGES,
  notes: [
    {
      id: 'n-1',
      organization_id: DEMO_ORG_ID,
      entity_type: 'PROSPECT',
      prospect_id: 'p-arjun',
      company_id: null,
      deal_id: null,
      body: 'Strong fit for analytics package. Asked for ROI case study.',
      author_id: null,
      created_at: '2026-03-20T09:30:00.000Z',
      updated_at: '2026-03-20T09:30:00.000Z',
    },
  ],
  activities: [
    {
      id: 'a-1',
      organization_id: DEMO_ORG_ID,
      prospect_id: 'p-arjun',
      title: 'Prospect created',
      activity_type: 'PROSPECT_CREATED',
      created_at: '2026-03-10T08:00:00.000Z',
    },
    {
      id: 'a-2',
      organization_id: DEMO_ORG_ID,
      prospect_id: 'p-arjun',
      title: 'Status changed to Qualified',
      activity_type: 'STATUS_CHANGED',
      created_at: '2026-03-15T12:00:00.000Z',
    },
  ],

  addProspect: (input) => {
    const scored = scoreProspect({
      jobTitle: input.job_title,
      industry: input.industry,
      location: input.location,
      leadStatus: input.lead_status ?? 'NEW',
      icp: {
        targetIndustries: ['SaaS', 'D2C'],
        targetGeographies: ['Hyderabad', 'Bengaluru', 'IN'],
        jobTitles: ['Founder', 'CEO', 'CMO', 'Growth'],
        seniorities: ['C-Level', 'VP', 'Director'],
        keywords: ['saas', 'growth'],
        companySizes: [],
      },
    });
    const prospect: DemoProspect = {
      id: id('p'),
      organization_id: DEMO_ORG_ID,
      company_id: input.company_id ?? null,
      company_name: input.company_name ?? null,
      owner_id: input.owner_id ?? null,
      first_name: input.first_name ?? null,
      last_name: input.last_name ?? null,
      full_name: input.full_name,
      job_title: input.job_title ?? null,
      seniority: input.seniority ?? null,
      department: input.department ?? null,
      email: input.email ?? null,
      phone: input.phone ?? null,
      location: input.location ?? null,
      city: input.city ?? null,
      state: input.state ?? null,
      country: input.country ?? null,
      industry: input.industry ?? null,
      linkedin_url: input.linkedin_url ?? null,
      avatar_url: null,
      source: input.source ?? 'manual',
      lead_status: input.lead_status ?? 'NEW',
      lead_score: scored.score,
      last_contacted_at: null,
      next_follow_up_at: null,
      created_by: null,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      deleted_at: null,
    };
    set((s) => ({
      prospects: [prospect, ...s.prospects],
      activities: [
        {
          id: id('a'),
          organization_id: DEMO_ORG_ID,
          prospect_id: prospect.id,
          title: 'Prospect created',
          activity_type: 'PROSPECT_CREATED',
          created_at: new Date().toISOString(),
        },
        ...s.activities,
      ],
    }));
    return prospect;
  },

  updateProspect: (pid, patch) =>
    set((s) => ({
      prospects: s.prospects.map((p) =>
        p.id === pid ? { ...p, ...patch, updated_at: new Date().toISOString() } : p,
      ),
    })),

  deleteProspect: (pid) =>
    set((s) => ({
      prospects: s.prospects.filter((p) => p.id !== pid),
    })),

  addCompany: (input) => {
    const company: Company = {
      id: id('c'),
      organization_id: DEMO_ORG_ID,
      name: input.name,
      logo_url: null,
      website: input.website ?? null,
      industry: input.industry ?? null,
      headquarters: input.headquarters ?? null,
      employee_count: input.employee_count ?? null,
      revenue_range: input.revenue_range ?? null,
      description: input.description ?? null,
      technologies: input.technologies ?? [],
      created_by: null,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      deleted_at: null,
    };
    set((s) => ({ companies: [company, ...s.companies] }));
    return company;
  },

  addTask: (input) => {
    const task: Task = {
      ...input,
      id: input.id ?? id('t'),
      completed_at: null,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      deleted_at: null,
    };
    set((s) => ({
      tasks: [task, ...s.tasks],
      activities: input.prospect_id
        ? [
            {
              id: id('a'),
              organization_id: DEMO_ORG_ID,
              prospect_id: input.prospect_id,
              title: `Task created: ${task.title}`,
              activity_type: 'TASK_CREATED',
              created_at: new Date().toISOString(),
            },
            ...s.activities,
          ]
        : s.activities,
    }));
    return task;
  },

  completeTask: (tid) =>
    set((s) => {
      const task = s.tasks.find((t) => t.id === tid);
      return {
        tasks: s.tasks.map((t) =>
          t.id === tid
            ? {
                ...t,
                status: 'COMPLETED',
                completed_at: new Date().toISOString(),
                updated_at: new Date().toISOString(),
              }
            : t,
        ),
        activities:
          task?.prospect_id
            ? [
                {
                  id: id('a'),
                  organization_id: DEMO_ORG_ID,
                  prospect_id: task.prospect_id,
                  title: `Task completed: ${task.title}`,
                  activity_type: 'TASK_COMPLETED',
                  created_at: new Date().toISOString(),
                },
                ...s.activities,
              ]
            : s.activities,
      };
    }),

  addDeal: (input) => {
    const deal: Deal = {
      ...input,
      id: input.id ?? id('d'),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      deleted_at: null,
    };
    set((s) => ({
      deals: [deal, ...s.deals],
      activities: deal.prospect_id
        ? [
            {
              id: id('a'),
              organization_id: DEMO_ORG_ID,
              prospect_id: deal.prospect_id,
              title: `Deal created: ${deal.title}`,
              activity_type: 'DEAL_CREATED',
              created_at: new Date().toISOString(),
            },
            ...s.activities,
          ]
        : s.activities,
    }));
    return deal;
  },

  moveDeal: (dealId, stageId) =>
    set((s) => {
      const stage = s.stages.find((st) => st.id === stageId);
      const deal = s.deals.find((d) => d.id === dealId);
      return {
        deals: s.deals.map((d) =>
          d.id === dealId
            ? {
                ...d,
                stage_id: stageId,
                probability: stage?.probability ?? d.probability,
                updated_at: new Date().toISOString(),
              }
            : d,
        ),
        activities:
          deal?.prospect_id && stage
            ? [
                {
                  id: id('a'),
                  organization_id: DEMO_ORG_ID,
                  prospect_id: deal.prospect_id,
                  title: `Moved to ${stage.name}`,
                  activity_type: 'PIPELINE_MOVED',
                  created_at: new Date().toISOString(),
                },
                ...s.activities,
              ]
            : s.activities,
      };
    }),

  addList: (name) => {
    const list: DemoList = {
      id: id('l'),
      organization_id: DEMO_ORG_ID,
      name,
      description: null,
      color: '#0F766E',
      is_archived: false,
      member_ids: [],
    };
    set((s) => ({ lists: [list, ...s.lists] }));
    return list;
  },

  renameList: (listId, name) =>
    set((s) => ({
      lists: s.lists.map((l) => (l.id === listId ? { ...l, name } : l)),
    })),

  archiveList: (listId) =>
    set((s) => ({
      lists: s.lists.map((l) => (l.id === listId ? { ...l, is_archived: true } : l)),
    })),

  addToList: (listId, prospectId) =>
    set((s) => ({
      lists: s.lists.map((l) =>
        l.id === listId && !l.member_ids.includes(prospectId)
          ? { ...l, member_ids: [...l.member_ids, prospectId] }
          : l,
      ),
    })),

  removeFromList: (listId, prospectId) =>
    set((s) => ({
      lists: s.lists.map((l) =>
        l.id === listId ? { ...l, member_ids: l.member_ids.filter((m) => m !== prospectId) } : l,
      ),
    })),

  addNote: (input) => {
    const note: NoteRecord = {
      ...input,
      id: id('n'),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    set((s) => ({
      notes: [note, ...s.notes],
      activities: input.prospect_id
        ? [
            {
              id: id('a'),
              organization_id: DEMO_ORG_ID,
              prospect_id: input.prospect_id,
              title: 'Note added',
              activity_type: 'NOTE_ADDED',
              created_at: new Date().toISOString(),
            },
            ...s.activities,
          ]
        : s.activities,
    }));
    return note;
  },

  importProspects: (rows) => {
    let count = 0;
    for (const row of rows) {
      let companyId: string | null = null;
      let companyName: string | null = row.company ?? null;
      if (row.company) {
        const existing = get().companies.find(
          (c) => c.name.toLowerCase() === row.company!.toLowerCase(),
        );
        if (existing) {
          companyId = existing.id;
          companyName = existing.name;
        } else {
          const created = get().addCompany({ name: row.company, industry: row.industry });
          companyId = created.id;
          companyName = created.name;
        }
      }
      get().addProspect({
        ...row,
        company_id: companyId,
        company_name: companyName,
        source: 'csv_import',
      });
      count += 1;
    }
    return count;
  },

  search: (q) => {
    const needle = q.trim().toLowerCase();
    if (!needle) {
      return { prospects: [], companies: [], lists: [], deals: [] };
    }
    const { prospects, companies, lists, deals } = get();
    return {
      prospects: prospects.filter((p) =>
        [p.full_name, p.job_title, p.company_name, p.email].join(' ').toLowerCase().includes(needle),
      ),
      companies: companies.filter((c) =>
        [c.name, c.industry, c.headquarters].join(' ').toLowerCase().includes(needle),
      ),
      lists: lists.filter((l) => l.name.toLowerCase().includes(needle)),
      deals: deals.filter((d) => d.title.toLowerCase().includes(needle)),
    };
  },
}));

export function getDashboardMetrics(state: MockState) {
  const prospects = state.prospects;
  const tasks = state.tasks;
  const deals = state.deals;
  const today = new Date();
  const startOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate()).getTime();
  const endOfDay = startOfDay + 86400000;

  return {
    totalProspects: prospects.length,
    newProspects: prospects.filter((p) => p.lead_status === 'NEW').length,
    contacted: prospects.filter((p) =>
      ['CONTACTED', 'ENGAGED', 'QUALIFIED'].includes(p.lead_status),
    ).length,
    replies: prospects.filter((p) => ['ENGAGED', 'QUALIFIED'].includes(p.lead_status)).length,
    qualified: prospects.filter((p) => p.lead_status === 'QUALIFIED').length,
    meetings: deals.filter((d) => d.stage_id === 's-meeting').length,
    opportunities: deals.filter((d) => !['s-won', 's-lost'].includes(d.stage_id)).length,
    wonDeals: deals.filter((d) => d.stage_id === 's-won').length,
    tasksDueToday: tasks.filter((t) => {
      if (t.status === 'COMPLETED' || !t.due_at) return false;
      const due = new Date(t.due_at).getTime();
      return due >= startOfDay && due < endOfDay;
    }),
    overdueTasks: tasks.filter((t) => {
      if (t.status === 'COMPLETED' || !t.due_at) return false;
      return new Date(t.due_at).getTime() < startOfDay;
    }),
    recentProspects: [...prospects]
      .sort((a, b) => b.created_at.localeCompare(a.created_at))
      .slice(0, 5),
    pipelineValue: deals
      .filter((d) => !['s-won', 's-lost'].includes(d.stage_id))
      .reduce((sum, d) => sum + d.value_cents, 0),
  };
}
