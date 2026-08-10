import type {
  ConnectedFacebookPage,
  FacebookLead,
  FacebookLeadProvider,
  SyncFacebookLeadsInput,
  SyncFacebookLeadsResult,
} from "./types";

const DEMO_LEADS: FacebookLead[] = [
  {
    fullName: "DEMO: Maya Fictional",
    email: "maya.fictional@example.com",
    phone: "+15550101001",
    source: "facebook",
  },
  {
    fullName: "DEMO: Leo Sample",
    email: "leo.demo@example.com",
    phone: "+15550101002",
    source: "facebook",
  },
  {
    fullName: "DEMO: Priya Sample",
    phone: "+15550101003",
    source: "facebook",
  },
];

export class DemoFacebookLeadProvider implements FacebookLeadProvider {
  async listConnectedPages(): Promise<ConnectedFacebookPage[]> {
    return [
      {
        id: "demo-facebook-page-1",
        name: "DEMO: PRSPCT Sample Page",
        connected: true,
      },
      {
        id: "demo-facebook-page-2",
        name: "DEMO: Unconnected Sample Page",
        connected: false,
      },
    ];
  }

  async syncLeads(input: SyncFacebookLeadsInput = {}): Promise<SyncFacebookLeadsResult> {
    if (input.since instanceof Date && Number.isNaN(input.since.getTime())) {
      throw new Error("A valid since date is required to sync demo Facebook leads.");
    }

    if (typeof input.since === "string" && input.since.trim().length === 0) {
      throw new Error("A non-empty since value is required to sync demo Facebook leads.");
    }

    const leads = DEMO_LEADS.map((lead) => ({ ...lead }));

    return {
      imported: leads.length,
      leads,
      demo: true,
    };
  }
}
