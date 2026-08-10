"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Badge, Button, Card, Input, PageHeader, Select } from "@/components/ui/primitives";
import { useDemoStore } from "@/stores/demo-store";

const faqs = [
  {
    question: "How do I import leads?",
    answer: "Open Prospects, choose Import, upload a CSV, review validation results, and import valid rows into the demo CRM.",
  },
  {
    question: "Can PRSPCT send WhatsApp messages automatically?",
    answer: "Demo mode prepares welcome copy only. A configured WhatsApp Cloud API provider is required before any real message can be sent.",
  },
  {
    question: "Where do I manage billing?",
    answer: "Use Billing for demo plan and checkout flows. Demo checkout never fakes a successful payment.",
  },
  {
    question: "How do I assign new leads?",
    answer: "Use Integrations to save automatic lead distribution settings or assign owners manually from prospect records.",
  },
];

export default function SupportPage() {
  const store = useDemoStore();
  const [openFaq, setOpenFaq] = useState(faqs[0]?.question ?? "");
  const [form, setForm] = useState({ subject: "", category: "Question", body: "" });

  const submitTicket = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const admin = store.users.find((user) => user.role === "admin") ?? store.users[0];
    store.createNotification({
      userId: admin?.id ?? "user-admin",
      title: `Support ticket: ${form.subject}`,
      body: `${form.category}: ${form.body}`,
      read: false,
      link: "/app/support",
    });
    store.addActivity({
      type: "note",
      subjectType: "organization",
      subjectId: store.organization.id,
      summary: `Support ticket submitted: ${form.subject}`,
      metadata: { category: form.category },
    });
    toast.success("Support ticket submitted");
    setForm({ subject: "", category: "Question", body: "" });
  };

  return (
    <>
      <PageHeader title="Tech Support" description="Demo support desk for setup, onboarding, and product questions." />
      <div className="grid gap-6 xl:grid-cols-[1fr_380px]">
        <div className="space-y-6">
          <Card>
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h2 className="font-semibold">Support hours</h2>
                <p className="text-sm text-zinc-500">9:00 AM - 5:00 PM</p>
              </div>
              <Badge variant="success">Business hours</Badge>
            </div>
          </Card>
          <div className="grid gap-4 md:grid-cols-3">
            <Card>
              <h2 className="font-semibold">Chat</h2>
              <p className="mt-2 text-sm text-zinc-500">Start an in-app support conversation during support hours.</p>
              <Button type="button" className="mt-4" variant="outline" onClick={() => toast.success("Demo chat request queued")}>Open chat</Button>
            </Card>
            <Card>
              <h2 className="font-semibold">Email</h2>
              <p className="mt-2 text-sm text-zinc-500">support@prspct.demo</p>
              <a className="mt-4 inline-flex h-10 items-center rounded-lg border border-zinc-200 px-4 text-sm" href="mailto:support@prspct.demo">Email support</a>
            </Card>
            <Card>
              <h2 className="font-semibold">Schedule onboarding</h2>
              <p className="mt-2 text-sm text-zinc-500">Book a guided setup walkthrough for your team.</p>
              <Button type="button" className="mt-4" variant="outline" onClick={() => toast.success("Demo onboarding request created")}>Schedule</Button>
            </Card>
          </div>
          <Card>
            <h2 className="font-semibold">FAQ</h2>
            <div className="mt-4 space-y-2">
              {faqs.map((faq) => (
                <div key={faq.question} className="rounded-xl border border-zinc-100">
                  <button
                    type="button"
                    className="flex w-full items-center justify-between p-4 text-left font-medium"
                    onClick={() => setOpenFaq((current) => current === faq.question ? "" : faq.question)}
                  >
                    {faq.question}
                    <span>{openFaq === faq.question ? "-" : "+"}</span>
                  </button>
                  {openFaq === faq.question ? <p className="px-4 pb-4 text-sm text-zinc-500">{faq.answer}</p> : null}
                </div>
              ))}
            </div>
          </Card>
        </div>
        <Card className="h-fit">
          <h2 className="font-semibold">Create support ticket</h2>
          <form className="mt-4 space-y-3" onSubmit={submitTicket}>
            <Input required placeholder="Subject" value={form.subject} onChange={(event) => setForm({ ...form, subject: event.target.value })} />
            <Select value={form.category} onChange={(event) => setForm({ ...form, category: event.target.value })}>
              <option>Question</option>
              <option>Bug</option>
              <option>Billing</option>
              <option>Onboarding</option>
            </Select>
            <textarea
              required
              className="min-h-32 w-full rounded-xl border border-zinc-200 p-3 text-sm outline-none focus:ring-2 focus:ring-zinc-100"
              placeholder="Tell us what you need..."
              value={form.body}
              onChange={(event) => setForm({ ...form, body: event.target.value })}
            />
            <Button type="submit" className="w-full">Submit ticket</Button>
          </form>
        </Card>
      </div>
    </>
  );
}
