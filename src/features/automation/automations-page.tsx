"use client";

import { useMemo, useState } from "react";
import { Badge, Button, Card, Dialog, EmptyState, Input, PageHeader, Select } from "@/components/ui/primitives";
import { evaluateAutomation } from "@/features/automation/engine";
import { useDemoStore } from "@/stores/demo-store";
import { getWhatsAppProvider } from "@/lib/providers/whatsapp";

const WORKFLOW_TEMPLATES = [
  {
    name: "Instant welcome message",
    description: "When a prospect is created, queue an official WhatsApp welcome template (Cloud API when configured).",
    trigger: "Prospect created",
    conditions: ["source in Website, Facebook, Import"],
    actions: ["Send WhatsApp welcome template", "Create follow-up task due in 1 day", "Notify owner"],
  },
  {
    name: "Automatic lead distribution",
    description: "Round-robin assign new inbound leads to eligible sales reps.",
    trigger: "Prospect created",
    conditions: ["owner is unassigned OR source is inbound"],
    actions: ["Assign owner round-robin", "Notify assigned rep", "Create first-call task"],
  },
  {
    name: "Overdue follow-up nudge",
    description: "When a follow-up task becomes overdue, notify the owner and escalate.",
    trigger: "Task overdue",
    conditions: ["task_type = FOLLOW_UP"],
    actions: ["Notify owner", "Create escalation notification for manager"],
  },
  {
    name: "Qualified → meeting workflow",
    description: "When status becomes Qualified, create a meeting task and optional WhatsApp confirmation.",
    trigger: "Status changed to Qualified",
    conditions: ["status = qualified"],
    actions: ["Create meeting task", "Send WhatsApp template (official API)", "Add High Intent tag"],
  },
] as const;

export function AutomationsWorkspacePage() {
  const store = useDemoStore();
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [trigger, setTrigger] = useState("Prospect created");
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const enabledCount = useMemo(() => store.automations.filter((item) => item.enabled).length, [store.automations]);

  async function runWelcomeBatch() {
    setBusy(true);
    setMessage(null);
    try {
      const provider = await getWhatsAppProvider();
      const targets = store.prospects.filter((prospect) => prospect.status === "new" && prospect.phone).slice(0, 5);
      for (const prospect of targets) {
        await provider.sendWelcomeMessage({
          to: prospect.phone,
          prospectId: prospect.id,
          name: prospect.firstName,
        });
        store.addActivity({
          type: "emailed",
          subjectType: "prospect",
          subjectId: prospect.id,
          prospectId: prospect.id,
          summary: "Welcome message queued via WhatsApp provider (official Cloud API / demo)",
        });
        store.createNotification({
          userId: prospect.ownerId,
          title: "Welcome message queued",
          body: `Official WhatsApp welcome queued for ${prospect.fullName}`,
          read: false,
          link: `/app/prospects/${prospect.id}`,
        });
      }
      setMessage(`Queued welcome messages for ${targets.length} new prospects (demo-safe / official API only).`);
    } finally {
      setBusy(false);
    }
  }

  function installTemplate(template: (typeof WORKFLOW_TEMPLATES)[number]) {
    store.createAutomation({
      name: template.name,
      description: template.description,
      enabled: true,
      trigger: template.trigger,
      conditions: [...template.conditions],
      actions: [...template.actions],
      createdBy: store.session?.userId ?? store.users[0]?.id ?? "user-admin",
    });
  }

  return (
    <>
      <PageHeader
        title="Automations"
        description="Triggers & workflows for repetitive sales work. WhatsApp actions use official Cloud API providers only."
        actions={
          <>
            <Button type="button" variant="outline" disabled={busy} onClick={() => void runWelcomeBatch()}>
              Send welcome batch
            </Button>
            <Button type="button" onClick={() => setOpen(true)}>
              Create automation
            </Button>
          </>
        }
      />

      {message ? <Card className="mb-4 text-sm text-emerald-700">{message}</Card> : null}

      <div className="mb-6 grid gap-4 md:grid-cols-3">
        <Card>
          <p className="text-sm text-zinc-500">Active workflows</p>
          <p className="mt-1 text-3xl font-bold">{enabledCount}</p>
        </Card>
        <Card>
          <p className="text-sm text-zinc-500">Templates</p>
          <p className="mt-1 text-3xl font-bold">{WORKFLOW_TEMPLATES.length}</p>
        </Card>
        <Card>
          <p className="text-sm text-zinc-500">Evaluator</p>
          <p className="mt-1 text-sm text-zinc-600">
            Demo engine matches triggers locally. External WhatsApp/email sends require configured providers.
          </p>
        </Card>
      </div>

      <h2 className="mb-3 text-lg font-semibold">Workflow templates</h2>
      <div className="mb-8 grid gap-4 lg:grid-cols-2">
        {WORKFLOW_TEMPLATES.map((template) => (
          <Card key={template.name}>
            <h3 className="font-semibold">{template.name}</h3>
            <p className="mt-2 text-sm text-zinc-500">{template.description}</p>
            <p className="mt-3 text-xs text-zinc-500">Trigger: {template.trigger}</p>
            <Button type="button" className="mt-4" variant="outline" onClick={() => installTemplate(template)}>
              Install template
            </Button>
          </Card>
        ))}
      </div>

      <h2 className="mb-3 text-lg font-semibold">Your automations</h2>
      <div className="grid gap-4">
        {store.automations.length === 0 ? (
          <EmptyState title="No automations yet" description="Install a template or create a custom workflow." />
        ) : (
          store.automations.map((automation) => {
            const preview = evaluateAutomation(automation, { db: store, event: automation.trigger.toLowerCase() });
            return (
              <Card key={automation.id}>
                <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold">{automation.name}</h3>
                      <Badge variant={automation.enabled ? "success" : "warning"}>
                        {automation.enabled ? "Enabled" : "Disabled"}
                      </Badge>
                    </div>
                    <p className="mt-1 text-sm text-zinc-500">{automation.description}</p>
                    <p className="mt-2 text-xs text-zinc-500">
                      When {automation.trigger}: {automation.actions.join(", ")}
                    </p>
                    <p className="mt-1 text-xs text-zinc-400">
                      Evaluator preview: {preview.matched ? `${preview.actions.length} actions matched` : "no match"}
                    </p>
                  </div>
                  <Button
                    type="button"
                    variant={automation.enabled ? "primary" : "outline"}
                    onClick={() => store.updateAutomation(automation.id, { enabled: !automation.enabled })}
                  >
                    {automation.enabled ? "Enabled" : "Disabled"}
                  </Button>
                </div>
              </Card>
            );
          })
        )}
      </div>

      <Dialog open={open} onOpenChange={setOpen} title="Create automation">
        <form
          className="space-y-3"
          onSubmit={(event) => {
            event.preventDefault();
            if (!name.trim()) return;
            store.createAutomation({
              name,
              description: "Custom workflow",
              enabled: true,
              trigger,
              conditions: [],
              actions: ["Create task", "Notify owner"],
              createdBy: store.session?.userId ?? store.users[0]?.id ?? "user-admin",
            });
            setName("");
            setOpen(false);
          }}
        >
          <Input required placeholder="Automation name" value={name} onChange={(event) => setName(event.target.value)} />
          <Select value={trigger} onChange={(event) => setTrigger(event.target.value)}>
            <option>Prospect created</option>
            <option>Status changed to Qualified</option>
            <option>Task overdue</option>
            <option>Deal stage changed</option>
            <option>Lead inactive 7 days</option>
          </Select>
          <Button type="submit">Create automation</Button>
        </form>
      </Dialog>
    </>
  );
}
