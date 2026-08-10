"use client";

import { useMemo, useState } from "react";
import { toast } from "sonner";
import { Badge, Button, Card, EmptyState, PageHeader, Select } from "@/components/ui/primitives";
import { pickNextOwner } from "@/lib/distribution/lead-distribution";
import { getFacebookLeadProvider } from "@/lib/providers/facebook-leads";
import { getPushProvider } from "@/lib/providers/push";
import { getTelephonyProvider } from "@/lib/providers/telephony";
import { getWhatsAppProvider } from "@/lib/providers/whatsapp";
import { useDemoStore } from "@/stores/demo-store";

type DistributionStrategy = "round_robin" | "manual";

interface DistributionSettings {
  strategy: DistributionStrategy;
  agentIds: string[];
  lastIndex: number;
}

const storageKey = "prspct-lead-distribution";

export function IntegrationsPage() {
  const store = useDemoStore();
  const [settings, setSettings] = useState<DistributionSettings>(() =>
    readStoredDistributionSettings(store.users.map((user) => user.id)),
  );
  const [whatsAppStatus, setWhatsAppStatus] = useState(
    "DEMO: WhatsApp templates are prepared only through the official Meta Cloud API provider interface.",
  );
  const [pushStatus, setPushStatus] = useState("Not requested");

  const eligibleAgents = useMemo(
    () => store.users.filter((user) => settings.agentIds.includes(user.id)),
    [settings.agentIds, store.users],
  );
  const previewOwner = settings.strategy === "round_robin" && settings.agentIds.length
    ? pickNextOwner(settings.agentIds, settings.lastIndex)
    : null;

  const saveDistribution = () => {
    window.localStorage.setItem(storageKey, JSON.stringify(settings));
    toast.success("Lead distribution settings saved");
  };

  const syncFacebookLeads = async () => {
    const provider = getFacebookLeadProvider();
    const result = await provider.syncLeads();
    let created = 0;
    result.leads.forEach((lead) => {
      const leadEmail = lead.email?.toLowerCase();

      if (leadEmail && store.prospects.some((prospect) => prospect.email.toLowerCase() === leadEmail)) return;

      const { firstName, lastName } = splitFullName(lead.fullName);
      const companyName = "DEMO Facebook Lead Ads";
      let company = store.companies.find((candidate) => candidate.name === companyName);

      if (!company) {
        company = store.createCompany({
          name: companyName,
          domain: "demo-facebook-lead-ads.example",
          website: "",
          industry: "Unknown",
          description: "Imported from Facebook Lead Capture demo.",
          employeeCount: 0,
          revenue: 0,
          country: "",
          state: "",
          city: "",
          technologies: [],
          foundedYear: 2024,
          source: "facebook",
        });
      }
      const ownerId = previewOwner?.ownerId ?? store.users[0]?.id ?? "user-admin";
      store.createProspect({
        firstName,
        lastName,
        jobTitle: "Facebook Lead",
        seniority: "Unknown",
        department: "Unknown",
        email: lead.email ?? "",
        phone: lead.phone ?? "",
        city: "",
        country: "",
        industry: company.industry,
        source: "facebook",
        status: "new",
        ownerId,
        companyId: company.id,
        tagIds: [],
      });
      created += 1;
    });
    toast.success(created ? `Synced ${created} Facebook leads` : "No new Facebook leads to sync");
  };

  const sendWhatsAppTest = async () => {
    const prospect = store.prospects[0];
    if (!prospect) {
      setWhatsAppStatus("No prospect available for a test welcome.");
      return;
    }
    const provider = getWhatsAppProvider();
    const result = await provider.sendWelcomeMessage({
      to: prospect.phone,
      prospectId: prospect.id,
      name: prospect.fullName,
    });
    const summary = `DEMO: WhatsApp welcome ${result.status} for ${prospect.fullName} (${result.messageId}).`;
    store.addActivity({
      type: "note",
      subjectType: "prospect",
      subjectId: prospect.id,
      summary,
      prospectId: prospect.id,
      companyId: prospect.companyId,
      metadata: { provider: "whatsapp", demo: result.demo },
    });
    setWhatsAppStatus(summary);
    toast.success("WhatsApp welcome test prepared");
  };

  const requestPush = async () => {
    const result = await getPushProvider().requestPermission();
    setPushStatus(
      result.permission === "unsupported" ? "Push notifications unsupported in this browser" : `Permission: ${result.permission}`,
    );
  };

  return (
    <>
      <PageHeader title="Integrations" description="Demo-safe provider status, lead capture, and lead distribution controls." />
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        <IntegrationCard title="Facebook Lead Capture" status="Demo source" action={<Button type="button" onClick={syncFacebookLeads}>Sync demo leads</Button>}>
          Pulls sample Facebook leads into PRSPCT with source set to facebook.
        </IntegrationCard>
        <IntegrationCard title="WhatsApp Cloud API" status="Demo" action={<Button type="button" variant="outline" onClick={sendWhatsAppTest}>Send test welcome</Button>}>
          {whatsAppStatus}
        </IntegrationCard>
        <IntegrationCard title="Telephony" status="Demo provider">
          {getTelephonyProvider().name} supports demo click-to-call, autodial queue IDs, and unavailable recording checks.
        </IntegrationCard>
        <IntegrationCard title="SMS" status="Deep links">
          DEMO: SMS sending stays behind the provider interface; prospect records can open device SMS composer links.
        </IntegrationCard>
        <IntegrationCard title="Custom API" status="Docs">
          Connect external systems through <a className="underline" href="/docs/api#prospects">/api/v1/prospects</a>.
        </IntegrationCard>
        <IntegrationCard title="Push Notifications" status={pushStatus} action={<Button type="button" variant="outline" onClick={requestPush}>Request permission</Button>}>
          Browser notification permission is requested directly from the user.
        </IntegrationCard>
      </div>
      <Card className="mt-6">
        <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
          <div>
            <h2 className="font-semibold">Automatic Lead Distribution</h2>
            <p className="text-sm text-zinc-500">Settings are saved locally for the demo workspace.</p>
          </div>
          <Button type="button" onClick={saveDistribution}>Save</Button>
        </div>
        <div className="mt-4 grid gap-4 lg:grid-cols-[260px_1fr]">
          <div>
            <label className="text-sm font-medium" htmlFor="strategy">Strategy</label>
            <Select id="strategy" className="mt-2" value={settings.strategy} onChange={(event) => setSettings({ ...settings, strategy: event.target.value as DistributionStrategy })}>
              <option value="round_robin">Round robin</option>
              <option value="manual">Manual</option>
            </Select>
            {previewOwner ? <p className="mt-3 text-sm text-zinc-500">Next owner: {store.users.find((user) => user.id === previewOwner.ownerId)?.name}</p> : null}
          </div>
          <div>
            <p className="text-sm font-medium">Eligible agent ids</p>
            <div className="mt-2 grid gap-2 md:grid-cols-2">
              {store.users.map((user) => (
                <label key={user.id} className="flex items-center gap-3 rounded-xl border border-zinc-100 p-3 text-sm">
                  <input
                    type="checkbox"
                    checked={settings.agentIds.includes(user.id)}
                    onChange={(event) => {
                      setSettings((current) => ({
                        ...current,
                        agentIds: event.target.checked ? [...current.agentIds, user.id] : current.agentIds.filter((id) => id !== user.id),
                      }));
                    }}
                  />
                  <span>{user.name}</span>
                  <span className="ml-auto text-xs text-zinc-500">{user.id}</span>
                </label>
              ))}
            </div>
            {eligibleAgents.length === 0 ? <EmptyState title="No eligible agents selected" description="Select at least one user for round-robin distribution." /> : null}
          </div>
        </div>
      </Card>
    </>
  );
}

function readStoredDistributionSettings(defaultAgentIds: string[]): DistributionSettings {
  const defaultSettings: DistributionSettings = {
    strategy: "round_robin",
    agentIds: defaultAgentIds,
    lastIndex: -1,
  };

  if (typeof window === "undefined") {
    return defaultSettings;
  }

  const saved = window.localStorage.getItem(storageKey);

  if (!saved) {
    return defaultSettings;
  }

  try {
    const parsed: unknown = JSON.parse(saved);

    return isDistributionSettings(parsed) ? parsed : defaultSettings;
  } catch {
    return defaultSettings;
  }
}

function isDistributionSettings(value: unknown): value is DistributionSettings {
  if (typeof value !== "object" || value === null) {
    return false;
  }

  const record = value as Record<string, unknown>;

  return (
    (record.strategy === "round_robin" || record.strategy === "manual") &&
    Array.isArray(record.agentIds) &&
    record.agentIds.every((agentId) => typeof agentId === "string") &&
    typeof record.lastIndex === "number"
  );
}

function splitFullName(fullName: string): { firstName: string; lastName: string } {
  const [firstName = "Facebook", ...rest] = fullName.trim().split(/\s+/);
  const lastName = rest.join(" ");

  return {
    firstName,
    lastName: lastName || "Lead",
  };
}

function IntegrationCard({
  title,
  status,
  action,
  children,
}: {
  title: string;
  status: string;
  action?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <Card>
      <div className="flex items-start justify-between gap-3">
        <div>
          <h2 className="font-semibold">{title}</h2>
          <Badge className="mt-2" variant={status.toLowerCase().includes("configured") ? "success" : "warning"}>{status}</Badge>
        </div>
        {action}
      </div>
      <p className="mt-4 text-sm text-zinc-500">{children}</p>
    </Card>
  );
}
