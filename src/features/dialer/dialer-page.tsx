"use client";

import { useMemo, useState } from "react";
import { Badge, Button, Card, EmptyState, Input, PageHeader, Select, Table } from "@/components/ui/primitives";
import type { DemoProspect } from "@/lib/demo/types";
import { normalizePhone } from "@/lib/format";
import { buildSmsDeepLink } from "@/lib/providers/sms";
import { getTelephonyProvider } from "@/lib/providers/telephony";
import { useDemoStore } from "@/stores/demo-store";

interface CallLogEntry {
  id: string;
  prospectId: string;
  prospectName: string;
  outcome: string;
  callId: string;
  createdAt: string;
}

const queuePriority: Record<string, number> = {
  new: 0,
  contacted: 1,
  engaged: 2,
};

export function DialerPage() {
  const store = useDemoStore();
  const [queueSize, setQueueSize] = useState("5");
  const [queueIds, setQueueIds] = useState<string[]>([]);
  const [queueIndex, setQueueIndex] = useState(0);
  const [callLogs, setCallLogs] = useState<CallLogEntry[]>([]);
  const [lastCallId, setLastCallId] = useState("");
  const [providerMessage, setProviderMessage] = useState("");
  const [recordingMessage, setRecordingMessage] = useState("");
  const [followUpDate, setFollowUpDate] = useState("2026-08-11T15:00");

  const callableProspects = useMemo(
    () =>
      store.prospects
        .filter((prospect) => Boolean(normalizePhone(prospect.phone)))
        .sort((left, right) => {
          const leftPriority = queuePriority[left.status] ?? 9;
          const rightPriority = queuePriority[right.status] ?? 9;
          return leftPriority - rightPriority || new Date(right.createdAt).getTime() - new Date(left.createdAt).getTime();
        }),
    [store.prospects],
  );
  const queuedProspects = queueIds.map((id) => store.prospects.find((prospect) => prospect.id === id)).filter(Boolean) as DemoProspect[];
  const currentProspect = queuedProspects[queueIndex] ?? callableProspects[0];

  const startQueue = async () => {
    const size = Math.max(1, Number(queueSize) || 5);
    const nextQueue = callableProspects.slice(0, size).map((prospect) => prospect.id);
    setQueueIds(nextQueue);
    setQueueIndex(0);
    setProviderMessage("");
    if (nextQueue.length > 0) {
      const provider = getTelephonyProvider();
      const result = await provider.startAutodialQueue({
        prospectIds: nextQueue,
        userId: store.session?.userId ?? store.users[0]?.id ?? "user-admin",
      });
      setProviderMessage(`Demo autodial queue ${result.queueId} loaded with ${result.size} prospects.`);
    }
  };

  const clickToCall = async (prospect: DemoProspect) => {
    const provider = getTelephonyProvider();
    const result = await provider.clickToCall({
      phone: prospect.phone,
      prospectId: prospect.id,
      userId: store.session?.userId ?? store.users[0]?.id ?? "user-admin",
    });
    setLastCallId(result.callId);
    setProviderMessage(`${provider.name}: ${result.status}`);
  };

  const logCall = (prospect: DemoProspect) => {
    const createdAt = new Date().toISOString();
    const callId = lastCallId || `manual-call-${Date.now()}`;
    store.addActivity({
      type: "called",
      subjectType: "prospect",
      subjectId: prospect.id,
      summary: `Logged call with ${prospect.fullName}.`,
      prospectId: prospect.id,
      companyId: prospect.companyId,
      metadata: { callId, outcome: "connected" },
      createdAt,
    });
    store.updateProspect(prospect.id, { status: prospect.status === "new" ? "contacted" : prospect.status, lastContactedAt: createdAt });
    setCallLogs((logs) => [{ id: `${callId}-${createdAt}`, prospectId: prospect.id, prospectName: prospect.fullName, outcome: "Connected", callId, createdAt }, ...logs]);
    setLastCallId(callId);
    if (queueIds.length > 0) {
      setQueueIndex((index) => Math.min(index + 1, queueIds.length - 1));
    }
  };

  const fetchRecording = async () => {
    if (!lastCallId) {
      setRecordingMessage("Log or start a call before checking for a recording.");
      return;
    }
    const result = await getTelephonyProvider().getRecording({ callId: lastCallId });
    setRecordingMessage(result.available && result.url ? result.url : "DEMO unavailable: no recording exists for demo calls.");
  };

  const createFollowUp = (prospect: DemoProspect) => {
    store.createTask({
      title: `FOLLOW_UP: ${prospect.fullName}`,
      description: "Follow up after dialer call.",
      status: "todo",
      priority: "medium",
      dueDate: new Date(followUpDate).toISOString(),
      assignedTo: prospect.ownerId,
      prospectId: prospect.id,
      companyId: prospect.companyId,
    });
    setProviderMessage(`Follow-up reminder created for ${prospect.fullName}.`);
  };

  return (
    <>
      <PageHeader title="Dialer" description="Prioritized calling queue with demo-safe TeleCRM-style actions." />
      <div className="grid gap-6 xl:grid-cols-[360px_1fr]">
        <Card className="h-fit">
          <div className="flex items-center justify-between">
            <h2 className="font-semibold">Call queue</h2>
            <Badge>{callableProspects.length}</Badge>
          </div>
          <div className="mt-4 flex gap-2">
            <Select value={queueSize} onChange={(event) => setQueueSize(event.target.value)}>
              <option value="3">Next 3</option>
              <option value="5">Next 5</option>
              <option value="10">Next 10</option>
            </Select>
            <Button type="button" onClick={startQueue}>Start queue</Button>
          </div>
          <div className="mt-4 space-y-2">
            {(queuedProspects.length ? queuedProspects : callableProspects.slice(0, 10)).map((prospect, index) => (
              <button
                key={prospect.id}
                type="button"
                onClick={() => {
                  setQueueIds((ids) => ids.length ? ids : callableProspects.slice(0, 10).map((item) => item.id));
                  setQueueIndex(index);
                }}
                className="w-full rounded-xl border border-zinc-100 p-3 text-left text-sm hover:border-zinc-300"
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="font-medium">{prospect.fullName}</span>
                  <Badge variant={index === queueIndex && queueIds.length ? "success" : "outline"}>{prospect.status}</Badge>
                </div>
                <p className="mt-1 text-xs text-zinc-500">{prospect.phone}</p>
              </button>
            ))}
          </div>
        </Card>
        <div className="space-y-6">
          {currentProspect ? (
            <CurrentProspectCard prospect={currentProspect} onClickToCall={clickToCall} onLogCall={logCall} />
          ) : (
            <EmptyState title="No callable prospects" description="Add phone numbers to prospects to build a queue." />
          )}
          {providerMessage ? <Card><p className="text-sm text-zinc-600">{providerMessage}</p></Card> : null}
          {currentProspect ? (
            <Card>
              <h2 className="font-semibold">Follow-up reminder</h2>
              <div className="mt-4 flex flex-col gap-3 sm:flex-row">
                <Input type="datetime-local" value={followUpDate} onChange={(event) => setFollowUpDate(event.target.value)} />
                <Button type="button" onClick={() => createFollowUp(currentProspect)}>Create FOLLOW_UP task</Button>
              </div>
            </Card>
          ) : null}
          <Card>
            <div className="flex items-center justify-between gap-3">
              <h2 className="font-semibold">Recording</h2>
              <Button type="button" variant="outline" onClick={fetchRecording}>Fetch recording</Button>
            </div>
            {recordingMessage ? (
              recordingMessage.startsWith("http") ? <a className="mt-3 block text-sm underline" href={recordingMessage}>Recording link</a> : <p className="mt-3 text-sm text-zinc-500">{recordingMessage}</p>
            ) : <p className="mt-3 text-sm text-zinc-500">Recordings are only returned when a configured telephony provider has one.</p>}
          </Card>
          <CallLogTable logs={callLogs} />
        </div>
      </div>
    </>
  );
}

function CurrentProspectCard({
  prospect,
  onClickToCall,
  onLogCall,
}: {
  prospect: DemoProspect;
  onClickToCall: (prospect: DemoProspect) => Promise<void>;
  onLogCall: (prospect: DemoProspect) => void;
}) {
  const phone = normalizePhone(prospect.phone) ?? prospect.phone;
  const whatsappText = `Hi ${prospect.fullName}, welcome to PRSPCT. Reply here when you are ready to connect with our team.`;
  const smsHref = buildSmsDeepLink(phone, `Hi ${prospect.fullName}, following up from PRSPCT.`);
  const whatsappHref = `https://wa.me/${phone.replace(/\D/g, "")}?text=${encodeURIComponent(whatsappText)}`;

  return (
    <Card>
      <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
        <div>
          <h2 className="text-xl font-semibold">{prospect.fullName}</h2>
          <p className="text-sm text-zinc-500">{prospect.jobTitle} · {prospect.phone}</p>
          <div className="mt-3 flex gap-2"><Badge>{prospect.status}</Badge><Badge variant="warning">{prospect.leadTemperature}</Badge></div>
        </div>
        <div className="grid gap-2 sm:grid-cols-2">
          <a className="inline-flex h-10 items-center justify-center rounded-lg border border-zinc-200 px-4 text-sm" href={`tel:${phone}`} onClick={() => void onClickToCall(prospect)}>Click-to-call</a>
          <a className="inline-flex h-10 items-center justify-center rounded-lg border border-zinc-200 px-4 text-sm" href={whatsappHref} target="_blank" rel="noreferrer">WhatsApp</a>
          <a className="inline-flex h-10 items-center justify-center rounded-lg border border-zinc-200 px-4 text-sm" href={smsHref}>SMS</a>
          <a className="inline-flex h-10 items-center justify-center rounded-lg border border-zinc-200 px-4 text-sm" href={`mailto:${prospect.email}`}>Email</a>
          <Button type="button" className="sm:col-span-2" onClick={() => onLogCall(prospect)}>Log call and advance</Button>
        </div>
      </div>
    </Card>
  );
}

function CallLogTable({ logs }: { logs: CallLogEntry[] }) {
  if (logs.length === 0) {
    return <EmptyState title="No calls logged" description="Logged calls appear here and in the activity timeline." />;
  }

  return (
    <Card>
      <h2 className="font-semibold">Call log</h2>
      <Table className="mt-4">
        <thead><tr className="border-b border-zinc-100 text-left text-xs uppercase text-zinc-500"><th className="py-3 pr-3">Prospect</th><th className="py-3 pr-3">Outcome</th><th className="py-3 pr-3">Call ID</th><th className="py-3">Time</th></tr></thead>
        <tbody>{logs.map((log) => <tr key={log.id} className="border-b border-zinc-100"><td className="py-3 pr-3">{log.prospectName}</td><td className="py-3 pr-3">{log.outcome}</td><td className="py-3 pr-3">{log.callId}</td><td className="py-3">{new Date(log.createdAt).toLocaleString()}</td></tr>)}</tbody>
      </Table>
    </Card>
  );
}
