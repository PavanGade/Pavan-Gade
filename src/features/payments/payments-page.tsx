"use client";

import { useMemo, useState } from "react";
import { Badge, Button, Card, EmptyState, Input, PageHeader, Select, Table } from "@/components/ui/primitives";
import type { DemoDeal } from "@/lib/demo/types";
import { formatCurrency } from "@/lib/format";
import { useDemoStore } from "@/stores/demo-store";

type PaymentStatus = "pending" | "paid" | "failed";

interface PaymentOpportunity {
  id: string;
  prospectId: string;
  dealId: string;
  amount: number;
  status: PaymentStatus;
  createdAt: string;
}

export function PaymentsPage() {
  const store = useDemoStore();
  const [payments, setPayments] = useState<PaymentOpportunity[]>([]);
  const [form, setForm] = useState({
    prospectId: store.prospects[0]?.id ?? "",
    dealId: store.deals[0]?.id ?? "",
    amount: store.deals[0]?.value ? String(store.deals[0].value) : "10000",
    status: "pending" as PaymentStatus,
  });

  const dealRows = useMemo(
    () =>
      store.deals.map((deal) => ({
        deal,
        status: paymentStatusForDeal(deal),
        prospectName: store.prospects.find((prospect) => prospect.id === deal.prospectId)?.fullName ?? "Unknown prospect",
      })),
    [store.deals, store.prospects],
  );
  const allForecastRows = [
    ...dealRows.map((row) => ({ amount: row.deal.value, status: row.status })),
    ...payments.map((payment) => ({ amount: payment.amount, status: payment.status })),
  ];
  const pending = allForecastRows.filter((row) => row.status === "pending").reduce((sum, row) => sum + row.amount, 0);
  const paid = allForecastRows.filter((row) => row.status === "paid").reduce((sum, row) => sum + row.amount, 0);

  const submitPayment = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const selectedDeal = store.deals.find((deal) => deal.id === form.dealId);
    const selectedProspect = store.prospects.find((prospect) => prospect.id === form.prospectId);
    const amount = Number(form.amount) || selectedDeal?.value || 0;
    const payment: PaymentOpportunity = {
      id: `payment-${Date.now()}`,
      prospectId: form.prospectId,
      dealId: form.dealId,
      amount,
      status: form.status,
      createdAt: new Date().toISOString(),
    };

    setPayments((items) => [payment, ...items]);
    if (selectedDeal) {
      store.updateDeal(selectedDeal.id, {
        probability: form.status === "paid" ? 100 : form.status === "failed" ? 0 : Math.max(selectedDeal.probability, 50),
        status: form.status === "paid" ? "won" : form.status === "failed" ? "lost" : selectedDeal.status,
      });
      store.createNote({
        body: `Payment opportunity ${form.status} for ${formatCurrency(amount, selectedDeal.currency)}.`,
        authorId: store.session?.userId ?? store.users[0]?.id ?? "user-admin",
        prospectId: selectedDeal.prospectId,
        companyId: selectedDeal.companyId,
        dealId: selectedDeal.id,
      });
    }
    store.createNotification({
      userId: store.users.find((user) => user.role === "admin")?.id ?? store.users[0]?.id ?? "user-admin",
      title: "Payment opportunity created",
      body: `${selectedProspect?.fullName ?? "A prospect"} has a ${form.status} payment opportunity for ${formatCurrency(amount)}.`,
      read: false,
      link: "/app/payments",
    });
    setForm((current) => ({ ...current, amount: selectedDeal?.value ? String(selectedDeal.value) : current.amount }));
  };

  return (
    <>
      <PageHeader title="Payments" description="Create payment opportunities and forecast pending versus paid revenue." />
      <div className="grid gap-4 md:grid-cols-2">
        <MetricCard label="Pending forecast" value={formatCurrency(pending)} />
        <MetricCard label="Paid forecast" value={formatCurrency(paid)} />
      </div>
      <div className="mt-6 grid gap-6 xl:grid-cols-[1fr_380px]">
        <div className="space-y-6">
          <Card>
            <h2 className="font-semibold">Deals payment status</h2>
            <Table className="mt-4">
              <thead>
                <tr className="border-b border-zinc-100 text-left text-xs uppercase text-zinc-500">
                  <th className="py-3 pr-3">Deal</th>
                  <th className="py-3 pr-3">Prospect</th>
                  <th className="py-3 pr-3">Amount</th>
                  <th className="py-3">Payment</th>
                </tr>
              </thead>
              <tbody>
                {dealRows.map((row) => (
                  <tr key={row.deal.id} className="border-b border-zinc-100">
                    <td className="py-3 pr-3 font-medium">{row.deal.name}</td>
                    <td className="py-3 pr-3">{row.prospectName}</td>
                    <td className="py-3 pr-3">{formatCurrency(row.deal.value, row.deal.currency)}</td>
                    <td className="py-3"><PaymentBadge status={row.status} /></td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </Card>
          <Card>
            <h2 className="font-semibold">Payment opportunities</h2>
            {payments.length ? (
              <Table className="mt-4">
                <thead><tr className="border-b border-zinc-100 text-left text-xs uppercase text-zinc-500"><th className="py-3 pr-3">Prospect</th><th className="py-3 pr-3">Amount</th><th className="py-3">Status</th></tr></thead>
                <tbody>{payments.map((payment) => <tr key={payment.id} className="border-b border-zinc-100"><td className="py-3 pr-3">{store.prospects.find((prospect) => prospect.id === payment.prospectId)?.fullName ?? "Unknown prospect"}</td><td className="py-3 pr-3">{formatCurrency(payment.amount)}</td><td className="py-3"><PaymentBadge status={payment.status} /></td></tr>)}</tbody>
              </Table>
            ) : <EmptyState title="No local payment opportunities" description="Create one from the form to track it in this browser session." />}
          </Card>
        </div>
        <Card className="h-fit">
          <h2 className="font-semibold">Create payment opportunity</h2>
          <form className="mt-4 space-y-3" onSubmit={submitPayment}>
            <Select value={form.prospectId} onChange={(event) => setForm({ ...form, prospectId: event.target.value })}>
              {store.prospects.map((prospect) => <option key={prospect.id} value={prospect.id}>{prospect.fullName}</option>)}
            </Select>
            <Select value={form.dealId} onChange={(event) => {
              const deal = store.deals.find((candidate) => candidate.id === event.target.value);
              setForm({
                ...form,
                dealId: event.target.value,
                prospectId: deal?.prospectId ?? form.prospectId,
                amount: deal?.value ? String(deal.value) : form.amount,
              });
            }}>
              {store.deals.map((deal) => <option key={deal.id} value={deal.id}>{deal.name}</option>)}
            </Select>
            <Input required type="number" min="0" step="100" value={form.amount} onChange={(event) => setForm({ ...form, amount: event.target.value })} />
            <Select value={form.status} onChange={(event) => setForm({ ...form, status: event.target.value as PaymentStatus })}>
              <option value="pending">Pending</option>
              <option value="paid">Paid</option>
              <option value="failed">Failed</option>
            </Select>
            <Button type="submit" className="w-full">Create payment</Button>
          </form>
        </Card>
      </div>
    </>
  );
}

function paymentStatusForDeal(deal: DemoDeal): PaymentStatus {
  const explicit = (deal as DemoDeal & { paymentStatus?: PaymentStatus }).paymentStatus;
  if (explicit) return explicit;
  if (deal.status === "won") return "paid";
  if (deal.status === "lost") return "failed";
  return "pending";
}

function PaymentBadge({ status }: { status: PaymentStatus }) {
  return <Badge variant={status === "paid" ? "success" : status === "failed" ? "danger" : "warning"}>{status}</Badge>;
}

function MetricCard({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <Card>
      <p className="text-sm text-zinc-500">{label}</p>
      <div className="mt-2 text-2xl font-semibold">{value}</div>
    </Card>
  );
}
