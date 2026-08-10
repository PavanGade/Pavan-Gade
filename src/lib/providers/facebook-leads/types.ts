export interface ConnectedFacebookPage {
  id: string;
  name: string;
  connected: boolean;
}

export interface SyncFacebookLeadsInput {
  since?: Date | string;
}

export interface FacebookLead {
  fullName: string;
  email?: string;
  phone?: string;
  source: "facebook";
}

export interface SyncFacebookLeadsResult {
  imported: number;
  leads: FacebookLead[];
  demo: boolean;
}

export interface FacebookLeadProvider {
  listConnectedPages(): Promise<ConnectedFacebookPage[]>;
  syncLeads(input?: SyncFacebookLeadsInput): Promise<SyncFacebookLeadsResult>;
}
