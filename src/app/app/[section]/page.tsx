import { Bot, CreditCard, Inbox, Plug, Settings, Users, Workflow } from "lucide-react";
import type * as React from "react";
import { EmptyState } from "@/components/ui/empty-state";
import { PageHeader } from "@/components/ui/page-header";

const sectionConfig: Record<string, { title: string; description: string; icon: React.ReactNode }> = {
  inbox: {
    title: "Inbox",
    description: "Centralize inbound replies, mentions, and follow-up alerts.",
    icon: <Inbox className="h-6 w-6" />,
  },
  "ai-assistant": {
    title: "AI Assistant",
    description: "Draft outreach, summarize account context, and prioritize prospecting work.",
    icon: <Bot className="h-6 w-6" />,
  },
  automations: {
    title: "Automations",
    description: "Build repeatable sales motions for enrichment, tasks, and alerts.",
    icon: <Workflow className="h-6 w-6" />,
  },
  integrations: {
    title: "Integrations",
    description: "Connect PRSPCT with CRM, email, calendar, data, and billing systems.",
    icon: <Plug className="h-6 w-6" />,
  },
  team: {
    title: "Team",
    description: "Manage seats, roles, and workspace collaboration.",
    icon: <Users className="h-6 w-6" />,
  },
  settings: {
    title: "Settings",
    description: "Configure your profile, workspace defaults, and notification preferences.",
    icon: <Settings className="h-6 w-6" />,
  },
  billing: {
    title: "Billing",
    description: "Review plan limits, usage, invoices, and subscription controls.",
    icon: <CreditCard className="h-6 w-6" />,
  },
};

export default async function AppSectionPage({ params }: { params: Promise<{ section: string }> }) {
  const { section } = await params;
  const config = sectionConfig[section] ?? {
    title: section
      .split("-")
      .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
      .join(" "),
    description: "This PRSPCT workspace area is ready for your next workflow.",
    icon: <Settings className="h-6 w-6" />,
  };

  return (
    <div className="space-y-6">
      <PageHeader title={config.title} description={config.description} />
      <EmptyState
        icon={config.icon}
        title={`${config.title} is ready`}
        description="This route is connected to the authenticated app shell and demo navigation."
      />
    </div>
  );
}
